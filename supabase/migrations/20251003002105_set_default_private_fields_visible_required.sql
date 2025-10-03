/*
  # Actualizar valores por defecto de campos de feedback privado

  1. Cambios
    - Establecer `solicitar_nombre` = true por defecto
    - Establecer `nombre_requerido` = true por defecto
    - Establecer `solicitar_telefono` = true por defecto
    - Establecer `telefono_requerido` = true por defecto
    - Establecer `solicitar_email` = true por defecto
    - Establecer `email_requerido` = true por defecto
  
  2. Notas
    - Todos los campos de información del cliente estarán visibles y obligatorios por defecto
    - Los usuarios pueden desactivarlos si lo desean desde la configuración
*/

ALTER TABLE voting_configuration 
  ALTER COLUMN solicitar_nombre SET DEFAULT true,
  ALTER COLUMN nombre_requerido SET DEFAULT true,
  ALTER COLUMN solicitar_telefono SET DEFAULT true,
  ALTER COLUMN telefono_requerido SET DEFAULT true,
  ALTER COLUMN solicitar_email SET DEFAULT true,
  ALTER COLUMN email_requerido SET DEFAULT true;