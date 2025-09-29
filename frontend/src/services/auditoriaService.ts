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
   * Obtiene el icono asociado a un tipo de acción  
   */
  obtenerIconoAccion: (accion: string): string => {
    const iconos = {
      'agregado': '➕',
      'modificado': '✏️',
      'eliminado': '🗑️',
      'cambio_estado': '🔄',
      'usuario_registrado': '👤',
      'login': '🔑',
      'logout': '🚪',
      'reporte_generado': '📊'
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
  },

  /**
   * Formatea una fecha para mostrar en la UI con tiempo relativo
   */
  formatearFecha: (fechaString: string): string => {
    try {
      const fecha = new Date(fechaString);
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        return 'Fecha inválida';
      }

      const ahora = new Date();
      const diferencia = ahora.getTime() - fecha.getTime();
      const segundos = Math.floor(diferencia / 1000);
      const minutos = Math.floor(segundos / 60);
      const horas = Math.floor(minutos / 60);
      const dias = Math.floor(horas / 24);

      // Mostrar tiempo relativo si es reciente
      if (segundos < 60) {
        return 'Hace unos segundos';
      } else if (minutos < 60) {
        return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
      } else if (horas < 24) {
        return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
      } else if (dias < 7) {
        return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
      } else {
        // Mostrar fecha completa
        return fecha.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
    }
  },

  /**
   * Obtiene el color correspondiente a una acción
   */
  obtenerColorAccion: (accion: string): string => {
    const colores: Record<string, string> = {
      'agregado': '#16a34a',      // Verde - Agregar
      'modificado': '#2563eb',    // Azul - Modificar
      'eliminado': '#dc2626',     // Rojo - Eliminar
      'cambio_estado': '#ea580c', // Naranja - Cambio de estado
      'usuario_registrado': '#7c3aed', // Púrpura - Usuario nuevo
      'login': '#059669',         // Verde oscuro - Login
      'logout': '#64748b',        // Gris - Logout
      'reporte_generado': '#0891b2', // Cian - Reportes
      'default': '#6b7280'        // Gris por defecto
    };

    return colores[accion] || colores['default'];
  },

  /**
   * Genera una descripción legible de la acción
   */
  obtenerDescripcionAccion: (registro: HistorialAuditoria): string => {
    const { accion, datos_anteriores, datos_nuevos } = registro;

    // Si hay una descripción personalizada en datos_nuevos, usarla
    if (datos_nuevos?.descripcion_accion) {
      return datos_nuevos.descripcion_accion;
    }

    // Generar descripción basada en la acción
    switch (accion) {
      case 'cambio_estado':
        const estadoAnterior = datos_anteriores?.estado || 'N/A';
        const estadoNuevo = datos_nuevos?.estado || 'N/A';
        const equipo = datos_nuevos?.equipo || registro.nombre_equipo || 'N/A';
        return `Cambio de estado de '${estadoAnterior}' a '${estadoNuevo}' en equipo ${equipo}`;

      case 'usuario_registrado':
        const username = datos_nuevos?.username || 'N/A';
        return `Nuevo usuario '${username}' registrado en el sistema`;

      case 'login':
        const loginUser = datos_nuevos?.username || 'N/A';
        return `Usuario '${loginUser}' inició sesión`;

      case 'logout':
        const logoutUser = datos_nuevos?.username || 'N/A';
        return `Usuario '${logoutUser}' cerró sesión`;

      case 'agregado':
        const nombrePcNuevo = datos_nuevos?.nombre_pc || registro.nombre_equipo || 'N/A';
        const codigoNuevo = datos_nuevos?.codigo_inventario || registro.numero_serie || 'N/A';
        return `Equipo '${nombrePcNuevo}' (Código: ${codigoNuevo}) agregado al inventario`;

      case 'modificado':
        const nombrePcMod = datos_nuevos?.nombre_pc || datos_anteriores?.nombre_pc || registro.nombre_equipo || 'N/A';
        
        // Detectar qué campos cambiaron
        const camposDetectados = auditoriaService.detectarCambios(datos_anteriores, datos_nuevos);
        if (camposDetectados.length > 0) {
          return `Equipo '${nombrePcMod}' modificado: ${camposDetectados.join(', ')}`;
        }
        return `Equipo '${nombrePcMod}' modificado`;

      case 'eliminado':
        const nombrePcEliminado = datos_anteriores?.nombre_pc || registro.nombre_equipo || 'N/A';
        const codigoEliminado = datos_anteriores?.codigo_inventario || registro.numero_serie || 'N/A';
        return `Equipo '${nombrePcEliminado}' (Código: ${codigoEliminado}) eliminado del inventario`;

      case 'reporte_generado':
        const tipoReporte = datos_nuevos?.tipo_reporte || 'N/A';
        const cantidad = datos_nuevos?.cantidad_registros || 0;
        return `Reporte '${tipoReporte}' generado con ${cantidad} registros`;

      default:
        return `Acción '${accion}' realizada`;
    }
  },

  /**
   * Detecta qué campos cambiaron entre datos anteriores y nuevos
   */
  detectarCambios: (datosAnteriores: any, datosNuevos: any): string[] => {
    if (!datosAnteriores || !datosNuevos) return [];

    const camposImportantes = {
      'nombre_pc': 'Nombre del PC',
      'nombres_funcionario': 'Funcionario',
      'estado': 'Estado',
      'direccion_ip': 'Dirección IP',
      'direccion_mac': 'Dirección MAC',
      'dependencia_id': 'Dependencia',
      'tipo_equipo_id': 'Tipo de Equipo'
    };

    const cambios: string[] = [];

    for (const [campo, nombre] of Object.entries(camposImportantes)) {
      if (datosAnteriores[campo] !== datosNuevos[campo]) {
        cambios.push(nombre);
      }
    }

    return cambios;
  },

};

export default auditoriaService;