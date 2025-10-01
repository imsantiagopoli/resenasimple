/*
  # Add Typography Fields to QR Templates

  1. Changes
    - Add typography fields to qr_templates table to match qr_configuration
    - Update existing templates with typography values
  
  2. New Columns
    - `tipografia_principal` (text) - Primary font family
    - `color_tipografia_principal` (text) - Primary font color
    - `tipografia_secundaria` (text) - Secondary font family
    - `color_tipografia_secundaria` (text) - Secondary font color
*/

-- Add typography columns to qr_templates
ALTER TABLE qr_templates
ADD COLUMN IF NOT EXISTS tipografia_principal text DEFAULT 'Cabinet Grotesk',
ADD COLUMN IF NOT EXISTS color_tipografia_principal text DEFAULT '#161616',
ADD COLUMN IF NOT EXISTS tipografia_secundaria text DEFAULT 'Cabinet Grotesk',
ADD COLUMN IF NOT EXISTS color_tipografia_secundaria text DEFAULT '#6b7280';

-- Update existing templates with specific typography
UPDATE qr_templates SET
  tipografia_principal = 'Arial',
  color_tipografia_principal = '#000000',
  tipografia_secundaria = 'Arial',
  color_tipografia_secundaria = '#4B5563'
WHERE name = 'Clásico';

UPDATE qr_templates SET
  tipografia_principal = 'Helvetica',
  color_tipografia_principal = '#075E54',
  tipografia_secundaria = 'Helvetica',
  color_tipografia_secundaria = '#128C7E'
WHERE name = 'Moderno';

UPDATE qr_templates SET
  tipografia_principal = 'Georgia',
  color_tipografia_principal = '#1a1a1a',
  tipografia_secundaria = 'Georgia',
  color_tipografia_secundaria = '#4B5563'
WHERE name = 'Elegante';

UPDATE qr_templates SET
  tipografia_principal = 'Helvetica',
  color_tipografia_principal = '#000000',
  tipografia_secundaria = 'Helvetica',
  color_tipografia_secundaria = '#6B7280'
WHERE name = 'Minimalista';

UPDATE qr_templates SET
  tipografia_principal = 'Impact',
  color_tipografia_principal = '#000000',
  tipografia_secundaria = 'Arial',
  color_tipografia_secundaria = '#1F2937'
WHERE name = 'Llamativo';

UPDATE qr_templates SET
  tipografia_principal = 'Georgia',
  color_tipografia_principal = '#8B4513',
  tipografia_secundaria = 'Georgia',
  color_tipografia_secundaria = '#A0522D'
WHERE name = 'Restaurante';
