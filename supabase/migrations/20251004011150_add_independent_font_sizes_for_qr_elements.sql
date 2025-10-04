/*
  # Add Independent Font Sizes for QR Elements

  1. Changes
    - Add `tamano_titulo` (title font size) column to qr_configuration table
    - Add `tamano_subtitulo` (subtitle font size) column to qr_configuration table  
    - Add `tamano_cta` (call to action font size) column to qr_configuration table
    - Set default values based on current typography sizes
    - Keep existing `tamano_tipografia_principal` and `tamano_tipografia_secundaria` for backwards compatibility

  2. Notes
    - Title will use primary typography size as default (24px)
    - Subtitle will use secondary typography size as default (16px)
    - CTA will use primary typography size as default (24px)
*/

-- Add new font size columns for independent control
ALTER TABLE qr_configuration 
  ADD COLUMN IF NOT EXISTS tamano_titulo INTEGER DEFAULT 24,
  ADD COLUMN IF NOT EXISTS tamano_subtitulo INTEGER DEFAULT 16,
  ADD COLUMN IF NOT EXISTS tamano_cta INTEGER DEFAULT 20;

-- Update existing records to use current typography sizes
UPDATE qr_configuration 
SET 
  tamano_titulo = COALESCE(tamano_tipografia_principal, 24),
  tamano_subtitulo = COALESCE(tamano_tipografia_secundaria, 16),
  tamano_cta = COALESCE(tamano_tipografia_principal, 20)
WHERE tamano_titulo IS NULL OR tamano_subtitulo IS NULL OR tamano_cta IS NULL;