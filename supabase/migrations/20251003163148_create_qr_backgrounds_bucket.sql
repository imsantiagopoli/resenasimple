/*
  # Create QR Backgrounds Storage Bucket
  
  1. Storage
    - Create `qr-backgrounds` bucket for storing background images
    - Set bucket to public for easy access
    - Add policies for public read access
  
  2. Security
    - Public read access for all users
    - Only authenticated users can upload (admin only)
*/

-- Create the qr-backgrounds bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'qr-backgrounds',
  'qr-backgrounds',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access to qr-backgrounds" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload qr-backgrounds" ON storage.objects;

-- Allow public read access to qr-backgrounds
CREATE POLICY "Public read access to qr-backgrounds"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'qr-backgrounds');

-- Allow authenticated users to upload to qr-backgrounds (for admins)
CREATE POLICY "Authenticated users can upload qr-backgrounds"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'qr-backgrounds');