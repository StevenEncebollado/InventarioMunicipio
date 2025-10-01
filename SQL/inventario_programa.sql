-- Tabla para relacionar inventario con programas adicionales
CREATE TABLE IF NOT EXISTS inventario_programa (
    id SERIAL PRIMARY KEY,
    inventario_id INTEGER REFERENCES inventario(id) ON DELETE CASCADE,
    programa_id INTEGER NOT NULL
);
