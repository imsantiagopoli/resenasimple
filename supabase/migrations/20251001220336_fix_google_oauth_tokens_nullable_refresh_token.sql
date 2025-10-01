/*
  # Fix Google OAuth Tokens - Make refresh_token nullable
  
  1. Changes
    - Make `refresh_token` column nullable in `google_oauth_tokens` table
    - Google only returns refresh_token on first authorization or when prompt=consent
    - Subsequent authorizations may not include refresh_token
  
  2. Notes
    - This allows the app to update access_token without requiring refresh_token
    - The app should handle cases where refresh_token is null
*/

-- Make refresh_token nullable
ALTER TABLE google_oauth_tokens 
ALTER COLUMN refresh_token DROP NOT NULL;
