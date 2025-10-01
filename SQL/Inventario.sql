-- Tabla de dependencias
CREATE TABLE IF NOT EXISTS dependencia (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- Tabla de inventario/equipos
CREATE TABLE IF NOT EXISTS inventario (
    id SERIAL PRIMARY KEY,
    dependencia_id INTEGER REFERENCES dependencia(id),
    direccion_ip VARCHAR(50),
    direccion_mac VARCHAR(50),
    nombre_pc VARCHAR(100),
    nombre_funcionario VARCHAR(100),
    direccion_area VARCHAR(100),
    institucional_personal VARCHAR(50),
    tipo_equipo VARCHAR(50),
    tipo_sistema_operativo VARCHAR(50),
    caracteristicas TEXT,
    ram VARCHAR(50),
    disco VARCHAR(50),
    office VARCHAR(50),
    cpu_marca VARCHAR(50),
    cpu_doc_inventario VARCHAR(50),
    tipo_conexion VARCHAR(50),
    monitor_marca VARCHAR(50),
    monitor_cod_inventario VARCHAR(50),
    teclado_marca VARCHAR(50),
    teclado_inventario VARCHAR(50),
    mouse_marca VARCHAR(50),
    mouse_cod_inventario VARCHAR(50),
    direccion_anydesk VARCHAR(50),
    contrasena VARCHAR(255),
    programas TEXT,
    indicadores TEXT,
    fecha_registro TIMESTAMP DEFAULT NOW()
);
