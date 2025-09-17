/**
 * Hooks personalizados para el sistema de auditoría.
 * Manejan estados de loading, error y datos con cache básico y refetch automático.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import auditoriaService from '@/services/auditoriaService';
import { 
  HistorialAuditoria, 
  EstadisticasAuditoria, 
  LogAuditoria, 
  FiltrosAuditoria, 
  RespuestaHistorial,
  RegistrarAccionRequest 
} from '@/types';

// Estado base para todos los hooks
interface EstadoBase<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook para el historial de inventario
export const useHistorialInventario = (filtrosIniciales: FiltrosAuditoria = {}) => {
  const [estado, setEstado] = useState<EstadoBase<RespuestaHistorial>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const [filtros, setFiltros] = useState<FiltrosAuditoria>(filtrosIniciales);
  const cacheRef = useRef<Map<string, { data: RespuestaHistorial; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  const obtenerHistorial = useCallback(async (nuevosFiltros?: FiltrosAuditoria) => {
    const filtrosAUsar = nuevosFiltros || filtros;
    const cacheKey = JSON.stringify(filtrosAUsar);
    
    // Verificar cache
    const cacheEntry = cacheRef.current.get(cacheKey);
    if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION) {
      setEstado({
        data: cacheEntry.data,
        loading: false,
        error: null,
      });
      return cacheEntry.data;
    }

    setEstado(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await auditoriaService.obtenerHistorial(filtrosAUsar);
      
      // Guardar en cache
      cacheRef.current.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      
      setEstado({
        data,
        loading: false,
        error: null,
      });
      
      return data;
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error desconocido';
      setEstado({
        data: null,
        loading: false,
        error: mensajeError,
      });
      throw error;
    }
  }, [filtros]);

  const aplicarFiltros = useCallback((nuevosFiltros: FiltrosAuditoria) => {
    setFiltros(nuevosFiltros);
    obtenerHistorial(nuevosFiltros);
  }, [obtenerHistorial]);

  const limpiarFiltros = useCallback(() => {
    const filtrosVacios = { page: 1, limit: 50 };
    setFiltros(filtrosVacios);
    obtenerHistorial(filtrosVacios);
  }, [obtenerHistorial]);

  const refetch = useCallback(() => {
    // Limpiar cache y recargar
    cacheRef.current.clear();
    obtenerHistorial();
  }, [obtenerHistorial]);

  const cambiarPagina = useCallback((nuevaPagina: number) => {
    const nuevosFiltros = { ...filtros, page: nuevaPagina };
    aplicarFiltros(nuevosFiltros);
  }, [filtros, aplicarFiltros]);

  useEffect(() => {
    obtenerHistorial();
  }, []);

  return {
    ...estado,
    filtros,
    obtenerHistorial,
    aplicarFiltros,
    limpiarFiltros,
    refetch,
    cambiarPagina,
  };
};

// Hook para estadísticas de auditoría
export const useEstadisticasAuditoria = () => {
  const [estado, setEstado] = useState<EstadoBase<EstadisticasAuditoria>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const cacheRef = useRef<{ data: EstadisticasAuditoria; timestamp: number } | null>(null);
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

  const obtenerEstadisticas = useCallback(async () => {
    // Verificar cache
    if (cacheRef.current && Date.now() - cacheRef.current.timestamp < CACHE_DURATION) {
      setEstado({
        data: cacheRef.current.data,
        loading: false,
        error: null,
      });
      return cacheRef.current.data;
    }

    setEstado(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await auditoriaService.obtenerEstadisticas();
      
      // Guardar en cache
      cacheRef.current = {
        data,
        timestamp: Date.now(),
      };
      
      setEstado({
        data,
        loading: false,
        error: null,
      });
      
      return data;
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error desconocido';
      setEstado({
        data: null,
        loading: false,
        error: mensajeError,
      });
      throw error;
    }
  }, []);

  const refetch = useCallback(() => {
    cacheRef.current = null;
    obtenerEstadisticas();
  }, [obtenerEstadisticas]);

  useEffect(() => {
    obtenerEstadisticas();
  }, []);

  return {
    ...estado,
    obtenerEstadisticas,
    refetch,
  };
};

// Hook para logs técnicos
export const useLogs = (pageInicial: number = 1, limitInicial: number = 100) => {
  const [estado, setEstado] = useState<EstadoBase<LogAuditoria[]>>({
    data: null,
    loading: false,
    error: null,
  });
  
  const [page, setPage] = useState(pageInicial);
  const [limit, setLimit] = useState(limitInicial);
  const [nivel, setNivel] = useState<string | undefined>();

  const obtenerLogs = useCallback(async (nuevaPage?: number, nuevoLimit?: number, nuevoNivel?: string) => {
    const pageAUsar = nuevaPage ?? page;
    const limitAUsar = nuevoLimit ?? limit;
    const nivelAUsar = nuevoNivel ?? nivel;

    setEstado(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { logs } = await auditoriaService.obtenerLogs(pageAUsar, limitAUsar, nivelAUsar);
      
      setEstado({
        data: logs,
        loading: false,
        error: null,
      });
      
      return logs;
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error desconocido';
      setEstado({
        data: null,
        loading: false,
        error: mensajeError,
      });
      throw error;
    }
  }, [page, limit, nivel]);

  const cambiarPagina = useCallback((nuevaPage: number) => {
    setPage(nuevaPage);
    obtenerLogs(nuevaPage);
  }, [obtenerLogs]);

  const cambiarLimit = useCallback((nuevoLimit: number) => {
    setLimit(nuevoLimit);
    setPage(1); // Resetear a la primera página
    obtenerLogs(1, nuevoLimit);
  }, [obtenerLogs]);

  const filtrarPorNivel = useCallback((nuevoNivel?: string) => {
    setNivel(nuevoNivel);
    setPage(1); // Resetear a la primera página
    obtenerLogs(1, limit, nuevoNivel);
  }, [limit, obtenerLogs]);

  const refetch = useCallback(() => {
    obtenerLogs();
  }, [obtenerLogs]);

  useEffect(() => {
    obtenerLogs();
  }, []);

  return {
    ...estado,
    page,
    limit,
    nivel,
    obtenerLogs,
    cambiarPagina,
    cambiarLimit,
    filtrarPorNivel,
    refetch,
  };
};

// Hook para exportación de auditoría
export const useExportarAuditoria = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportarCSV = useCallback(async (filtros: FiltrosAuditoria = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const blob = await auditoriaService.exportarCSV(filtros);
      auditoriaService.descargarCSV(blob);
      return true;
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error desconocido';
      setError(mensajeError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    exportarCSV,
    limpiarError,
  };
};

// Hook para registrar acciones manuales
export const useRegistrarAccion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrarAccion = useCallback(async (datos: RegistrarAccionRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await auditoriaService.registrarAccion(datos);
      return resultado;
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error desconocido';
      setError(mensajeError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    registrarAccion,
    limpiarError,
  };
};

// Hook compuesto que combina todas las funcionalidades
export const useAuditoria = (filtrosIniciales: FiltrosAuditoria = {}) => {
  const historial = useHistorialInventario(filtrosIniciales);
  const estadisticas = useEstadisticasAuditoria();
  const logs = useLogs();
  const exportar = useExportarAuditoria();
  const registrar = useRegistrarAccion();

  const refetchTodo = useCallback(() => {
    historial.refetch();
    estadisticas.refetch();
    logs.refetch();
  }, [historial.refetch, estadisticas.refetch, logs.refetch]);

  return {
    historial,
    estadisticas,
    logs,
    exportar,
    registrar,
    refetchTodo,
  };
};

export default useAuditoria;