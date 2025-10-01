-- Tabla de usuario
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_cambio_password TIMESTAMP,
    fecha_eliminacion TIMESTAMP
);
