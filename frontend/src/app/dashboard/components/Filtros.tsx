import { 
  dependenciasCatalogo, 
  direccionesCatalogo, 
  dispositivosCatalogo,
  equipamientosCatalogo,
  tipoEquipoCatalogo,
  tipoSistemaOperativoCatalogo,
  caracteristicasCatalogo,
  marcasCatalogo,
  ramCatalogo,
  discoCatalogo,
  officeCatalogo,
  programaAdicionalCatalogo,
  tipoConexionCatalogo,
  selectStyle
} from '../constants/catalogos';

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
  return (
    <section style={{maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(44,62,80,0.08)', padding: '40px 32px', marginBottom: '32px'}}>
      <h3 style={{fontWeight: 700, fontSize: '1.5rem', color: '#2980b9', marginBottom: '24px'}}>Filtros de Inventario</h3>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px'}}>
        <div>
          <label style={{ fontWeight: 600 }}>Dependencia</label>
          <select style={selectStyle} value={dependenciaSeleccionada} onChange={e => setDependenciaSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {dependenciasCatalogo.map(dep => (<option key={dep} value={dep}>{dep}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Dirección/Área</label>
          <select style={selectStyle} value={direccionSeleccionada} onChange={e => setDireccionSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {direccionesCatalogo.map(dir => (<option key={dir} value={dir}>{dir}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Dispositivo</label>
          <select style={selectStyle} value={dispositivoSeleccionado} onChange={e => setDispositivoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {dispositivosCatalogo.map(d => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Equipamiento</label>
          <select style={selectStyle} value={equipamientoSeleccionado} onChange={e => setEquipamientoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {equipamientosCatalogo.map(eq => (<option key={eq} value={eq}>{eq}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Tipo de Equipo</label>
          <select style={selectStyle} value={tipoEquipoSeleccionado} onChange={e => setTipoEquipoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {tipoEquipoCatalogo.map(te => (<option key={te} value={te}>{te}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Tipo de Sistema Operativo</label>
          <select style={selectStyle} value={tipoSistemaOperativoSeleccionado} onChange={e => setTipoSistemaOperativoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {tipoSistemaOperativoCatalogo.map(so => (<option key={so} value={so}>{so}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Características</label>
          <select style={selectStyle} value={caracteristicaSeleccionada} onChange={e => setCaracteristicaSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {caracteristicasCatalogo.map(c => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Marca</label>
          <select style={selectStyle} value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {marcasCatalogo.map(m => (<option key={m} value={m}>{m}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>RAM</label>
          <select style={selectStyle} value={ramSeleccionada} onChange={e => setRamSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {ramCatalogo.map(r => (<option key={r} value={r}>{r}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Disco</label>
          <select style={selectStyle} value={discoSeleccionado} onChange={e => setDiscoSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {discoCatalogo.map(d => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Office</label>
          <select style={selectStyle} value={officeSeleccionado} onChange={e => setOfficeSeleccionado(e.target.value)}>
            <option value="">Todos</option>
            {officeCatalogo.map(o => (<option key={o} value={o}>{o}</option>))}
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
            {programaAdicionalCatalogo.map(pa => (
              <label key={pa} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 400 }}>
                <input
                  type="checkbox"
                  value={pa}
                  checked={programaAdicionalSeleccionado.includes(pa)}
                  onChange={e => {
                    if (e.target.checked) {
                      setProgramaAdicionalSeleccionado([...programaAdicionalSeleccionado, pa]);
                    } else {
                      setProgramaAdicionalSeleccionado(programaAdicionalSeleccionado.filter(item => item !== pa));
                    }
                  }}
                  style={{ accentColor: '#2980b9', width: 18, height: 18 }}
                />
                {pa}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Tipo de Conexión</label>
          <select style={selectStyle} value={tipoConexionSeleccionada} onChange={e => setTipoConexionSeleccionada(e.target.value)}>
            <option value="">Todas</option>
            {tipoConexionCatalogo.map(tc => (<option key={tc} value={tc}>{tc}</option>))}
          </select>
        </div>
      </div>
    </section>
  );
}
