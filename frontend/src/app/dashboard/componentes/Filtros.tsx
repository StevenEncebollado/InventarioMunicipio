
import { useCatalogosContext } from '../context/CatalogosContext';
import { selectStyle } from '../../Diseño/Estilos/EstiloCatalogos';
import { FaBroom, FaSearch } from 'react-icons/fa';

interface FiltrosProps {
  dependenciaSeleccionada: string;
  setDependenciaSeleccionada: (value: string) => void;
  direccionSeleccionada: string;
  setDireccionSeleccionada: (value: string) => void;
  dispositivoSeleccionado: string;
  setDispositivoSeleccionado: (value: string) => void;
  equipamientoSeleccionado: string;
  setEquipamientoSeleccionado: (value: string) => void;
  tipoEquipoSeleccionado: string;
  setTipoEquipoSeleccionado: (value: string) => void;
  tipoSistemaOperativoSeleccionado: string;
  setTipoSistemaOperativoSeleccionado: (value: string) => void;
  marcaSeleccionada: string;
  setMarcaSeleccionada: (value: string) => void;
  caracteristicaSeleccionada: string;
  setCaracteristicaSeleccionada: (value: string) => void;
  ramSeleccionada: string;
  setRamSeleccionada: (value: string) => void;
  discoSeleccionado: string;
  setDiscoSeleccionado: (value: string) => void;
  officeSeleccionado: string;
  setOfficeSeleccionado: (value: string) => void;
  tipoConexionSeleccionada: string;
  setTipoConexionSeleccionada: (value: string) => void;
  programaAdicionalSeleccionado: string[];
  setProgramaAdicionalSeleccionado: (value: string[]) => void;
  onLimpiarFiltros?: () => void;
}

export default function Filtros({
  dependenciaSeleccionada, setDependenciaSeleccionada,
  direccionSeleccionada, setDireccionSeleccionada,
  dispositivoSeleccionado, setDispositivoSeleccionado,
  equipamientoSeleccionado, setEquipamientoSeleccionado,
  tipoEquipoSeleccionado, setTipoEquipoSeleccionado,
  tipoSistemaOperativoSeleccionado, setTipoSistemaOperativoSeleccionado,
  marcaSeleccionada, setMarcaSeleccionada,
  caracteristicaSeleccionada, setCaracteristicaSeleccionada,
  ramSeleccionada, setRamSeleccionada,
  discoSeleccionado, setDiscoSeleccionado,
  officeSeleccionado, setOfficeSeleccionado,
  tipoConexionSeleccionada, setTipoConexionSeleccionada,
  programaAdicionalSeleccionado, setProgramaAdicionalSeleccionado
}: FiltrosProps) {
  // Función para limpiar todos los filtros
  const limpiarFiltros = () => {
    setDependenciaSeleccionada('');
    setDireccionSeleccionada('');
    setDispositivoSeleccionado('');
    setEquipamientoSeleccionado('');
    setTipoEquipoSeleccionado('');
    setTipoSistemaOperativoSeleccionado('');
    setMarcaSeleccionada('');
    setCaracteristicaSeleccionada('');
    setRamSeleccionada('');
    setDiscoSeleccionado('');
    setOfficeSeleccionado('');
    setTipoConexionSeleccionada('');
    setProgramaAdicionalSeleccionado([]);
  };
  const { catalogos, isLoading, error } = useCatalogosContext();

  if (isLoading) {
    return (
      <section style={{maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(44,62,80,0.08)', padding: '40px 32px', marginBottom: '32px'}}>
        <h3 style={{fontWeight: 700, fontSize: '1.5rem', color: '#2980b9', marginBottom: '24px'}}>Filtros de Inventario</h3>
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Cargando filtros...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(44,62,80,0.08)', padding: '40px 32px', marginBottom: '32px'}}>
        <h3 style={{fontWeight: 700, fontSize: '1.5rem', color: '#2980b9', marginBottom: '24px'}}>Filtros de Inventario</h3>
        <div style={{ textAlign: 'center', padding: '20px', color: '#e74c3c' }}>
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="equipos-section" style={{ marginBottom: 32, padding: 0 }}>
      <div className="section-header" style={{ borderBottom: '2px solid var(--primary-color)', background: 'rgba(56,189,248,0.07)', borderTopLeftRadius: 12, borderTopRightRadius: 12, marginBottom: 0, padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaSearch style={{ fontSize: 26, color: 'var(--primary-color)' }} />
          <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary-color)' }}>Filtros de Inventario</span>
        </div>
        <button
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, border: '1.5px solid var(--primary-color)', color: 'var(--primary-color)', background: '#fff', boxShadow: '0 1px 4px rgba(56,189,248,0.07)' }}
          onClick={limpiarFiltros}
          type="button"
        >
          <FaBroom style={{ fontSize: 18, color: 'var(--primary-color)' }} /> Limpiar filtros
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, padding: '2rem', alignItems: 'start' }}>
        {/* Fila 1 */}
        <div>
          <label style={{ fontWeight: 600 }}>Dependencia</label>
          <select style={selectStyle} value={dependenciaSeleccionada} onChange={e => setDependenciaSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.dependencias.map(dep => (<option key={dep.id} value={dep.id}>{dep.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Dirección/Área</label>
          <select style={selectStyle} value={direccionSeleccionada} onChange={e => setDireccionSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.direcciones.map(dir => (<option key={dir.id} value={dir.id}>{dir.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Dispositivo</label>
          <select style={selectStyle} value={dispositivoSeleccionado} onChange={e => setDispositivoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.dispositivos.map(d => (<option key={d.id} value={d.id}>{d.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Equipamiento</label>
          <select style={selectStyle} value={equipamientoSeleccionado} onChange={e => setEquipamientoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.equipamientos.map(eq => (<option key={eq.id} value={eq.id}>{eq.nombre}</option>))}
          </select>
        </div>
        {/* Fila 2 */}
        <div>
          <label style={{ fontWeight: 600 }}>Tipo de Equipo</label>
          <select style={selectStyle} value={tipoEquipoSeleccionado} onChange={e => setTipoEquipoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.tiposEquipo.map(te => (<option key={te.id} value={te.id}>{te.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Tipo de Sistema Operativo</label>
          <select style={selectStyle} value={tipoSistemaOperativoSeleccionado} onChange={e => setTipoSistemaOperativoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.sistemasOperativos.map(so => (<option key={so.id} value={so.id}>{so.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Características</label>
          <select style={selectStyle} value={caracteristicaSeleccionada} onChange={e => setCaracteristicaSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.caracteristicas.map(c => (<option key={c.id} value={c.id}>{c.descripcion}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Marca</label>
          <select style={selectStyle} value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.marcas.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}
          </select>
        </div>
        {/* Fila 3 */}
        <div>
          <label style={{ fontWeight: 600 }}>RAM</label>
          <select style={selectStyle} value={ramSeleccionada} onChange={e => setRamSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.ram.map(r => (<option key={r.id} value={r.id}>{r.capacidad}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Disco</label>
          <select style={selectStyle} value={discoSeleccionado} onChange={e => setDiscoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.disco.map(d => (<option key={d.id} value={d.id}>{d.capacidad}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Office</label>
          <select style={selectStyle} value={officeSeleccionado} onChange={e => setOfficeSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.office.map(o => (<option key={o.id} value={o.id}>{o.version}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Tipo de Conexión</label>
          <select style={selectStyle} value={tipoConexionSeleccionada} onChange={e => setTipoConexionSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.tipoConexion.map(tc => (<option key={tc.id} value={tc.id}>{tc.nombre}</option>))}
          </select>
        </div>
        {/* Fila 4: Programa Adicional ocupa las 4 columnas */}
        <div style={{ gridColumn: '1 / span 4', marginTop: 8 }}>
          <label style={{ fontWeight: 600 }}>Programa Adicional</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: '#f8fafc', borderRadius: 10, boxShadow: '0 2px 8px rgba(56,189,248,0.08)', padding: 14, maxHeight: 180, overflowY: 'auto', border: '1.5px solid var(--primary-color)' }}>
            {(catalogos.programaAdicional || []).map((pa: any) => {
              const nombre = typeof pa === 'string' ? pa : pa.nombre;
              const id = typeof pa === 'string' ? pa : pa.id;
              return (
                <label key={id} style={{ fontWeight: 400, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="checkbox"
                    value={id}
                    checked={programaAdicionalSeleccionado.includes(String(id))}
                    onChange={e => {
                      if (e.target.checked) {
                        setProgramaAdicionalSeleccionado([...programaAdicionalSeleccionado, String(id)]);
                      } else {
                        setProgramaAdicionalSeleccionado(programaAdicionalSeleccionado.filter(item => item !== String(id)));
                      }
                    }}
                    style={{ accentColor: 'var(--primary-color)' }}
                  />
                  {nombre}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
