/*
  # Restructurar redes sociales como columnas en business_profiles

  1. Cambios en Schema
     - Agregar columnas de redes sociales a `business_profiles`
     - Eliminar tabla `business_social_media`
  
  2. Nuevas Columnas
     - `facebook_url` (text)
     - `instagram_url` (text)
     - `tiktok_url` (text)
     - `linkedin_url` (text)
     - `twitter_url` (text)
     - `youtube_url` (text)
     - `website_url` (text)

  3. Security
     - Las columnas heredan las políticas RLS existentes de business_profiles
*/

-- Add social media columns to business_profiles
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS facebook_url text;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS instagram_url text;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS tiktok_url text;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS twitter_url text;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS youtube_url text;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS website_url text;

-- Drop the business_social_media table if it exists
DROP TABLE IF EXISTS business_social_media CASCADE;