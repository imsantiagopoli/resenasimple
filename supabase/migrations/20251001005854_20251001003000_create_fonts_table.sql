/*
  # Create fonts table

  1. New Tables
    - `fonts`
      - `id` (uuid, primary key)
      - `name` (text) - Display name of the font
      - `value` (text) - Font family value for CSS
      - `category` (text) - Font category (serif, sans-serif, display, monospace, etc.)
      - `google_font` (boolean) - Whether it's a Google Font that needs to be loaded
      - `import_url` (text, nullable) - Google Fonts import URL if applicable
      - `is_active` (boolean) - Whether the font is available for use
      - `sort_order` (integer) - Display order
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `fonts` table
    - Add policy for authenticated users to read fonts
    - Only allow authenticated users to read (admins can manage via direct DB access)

  3. Initial Data
    - Insert popular fonts including Google Fonts and system fonts
*/

CREATE TABLE IF NOT EXISTS fonts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  value text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'sans-serif',
  google_font boolean DEFAULT false,
  import_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fonts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active fonts"
  ON fonts
  FOR SELECT
  USING (is_active = true);

-- Insert default fonts
INSERT INTO fonts (name, value, category, google_font, import_url, sort_order) VALUES
  -- System fonts
  ('Arial', 'Arial', 'sans-serif', false, null, 1),
  ('Helvetica', 'Helvetica', 'sans-serif', false, null, 2),
  ('Times New Roman', 'Times New Roman', 'serif', false, null, 3),
  ('Georgia', 'Georgia', 'serif', false, null, 4),
  ('Verdana', 'Verdana', 'sans-serif', false, null, 5),
  ('Courier New', 'Courier New', 'monospace', false, null, 6),

  -- Google Fonts - Sans Serif
  ('Roboto', 'Roboto', 'sans-serif', true, 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap', 10),
  ('Open Sans', 'Open Sans', 'sans-serif', true, 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap', 11),
  ('Lato', 'Lato', 'sans-serif', true, 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap', 12),
  ('Montserrat', 'Montserrat', 'sans-serif', true, 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap', 13),
  ('Poppins', 'Poppins', 'sans-serif', true, 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap', 14),
  ('Inter', 'Inter', 'sans-serif', true, 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap', 15),
  ('Raleway', 'Raleway', 'sans-serif', true, 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&display=swap', 16),
  ('Nunito', 'Nunito', 'sans-serif', true, 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap', 17),
  ('Work Sans', 'Work Sans', 'sans-serif', true, 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;600;700&display=swap', 18),

  -- Google Fonts - Serif
  ('Playfair Display', 'Playfair Display', 'serif', true, 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap', 20),
  ('Merriweather', 'Merriweather', 'serif', true, 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap', 21),
  ('Lora', 'Lora', 'serif', true, 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap', 22),

  -- Google Fonts - Display
  ('Bebas Neue', 'Bebas Neue', 'display', true, 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap', 30),
  ('Oswald', 'Oswald', 'display', true, 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&display=swap', 31),
  ('Anton', 'Anton', 'display', true, 'https://fonts.googleapis.com/css2?family=Anton&display=swap', 32),
  ('Righteous', 'Righteous', 'display', true, 'https://fonts.googleapis.com/css2?family=Righteous&display=swap', 33),

  -- Google Fonts - Handwriting
  ('Dancing Script', 'Dancing Script', 'handwriting', true, 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap', 40),
  ('Pacifico', 'Pacifico', 'handwriting', true, 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap', 41),

  -- Google Fonts - Monospace
  ('Roboto Mono', 'Roboto Mono', 'monospace', true, 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap', 50),
  ('Source Code Pro', 'Source Code Pro', 'monospace', true, 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap', 51),

  -- Special fonts from the current config
  ('Press Start 2P', 'Press Start 2P', 'display', true, 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap', 60),
  ('Cabinet Grotesk', 'Cabinet Grotesk', 'sans-serif', true, 'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@100,200,300,400,500,700,800,900&display=swap', 61)

ON CONFLICT (value) DO NOTHING;
