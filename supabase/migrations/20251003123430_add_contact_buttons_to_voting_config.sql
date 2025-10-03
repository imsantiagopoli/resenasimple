/*
  # Agregar botones de contacto a página de agradecimiento privado

  1. Cambios
    - Agregar campos para botón de WhatsApp:
      - `mostrar_boton_whatsapp`: booleano, por defecto false
      - `texto_boton_whatsapp`: texto, por defecto 'Contáctanos por WhatsApp'
      - `color_boton_whatsapp`: texto, por defecto '#25D366' (verde WhatsApp)
    - Agregar campos para botón de Email:
      - `mostrar_boton_email`: booleano, por defecto false
      - `texto_boton_email`: texto, por defecto 'Contáctanos por Email'
      - `color_boton_email`: texto, por defecto '#075E54' (verde principal)

  2. Notas
    - Estos botones aparecen en la página de agradecimiento después de enviar feedback privado
    - Los botones usan el teléfono y email de la sucursal
    - Cada botón puede ser habilitado/deshabilitado independientemente
    - El texto y color de cada botón son personalizables
*/

-- Agregar campos para botón de WhatsApp
ALTER TABLE voting_configuration 
  ADD COLUMN IF NOT EXISTS mostrar_boton_whatsapp boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS texto_boton_whatsapp text DEFAULT 'Contáctanos por WhatsApp',
  ADD COLUMN IF NOT EXISTS color_boton_whatsapp text DEFAULT '#25D366';

-- Agregar campos para botón de Email
ALTER TABLE voting_configuration 
  ADD COLUMN IF NOT EXISTS mostrar_boton_email boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS texto_boton_email text DEFAULT 'Contáctanos por Email',
  ADD COLUMN IF NOT EXISTS color_boton_email text DEFAULT '#075E54';
