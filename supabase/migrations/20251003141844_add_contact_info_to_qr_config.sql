/*
  # Agregar información de contacto a configuración de QR

  1. Cambios
    - Agregar campo `show_phone`: booleano, por defecto false
    - Agregar campo `show_email`: booleano, por defecto false

  2. Notas
    - Estos campos permiten mostrar el teléfono y email de la sucursal en la página de QR
    - Se mostrarán con sus respectivos iconos
    - El teléfono y email mostrados son los de la sucursal específica
*/

-- Agregar campos para mostrar teléfono y email
ALTER TABLE qr_configuration 
  ADD COLUMN IF NOT EXISTS show_phone boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_email boolean DEFAULT false;
