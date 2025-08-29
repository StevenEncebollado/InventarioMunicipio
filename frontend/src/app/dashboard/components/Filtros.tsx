import { useCatalogosContext } from '../context/CatalogosContext';
import { selectStyle } from '../constants/catalogos';

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
    <section className="equipos-section" style={{ marginBottom: 32 }}>
      <h3 className="section-header" style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary-color)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span role="img" aria-label="Filtro" style={{ fontSize: 22, marginRight: 8 }}>🔎</span>
        Filtros de Inventario
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        <div>
          <label style={{ fontWeight: 600 }}>Dependencia</label>
          <select style={selectStyle} value={dependenciaSeleccionada} onChange={e => setDependenciaSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.dependencias.map(dep => (<option key={dep.id} value={dep.nombre}>{dep.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Dirección/Área</label>
          <select style={selectStyle} value={direccionSeleccionada} onChange={e => setDireccionSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.direcciones.map(dir => (<option key={dir.id} value={dir.nombre}>{dir.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Dispositivo</label>
          <select style={selectStyle} value={dispositivoSeleccionado} onChange={e => setDispositivoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.dispositivos.map(d => (<option key={d.id} value={d.nombre}>{d.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Equipamiento</label>
          <select style={selectStyle} value={equipamientoSeleccionado} onChange={e => setEquipamientoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.equipamientos.map(eq => (<option key={eq.id} value={eq.nombre}>{eq.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Tipo de Equipo</label>
          <select style={selectStyle} value={tipoEquipoSeleccionado} onChange={e => setTipoEquipoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.tiposEquipo.map(te => (<option key={te.id} value={te.nombre}>{te.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Tipo de Sistema Operativo</label>
          <select style={selectStyle} value={tipoSistemaOperativoSeleccionado} onChange={e => setTipoSistemaOperativoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.sistemasOperativos.map(so => (<option key={so.id} value={so.nombre}>{so.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Características</label>
          <select style={selectStyle} value={caracteristicaSeleccionada} onChange={e => setCaracteristicaSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.caracteristicas.map(c => (<option key={c.id} value={c.descripcion}>{c.descripcion}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Marca</label>
          <select style={selectStyle} value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.marcas.map(m => (<option key={m.id} value={m.nombre}>{m.nombre}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>RAM</label>
          <select style={selectStyle} value={ramSeleccionada} onChange={e => setRamSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.ram.map(r => (<option key={r.id} value={r.capacidad}>{r.capacidad}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Disco</label>
          <select style={selectStyle} value={discoSeleccionado} onChange={e => setDiscoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.disco.map(d => (<option key={d.id} value={d.capacidad}>{d.capacidad}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Office</label>
          <select style={selectStyle} value={officeSeleccionado} onChange={e => setOfficeSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {catalogos.office.map(o => (<option key={o.id} value={o.version}>{o.version}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Programa Adicional</label>
          <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            background: '#f9f9f9',
            padding: '10px',
            minHeight: '48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '16px',
            marginTop: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            {catalogos.programaAdicional.map(pa => (
              <label key={pa.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 400 }}>
                <input
                  type="checkbox"
                  value={pa.nombre}
                  checked={programaAdicionalSeleccionado.includes(pa.nombre)}
                  onChange={e => {
                    if (e.target.checked) {
                      setProgramaAdicionalSeleccionado([...programaAdicionalSeleccionado, pa.nombre]);
                    } else {
                      setProgramaAdicionalSeleccionado(programaAdicionalSeleccionado.filter(item => item !== pa.nombre));
                    }
                  }}
                  style={{ accentColor: '#2980b9', width: 18, height: 18 }}
                />
                {pa.nombre}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Tipo de Conexión</label>
          <select style={selectStyle} value={tipoConexionSeleccionada} onChange={e => setTipoConexionSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {catalogos.tipoConexion.map(tc => (<option key={tc.id} value={tc.nombre}>{tc.nombre}</option>))}
          </select>
        </div>
      </div>
    </section>
  );
}
