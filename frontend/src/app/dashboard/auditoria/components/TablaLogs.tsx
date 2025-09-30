/**
 * Componente optimizado de tabla para logs técnicos detallados.
 * Diseñado para administradores con información técnica avanzada y diseño moderno.
 * Integrado con el sistema de diseño global del proyecto.
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { LogAuditoria } from '@/types';
import auditoriaService from '@/services/auditoriaService';
import { estiloGlobal } from '@/app/Diseño/Estilos/EstiloGlobal';
import { estiloAnimaciones } from '@/app/Diseño/Estilos/EstiloAnimaciones';
import { 
  FaCogs, FaFilter, FaEye, FaTimes, FaInfoCircle, FaExclamationTriangle, 
  FaTimesCircle, FaUser, FaDesktop, FaClock, FaNetworkWired, FaCode, FaDatabase,
  FaServer, FaSearch, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

interface Props {
  logs: LogAuditoria[];
  loading?: boolean;
  onCambiarPagina?: (pagina: number) => void;
  onFiltrarPorNivel?: (nivel?: string) => void;
  page?: number;
  nivel?: string;
}

// Componente principal optimizado con mejor rendimiento y diseño
const TablaLogs: React.FC<Props> = ({
  logs,
  loading = false,
  onCambiarPagina,
  onFiltrarPorNivel,
  page = 1,
  nivel,
}) => {
  const [logSeleccionado, setLogSeleccionado] = useState<LogAuditoria | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vistaMovil, setVistaMovil] = useState(false);

  // Detectar vista móvil
  React.useEffect(() => {
    const checkMobile = () => setVistaMovil(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Callbacks memoizados
  const abrirModal = useCallback((log: LogAuditoria) => {
    setLogSeleccionado(log);
    setModalAbierto(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setLogSeleccionado(null);
  }, []);

  const handleFiltroNivel = useCallback((value: string) => {
    if (onFiltrarPorNivel) {
      onFiltrarPorNivel(value || undefined);
    }
  }, [onFiltrarPorNivel]);

  // Función memoizada para obtener colores por nivel
  const obtenerColorNivel = useCallback((nivelLog: string = 'INFO') => {
    const colores = {
      'INFO': { bg: '#eff6ff', text: '#1e40af', border: '#dbeafe', icon: '#3b82f6' },
      'WARNING': { bg: '#fffbeb', text: '#92400e', border: '#fed7aa', icon: '#f59e0b' },
      'ERROR': { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', icon: '#ef4444' },
    };
    return colores[nivelLog as keyof typeof colores] || { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0', icon: '#94a3b8' };
  }, []);

  // Función memoizada para obtener iconos por nivel
  const obtenerIconoNivel = useCallback((nivelLog: string = 'INFO') => {
    const iconos = {
      'INFO': <FaInfoCircle />,
      'WARNING': <FaExclamationTriangle />,
      'ERROR': <FaTimesCircle />,
    };
    return iconos[nivelLog as keyof typeof iconos] || <FaInfoCircle />;
  }, []);

  // Conteos memoizados por nivel
  const conteosPorNivel = useMemo(() => {
    return {
      INFO: logs.filter(l => l.nivel === 'INFO').length,
      WARNING: logs.filter(l => l.nivel === 'WARNING').length,
      ERROR: logs.filter(l => l.nivel === 'ERROR').length,
      total: logs.length
    };
  }, [logs]);

  // Estado de carga mejorado con shimmer effect
  if (loading && logs.length === 0) {
    return (
      <div style={estilos.contenedor}>
        <div style={estilos.header}>
          <h2 style={estilos.titulo}>
            <FaServer style={{ marginRight: '12px', color: '#4f46e5' }} />
            Logs del Sistema
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ 
              ...estilos.shimmerBg,
              width: '160px',
              height: '36px',
              borderRadius: '8px'
            }} />
            <div style={{ 
              ...estilos.shimmerBg,
              width: '100px',
              height: '36px',
              borderRadius: '8px'
            }} />
          </div>
        </div>

        <div style={estilos.tablaContainer}>
          <div style={estilos.tabla}>
            <div style={estilos.headerRow}>
              <div style={{ ...estilos.th, flex: '1' }}>Fecha</div>
              <div style={{ ...estilos.th, flex: '0.8' }}>Nivel</div>
              <div style={{ ...estilos.th, flex: '2' }}>Evento</div>
              <div style={{ ...estilos.th, flex: '1.2' }}>Usuario</div>
              <div style={{ ...estilos.th, flex: '0.8' }}>IP</div>
              <div style={{ ...estilos.th, flex: '0.8' }}>Acciones</div>
            </div>
            {[...Array(5)].map((_, index) => (
              <div key={index} style={estilos.bodyRow}>
                <div style={{ ...estilos.td, flex: '1' }}>
                  <div style={{ ...estilos.shimmerBg, height: '16px', borderRadius: '4px' }} />
                </div>
                <div style={{ ...estilos.td, flex: '0.8' }}>
                  <div style={{ ...estilos.shimmerBg, height: '20px', width: '60px', borderRadius: '12px' }} />
                </div>
                <div style={{ ...estilos.td, flex: '2' }}>
                  <div style={{ ...estilos.shimmerBg, height: '16px', borderRadius: '4px' }} />
                </div>
                <div style={{ ...estilos.td, flex: '1.2' }}>
                  <div style={{ ...estilos.shimmerBg, height: '16px', borderRadius: '4px' }} />
                </div>
                <div style={{ ...estilos.td, flex: '0.8' }}>
                  <div style={{ ...estilos.shimmerBg, height: '16px', borderRadius: '4px' }} />
                </div>
                <div style={{ ...estilos.td, flex: '0.8' }}>
                  <div style={{ ...estilos.shimmerBg, height: '32px', width: '32px', borderRadius: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.contenedor}>
      {/* Header con estadísticas y filtros */}
      <div style={estilos.header}>
        <div>
          <h2 style={estilos.titulo}>
            <FaServer style={{ marginRight: '12px', color: '#4f46e5' }} />
            Logs del Sistema
          </h2>
          <p style={estilos.descripcion}>
            Información detallada del sistema para administradores
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Filtro por nivel */}
          <div style={estilos.filtroContainer}>
            <FaFilter style={{ color: '#6b7280', marginRight: '8px' }} />
            <select
              value={nivel || ''}
              onChange={(e) => handleFiltroNivel(e.target.value)}
              style={estilos.select}
            >
              <option value="">Todos los niveles</option>
              <option value="INFO">INFO ({conteosPorNivel.INFO})</option>
              <option value="WARNING">WARNING ({conteosPorNivel.WARNING})</option>
              <option value="ERROR">ERROR ({conteosPorNivel.ERROR})</option>
            </select>
          </div>

          {/* Estadísticas rápidas */}
          <div style={estilos.estadisticasContainer}>
            <div style={estilos.estadisticaCard}>
              <FaDatabase style={{ color: '#3b82f6', marginRight: '8px' }} />
              <span style={{ color: '#1f2937', fontWeight: '600' }}>
                {conteosPorNivel.total}
              </span>
              <span style={{ color: '#6b7280', fontSize: '12px' }}>logs</span>
            </div>
            {conteosPorNivel.ERROR > 0 && (
              <div style={{ ...estilos.estadisticaCard, backgroundColor: '#fee2e2', borderColor: '#fecaca' }}>
                <FaTimesCircle style={{ color: '#ef4444', marginRight: '8px' }} />
                <span style={{ color: '#991b1b', fontWeight: '600' }}>
                  {conteosPorNivel.ERROR}
                </span>
                <span style={{ color: '#7f1d1d', fontSize: '12px' }}>errores</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Contenido principal */}
      {logs.length === 0 ? (
        <div style={estilos.estadoVacio}>
          <FaSearch style={{ fontSize: '64px', color: '#e5e7eb', marginBottom: '16px' }} />
          <h3 style={estilos.tituloVacio}>No hay logs disponibles</h3>
          <p style={estilos.descripcionVacio}>
            No se encontraron logs con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div style={estilos.tablaContainer}>
          {vistaMovil ? (
            /* Vista móvil - Cards */
            <div style={estilos.cardsContainer}>
              {logs.map((log) => {
                const colores = obtenerColorNivel(log.nivel);
                return (
                  <div key={log.id} style={estilos.logCard}>
                    <div style={estilos.cardHeader}>
                      <div style={{
                        ...estilos.nivelBadge,
                        backgroundColor: colores.bg,
                        color: colores.text,
                        borderColor: colores.border
                      }}>
                        <span style={{ color: colores.icon, marginRight: '6px' }}>
                          {obtenerIconoNivel(log.nivel)}
                        </span>
                        {log.nivel}
                      </div>
                      <span style={estilos.cardFecha}>
                        {auditoriaService.formatearFecha(log.fecha)}
                      </span>
                    </div>

                    <div style={estilos.cardContent}>
                      <div style={estilos.cardField}>
                        <span style={estilos.fieldLabel}>Usuario:</span>
                        <span style={estilos.fieldValue}>
                          {log.usuario_completo || 'Usuario desconocido'}
                        </span>
                      </div>

                      <div style={estilos.cardField}>
                        <span style={estilos.fieldLabel}>Acción:</span>
                        <span style={{
                          ...estilos.accionBadge,
                          backgroundColor: auditoriaService.obtenerColorAccion(log.accion, log.datos_nuevos) + '20',
                          color: auditoriaService.obtenerColorAccion(log.accion, log.datos_nuevos)
                        }}>
                          {auditoriaService.obtenerIconoAccion(log.accion)}
                          {log.accion.toUpperCase()}
                        </span>
                      </div>

                      {log.nombre_equipo && (
                        <div style={estilos.cardField}>
                          <span style={estilos.fieldLabel}>Equipo:</span>
                          <span style={estilos.fieldValue}>{log.nombre_equipo}</span>
                        </div>
                      )}

                      {log.direccion_ip && (
                        <div style={estilos.cardField}>
                          <span style={estilos.fieldLabel}>IP:</span>
                          <span style={estilos.fieldValue}>{log.direccion_ip}</span>
                        </div>
                      )}
                    </div>

                    <div style={estilos.cardActions}>
                      <button
                        onClick={() => abrirModal(log)}
                        style={estilos.botonDetalles}
                      >
                        <FaEye style={{ marginRight: '6px' }} />
                        Ver detalles
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Vista desktop - Tabla */
            <div style={estilos.tabla}>
              <div style={estilos.headerRow}>
                <div style={{ ...estilos.th, flex: '1' }}>Fecha</div>
                <div style={{ ...estilos.th, flex: '0.8' }}>Nivel</div>
                <div style={{ ...estilos.th, flex: '2' }}>Evento</div>
                <div style={{ ...estilos.th, flex: '1.2' }}>Usuario</div>
                <div style={{ ...estilos.th, flex: '0.8' }}>IP</div>
                <div style={{ ...estilos.th, flex: '0.8' }}>Acciones</div>
              </div>

              {logs.map((log) => {
                const colores = obtenerColorNivel(log.nivel);
                return (
                  <div key={log.id} style={estilos.bodyRow}>
                    <div style={{ ...estilos.td, flex: '1' }}>
                      <span style={estilos.fechaText}>
                        {auditoriaService.formatearFecha(log.fecha)}
                      </span>
                    </div>

                    <div style={{ ...estilos.td, flex: '0.8' }}>
                      <div style={{
                        ...estilos.nivelBadge,
                        backgroundColor: colores.bg,
                        color: colores.text,
                        borderColor: colores.border
                      }}>
                        <span style={{ color: colores.icon, marginRight: '6px' }}>
                          {obtenerIconoNivel(log.nivel)}
                        </span>
                        {log.nivel}
                      </div>
                    </div>

                    <div style={{ ...estilos.td, flex: '2' }}>
                      <div style={estilos.eventoContainer}>
                        <span style={{
                          ...estilos.accionBadge,
                          backgroundColor: auditoriaService.obtenerColorAccion(log.accion, log.datos_nuevos) + '20',
                          color: auditoriaService.obtenerColorAccion(log.accion, log.datos_nuevos)
                        }}>
                          {auditoriaService.obtenerIconoAccion(log.accion)}
                          {log.accion.toUpperCase()}
                        </span>
                        {log.nombre_equipo && (
                          <span style={estilos.equipoText}>
                            en {log.nombre_equipo}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ ...estilos.td, flex: '1.2' }}>
                      <div style={estilos.usuarioContainer}>
                        <span style={estilos.usuarioNombre}>
                          {log.usuario_completo || 'Usuario desconocido'}
                        </span>
                        {log.usuario_email && (
                          <span style={estilos.usuarioEmail}>
                            {log.usuario_email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ ...estilos.td, flex: '0.8' }}>
                      {log.direccion_ip && (
                        <span style={estilos.ipText}>
                          {log.direccion_ip}
                        </span>
                      )}
                    </div>

                    <div style={{ ...estilos.td, flex: '0.8' }}>
                      <button
                        onClick={() => abrirModal(log)}
                        style={estilos.botonAccion}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer con información de paginación */}
          <div style={estilos.footer}>
            <div style={estilos.infoLogs}>
              <FaDatabase style={{ marginRight: '8px', color: '#6b7280' }} />
              Mostrando {logs.length} logs técnicos
            </div>
            
            {onCambiarPagina && (
              <div style={estilos.paginacion}>
                <button
                  onClick={() => onCambiarPagina(page - 1)}
                  disabled={page <= 1}
                  style={{
                    ...estilos.botonPaginacion,
                    ...(page <= 1 ? estilos.botonDeshabilitado : {})
                  }}
                >
                  <FaChevronLeft />
                </button>
                <span style={estilos.paginaActual}>
                  Página {page}
                </span>
                <button
                  onClick={() => onCambiarPagina(page + 1)}
                  style={estilos.botonPaginacion}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modal de detalles optimizado */}
      {logSeleccionado && modalAbierto && (
        <div style={estilos.modal.overlay}>
          <div style={estilos.modal.contenido}>
            <div style={estilos.modal.header}>
              <h3 style={estilos.modal.titulo}>
                <FaServer style={{ marginRight: '12px', color: '#4f46e5' }} />
                Detalles Técnicos - Log #{logSeleccionado.id}
              </h3>
              <button
                onClick={cerrarModal}
                style={estilos.modal.botonCerrar}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fee2e2';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={estilos.modal.body}>
              {/* Grid de información principal */}
              <div style={estilos.modal.grid}>
                <div style={estilos.modal.seccion}>
                  <h4 style={estilos.modal.tituloSeccion}>
                    <FaInfoCircle style={{ marginRight: '8px', color: '#3b82f6' }} />
                    Información del Sistema
                  </h4>
                  <div style={estilos.modal.campos}>
                    <div style={estilos.modal.campo}>
                      <span style={estilos.modal.label}>Log ID:</span>
                      <span style={estilos.modal.valor}>#{logSeleccionado.id}</span>
                    </div>
                    <div style={estilos.modal.campo}>
                      <span style={estilos.modal.label}>Nivel:</span>
                      <div style={{
                        ...estilos.nivelBadge,
                        ...obtenerColorNivel(logSeleccionado.nivel)
                      }}>
                        <span style={{ marginRight: '6px' }}>
                          {obtenerIconoNivel(logSeleccionado.nivel)}
                        </span>
                        {logSeleccionado.nivel}
                      </div>
                    </div>
                    <div style={estilos.modal.campo}>
                      <span style={estilos.modal.label}>Timestamp:</span>
                      <span style={estilos.modal.valorMono}>
                        {auditoriaService.formatearFecha(logSeleccionado.fecha)}
                      </span>
                    </div>
                    <div style={estilos.modal.campo}>
                      <span style={estilos.modal.label}>Tiempo:</span>
                      <span style={estilos.modal.valor}>
                        {logSeleccionado.tiempo_transcurrido || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={estilos.modal.seccion}>
                  <h4 style={estilos.modal.tituloSeccion}>
                    <FaUser style={{ marginRight: '8px', color: '#10b981' }} />
                    Información del Usuario
                  </h4>
                  <div style={estilos.modal.campos}>
                    <div style={estilos.modal.campo}>
                      <span style={estilos.modal.label}>Usuario:</span>
                      <span style={estilos.modal.valor}>
                        {logSeleccionado.usuario_completo || 'Usuario desconocido'}
                      </span>
                    </div>
                    <div style={estilos.modal.campo}>
                      <span style={estilos.modal.label}>Email:</span>
                      <span style={estilos.modal.valor}>
                        {logSeleccionado.usuario_email || 'N/A'}
                      </span>
                    </div>
                    <div style={estilos.modal.campo}>
                      <span style={estilos.modal.label}>User ID:</span>
                      <span style={estilos.modal.valorMono}>
                        #{logSeleccionado.usuario_id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del equipo */}
              <div style={estilos.modal.seccionCompleta}>
                <h4 style={estilos.modal.tituloSeccion}>
                  <FaDesktop style={{ marginRight: '8px', color: '#8b5cf6' }} />
                  Información del Equipo
                </h4>
                <div style={estilos.modal.gridTres}>
                  <div style={estilos.modal.campo}>
                    <span style={estilos.modal.label}>Equipo ID:</span>
                    <span style={estilos.modal.valorMono}>
                      #{logSeleccionado.inventario_id}
                    </span>
                  </div>
                  <div style={estilos.modal.campo}>
                    <span style={estilos.modal.label}>Nombre:</span>
                    <span style={estilos.modal.valor}>
                      {logSeleccionado.nombre_equipo || 'N/A'}
                    </span>
                  </div>
                  <div style={estilos.modal.campo}>
                    <span style={estilos.modal.label}>Serie:</span>
                    <span style={estilos.modal.valorMono}>
                      {logSeleccionado.numero_serie || 'N/A'}
                    </span>
                  </div>
                </div>
                
                {logSeleccionado.direccion_ip && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={estilos.modal.campo}>
                      <span style={estilos.modal.label}>Dirección IP:</span>
                      <span style={estilos.modal.valorDestacado}>
                        {logSeleccionado.direccion_ip}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Acción realizada */}
              <div style={estilos.modal.seccionCompleta}>
                <h4 style={estilos.modal.tituloSeccion}>
                  <FaCogs style={{ marginRight: '8px', color: '#f59e0b' }} />
                  Acción Realizada
                </h4>
                <div style={{
                  ...estilos.accionBadge,
                  backgroundColor: auditoriaService.obtenerColorAccion(logSeleccionado.accion, logSeleccionado.datos_nuevos) + '20',
                  color: auditoriaService.obtenerColorAccion(logSeleccionado.accion, logSeleccionado.datos_nuevos),
                  fontSize: '16px',
                  padding: '12px 16px',
                  marginTop: '8px'
                }}>
                  {auditoriaService.obtenerIconoAccion(logSeleccionado.accion)}
                  {logSeleccionado.accion.toUpperCase()}
                </div>
              </div>

              {/* Datos técnicos */}
              {(logSeleccionado.datos_anteriores || logSeleccionado.datos_nuevos) && (
                <div style={estilos.modal.seccionCompleta}>
                  <h4 style={estilos.modal.tituloSeccion}>
                    <FaCode style={{ marginRight: '8px', color: '#6366f1' }} />
                    Datos Técnicos
                  </h4>
                  
                  {logSeleccionado.datos_anteriores && (
                    <div style={{ marginBottom: '16px' }}>
                      <h5 style={estilos.modal.subtitulo}>Datos Anteriores:</h5>
                      <pre style={estilos.modal.codigoBloque}>
                        {JSON.stringify(logSeleccionado.datos_anteriores, null, 2)}
                      </pre>
                    </div>
                  )}

                  {logSeleccionado.datos_nuevos && (
                    <div>
                      <h5 style={estilos.modal.subtitulo}>Datos Nuevos:</h5>
                      <pre style={estilos.modal.codigoBloque}>
                        {JSON.stringify(logSeleccionado.datos_nuevos, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={estilos.modal.footer}>
              <button
                onClick={cerrarModal}
                style={estilos.modal.botonCerrarModal}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6b7280';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaTimes style={{ marginRight: '8px' }} />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos inline optimizados
const estilos = {
  contenedor: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    border: '1px solid #f3f4f6',
  },

  header: {
    padding: '24px',
    borderBottom: '2px solid #f3f4f6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },

  titulo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
  },

  descripcion: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },

  filtroContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
  },

  select: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
    cursor: 'pointer',
  },

  estadisticasContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },

  estadisticaCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
  },

  shimmerBg: {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },

  estadoVacio: {
    padding: '64px 24px',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tituloVacio: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#374151',
    margin: '16px 0 8px 0',
  },

  descripcionVacio: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0',
  },

  tablaContainer: {
    position: 'relative' as const,
  },

  tabla: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
  },

  headerRow: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: '600',
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },

  th: {
    padding: '16px 12px',
    textAlign: 'left' as const,
    borderRight: '1px solid #f3f4f6',
  },

  bodyRow: {
    display: 'flex',
    borderBottom: '1px solid #f3f4f6',
    transition: 'all 0.2s ease',
    cursor: 'default',
    ':hover': {
      backgroundColor: '#f9fafb',
    },
  },

  td: {
    padding: '16px 12px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#374151',
    borderRight: '1px solid #f9fafb',
  },

  cardsContainer: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  logCard: {
    backgroundColor: '#ffffff',
    border: '2px solid #f3f4f6',
    borderRadius: '12px',
    padding: '16px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },

  cardFecha: {
    fontSize: '12px',
    color: '#6b7280',
    fontFamily: 'monospace',
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  cardField: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  fieldLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  },

  fieldValue: {
    fontSize: '13px',
    color: '#111827',
    fontWeight: '500',
  },

  cardActions: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'flex-end',
  },

  nivelBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid',
  },

  accionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
  },

  botonDetalles: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  fechaText: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#374151',
  },

  eventoContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },

  equipoText: {
    fontSize: '12px',
    color: '#6b7280',
  },

  usuarioContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },

  usuarioNombre: {
    fontSize: '13px',
    color: '#111827',
    fontWeight: '500',
  },

  usuarioEmail: {
    fontSize: '11px',
    color: '#6b7280',
  },

  ipText: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#4b5563',
    backgroundColor: '#f3f4f6',
    padding: '2px 6px',
    borderRadius: '4px',
  },

  botonAccion: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  footer: {
    padding: '16px 24px',
    backgroundColor: '#f8fafc',
    borderTop: '2px solid #f3f4f6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },

  infoLogs: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#6b7280',
  },

  paginacion: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  botonPaginacion: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  botonDeshabilitado: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  paginaActual: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    padding: '0 12px',
  },

  modal: {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
    },

    contenido: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      border: '1px solid #f3f4f6',
    },

    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px',
      borderBottom: '2px solid #f3f4f6',
    },

    titulo: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
    },

    botonCerrar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      color: '#9ca3af',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },

    body: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },

    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
    },

    gridTres: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },

    seccion: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
    },

    seccionCompleta: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
    },

    tituloSeccion: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      margin: '0 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      paddingBottom: '8px',
      borderBottom: '2px solid #e5e7eb',
    },

    subtitulo: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280',
      margin: '0 0 8px 0',
    },

    campos: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },

    campo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
    },

    label: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500',
      minWidth: '100px',
    },

    valor: {
      fontSize: '14px',
      color: '#111827',
      fontWeight: '500',
    },

    valorMono: {
      fontSize: '14px',
      color: '#111827',
      fontWeight: '500',
      fontFamily: 'monospace',
      backgroundColor: '#f3f4f6',
      padding: '4px 8px',
      borderRadius: '6px',
    },

    valorDestacado: {
      fontSize: '14px',
      color: '#1f2937',
      fontWeight: '600',
      fontFamily: 'monospace',
      backgroundColor: '#e0f2fe',
      padding: '6px 12px',
      borderRadius: '8px',
      border: '1px solid #b3e5fc',
    },

    codigoBloque: {
      backgroundColor: '#1f2937',
      color: '#10b981',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      overflow: 'auto',
      maxHeight: '200px',
      border: '1px solid #374151',
      whiteSpace: 'pre-wrap' as const,
    },

    footer: {
      padding: '20px 24px',
      borderTop: '2px solid #f3f4f6',
      backgroundColor: '#f8fafc',
      display: 'flex',
      justifyContent: 'flex-end',
    },

    botonCerrarModal: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 20px',
      backgroundColor: '#6b7280',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
  },
};

// Componente memoizado para mejor rendimiento
export default React.memo(TablaLogs);
