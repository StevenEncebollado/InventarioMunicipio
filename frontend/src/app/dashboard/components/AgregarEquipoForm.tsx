import Modal from './Modal';
import { useCatalogosContext } from '../context/CatalogosContext';
import { selectStyle } from '../constants/catalogos';
import Select from 'react-select';

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
  programaAdicional: number[]; setProgramaAdicional: (value: number[]) => void;
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
      <h2 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span role="img" aria-label="Computadora" style={{ fontSize: 24 }}>💻</span>
        Agregar Nuevo Equipo
      </h2>
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
                  {catalogos.tiposEquipo.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
        
        <select value={marca} onChange={e => setMarca(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Marca</option>
          {catalogos.marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        
        <select value={ram} onChange={e => setRam(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">RAM</option>
          {catalogos.ram.map(r => <option key={r.id} value={r.id}>{r.capacidad}</option>)}
        </select>
        
        <select value={disco} onChange={e => setDisco(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Disco</option>
          {catalogos.disco.map(d => <option key={d.id} value={d.id}>{d.capacidad}</option>)}
        </select>
        
        <select value={office} onChange={e => setOffice(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Office</option>
          {catalogos.office.map(o => <option key={o.id} value={o.id}>{o.version}</option>)}
        </select>
        
        <select value={tipoConexion} onChange={e => setTipoConexion(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Tipo de conexión</option>
          {catalogos.tipoConexion.map(tc => <option key={tc.id} value={tc.id}>{tc.nombre}</option>)}
        </select>
        
        <select value={dependencia} onChange={e => setDependencia(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Dependencia</option>
          {catalogos.dependencias.map(dep => <option key={dep.id} value={dep.id}>{dep.nombre}</option>)}
        </select>
        
        <select value={direccion} onChange={e => setDireccion(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Dirección</option>
          {catalogos.direcciones.map(dir => <option key={dir.id} value={dir.id}>{dir.nombre}</option>)}
        </select>
        
        <select value={equipamiento} onChange={e => setEquipamiento(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Equipamiento</option>
          {catalogos.equipamientos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
        </select>
        
        <select value={caracteristica} onChange={e => setCaracteristica(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Característica</option>
          {catalogos.caracteristicas.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
        </select>
        
        <select value={sistemaOperativo} onChange={e => setSistemaOperativo(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}>
          <option value="">Sistema operativo</option>
          {catalogos.sistemasOperativos.map(so => <option key={so.id} value={so.id}>{so.nombre}</option>)}
        </select>
        
        <label style={{marginTop: 6, fontWeight: 500}}>Programa adicional:</label>
        <Select
          isMulti
          options={catalogos.programaAdicional.map(pa => ({ value: pa.id, label: pa.nombre }))}
          value={catalogos.programaAdicional
            .filter(pa => programaAdicional.includes(pa.id))
            .map(pa => ({ value: pa.id, label: pa.nombre }))}
          onChange={selected => setProgramaAdicional(selected ? selected.map(opt => opt.value) : [])}
          placeholder="Buscar y seleccionar programas..."
          styles={{
            control: (base, state) => ({
              ...base,
              background: '#fff',
              border: '1px solid #bdbdbd',
              borderRadius: 8,
              fontSize: 15,
              minHeight: 44,
              boxShadow: state.isFocused ? '0 0 0 2px #2563eb33' : 'none',
              padding: '2px',
              outline: 'none',
              transition: 'box-shadow 0.2s',
            }),
            menu: (base) => ({ ...base, zIndex: 9999, borderRadius: 8 }),
            multiValue: (base) => ({ ...base, background: '#e0e7ef', borderRadius: 6 }),
            multiValueLabel: (base) => ({ ...base, color: '#1e293b', fontWeight: 500 }),
            multiValueRemove: (base) => ({ ...base, color: '#2563eb', ':hover': { background: '#c7d2fe', color: '#1e40af' } }),
            option: (base, state) => ({
              ...base,
              background: state.isSelected ? '#2563eb' : state.isFocused ? '#e0e7ef' : '#fff',
              color: state.isSelected ? '#fff' : '#1e293b',
              fontWeight: state.isSelected ? 700 : 400,
              fontSize: 15,
            }),
            placeholder: (base) => ({ ...base, color: '#64748b', fontSize: 15 }),
            input: (base) => ({ ...base, fontSize: 15 }),
          }}
          filterOption={(option, input) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          noOptionsMessage={() => 'No hay coincidencias'}
        />
        
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
