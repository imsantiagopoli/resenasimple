/*
  # Agregar título de agradecimiento al flujo privado

  1. Cambios
    - Agregar columna `titulo_agradecimiento_privado` a la tabla `voting_configuration`
    - Título por defecto: "¡Gracias por tu Feedback!"
  
  2. Notas
    - Este campo permite personalizar el título en la página final de agradecimiento después de enviar feedback privado
    - Se muestra junto con el mensaje de agradecimiento después de que el usuario envía sus comentarios
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_configuration' AND column_name = 'titulo_agradecimiento_privado'
  ) THEN
    ALTER TABLE voting_configuration 
    ADD COLUMN titulo_agradecimiento_privado text DEFAULT '¡Gracias por tu Feedback!';
  END IF;
END $$;