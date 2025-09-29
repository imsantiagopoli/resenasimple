/*
  # Create QR Configuration Table

  1. New Tables
    - `qr_configuration`
      - `id` (uuid, primary key)
      - `business_id` (uuid, foreign key to business_profiles)
      - `qr_size` (integer, default 200)
      - `qr_foreground_color` (text, default '#000000')
      - `qr_background_color` (text, default '#FFFFFF')
      - `qr_error_correction_level` (text, default 'M')
      - `qr_margin` (integer, default 4)
      - `show_frame` (boolean, default false)
      - `frame_color` (text, default '#000000')
      - `frame_thickness` (integer, default 2)
      - `show_title` (boolean, default true)
      - `title` (text, default '¡Déjanos tu opinión!')
      - `show_subtitle` (boolean, default true)
      - `subtitle` (text, default 'Escanea el código QR para acceder')
      - `show_call_to_action` (boolean, default true)
      - `call_to_action` (text, default '¡Ayúdanos a mejorar!')
      - `print_format` (text, default 'A4')
      - `print_orientation` (text, default 'portrait')
      - `qrs_per_page` (integer, default 1)
      - `include_instructions` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `qr_configuration` table
    - Add policies for business owners to manage their QR configurations
    - Add policy for anonymous users to read QR configurations

  3. Constraints
    - Unique constraint on business_id
    - Check constraints for QR size, margin, and error correction level
    - Foreign key constraint to business_profiles
*/

-- Create QR configuration table
CREATE TABLE IF NOT EXISTS qr_configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  qr_size integer DEFAULT 200,
  qr_foreground_color text DEFAULT '#000000',
  qr_background_color text DEFAULT '#FFFFFF', 
  qr_error_correction_level text DEFAULT 'M',
  qr_margin integer DEFAULT 4,
  show_frame boolean DEFAULT false,
  frame_color text DEFAULT '#000000',
  frame_thickness integer DEFAULT 2,
  show_title boolean DEFAULT true,
  title text DEFAULT '¡Déjanos tu opinión!',
  show_subtitle boolean DEFAULT true,
  subtitle text DEFAULT 'Escanea el código QR para acceder',
  show_call_to_action boolean DEFAULT true,
  call_to_action text DEFAULT '¡Ayúdanos a mejorar!',
  print_format text DEFAULT 'A4',
  print_orientation text DEFAULT 'portrait',
  qrs_per_page integer DEFAULT 1,
  include_instructions boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE qr_configuration
ADD CONSTRAINT qr_configuration_business_id_unique UNIQUE (business_id);

ALTER TABLE qr_configuration
ADD CONSTRAINT qr_configuration_qr_size_check 
CHECK (qr_size >= 100 AND qr_size <= 600);

ALTER TABLE qr_configuration
ADD CONSTRAINT qr_configuration_qr_margin_check 
CHECK (qr_margin >= 0 AND qr_margin <= 20);

ALTER TABLE qr_configuration
ADD CONSTRAINT qr_configuration_error_correction_check 
CHECK (qr_error_correction_level IN ('L', 'M', 'Q', 'H'));

ALTER TABLE qr_configuration
ADD CONSTRAINT qr_configuration_print_format_check 
CHECK (print_format IN ('A4', 'Letter', 'Custom'));

ALTER TABLE qr_configuration
ADD CONSTRAINT qr_configuration_print_orientation_check 
CHECK (print_orientation IN ('portrait', 'landscape'));

ALTER TABLE qr_configuration
ADD CONSTRAINT qr_configuration_frame_thickness_check 
CHECK (frame_thickness >= 1 AND frame_thickness <= 20);

ALTER TABLE qr_configuration
ADD CONSTRAINT qr_configuration_qrs_per_page_check 
CHECK (qrs_per_page >= 1 AND qrs_per_page <= 12);

-- Add foreign key constraint
ALTER TABLE qr_configuration
ADD CONSTRAINT qr_configuration_business_id_fkey 
FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_qr_configuration_business_id 
ON qr_configuration(business_id);

CREATE INDEX IF NOT EXISTS idx_qr_configuration_created_at 
ON qr_configuration(created_at);

-- Enable Row Level Security
ALTER TABLE qr_configuration ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Business owners can read their QR configurations"
  ON qr_configuration
  FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ));

CREATE POLICY "Business owners can insert their QR configurations"
  ON qr_configuration
  FOR INSERT
  TO authenticated
  WITH CHECK (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ));

CREATE POLICY "Business owners can update their QR configurations"
  ON qr_configuration
  FOR UPDATE
  TO authenticated
  USING (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ))
  WITH CHECK (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ));

CREATE POLICY "Business owners can delete their QR configurations"
  ON qr_configuration
  FOR DELETE
  TO authenticated
  USING (business_id IN (
    SELECT bp.id
    FROM business_profiles bp
    WHERE bp.user_id = auth.uid()
  ));

-- Anonymous users can read QR configurations (needed for voting page)
CREATE POLICY "Anonymous users can read QR configurations"
  ON qr_configuration
  FOR SELECT
  TO anon
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_qr_configuration_updated_at
  BEFORE UPDATE ON qr_configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();