-- Agregar campo fecha_eliminacion a la tabla inventario
-- Este campo se usa para registrar cuándo un equipo fue marcado como inactivo

ALTER TABLE inventario 
ADD COLUMN fecha_eliminacion TIMESTAMP DEFAULT NULL;

-- Comentario sobre el campo
COMMENT ON COLUMN inventario.fecha_eliminacion IS 'Fecha y hora cuando el equipo fue marcado como inactivo (eliminación lógica)';
