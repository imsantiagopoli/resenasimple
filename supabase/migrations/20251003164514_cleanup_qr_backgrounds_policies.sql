/*
  # Cleanup QR Backgrounds Policies

  1. Changes
    - Remove duplicate policies
    - Simplify INSERT policy to allow all authenticated users
    
  2. Security
    - Public can read all backgrounds
    - Authenticated users can upload backgrounds
    - Users can delete only their own backgrounds
*/

-- Drop duplicate/conflicting policies
DROP POLICY IF EXISTS "Authenticated users can upload qr-backgrounds" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to qr-backgrounds" ON storage.objects;

-- Keep simplified policies
-- The remaining policies are:
-- 1. "Public read access for qr backgrounds" - allows public read
-- 2. "Authenticated users can upload qr backgrounds" - allows authenticated upload with user folder structure
-- 3. "Users can delete own qr backgrounds" - allows users to delete their own files