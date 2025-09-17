/**
 * Componente optimizado de tabla para mostrar el historial de auditoría.
 * Incluye paginación avanzada, modal de detalles moderno y diseño completamente responsive.
 * Integrado con el sistema de diseño global del proyecto.
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { HistorialAuditoria, PaginacionAuditoria } from '@/types';
import auditoriaService from '@/services/auditoriaService';
import { estiloGlobal } from '@/app/Diseño/Estilos/EstiloGlobal';
import { estiloAnimaciones } from '@/app/Diseño/Estilos/EstiloAnimaciones';
import { FaEye, FaHistory, FaTimes, FaChevronLeft, FaChevronRight, FaUser, FaDesktop, FaCalendarAlt, FaCog } from 'react-icons/fa';

interface Props {
  historial: HistorialAuditoria[];
  paginacion: PaginacionAuditoria;
  loading?: boolean;
  onCambiarPagina: (pagina: number) => void;
}

interface ModalDetallesProps {
  registro: HistorialAuditoria;
  isOpen: boolean;
  onClose: () => void;
}

// Componente Modal optimizado con mejor diseño y funcionalidad
const ModalDetalles: React.FC<ModalDetallesProps> = React.memo(({ registro, isOpen, onClose }) => {
  const renderizarJSON = useCallback((datos: any, titulo: string) => {
    if (!datos) return (
      <div style={{
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        color: '#64748b',
        fontStyle: 'italic'
      }}>
        No hay datos disponibles
      </div>
    );
    
    return (
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: 'white',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }}>
          {titulo}
        </div>
        <pre style={{
          padding: '1rem',
          margin: 0,
          fontSize: '0.8rem',
          lineHeight: '1.5',
          overflow: 'auto',
          maxHeight: '200px',
          background: '#ffffff',
          color: '#1e293b',
          fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace'
        }}>
          {JSON.stringify(datos, null, 2)}
        </pre>
      </div>
    );
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{estiloAnimaciones}</style>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'clamp(8px, 2vw, 20px)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          maxWidth: 'min(90vw, 900px)',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          {/* Header del modal */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: 'white',
            padding: 'clamp(16px, 3vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaHistory style={{ fontSize: 'clamp(18px, 4vw, 22px)', color: '#3b82f6' }} />
              <h3 style={{
                margin: 0,
                fontSize: 'clamp(16px, 3vw, 20px)',
                fontWeight: 700,
                letterSpacing: '-0.5px'
              }}>
                Detalles de Auditoría #{registro.id}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FaTimes style={{ fontSize: '16px' }} />
            </button>
          </div>

          {/* Contenido del modal */}
          <div style={{
            padding: 'clamp(16px, 3vw, 24px)',
            maxHeight: 'calc(90vh - 140px)',
            overflowY: 'auto'
          }}>
            {/* Grid de información principal */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(16px, 3vw, 24px)',
              marginBottom: 'clamp(20px, 4vw, 32px)'
            }}>
              {/* Información General */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '12px',
                padding: 'clamp(16px, 3vw, 20px)',
                border: '1px solid #bae6fd'
              }}>
                <h4 style={{
                  margin: '0 0 16px 0',
                  color: '#0369a1',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaCog style={{ fontSize: '14px' }} />
                  Información General
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>ID:</span>
                    <span style={{ 
                      fontWeight: 700, 
                      color: '#0369a1',
                      background: 'rgba(3, 105, 161, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}>
                      #{registro.id}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Fecha:</span>
                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                      {auditoriaService.formatearFecha(registro.fecha)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Acción:</span>
                    <span style={{
                      background: auditoriaService.obtenerColorAccion(registro.accion) + '15',
                      color: auditoriaService.obtenerColorAccion(registro.accion),
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {auditoriaService.obtenerIconoAccion(registro.accion)}
                      {registro.accion}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información del Usuario */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '12px',
                padding: 'clamp(16px, 3vw, 20px)',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{
                  margin: '0 0 16px 0',
                  color: '#15803d',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaUser style={{ fontSize: '14px' }} />
                  Usuario
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Nombre:</span>
                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                      {registro.usuario_nombre} {registro.usuario_apellido}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>ID Usuario:</span>
                    <span style={{ 
                      fontWeight: 700, 
                      color: '#15803d',
                      background: 'rgba(21, 128, 61, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}>
                      #{registro.usuario_id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información del Equipo */}
              <div style={{
                background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
                borderRadius: '12px',
                padding: 'clamp(16px, 3vw, 20px)',
                border: '1px solid #fde68a',
                gridColumn: 'span 1'
              }}>
                <h4 style={{
                  margin: '0 0 16px 0',
                  color: '#a16207',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaDesktop style={{ fontSize: '14px' }} />
                  Equipo
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>ID Equipo:</span>
                    <span style={{ 
                      fontWeight: 700, 
                      color: '#a16207',
                      background: 'rgba(161, 98, 7, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}>
                      #{registro.inventario_id}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Nombre:</span>
                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                      {registro.nombre_equipo || 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Serie:</span>
                    <span style={{ 
                      fontWeight: 600, 
                      color: '#1e293b', 
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                      background: '#f8fafc',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {registro.numero_serie || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de datos anteriores y nuevos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 3vw, 24px)' }}>
              {registro.datos_anteriores && (
                <div>
                  {renderizarJSON(registro.datos_anteriores, '📋 Datos Anteriores')}
                </div>
              )}

              {registro.datos_nuevos && (
                <div>
                  {renderizarJSON(registro.datos_nuevos, '📝 Datos Nuevos')}
                </div>
              )}
            </div>
          </div>

          {/* Footer del modal */}
          <div style={{
            background: '#f8fafc',
            padding: 'clamp(16px, 3vw, 20px)',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

// Componente principal optimizado con memoización y mejor rendimiento
const TablaHistorial: React.FC<Props> = ({
  historial,
  paginacion,
  loading = false,
  onCambiarPagina,
}) => {
  const [registroSeleccionado, setRegistroSeleccionado] = useState<HistorialAuditoria | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vistaMovil, setVistaMovil] = useState(false);

  // Detectar si estamos en vista móvil
  React.useEffect(() => {
    const checkMobile = () => setVistaMovil(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Callbacks memoizados para mejor rendimiento
  const abrirModal = useCallback((registro: HistorialAuditoria) => {
    setRegistroSeleccionado(registro);
    setModalAbierto(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setRegistroSeleccionado(null);
  }, []);

  const cambiarPagina = useCallback((pagina: number) => {
    if (!loading) onCambiarPagina(pagina);
  }, [loading, onCambiarPagina]);

  // Componente de paginación optimizado
  const renderizarPaginacion = useMemo(() => {
    if (paginacion.pages <= 1) return null;

    const paginas = [];
    const paginaActual = paginacion.page;
    const totalPaginas = paginacion.pages;
    
    // Lógica inteligente para mostrar páginas
    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + 4);
    
    if (fin - inicio < 4) {
      inicio = Math.max(1, fin - 4);
    }

    // Botón anterior
    paginas.push(
      <button
        key="prev"
        onClick={() => cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1 || loading}
        style={{
          padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
          background: paginaActual === 1 ? '#f1f5f9' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          color: paginaActual === 1 ? '#94a3b8' : '#475569',
          cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: paginaActual === 1 ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          if (paginaActual > 1) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (paginaActual > 1) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          }
        }}
      >
        <FaChevronLeft style={{ fontSize: '10px' }} />
        {!vistaMovil && 'Anterior'}
      </button>
    );

    // Páginas numeradas
    for (let i = inicio; i <= fin; i++) {
      paginas.push(
        <button
          key={i}
          onClick={() => cambiarPagina(i)}
          disabled={loading}
          style={{
            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
            background: i === paginaActual 
              ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: i === paginaActual ? '1px solid #2563eb' : '1px solid #e2e8f0',
            borderRadius: '8px',
            color: i === paginaActual ? 'white' : '#475569',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: i === paginaActual ? 700 : 600,
            minWidth: 'clamp(32px, 6vw, 40px)',
            boxShadow: i === paginaActual 
              ? '0 4px 12px rgba(37, 99, 235, 0.3)' 
              : '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (i !== paginaActual) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
            }
          }}
          onMouseLeave={(e) => {
            if (i !== paginaActual) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
            }
          }}
        >
          {i}
        </button>
      );
    }

    // Botón siguiente
    paginas.push(
      <button
        key="next"
        onClick={() => cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas || loading}
        style={{
          padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
          background: paginaActual === totalPaginas ? '#f1f5f9' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          color: paginaActual === totalPaginas ? '#94a3b8' : '#475569',
          cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: paginaActual === totalPaginas ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          if (paginaActual < totalPaginas) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (paginaActual < totalPaginas) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          }
        }}
      >
        {!vistaMovil && 'Siguiente'}
        <FaChevronRight style={{ fontSize: '10px' }} />
      </button>
    );

    return (
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: 'clamp(16px, 3vw, 24px)',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: vistaMovil ? 'column' : 'row',
          alignItems: vistaMovil ? 'stretch' : 'center',
          justifyContent: 'space-between',
          gap: vistaMovil ? '16px' : '0'
        }}>
          <div style={{
            color: '#64748b',
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: 500,
            textAlign: vistaMovil ? 'center' : 'left'
          }}>
            Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} a{' '}
            {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
            {paginacion.total} resultados
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 1vw, 8px)',
            justifyContent: vistaMovil ? 'center' : 'flex-end',
            flexWrap: 'wrap'
          }}>
            {paginas}
          </div>
        </div>
      </div>
    );
  }, [paginacion, loading, cambiarPagina, vistaMovil]);

  // Estados de carga y vacío optimizados
  if (loading && historial.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        padding: 'clamp(32px, 6vw, 48px)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div>
            <h3 style={{
              margin: '0 0 8px 0',
              color: '#1e293b',
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: 600
            }}>
              Cargando historial de auditoría
            </h3>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: 'clamp(14px, 2.5vw, 16px)'
            }}>
              Por favor espere mientras obtenemos los datos...
            </p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        padding: 'clamp(32px, 6vw, 48px)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontSize: 'clamp(48px, 8vw, 72px)',
            opacity: 0.6
          }}>📋</div>
          <div>
            <h3 style={{
              margin: '0 0 8px 0',
              color: '#1e293b',
              fontSize: 'clamp(16px, 3vw, 20px)',
              fontWeight: 700
            }}>
              No hay registros de auditoría
            </h3>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: 'clamp(14px, 2.5vw, 16px)'
            }}>
              No se encontraron registros con los filtros aplicados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Componente de fila memoizado para optimizar rendimiento
  const FilaTabla = React.memo(({ registro, index }: { registro: HistorialAuditoria; index: number }) => (
    <tr 
      style={{
        borderBottom: '1px solid #f1f5f9',
        background: loading ? 'rgba(248, 250, 252, 0.8)' : (index % 2 === 0 ? '#ffffff' : '#f8fafc'),
        transition: 'all 0.2s ease',
        opacity: loading ? 0.6 : 1
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.background = '#f1f5f9';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8fafc';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <td style={{
        padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
        fontWeight: 700,
        color: '#2563eb',
        fontSize: 'clamp(12px, 2.5vw, 14px)',
        fontFamily: 'monospace'
      }}>
        #{registro.id}
      </td>
      
      <td style={{
        padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
        color: '#374151',
        fontSize: 'clamp(11px, 2vw, 13px)',
        lineHeight: '1.4'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaCalendarAlt style={{ color: '#64748b', fontSize: '12px' }} />
          {auditoriaService.formatearFecha(registro.fecha)}
        </div>
      </td>

      <td style={{
        padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
        color: '#374151',
        fontSize: 'clamp(12px, 2.5vw, 14px)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ 
            fontWeight: 600, 
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FaUser style={{ color: '#64748b', fontSize: '12px' }} />
            {registro.usuario_nombre} {registro.usuario_apellido}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 11px)',
            color: '#64748b',
            fontFamily: 'monospace'
          }}>
            ID: {registro.usuario_id}
          </div>
        </div>
      </td>

      <td style={{
        padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)'
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: 'clamp(10px, 2vw, 12px)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          background: auditoriaService.obtenerColorAccion(registro.accion) + '15',
          color: auditoriaService.obtenerColorAccion(registro.accion),
          border: `1px solid ${auditoriaService.obtenerColorAccion(registro.accion)}25`
        }}>
          {auditoriaService.obtenerIconoAccion(registro.accion)}
          {registro.accion}
        </span>
      </td>

      <td style={{
        padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
        color: '#374151',
        fontSize: 'clamp(12px, 2.5vw, 14px)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ 
            fontWeight: 600, 
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FaDesktop style={{ color: '#64748b', fontSize: '12px' }} />
            {registro.nombre_equipo || 'N/A'}
          </div>
          <div style={{
            fontSize: 'clamp(10px, 2vw, 11px)',
            color: '#64748b',
            fontFamily: 'monospace'
          }}>
            ID: {registro.inventario_id} | Serie: {registro.numero_serie || 'N/A'}
          </div>
        </div>
      </td>

      <td style={{
        padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
        textAlign: 'center'
      }}>
        <button
          onClick={() => abrirModal(registro)}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
            borderRadius: '8px',
            fontSize: 'clamp(11px, 2vw, 13px)',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: loading ? 0.5 : 1,
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.3)';
            }
          }}
        >
          <FaEye style={{ fontSize: '12px' }} />
          {!vistaMovil && 'Ver Detalles'}
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <style jsx global>{estiloAnimaciones}</style>
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header de la tabla */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: 'clamp(20px, 4vw, 24px)',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaHistory style={{
                fontSize: 'clamp(20px, 4vw, 24px)',
                color: '#3b82f6'
              }} />
              <div>
                <h3 style={{
                  margin: 0,
                  color: 'white',
                  fontSize: 'clamp(16px, 3vw, 20px)',
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}>
                  Historial de Auditoría
                </h3>
                <p style={{
                  margin: '4px 0 0 0',
                  color: '#94a3b8',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  fontWeight: 500
                }}>
                  {paginacion.total} registros encontrados
                </p>
              </div>
            </div>

            {loading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#94a3b8',
                fontSize: 'clamp(12px, 2.5vw, 14px)'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #475569',
                  borderTop: '2px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Actualizando...
              </div>
            )}
          </div>
        </div>

        {/* Contenedor de tabla responsive */}
        <div style={{
          overflowX: 'auto',
          background: '#ffffff'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: vistaMovil ? '800px' : 'auto'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderBottom: '2px solid #e2e8f0'
              }}>
                <th style={{
                  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
                  textAlign: 'left',
                  fontSize: 'clamp(11px, 2vw, 12px)',
                  fontWeight: 700,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ID
                </th>
                <th style={{
                  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
                  textAlign: 'left',
                  fontSize: 'clamp(11px, 2vw, 12px)',
                  fontWeight: 700,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Fecha
                </th>
                <th style={{
                  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
                  textAlign: 'left',
                  fontSize: 'clamp(11px, 2vw, 12px)',
                  fontWeight: 700,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Usuario
                </th>
                <th style={{
                  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
                  textAlign: 'left',
                  fontSize: 'clamp(11px, 2vw, 12px)',
                  fontWeight: 700,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Acción
                </th>
                <th style={{
                  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
                  textAlign: 'left',
                  fontSize: 'clamp(11px, 2vw, 12px)',
                  fontWeight: 700,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Equipo
                </th>
                <th style={{
                  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
                  textAlign: 'center',
                  fontSize: 'clamp(11px, 2vw, 12px)',
                  fontWeight: 700,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {historial.map((registro, index) => (
                <FilaTabla 
                  key={registro.id} 
                  registro={registro} 
                  index={index} 
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {renderizarPaginacion}

        {/* Modal de detalles */}
        {registroSeleccionado && (
          <ModalDetalles
            registro={registroSeleccionado}
            isOpen={modalAbierto}
            onClose={cerrarModal}
          />
        )}

        {/* Overlay de loading global */}
        {loading && historial.length > 0 && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
            zIndex: 10
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #e2e8f0',
                borderTop: '3px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 500
              }}>
                Actualizando datos...
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TablaHistorial;