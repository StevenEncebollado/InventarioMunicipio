
import { useCatalogosContext } from '../context/CatalogosContext';
import { EstiloDashboardEspecifico } from '../../Diseño/Estilos/EstiloDashboardEspecifico';
import { FaBroom, FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import { EstiloComponentesUI } from '../../Diseño/Estilos/EstiloComponentesUI';
import MultiSelectTags from './MultiSelectTags';
import FiltroItem from './FiltroItem';
import { useState } from 'react';

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

  // Lista de tipos de filtro disponibles
  const filtroOptions = [
    { key: 'dependencia', label: 'Dependencia' },
    { key: 'direccion', label: 'Dirección/Área' },
    { key: 'dispositivo', label: 'Dispositivo' },
    { key: 'equipamiento', label: 'Equipamiento' },
    { key: 'tipoEquipo', label: 'Tipo de Equipo' },
    { key: 'tipoSistemaOperativo', label: 'Tipo de Sistema Operativo' },
    { key: 'caracteristica', label: 'Características' },
    { key: 'marca', label: 'Marca' },
    { key: 'ram', label: 'RAM' },
    { key: 'disco', label: 'Disco' },
    { key: 'office', label: 'Office' },
    { key: 'tipoConexion', label: 'Tipo de Conexión' },
    { key: 'programaAdicional', label: 'Programa Adicional' },
  ];

  // Estado para los filtros seleccionados
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  // Limpiar todos los filtros
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
    setFiltrosActivos([]);
  };

  // Agregar filtro
  const agregarFiltro = (key: string) => {
    if (!filtrosActivos.includes(key)) {
      setFiltrosActivos([...filtrosActivos, key]);
    }
    setShowMenu(false);
  };

  // Quitar filtro
  const quitarFiltro = (key: string) => {
    setFiltrosActivos(filtrosActivos.filter(f => f !== key));
    // Limpiar el valor del filtro quitado
    switch (key) {
      case 'dependencia': setDependenciaSeleccionada(''); break;
      case 'direccion': setDireccionSeleccionada(''); break;
      case 'dispositivo': setDispositivoSeleccionado(''); break;
      case 'equipamiento': setEquipamientoSeleccionado(''); break;
      case 'tipoEquipo': setTipoEquipoSeleccionado(''); break;
      case 'tipoSistemaOperativo': setTipoSistemaOperativoSeleccionado(''); break;
      case 'marca': setMarcaSeleccionada(''); break;
      case 'caracteristica': setCaracteristicaSeleccionada(''); break;
      case 'ram': setRamSeleccionada(''); break;
      case 'disco': setDiscoSeleccionado(''); break;
      case 'office': setOfficeSeleccionado(''); break;
      case 'tipoConexion': setTipoConexionSeleccionada(''); break;
      case 'programaAdicional': setProgramaAdicionalSeleccionado([]); break;
    }
  };

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
    <section style={{ ...EstiloComponentesUI.tablas.tableContainer, marginBottom: 32, padding: 0, position: 'relative' }}>
      <div style={{ ...EstiloComponentesUI.tablas.tableHeader, borderBottom: '2px solid #2563eb', background: 'rgba(56,189,248,0.07)', borderTopLeftRadius: 12, borderTopRightRadius: 12, marginBottom: 0, padding: '1.2rem 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaSearch style={{ fontSize: 26, color: '#2563eb' }} />
          <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#2563eb' }}>Filtros de Inventario</span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            style={{ ...EstiloComponentesUI.botones.btn, ...EstiloComponentesUI.botones.btnOutline, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, border: '1.5px solid #2563eb', color: '#2563eb', background: '#fff', boxShadow: '0 1px 4px rgba(56,189,248,0.07)', minWidth: 120 }}
            onClick={() => setShowMenu(!showMenu)}
            type="button"
          >
            <FaPlus style={{ fontSize: 18, color: '#2563eb' }} /> Agregar filtro
          </button>
          <button
            style={{ ...EstiloComponentesUI.botones.btn, ...EstiloComponentesUI.botones.btnOutline, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, border: '1.5px solid #2563eb', color: '#2563eb', background: '#fff', boxShadow: '0 1px 4px rgba(56,189,248,0.07)', minWidth: 120 }}
            onClick={limpiarFiltros}
            type="button"
          >
            <FaBroom style={{ fontSize: 18, color: '#2563eb' }} /> Limpiar filtros
          </button>
        </div>
      </div>
      {/* Menú de agregar filtro */}
      {showMenu && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 1000, 
          background: '#fff', 
          border: '1px solid #e5e7eb', 
          borderRadius: 12, 
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)', 
          padding: '20px', 
          minWidth: 300, 
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 16, 
            paddingBottom: 12, 
            borderBottom: '1px solid #e5e7eb' 
          }}>
            <h3 style={{ 
              fontWeight: 700, 
              margin: 0, 
              color: '#1f2937', 
              fontSize: '18px' 
            }}>
              Agregar Filtro
            </h3>
            <button
              onClick={() => setShowMenu(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px'
              }}
            >
              <FaTimes />
            </button>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {filtroOptions.filter(opt => !filtrosActivos.includes(opt.key)).map(opt => (
              <button
                key={opt.key}
                style={{ 
                  width: '100%', 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  border: '1px solid #e5e7eb', 
                  background: '#fff', 
                  color: '#374151', 
                  fontWeight: 500, 
                  borderRadius: 8, 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease',
                  fontSize: '14px'
                }}
                onClick={() => agregarFiltro(opt.key)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#374151';
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Overlay para cerrar el menú */}
      {showMenu && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999
          }}
          onClick={() => setShowMenu(false)}
        />
      )}
      {/* Renderizar filtros activos */}
      {filtrosActivos.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            padding: '24px 16px',
            alignItems: 'start',
            width: '100%',
          }}
        >
          {filtrosActivos.map(key => {
            switch (key) {
              case 'dependencia':
                return (
                  <FiltroItem
                    key={key}
                    label="Dependencia"
                    value={dependenciaSeleccionada}
                    onChange={(value) => setDependenciaSeleccionada(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.dependencias}
                    placeholder="Todas"
                  />
                );
              case 'direccion':
                return (
                  <FiltroItem
                    key={key}
                    label="Dirección/Área"
                    value={direccionSeleccionada}
                    onChange={(value) => setDireccionSeleccionada(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.direcciones}
                    placeholder="Todas"
                  />
                );
              case 'dispositivo':
                return (
                  <FiltroItem
                    key={key}
                    label="Dispositivo"
                    value={dispositivoSeleccionado}
                    onChange={(value) => setDispositivoSeleccionado(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.dispositivos}
                    placeholder="Todos"
                  />
                );
              case 'equipamiento':
                return (
                  <FiltroItem
                    key={key}
                    label="Equipamiento"
                    value={equipamientoSeleccionado}
                    onChange={(value) => setEquipamientoSeleccionado(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.equipamientos}
                    placeholder="Todos"
                  />
                );
              case 'tipoEquipo':
                return (
                  <FiltroItem
                    key={key}
                    label="Tipo de Equipo"
                    value={tipoEquipoSeleccionado}
                    onChange={(value) => setTipoEquipoSeleccionado(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.tiposEquipo}
                    placeholder="Todos"
                  />
                );
              case 'tipoSistemaOperativo':
                return (
                  <FiltroItem
                    key={key}
                    label="Tipo de Sistema Operativo"
                    value={tipoSistemaOperativoSeleccionado}
                    onChange={(value) => setTipoSistemaOperativoSeleccionado(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.sistemasOperativos}
                    placeholder="Todos"
                  />
                );
              case 'caracteristica':
                return (
                  <FiltroItem
                    key={key}
                    label="Características"
                    value={caracteristicaSeleccionada}
                    onChange={(value) => setCaracteristicaSeleccionada(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.caracteristicas}
                    placeholder="Todas"
                  />
                );
              case 'marca':
                return (
                  <FiltroItem
                    key={key}
                    label="Marca"
                    value={marcaSeleccionada}
                    onChange={(value) => setMarcaSeleccionada(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.marcas}
                    placeholder="Todas"
                  />
                );
              case 'ram':
                return (
                  <FiltroItem
                    key={key}
                    label="RAM"
                    value={ramSeleccionada}
                    onChange={(value) => setRamSeleccionada(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.ram}
                    placeholder="Todas"
                  />
                );
              case 'disco':
                return (
                  <FiltroItem
                    key={key}
                    label="Disco"
                    value={discoSeleccionado}
                    onChange={(value) => setDiscoSeleccionado(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.disco}
                    placeholder="Todos"
                  />
                );
              case 'office':
                return (
                  <FiltroItem
                    key={key}
                    label="Office"
                    value={officeSeleccionado}
                    onChange={(value) => setOfficeSeleccionado(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.office}
                    placeholder="Todos"
                  />
                );
              case 'tipoConexion':
                return (
                  <FiltroItem
                    key={key}
                    label="Tipo de Conexión"
                    value={tipoConexionSeleccionada}
                    onChange={(value) => setTipoConexionSeleccionada(value as string)}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.tipoConexion}
                    placeholder="Todas"
                  />
                );
              case 'programaAdicional':
                return (
                  <FiltroItem
                    key={key}
                    label="Programa Adicional"
                    value={programaAdicionalSeleccionado}
                    onChange={(value) => setProgramaAdicionalSeleccionado(value as string[])}
                    onRemove={() => quitarFiltro(key)}
                    options={catalogos.programaAdicional}
                    type="multiselect"
                    placeholder="Buscar y seleccionar programas..."
                    searchPlaceholder="Buscar programas..."
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      )}
    </section>
  );
}
