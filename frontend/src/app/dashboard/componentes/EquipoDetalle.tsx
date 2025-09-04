import React from 'react';
import { FaUser, FaDesktop, FaEye, FaTag, FaNetworkWired, FaCalendarAlt, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import type { Equipo } from '@/types';

interface EquipoDetalleProps {
  equipo: Equipo;
}

export default function EquipoDetalle({ equipo }: EquipoDetalleProps) {
  if (!equipo) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | null | undefined }) => (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ color: '#2563eb', fontSize: '18px', marginTop: '2px' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500, wordBreak: 'break-word' }}>
          {value || 'No especificado'}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '600px', 
      minWidth: '500px',
      background: '#fff',
      borderRadius: '12px'
    }}>
      {/* Header del modal */}
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
          Detalle del Equipo
        </h2>
        <div style={{
          display: 'inline-block',
          background: equipo.estado === 'Activo' ? '#dcfce7' : 
                    equipo.estado === 'Mantenimiento' ? '#fef3c7' : '#fecaca',
          color: equipo.estado === 'Activo' ? '#166534' : 
                 equipo.estado === 'Mantenimiento' ? '#92400e' : '#991b1b',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          {equipo.estado}
        </div>
      </div>

      {/* Grid de información */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '12px',
        marginBottom: '20px'
      }}>
        <InfoItem 
          icon={<FaIdCard />} 
          label="ID del Equipo" 
          value={equipo.id} 
        />
        <InfoItem 
          icon={<FaTag />} 
          label="Código de Inventario" 
          value={equipo.codigo_inventario} 
        />
        <InfoItem 
          icon={<FaUser />} 
          label="Funcionario Asignado" 
          value={equipo.nombres_funcionario} 
        />
        <InfoItem 
          icon={<FaDesktop />} 
          label="Nombre del PC" 
          value={equipo.nombre_pc} 
        />
        <InfoItem 
          icon={<FaNetworkWired />} 
          label="Dirección IP" 
          value={equipo.direccion_ip} 
        />
        <InfoItem 
          icon={<FaNetworkWired />} 
          label="Dirección MAC" 
          value={equipo.direccion_mac} 
        />
        <InfoItem 
          icon={<FaEye />} 
          label="AnyDesk" 
          value={equipo.anydesk} 
        />
        <InfoItem 
          icon={<FaCalendarAlt />} 
          label="Fecha de Registro" 
          value={formatDate(equipo.fecha_registro)} 
        />
      </div>
    </div>
  );
}
