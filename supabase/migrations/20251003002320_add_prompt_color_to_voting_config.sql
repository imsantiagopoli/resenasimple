/*
  # Agregar color personalizable al prompt preventivo

  1. Cambios
    - Agregar columna `color_prompt` a la tabla `voting_configuration`
    - Color por defecto: '#FEF3C7' (amarillo claro similar a la oferta especial)
  
  2. Notas
    - Este campo permite personalizar el color de fondo del mensaje preventivo
    - Similar a la funcionalidad del color de la oferta especial
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_configuration' AND column_name = 'color_prompt'
  ) THEN
    ALTER TABLE voting_configuration 
    ADD COLUMN color_prompt text DEFAULT '#FEF3C7';
  END IF;
END $$;