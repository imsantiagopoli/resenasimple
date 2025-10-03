/*
  # Create User QR Backgrounds Table

  1. New Tables
    - `user_qr_backgrounds`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `business_id` (uuid, foreign key to business_profiles)
      - `name` (text) - Display name for the background
      - `image_url` (text) - Public URL from the qr-backgrounds bucket
      - `file_size` (integer) - Size in bytes
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on table
    - Users can only SELECT/INSERT/DELETE their own backgrounds
    - Users cannot UPDATE backgrounds (delete and re-upload instead)
  
  3. Storage
    - User backgrounds are stored in the existing qr-backgrounds bucket
    - File path: {user_id}/{business_id}/{filename}
*/

-- Create the table
CREATE TABLE IF NOT EXISTS user_qr_backgrounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  image_url text NOT NULL,
  file_size integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_qr_backgrounds ENABLE ROW LEVEL SECURITY;

-- Users can view their own backgrounds
CREATE POLICY "Users can view own backgrounds"
  ON user_qr_backgrounds
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own backgrounds
CREATE POLICY "Users can upload own backgrounds"
  ON user_qr_backgrounds
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own backgrounds
CREATE POLICY "Users can delete own backgrounds"
  ON user_qr_backgrounds
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_qr_backgrounds_user ON user_qr_backgrounds(user_id);
CREATE INDEX IF NOT EXISTS idx_user_qr_backgrounds_business ON user_qr_backgrounds(business_id);

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can upload own backgrounds to storage" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own backgrounds from storage" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add storage policy for user backgrounds in qr-backgrounds bucket
-- Users can upload to their own folder
CREATE POLICY "Users can upload own backgrounds to storage"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'qr-backgrounds' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own backgrounds from storage
CREATE POLICY "Users can delete own backgrounds from storage"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'qr-backgrounds' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );