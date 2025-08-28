import { formatDate } from '@/utils';
import type { Equipo } from '@/types';

interface TablaEquiposProps {
  equipos: Equipo[];
  onAgregarClick: () => void;
}

export default function TablaEquipos({ equipos, onAgregarClick }: TablaEquiposProps) {
  return (
    <section className="equipos-section">
      <div className="section-header">
        <h3>Equipos Recientes</h3>
        <button className="btn btn-primary" onClick={onAgregarClick}>+ Agregar Equipo</button>
      </div>
      
      {equipos.length > 0 ? (
        <div className="table-container">
          <table className="equipos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Serie</th>
                <th>Tipo</th>
                <th>Marca</th>
                <th>Estado</th>
                <th>Dependencia</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equipos.slice(0, 10).map((equipo) => (
                <tr key={equipo.id}>
                  <td>{equipo.id}</td>
                  <td>
                    <code className="serial-code">{equipo.numero_serie}</code>
                  </td>
                  <td>{equipo.tipo_equipo}</td>
                  <td>{equipo.marca}</td>
                  <td>
                    <span className={`status-badge status-${equipo.estado ? equipo.estado.toLowerCase() : 'desconocido'}`}>
                      {equipo.estado || 'Desconocido'}
                    </span>
                  </td>
                  <td>{equipo.dependencia}</td>
                  <td>
                    {equipo.fecha_adquisicion ? formatDate(equipo.fecha_adquisicion) : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-outline" title="Ver">Ver</button>
                      <button className="btn btn-sm btn-outline" title="Editar">Editar</button>
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
