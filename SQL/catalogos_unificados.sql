-- Procedimiento almacenado para obtener todos los catálogos en una sola consulta

CREATE OR REPLACE FUNCTION obtener_catalogos_unificados()
RETURNS TABLE (
    dependencia json,
    direccion_area json,
    dispositivo json,
    equipamiento json,
    tipo_equipo json,
    tipo_sistema_operativo json,
    caracteristicas json,
    ram json,
    disco json,
    office json,
    marca json,
    tipo_conexion json,
    programa_adicional json
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, nombre FROM dependencia) t) AS dependencia,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, nombre FROM direccion_area) t) AS direccion_area,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, nombre FROM dispositivo) t) AS dispositivo,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, nombre FROM equipamiento) t) AS equipamiento,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, nombre FROM tipo_equipo) t) AS tipo_equipo,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, nombre FROM tipo_sistema_operativo) t) AS tipo_sistema_operativo,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, descripcion FROM caracteristicas) t) AS caracteristicas,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, capacidad FROM ram) t) AS ram,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, capacidad FROM disco) t) AS disco,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, version FROM office) t) AS office,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, nombre FROM marca) t) AS marca,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, nombre FROM tipo_conexion) t) AS tipo_conexion,
        (SELECT json_agg(row_to_json(t)) FROM (SELECT id, nombre FROM programa_adicional) t) AS programa_adicional;
END;
$$ LANGUAGE plpgsql;
