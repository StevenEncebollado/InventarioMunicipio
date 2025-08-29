import { formatDate } from '@/utils';
import type { Equipo } from '@/types';
import { useCatalogosContext } from '../context/CatalogosContext';

interface TablaEquiposProps {
  equipos: Equipo[];
  onAgregarClick: () => void;
}

export default function TablaEquipos({ equipos, onAgregarClick }: TablaEquiposProps) {
  // Mostrar solo los últimos 3 equipos creados (orden descendente por id)
  // Usar los campos reales del backend: nombres_funcionario y tipo_equipo_id
  const ultimosEquipos = Array.isArray(equipos) ? [...equipos].sort((a, b) => b.id - a.id).slice(0, 3) : [];
    const { catalogos } = useCatalogosContext();
  return (
    <section className="equipos-section">
      <div className="section-header">
        <h3>Equipos Recientes</h3>
        <button className="btn btn-primary" onClick={onAgregarClick}>+ Agregar Equipo</button>
      </div>
      {ultimosEquipos.length > 0 ? (
        <div className="table-container">
          <table className="equipos-table">
            <thead>
              <tr>
                <th>Funcionario</th>
                <th>Tipo de Dispositivo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ultimosEquipos.map((equipo) => (
                <tr key={equipo.id}>
                  <td>{equipo.nombres_funcionario || 'Sin asignar'}</td>
                    <td>{catalogos.tiposEquipo.find((t: { id: number; nombre: string }) => t.id === equipo.tipo_equipo_id)?.nombre || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-outline" title="Ver">Ver</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No hay equipos registrados.</p>
          <button className="btn btn-primary" onClick={onAgregarClick}>Agregar primer equipo</button>
        </div>
      )}
    </section>
  );
}
