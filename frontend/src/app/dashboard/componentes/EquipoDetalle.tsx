import React from 'react';
import { 
  FaUser, 
  FaDesktop, 
  FaEye, 
  FaTag, 
  FaNetworkWired, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaIdCard,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaWindows,
  FaBriefcase,
  FaTools,
  FaBuilding,
  FaRoute,
  FaPlug,
  FaFileWord,
  FaCogs,
  FaTrash
} from 'react-icons/fa';
import type { Equipo } from '@/types';
import { useEquipoExtendido } from '../hooks/useEquipoExtendido';

interface EquipoDetalleProps {
  equipo: Equipo;
}

export default function EquipoDetalle({ equipo }: EquipoDetalleProps) {
  if (!equipo) return null;

  const equipoExtendido = useEquipoExtendido(equipo);

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
      gap: '10px',
      padding: '10px',
      background: isError ? '#fef2f2' : '#f8fafc',
      borderRadius: '6px',
      border: isError ? '1px solid #fecaca' : '1px solid #e2e8f0'
    }}>
      <div style={{ color: isError ? '#dc2626' : '#2563eb', fontSize: '14px', marginTop: '2px' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', color: isError ? '#991b1b' : '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '13px', color: isError ? '#dc2626' : '#1e293b', fontWeight: isError ? 600 : 500, wordBreak: 'break-word' }}>
          {value || 'No especificado'}
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      marginBottom: '12px',
      paddingBottom: '6px',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{ color: '#2563eb', fontSize: '16px' }}>
        {icon}
      </div>
      <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
        {title}
      </h3>
    </div>
  );

  return (
    <div style={{ 
      padding: '28px', 
      width: '100%',
      maxWidth: '1200px',
      minWidth: '1000px',
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '24px', 
        textAlign: 'center',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '16px'
      }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          color: '#1e293b', 
          fontSize: '24px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <FaDesktop style={{ color: '#2563eb' }} />
          {equipoExtendido.nombre_pc || 'Detalle del Equipo'}
        </h2>
        <div style={{
          display: 'inline-block',
          background: equipoExtendido.estado === 'Activo' ? '#dcfce7' : 
                    equipoExtendido.estado === 'Mantenimiento' ? '#fef3c7' : '#fecaca',
          color: equipoExtendido.estado === 'Activo' ? '#166534' : 
                 equipoExtendido.estado === 'Mantenimiento' ? '#92400e' : '#991b1b',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          {equipoExtendido.estado}
        </div>
      </div>

      {/* Layout en 3 columnas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Columna 1: Información General */}
        <div>
          <SectionHeader icon={<FaDesktop />} title="Información General" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <InfoItem 
              icon={<FaTag />} 
              label="Código de Inventario" 
              value={equipoExtendido.codigo_inventario} 
            />
            <InfoItem 
              icon={<FaUser />} 
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
            <InfoItem 
              icon={<FaCalendarAlt />} 
              label="Fecha de Registro" 
              value={formatDate(equipoExtendido.fecha_registro)} 
            />
            {equipoExtendido.fecha_eliminacion && (
              <InfoItem 
                icon={<FaTrash />} 
                label="Fecha de Eliminación" 
                value={formatDate(equipoExtendido.fecha_eliminacion)} 
                isError={true}
              />
            )}
          </div>
        </div>

        {/* Columna 2: Conexiones */}
        <div>
          <SectionHeader icon={<FaNetworkWired />} title="Conexiones" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        <div style={{ marginTop: '24px' }}>
          <SectionHeader icon={<FaCogs />} title="Programas Adicionales" />
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            {equipoExtendido.programas_adicionales_nombres.map((programa, index) => (
              <span key={index} style={{
                background: '#e0f2fe',
                color: '#0891b2',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: 500
              }}>
                {programa}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
