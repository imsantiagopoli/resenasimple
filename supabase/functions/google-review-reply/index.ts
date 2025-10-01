import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function refreshTokenIfNeeded(supabase: any, userId: string, businessId: string) {
  const { data: tokenData } = await supabase
    .from("google_oauth_tokens")
    .select("*")
    .eq("user_id", userId)
    .eq("business_id", businessId)
    .single();

  if (!tokenData) {
    throw new Error("No Google OAuth token found");
  }

  const expiryDate = new Date(tokenData.token_expiry);
  const now = new Date();
  const bufferMinutes = 5;

  if (expiryDate.getTime() - now.getTime() > bufferMinutes * 60 * 1000) {
    return tokenData.access_token;
  }

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

  const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: tokenData.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!refreshResponse.ok) {
    throw new Error("Failed to refresh access token");
  }

  const newTokens = await refreshResponse.json();
  const newExpiresAt = new Date();
  newExpiresAt.setSeconds(newExpiresAt.getSeconds() + newTokens.expires_in);

  await supabase
    .from("google_oauth_tokens")
    .update({
      access_token: newTokens.access_token,
      token_expiry: newExpiresAt.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userId)
    .eq("business_id", businessId);

  return newTokens.access_token;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { review_id, reply_text } = await req.json();

    if (!review_id || !reply_text) {
      return new Response(
        JSON.stringify({ error: "review_id and reply_text are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: reviewData } = await supabase
      .from("google_reviews")
      .select(`
        *,
        google_locations!inner(
          google_location_id,
          user_id,
          business_id
        )
      `)
      .eq("id", review_id)
      .single();

    if (!reviewData) {
      return new Response(
        JSON.stringify({ error: "Review not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userId = reviewData.google_locations.user_id;
    const businessId = reviewData.google_locations.business_id;
    const googleLocationId = reviewData.google_locations.google_location_id;

    const accessToken = await refreshTokenIfNeeded(supabase, userId, businessId);

    const accountName = `accounts/${googleLocationId.split("/")[0]}`;
    const replyUrl = `https://mybusiness.googleapis.com/v4/${accountName}/locations/${googleLocationId}/reviews/${reviewData.google_review_id}/reply`;

    const replyResponse = await fetch(replyUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: reply_text
      }),
    });

    if (!replyResponse.ok) {
      const error = await replyResponse.text();
      console.error("Reply API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to post reply to Google" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    await supabase
      .from("google_reviews")
      .update({
        review_reply: reply_text,
        review_reply_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", review_id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Reply posted successfully"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in google-review-reply:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});