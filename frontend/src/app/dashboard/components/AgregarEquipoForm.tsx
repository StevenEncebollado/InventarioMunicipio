import Modal from './Modal';
import { useCatalogosContext } from '../context/CatalogosContext';
import { selectStyle } from '../constants/catalogos';

interface AgregarEquipoFormProps {
  showAddEquipo: boolean;
  setShowAddEquipo: (show: boolean) => void;
  addError: string;
  addLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  
  // Campos de texto
  ip: string; setIp: (value: string) => void;
  mac: string; setMac: (value: string) => void;
  nombrePc: string; setNombrePc: (value: string) => void;
  funcionario: string; setFuncionario: (value: string) => void;
  anydesk: string; setAnydesk: (value: string) => void;
  
  // Campos select
  tipoEquipo: string; setTipoEquipo: (value: string) => void;
  marca: string; setMarca: (value: string) => void;
  ram: string; setRam: (value: string) => void;
  disco: string; setDisco: (value: string) => void;
  office: string; setOffice: (value: string) => void;
  tipoConexion: string; setTipoConexion: (value: string) => void;
  dependencia: string; setDependencia: (value: string) => void;
  direccion: string; setDireccion: (value: string) => void;
  equipamiento: string; setEquipamiento: (value: string) => void;
  caracteristica: string; setCaracteristica: (value: string) => void;
  sistemaOperativo: string; setSistemaOperativo: (value: string) => void;
  programaAdicional: string[]; setProgramaAdicional: (value: string[]) => void;
  estado: string; setEstado: (value: string) => void;
}

export default function AgregarEquipoForm({
  showAddEquipo, setShowAddEquipo, addError, addLoading, onSubmit,
  ip, setIp, mac, setMac, nombrePc, setNombrePc, funcionario, setFuncionario, anydesk, setAnydesk,
  tipoEquipo, setTipoEquipo, marca, setMarca, ram, setRam, disco, setDisco, office, setOffice,
  tipoConexion, setTipoConexion, dependencia, setDependencia, direccion, setDireccion,
  equipamiento, setEquipamiento, caracteristica, setCaracteristica, sistemaOperativo, setSistemaOperativo,
  programaAdicional, setProgramaAdicional, estado, setEstado
}: AgregarEquipoFormProps) {
  const { catalogos, isLoading: catalogosLoading, error: catalogosError } = useCatalogosContext();
  
  if (!showAddEquipo) return null;

  if (catalogosLoading) {
    return (
      <Modal open={showAddEquipo} onClose={() => setShowAddEquipo(false)}>
        <h2>Agregar Nuevo Equipo</h2>
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Cargando formulario...
        </div>
      </Modal>
    );
  }

  if (catalogosError) {
    return (
      <Modal open={showAddEquipo} onClose={() => setShowAddEquipo(false)}>
        <h2>Agregar Nuevo Equipo</h2>
        <div style={{ textAlign: 'center', padding: '20px', color: '#e74c3c' }}>
          Error al cargar formulario: {catalogosError}
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={showAddEquipo} onClose={() => setShowAddEquipo(false)}>
      <h2 style={{ marginBottom: 16 }}>Agregar Nuevo Equipo</h2>
      {addError && <div style={{ color: 'red', marginBottom: 8 }}>{addError}</div>}
      <form
        onSubmit={onSubmit}
        style={{
          display: 'flex', 
          flexDirection: 'column', 
          gap: 14, 
          background: '#f8fafc', 
          borderRadius: 12, 
          padding: 18, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
          marginTop: 8
        }}
      >
        <input 
          value={ip} 
          onChange={e => setIp(e.target.value)} 
          placeholder="Dirección IP" 
          style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} 
        />
        <input 
          value={mac} 
          onChange={e => setMac(e.target.value)} 
          placeholder="Dirección MAC" 
          style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} 
        />
        <input 
          value={nombrePc} 
          onChange={e => setNombrePc(e.target.value)} 
          placeholder="Nombre de PC" 
          style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} 
        />
        <input 
          value={funcionario} 
          onChange={e => setFuncionario(e.target.value)} 
          placeholder="Nombres del funcionario" 
          style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} 
        />
        <input 
          value={anydesk} 
          onChange={e => setAnydesk(e.target.value)} 
          placeholder="Anydesk" 
          style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} 
        />
        <select value={estado} onChange={e => setEstado(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Estado</option>
          <option value="Activo">Activo</option>
          <option value="Mantenimiento">Mantenimiento</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        
                <select value={tipoEquipo} onChange={e => setTipoEquipo(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Tipo de equipo</option>
          {catalogos.tiposEquipo.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
        </select>
        
        <select value={marca} onChange={e => setMarca(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Marca</option>
          {catalogos.marcas.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
        </select>
        
        <select value={ram} onChange={e => setRam(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">RAM</option>
          {catalogos.ram.map(r => <option key={r.id} value={r.capacidad}>{r.capacidad}</option>)}
        </select>
        
        <select value={disco} onChange={e => setDisco(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Disco</option>
          {catalogos.disco.map(d => <option key={d.id} value={d.capacidad}>{d.capacidad}</option>)}
        </select>
        
        <select value={office} onChange={e => setOffice(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Office</option>
          {catalogos.office.map(o => <option key={o.id} value={o.version}>{o.version}</option>)}
        </select>
        
        <select value={tipoConexion} onChange={e => setTipoConexion(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Tipo de conexión</option>
          {catalogos.tipoConexion.map(tc => <option key={tc.id} value={tc.nombre}>{tc.nombre}</option>)}
        </select>
        
        <select value={dependencia} onChange={e => setDependencia(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Dependencia</option>
          {catalogos.dependencias.map(dep => <option key={dep.id} value={dep.nombre}>{dep.nombre}</option>)}
        </select>
        
        <select value={direccion} onChange={e => setDireccion(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Dirección</option>
          {catalogos.direcciones.map(dir => <option key={dir.id} value={dir.nombre}>{dir.nombre}</option>)}
        </select>
        
        <select value={equipamiento} onChange={e => setEquipamiento(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Equipamiento</option>
          {catalogos.equipamientos.map(eq => <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>)}
        </select>
        
        <select value={caracteristica} onChange={e => setCaracteristica(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Característica</option>
          {catalogos.caracteristicas.map(c => <option key={c.id} value={c.descripcion}>{c.descripcion}</option>)}
        </select>
        
        <select value={sistemaOperativo} onChange={e => setSistemaOperativo(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Sistema operativo</option>
          {catalogos.sistemasOperativos.map(so => <option key={so.id} value={so.nombre}>{so.nombre}</option>)}
        </select>
        
        <label style={{marginTop: 6, fontWeight: 500}}>Programa adicional:</label>
        <select 
          multiple 
          value={programaAdicional} 
          onChange={e => setProgramaAdicional(Array.from(e.target.selectedOptions, opt => opt.value))} 
          style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15, minHeight: 70}}
        >
          {catalogos.programaAdicional.map(pa => <option key={pa.id} value={pa.nombre}>{pa.nombre}</option>)}
        </select>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={addLoading} 
          style={{marginTop: 12, fontWeight: 700, fontSize: 17, borderRadius: 8, padding: '12px 0'}}
        >
          {addLoading ? 'Guardando...' : 'Guardar equipo'}
        </button>
      </form>
    </Modal>
  );
}
