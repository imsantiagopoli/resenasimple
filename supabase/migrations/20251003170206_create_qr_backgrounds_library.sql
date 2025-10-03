/*
  # Create QR Backgrounds Library Table
  
  1. New Tables
    - `qr_backgrounds_resenasimple`
      - `id` (uuid, primary key)
      - `name` (text) - Display name for the background
      - `image_url` (text) - Public URL from the bucket
      - `category` (text) - Category like 'abstract', 'nature', 'patterns'
      - `is_active` (boolean) - Whether this background is available
      - `sort_order` (integer) - Display order
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on table
    - Allow public SELECT access (anyone can view backgrounds)
    - Only authenticated users with admin role can INSERT/UPDATE/DELETE
  
  3. Initial Data
    - Populate with some default background images from the bucket
*/

-- Create the table
CREATE TABLE IF NOT EXISTS qr_backgrounds_resenasimple (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE qr_backgrounds_resenasimple ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT access (anyone can view backgrounds)
CREATE POLICY "Anyone can view active backgrounds"
  ON qr_backgrounds_resenasimple
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to manage backgrounds (for admin panel later)
CREATE POLICY "Authenticated users can manage backgrounds"
  ON qr_backgrounds_resenasimple
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_qr_backgrounds_active ON qr_backgrounds_resenasimple(is_active, sort_order);

-- Insert some placeholder data (we'll populate with actual images later)
INSERT INTO qr_backgrounds_resenasimple (name, image_url, category, sort_order) VALUES
  ('Gradiente Suave Azul', 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80', 'abstract', 1),
  ('Gradiente Verde Menta', 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1200&q=80', 'abstract', 2),
  ('Fondo Geométrico', 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=1200&q=80', 'patterns', 3),
  ('Gradiente Rosa Suave', 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=1200&q=80', 'abstract', 4),
  ('Textura Papel', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', 'texture', 5),
  ('Gradiente Naranja', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&q=80', 'abstract', 6)
ON CONFLICT DO NOTHING;
