-- Agrega el campo dependencia_id a la tabla direccion_area
ALTER TABLE direccion_area ADD COLUMN dependencia_id INTEGER REFERENCES dependencia(id);
