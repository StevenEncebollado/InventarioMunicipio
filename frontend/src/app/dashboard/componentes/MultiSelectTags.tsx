import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: number;
  label: string;
}

interface MultiSelectTagsProps {
  options: Option[];
  value: number[];
  onChange: (selectedValues: number[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  maxHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar opciones...",
  searchPlaceholder = "Buscar...",
  disabled = false,
  maxHeight = 200,
  className = "",
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar opciones basado en búsqueda y excluir las ya seleccionadas
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !value.includes(option.value)
  );

  // Obtener opciones seleccionadas
  const selectedOptions = options.filter(option => value.includes(option.value));

  // Agregar opción
  const addOption = (option: Option) => {
    if (!value.includes(option.value)) {
      onChange([...value, option.value]);
    }
    setSearchTerm('');
    // Mantener el foco en el input después de seleccionar
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Remover opción
  const removeOption = (optionValue: number) => {
    onChange(value.filter(val => val !== optionValue));
  };

  // Estilos base
  const baseStyles = {
    container: {
      position: 'relative' as const,
      width: '100%',
      ...style
    },
    control: {
      background: disabled ? '#f9fafb' : '#fff',
      border: `1px solid ${isOpen ? '#2563eb' : '#d1d5db'}`,
      borderRadius: '8px',
      minHeight: '44px',
      padding: '6px 12px',
      display: 'flex',
      flexWrap: 'wrap' as const,
      alignItems: 'center',
      gap: '6px',
      cursor: disabled ? 'not-allowed' : 'text',
      fontSize: '15px',
      transition: 'all 0.2s ease',
      boxShadow: isOpen ? '0 0 0 2px rgba(37, 99, 235, 0.1)' : 'none',
    },
    tag: {
      background: '#e0e7ff',
      color: '#1e40af',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      maxWidth: '200px',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden' as const,
      textOverflow: 'ellipsis' as const,
    },
    tagRemove: {
      background: 'none',
      border: 'none',
      color: '#2563eb',
      cursor: 'pointer',
      padding: '0',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
      flexShrink: 0,
    },
    input: {
      border: 'none',
      outline: 'none',
      background: 'none',
      flex: 1,
      minWidth: '120px',
      fontSize: '15px',
      color: disabled ? '#9ca3af' : '#374151',
      cursor: disabled ? 'not-allowed' : 'text',
    },
    dropdown: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 1000,
      maxHeight: `${maxHeight}px`,
      overflowY: 'auto' as const,
      marginTop: '4px',
    },
    option: (isHovered: boolean) => ({
      padding: '12px 16px',
      cursor: 'pointer',
      background: isHovered ? '#f3f4f6' : '#fff',
      color: '#1f2937',
      fontWeight: 400,
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.15s ease',
      borderBottom: '1px solid #f3f4f6',
    }),
    noOptions: {
      padding: '12px 16px',
      color: '#6b7280',
      fontSize: '14px',
      textAlign: 'center' as const,
      fontStyle: 'italic' as const,
    }
  };

  return (
    <div ref={containerRef} style={baseStyles.container} className={className}>
      {/* Control principal */}
      <div
        style={baseStyles.control}
        onClick={() => !disabled && setIsOpen(true)}
      >
        {/* Tags seleccionados */}
        {selectedOptions.map(option => (
          <span key={option.value} style={baseStyles.tag}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {option.label}
            </span>
            <button
              type="button"
              style={baseStyles.tagRemove}
              onClick={(e) => {
                e.stopPropagation();
                removeOption(option.value);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c7d2fe';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              disabled={disabled}
            >
              ×
            </button>
          </span>
        ))}
        
        {/* Input de búsqueda */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={
            selectedOptions.length === 0 
              ? placeholder 
              : searchPlaceholder
          }
          style={baseStyles.input}
          disabled={disabled}
        />
      </div>

      {/* Dropdown de opciones */}
      {isOpen && !disabled && (
        <div style={baseStyles.dropdown}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <OptionItem
                key={option.value}
                option={option}
                onSelect={() => addOption(option)}
                style={baseStyles.option}
              />
            ))
          ) : (
            <div style={baseStyles.noOptions}>
              {searchTerm ? 'No hay coincidencias' : 'No hay más opciones disponibles'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente separado para las opciones con hover
const OptionItem: React.FC<{
  option: Option;
  onSelect: () => void;
  style: (isHovered: boolean) => React.CSSProperties;
}> = ({ option, onSelect, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={style(isHovered)}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {option.label}
      </span>
    </div>
  );
};

export default MultiSelectTags;
