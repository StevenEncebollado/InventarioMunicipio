import { FaUser, FaDesktop, FaEye } from 'react-icons/fa';
import type { Equipo } from '@/types';
import { useCatalogosContext } from '../context/CatalogosContext';

interface TablaEquiposProps {
  equipos: Equipo[];
  onAgregarClick: () => void;
}


export default function TablaEquipos({ equipos, onAgregarClick }: TablaEquiposProps) {
  // Mostrar solo los últimos 3 equipos creados (orden descendente por id)
  const ultimosEquipos = Array.isArray(equipos) ? [...equipos].sort((a, b) => b.id - a.id).slice(0, 3) : [];
  const { catalogos } = useCatalogosContext();
  return (
    <section className="equipos-section">
      <div className="section-header">
        <h3 className="section-header">
          <FaDesktop style={{ fontSize: '1.3rem', color: 'var(--primary-color)', animation: 'pulse 2s infinite alternate' }} /> Equipos Recientes
        </h3>
        <button className="btn btn-primary" onClick={onAgregarClick} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaDesktop style={{ fontSize: '1.1rem', color: '#fff', animation: 'pulse 2s infinite alternate' }} />
          Agregar Equipo
        </button>
      </div>
      {ultimosEquipos.length > 0 ? (
        <div className="table-container">
          <table className="equipos-table equipos-table-modern">
            <thead>
              <tr>
                <th><FaUser style={{ marginRight: 4, color: 'var(--secondary-color)' }} /> Funcionario</th>
                <th><FaDesktop style={{ marginRight: 4, color: 'var(--secondary-color)' }} /> Tipo de Dispositivo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ultimosEquipos.map((equipo) => {
                const tipo = catalogos.tiposEquipo.find((t: { id: number; nombre: string }) => t.id === equipo.tipo_equipo_id)?.nombre || '-';
                return (
                  <tr key={equipo.id} className="equipo-row">
                    <td className="funcionario-cell">{equipo.nombres_funcionario || 'Sin asignar'}</td>
                    <td>
                      <span className="badge-tipo">
                        {tipo}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-ver" title="Ver" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FaEye style={{ marginRight: 4, color: 'var(--primary-color)', animation: 'pulse 2s infinite alternate' }} /> Ver
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
        <div className="empty-state">
          <p>No hay equipos registrados.</p>
          <button className="btn btn-primary" onClick={onAgregarClick} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaDesktop style={{ fontSize: '1.1rem', color: '#fff', animation: 'pulse 2s infinite alternate' }} />
            Agregar primer equipo
          </button>
        </div>
      )}
    </section>
  );
}
