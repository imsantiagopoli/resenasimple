/*
  # Agregar email a sucursales

  1. Cambios
    - Agregar campo `email` a la tabla `business_branches`
      - Tipo: text
      - Nullable: true (no todas las sucursales necesitan email)

  2. Notas
    - Permite que cada sucursal tenga su propio email de contacto
    - Se puede mostrar en la página de QR junto con el teléfono
*/

-- Agregar campo email a business_branches
ALTER TABLE business_branches 
  ADD COLUMN IF NOT EXISTS email text;
