// Tipos principales del sistema de inventario

export interface Usuario {
  id: number;
  username: string;
  email?: string;
  rol: 'admin' | 'usuario' | 'readonly';
  activo: boolean;
  fecha_creacion: string;
}

export interface Dependencia {
  id: number;
  nombre: string;
  descripcion?: string;
  codigo?: string;
}

export interface TipoEquipo {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Marca {
  id: number;
  nombre: string;
}

export interface SistemaOperativo {
  id: number;
  nombre: string;
  version?: string;
}

export interface Equipo {
  id: number;
  anydesk?: string;
  caracteristicas_id?: number;
  codigo_inventario?: string;
  dependencia_id?: number;
  direccion_area_id?: number;
  direccion_ip?: string;
  direccion_mac?: string;
  disco_id?: number | null;
  dispositivo_id?: number | null;
  equipamiento_id?: number;
  fecha_registro?: string;
  marca_id?: number;
  nombre_pc?: string;
  nombres_funcionario?: string;
  office_id?: number;
  ram_id?: number;
  tipo_conexion_id?: number;
  tipo_equipo_id?: number;
  tipo_sistema_operativo_id?: number;
  usuario_id?: number;
  estado: 'Activo' | 'Mantenimiento' | 'Inactivo';
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
  rol: Usuario['rol'];
  token?: string;
}

// Tipos para filtros y búsquedas
export interface FiltrosEquipo {
  tipo_equipo?: string;
  marca?: string;
  // estado eliminado, ya no existe en Equipo
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
  // por_estado eliminado, ya no existe 'estado' en Equipo
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
