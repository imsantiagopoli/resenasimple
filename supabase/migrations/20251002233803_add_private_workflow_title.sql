/*
  # Agregar título al flujo privado

  1. Cambios
    - Agregar columna `titulo_feedback_privado` a la tabla `voting_configuration`
    - Título por defecto: "Tu Opinión es Valiosa"
  
  2. Notas
    - Este campo permite personalizar el título principal en la página de feedback privado
    - Se muestra después de que el usuario califica con estrellas por debajo del umbral
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voting_configuration' AND column_name = 'titulo_feedback_privado'
  ) THEN
    ALTER TABLE voting_configuration 
    ADD COLUMN titulo_feedback_privado text DEFAULT 'Tu Opinión es Valiosa';
  END IF;
END $$;