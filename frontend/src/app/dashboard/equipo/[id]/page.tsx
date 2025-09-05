'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaUser, 
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

// Función para formatear fecha con hora
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

export default function DetalleEquipoPage() {
  const params = useParams();
  const router = useRouter();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const equipoExtendido = useEquipoExtendido(equipo!);

  useEffect(() => {
    const cargarEquipo = async () => {
      try {
        setIsLoading(true);
        const id = parseInt(params.id as string);
        const equipoData = await getEquipo(id);
        setEquipo(equipoData);
      } catch (err) {
        setError('Error al cargar el equipo');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      cargarEquipo();
    }
  }, [params.id]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoItem = ({ icon, label, value, isError = false }: { icon: React.ReactNode; label: string; value: string | number | null | undefined; isError?: boolean }) => (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '16px',
      background: isError ? '#fef2f2' : '#f8fafc',
      borderRadius: '8px',
      border: isError ? '1px solid #fecaca' : '1px solid #e2e8f0'
    }}>
      <div style={{ color: isError ? '#dc2626' : '#2563eb', fontSize: '18px', marginTop: '2px' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: isError ? '#991b1b' : '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '16px', color: isError ? '#dc2626' : '#1e293b', fontWeight: isError ? 600 : 500, wordBreak: 'break-word' }}>
          {value || 'No especificado'}
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '2px solid #e2e8f0'
    }}>
      <div style={{ color: '#2563eb', fontSize: '24px' }}>
        {icon}
      </div>
      <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px', fontWeight: 600 }}>
        {title}
      </h3>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '48px' }}>⏳</div>
        <p style={{ color: '#64748b', fontSize: '18px' }}>Cargando detalles del equipo...</p>
      </div>
    );
  }

  if (error || !equipo) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '48px' }}>❌</div>
        <p style={{ color: '#ef4444', fontSize: '18px' }}>{error || 'Equipo no encontrado'}</p>
        <button
          onClick={() => router.back()}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        
        {/* Header con botón de regreso */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px', 
          borderBottom: '3px solid #e2e8f0',
          paddingBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => router.back()}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#475569',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <FaArrowLeft />
              Volver
            </button>
            <div>
              <h1 style={{ 
                margin: '0 0 8px 0', 
                color: '#1e293b', 
                fontSize: '32px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <FaDesktop style={{ color: '#2563eb' }} />
                {equipoExtendido.nombre_pc || 'Detalle del Equipo'}
              </h1>
              <div style={{
                display: 'inline-block',
                background: equipoExtendido.estado === 'Activo' ? '#dcfce7' : 
                          equipoExtendido.estado === 'Mantenimiento' ? '#fef3c7' : '#fecaca',
                color: equipoExtendido.estado === 'Activo' ? '#166534' : 
                       equipoExtendido.estado === 'Mantenimiento' ? '#92400e' : '#991b1b',
                padding: '8px 16px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 600
              }}>
                {equipoExtendido.estado}
              </div>
            </div>
          </div>
        </div>

        {/* Layout en 3 columnas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '32px',
          alignItems: 'start'
        }}>
          
          {/* Columna 1: Información General */}
          <div>
            <SectionHeader icon={<FaDesktop />} title="Información General" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InfoItem 
                icon={<FaTag />} 
                label="Código de Inventario" 
                value={equipoExtendido.codigo_inventario} 
              />
              <InfoItem 
                icon={null} 
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          <div style={{ marginTop: '32px' }}>
            <SectionHeader icon={<FaCogs />} title="Programas Adicionales" />
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '12px',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              {equipoExtendido.programas_adicionales_nombres.map((programa, index) => (
                <span key={index} style={{
                  background: '#e0f2fe',
                  color: '#0891b2',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 500
                }}>
                  {programa}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Información de Fechas - Full Width */}
        <div style={{ marginTop: '32px' }}>
          <SectionHeader icon={<FaClock />} title="Registro y Estado" />
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '24px',
            padding: '24px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              padding: '20px',
              background: '#dcfce7',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <FaCalendarAlt style={{ fontSize: '32px', color: '#166534', marginBottom: '12px' }} />
              <h3 style={{ margin: '0 0 8px 0', color: '#166534', fontSize: '18px', fontWeight: 600 }}>
                Fecha de Registro
              </h3>
              <p style={{ margin: 0, color: '#166534', fontSize: '16px', fontWeight: 500 }}>
                {formatearFechaConHora(equipoExtendido.fecha_registro)}
              </p>
            </div>
            
            {equipoExtendido.fecha_eliminacion && (
              <div style={{
                padding: '20px',
                background: '#fecaca',
                borderRadius: '12px',
                border: '1px solid #fca5a5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <FaTrash style={{ fontSize: '32px', color: '#991b1b', marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', color: '#991b1b', fontSize: '18px', fontWeight: 600 }}>
                  Fecha de Eliminación
                </h3>
                <p style={{ margin: 0, color: '#991b1b', fontSize: '16px', fontWeight: 500 }}>
                  {formatearFechaConHora(equipoExtendido.fecha_eliminacion)}
                </p>
              </div>
            )}
            
            {!equipoExtendido.fecha_eliminacion && (
              <div style={{
                padding: '20px',
                background: '#e0f2fe',
                borderRadius: '12px',
                border: '1px solid #bae6fd',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <FaDesktop style={{ fontSize: '32px', color: '#0891b2', marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', color: '#0891b2', fontSize: '18px', fontWeight: 600 }}>
                  Estado del Equipo
                </h3>
                <p style={{ margin: 0, color: '#0891b2', fontSize: '16px', fontWeight: 500 }}>
                  Equipo activo en inventario
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
