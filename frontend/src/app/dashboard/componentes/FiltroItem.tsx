import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { EstiloDashboardEspecifico } from '../../Diseño/Estilos/EstiloDashboardEspecifico';
import MultiSelectTags from './MultiSelectTags';

interface FiltroItemProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onRemove: () => void;
  options?: Array<{ id: string | number; nombre?: string; descripcion?: string; capacidad?: string; version?: string }>;
  type?: 'select' | 'multiselect';
  placeholder?: string;
  searchPlaceholder?: string;
}

export default function FiltroItem({
  label,
  value,
  onChange,
  onRemove,
  options = [],
  type = 'select',
  placeholder = 'Todos',
  searchPlaceholder = 'Buscar...'
}: FiltroItemProps) {
  const getOptionLabel = (option: any) => {
    return option.nombre || option.descripcion || option.capacidad || option.version || 'Sin nombre';
  };

  return (
    <div style={{ 
      minWidth: 280, 
      position: 'relative', 
      background: '#f8fafc', 
      padding: '16px', 
      borderRadius: '12px', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '8px' 
      }}>
        <label style={{ 
          fontWeight: 600, 
          color: '#374151', 
          fontSize: '14px',
          flex: 1,
          marginRight: '8px' 
        }}>
          {label}
        </label>
        <button 
          onClick={onRemove} 
          style={{ 
            background: '#fee2e2', 
            border: 'none', 
            color: '#dc2626', 
            fontSize: 14, 
            cursor: 'pointer',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
          onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
          title={`Quitar filtro ${label}`}
        >
          <FaTimes />
        </button>
      </div>
      
      {type === 'multiselect' ? (
        <MultiSelectTags
          options={options.map(opt => ({
            value: Number(opt.id),
            label: getOptionLabel(opt)
          }))}
          value={Array.isArray(value) ? value.map(v => Number(v)) : []}
          onChange={(selectedIds) => onChange(selectedIds.map(id => String(id)))}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          maxHeight={200}
        />
      ) : (
        <select 
          style={{
            ...EstiloDashboardEspecifico.catalogos.selectStyle, 
            width: '100%'
          }} 
          value={Array.isArray(value) ? '' : value} 
          onChange={e => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.id} value={opt.id}>
              {getOptionLabel(opt)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
