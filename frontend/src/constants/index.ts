/**
 * Constantes del sistema
 * Centraliza todos los valores constantes usados en la aplicación
 */

// === ESTADOS DE EQUIPOS ===
export const EQUIPMENT_STATES = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  MAINTENANCE: 'Mantenimiento',
  DECOMMISSIONED: 'Dado de baja',
} as const;

export const EQUIPMENT_STATE_OPTIONS = [
  { value: EQUIPMENT_STATES.ACTIVE, label: 'Activo', color: 'success' },
  { value: EQUIPMENT_STATES.INACTIVE, label: 'Inactivo', color: 'danger' },
  { value: EQUIPMENT_STATES.MAINTENANCE, label: 'Mantenimiento', color: 'warning' },
  { value: EQUIPMENT_STATES.DECOMMISSIONED, label: 'Dado de baja', color: 'secondary' },
] as const;

// === ROLES DE USUARIO ===
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'usuario',
  READONLY: 'readonly',
} as const;

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.ADMIN, label: 'Administrador', description: 'Acceso completo al sistema' },
  { value: USER_ROLES.USER, label: 'Usuario', description: 'Puede gestionar equipos' },
  { value: USER_ROLES.READONLY, label: 'Solo lectura', description: 'Solo puede ver información' },
] as const;

// === RUTAS DE LA APLICACIÓN ===
export const ROUTES = {
  HOME: '/',
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  EQUIPMENT: {
    LIST: '/dashboard/equipos',
    CREATE: '/dashboard/equipos/nuevo',
    EDIT: (id: number) => `/dashboard/equipos/${id}/editar`,
    VIEW: (id: number) => `/dashboard/equipos/${id}`,
  },
  USERS: {
    LIST: '/dashboard/usuarios',
    CREATE: '/dashboard/usuarios/nuevo',
    EDIT: (id: number) => `/dashboard/usuarios/${id}/editar`,
    VIEW: (id: number) => `/dashboard/usuarios/${id}`,
  },
  REPORTS: '/dashboard/reportes',
  CATALOGS: '/dashboard/catalogos',
} as const;

// === CONFIGURACIÓN DE PAGINACIÓN ===
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_SIZE: 100,
} as const;

// === CONFIGURACIÓN DE FORMULARIOS ===
export const FORM_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_PASSWORD_LENGTH: 6,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
  VALIDATION_MESSAGES: {
    REQUIRED: 'Este campo es requerido',
    MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
    MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
    INVALID_EMAIL: 'Email inválido',
    INVALID_DATE: 'Fecha inválida',
    INVALID_NUMBER: 'Número inválido',
  },
} as const;

// === CONFIGURACIÓN DE MENSAJES ===
export const MESSAGES = {
  SUCCESS: {
    CREATED: 'Registro creado exitosamente',
    UPDATED: 'Registro actualizado exitosamente',
    DELETED: 'Registro eliminado exitosamente',
    SAVED: 'Guardado exitosamente',
    LOGIN: 'Sesión iniciada correctamente',
    LOGOUT: 'Sesión cerrada correctamente',
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Verifique su conexión a internet',
    UNAUTHORIZED: 'No tiene permisos para realizar esta acción',
    NOT_FOUND: 'Recurso no encontrado',
    VALIDATION: 'Por favor, corrija los errores en el formulario',
    LOGIN_FAILED: 'Usuario o contraseña incorrectos',
    SESSION_EXPIRED: 'Su sesión ha expirado. Inicie sesión nuevamente',
  },
  CONFIRMATION: {
    DELETE: '¿Está seguro que desea eliminar este registro?',
    UNSAVED_CHANGES: 'Tiene cambios sin guardar. ¿Desea continuar?',
    LOGOUT: '¿Está seguro que desea cerrar sesión?',
  },
} as const;

// === CONFIGURACIÓN DE TABLA ===
export const TABLE_CONFIG = {
  DEFAULT_SORT_DIRECTION: 'asc' as const,
  EMPTY_DATA_MESSAGE: 'No hay datos para mostrar',
  LOADING_MESSAGE: 'Cargando...',
  ERROR_MESSAGE: 'Error cargando datos',
} as const;

// === CONFIGURACIÓN DE ESTILOS ===
export const THEME = {
  COLORS: {
    PRIMARY: '#007bff',
    SUCCESS: '#28a745',
    WARNING: '#ffc107',
    DANGER: '#dc3545',
    INFO: '#17a2b8',
    SECONDARY: '#6c757d',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
  },
  BREAKPOINTS: {
    XS: '0px',
    SM: '576px',
    MD: '768px',
    LG: '992px',
    XL: '1200px',
    XXL: '1400px',
  },
} as const;

// === CONFIGURACIÓN DE VALIDACIÓN ===
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[0-9\s\-\(\)]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  SERIAL_NUMBER: /^[A-Z0-9\-]+$/,
} as const;

// === CONFIGURACIÓN DE FORMATO ===
export const FORMAT = {
  DATE: 'dd/MM/yyyy',
  DATETIME: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm',
  CURRENCY: 'es-CO',
  NUMBER: 'es-ES',
} as const;

// === TIPOS DE EXPORTACIÓN ===
export type EquipmentState = typeof EQUIPMENT_STATES[keyof typeof EQUIPMENT_STATES];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type MessageType = 'success' | 'error' | 'warning' | 'info';
export type SortDirection = 'asc' | 'desc';
