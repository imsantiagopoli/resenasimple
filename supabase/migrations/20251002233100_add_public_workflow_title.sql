/*
  # Agregar título al flujo público

  1. Cambios
    - Agregar columna `titulo_agradecimiento_publico` a la tabla `voting_configuration`
    - Título por defecto: "¡Gracias por tu Calificación!"
  
  2. Notas
    - Este campo permite personalizar el título principal en la página de agradecimiento público
    - Se muestra después de que el usuario califica con estrellas por encima del umbral
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_configuration' AND column_name = 'titulo_agradecimiento_publico'
  ) THEN
    ALTER TABLE voting_configuration 
    ADD COLUMN titulo_agradecimiento_publico text DEFAULT '¡Gracias por tu Calificación!';
  END IF;
END $$;