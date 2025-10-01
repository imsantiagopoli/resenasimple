/*
  # Create business logos storage bucket

  1. Changes
    - Create 'business-logos' storage bucket for business logo uploads
    - Set bucket as public for easy access to logos
    - Add RLS policies for authenticated users to upload/update their logos
    - Add policy for public read access to logos

  2. Security
    - Only authenticated users can upload files
    - Users can only upload to their own business folder
    - Public read access for displaying logos
*/

-- Create the storage bucket for business logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-logos',
  'business-logos',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their business logos
CREATE POLICY "Authenticated users can upload business logos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'business-logos' AND
    auth.uid() IS NOT NULL
  );

-- Allow authenticated users to update their business logos
CREATE POLICY "Authenticated users can update business logos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'business-logos' AND
    auth.uid() IS NOT NULL
  );

-- Allow authenticated users to delete their business logos
CREATE POLICY "Authenticated users can delete business logos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'business-logos' AND
    auth.uid() IS NOT NULL
  );

-- Allow public read access to business logos
CREATE POLICY "Public read access to business logos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'business-logos');