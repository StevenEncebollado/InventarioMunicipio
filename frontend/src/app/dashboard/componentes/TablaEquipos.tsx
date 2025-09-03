import { FaUser, FaDesktop, FaEye, FaMousePointer } from 'react-icons/fa';
import type { Equipo } from '@/types';
import { useCatalogosContext } from '../context/CatalogosContext';
import { useState } from 'react';
import Modal from '../../Diseño/Diseño dashboard/Modal';
import EquipoDetalle from './EquipoDetalle';
import { estiloTablas } from '../../Diseño/Estilos/EstiloTablas';
import { estiloBoton } from '../../Diseño/Estilos/EstiloBoton';



interface TablaEquiposProps {
  equipos: Equipo[];
  onAgregarClick: () => void;
}


export default function TablaEquipos({ equipos, onAgregarClick }: TablaEquiposProps) {
  // Mostrar solo los últimos 3 equipos creados (orden descendente por id)
  const ultimosEquipos = Array.isArray(equipos) ? [...equipos].sort((a, b) => b.id - a.id).slice(0, 3) : [];
  const { catalogos } = useCatalogosContext();
  const [showDetalle, setShowDetalle] = useState(false);
  const [equipoDetalle, setEquipoDetalle] = useState<Equipo | null>(null);

  const handleVerClick = (equipo: Equipo) => {
    setEquipoDetalle(equipo);
    setShowDetalle(true);
  };

  return (
    <section style={estiloTablas.equiposSection}>
      <div style={estiloTablas.sectionHeader}>
        <h3 style={estiloTablas.sectionHeaderH3}>
          <FaDesktop style={{ fontSize: '1.3rem', color: '#2563eb', animation: 'pulse 2s infinite alternate' }} /> Equipos Recientes
        </h3>
        <button onClick={onAgregarClick} style={{ ...estiloBoton.btn, ...estiloBoton.btnPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaDesktop style={{ fontSize: '1.1rem', color: '#fff', animation: 'pulse 2s infinite alternate' }} />
          Agregar Equipo
        </button>
      </div>
      {ultimosEquipos.length > 0 ? (
        <div style={estiloTablas.tableContainer}>
          <table style={estiloTablas.equiposTable}>
            <thead>
              <tr>
                <th style={estiloTablas.equiposTableTh}><FaUser style={{ marginRight: 4, color: '#111' }} /> Funcionario</th>
                <th style={estiloTablas.equiposTableTh}><FaDesktop style={{ marginRight: 4, color: '#111' }} /> Tipo de Dispositivo</th>
                <th style={estiloTablas.equiposTableTh}><FaMousePointer style={{ marginRight: 4, color: '#111' }} /> Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ultimosEquipos.map((equipo) => {
                const tipo = catalogos.tiposEquipo.find((t: { id: number; nombre: string }) => t.id === equipo.tipo_equipo_id)?.nombre || '-';
                return (
                  <tr key={equipo.id} style={estiloTablas.equipoRow}>
                    <td style={{ fontWeight: 500, color: '#333', ...estiloTablas.equiposTableTd }}>{equipo.nombres_funcionario || 'Sin asignar'}</td>
                    <td style={estiloTablas.equiposTableTd}>
                      <span style={estiloTablas.badgeTipo}>
                        {tipo}
                      </span>
                    </td>
                    <td style={estiloTablas.equiposTableTd}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button title="Ver" style={{ ...estiloBoton.btn, ...estiloBoton.btnPrimary, ...estiloBoton.btnSm, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => handleVerClick(equipo)}>
                          <FaEye style={{ marginRight: 4, color: '#fff', animation: 'pulse 2s infinite alternate' }} /> Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          <p>No hay equipos registrados.</p>
          <button onClick={onAgregarClick} style={{ ...estiloBoton.btn, ...estiloBoton.btnPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaDesktop style={{ fontSize: '1.1rem', color: '#fff', animation: 'pulse 2s infinite alternate' }} />
            Agregar primer equipo
          </button>
        </div>
      )}
      <Modal open={showDetalle} onClose={() => setShowDetalle(false)}>
        {equipoDetalle && <EquipoDetalle equipo={equipoDetalle} />}
      </Modal>
    </section>
  );
}
