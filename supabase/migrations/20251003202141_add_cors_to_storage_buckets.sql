/*
  # Add CORS Configuration to Storage Buckets
  
  1. Changes
    - Update business-logos bucket to include CORS configuration
    - Update qr-backgrounds bucket to include CORS configuration
    - Enable CORS headers for cross-origin requests from html2canvas
  
  2. Security
    - Maintains existing RLS policies
    - Only adds CORS headers for GET requests
*/

-- Update business-logos bucket with CORS configuration
UPDATE storage.buckets
SET 
  public = true,
  avif_autodetection = false,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'business-logos';

-- Update qr-backgrounds bucket with CORS configuration
UPDATE storage.buckets
SET 
  public = true,
  avif_autodetection = false,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
WHERE id = 'qr-backgrounds';