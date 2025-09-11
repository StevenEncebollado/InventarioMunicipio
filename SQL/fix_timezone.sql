-- Script para corregir la zona horaria en la tabla inventario
-- Ecuador está en UTC-5 (America/Guayaquil)

-- Actualizar la columna existente para usar la zona horaria local
ALTER TABLE inventario 
ALTER COLUMN fecha_registro SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Guayaquil');

-- También podemos configurar la zona horaria de la sesión
SET timezone = 'America/Guayaquil';

-- Verificar la configuración actual
SHOW timezone;
