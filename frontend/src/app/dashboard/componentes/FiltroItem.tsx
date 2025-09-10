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
      background: '#fff',
      padding: '22px 20px 18px 20px',
      borderRadius: '16px',
      border: '1.5px solid #dbeafe',
      boxShadow: '0 4px 18px 0 rgba(37,99,235,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginBottom: 0,
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
      }}>
        <label style={{
          fontWeight: 700,
          color: '#1e293b',
          fontSize: '1.08rem',
          flex: 1,
          marginRight: '8px',
          letterSpacing: '0.1px',
        }}>
          {label}
        </label>
        <button
          onClick={onRemove}
          style={{
            background: '#f1f5f9',
            border: 'none',
            color: '#2563eb',
            fontSize: 18,
            cursor: 'pointer',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.18s',
            flexShrink: 0,
            boxShadow: '0 1px 4px #e0e7ff',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#dbeafe';
            e.currentTarget.style.color = '#1e40af';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#2563eb';
          }}
          title={`Quitar filtro ${label}`}
        >
          <FaTimes />
        </button>
      </div>
      <div style={{marginTop: 2}}>
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
              width: '100%',
              fontWeight: 500,
              fontSize: '1rem',
              color: '#334155',
              background: '#f8fafc',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              marginTop: 2,
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
    </div>
  );
}
