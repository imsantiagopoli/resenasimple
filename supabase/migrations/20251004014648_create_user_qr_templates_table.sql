/*
  # Create User QR Templates Table

  1. New Tables
    - `user_qr_templates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `business_id` (uuid, foreign key to business_profiles)
      - `name` (text) - User-defined name for the template
      - `description` (text, optional) - User description
      - All QR configuration fields (same as qr_configuration table)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_qr_templates` table
    - Users can only read their own templates
    - Users can only insert their own templates
    - Users can only update their own templates
    - Users can only delete their own templates

  3. Indexes
    - Index on user_id for fast lookups
    - Index on business_id for filtering by business
    - Index on created_at for sorting
*/

-- Create user QR templates table
CREATE TABLE IF NOT EXISTS user_qr_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,

  -- QR Configuration fields (matching qr_configuration)
  qr_size integer DEFAULT 300,
  qr_foreground_color text DEFAULT '#000000',
  qr_background_color text DEFAULT '#FFFFFF',
  qr_error_correction_level text DEFAULT 'M',
  qr_margin integer DEFAULT 4,

  -- Design fields
  show_frame boolean DEFAULT false,
  frame_color text DEFAULT '#000000',
  frame_thickness integer DEFAULT 2,
  show_logo boolean DEFAULT false,
  logo_shape text DEFAULT 'circular',

  -- Content fields
  show_title boolean DEFAULT true,
  title text DEFAULT '¡Déjanos tu opinión!',
  show_subtitle boolean DEFAULT true,
  subtitle text DEFAULT 'Escanea el código QR',
  show_call_to_action boolean DEFAULT true,
  call_to_action text DEFAULT 'Tu opinión es importante',
  show_phone boolean DEFAULT false,
  show_email boolean DEFAULT false,

  -- Typography fields
  tipografia_principal text DEFAULT 'Inter',
  color_tipografia_principal text DEFAULT '#000000',
  tamano_tipografia_principal integer DEFAULT 16,
  tipografia_secundaria text DEFAULT 'Inter',
  color_tipografia_secundaria text DEFAULT '#666666',
  tamano_tipografia_secundaria integer DEFAULT 14,
  tamano_titulo integer DEFAULT 24,
  tamano_subtitulo integer DEFAULT 16,
  tamano_cta integer DEFAULT 14,

  -- Print fields
  print_format text DEFAULT 'A4',
  print_orientation text DEFAULT 'portrait',
  qrs_per_page integer DEFAULT 1,
  include_instructions boolean DEFAULT true,

  -- Background fields
  background_type text DEFAULT 'solid',
  background_color text DEFAULT '#FFFFFF',
  background_gradient_start text,
  background_gradient_end text,
  background_gradient_direction text DEFAULT 'to-b',
  background_image_url text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE user_qr_templates
ADD CONSTRAINT user_qr_templates_qr_size_check
CHECK (qr_size >= 100 AND qr_size <= 600);

ALTER TABLE user_qr_templates
ADD CONSTRAINT user_qr_templates_qr_margin_check
CHECK (qr_margin >= 0 AND qr_margin <= 20);

ALTER TABLE user_qr_templates
ADD CONSTRAINT user_qr_templates_error_correction_check
CHECK (qr_error_correction_level IN ('L', 'M', 'Q', 'H'));

ALTER TABLE user_qr_templates
ADD CONSTRAINT user_qr_templates_logo_shape_check
CHECK (logo_shape IN ('circular', 'square'));

ALTER TABLE user_qr_templates
ADD CONSTRAINT user_qr_templates_print_format_check
CHECK (print_format IN ('A4', 'Letter', 'Custom'));

ALTER TABLE user_qr_templates
ADD CONSTRAINT user_qr_templates_print_orientation_check
CHECK (print_orientation IN ('portrait', 'landscape'));

ALTER TABLE user_qr_templates
ADD CONSTRAINT user_qr_templates_frame_thickness_check
CHECK (frame_thickness IS NULL OR (frame_thickness >= 1 AND frame_thickness <= 20));

ALTER TABLE user_qr_templates
ADD CONSTRAINT user_qr_templates_qrs_per_page_check
CHECK (qrs_per_page >= 1 AND qrs_per_page <= 12);

ALTER TABLE user_qr_templates
ADD CONSTRAINT user_qr_templates_background_type_check
CHECK (background_type IN ('solid', 'gradient', 'image'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_qr_templates_user_id
ON user_qr_templates(user_id);

CREATE INDEX IF NOT EXISTS idx_user_qr_templates_business_id
ON user_qr_templates(business_id);

CREATE INDEX IF NOT EXISTS idx_user_qr_templates_created_at
ON user_qr_templates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_qr_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own templates"
  ON user_qr_templates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates"
  ON user_qr_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON user_qr_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON user_qr_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_qr_templates_updated_at
  BEFORE UPDATE ON user_qr_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
