/*
  # Add logo configuration to QR configuration

  1. Changes
    - Add `show_logo` boolean column with default false
    - Add `logo_shape` text column with default 'circular'

  2. Details
    - These columns allow users to display their business logo at the top of the QR display
    - Logo shape can be 'circular' (with soft borders) or 'square'
    - Default values ensure existing configurations work without changes
*/

-- Add logo configuration columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'show_logo'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN show_logo boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'logo_shape'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN logo_shape text DEFAULT 'circular' CHECK (logo_shape IN ('circular', 'square'));
  END IF;
END $$;