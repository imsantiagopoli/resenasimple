/*
  # Add font size columns to QR configuration

  1. Changes
    - Add `tamano_tipografia_principal` column to `qr_configuration` table (default 24px)
    - Add `tamano_tipografia_secundaria` column to `qr_configuration` table (default 16px)
  
  2. Notes
    - Uses safe migration with IF NOT EXISTS check
    - Sets reasonable default values for existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'tamano_tipografia_principal'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN tamano_tipografia_principal integer DEFAULT 24;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'tamano_tipografia_secundaria'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN tamano_tipografia_secundaria integer DEFAULT 16;
  END IF;
END $$;
