/*
  # Agregar texto del botón al flujo privado

  1. Cambios
    - Agregar columna `texto_boton_privado` a la tabla `voting_configuration`
    - Texto por defecto: "Enviar comentarios"
  
  2. Notas
    - Este campo permite personalizar el texto del botón de envío en el formulario de feedback privado
    - Se muestra en el formulario para clientes que califican por debajo del umbral
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_configuration' AND column_name = 'texto_boton_privado'
  ) THEN
    ALTER TABLE voting_configuration 
    ADD COLUMN texto_boton_privado text DEFAULT 'Enviar comentarios';
  END IF;
END $$;