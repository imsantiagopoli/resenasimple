/*
  # Agregar tipografía y colores para QR

  1. Nuevas Columnas
    - `tipografia_principal` (text) - Fuente para títulos y headlines
    - `color_tipografia_principal` (text) - Color de la tipografía principal
    - `tipografia_secundaria` (text) - Fuente para subtítulos y textos
    - `color_tipografia_secundaria` (text) - Color de la tipografía secundaria

  2. Valores por Defecto
    - Tipografía principal: Cabinet Grotesk
    - Color tipografía principal: #161616 (negro)
    - Tipografía secundaria: Cabinet Grotesk  
    - Color tipografía secundaria: #6b7280 (gris)
*/

-- Add typography and color columns to qr_configuration table
DO $$
BEGIN
  -- Add tipografia_principal column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'tipografia_principal'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN tipografia_principal text DEFAULT 'Cabinet Grotesk';
  END IF;
  
  -- Add color_tipografia_principal column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'color_tipografia_principal'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN color_tipografia_principal text DEFAULT '#161616';
  END IF;
  
  -- Add tipografia_secundaria column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'tipografia_secundaria'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN tipografia_secundaria text DEFAULT 'Cabinet Grotesk';
  END IF;
  
  -- Add color_tipografia_secundaria column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_configuration' AND column_name = 'color_tipografia_secundaria'
  ) THEN
    ALTER TABLE qr_configuration ADD COLUMN color_tipografia_secundaria text DEFAULT '#6b7280';
  END IF;
END $$;