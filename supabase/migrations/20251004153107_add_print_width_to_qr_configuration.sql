/*
  # Add print width control to QR configuration

  1. Changes
    - Add `print_width` column to `qr_configuration` table
      - Type: integer (width in pixels)
      - Default: 448 (the current fixed width)
      - This allows users to adjust the width of printed QR codes
    
  2. Notes
    - Default value of 448px maintains current behavior
    - Users can adjust width between reasonable bounds (e.g., 300-800px)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'print_width'
  ) THEN
    ALTER TABLE qr_configuration 
    ADD COLUMN print_width integer DEFAULT 448 NOT NULL;
  END IF;
END $$;
