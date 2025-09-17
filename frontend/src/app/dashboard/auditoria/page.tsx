/**
 * Página principal del sistema de auditoría.
 * Integrada con el diseño consistente del dashboard existente.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuditoria from '@/hooks/useAuditoria';
import FiltrosAuditoria from './components/FiltrosAuditoria';
import TablaHistorial from './components/TablaHistorial';
import EstadisticasAuditoria from './components/EstadisticasAuditoria';
import TablaLogs from './components/TablaLogs';
import { type FiltrosAuditoria as TipoFiltros, type Usuario } from '@/types';
import { APP_CONFIG } from '@/services/api';
import { estiloGlobal } from '../../Diseño/Estilos/EstiloGlobal';
import Navbar from '../../Diseño/Diseño dashboard/Navbar';
import { FaChartLine, FaHistory, FaCogs, FaFileExport, FaSync } from 'react-icons/fa';

type PestanaActiva = 'historial' | 'estadisticas' | 'logs';

const AuditoriaPage: React.FC = () => {
  const router = useRouter();
  const [pestanaActiva, setPestanaActiva] = useState<PestanaActiva>('historial');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);

  const filtrosIniciales: TipoFiltros = {
    page: 1,
    limit: 50,
  };

  const {
    historial,
    estadisticas,
    logs,
    exportar,
    refetchTodo,
  } = useAuditoria(filtrosIniciales);

  // Cargar usuario de localStorage
  useEffect(() => {
    const userData = localStorage.getItem(APP_CONFIG.session.storageKey);
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // Cargar usuarios para los filtros
  useEffect(() => {
    const cargarUsuarios = async () => {
      setCargandoUsuarios(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/usuarios/usuarios`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      } finally {
        setCargandoUsuarios(false);
      }
    };

    cargarUsuarios();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(APP_CONFIG.session.storageKey);
    localStorage.removeItem(APP_CONFIG.session.tokenKey);
    router.push('/');
  };

  const manejarExportarCSV = async () => {
    try {
      await exportar.exportarCSV(historial.filtros);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const obtenerIconoPestana = (pestana: PestanaActiva) => {
    const iconos = {
      historial: <FaHistory />,
      estadisticas: <FaChartLine />,
      logs: <FaCogs />,
    };
    return iconos[pestana];
  };

  const renderizarContenidoPestana = () => {
    switch (pestanaActiva) {
      case 'historial':
        return (
          <div style={{ marginTop: '2rem' }}>
            <FiltrosAuditoria
              filtros={historial.filtros}
              onAplicarFiltros={historial.aplicarFiltros}
              onLimpiarFiltros={historial.limpiarFiltros}
              loading={historial.loading}
              usuarios={usuarios}
            />
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              padding: '0 0.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                Historial de Acciones
              </h2>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={manejarExportarCSV}
                  disabled={exportar.loading || historial.loading}
                  style={{
                    background: exportar.loading ? '#94a3b8' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: exportar.loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaFileExport />
                  {exportar.loading ? 'Exportando...' : 'Exportar CSV'}
                </button>
                <button
                  onClick={historial.refetch}
                  disabled={historial.loading}
                  style={{
                    background: historial.loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: historial.loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaSync style={{ animation: historial.loading ? 'spin 1s linear infinite' : 'none' }} />
                  Actualizar
                </button>
              </div>
            </div>

            {historial.data && (
              <TablaHistorial
                historial={historial.data.historial}
                paginacion={historial.data.pagination}
                loading={historial.loading}
                onCambiarPagina={historial.cambiarPagina}
              />
            )}

            {historial.error && (
              <div style={{
                ...estiloGlobal.alert,
                ...estiloGlobal.alertError,
                marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>❌</span>
                  <span style={{ fontWeight: '500' }}>Error al cargar historial</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  {historial.error}
                </div>
                <button
                  onClick={historial.refetch}
                  style={{
                    marginTop: '0.75rem',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>
        );

      case 'estadisticas':
        return (
          <div style={{ marginTop: '2rem' }}>
            <EstadisticasAuditoria
              estadisticas={estadisticas.data}
              loading={estadisticas.loading}
              onRefresh={estadisticas.refetch}
            />
          </div>
        );

      case 'logs':
        return (
          <div style={{ marginTop: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              padding: '0 0.5rem'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Logs Técnicos
                </h2>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: '0.25rem 0 0 0'
                }}>
                  Información detallada para administradores del sistema
                </p>
              </div>
              <button
                onClick={logs.refetch}
                disabled={logs.loading}
                style={{
                  background: logs.loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: logs.loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <FaSync style={{ animation: logs.loading ? 'spin 1s linear infinite' : 'none' }} />
                Actualizar
              </button>
            </div>

            {logs.data && (
              <TablaLogs
                logs={logs.data}
                loading={logs.loading}
                onCambiarPagina={logs.cambiarPagina}
                onFiltrarPorNivel={logs.filtrarPorNivel}
                page={logs.page}
                nivel={logs.nivel}
              />
            )}

            {logs.error && (
              <div style={{
                ...estiloGlobal.alert,
                ...estiloGlobal.alertError,
                marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>❌</span>
                  <span style={{ fontWeight: '500' }}>Error al cargar logs</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  {logs.error}
                </div>
                <button
                  onClick={logs.refetch}
                  style={{
                    marginTop: '0.75rem',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={estiloGlobal.dashboard}>
      <Navbar user={user} onLogout={handleLogout} />
      
      <main style={{
        ...estiloGlobal.dashboardContent,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        paddingBottom: 'clamp(80px, 12vh, 120px)',
      }}>
        <div style={{
          padding: 'clamp(16px, 3vw, 32px)',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          width: '100%'
        }}>
          
          {/* Header del Sistema de Auditoría */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.5)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div>
                <h1 style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <FaChartLine style={{ color: '#3b82f6' }} />
                  Sistema de Auditoría
                </h1>
                <p style={{
                  color: '#64748b',
                  fontSize: '1rem',
                  margin: '0.5rem 0 0 0'
                }}>
                  Monitoreo y seguimiento de actividades del inventario municipal
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Indicador de estado */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#64748b'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  Sistema activo
                </div>
                
                {/* Botón de actualización global */}
                <button
                  onClick={refetchTodo}
                  disabled={historial.loading || estadisticas.loading || logs.loading}
                  style={{
                    background: (historial.loading || estadisticas.loading || logs.loading) 
                      ? '#94a3b8' 
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: (historial.loading || estadisticas.loading || logs.loading) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaSync style={{ 
                    animation: (historial.loading || estadisticas.loading || logs.loading) 
                      ? 'spin 1s linear infinite' 
                      : 'none' 
                  }} />
                  Actualizar Todo
                </button>
              </div>
            </div>
          </div>

          {/* Navegación por pestañas */}
          <div style={{
            background: 'white',
            borderRadius: '12px 12px 0 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '0'
          }}>
            <nav style={{
              display: 'flex',
              borderBottom: '1px solid #e2e8f0'
            }}>
              {([
                { id: 'historial', nombre: 'Historial de Acciones', descripcion: 'Ver todas las acciones registradas' },
                { id: 'estadisticas', nombre: 'Estadísticas', descripcion: 'Métricas y gráficos del sistema' },
                { id: 'logs', nombre: 'Logs Técnicos', descripcion: 'Información detallada para administradores' },
              ] as Array<{ id: PestanaActiva; nombre: string; descripcion: string }>).map((pestana) => (
                <button
                  key={pestana.id}
                  onClick={() => setPestanaActiva(pestana.id)}
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    border: 'none',
                    background: pestanaActiva === pestana.id ? '#f8fafc' : 'transparent',
                    color: pestanaActiva === pestana.id ? '#3b82f6' : '#64748b',
                    borderBottom: pestanaActiva === pestana.id ? '2px solid #3b82f6' : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    borderRadius: pestana.id === 'historial' ? '12px 0 0 0' : 
                                  pestana.id === 'logs' ? '0 12px 0 0' : '0'
                  }}
                  onMouseEnter={(e) => {
                    if (pestanaActiva !== pestana.id) {
                      e.currentTarget.style.background = '#f1f5f9';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pestanaActiva !== pestana.id) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  {obtenerIconoPestana(pestana.id)}
                  <span style={{ display: 'none' }} className="tab-text">{pestana.nombre}</span>
                  <span className="tab-text-mobile">{pestana.nombre}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido principal */}
          <div style={{
            background: 'white',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '0 2rem 2rem 2rem',
            minHeight: '400px'
          }}>
            {renderizarContenidoPestana()}
          </div>

          {/* Footer con información adicional */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            marginTop: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid rgba(226, 232, 240, 0.5)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.875rem',
              color: '#64748b'
            }}>
              <div>
                © 2024 Sistema de Inventario Municipal - Auditoría v1.0
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#22c55e' }}>●</span>
                  <span>Backend conectado</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaHistory style={{ color: '#3b82f6' }} />
                  <span>
                    {historial.data?.pagination.total || 0} registros totales
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notificaciones de errores globales */}
      {exportar.error && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          maxWidth: '20rem',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>❌</span>
            <span style={{ fontWeight: '500', color: '#7f1d1d' }}>Error en exportación</span>
          </div>
          <p style={{ color: '#991b1b', fontSize: '0.875rem', margin: '0.25rem 0 0.5rem 0' }}>
            {exportar.error}
          </p>
          <button
            onClick={exportar.limpiarError}
            style={{
              color: '#dc2626',
              background: 'none',
              border: 'none',
              fontSize: '0.875rem',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      {/* CSS adicional */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          .tab-text {
            display: none !important;
          }
          .tab-text-mobile {
            display: block !important;
            font-size: 0.75rem !important;
          }
        }
        
        @media (min-width: 769px) {
          .tab-text {
            display: block !important;
          }
          .tab-text-mobile {
            display: none !important;
          }
        }
        
        /* Mejoras responsive */
        @media (max-width: 480px) {
          .tab-text-mobile {
            font-size: 0.6rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuditoriaPage;