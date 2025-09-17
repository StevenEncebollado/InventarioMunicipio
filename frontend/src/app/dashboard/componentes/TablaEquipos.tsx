import React from 'react';
import { FaUser, FaLaptopCode, FaDesktop, FaEye, FaEdit, FaBarcode, FaCircle, FaNetworkWired, FaCogs, FaTrash, FaPlus, FaMicrochip } from 'react-icons/fa';
import type { Equipo } from '@/types';
import { useRouter } from 'next/navigation';
import { useEquipoExtendido } from '../hooks/useEquipoExtendido';

interface TablaEquiposProps {
  equipos: any[];
  titulo: string;
  icono: React.ReactNode;
  mostrarSoloRecientes?: boolean;
  mostrarColumnaAnyDesk?: boolean;
  mostrarBotonEliminar?: boolean;
  mostrarBotonAgregar?: boolean;
  onEliminar?: (equipo: any) => void;
  maxWidth?: string | number;
  margin?: string;
  containerStyle?: React.CSSProperties;
}

export default function TablaEquipos({ 
  equipos, 
  titulo = "Equipos Recientes",
  icono = <FaDesktop style={{ color: '#3b82f6', fontSize: '1.5rem' }} />,
  mostrarSoloRecientes = true,
  mostrarColumnaAnyDesk = false,
  mostrarBotonEliminar = false,
  mostrarBotonAgregar = false,
  onEliminar,
  maxWidth = 1200,
  margin = '48px auto',
  containerStyle = {}
}: TablaEquiposProps) {
  // Decidir qué equipos mostrar basado en la prop
  // Si mostrarSoloRecientes=true: muestra los 4 equipos más recientes ordenados por ID descendente
  // Si mostrarSoloRecientes=false: muestra todos los equipos
  const equiposAMostrar = mostrarSoloRecientes 
    ? (Array.isArray(equipos) ? [...equipos].sort((a, b) => b.id - a.id).slice(0, 4) : [])
    : (Array.isArray(equipos) ? equipos : []);
    
  const router = useRouter();

  const handleVerClick = (equipo: Equipo) => {
    router.push(`/dashboard/equipo/${equipo.id}`);
  };

  const handleEditarClick = (equipoId: number) => {
    router.push(`/dashboard/editar_equipo/${equipoId}`);
  };

  // Componente interno para cada fila que usa el hook de equipo extendido
  const FilaEquipo = ({ equipo, index }: { equipo: Equipo; index: number }) => {
    const equipoExtendido = useEquipoExtendido(equipo);
    
    return (
      <tr 
        key={equipo.id} 
        style={{ 
          borderBottom: '1px solid #f1f5f9',
          background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f1f5f9';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8fafc';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <td style={{ 
          padding: '16px 20px', 
          fontWeight: 600, 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          color: '#1f2937',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {(equipo.nombres_funcionario || 'SA').charAt(0).toUpperCase()}
            </div>
            <span>{equipo.nombres_funcionario || 'Sin asignar'}</span>
          </div>
        </td>
        <td style={{ 
          padding: '16px 20px', 
          whiteSpace: 'nowrap',
          color: '#4b5563',
          fontSize: '13px',
          fontFamily: 'monospace',
          fontWeight: 500
        }}>
          <div style={{
            background: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            display: 'inline-block'
          }}>
            {equipo.codigo_inventario || 'Sin código'}
          </div>
        </td>
        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div 
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: equipo.estado === 'Activo' ? '#10b981' : 
                         equipo.estado === 'Mantenimiento' ? '#f59e0b' : 
                         '#ef4444',
              display: 'inline-block',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              border: '2px solid #fff',
              cursor: 'help'
            }}
            title={`Estado: ${equipo.estado}`}
          />
        </td>
        <td style={{ 
          padding: '16px 20px', 
          whiteSpace: 'nowrap',
          color: '#374151',
          fontSize: '14px',
          fontWeight: 500
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaDesktop style={{ color: '#6b7280', fontSize: '14px' }} />
            {equipo.nombre_pc || 'N/A'}
          </div>
        </td>
        <td style={{ 
          padding: '16px 20px', 
          whiteSpace: 'nowrap',
          color: '#374151',
          fontSize: '14px',
          fontWeight: 500
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaMicrochip style={{ color: '#8b5cf6', fontSize: '14px' }} />
            <span style={{
              background: '#faf5ff',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #e9d5ff',
              color: '#7c3aed',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {equipoExtendido?.dispositivo_nombre || 'N/A'}
            </span>
          </div>
        </td>
        <td style={{ 
          padding: '16px 20px', 
          fontFamily: 'monospace', 
          whiteSpace: 'nowrap',
          color: '#4b5563',
          fontSize: '13px',
          fontWeight: 500
        }}>
          <div style={{
            background: '#f8fafc',
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FaNetworkWired style={{ color: '#6b7280', fontSize: '12px' }} />
            {equipo.direccion_ip || 'N/A'}
          </div>
        </td>
        <td style={{ 
          padding: '16px 20px', 
          fontFamily: 'monospace', 
          whiteSpace: 'nowrap',
          color: '#4b5563',
          fontSize: '13px',
          fontWeight: 500
        }}>
          <div style={{
            background: '#f0f9ff',
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #bae6fd',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FaNetworkWired style={{ color: '#0369a1', fontSize: '12px' }} />
            {equipo.direccion_mac || 'N/A'}
          </div>
        </td>
        {mostrarColumnaAnyDesk && (
          <td style={{ 
            padding: '16px 20px', 
            whiteSpace: 'nowrap',
            color: '#374151',
            fontSize: '13px',
            fontWeight: 500
          }}>
            <div style={{
              background: '#fff7ed',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #fed7aa',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#c2410c'
            }}>
              <FaCogs style={{ fontSize: '12px' }} />
              {equipo.anydesk || 'N/A'}
            </div>
          </td>
        )}
        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
            <button 
              onClick={() => handleVerClick(equipo)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 10px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                minWidth: '36px',
                height: '36px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.3)';
              }}
              title="Ver detalles del equipo"
            >
              <FaEye style={{ fontSize: '12px' }} />
            </button>
            
            <button 
              onClick={() => handleEditarClick(equipo.id)}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 10px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
                minWidth: '36px',
                height: '36px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.3)';
              }}
              title="Editar equipo"
            >
              <FaEdit style={{ fontSize: '12px' }} />
            </button>
            
            {mostrarBotonEliminar && onEliminar && (
              <button
                onClick={() => onEliminar(equipo)}
                disabled={equipo.estado === 'Inactivo'}
                style={{
                  background: equipo.estado === 'Inactivo' 
                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  cursor: equipo.estado === 'Inactivo' ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  boxShadow: equipo.estado === 'Inactivo' 
                    ? '0 2px 4px rgba(156, 163, 175, 0.3)' 
                    : '0 2px 4px rgba(239, 68, 68, 0.3)',
                  opacity: equipo.estado === 'Inactivo' ? 0.7 : 1,
                  minWidth: '36px',
                  height: '36px'
                }}
                onMouseEnter={(e) => {
                  if (equipo.estado !== 'Inactivo') {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (equipo.estado !== 'Inactivo') {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
                  }
                }}
                title={equipo.estado === 'Inactivo' ? 'Equipo ya inactivo' : 'Marcar como inactivo'}
              >
                <FaTrash size={11} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <section style={{ 
      maxWidth: maxWidth, 
      width: mostrarSoloRecientes ? '100%' : 'auto',
      margin: margin, 
      background: '#fff', 
      borderRadius: 16, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
      padding: 32,
      border: '1px solid #f1f5f9',
      overflow: mostrarSoloRecientes ? 'visible' : 'auto',
      ...containerStyle
    }}>
      <div style={{ 
        marginBottom: 32, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <h2 style={{ 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          fontSize: '1.5rem', 
          fontWeight: 700,
          color: '#1f2937',
          letterSpacing: '-0.5px'
        }}>
          {icono}
          {titulo}
          {/* Leyenda de estados */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginLeft: '20px',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#6b7280'
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Estados:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#10b981' }}></div>
              <span>Activo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <span>Mantenimiento</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444' }}></div>
              <span>Inactivo</span>
            </div>
          </div>
        </h2>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px' 
        }}>
          {mostrarBotonAgregar && (
            <button
              onClick={() => router.push('/dashboard/agregar_equipo')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              <FaPlus style={{ fontSize: '12px' }} />
              Agregar Equipo
            </button>
          )}
          <div style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#3b82f6'
            }}></div>
            {equiposAMostrar.length} de {equipos.length} equipos
          </div>
        </div>
      </div>

      {equiposAMostrar.length > 0 ? (
        <div style={{ 
          overflowX: 'auto',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          width: '100%'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '14px',
            background: '#fff',
            minWidth: '800px' // Asegurar un ancho mínimo para scroll horizontal
          }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  color: '#fff', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  whiteSpace: 'nowrap', 
                  minWidth: '150px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderBottom: 'none'
                }}>
                  <FaUser style={{ marginRight: 6, fontSize: '11px' }} /> Funcionario
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  color: '#fff', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  whiteSpace: 'nowrap', 
                  minWidth: '120px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderBottom: 'none'
                }}>
                  <FaBarcode style={{ marginRight: 6, fontSize: '11px' }} /> Código
                </th>
                <th style={{ 
                  textAlign: 'center', 
                  padding: '12px 16px', 
                  color: '#fff', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  whiteSpace: 'nowrap', 
                  minWidth: '60px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderBottom: 'none'
                }}>
                  <FaCircle style={{ marginRight: 6, fontSize: '10px' }} /> Estado
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  color: '#fff', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  whiteSpace: 'nowrap', 
                  minWidth: '140px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderBottom: 'none'
                }}>
                  <FaDesktop style={{ marginRight: 6, fontSize: '11px' }} /> Nombre PC
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  color: '#fff', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  whiteSpace: 'nowrap', 
                  minWidth: '130px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderBottom: 'none'
                }}>
                  <FaMicrochip style={{ marginRight: 6, fontSize: '11px' }} /> Tipo Dispositivo
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  color: '#fff', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  whiteSpace: 'nowrap', 
                  minWidth: '130px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderBottom: 'none'
                }}>
                  <FaNetworkWired style={{ marginRight: 6, fontSize: '11px' }} /> Dirección IP
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  color: '#fff', 
                  fontWeight: 700, 
                  fontSize: '12px', 
                  whiteSpace: 'nowrap', 
                  minWidth: '140px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderBottom: 'none'
                }}>
                  <FaNetworkWired style={{ marginRight: 6, fontSize: '11px' }} /> Dirección MAC
                </th>
                {mostrarColumnaAnyDesk && (
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '16px 20px', 
                    color: '#fff', 
                    fontWeight: 700, 
                    fontSize: '13px', 
                    whiteSpace: 'nowrap', 
                    width: mostrarSoloRecientes ? 'auto' : '120px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    borderBottom: 'none'
                  }}>
                    <FaCogs style={{ marginRight: 8, fontSize: '12px' }} /> AnyDesk
                  </th>
                )}
                <th style={{ 
                  textAlign: 'center', 
                  padding: '16px 20px', 
                  color: '#fff', 
                  fontWeight: 700, 
                  fontSize: '13px', 
                  whiteSpace: 'nowrap', 
                  width: mostrarSoloRecientes ? 'auto' : (mostrarBotonEliminar ? '150px' : '120px'),
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  borderBottom: 'none'
                }}>
                  <FaCogs style={{ marginRight: 8, fontSize: '12px' }} /> Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {equiposAMostrar.map((equipo: Equipo, index: number) => (
                <FilaEquipo key={equipo.id} equipo={equipo} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No hay equipos</h3>
          <p style={{ margin: 0 }}>No hay equipos registrados en el sistema.</p>
        </div>
      )}
      
      {/* CSS Responsivo */}
      <style jsx>{`
        @media (max-width: 768px) {
          table {
            font-size: 12px !important;
          }
          
          th, td {
            padding: 8px 12px !important;
            min-width: 100px !important;
          }
          
          .funcionario-cell {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .codigo-cell {
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        
        @media (max-width: 480px) {
          table {
            font-size: 11px !important;
          }
          
          th, td {
            padding: 6px 8px !important;
            min-width: 80px !important;
          }
          
          .button-group {
            flex-direction: column;
            gap: 4px;
          }
          
          .action-button {
            padding: 4px 8px !important;
            font-size: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
