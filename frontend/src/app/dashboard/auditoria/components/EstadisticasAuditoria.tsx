/**
 * Componente optimizado de estadísticas para el sistema de auditoría.
 * Incluye cards interactivas con métricas, gráficos modernos y diseño completamente responsive.
 * Integrado con el sistema de diseño global del proyecto.
 */

'use client';

import React, { useMemo, useCallback } from 'react';
import { type EstadisticasAuditoria } from '@/types';
import auditoriaService from '@/services/auditoriaService';
import { estiloGlobal } from '@/app/Diseño/Estilos/EstiloGlobal';
import { estiloAnimaciones } from '@/app/Diseño/Estilos/EstiloAnimaciones';
import { 
  FaChartLine, FaPlus, FaEdit, FaTrash, FaUsers, FaCalendarAlt, 
  FaSync, FaTrophy, FaMedal, FaAward, FaStar, FaChartBar 
} from 'react-icons/fa';

interface Props {
  estadisticas: EstadisticasAuditoria | null;
  loading?: boolean;
  onRefresh?: () => void;
}

interface CardEstadisticaProps {
  titulo: string;
  valor: number;
  icono: React.ReactNode;
  color: string;
  descripcion?: string;
  tendencia?: {
    porcentaje: number;
    direccion: 'up' | 'down' | 'neutral';
  };
}

