/*
  # Agregar campos de color de texto personalizables

  1. Cambios
    - Agregar columna `color_texto_body` a la tabla `voting_configuration`
      - Color por defecto: rgb(107, 114, 128) convertido a hex #6b7280
    - Agregar columna `color_texto_oferta` a la tabla `voting_configuration`
      - Color por defecto: rgb(107, 114, 128) convertido a hex #6b7280
  
  2. Notas
    - El campo `color_texto_body` se aplica al texto del cuerpo del mensaje principal
    - El campo `color_texto_oferta` se aplica al texto body de la oferta especial
    - El background de la oferta usará el mismo color con transparencia
    - El color gris por defecto es #6b7280 (rgb(107, 114, 128))
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_configuration' AND column_name = 'color_texto_body'
  ) THEN
    ALTER TABLE voting_configuration 
    ADD COLUMN color_texto_body text DEFAULT '#6b7280';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_configuration' AND column_name = 'color_texto_oferta'
  ) THEN
    ALTER TABLE voting_configuration 
    ADD COLUMN color_texto_oferta text DEFAULT '#6b7280';
  END IF;
END $$;