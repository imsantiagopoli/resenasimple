/*
  # Recreate QR Templates Table with Correct Structure

  1. Changes
    - Drop existing qr_templates table
    - Create new qr_templates table with same structure as qr_configuration
    - Add is_system and name/description fields for template metadata
    - No business_id foreign key (templates are system-wide)
  
  2. New Tables
    - `qr_templates`
      - Same fields as qr_configuration
      - Additional fields: name, description, is_system
      - No business_id constraint (templates are not business-specific)
  
  3. Security
    - Enable RLS on `qr_templates` table
    - Add policy for all users to read system templates
  
  4. Initial Data
    - Insert 6 default system templates with exact field structure
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS qr_templates;

-- Create QR templates table with same structure as qr_configuration
CREATE TABLE qr_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  is_system boolean DEFAULT true,
  qr_size integer DEFAULT 200,
  qr_foreground_color text DEFAULT '#000000',
  qr_background_color text DEFAULT '#FFFFFF',
  qr_error_correction_level text DEFAULT 'M',
  qr_margin integer DEFAULT 4,
  show_frame boolean DEFAULT false,
  frame_color text DEFAULT '#000000',
  frame_thickness integer,
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

-- Add same constraints as qr_configuration
ALTER TABLE qr_templates
ADD CONSTRAINT qr_templates_qr_size_check 
CHECK (qr_size >= 100 AND qr_size <= 600);

ALTER TABLE qr_templates
ADD CONSTRAINT qr_templates_qr_margin_check 
CHECK (qr_margin >= 0 AND qr_margin <= 20);

ALTER TABLE qr_templates
ADD CONSTRAINT qr_templates_error_correction_check 
CHECK (qr_error_correction_level IN ('L', 'M', 'Q', 'H'));

ALTER TABLE qr_templates
ADD CONSTRAINT qr_templates_print_format_check 
CHECK (print_format IN ('A4', 'Letter', 'Custom'));

ALTER TABLE qr_templates
ADD CONSTRAINT qr_templates_print_orientation_check 
CHECK (print_orientation IN ('portrait', 'landscape'));

ALTER TABLE qr_templates
ADD CONSTRAINT qr_templates_frame_thickness_check 
CHECK (frame_thickness IS NULL OR (frame_thickness >= 1 AND frame_thickness <= 20));

ALTER TABLE qr_templates
ADD CONSTRAINT qr_templates_qrs_per_page_check 
CHECK (qrs_per_page >= 1 AND qrs_per_page <= 12);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_qr_templates_is_system 
ON qr_templates(is_system);

CREATE INDEX IF NOT EXISTS idx_qr_templates_created_at 
ON qr_templates(created_at);

-- Enable Row Level Security
ALTER TABLE qr_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Anyone can read system templates"
  ON qr_templates
  FOR SELECT
  USING (is_system = true);

-- Insert default system templates
INSERT INTO qr_templates (
  name, description, is_system,
  qr_size, qr_foreground_color, qr_background_color, qr_error_correction_level, qr_margin,
  show_frame, frame_color, frame_thickness,
  show_title, title, show_subtitle, subtitle, show_call_to_action, call_to_action,
  print_format, print_orientation, qrs_per_page, include_instructions
) VALUES
(
  'Clásico',
  'Diseño tradicional en blanco y negro, ideal para cualquier ocasión',
  true,
  300, '#000000', '#FFFFFF', 'M', 4,
  true, '#000000', 2,
  true, '¡Déjanos tu opinión!', true, 'Escanea el código QR', true, 'Tu opinión es importante',
  'A4', 'portrait', 1, true
),
(
  'Moderno',
  'Estilo contemporáneo con verde WhatsApp y tipografía elegante',
  true,
  350, '#075E54', '#FFFFFF', 'H', 6,
  true, '#075E54', 3,
  true, 'Comparte tu experiencia', true, 'Nos encantaría conocer tu opinión', true, '¡Ayúdanos a mejorar!',
  'A4', 'portrait', 1, true
),
(
  'Elegante',
  'Diseño sofisticado con tipografía serif y marco delicado',
  true,
  320, '#1a1a1a', '#FFFFFF', 'Q', 8,
  true, '#1a1a1a', 1,
  true, 'Tu opinión nos importa', true, 'Escanea para compartir tu experiencia', true, 'Comparte tu valoración',
  'A4', 'portrait', 1, true
),
(
  'Minimalista',
  'Diseño limpio y simple sin distracciones',
  true,
  300, '#000000', '#FFFFFF', 'M', 10,
  false, '#000000', NULL,
  true, 'Déjanos tu opinión', true, 'Escanea el código', false, '',
  'A4', 'portrait', 1, false
),
(
  'Llamativo',
  'Diseño audaz con colores contrastantes y marco grueso',
  true,
  380, '#000000', '#FFEB3B', 'H', 4,
  true, '#000000', 5,
  true, '¡VALÓRANOS!', true, 'Tu opinión cuenta', true, '¡ESCANEA AHORA!',
  'A4', 'portrait', 1, true
),
(
  'Restaurante',
  'Perfecto para mesas de restaurantes con colores cálidos',
  true,
  340, '#8B4513', '#FFF8DC', 'Q', 6,
  true, '#8B4513', 3,
  true, '¿Cómo estuvo tu comida?', true, 'Nos encantaría conocer tu opinión', true, 'Comparte tu experiencia',
  'A4', 'portrait', 1, true
);

-- Create trigger for updated_at
CREATE TRIGGER update_qr_templates_updated_at
  BEFORE UPDATE ON qr_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
