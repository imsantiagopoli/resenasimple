/*
  # Drop voting_configs and create new voting_configuration table

  1. Drop existing table
    - Drop `voting_configs` table with problematic structure
  
  2. New Table
    - `voting_configuration` table with individual columns for each config option
    - Real-time updates support
    - Better structure for live editing
  
  3. Security
    - Enable RLS on new table
    - Add policies for business owners to manage their configurations
*/

-- Drop the existing problematic table
DROP TABLE IF EXISTS voting_configs CASCADE;

-- Create new voting_configuration table with individual columns
CREATE TABLE IF NOT EXISTS voting_configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL REFERENCES business_branches(id) ON DELETE CASCADE,
  
  -- Mensaje principal
  encabezado text DEFAULT 'Queremos tu opinión. Tu experiencia nos ayuda a mejorar.',
  cuerpo text DEFAULT 'Tómate un momento para compartir tu experiencia con nosotros.',
  
  -- Logo
  mostrar_logo boolean DEFAULT true,
  forma_logo text DEFAULT 'circular' CHECK (forma_logo IN ('circular', 'square')),
  mostrar_logo_en text DEFAULT 'all' CHECK (mostrar_logo_en IN ('all', 'voting-only')),
  
  -- Tipografía
  tipografia_principal text DEFAULT 'Cabinet Grotesk',
  tipografia_secundaria text DEFAULT 'Cabinet Grotesk',
  
  -- Colores
  color_botones text DEFAULT '#075E54',
  
  -- Etiquetas de estrellas
  mostrar_etiquetas_estrellas boolean DEFAULT true,
  etiqueta_1_estrella text DEFAULT 'Muy malo',
  etiqueta_2_estrellas text DEFAULT 'Regular',
  etiqueta_3_estrellas text DEFAULT 'Aceptable',
  etiqueta_4_estrellas text DEFAULT 'Bueno',
  etiqueta_5_estrellas text DEFAULT 'Excelente',
  
  -- Oferta especial
  oferta_especial_activa boolean DEFAULT false,
  oferta_especial_titulo text DEFAULT '¡Oferta exclusiva para reseñadores!',
  oferta_especial_descripcion text DEFAULT 'Deja una reseña y obtené un 10% de descuento en tu próxima compra.',
  
  -- Redes sociales
  mostrar_instagram boolean DEFAULT true,
  mostrar_tiktok boolean DEFAULT true,
  mostrar_linkedin boolean DEFAULT false,
  mostrar_twitter boolean DEFAULT false,
  mostrar_youtube boolean DEFAULT false,
  mostrar_website boolean DEFAULT true,
  
  -- Lógica de votación
  umbral_estrellas integer DEFAULT 4 CHECK (umbral_estrellas >= 1 AND umbral_estrellas <= 5),
  redireccion_automatica boolean DEFAULT true,
  
  -- Flujo público
  mensaje_agradecimiento_publico text DEFAULT 'Gracias por tu tiempo. Tu opinión nos ayuda a mejorar.',
  texto_boton_publico text DEFAULT 'Califícanos en Google',
  
  -- Flujo privado
  mensaje_feedback_privado text DEFAULT 'Tu opinión es muy valiosa. Por favor, contanos cómo podemos mejorar.',
  mensaje_agradecimiento_privado text DEFAULT 'Gracias por tu sinceridad. Tu aporte nos ayuda a crecer.',
  
  -- Campos de feedback privado
  solicitar_nombre boolean DEFAULT false,
  nombre_requerido boolean DEFAULT false,
  solicitar_telefono boolean DEFAULT false,
  telefono_requerido boolean DEFAULT false,
  solicitar_email boolean DEFAULT false,
  email_requerido boolean DEFAULT false,
  
  -- Prompt preventivo
  prompt_preventivo_activo boolean DEFAULT true,
  texto_prompt_preventivo text DEFAULT 'Tu opinión es importante. Antes de enviar una reseña neutral o negativa, ¿podrías compartir tus comentarios en privado para ayudarnos a mejorar?',
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index on branch_id (one config per branch)
CREATE UNIQUE INDEX IF NOT EXISTS idx_voting_configuration_branch_id 
ON voting_configuration(branch_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_voting_configuration_created_at 
ON voting_configuration(created_at);

-- Enable RLS
ALTER TABLE voting_configuration ENABLE ROW LEVEL SECURITY;

-- Policies for business owners to manage their voting configurations
CREATE POLICY "Business owners can read their voting configurations"
  ON voting_configuration
  FOR SELECT
  TO authenticated
  USING (
    branch_id IN (
      SELECT b.id
      FROM business_branches b
      JOIN business_profiles bp ON b.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can insert their voting configurations"
  ON voting_configuration
  FOR INSERT
  TO authenticated
  WITH CHECK (
    branch_id IN (
      SELECT b.id
      FROM business_branches b
      JOIN business_profiles bp ON b.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update their voting configurations"
  ON voting_configuration
  FOR UPDATE
  TO authenticated
  USING (
    branch_id IN (
      SELECT b.id
      FROM business_branches b
      JOIN business_profiles bp ON b.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    branch_id IN (
      SELECT b.id
      FROM business_branches b
      JOIN business_profiles bp ON b.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can delete their voting configurations"
  ON voting_configuration
  FOR DELETE
  TO authenticated
  USING (
    branch_id IN (
      SELECT b.id
      FROM business_branches b
      JOIN business_profiles bp ON b.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  );

-- Anonymous users can read voting configurations by branch slug
CREATE POLICY "Anonymous users can read voting configurations by branch"
  ON voting_configuration
  FOR SELECT
  TO anon
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_voting_configuration_updated_at
  BEFORE UPDATE ON voting_configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();