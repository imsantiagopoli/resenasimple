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
        JSON.stringify({ error: "Failed to fetch Google accounts" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const accountsData = await accountsResponse.json();
    const accounts = accountsData.accounts || [];

    const allLocations = [];

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
          const address = location.storefrontAddress
            ? `${location.storefrontAddress.addressLines?.join(", ") || ""}, ${location.storefrontAddress.locality || ""}`
            : "";

          await supabase
            .from("google_locations")
            .upsert({
              user_id,
              business_id: businessData.id,
              google_location_id: locationId,
              location_name: location.title || "Unknown Location",
              location_address: address,
              is_active: true,
              updated_at: new Date().toISOString()
            }, {
              onConflict: "google_location_id"
            });

          allLocations.push({
            id: locationId,
            name: location.title,
            address
          });
        }
      }
    }

    await supabase
      .from("google_sync_log")
      .insert({
        user_id,
        sync_type: "locations",
        status: "success",
        locations_synced: allLocations.length,
        created_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        locations: allLocations,
        count: allLocations.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in google-locations-sync:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});