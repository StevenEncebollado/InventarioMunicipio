/**
 * Servicio para el sistema de auditoría del inventario municipal.
 * Maneja todas las llamadas a la API de auditoría con manejo de errores y estados de carga.
 */

import { 
  HistorialAuditoria, 
  EstadisticasAuditoria, 
  LogAuditoria, 
  FiltrosAuditoria, 
  RespuestaHistorial,
  ExportarAuditoriaRequest,
  RegistrarAccionRequest 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Función helper para manejo de errores
const manejarRespuesta = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Función helper para construir parámetros de consulta
const construirParametrosConsulta = (filtros: FiltrosAuditoria): string => {
  const params = new URLSearchParams();
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  return params.toString();
};

export const auditoriaService = {
  /**
   * Obtiene el historial de auditoría con filtros y paginación
   */
  obtenerHistorial: async (filtros: FiltrosAuditoria = {}): Promise<RespuestaHistorial> => {
    try {
      const parametros = construirParametrosConsulta(filtros);
      const url = `${API_BASE_URL}/auditoria/historial${parametros ? `?${parametros}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      return await manejarRespuesta(response);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw new Error(`Error al cargar el historial: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  /**
   * Obtiene estadísticas de auditoría
   */
  obtenerEstadisticas: async (): Promise<EstadisticasAuditoria> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auditoria/estadisticas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      return await manejarRespuesta(response);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error(`Error al cargar las estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  /**
   * Obtiene logs técnicos detallados
   */
  obtenerLogs: async (page: number = 1, limit: number = 100, nivel?: string): Promise<{ logs: LogAuditoria[] }> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (nivel) {
        params.append('nivel', nivel);
      }

      const response = await fetch(`${API_BASE_URL}/auditoria/logs?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      return await manejarRespuesta(response);
    } catch (error) {
      console.error('Error al obtener logs:', error);
      throw new Error(`Error al cargar los logs: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  /**
   * Exporta datos de auditoría en CSV
   */
  exportarCSV: async (filtros: FiltrosAuditoria = {}): Promise<Blob> => {
    try {
      const requestData: ExportarAuditoriaRequest = {
        filtros,
        formato: 'csv'
      };

      const response = await fetch(`${API_BASE_URL}/auditoria/exportar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      throw new Error(`Error al exportar los datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  /**
   * Registra una acción manual en el historial
   */
  registrarAccion: async (datos: RegistrarAccionRequest): Promise<{ id: number; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auditoria/registrar-accion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(datos),
      });

      return await manejarRespuesta(response);
    } catch (error) {
      console.error('Error al registrar acción:', error);
      throw new Error(`Error al registrar la acción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  /**
   * Descarga un archivo CSV desde un blob
   */
  descargarCSV: (blob: Blob, nombreArchivo?: string): void => {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo || `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Agregar al DOM, hacer clic y remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar el URL del objeto
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar CSV:', error);
      throw new Error('Error al descargar el archivo');
    }
  },

  /**
   * Formatea una fecha para mostrar en la UI
   */
  formatearFecha: (fecha: string): string => {
    try {
      return new Date(fecha).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fecha;
    }
  },

  /**
   * Obtiene el color asociado a un tipo de acción
   */
  obtenerColorAccion: (accion: string): string => {
    const colores = {
      'agregado': '#10b981', // Verde
      'modificado': '#f59e0b', // Amarillo/Naranja
      'eliminado': '#ef4444', // Rojo
    };
    return colores[accion as keyof typeof colores] || '#6b7280'; // Gris por defecto
  },

  /**
   * Obtiene el icono asociado a un tipo de acción
   */
  obtenerIconoAccion: (accion: string): string => {
    const iconos = {
      'agregado': '➕',
      'modificado': '✏️',
      'eliminado': '🗑️',
    };
    return iconos[accion as keyof typeof iconos] || '📝';
  },

  /**
   * Valida filtros de auditoría
   */
  validarFiltros: (filtros: FiltrosAuditoria): { valido: boolean; errores: string[] } => {
    const errores: string[] = [];

    if (filtros.fechaInicio && filtros.fechaFin) {
      const inicio = new Date(filtros.fechaInicio);
      const fin = new Date(filtros.fechaFin);
      
      if (inicio > fin) {
        errores.push('La fecha de inicio debe ser menor o igual a la fecha de fin');
      }
      
      const hoy = new Date();
      if (inicio > hoy) {
        errores.push('La fecha de inicio no puede ser futura');
      }
    }

    if (filtros.page && filtros.page < 1) {
      errores.push('El número de página debe ser mayor a 0');
    }

    if (filtros.limit && (filtros.limit < 1 || filtros.limit > 100)) {
      errores.push('El límite debe estar entre 1 y 100');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }
};

export default auditoriaService;