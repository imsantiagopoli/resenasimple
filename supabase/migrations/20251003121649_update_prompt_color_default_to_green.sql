/*
  # Actualizar color por defecto del prompt preventivo

  1. Cambios
    - Actualizar el valor por defecto de `color_prompt` de '#FEF3C7' (amarillo) a '#075E54' (verde)
    - Esto afecta a nuevas configuraciones de votación
    - Las configuraciones existentes no se modifican

  2. Notas
    - El cambio solo aplica a nuevas filas insertadas después de esta migración
    - Los registros existentes mantienen su valor actual
*/

-- Cambiar el valor por defecto de color_prompt a verde
ALTER TABLE voting_configuration 
  ALTER COLUMN color_prompt SET DEFAULT '#075E54';
