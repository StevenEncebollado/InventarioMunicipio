import { FaUser, FaDesktop, FaEye } from 'react-icons/fa';
import type { Equipo } from '@/types';
import { useState } from 'react';
import Modal from '../../Diseño/Diseño dashboard/Modal';
import EquipoDetalle from './EquipoDetalle';

interface TablaEquiposProps {
  equipos: Equipo[];
}

export default function TablaEquipos({ equipos }: TablaEquiposProps) {
  // Mostrar solo los últimos 3 equipos creados (orden descendente por id)
  const ultimosEquipos = Array.isArray(equipos) ? [...equipos].sort((a, b) => b.id - a.id).slice(0, 3) : [];
  const [showDetalle, setShowDetalle] = useState(false);
  const [equipoDetalle, setEquipoDetalle] = useState<Equipo | null>(null);

  const handleVerClick = (equipo: Equipo) => {
    setEquipoDetalle(equipo);
    setShowDetalle(true);
  };

  return (
    <section style={{ maxWidth: 1200, margin: '48px auto', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaDesktop style={{ color: '#2563eb', fontSize: '1.5rem' }} />
          Equipos Recientes
        </h2>
        <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
          {ultimosEquipos.length} de {equipos.length} equipos
        </div>
      </div>

      {ultimosEquipos.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
                  <FaUser style={{ marginRight: 8 }} /> Funcionario
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
                  Código
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
                  Estado
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
                  Nombre PC
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
                  Dirección IP
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {ultimosEquipos.map((equipo, index) => (
                <tr 
                  key={equipo.id} 
                  style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    background: index % 2 === 0 ? '#fff' : '#f9fafb'
                  }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                    {equipo.nombres_funcionario || 'Sin asignar'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {equipo.codigo_inventario || 'Sin código'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: equipo.estado === 'Activo' ? '#dcfce7' : 
                                equipo.estado === 'Mantenimiento' ? '#fef3c7' : '#fecaca',
                      color: equipo.estado === 'Activo' ? '#166534' : 
                             equipo.estado === 'Mantenimiento' ? '#92400e' : '#991b1b',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {equipo.estado}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {equipo.nombre_pc || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>
                    {equipo.direccion_ip || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button 
                      onClick={() => handleVerClick(equipo)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1d4ed8';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FaEye style={{ fontSize: '12px' }} /> Ver
                    </button>
                  </td>
                </tr>
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

      <Modal open={showDetalle} onClose={() => setShowDetalle(false)}>
        {equipoDetalle && <EquipoDetalle equipo={equipoDetalle} />}
      </Modal>
    </section>
  );
}
