/*
  # Sync QR Templates Table with QR Configuration

  1. Changes
    - Add missing fields from qr_configuration to qr_templates table
    - Add show_logo and logo_shape fields
    - Add show_phone and show_email fields
    - Add font size fields (tamano_tipografia_principal, tamano_tipografia_secundaria, etc.)
    - Add background configuration fields (background_type, background_color, etc.)

  2. Defaults
    - Set sensible defaults for all new fields to match qr_configuration defaults
    - Ensure all existing templates are updated with default values

  3. Security
    - No security changes needed (RLS already configured)
*/

-- Add logo fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'show_logo'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN show_logo boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'logo_shape'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN logo_shape text DEFAULT 'circular';
  END IF;
END $$;

-- Add contact info fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'show_phone'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN show_phone boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'show_email'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN show_email boolean DEFAULT false;
  END IF;
END $$;

-- Add font size fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'tamano_tipografia_principal'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN tamano_tipografia_principal integer DEFAULT 16;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'tamano_tipografia_secundaria'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN tamano_tipografia_secundaria integer DEFAULT 14;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'tamano_titulo'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN tamano_titulo integer DEFAULT 24;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'tamano_subtitulo'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN tamano_subtitulo integer DEFAULT 16;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'tamano_cta'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN tamano_cta integer DEFAULT 14;
  END IF;
END $$;

-- Add background configuration fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'background_type'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN background_type text DEFAULT 'solid' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'background_color'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN background_color text DEFAULT '#FFFFFF' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'background_gradient_start'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN background_gradient_start text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'background_gradient_end'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN background_gradient_end text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'background_gradient_direction'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN background_gradient_direction text DEFAULT 'to-b';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_templates' AND column_name = 'background_image_url'
  ) THEN
    ALTER TABLE qr_templates ADD COLUMN background_image_url text;
  END IF;
END $$;
