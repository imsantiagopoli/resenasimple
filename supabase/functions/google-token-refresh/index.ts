import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: businessData } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("user_id", user_id)
      .single();

    if (!businessData) {
      return new Response(
        JSON.stringify({ error: "Business profile not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: tokenData } = await supabase
      .from("google_oauth_tokens")
      .select("*")
      .eq("business_id", businessData.id)
      .maybeSingle();

    if (!tokenData) {
      return new Response(
        JSON.stringify({ error: "No tokens found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!tokenData.refresh_token) {
      return new Response(
        JSON.stringify({ error: "No refresh token available" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const tokenExpiry = new Date(tokenData.token_expiry);
    const now = new Date();
    const minutesUntilExpiry = (tokenExpiry.getTime() - now.getTime()) / 1000 / 60;

    if (minutesUntilExpiry > 5) {
      return new Response(
        JSON.stringify({ 
          message: "Token still valid",
          expires_in_minutes: Math.floor(minutesUntilExpiry)
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "Google OAuth is not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: tokenData.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token refresh error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to refresh token" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const tokens = await tokenResponse.json();

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);

    const { error: updateError } = await supabase
      .from("google_oauth_tokens")
      .update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || tokenData.refresh_token,
        token_expiry: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("business_id", businessData.id);

    if (updateError) {
      console.error("Database error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update tokens" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Token refreshed successfully",
        expires_at: expiresAt.toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in google-token-refresh:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});