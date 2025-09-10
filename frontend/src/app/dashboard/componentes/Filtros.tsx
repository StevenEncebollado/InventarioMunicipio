
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
    <section style={{ 
      ...EstiloComponentesUI.tablas.tableContainer, 
      marginBottom: 32, 
      padding: 0, 
      position: 'relative',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid rgba(226,232,240,0.8)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
    }}>
      <div className="filter-header" style={{ 
        borderBottom: '2px solid #e2e8f0', 
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(147,197,253,0.05) 100%)', 
        borderTopLeftRadius: 16, 
        borderTopRightRadius: 16, 
        marginBottom: 0, 
        padding: '20px 24px', 
        display: 'flex', 
        flexWrap: 'wrap', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          minWidth: 'fit-content'
        }}>
          <FaSearch style={{ 
            fontSize: 28, 
            color: '#2563eb',
            filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.2))'
          }} />
          <span style={{ 
            fontWeight: 700, 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
            color: '#1e40af',
            letterSpacing: '-0.025em',
            textShadow: '0 1px 2px rgba(59,130,246,0.1)'
          }}>
            Filtros de Inventario
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          <button
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              fontWeight: 600,
              fontSize: '0.95rem',
              padding: '12px 20px',
              border: '2px solid #3b82f6', 
              color: '#3b82f6', 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
              boxShadow: '0 4px 12px rgba(59,130,246,0.15)',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setShowMenu(!showMenu)}
            type="button"
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
              target.style.color = '#ffffff';
              target.style.transform = 'translateY(-1px)';
              target.style.boxShadow = '0 6px 20px rgba(59,130,246,0.25)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
              target.style.color = '#3b82f6';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 12px rgba(59,130,246,0.15)';
            }}
          >
            <FaPlus style={{ fontSize: 16 }} /> 
            <span className="button-text">Agregar filtro</span>
          </button>
          <button
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              fontWeight: 600,
              fontSize: '0.95rem',
              padding: '12px 20px',
              border: '2px solid #dc2626', 
              color: '#dc2626', 
              background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)', 
              boxShadow: '0 4px 12px rgba(220,38,38,0.15)',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap'
            }}
            onClick={limpiarFiltros}
            type="button"
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
              target.style.color = '#ffffff';
              target.style.transform = 'translateY(-1px)';
              target.style.boxShadow = '0 6px 20px rgba(220,38,38,0.25)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)';
              target.style.color = '#dc2626';
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 12px rgba(220,38,38,0.15)';
            }}
          >
            <FaBroom style={{ fontSize: 16 }} /> 
            <span className="button-text">Limpiar filtros</span>
          </button>
        </div>
      </div>
      {/* Menú de agregar filtro */}
      {showMenu && (
        <div className="filter-modal" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(226,232,240,0.8)',
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)',
          padding: '32px',
          minWidth: 320,
          maxWidth: 480,
          width: '92vw',
          maxHeight: '85vh',
          overflowY: 'auto',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28,
            paddingBottom: 20,
            borderBottom: '2px solid #e2e8f0',
          }}>
            <h3 style={{
              fontWeight: 700,
              margin: 0,
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '1.5rem',
              letterSpacing: '-0.025em',
            }}>
              Agregar Filtro
            </h3>
            <button
              onClick={() => setShowMenu(false)}
              style={{
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                border: '1px solid #cbd5e1',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                fontSize: '18px',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onMouseEnter={e => {
                const target = e.target as HTMLButtonElement;
                target.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
                target.style.borderColor = '#94a3b8';
                target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                const target = e.target as HTMLButtonElement;
                target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                target.style.borderColor = '#cbd5e1';
                target.style.transform = 'scale(1)';
              }}
            >
              <FaTimes />
            </button>
          </div>
          <div className="filter-grid" style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            maxHeight: 'calc(85vh - 120px)',
            overflowY: 'auto',
            padding: '4px',
          }}>
            {filtroOptions.filter(opt => !filtrosActivos.includes(opt.key)).map((opt, index) => (
              <button
                key={opt.key}
                className={`filter-option-${index}`}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '18px 24px',
                  border: '2px solid #e2e8f0',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  color: '#1e293b',
                  fontWeight: 600,
                  borderRadius: 16,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => agregarFiltro(opt.key)}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
                  target.style.color = '#ffffff';
                  target.style.borderColor = '#2563eb';
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
                  target.style.color = '#1e293b';
                  target.style.borderColor = '#e2e8f0';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
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
          className="active-filters-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 20,
            padding: 'clamp(16px, 3vw, 32px)',
            alignItems: 'start',
            width: '100%',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
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
      
      {/* CSS responsivo y estilos globales */}
      <style jsx global>{`
        /* Responsive para dispositivos móviles */
        @media (max-width: 768px) {
          .filter-header {
            padding: 16px 20px !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
          }
          
          .filter-header > div:first-child {
            justify-content: center !important;
            text-align: center !important;
          }
          
          .filter-header > div:last-child {
            justify-content: center !important;
            flex-direction: column !important;
            gap: 12px !important;
          }
          
          .filter-header button {
            width: 100% !important;
            justify-content: center !important;
            padding: 14px 20px !important;
          }
          
          .filter-modal {
            padding: 24px !important;
            border-radius: 16px !important;
            width: 95vw !important;
            maxWidth: none !important;
            margin: 16px !important;
          }
          
          .filter-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          .active-filters-container {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          .filter-header {
            padding: 12px 16px !important;
          }
          
          .filter-header span {
            font-size: 1.1rem !important;
          }
          
          .button-text {
            display: none !important;
          }
          
          .filter-header button {
            padding: 12px !important;
            min-width: 48px !important;
            border-radius: 50% !important;
          }
          
          .filter-modal {
            padding: 20px !important;
            border-radius: 12px !important;
            width: calc(100vw - 24px) !important;
            margin: 12px !important;
            top: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            max-height: calc(100vh - 40px) !important;
          }
          
          .filter-modal h3 {
            font-size: 1.25rem !important;
          }
          
          .filter-grid button {
            padding: 16px 20px !important;
            font-size: 0.95rem !important;
          }
        }
        
        /* Mejoras en scrollbar para el modal */
        .filter-modal {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .filter-modal::-webkit-scrollbar {
          width: 6px;
        }
        
        .filter-modal::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .filter-modal::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .filter-modal::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Animaciones suaves */
        .filter-modal {
          animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        /* Responsive para tablets */
        @media (min-width: 481px) and (max-width: 1024px) {
          .filter-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
          }
          
          .active-filters-container {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          }
          
          .filter-modal {
            width: 85vw !important;
            max-width: 600px !important;
          }
        }
        
        /* Estilos para pantallas grandes */
        @media (min-width: 1441px) {
          .filter-header {
            padding: 24px 32px !important;
          }
          
          .active-filters-container {
            padding: 32px !important;
            gap: 24px !important;
          }
          
          .filter-modal {
            max-width: 540px !important;
          }
        }
      `}</style>
    </section>
  );
}
