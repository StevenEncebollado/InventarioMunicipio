// Tipos basados en la estructura real de la base de datos

export interface Usuario {
  id: number;
  username: string;
  password?: string; // Solo para crear/actualizar
}

export interface Dependencia {
  id: number;
  nombre: string;
}

export interface DireccionArea {
  id: number;
  nombre: string;
}

export interface Dispositivo {
  id: number;
  nombre: string;
}

export interface Equipamiento {
  id: number;
  nombre: string;
}

export interface TipoEquipo {
  id: number;
  nombre: string;
}

export interface TipoSistemaOperativo {
  id: number;
  nombre: string;
}

export interface Caracteristicas {
  id: number;
  descripcion: string;
}

export interface Ram {
  id: number;
  capacidad: string;
}

export interface Disco {
  id: number;
  capacidad: string;
}

export interface Office {
  id: number;
  version: string;
}

export interface Marca {
  id: number;
  nombre: string;
}

export interface TipoConexion {
  id: number;
  nombre: string;
}

export interface ProgramaAdicional {
  id: number;
  nombre: string;
}

// Estructura real del inventario según la BD
export interface Inventario {
  id: number;
  usuario_id: number;
  dependencia_id: number;
  direccion_area_id: number;
  dispositivo_id: number;
  direccion_ip: string;
  direccion_mac: string;
  nombre_pc: string;
  nombres_funcionario: string;
  equipamiento_id: number;
  tipo_equipo_id: number;
  tipo_sistema_operativo_id: number;
  caracteristicas_id: number;
  ram_id: number;
  disco_id: number;
  office_id: number;
  marca_id: number;
  codigo_inventario: string;
  tipo_conexion_id: number;
  anydesk?: string;
  fecha_registro: string;
}

// Alias para mantener compatibilidad con el código existente
export interface Equipo extends Inventario {
  // Campos calculados/expandidos que el backend debería devolver
  usuario?: string;
  dependencia?: string;
  direccion_area?: string;
  dispositivo?: string;
  equipamiento?: string;
  tipo_equipo?: string;
  tipo_sistema_operativo?: string;
  caracteristicas?: string;
  ram?: string;
  disco?: string;
  office?: string;
  marca?: string;
  tipo_conexion?: string;
  estado?: 'Activo' | 'Inactivo' | 'Mantenimiento';
}

export interface HistorialEquipo {
  id: number;
  equipo_id: number;
  accion: 'creado' | 'modificado' | 'asignado' | 'mantenimiento' | 'dado_de_baja';
  descripcion: string;
  usuario_id: number;
  fecha: string;
}

// Tipos para formularios
export interface EquipoFormData extends Omit<Equipo, 'id'> {
  id?: number;
}

export interface UsuarioFormData extends Omit<Usuario, 'id' | 'fecha_creacion'> {
  id?: number;
  password?: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  token?: string;
}

// Tipos para filtros y búsquedas
export interface FiltrosEquipo {
  tipo_equipo?: string;
  marca?: string;
  estado?: Equipo['estado'];
  dependencia?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface OpcionesPaginacion {
  pagina: number;
  limite: number;
  total?: number;
}

// Tipos para reportes
export interface ReporteEquipos {
  total_equipos: number;
  por_estado: Record<string, number>;
  por_tipo: Record<string, number>;
  por_dependencia: Record<string, number>;
  valor_total?: number;
}

// Tipos de configuración
export interface ConfiguracionApp {
  api_url: string;
  items_por_pagina: number;
  auto_logout_minutos: number;
}
