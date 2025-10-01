/*
  # Create QR Templates Table

  1. New Tables
    - `qr_templates`
      - `id` (uuid, primary key)
      - `name` (text) - Template name
      - `description` (text) - Template description
      - `config` (jsonb) - QR configuration object matching QRConfiguration structure
      - `preview_colors` (jsonb) - Preview colors for UI display
      - `is_system` (boolean) - Whether this is a system template
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `qr_templates` table
    - Add policy for all users to read system templates
    - Only admins can create/update system templates

  3. Initial Data
    - Insert 6 default system templates
*/

CREATE TABLE IF NOT EXISTS qr_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  config jsonb NOT NULL,
  preview_colors jsonb NOT NULL,
  is_system boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE qr_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read system templates"
  ON qr_templates
  FOR SELECT
  USING (is_system = true);

-- Insert default system templates
INSERT INTO qr_templates (name, description, config, preview_colors, is_system) VALUES
(
  'Clásico',
  'Diseño tradicional en blanco y negro, ideal para cualquier ocasión',
  '{
    "qr": {
      "size": 300,
      "foregroundColor": "#000000",
      "backgroundColor": "#FFFFFF",
      "margin": 4,
      "errorCorrectionLevel": "M"
    },
    "typography": {
      "primaryFont": "Arial",
      "primaryColor": "#000000",
      "secondaryFont": "Arial",
      "secondaryColor": "#666666"
    },
    "design": {
      "showFrame": true,
      "frameColor": "#000000",
      "frameThickness": 2
    },
    "content": {
      "title": "¡Déjanos tu opinión!",
      "subtitle": "Escanea el código QR",
      "callToAction": "Tu opinión es importante",
      "showTitle": true,
      "showSubtitle": true,
      "showCallToAction": true
    },
    "print": {
      "format": "A4",
      "orientation": "portrait",
      "includeInstructions": true
    }
  }',
  '{
    "bgColor": "#FFFFFF",
    "qrColor": "#000000",
    "accentColor": "#000000"
  }',
  true
),
(
  'Moderno',
  'Estilo contemporáneo con verde WhatsApp y tipografía elegante',
  '{
    "qr": {
      "size": 350,
      "foregroundColor": "#075E54",
      "backgroundColor": "#FFFFFF",
      "margin": 6,
      "errorCorrectionLevel": "H"
    },
    "typography": {
      "primaryFont": "Cabinet Grotesk",
      "primaryColor": "#075E54",
      "secondaryFont": "Cabinet Grotesk",
      "secondaryColor": "#6b7280"
    },
    "design": {
      "showFrame": true,
      "frameColor": "#075E54",
      "frameThickness": 3
    },
    "content": {
      "title": "Comparte tu experiencia",
      "subtitle": "Nos encantaría conocer tu opinión",
      "callToAction": "¡Ayúdanos a mejorar!",
      "showTitle": true,
      "showSubtitle": true,
      "showCallToAction": true
    },
    "print": {
      "format": "A4",
      "orientation": "portrait",
      "includeInstructions": true
    }
  }',
  '{
    "bgColor": "#FFFFFF",
    "qrColor": "#075E54",
    "accentColor": "#075E54"
  }',
  true
),
(
  'Elegante',
  'Diseño sofisticado con tipografía serif y marco delicado',
  '{
    "qr": {
      "size": 320,
      "foregroundColor": "#1a1a1a",
      "backgroundColor": "#FFFFFF",
      "margin": 8,
      "errorCorrectionLevel": "Q"
    },
    "typography": {
      "primaryFont": "Georgia",
      "primaryColor": "#1a1a1a",
      "secondaryFont": "Georgia",
      "secondaryColor": "#4a4a4a"
    },
    "design": {
      "showFrame": true,
      "frameColor": "#1a1a1a",
      "frameThickness": 1
    },
    "content": {
      "title": "Tu opinión nos importa",
      "subtitle": "Escanea para compartir tu experiencia",
      "callToAction": "Comparte tu valoración",
      "showTitle": true,
      "showSubtitle": true,
      "showCallToAction": true
    },
    "print": {
      "format": "A4",
      "orientation": "portrait",
      "includeInstructions": true
    }
  }',
  '{
    "bgColor": "#FFFFFF",
    "qrColor": "#1a1a1a",
    "accentColor": "#1a1a1a"
  }',
  true
),
(
  'Minimalista',
  'Diseño limpio y simple sin distracciones',
  '{
    "qr": {
      "size": 300,
      "foregroundColor": "#000000",
      "backgroundColor": "#FFFFFF",
      "margin": 10,
      "errorCorrectionLevel": "M"
    },
    "typography": {
      "primaryFont": "Helvetica",
      "primaryColor": "#000000",
      "secondaryFont": "Helvetica",
      "secondaryColor": "#666666"
    },
    "design": {
      "showFrame": false,
      "frameColor": "#000000",
      "frameThickness": 0
    },
    "content": {
      "title": "Déjanos tu opinión",
      "subtitle": "Escanea el código",
      "callToAction": "",
      "showTitle": true,
      "showSubtitle": true,
      "showCallToAction": false
    },
    "print": {
      "format": "A4",
      "orientation": "portrait",
      "includeInstructions": false
    }
  }',
  '{
    "bgColor": "#FFFFFF",
    "qrColor": "#000000",
    "accentColor": "#000000"
  }',
  true
),
(
  'Llamativo',
  'Diseño audaz con colores contrastantes y marco grueso',
  '{
    "qr": {
      "size": 380,
      "foregroundColor": "#000000",
      "backgroundColor": "#FFEB3B",
      "margin": 4,
      "errorCorrectionLevel": "H"
    },
    "typography": {
      "primaryFont": "Impact",
      "primaryColor": "#000000",
      "secondaryFont": "Arial",
      "secondaryColor": "#333333"
    },
    "design": {
      "showFrame": true,
      "frameColor": "#000000",
      "frameThickness": 5
    },
    "content": {
      "title": "¡VALÓRANOS!",
      "subtitle": "Tu opinión cuenta",
      "callToAction": "¡ESCANEA AHORA!",
      "showTitle": true,
      "showSubtitle": true,
      "showCallToAction": true
    },
    "print": {
      "format": "A4",
      "orientation": "portrait",
      "includeInstructions": true
    }
  }',
  '{
    "bgColor": "#FFEB3B",
    "qrColor": "#000000",
    "accentColor": "#000000"
  }',
  true
),
(
  'Restaurante',
  'Perfecto para mesas de restaurantes con colores cálidos',
  '{
    "qr": {
      "size": 340,
      "foregroundColor": "#8B4513",
      "backgroundColor": "#FFF8DC",
      "margin": 6,
      "errorCorrectionLevel": "Q"
    },
    "typography": {
      "primaryFont": "Georgia",
      "primaryColor": "#8B4513",
      "secondaryFont": "Georgia",
      "secondaryColor": "#A0522D"
    },
    "design": {
      "showFrame": true,
      "frameColor": "#8B4513",
      "frameThickness": 3
    },
    "content": {
      "title": "¿Cómo estuvo tu comida?",
      "subtitle": "Nos encantaría conocer tu opinión",
      "callToAction": "Comparte tu experiencia",
      "showTitle": true,
      "showSubtitle": true,
      "showCallToAction": true
    },
    "print": {
      "format": "A4",
      "orientation": "portrait",
      "includeInstructions": true
    }
  }',
  '{
    "bgColor": "#FFF8DC",
    "qrColor": "#8B4513",
    "accentColor": "#8B4513"
  }',
  true
);
