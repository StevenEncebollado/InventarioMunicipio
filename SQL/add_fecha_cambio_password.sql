-- Agregar columna para fecha de último cambio de contraseña
ALTER TABLE usuario ADD COLUMN fecha_cambio_password TIMESTAMP DEFAULT NOW();
