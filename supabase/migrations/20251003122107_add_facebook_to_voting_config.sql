/*
  # Agregar Facebook a configuración de votación

  1. Cambios
    - Agregar campo `mostrar_facebook` a la tabla `voting_configuration`
    - Campo booleano con valor por defecto `false`
    - Permite mostrar/ocultar icono de Facebook en páginas de votación

  2. Notas
    - El campo se agrega después de la columna `oferta_especial_descripcion`
    - Mantiene consistencia con otros campos de redes sociales (instagram, tiktok, etc.)
*/

-- Agregar campo mostrar_facebook
ALTER TABLE voting_configuration 
  ADD COLUMN IF NOT EXISTS mostrar_facebook boolean DEFAULT false;
