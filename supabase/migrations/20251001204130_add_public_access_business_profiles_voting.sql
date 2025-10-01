/*
  # Agregar acceso público a business_profiles para páginas de votación

  1. Cambios en Políticas RLS
    - Agregar política para que usuarios anónimos puedan leer business_profiles
    - Agregar política para que usuarios anónimos puedan actualizar voting_sessions
      (necesario para tracking de clicks en botón de Google)

  2. Seguridad
    - Solo lectura pública de business_profiles
    - Solo actualización pública de voting_sessions (para Google redirect tracking)
    - Los datos sensibles siguen protegidos por autenticación
*/

-- Allow anonymous users to read business profiles for voting pages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'business_profiles' 
    AND policyname = 'Anonymous users can read business profiles'
  ) THEN
    CREATE POLICY "Anonymous users can read business profiles"
      ON business_profiles
      FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

-- Allow anonymous users to update voting sessions (for Google redirect tracking)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'voting_sessions' 
    AND policyname = 'Anonymous users can update voting sessions'
  ) THEN
    CREATE POLICY "Anonymous users can update voting sessions"
      ON voting_sessions
      FOR UPDATE
      TO anon
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;