// Card optimizada con animaciones y diseño moderno
const CardEstadistica: React.FC<CardEstadisticaProps> = React.memo(({
  titulo,
  valor,
  icono,
  color,
  descripcion,
  tendencia,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const colorClasses = {
    blue: { bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', shadow: 'rgba(59, 130, 246, 0.25)' },
    green: { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.25)' },
    yellow: { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', shadow: 'rgba(245, 158, 11, 0.25)' },
    red: { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', shadow: 'rgba(239, 68, 68, 0.25)' },
    purple: { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', shadow: 'rgba(139, 92, 246, 0.25)' },
  };

  const colorData = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div 
      style={{
        background: colorData.bg,
        borderRadius: '16px',
        padding: 'clamp(20px, 4vw, 24px)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isHovered ? `0 8px 32px ${colorData.shadow}` : `0 4px 16px ${colorData.shadow}`,
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Patrón de fondo sutil */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 70% 30%, rgba(255, 255, 255, ${isHovered ? 0.15 : 0.1}) 0%, transparent 50%)`,
        transition: 'background 0.3s ease'
      }} />
      
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        height: '100%'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: 600,
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {titulo}
          </h3>
          
          <div style={{
            fontSize: 'clamp(28px, 6vw, 36px)',
            fontWeight: 800,
            lineHeight: '1',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {valor.toLocaleString()}
          </div>
          
          {descripcion && (
            <p style={{
              margin: 0,
              fontSize: 'clamp(11px, 2vw, 12px)',
              opacity: 0.8,
              lineHeight: '1.3'
            }}>
              {descripcion}
            </p>
          )}

          {tendencia && (
            <div style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'clamp(10px, 2vw, 11px)',
              fontWeight: 600
            }}>
              <span style={{
                color: tendencia.direccion === 'up' ? '#10b981' : 
                       tendencia.direccion === 'down' ? '#ef4444' : '#64748b'
              }}>
                {tendencia.direccion === 'up' ? '↗' : 
                 tendencia.direccion === 'down' ? '↘' : '→'}
                {Math.abs(tendencia.porcentaje)}%
              </span>
              <span style={{ opacity: 0.8 }}>vs período anterior</span>
            </div>
          )}
        </div>

        <div style={{
          fontSize: 'clamp(36px, 7vw, 48px)',
          opacity: isHovered ? 0.9 : 0.7,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
          marginLeft: '16px'
        }}>
          {icono}
        </div>
      </div>
    </div>
  );
});

interface GraficoBarrasSimpleProps {
  datos: Record<string, number>;
  titulo: string;
  maxBarras?: number;
}

// Gráfico optimizado con animaciones y mejor visualización
const GraficoBarrasSimple: React.FC<GraficoBarrasSimpleProps> = React.memo(({
  datos,
  titulo,
  maxBarras = 7,
}) => {
  const datosArray = useMemo(() => 
    Object.entries(datos)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-maxBarras),
    [datos, maxBarras]
  );
  
  const valorMaximo = useMemo(() => 
    Math.max(...datosArray.map(([, value]) => value)),
    [datosArray]
  );

  if (datosArray.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        padding: 'clamp(20px, 4vw, 24px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          justifyContent: 'center'
        }}>
          <FaChartBar style={{ fontSize: '20px', color: '#3b82f6' }} />
          <h3 style={{
            margin: 0,
            color: '#1e293b',
            fontSize: 'clamp(16px, 3vw, 18px)',
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}>
            {titulo}
          </h3>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          color: '#64748b'
        }}>
          <div style={{ fontSize: 'clamp(48px, 8vw, 64px)', opacity: 0.5 }}>📊</div>
          <p style={{
            margin: 0,
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            fontWeight: 500
          }}>
            No hay datos disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '16px',
      padding: 'clamp(20px, 4vw, 24px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: 'clamp(20px, 4vw, 24px)',
        paddingBottom: '16px',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <FaChartBar style={{ fontSize: '20px', color: '#3b82f6' }} />
        <h3 style={{
          margin: 0,
          color: '#1e293b',
          fontSize: 'clamp(16px, 3vw, 18px)',
          fontWeight: 700,
          letterSpacing: '-0.5px'
        }}>
          {titulo}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.5vw, 16px)' }}>
        {datosArray.map(([fecha, cantidad], index) => {
          const porcentaje = valorMaximo > 0 ? (cantidad / valorMaximo) * 100 : 0;
          const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric',
          });
          
          return (
            <div 
              key={fecha} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'clamp(8px, 2vw, 12px)',
                padding: 'clamp(8px, 2vw, 12px)',
                background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                border: '1px solid #f1f5f9'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f9ff';
                e.currentTarget.style.borderColor = '#bae6fd';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8fafc';
                e.currentTarget.style.borderColor = '#f1f5f9';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                minWidth: 'clamp(60px, 12vw, 80px)',
                fontSize: 'clamp(11px, 2vw, 12px)',
                color: '#64748b',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <FaCalendarAlt style={{ fontSize: '10px', color: '#94a3b8' }} />
                {fechaFormateada}
              </div>
              
              <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                borderRadius: '20px',
                height: 'clamp(28px, 5vw, 32px)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
              }}>
                <div
                  style={{
                    background: cantidad > 0 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : 'transparent',
                    height: '100%',
                    borderRadius: '20px',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: `${Math.max(porcentaje, cantidad > 0 ? 8 : 0)}%`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: cantidad > 0 ? '8px' : '0',
                    position: 'relative',
                    boxShadow: cantidad > 0 ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  {cantidad > 0 && (
                    <span style={{
                      color: 'white',
                      fontSize: 'clamp(10px, 2vw, 11px)',
                      fontWeight: 700,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}>
                      {cantidad}
                    </span>
                  )}
                </div>
              </div>
              
              <div style={{
                minWidth: 'clamp(32px, 6vw, 40px)',
                fontSize: 'clamp(11px, 2vw, 12px)',
                color: '#1e293b',
                fontWeight: 700,
                textAlign: 'right',
                background: cantidad > 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                padding: '4px 8px',
                borderRadius: '6px',
                border: cantidad > 0 ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                {cantidad}
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div style={{
        marginTop: 'clamp(16px, 3vw, 20px)',
        padding: 'clamp(12px, 2.5vw, 16px)',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: '12px',
        border: '1px solid #bae6fd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: 'clamp(11px, 2vw, 12px)',
          color: '#0369a1',
          fontWeight: 600
        }}>
          <FaChartLine style={{ fontSize: '12px' }} />
          Total: {datosArray.reduce((sum, [, cantidad]) => sum + cantidad, 0)} acciones
        </div>
        <div style={{
          fontSize: 'clamp(10px, 2vw, 11px)',
          color: '#64748b',
          fontWeight: 500
        }}>
          Promedio: {Math.round(datosArray.reduce((sum, [, cantidad]) => sum + cantidad, 0) / datosArray.length)} por día
        </div>
      </div>
    </div>
  );
});

// Componente principal optimizado con mejor diseño y funcionalidad
const EstadisticasAuditoria: React.FC<Props> = ({
  estadisticas,
  loading = false,
  onRefresh,
}) => {
  // Memoizar cálculos costosos
  const totalAccionesPorTipo = useMemo(() => {
    if (!estadisticas) return 0;
    return Object.values(estadisticas.accionesPorTipo).reduce((a, b) => a + b, 0);
  }, [estadisticas]);

  const handleRefresh = useCallback(() => {
    if (onRefresh && !loading) {
      onRefresh();
    }
  }, [onRefresh, loading]);

  // Estado de carga optimizado
  if (loading && !estadisticas) {
    return (
      <>
        <style jsx global>{estiloAnimaciones}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 4vw, 32px)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <FaChartLine style={{ fontSize: '24px', color: '#3b82f6' }} />
              <h2 style={{
                margin: 0,
                color: '#1e293b',
                fontSize: 'clamp(18px, 4vw, 24px)',
                fontWeight: 700,
                letterSpacing: '-0.5px'
              }}>
                📈 Estadísticas de Auditoría
              </h2>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(16px, 3vw, 24px)'
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  minHeight: '140px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 2s infinite'
                }} />
                <div style={{
                  height: '12px',
                  background: '#cbd5e1',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  width: '60%'
                }} />
                <div style={{
                  height: '32px',
                  background: '#cbd5e1',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  width: '40%'
                }} />
                <div style={{
                  height: '8px',
                  background: '#cbd5e1',
                  borderRadius: '4px',
                  width: '80%'
                }} />
              </div>
            ))}
              </div>
            </div>
          </>
        );
      }  // Estado de error optimizado
  if (!estadisticas) {
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
          <div style={{ fontSize: 'clamp(48px, 8vw, 72px)' }}>⚠️</div>
          <div>
            <h3 style={{
              margin: '0 0 12px 0',
              color: '#1e293b',
              fontSize: 'clamp(18px, 3vw, 22px)',
              fontWeight: 700
            }}>
              Error al cargar estadísticas
            </h3>
            <p style={{
              margin: '0 0 20px 0',
              color: '#64748b',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              lineHeight: '1.5'
            }}>
              No se pudieron obtener las estadísticas de auditoría.
            </p>
            {onRefresh && (
              <button
                onClick={handleRefresh}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                <FaSync />
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{estiloAnimaciones}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 4vw, 32px)' }}>
        {/* Header con título y botón de refresh */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FaChartLine style={{ fontSize: '24px', color: '#3b82f6' }} />
            <h2 style={{
              margin: 0,
              color: '#1e293b',
              fontSize: 'clamp(18px, 4vw, 24px)',
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}>
              📈 Estadísticas de Auditoría
            </h2>
          </div>
          
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              style={{
                background: loading 
                  ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' 
                  : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                color: loading ? '#94a3b8' : '#475569',
                border: '1px solid #e2e8f0',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: loading ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <FaSync style={{ 
                fontSize: '12px',
                animation: loading ? 'spin 1s linear infinite' : 'none'
              }} />
              Actualizar
            </button>
          )}
        </div>

        {/* Cards de estadísticas principales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(16px, 3vw, 24px)'
        }}>
          <CardEstadistica
            titulo="Total de Acciones"
            valor={estadisticas.totalAcciones}
            icono={<FaChartLine />}
            color="blue"
            descripcion="Todas las acciones registradas en el sistema"
            tendencia={{ porcentaje: 12, direccion: 'up' }}
          />
          
          <CardEstadistica
            titulo="Equipos Agregados"
            valor={estadisticas.accionesPorTipo.agregado || 0}
            icono={<FaPlus />}
            color="green"
            descripcion="Nuevos equipos registrados en el inventario"
            tendencia={{ porcentaje: 8, direccion: 'up' }}
          />
          
          <CardEstadistica
            titulo="Equipos Modificados"
            valor={estadisticas.accionesPorTipo.modificado || 0}
            icono={<FaEdit />}
            color="yellow"
            descripcion="Equipos actualizados y modificados"
            tendencia={{ porcentaje: 3, direccion: 'down' }}
          />
          
          <CardEstadistica
            titulo="Equipos Eliminados"
            valor={estadisticas.accionesPorTipo.eliminado || 0}
            icono={<FaTrash />}
            color="red"
            descripcion="Equipos dados de baja del sistema"
            tendencia={{ porcentaje: 15, direccion: 'down' }}
          />
        </div>

        {/* Gráficos y detalles adicionales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 'clamp(20px, 4vw, 32px)'
        }}>
          {/* Actividad por día */}
          <GraficoBarrasSimple
            datos={estadisticas.actividadPorDia}
            titulo="📅 Actividad por Día (Últimos 7 días)"
            maxBarras={7}
          />

          {/* Top usuarios activos */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '16px',
            padding: 'clamp(20px, 4vw, 24px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: 'clamp(20px, 4vw, 24px)',
              paddingBottom: '16px',
              borderBottom: '2px solid #f1f5f9'
            }}>
              <FaUsers style={{ fontSize: '20px', color: '#3b82f6' }} />
              <h3 style={{
                margin: 0,
                color: '#1e293b',
                fontSize: 'clamp(16px, 3vw, 18px)',
                fontWeight: 700,
                letterSpacing: '-0.5px'
              }}>
                👥 Usuarios Más Activos
              </h3>
            </div>

            {estadisticas.actividadPorUsuario.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.5vw, 16px)' }}>
                {estadisticas.actividadPorUsuario.slice(0, 5).map((usuario, index) => {
                  const iconos = [FaTrophy, FaMedal, FaAward, FaStar, FaStar];
                  const colores = ['#f59e0b', '#9ca3af', '#ea580c', '#3b82f6', '#6366f1'];
                  const IconoUsuario = iconos[index] || FaStar;
                  
                  return (
                    <div 
                      key={index} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'clamp(12px, 2.5vw, 16px)',
                        background: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0f9ff';
                        e.currentTarget.style.borderColor = '#bae6fd';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? '#f8fafc' : '#ffffff';
                        e.currentTarget.style.borderColor = '#f1f5f9';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: 'clamp(32px, 6vw, 40px)',
                          height: 'clamp(32px, 6vw, 40px)',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${colores[index]} 0%, ${colores[index]}CC 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 'clamp(14px, 2.5vw, 16px)',
                          fontWeight: 700,
                          boxShadow: `0 4px 12px ${colores[index]}40`
                        }}>
                          <IconoUsuario />
                        </div>
                        <div>
                          <div style={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: 'clamp(13px, 2.5vw, 15px)',
                            lineHeight: '1.2'
                          }}>
                            {usuario.usuario}
                          </div>
                          <div style={{
                            fontSize: 'clamp(11px, 2vw, 12px)',
                            color: '#64748b',
                            fontWeight: 500
                          }}>
                            {usuario.acciones} acciones realizadas
                          </div>
                        </div>
                      </div>
                      <div style={{
                        background: `linear-gradient(135deg, ${colores[index]}20 0%, ${colores[index]}10 100%)`,
                        color: colores[index],
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                        fontWeight: 700,
                        border: `1px solid ${colores[index]}30`
                      }}>
                        {usuario.acciones}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                padding: '32px 16px'
              }}>
                <div style={{ fontSize: 'clamp(48px, 8vw, 64px)', marginBottom: '16px', opacity: 0.5 }}>👤</div>
                <p style={{
                  margin: 0,
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: 500
                }}>
                  No hay actividad de usuarios
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resumen por tipo de acción */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 24px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: 'clamp(20px, 4vw, 24px)',
            paddingBottom: '16px',
            borderBottom: '2px solid #f1f5f9'
          }}>
            <FaChartBar style={{ fontSize: '20px', color: '#3b82f6' }} />
            <h3 style={{
              margin: 0,
              color: '#1e293b',
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}>
              📈 Distribución de Acciones
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'clamp(16px, 3vw, 20px)'
          }}>
            {Object.entries(estadisticas.accionesPorTipo).map(([tipo, cantidad]) => {
              const porcentaje = totalAccionesPorTipo > 0 ? ((cantidad / totalAccionesPorTipo) * 100).toFixed(1) : '0';
              const color = auditoriaService.obtenerColorAccion(tipo);
              const icono = auditoriaService.obtenerIconoAccion(tipo);
              
              return (
                <div 
                  key={tipo} 
                  style={{
                    textAlign: 'center',
                    padding: 'clamp(16px, 3vw, 20px)',
                    background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
                    borderRadius: '12px',
                    border: `1px solid ${color}20`,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${color}30`;
                    e.currentTarget.style.background = `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`;
                  }}
                >
                  <div style={{
                    fontSize: 'clamp(24px, 5vw, 32px)',
                    marginBottom: '12px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}>
                    {icono}
                  </div>
                  <div style={{
                    fontSize: 'clamp(20px, 4vw, 28px)',
                    fontWeight: 800,
                    color: color,
                    marginBottom: '6px'
                  }}>
                    {cantidad}
                  </div>
                  <div style={{
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    color: '#374151',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    marginBottom: '4px'
                  }}>
                    {tipo}
                  </div>
                  <div style={{
                    fontSize: 'clamp(10px, 2vw, 11px)',
                    color: '#64748b',
                    fontWeight: 500,
                    marginBottom: '12px'
                  }}>
                    {porcentaje}% del total
                  </div>
                  
                  {/* Barra de progreso */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'rgba(148, 163, 184, 0.2)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '8px'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
                        borderRadius: '3px',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        width: `${porcentaje}%`,
                        boxShadow: `0 0 8px ${color}50`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Información adicional */}
          <div style={{
            marginTop: 'clamp(20px, 4vw, 24px)',
            padding: 'clamp(16px, 3vw, 20px)',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '12px',
            border: '1px solid #bae6fd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              color: '#0369a1',
              fontWeight: 600
            }}>
              <FaChartLine style={{ fontSize: '14px' }} />
              Total de acciones registradas: {totalAccionesPorTipo}
            </div>
            <div style={{
              fontSize: 'clamp(11px, 2vw, 12px)',
              color: '#64748b',
              fontWeight: 500
            }}>
              Datos actualizados en tiempo real
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EstadisticasAuditoria;