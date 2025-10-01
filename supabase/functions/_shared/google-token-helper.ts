import { createClient } from "npm:@supabase/supabase-js@2";

export async function getValidGoogleToken(userId: string): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: businessData } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!businessData) {
    throw new Error("Business profile not found");
  }

  const { data: tokenData } = await supabase
    .from("google_oauth_tokens")
    .select("*")
    .eq("business_id", businessData.id)
    .maybeSingle();

  if (!tokenData) {
    throw new Error("No Google tokens found");
  }

  const tokenExpiry = new Date(tokenData.token_expiry);
  const now = new Date();
  const minutesUntilExpiry = (tokenExpiry.getTime() - now.getTime()) / 1000 / 60;

  if (minutesUntilExpiry > 5) {
    return tokenData.access_token;
  }

  if (!tokenData.refresh_token) {
    throw new Error("Token expired and no refresh token available");
  }

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured");
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
    throw new Error("Failed to refresh token");
  }

  const tokens = await tokenResponse.json();

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);

  await supabase
    .from("google_oauth_tokens")
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || tokenData.refresh_token,
      token_expiry: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessData.id);

  return tokens.access_token;
}
