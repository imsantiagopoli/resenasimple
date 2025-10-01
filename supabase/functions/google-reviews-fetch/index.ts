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

    let accessToken;
    try {
      accessToken = await refreshTokenIfNeeded(supabase, user_id, businessData.id);
    } catch (error) {
      console.log("No OAuth token found:", error.message);
      return new Response(
        JSON.stringify({
          success: true,
          reviews: [],
          count: 0,
          message: "No Google My Business connection found"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const accountsResponse = await fetch(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!accountsResponse.ok) {
      const error = await accountsResponse.text();
      console.error("Accounts API error:", error);
      return new Response(
        JSON.stringify({
          success: true,
          reviews: [],
          count: 0,
          message: "No Google My Business accounts found"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const accountsData = await accountsResponse.json();
    const accounts = accountsData.accounts || [];

    if (accounts.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          reviews: [],
          count: 0,
          message: "No Google My Business accounts found"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const allReviews: any[] = [];

    for (const account of accounts) {
      const locationsResponse = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storefrontAddress`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        const locations = locationsData.locations || [];

        for (const location of locations) {
          const locationId = location.name.split("/").pop();
          const reviewsUrl = `https://mybusiness.googleapis.com/v4/${location.name}/reviews`;

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
              const address = location.storefrontAddress
                ? `${location.storefrontAddress.addressLines?.join(", ") || ""}, ${location.storefrontAddress.locality || ""}`
                : "";

              allReviews.push({
                id: reviewId,
                google_location_id: locationId,
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
                location_name: location.title || "Unknown Location",
                location_address: address,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            }
          }
        }
      }
    }

    allReviews.sort((a, b) => {
      const dateA = new Date(a.review_created_at).getTime();
      const dateB = new Date(b.review_created_at).getTime();
      return dateB - dateA;
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        reviews: allReviews,
        count: allReviews.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in google-reviews-fetch:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});