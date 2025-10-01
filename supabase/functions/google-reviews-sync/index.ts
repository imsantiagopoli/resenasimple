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

    const accessToken = await refreshTokenIfNeeded(supabase, user_id, businessData.id);

    const { data: locations } = await supabase
      .from("google_locations")
      .select("*")
      .eq("user_id", user_id)
      .eq("is_active", true);

    if (!locations || locations.length === 0) {
      return new Response(
        JSON.stringify({ error: "No active Google locations found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let totalReviewsSynced = 0;

    for (const location of locations) {
      const accountName = `accounts/${location.google_location_id.split("/")[0]}`;
      const reviewsUrl = `https://mybusiness.googleapis.com/v4/${accountName}/locations/${location.google_location_id}/reviews`;

      const reviewsResponse = await fetch(reviewsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        const reviews = reviewsData.reviews || [];

        for (const review of reviews) {
          const reviewId = review.reviewId || review.name?.split("/").pop();

          await supabase
            .from("google_reviews")
            .upsert({
              user_id,
              google_location_id: location.id,
              google_review_id: reviewId,
              reviewer_name: review.reviewer?.displayName || "Usuario de Google",
              reviewer_profile_photo_url: review.reviewer?.profilePhotoUrl || null,
              rating: review.starRating === "FIVE" ? 5 :
                      review.starRating === "FOUR" ? 4 :
                      review.starRating === "THREE" ? 3 :
                      review.starRating === "TWO" ? 2 : 1,
              comment: review.comment || null,
              review_reply: review.reviewReply?.comment || null,
              review_reply_updated_at: review.reviewReply?.updateTime || null,
              review_created_at: review.createTime,
              last_synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: "google_review_id"
            });

          totalReviewsSynced++;
        }
      }
    }

    await supabase
      .from("google_sync_log")
      .insert({
        user_id,
        sync_type: "reviews",
        status: "success",
        reviews_synced: totalReviewsSynced,
        created_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        reviews_synced: totalReviewsSynced
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in google-reviews-sync:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});