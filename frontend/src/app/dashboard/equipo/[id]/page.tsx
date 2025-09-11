'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaDesktop, 
  FaEye, 
  FaTag, 
  FaNetworkWired, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaWindows,
  FaBriefcase,
  FaTools,
  FaBuilding,
  FaPlug,
  FaFileWord,
  FaCogs,
  FaTrash,
  FaArrowLeft,
  FaClock
} from 'react-icons/fa';
import type { Equipo } from '@/types';
import { useEquipoExtendido } from '../../hooks/useEquipoExtendido';
import { getEquipo } from '@/services/api';

// Funciones memoizadas para formateo
const formatearFechaConHora = (fechaString?: string): string => {
  if (!fechaString) return 'No disponible';
  
  try {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'No especificada';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function DetalleEquipoPage() {
  const params = useParams();
  const router = useRouter();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoizar el hook para evitar re-renders innecesarios
  const equipoExtendido = useEquipoExtendido(equipo);

  // Memoizar el estado del equipo para optimizar renders
  const estadoEquipo = useMemo(() => {
    if (!equipoExtendido || !equipoExtendido.estado) return { color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' };
    
    const estados = {
      'Activo': { color: '#166534', bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '#22c55e' },
      'Mantenimiento': { color: '#92400e', bg: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)', border: '#f59e0b' },
      'Inactivo': { color: '#991b1b', bg: 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)', border: '#ef4444' }
    };
    
    return estados[equipoExtendido.estado as keyof typeof estados] || estados.Inactivo;
  }, [equipoExtendido?.estado]);

  useEffect(() => {
    const cargarEquipo = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        const id = parseInt(params.id as string);
        if (isNaN(id)) {
          throw new Error('ID de equipo inválido');
        }
        const equipoData = await getEquipo(id);
        setEquipo(equipoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el equipo');
        console.error('Error cargando equipo:', err);
      } finally {
        setIsLoading(false);
      }
    };

    cargarEquipo();
  }, [params.id]);

  // Componentes memoizados para optimizar renders
  const InfoItem = React.memo(({ icon, label, value, isError = false }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string | number | null | undefined; 
    isError?: boolean 
  }) => (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'clamp(8px, 2vw, 12px)',
      padding: 'clamp(12px, 2.5vw, 16px)',
      background: isError ? '#fef2f2' : '#f8fafc',
      borderRadius: '12px',
      border: isError ? '1px solid #fecaca' : '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
      minHeight: '60px'
    }}>
      {icon && (
        <div style={{ 
          color: isError ? '#dc2626' : '#2563eb', 
          fontSize: 'clamp(16px, 3vw, 18px)', 
          marginTop: '2px',
          flexShrink: 0
        }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          fontSize: 'clamp(10px, 2vw, 12px)', 
          color: isError ? '#991b1b' : '#64748b', 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px', 
          marginBottom: '4px' 
        }}>
          {label}
        </div>
        <div style={{ 
          fontSize: 'clamp(14px, 2.5vw, 16px)', 
          color: isError ? '#dc2626' : '#1e293b', 
          fontWeight: isError ? 600 : 500, 
          wordBreak: 'break-word',
          lineHeight: '1.4'
        }}>
          {value || 'No especificado'}
        </div>
      </div>
    </div>
  ));

  const SectionHeader = React.memo(({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 'clamp(8px, 2vw, 12px)', 
      marginBottom: 'clamp(16px, 3vw, 20px)',
      paddingBottom: 'clamp(8px, 2vw, 12px)',
      borderBottom: '2px solid #e2e8f0'
    }}>
      <div style={{ 
        color: '#2563eb', 
        fontSize: 'clamp(20px, 4vw, 24px)',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <h3 style={{ 
        margin: 0, 
        color: '#1e293b', 
        fontSize: 'clamp(16px, 3vw, 20px)', 
        fontWeight: 600,
        lineHeight: '1.2'
      }}>
        {title}
      </h3>
    </div>
  ));

  // Estados de carga y error optimizados
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        flexDirection: 'column',
        gap: 'clamp(12px, 3vw, 20px)',
        padding: '20px'
      }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ 
          color: '#64748b', 
          fontSize: 'clamp(16px, 3vw, 18px)',
          textAlign: 'center',
          margin: 0
        }}>
          Cargando detalles del equipo...
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !equipo || !equipoExtendido) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        flexDirection: 'column',
        gap: 'clamp(16px, 4vw, 24px)',
        padding: '20px'
      }}>
        <div style={{ 
          fontSize: 'clamp(40px, 8vw, 64px)',
          color: '#ef4444'
        }}>⚠️</div>
        <p style={{ 
          color: '#ef4444', 
          fontSize: 'clamp(16px, 3vw, 18px)',
          textAlign: 'center',
          margin: 0,
          maxWidth: '400px'
        }}>
          {error || 'Equipo no encontrado'}
        </p>
        <button
          onClick={() => router.back()}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            padding: 'clamp(10px, 2vw, 14px) clamp(20px, 4vw, 28px)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
          }}
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .detalle-equipo-page {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
      <div className="detalle-equipo-page" style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: 'clamp(16px, 3vw, 32px)',
        paddingBottom: 'clamp(60px, 8vh, 100px)'
      }}>
      <div className="detalle-container" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '20px',
        padding: 'clamp(24px, 4vw, 40px)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.05)',
        border: '1px solid rgba(226,232,240,0.8)',
        backdropFilter: 'blur(10px)',
        width: '100%'
      }}>
        
        {/* Header modernizado y responsive */}
        <div className="header-section" style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 3vw, 24px)',
          marginBottom: 'clamp(24px, 4vw, 40px)', 
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: 'clamp(16px, 3vw, 24px)'
        }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              border: '2px solid #cbd5e1',
              borderRadius: '12px',
              padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 20px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#475569',
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              fontWeight: 600,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              outline: 'none',
              width: 'fit-content',
              letterSpacing: '0.025em'
            }}
            onMouseEnter={e => {
              const target = e.currentTarget;
              target.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
              target.style.borderColor = '#94a3b8';
              target.style.transform = 'translateY(-1px)';
              target.style.boxShadow = '0 4px 12px rgba(71, 85, 105, 0.2)';
            }}
            onMouseLeave={e => {
              const target = e.currentTarget;
              target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
              target.style.borderColor = '#cbd5e1';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
            }}
          >
            <FaArrowLeft />
              <span>Volver</span>
          </button>
          
          <div className="title-section" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(12px, 2vw, 16px)'
          }}>
            <h1 style={{ 
              margin: 0, 
              color: '#1e293b', 
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(12px, 2vw, 20px)',
              flexWrap: 'wrap',
              lineHeight: '1.2',
              letterSpacing: '-0.025em'
            }}>
              <FaDesktop style={{ 
                color: '#2563eb',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.2))',
                flexShrink: 0
              }} />
              <span style={{ minWidth: 0, wordBreak: 'break-word' }}>
                {equipoExtendido.nombre_pc || 'Detalle del Equipo'}
              </span>
            </h1>
            
            <div style={{
              display: 'inline-block',
              background: estadoEquipo.bg,
              color: estadoEquipo.color,
              padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 20px)',
              borderRadius: '16px',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              fontWeight: 700,
              border: `2px solid ${estadoEquipo.border}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              letterSpacing: '0.025em',
              width: 'fit-content'
            }}>
              {equipoExtendido.estado || 'Sin estado'}
            </div>
          </div>
        </div>

        {/* Layout responsive con CSS Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', 
          gap: 'clamp(16px, 4vw, 32px)',
          alignItems: 'start'
        }}>
          
          {/* Columna 1: Información General */}
          <div>
            <SectionHeader icon={<FaDesktop />} title="Información General" />
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'clamp(12px, 2vw, 16px)' 
            }}>
              <InfoItem 
                icon={<FaTag />} 
                label="Código de Inventario" 
                value={equipoExtendido.codigo_inventario} 
              />
              <InfoItem 
                icon={<FaBriefcase />} 
                label="Funcionario Asignado" 
                value={equipoExtendido.nombres_funcionario} 
              />
              <InfoItem 
                icon={<FaBuilding />} 
                label="Dependencia" 
                value={equipoExtendido.dependencia_nombre} 
              />
              <InfoItem 
                icon={<FaMapMarkerAlt />} 
                label="Ubicación" 
                value={equipoExtendido.direccion_area_nombre} 
              />
              <InfoItem 
                icon={<FaBriefcase />} 
                label="Marca" 
                value={equipoExtendido.marca_nombre} 
              />
            </div>
          </div>

          {/* Columna 2: Conexiones */}
          <div>
            <SectionHeader icon={<FaNetworkWired />} title="Conexiones" />
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'clamp(12px, 2vw, 16px)' 
            }}>
              <InfoItem 
                icon={<FaNetworkWired />} 
                label="Dirección IP" 
                value={equipoExtendido.direccion_ip} 
              />
              <InfoItem 
                icon={<FaNetworkWired />} 
                label="Dirección MAC" 
                value={equipoExtendido.direccion_mac} 
              />
              <InfoItem 
                icon={<FaPlug />} 
                label="Tipo de Conexión" 
                value={equipoExtendido.tipo_conexion_nombre} 
              />
              <InfoItem 
                icon={<FaEye />} 
                label="AnyDesk" 
                value={equipoExtendido.anydesk} 
              />
            </div>
          </div>

          {/* Columna 3: Especificaciones Técnicas */}
          <div>
            <SectionHeader icon={<FaCogs />} title="Especificaciones" />
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'clamp(12px, 2vw, 16px)' 
            }}>
              <InfoItem 
                icon={<FaTools />} 
                label="Tipo de Equipo" 
                value={equipoExtendido.tipo_equipo_nombre} 
              />
              <InfoItem 
                icon={<FaWindows />} 
                label="Sistema Operativo" 
                value={equipoExtendido.tipo_sistema_operativo_nombre} 
              />
              <InfoItem 
                icon={<FaMemory />} 
                label="Memoria RAM" 
                value={equipoExtendido.ram_capacidad} 
              />
              <InfoItem 
                icon={<FaHdd />} 
                label="Disco Duro" 
                value={equipoExtendido.disco_capacidad} 
              />
              <InfoItem 
                icon={<FaMicrochip />} 
                label="Procesador" 
                value={equipoExtendido.caracteristicas_descripcion} 
              />
              <InfoItem 
                icon={<FaFileWord />} 
                label="Microsoft Office" 
                value={equipoExtendido.office_version} 
              />
            </div>
          </div>
        </div>

        {/* Programas Adicionales - Full Width */}
        {equipoExtendido.programas_adicionales_nombres && equipoExtendido.programas_adicionales_nombres.length > 0 && (
          <div style={{ marginTop: 'clamp(24px, 4vw, 32px)' }}>
            <SectionHeader icon={<FaCogs />} title="Programas Adicionales" />
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 'clamp(8px, 2vw, 12px)',
              padding: 'clamp(16px, 3vw, 24px)',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #e2e8f0'
            }}>
              {equipoExtendido.programas_adicionales_nombres.map((programa, index) => (
                <span key={index} style={{
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                  color: '#0891b2',
                  padding: 'clamp(6px, 1.5vw, 10px) clamp(12px, 2.5vw, 16px)',
                  borderRadius: '20px',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: 500,
                  border: '1px solid #0891b2',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}>
                  {programa}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Información de Fechas - Full Width */}
        <div style={{ marginTop: 'clamp(24px, 4vw, 32px)' }}>
          <SectionHeader icon={<FaClock />} title="Registro y Estado" />
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', 
            gap: 'clamp(16px, 3vw, 24px)',
            padding: 'clamp(16px, 3vw, 24px)',
            background: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              padding: 'clamp(16px, 3vw, 20px)',
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              borderRadius: '16px',
              border: '2px solid #22c55e',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '120px',
              justifyContent: 'center'
            }}>
              <FaCalendarAlt style={{ 
                fontSize: 'clamp(24px, 5vw, 32px)', 
                color: '#166534', 
                marginBottom: 'clamp(8px, 2vw, 12px)' 
              }} />
              <h3 style={{ 
                margin: '0 0 8px 0', 
                color: '#166534', 
                fontSize: 'clamp(14px, 3vw, 18px)', 
                fontWeight: 600 
              }}>
                Fecha de Registro
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#166534', 
                fontSize: 'clamp(12px, 2.5vw, 16px)', 
                fontWeight: 500,
                wordBreak: 'break-word'
              }}>
                {formatearFechaConHora(equipoExtendido.fecha_registro)}
              </p>
            </div>
            
            {equipoExtendido.fecha_eliminacion ? (
              <div style={{
                padding: 'clamp(16px, 3vw, 20px)',
                background: 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)',
                borderRadius: '16px',
                border: '2px solid #ef4444',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '120px',
                justifyContent: 'center'
              }}>
                <FaTrash style={{ 
                  fontSize: 'clamp(24px, 5vw, 32px)', 
                  color: '#991b1b', 
                  marginBottom: 'clamp(8px, 2vw, 12px)' 
                }} />
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#991b1b', 
                  fontSize: 'clamp(14px, 3vw, 18px)', 
                  fontWeight: 600 
                }}>
                  Fecha de Eliminación
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: '#991b1b', 
                  fontSize: 'clamp(12px, 2.5vw, 16px)', 
                  fontWeight: 500,
                  wordBreak: 'break-word'
                }}>
                  {formatearFechaConHora(equipoExtendido.fecha_eliminacion)}
                </p>
              </div>
            ) : (
              <div style={{
                padding: 'clamp(16px, 3vw, 20px)',
                background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                borderRadius: '16px',
                border: '2px solid #0891b2',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '120px',
                justifyContent: 'center'
              }}>
                <FaDesktop style={{ 
                  fontSize: 'clamp(24px, 5vw, 32px)', 
                  color: '#0891b2', 
                  marginBottom: 'clamp(8px, 2vw, 12px)' 
                }} />
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#0891b2', 
                  fontSize: 'clamp(14px, 3vw, 18px)', 
                  fontWeight: 600 
                }}>
                  Estado del Equipo
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: '#0891b2', 
                  fontSize: 'clamp(12px, 2.5vw, 16px)', 
                  fontWeight: 500,
                  wordBreak: 'break-word'
                }}>
                  Equipo activo en inventario
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
