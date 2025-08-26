import type { 
  Usuario, 
  Equipo, 
  EquipoFormData, 
  LoginResponse, 
  FiltrosEquipo,
  ReporteEquipos,
  Inventario,
  TipoEquipo,
  Marca,
  Dependencia,
  TipoSistemaOperativo,
  Dispositivo,
  Equipamiento,
  Ram,
  Disco,
  Office,
  TipoConexion,
  DireccionArea,
  Caracteristicas,
  ProgramaAdicional
} from '../types';

// Configuración
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
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
      
      // Error de conexión específico
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          `No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en ${API_CONFIG.BASE_URL}`
        );
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

// Servicios optimizados - URLs corregidas según el backend real
export const login = (username: string, password: string): Promise<LoginResponse> =>
  api.post<LoginResponse>('/auth/login', { username, password });

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(APP_CONFIG.session.storageKey);
    localStorage.removeItem(APP_CONFIG.session.tokenKey);
  }
};

// Usuarios
export const getUsuarios = (): Promise<Usuario[]> => api.get<Usuario[]>('/usuarios');
export const createUsuario = (usuario: Omit<Usuario, 'id'>): Promise<Usuario> =>
  api.post<Usuario>('/usuarios', usuario);
export const updateUsuario = (id: number, usuario: Partial<Usuario>): Promise<Usuario> =>
  api.put<Usuario>(`/usuarios/${id}`, usuario);
export const deleteUsuario = (id: number): Promise<void> => api.delete<void>(`/usuarios/${id}`);

// Inventario - usando las rutas reales del backend
export const getEquipos = (filtros?: FiltrosEquipo): Promise<Inventario[]> => {
  const params = filtros ? 
    Object.entries(filtros)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {}) : 
    undefined;
  return api.get<Inventario[]>('/inventario', params);
};

export const getEquipo = (id: number): Promise<Inventario> => api.get<Inventario>(`/inventario/${id}`);
export const createEquipo = (equipo: EquipoFormData): Promise<Inventario> =>
  api.post<Inventario>('/inventario', equipo);
export const updateEquipo = (id: number, equipo: Partial<EquipoFormData>): Promise<Inventario> =>
  api.put<Inventario>(`/inventario/${id}`, equipo);
export const deleteEquipo = (id: number): Promise<void> => api.delete<void>(`/inventario/${id}`);

// Reportes
export const getReporteEquipos = (): Promise<ReporteEquipos> =>
  api.get<ReporteEquipos>('/reportes/equipos');

// Catálogos - URLs corregidas según rutas reales del backend
export const getTiposEquipo = (): Promise<TipoEquipo[]> =>
  api.get<TipoEquipo[]>('/tipo-equipo');
export const getMarcas = (): Promise<Marca[]> =>
  api.get<Marca[]>('/marca');
export const getDependencias = (): Promise<Dependencia[]> =>
  api.get<Dependencia[]>('/dependencias');
export const getSistemasOperativos = (): Promise<TipoSistemaOperativo[]> =>
  api.get<TipoSistemaOperativo[]>('/tipo-sistema-operativo');

// Catálogos adicionales
export const getDispositivos = (): Promise<Dispositivo[]> => api.get<Dispositivo[]>('/dispositivos');
export const getEquipamientos = (): Promise<Equipamiento[]> => api.get<Equipamiento[]>('/equipamientos');
export const getRam = (): Promise<Ram[]> => api.get<Ram[]>('/ram');
export const getDisco = (): Promise<Disco[]> => api.get<Disco[]>('/disco');
export const getOffice = (): Promise<Office[]> => api.get<Office[]>('/office');
export const getTipoConexion = (): Promise<TipoConexion[]> => api.get<TipoConexion[]>('/tipo-conexion');
export const getDireccionesArea = (): Promise<DireccionArea[]> => api.get<DireccionArea[]>('/direcciones');
export const getCaracteristicas = (): Promise<Caracteristicas[]> => api.get<Caracteristicas[]>('/caracteristicas');
export const getProgramasAdicionales = (): Promise<ProgramaAdicional[]> => api.get<ProgramaAdicional[]>('/programa-adicional');

// Utilidades
export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
};
