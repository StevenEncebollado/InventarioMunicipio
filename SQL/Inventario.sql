-- Script SQL 

CREATE TABLE dependencia (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE direccion_area (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE dispositivo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE equipamiento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE tipo_equipo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE tipo_sistema_operativo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE caracteristicas (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ram (
    id SERIAL PRIMARY KEY,
    capacidad VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE disco (
    id SERIAL PRIMARY KEY,
    capacidad VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE office (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE marca (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE tipo_conexion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE programa_adicional (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla principal de inventario
CREATE TABLE inventario (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id),
    dependencia_id INTEGER REFERENCES dependencia(id),
    direccion_area_id INTEGER REFERENCES direccion_area(id),
    dispositivo_id INTEGER REFERENCES dispositivo(id),
    direccion_ip VARCHAR(50) NOT NULL,
    direccion_mac VARCHAR(50) NOT NULL,
    nombre_pc VARCHAR(100) NOT NULL,
    nombres_funcionario VARCHAR(100) NOT NULL,
    equipamiento_id INTEGER REFERENCES equipamiento(id),
    tipo_equipo_id INTEGER REFERENCES tipo_equipo(id),
    tipo_sistema_operativo_id INTEGER REFERENCES tipo_sistema_operativo(id),
    caracteristicas_id INTEGER REFERENCES caracteristicas(id),
    ram_id INTEGER REFERENCES ram(id),
    disco_id INTEGER REFERENCES disco(id),
    office_id INTEGER REFERENCES office(id),
    marca_id INTEGER REFERENCES marca(id),
    codigo_inventario VARCHAR(50) NOT NULL UNIQUE,
    tipo_conexion_id INTEGER REFERENCES tipo_conexion(id),
    anydesk VARCHAR(50),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relación muchos a muchos: inventario y programas adicionales
CREATE TABLE inventario_programa (
    inventario_id INTEGER REFERENCES inventario(id) ON DELETE CASCADE,
    programa_id INTEGER REFERENCES programa_adicional(id) ON DELETE CASCADE,
    PRIMARY KEY (inventario_id, programa_id)
);

