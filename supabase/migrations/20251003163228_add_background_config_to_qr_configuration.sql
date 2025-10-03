/*
  # Add Background Configuration to QR Configuration
  
  1. Changes
    - Add background_type field (solid, gradient, image)
    - Add background_color field for solid backgrounds
    - Add background_gradient_start field for gradient backgrounds
    - Add background_gradient_end field for gradient backgrounds
    - Add background_gradient_direction field (to-r, to-b, to-br, etc)
    - Add background_image_url field for image backgrounds
  
  2. Defaults
    - background_type defaults to 'solid'
    - background_color defaults to '#FFFFFF' (white)
    - All other fields nullable
*/

-- Add background configuration columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'background_type'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN background_type TEXT DEFAULT 'solid' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'background_color'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN background_color TEXT DEFAULT '#FFFFFF' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'background_gradient_start'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN background_gradient_start TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'background_gradient_end'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN background_gradient_end TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'background_gradient_direction'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN background_gradient_direction TEXT DEFAULT 'to-b';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'background_image_url'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN background_image_url TEXT;
  END IF;
END $$;