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
    <div className="filter-item" style={{
      minWidth: 'min(100%, 280px)',
      width: '100%',
      position: 'relative',
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      padding: 'clamp(18px, 3vw, 24px)',
      borderRadius: '18px',
      border: '2px solid #e2e8f0',
      boxShadow: '0 8px 25px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginBottom: 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px',
        gap: '12px',
      }}>
        <label style={{
          fontWeight: 600,
          color: '#1e293b',
          fontSize: 'clamp(1rem, 2vw, 1.1rem)',
          flex: 1,
          lineHeight: '1.4',
          letterSpacing: '-0.025em',
        }}>
          {label}
        </label>
        <button
          onClick={onRemove}
          style={{
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            fontSize: 16,
            cursor: 'pointer',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.15)',
            outline: 'none',
          }}
          onMouseEnter={e => {
            const target = e.currentTarget;
            target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
            target.style.color = '#ffffff';
            target.style.transform = 'scale(1.1)';
            target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)';
          }}
          onMouseLeave={e => {
            const target = e.currentTarget;
            target.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
            target.style.color = '#dc2626';
            target.style.transform = 'scale(1)';
            target.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.15)';
          }}
          title={`Quitar filtro ${label}`}
          aria-label={`Quitar filtro ${label}`}
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
              width: '100%',
              fontWeight: 500,
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              color: '#1e293b',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 12,
              border: '2px solid #e2e8f0',
              padding: '12px 16px',
              marginTop: 4,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 12px center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px',
              paddingRight: '40px',
            }}
            value={Array.isArray(value) ? '' : value}
            onChange={e => onChange(e.target.value)}
            onFocus={e => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
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
      
      {/* CSS específico para este componente */}
      <style jsx>{`
        .filter-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1) !important;
          border-color: #cbd5e1;
        }
        
        @media (max-width: 768px) {
          .filter-item {
            min-width: 100% !important;
          }
        }
        
        @media (max-width: 480px) {
          .filter-item {
            padding: 16px !important;
            border-radius: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
