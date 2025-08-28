import type { 
  Usuario, 
  Equipo, 
  EquipoFormData, 
  LoginResponse, 
  FiltrosEquipo,
  ReporteEquipos
} from '../types';

// Configuración
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081', // Usar el proxy Python
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const APP_CONFIG = {
  session: {
    storageKey: 'inventario_user_session',
    tokenKey: 'inventario_auth_token',
  },
} as const;

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Cliente API optimizado con funcionalidades clave
class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers 
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new ApiError(`Error ${response.status}: ${response.statusText}`, response.status);
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Timeout: La petición tardó demasiado');
      }
      throw new ApiError('Error de conexión con el servidor');
    }
  }

  get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(`${endpoint}${query}`);
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const api = ApiClient.getInstance();

// Servicios optimizados
export const login = (username: string, password: string): Promise<LoginResponse> =>
  api.post<LoginResponse>('/usuarios/login', { username, password });

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(APP_CONFIG.session.storageKey);
    localStorage.removeItem(APP_CONFIG.session.tokenKey);
  }
};

// Usuarios
export const getUsuarios = (): Promise<Usuario[]> => api.get<Usuario[]>('/usuarios');
export const createUsuario = (usuario: Omit<Usuario, 'id' | 'fecha_creacion'>): Promise<Usuario> =>
  api.post<Usuario>('/usuarios', usuario);
export const updateUsuario = (id: number, usuario: Partial<Usuario>): Promise<Usuario> =>
  api.put<Usuario>(`/usuarios/${id}`, usuario);
export const deleteUsuario = (id: number): Promise<void> => api.delete<void>(`/usuarios/${id}`);

// Equipos
export const getEquipos = (filtros?: FiltrosEquipo): Promise<Equipo[]> => {
  const params = filtros ? 
    Object.entries(filtros)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {}) : 
    undefined;
  return api.get<Equipo[]>('/inventario', params);
};

export const getEquipo = (id: number): Promise<Equipo> => api.get<Equipo>(`/inventario/${id}`);
export const createEquipo = (equipo: EquipoFormData): Promise<Equipo> =>
  api.post<Equipo>('/inventario', equipo);
export const updateEquipo = (id: number, equipo: Partial<EquipoFormData>): Promise<Equipo> =>
  api.put<Equipo>(`/inventario/${id}`, equipo);
export const deleteEquipo = (id: number): Promise<void> => api.delete<void>(`/inventario/${id}`);

// Reportes
export const getReporteEquipos = (): Promise<ReporteEquipos> =>
  api.get<ReporteEquipos>('/reportes/inventario_general');

// Catálogos
export const getTiposEquipo = (): Promise<Array<{ id: number; nombre: string }>> =>
  api.get<Array<{ id: number; nombre: string }>>('/catalogos/tipo_equipo');
export const getMarcas = (): Promise<Array<{ id: number; nombre: string }>> =>
  api.get<Array<{ id: number; nombre: string }>>('/catalogos/marca');
export const getDependencias = (): Promise<Array<{ id: number; nombre: string }>> =>
  api.get<Array<{ id: number; nombre: string }>>('/catalogos/dependencias');
export const getDirecciones = (): Promise<Array<{ id: number; nombre: string }>> =>
  api.get<Array<{ id: number; nombre: string }>>('/catalogos/direcciones');
export const getDispositivos = (): Promise<Array<{ id: number; nombre: string }>> =>
  api.get<Array<{ id: number; nombre: string }>>('/catalogos/dispositivos');
export const getEquipamientos = (): Promise<Array<{ id: number; nombre: string }>> =>
  api.get<Array<{ id: number; nombre: string }>>('/catalogos/equipamientos');
export const getSistemasOperativos = (): Promise<Array<{ id: number; nombre: string }>> =>
  api.get<Array<{ id: number; nombre: string }>>('/catalogos/tipo_sistema_operativo');
export const getCaracteristicas = (): Promise<Array<{ id: number; descripcion: string }>> =>
  api.get<Array<{ id: number; descripcion: string }>>('/catalogos/caracteristicas');
export const getRam = (): Promise<Array<{ id: number; capacidad: string }>> =>
  api.get<Array<{ id: number; capacidad: string }>>('/catalogos/ram');
export const getDisco = (): Promise<Array<{ id: number; capacidad: string }>> =>
  api.get<Array<{ id: number; capacidad: string }>>('/catalogos/disco');
export const getOffice = (): Promise<Array<{ id: number; version: string }>> =>
  api.get<Array<{ id: number; version: string }>>('/catalogos/office');
export const getTipoConexion = (): Promise<Array<{ id: number; nombre: string }>> =>
  api.get<Array<{ id: number; nombre: string }>>('/catalogos/tipo_conexion');
export const getProgramaAdicional = (): Promise<Array<{ id: number; nombre: string }>> =>
  api.get<Array<{ id: number; nombre: string }>>('/catalogos/programas_adicionales');

// Utilidades
export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    // Si el backend envía el mensaje personalizado, mostrarlo
    if (error.status === 401 && error.message.includes('Tu usuario o contraseña son incorrectos')) {
      return 'Tu usuario o contraseña son incorrectos';
    }
    // Evitar mostrar el mensaje genérico de Unauthorized
    if (error.status === 401 && error.message.includes('Unauthorized')) {
      return 'Tu usuario o contraseña son incorrectos';
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
};
