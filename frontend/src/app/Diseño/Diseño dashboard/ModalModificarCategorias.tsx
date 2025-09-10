'use client';
import { useState, useEffect } from 'react';
import { 
  FaTimes, FaPlus, FaTrash, FaEdit, FaCheck, FaBuilding, 
  FaMapMarkerAlt, FaDesktop, FaTools, FaLaptop, 
  FaWindows, FaCog, FaIndustry, FaMemory, FaHdd, 
  FaMicrosoft, FaWifi, FaCode, FaSave, FaSpinner 
} from 'react-icons/fa';
import { useCatalogosContext, CategoriaType } from '../../dashboard/context/CatalogosContext';
// Hook para cargar dependencias
function useDependencias() {
  const { catalogos } = useCatalogosContext();
  return catalogos.dependencias || [];
}

// Campos disponibles para configurar en dispositivos
const CAMPOS_DISPONIBLES = [
  { key: 'codigoInventario', label: 'Código de Inventario', esencial: true },
  { key: 'nombrePc', label: 'Nombre de PC', esencial: true },
  { key: 'funcionario', label: 'Funcionario', esencial: true },
  { key: 'estado', label: 'Estado', esencial: true },
  { key: 'marca', label: 'Marca', esencial: false },
  { key: 'dependencia', label: 'Dependencia', esencial: false },
  { key: 'direccion', label: 'Dirección', esencial: false },
  { key: 'equipamiento', label: 'Equipamiento', esencial: false },
  { key: 'office', label: 'Office', esencial: false },
  { key: 'disco', label: 'Disco', esencial: false },
  { key: 'programaAdicional', label: 'Programa Adicional', esencial: false },
  { key: 'ip', label: 'Dirección IP', esencial: false },
  { key: 'mac', label: 'Dirección MAC', esencial: false },
  { key: 'tipoEquipo', label: 'Tipo de Equipo', esencial: false },
  { key: 'sistemaOperativo', label: 'Sistema Operativo', esencial: false },
  { key: 'caracteristicas', label: 'Características', esencial: false },
  { key: 'ram', label: 'RAM', esencial: false },
  { key: 'tipoConexion', label: 'Tipo de Conexión', esencial: false },
  { key: 'anydesk', label: 'AnyDesk', esencial: false }
];

interface ModalModificarCategoriasProps {
  open: boolean;
  onClose: () => void;
}

// Configuración de categorías
const categoriesConfig = {
  dependencias: { 
    label: 'Dependencias', 
    icon: FaBuilding, 
    color: '#3b82f6',
    description: 'Gestiona las dependencias del municipio'
  },
  direcciones: { 
    label: 'Direcciones/Áreas', 
    icon: FaMapMarkerAlt, 
    color: '#10b981',
    description: 'Administra direcciones y áreas'
  },
  dispositivos: { 
    label: 'Dispositivos', 
    icon: FaDesktop, 
    color: '#8b5cf6',
    description: 'Tipos de dispositivos disponibles'
  },
  equipamientos: { 
    label: 'Equipamientos', 
    icon: FaTools, 
    color: '#f59e0b',
    description: 'Equipamiento y accesorios'
  },
  tiposEquipo: { 
    label: 'Tipos de Equipo', 
    icon: FaLaptop, 
    color: '#ef4444',
    description: 'Categorías de equipos'
  },
  tiposSistemaOperativo: { 
    label: 'Sistemas Operativos', 
    icon: FaWindows, 
    color: '#06b6d4',
    description: 'Sistemas operativos disponibles'
  },
  caracteristicas: { 
    label: 'Características', 
    icon: FaCog, 
    color: '#84cc16',
    description: 'Características técnicas'
  },
  marcas: { 
    label: 'Marcas', 
    icon: FaIndustry, 
    color: '#f97316',
    description: 'Marcas de equipos'
  },
  rams: { 
    label: 'Memoria RAM', 
    icon: FaMemory, 
    color: '#ec4899',
    description: 'Capacidades de memoria RAM'
  },
  discos: { 
    label: 'Almacenamiento', 
    icon: FaHdd, 
    color: '#6366f1',
    description: 'Capacidades de almacenamiento'
  },
  offices: { 
    label: 'Microsoft Office', 
    icon: FaMicrosoft, 
    color: '#dc2626',
    description: 'Versiones de Office'
  },
  tiposConexion: { 
    label: 'Tipos de Conexión', 
    icon: FaWifi, 
    color: '#059669',
    description: 'Métodos de conectividad'
  },
  programasAdicionales: { 
    label: 'Programas Adicionales', 
    icon: FaCode, 
    color: '#7c3aed',
    description: 'Software adicional instalado'
  },
};

