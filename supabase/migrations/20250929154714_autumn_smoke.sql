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
      - `frame_color` (text, default '#075E54')
      - `frame_thickness` (integer, default 4)
      - `show_title` (boolean, default true)
      - `title` (text, default '¿Cómo fue tu experiencia?')
      - `show_subtitle` (boolean, default true)
      - `subtitle` (text, default 'Escanea el código QR y comparte tu opinión')
      - `show_call_to_action` (boolean, default true)
      - `call_to_action` (text, default 'Escanear para votar')
      - `print_format` (text, default 'A4')
      - `print_orientation` (text, default 'portrait')
      - `qrs_per_page` (integer, default 1)
      - `include_instructions` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `qr_configuration` table
    - Add policies for business owners to manage their QR configurations

  3. Constraints
    - Check constraints for valid enum values
    - Unique constraint on business_id
*/

CREATE TABLE IF NOT EXISTS qr_configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  qr_size integer DEFAULT 200,
  qr_foreground_color text DEFAULT '#000000',
  qr_background_color text DEFAULT '#FFFFFF',
  qr_error_correction_level text DEFAULT 'M',
  qr_margin integer DEFAULT 4,
  show_frame boolean DEFAULT false,
  frame_color text DEFAULT '#075E54',
  frame_thickness integer DEFAULT 4,
  show_title boolean DEFAULT true,
  title text DEFAULT '¿Cómo fue tu experiencia?',
  show_subtitle boolean DEFAULT true,
  subtitle text DEFAULT 'Escanea el código QR y comparte tu opinión',
  show_call_to_action boolean DEFAULT true,
  call_to_action text DEFAULT 'Escanear para votar',
  print_format text DEFAULT 'A4',
  print_orientation text DEFAULT 'portrait',
  qrs_per_page integer DEFAULT 1,
  include_instructions boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE qr_configuration ADD CONSTRAINT qr_configuration_error_correction_level_check 
  CHECK (qr_error_correction_level IN ('L', 'M', 'Q', 'H'));

ALTER TABLE qr_configuration ADD CONSTRAINT qr_configuration_print_format_check 
  CHECK (print_format IN ('A4', 'Letter', 'Custom'));

ALTER TABLE qr_configuration ADD CONSTRAINT qr_configuration_print_orientation_check 
  CHECK (print_orientation IN ('portrait', 'landscape'));

ALTER TABLE qr_configuration ADD CONSTRAINT qr_configuration_qr_size_check 
  CHECK (qr_size >= 100 AND qr_size <= 400);

ALTER TABLE qr_configuration ADD CONSTRAINT qr_configuration_frame_thickness_check 
  CHECK (frame_thickness >= 1 AND frame_thickness <= 20);

-- Create unique index on business_id
CREATE UNIQUE INDEX idx_qr_configuration_business_id ON qr_configuration(business_id);

-- Enable RLS
ALTER TABLE qr_configuration ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Business owners can read their QR configurations"
  ON qr_configuration
  FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT bp.id FROM business_profiles bp WHERE bp.user_id = uid()
  ));

CREATE POLICY "Business owners can insert their QR configurations"
  ON qr_configuration
  FOR INSERT
  TO authenticated
  WITH CHECK (business_id IN (
    SELECT bp.id FROM business_profiles bp WHERE bp.user_id = uid()
  ));

CREATE POLICY "Business owners can update their QR configurations"
  ON qr_configuration
  FOR UPDATE
  TO authenticated
  USING (business_id IN (
    SELECT bp.id FROM business_profiles bp WHERE bp.user_id = uid()
  ))
  WITH CHECK (business_id IN (
    SELECT bp.id FROM business_profiles bp WHERE bp.user_id = uid()
  ));

CREATE POLICY "Business owners can delete their QR configurations"
  ON qr_configuration
  FOR DELETE
  TO authenticated
  USING (business_id IN (
    SELECT bp.id FROM business_profiles bp WHERE bp.user_id = uid()
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_qr_configuration_updated_at
  BEFORE UPDATE ON qr_configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();