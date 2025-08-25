-- Script para crear la tabla de inventario de equipos informáticos
CREATE TABLE inventario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    direccion_ip VARCHAR(50),
    direccion_mac VARCHAR(50),
    nombre_pc VARCHAR(100),
    nombres_funcionario VARCHAR(100),
    dependencia VARCHAR(100),
    direccion_area VARCHAR(100),
    dispositivo VARCHAR(50),
    equipamiento VARCHAR(50),
    tipo_equipo VARCHAR(50),
    tipo_sistema_operativo VARCHAR(50),
    caracteristicas VARCHAR(255),
    ram VARCHAR(20),
    disco VARCHAR(20),
    office VARCHAR(20),
    marca VARCHAR(50),
    codigo_inventario VARCHAR(50),
    tipo_conexion VARCHAR(20),
    anydesk VARCHAR(50),
    programas_adicionales VARCHAR(255)
);

-- Puedes agregar tablas auxiliares para los campos tipo select si lo deseas.
