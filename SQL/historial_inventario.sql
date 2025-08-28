-- Tabla para historial de acciones sobre el inventario
CREATE TABLE historial_inventario (
    id SERIAL PRIMARY KEY,
    inventario_id INTEGER REFERENCES inventario(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuario(id),
    accion VARCHAR(20) NOT NULL, -- 'agregado', 'modificado', 'eliminado'
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos_anteriores JSONB,
    datos_nuevos JSONB
);
