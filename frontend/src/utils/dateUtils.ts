/**
 * Utilidades para manejo de fechas en el frontend
 * Corrige problemas de zona horaria usando valores UTC
 */

/**
 * Formatea una fecha con hora completa - VERSIÓN CORREGIDA
 */
export const formatearFechaConHora = (fechaString?: string): string => {
  if (!fechaString) return 'No disponible';
  
  try {
    // Parsear la fecha original
    const fecha = new Date(fechaString);
    
    // Verificar que sea una fecha válida
    if (isNaN(fecha.getTime())) {
      return 'Fecha inválida';
    }
    
    // El truco: usar la fecha UTC y formatearla directamente como si fuera local
    // Esto evita la conversión automática de zona horaria
    const año = fecha.getUTCFullYear();
    const mes = fecha.getUTCMonth();
    const día = fecha.getUTCDate();
    const horas = fecha.getUTCHours();
    const minutos = fecha.getUTCMinutes();
    const segundos = fecha.getUTCSeconds();
    
    // Crear una nueva fecha con los valores UTC como si fueran locales
    const fechaCorregida = new Date(año, mes, día, horas, minutos, segundos);
    
    // Formatear normalmente
    return fechaCorregida.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha sin hora (solo día, mes, año) - VERSIÓN CORREGIDA
 */
export const formatearFechaSoloFecha = (fechaString?: string): string => {
  if (!fechaString) return 'No disponible';
  
  try {
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return 'Fecha inválida';
    
    // Usar valores UTC para evitar problemas de zona horaria
    const año = fecha.getUTCFullYear();
    const mes = fecha.getUTCMonth();
    const día = fecha.getUTCDate();
    
    const fechaCorregida = new Date(año, mes, día);
    
    return fechaCorregida.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha para reportes (con hora pero más compacta) - VERSIÓN CORREGIDA
 */
export const formatearFechaReporte = (fechaString?: string): string => {
  if (!fechaString) return 'No disponible';
  
  try {
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return 'Fecha inválida';
    
    // Usar valores UTC para evitar problemas de zona horaria
    const año = fecha.getUTCFullYear();
    const mes = fecha.getUTCMonth();
    const día = fecha.getUTCDate();
    const horas = fecha.getUTCHours();
    const minutos = fecha.getUTCMinutes();
    
    const fechaCorregida = new Date(año, mes, día, horas, minutos);
    
    return fechaCorregida.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha para tablas (formato corto) - VERSIÓN CORREGIDA
 */
export const formatearFechaTabla = (fechaString?: string): string => {
  if (!fechaString) return 'N/A';
  
  try {
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return 'N/A';
    
    // Usar valores UTC para evitar problemas de zona horaria
    const año = fecha.getUTCFullYear();
    const mes = fecha.getUTCMonth();
    const día = fecha.getUTCDate();
    
    const fechaCorregida = new Date(año, mes, día);
    
    return fechaCorregida.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Obtiene la fecha actual en formato local
 */
export const obtenerFechaActual = (): string => {
  return new Date().toLocaleString('es-ES');
};