export default function ModalModificarCategorias({ open, onClose }: ModalModificarCategoriasProps) {
  const dependencias = useDependencias();
  const [selectedCategory, setSelectedCategory] = useState<CategoriaType | null>(null);
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  // Para área/dirección
  const [selectedDependenciaId, setSelectedDependenciaId] = useState<number | null>(null);
  
  // Estados para manejo de campos en dispositivos
  const [showCamposSelector, setShowCamposSelector] = useState(false);
  const [camposSeleccionados, setCamposSeleccionados] = useState<string[]>([
    'codigoInventario', 'nombrePc', 'funcionario', 'estado', 'marca', 'dependencia', 'direccion'
  ]);
  
  // Usar el contexto de catálogos
  const { catalogos, isLoading, error, updateCategoria, addItemToCategoria, removeItemFromCategoria, editItemInCategoria } = useCatalogosContext();
  
  // Mapeo de categorías para acceder a los datos
  const getCategoryData = (categoria: CategoriaType) => {
    switch (categoria) {
      case 'dependencias': return catalogos.dependencias;
      case 'direcciones': return catalogos.direcciones;
      case 'dispositivos': return catalogos.dispositivos;
      case 'equipamientos': return catalogos.equipamientos;
      case 'tiposEquipo': return catalogos.tiposEquipo;
      case 'tiposSistemaOperativo': return catalogos.sistemasOperativos;
      case 'caracteristicas': return catalogos.caracteristicas;
      case 'marcas': return catalogos.marcas;
      case 'rams': return catalogos.ram;
      case 'discos': return catalogos.disco;
      case 'offices': return catalogos.office;
      case 'tiposConexion': return catalogos.tipoConexion;
      case 'programasAdicionales': return catalogos.programaAdicional;
      default: return [];
    }
  };
  
  // Items de la categoría seleccionada
  const items = selectedCategory ? getCategoryData(selectedCategory) : [];

  // Función para obtener el texto de un item
  const getItemText = (item: any) => {
    if (typeof item === 'string') return item;
    return item.nombre || item.descripcion || item.capacidad || item.version || 'Sin nombre';
  };

  // Función para obtener el ID de un item
  const getItemId = (item: any) => {
    if (typeof item === 'string') return item;
    return item.id;
  };

  const handleAddItem = async () => {
    if (newItem.trim() && selectedCategory) {
      // Si es un dispositivo, mostrar selector de campos primero
      if (selectedCategory === 'dispositivos' && !showCamposSelector) {
        setShowCamposSelector(true);
        return;
      }
      
      try {
        // Crear objeto según el tipo de categoría
        let newItemData;
        
        if (selectedCategory === 'dispositivos') {
          newItemData = { 
            nombre: newItem.trim(),
            campos: camposSeleccionados 
          };
        } else if (selectedCategory === 'caracteristicas') {
          newItemData = { descripcion: newItem.trim() };
        } else if (selectedCategory === 'rams' || selectedCategory === 'discos') {
          newItemData = { capacidad: newItem.trim() };
        } else if (selectedCategory === 'offices') {
          newItemData = { version: newItem.trim() };
        } else {
          newItemData = { nombre: newItem.trim() };
        }
        
  await addItemToCategoria(selectedCategory, newItemData);
  setSelectedDependenciaId(null);
        setNewItem('');
        setShowCamposSelector(false);
        // Resetear campos seleccionados a los básicos
        setCamposSeleccionados(['codigoInventario', 'nombrePc', 'funcionario', 'estado', 'marca', 'dependencia', 'direccion']);
      } catch (error) {
        console.error('Error al agregar item:', error);
        alert('Error al agregar el item');
      }
    }
  };

  const handleDeleteItem = async (index: number) => {
    if (selectedCategory) {
      try {
        const item = items[index];
        const itemId = getItemId(item);
        await removeItemFromCategoria(selectedCategory, itemId);
      } catch (error) {
        console.error('Error al eliminar item:', error);
        alert('Error al eliminar el item');
      }
    }
  };

  const handleEditItemStart = (index: number) => {
    setEditingIndex(index);
    const item = items[index];
    setEditingValue(getItemText(item));
  };

  const handleSaveEdit = async () => {
    if (editingIndex !== null && editingValue.trim() && selectedCategory) {
      try {
        const item = items[editingIndex];
        const itemId = getItemId(item);
        
        // Crear objeto actualizado según el tipo de categoría
        const updatedData = selectedCategory === 'caracteristicas' 
          ? { descripcion: editingValue.trim() }
          : selectedCategory === 'rams' || selectedCategory === 'discos'
          ? { capacidad: editingValue.trim() }
          : selectedCategory === 'offices'
          ? { version: editingValue.trim() }
          : { nombre: editingValue.trim() };
        
        await editItemInCategoria(selectedCategory, itemId, updatedData);
        setEditingIndex(null);
        setEditingValue('');
      } catch (error) {
        console.error('Error al editar item:', error);
        alert('Error al editar el item');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  // Función para manejar selección/deselección de campos
  const toggleCampo = (campoKey: string) => {
    const campo = CAMPOS_DISPONIBLES.find(c => c.key === campoKey);
    if (campo?.esencial) return; // No permitir deseleccionar campos esenciales
    
    setCamposSeleccionados(prev => {
      if (prev.includes(campoKey)) {
        return prev.filter(c => c !== campoKey);
      } else {
        return [...prev, campoKey];
      }
    });
  };

  const handleSaveCategory = async () => {
    if (!selectedCategory) return;
    
    setIsSaving(true);
    
    try {
      await updateCategoria(selectedCategory, items);
      alert('Categoría actualizada correctamente');
    } catch (error: any) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  const modalStyles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    modal: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '24px',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      width: '100%',
      maxWidth: selectedCategory ? '900px' : '600px',
      maxHeight: '90vh',
      overflow: 'hidden',
      position: 'relative' as const,
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    header: {
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      color: 'white',
      padding: '24px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 700,
      margin: 0,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    closeButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      fontSize: '1.2rem',
      transition: 'all 0.2s ease',
    },
    body: {
      padding: '32px',
      maxHeight: '60vh',
      overflow: 'auto',
      scrollbarWidth: 'thin' as const,
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>
            {selectedCategory ? `Gestionar ${categoriesConfig[selectedCategory].label}` : 'Modificar Categorías'}
          </h2>
          <button
            style={modalStyles.closeButton}
            onClick={onClose}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={modalStyles.body}>
          {!selectedCategory ? (
            /* Vista de selección de categorías */
            <div>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#64748b', 
                textAlign: 'center', 
                marginBottom: '32px',
                lineHeight: 1.6 
              }}>
                Selecciona la categoría que deseas modificar
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {(Object.entries(categoriesConfig) as [CategoriaType, typeof categoriesConfig[CategoriaType]][]).map(([key, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <button
                      key={key}
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        border: `2px solid ${config.color}20`,
                        borderRadius: '16px',
                        padding: '24px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'left' as const,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        position: 'relative' as const,
                        overflow: 'hidden',
                      }}
                      onClick={() => setSelectedCategory(key)}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = `0 8px 25px ${config.color}20`;
                        e.currentTarget.style.borderColor = `${config.color}40`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = `${config.color}20`;
                      }}
                    >
                      {/* Icono de fondo */}
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        fontSize: '4rem',
                        color: `${config.color}08`,
                        zIndex: 0,
                      }}>
                        <IconComponent />
                      </div>
                      
                      {/* Contenido */}
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          marginBottom: '12px' 
                        }}>
                          <IconComponent style={{ 
                            fontSize: '1.5rem', 
                            color: config.color 
                          }} />
                          <h3 style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: '#1f2937',
                          }}>
                            {config.label}
                          </h3>
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          color: '#64748b',
                          lineHeight: 1.4,
                        }}>
                          {config.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Vista de gestión de items */
            <div>
              {/* Header de la categoría */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                padding: '20px',
                background: `linear-gradient(135deg, ${categoriesConfig[selectedCategory].color}10 0%, ${categoriesConfig[selectedCategory].color}05 100%)`,
                borderRadius: '16px',
                border: `1px solid ${categoriesConfig[selectedCategory].color}20`,
              }}>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: categoriesConfig[selectedCategory].color,
                    fontSize: '1.2rem',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Volver"
                >
                  ←
                </button>
                {(() => {
                  const IconComponent = categoriesConfig[selectedCategory].icon;
                  return (
                    <IconComponent 
                      style={{ 
                        fontSize: '1.8rem', 
                        color: categoriesConfig[selectedCategory].color 
                      }} 
                    />
                  );
                })()}
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: '#1f2937',
                  }}>
                    {categoriesConfig[selectedCategory].label}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: '#64748b',
                  }}>
                    {categoriesConfig[selectedCategory].description}
                  </p>
                </div>
              </div>

              {/* Agregar nuevo item */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}>
                {/* Select de dependencia solo para direcciones */}
                {selectedCategory === 'direcciones' && (
                  <select
                    value={selectedDependenciaId ?? ''}
                    onChange={e => setSelectedDependenciaId(Number(e.target.value) || null)}
                    style={{
                      minWidth: 180,
                      padding: '12px 10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      background: 'white',
                      color: '#374151',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <option value="">Selecciona dependencia</option>
                    {dependencias.map(dep => (
                      <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                    ))}
                  </select>
                )}
                <input
                  type="text"
                  placeholder={`Nuevo ${categoriesConfig[selectedCategory].label.toLowerCase()}`}
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = categoriesConfig[selectedCategory].color;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${categoriesConfig[selectedCategory].color}20`;
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.trim()}
                  style={{
                    background: `linear-gradient(135deg, ${categoriesConfig[selectedCategory].color} 0%, ${categoriesConfig[selectedCategory].color}dd 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    cursor: newItem.trim() ? 'pointer' : 'not-allowed',
                    opacity: newItem.trim() ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    if (newItem.trim()) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${categoriesConfig[selectedCategory].color}40`;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaPlus style={{ fontSize: '0.8rem' }} />
                  Agregar
                </button>
              </div>

              {/* Selector de campos para dispositivos */}
              {selectedCategory === 'dispositivos' && showCamposSelector && (
                <div style={{
                  marginBottom: '24px',
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}>
                  <h4 style={{
                    margin: '0 0 16px 0',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1f2937',
                  }}>
                    Selecciona los campos que debe tener este dispositivo:
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px',
                  }}>
                    {CAMPOS_DISPONIBLES.map((campo) => (
                      <label
                        key={campo.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: 'white',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          cursor: campo.esencial ? 'not-allowed' : 'pointer',
                          opacity: campo.esencial ? 0.7 : 1,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={camposSeleccionados.includes(campo.key)}
                          onChange={() => toggleCampo(campo.key)}
                          disabled={campo.esencial}
                          style={{
                            marginRight: '4px',
                          }}
                        />
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#374151',
                        }}>
                          {campo.label}
                          {campo.esencial && (
                            <span style={{
                              fontSize: '0.8rem',
                              color: '#6b7280',
                              marginLeft: '4px',
                            }}>
                              (esencial)
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setShowCamposSelector(false);
                        setNewItem('');
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddItem}
                      style={{
                        padding: '8px 16px',
                        background: categoriesConfig[selectedCategory].color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Confirmar Dispositivo
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de items */}
              <div style={{
                maxHeight: '300px',
                overflow: 'auto',
                scrollbarWidth: 'thin',
              }}>
                {isLoading ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#64748b' 
                  }}>
                    <FaSpinner style={{ 
                      fontSize: '2rem', 
                      animation: 'spin 1s linear infinite',
                      marginBottom: '16px',
                      display: 'block',
                      margin: '0 auto 16px auto'
                    }} />
                    Cargando items...
                  </div>
                ) : items.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#64748b' 
                  }}>
                    No hay items en esta categoría
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '10px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          if (editingIndex !== index) {
                            e.currentTarget.style.borderColor = `${categoriesConfig[selectedCategory].color}40`;
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (editingIndex !== index) {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {editingIndex === index ? (
                          <>
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                border: `2px solid ${categoriesConfig[selectedCategory].color}`,
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                outline: 'none',
                              }}
                              autoFocus
                            />
                            <button
                              onClick={handleSaveEdit}
                              style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <FaCheck style={{ fontSize: '0.8rem' }} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              style={{
                                background: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <FaTimes style={{ fontSize: '0.8rem' }} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{
                              flex: 1,
                              fontSize: '0.95rem',
                              color: '#374151',
                              fontWeight: 500,
                            }}>
                              {getItemText(item)}
                            </span>
                            <button
                              onClick={() => handleEditItemStart(index)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                padding: '6px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = '#f3f4f6';
                                e.currentTarget.style.color = categoriesConfig[selectedCategory].color;
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'none';
                                e.currentTarget.style.color = '#6b7280';
                              }}
                            >
                              <FaEdit style={{ fontSize: '0.8rem' }} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(index)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                padding: '6px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = '#fef2f2';
                                e.currentTarget.style.color = '#dc2626';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'none';
                                e.currentTarget.style.color = '#6b7280';
                              }}
                            >
                              <FaTrash style={{ fontSize: '0.8rem' }} />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón de guardar */}
              <div style={{
                marginTop: '24px',
                padding: '20px 0',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    padding: '12px 24px',
                    background: 'none',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCategory}
                  disabled={isSaving}
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, ${categoriesConfig[selectedCategory].color} 0%, ${categoriesConfig[selectedCategory].color}dd 100%)`,
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isSaving ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isSaving) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${categoriesConfig[selectedCategory].color}40`;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {isSaving ? (
                    <>
                      <FaSpinner style={{ 
                        fontSize: '0.9rem', 
                        animation: 'spin 1s linear infinite' 
                      }} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FaSave style={{ fontSize: '0.9rem' }} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Scrollbar personalizada */
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
