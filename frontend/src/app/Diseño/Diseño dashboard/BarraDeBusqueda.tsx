import { FaSearch, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getEquipos } from '@/services/api';

interface Sugerencia {
  id: string;
  texto: string;
  tipo: 'ip' | 'mac' | 'nombre' | 'codigo' | 'funcionario';
  resaltado: string;
}

interface BarraDeBusquedaProps {
  className?: string;
  style?: React.CSSProperties;
}

// Función para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function BarraDeBusqueda({ className = '', style = {} }: BarraDeBusquedaProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [sugerenciaActiva, setSugerenciaActiva] = useState(-1);
  const [loadingSugerencias, setLoadingSugerencias] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sugerenciasRef = useRef<HTMLDivElement>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Función para generar sugerencias basadas en el término de búsqueda
  const generarSugerencias = useCallback(async (termino: string) => {
    if (!termino.trim() || termino.length < 2) {
      setSugerencias([]);
      return;
    }

    setLoadingSugerencias(true);
    
    try {
      // Obtener equipos reales de la base de datos
      const equipos = await getEquipos();
      
      const terminoLower = termino.toLowerCase();
      const sugerenciasEncontradas: Sugerencia[] = [];
      
      // Buscar en los equipos reales
      equipos.forEach((equipo, index) => {
        // Buscar en IP
        if (equipo.direccion_ip && equipo.direccion_ip.toLowerCase().includes(terminoLower)) {
          sugerenciasEncontradas.push({
            id: `ip-${index}`,
            texto: equipo.direccion_ip,
            tipo: 'ip',
            resaltado: terminoLower
          });
        }
        
        // Buscar en MAC
        if (equipo.direccion_mac && equipo.direccion_mac.toLowerCase().includes(terminoLower)) {
          sugerenciasEncontradas.push({
            id: `mac-${index}`,
            texto: equipo.direccion_mac,
            tipo: 'mac',
            resaltado: terminoLower
          });
        }
        
        // Buscar en nombre de PC
        if (equipo.nombre_pc && equipo.nombre_pc.toLowerCase().includes(terminoLower)) {
          sugerenciasEncontradas.push({
            id: `nombre-${index}`,
            texto: equipo.nombre_pc,
            tipo: 'nombre',
            resaltado: terminoLower
          });
        }
        
        // Buscar en funcionario
        if (equipo.nombres_funcionario && equipo.nombres_funcionario.toLowerCase().includes(terminoLower)) {
          sugerenciasEncontradas.push({
            id: `funcionario-${index}`,
            texto: equipo.nombres_funcionario,
            tipo: 'funcionario',
            resaltado: terminoLower
          });
        }
        
        // Buscar en código de inventario
        if (equipo.codigo_inventario && equipo.codigo_inventario.toLowerCase().includes(terminoLower)) {
          sugerenciasEncontradas.push({
            id: `codigo-${index}`,
            texto: equipo.codigo_inventario,
            tipo: 'codigo',
            resaltado: terminoLower
          });
        }
      });
      
      // Eliminar duplicados y mostrar máximo 5 sugerencias
      const sugerenciasUnicas = sugerenciasEncontradas
        .filter((sugerencia, index, self) => 
          self.findIndex(s => s.texto === sugerencia.texto && s.tipo === sugerencia.tipo) === index
        )
        .slice(0, 5);
      
      setSugerencias(sugerenciasUnicas);
    } catch (error) {
      console.error('Error generando sugerencias:', error);
      setSugerencias([]);
    } finally {
      setLoadingSugerencias(false);
    }
  }, []);

  // Efecto para generar sugerencias cuando cambia el término de búsqueda
  useEffect(() => {
    if (showSearchInput) {
      generarSugerencias(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, showSearchInput, generarSugerencias]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      ejecutarBusqueda(searchTerm.trim());
    }
  };

  const ejecutarBusqueda = (termino: string) => {
    router.push(`/dashboard/detalle_estados?tipo=total&search=${encodeURIComponent(termino)}`);
    setSearchTerm('');
    setShowSearchInput(false);
    setSugerencias([]);
    setSugerenciaActiva(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
      setShowSearchInput(false);
      setSugerencias([]);
      setSugerenciaActiva(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSugerenciaActiva(prev => 
        prev < sugerencias.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSugerenciaActiva(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && sugerenciaActiva >= 0) {
      e.preventDefault();
      ejecutarBusqueda(sugerencias[sugerenciaActiva].texto);
    }
  };

  const resaltarTexto = (texto: string, termino: string) => {
    if (!termino) return texto;
    
    const regex = new RegExp(`(${termino})`, 'gi');
    const partes = texto.split(regex);
    
    return partes.map((parte, index) => 
      regex.test(parte) 
        ? <mark key={index} style={{ background: '#fef08a', padding: '0 2px', borderRadius: '2px' }}>{parte}</mark>
        : parte
    );
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'ip': return '🌐';
      case 'mac': return '🔗';
      case 'nombre': return '💻';
      case 'funcionario': return '👤';
      case 'codigo': return '🏷️';
      default: return '🔍';
    }
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sugerenciasRef.current && !sugerenciasRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setSugerencias([]);
        setSugerenciaActiva(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar el buscador al hacer clic fuera
  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      const target = event.target as Node;
      const searchContainer = document.querySelector('.barra-busqueda');
      
      if (showSearchInput && searchContainer && !searchContainer.contains(target)) {
        setShowSearchInput(false);
        setSearchTerm('');
        setSugerencias([]);
        setSugerenciaActiva(-1);
      }
    };

    if (showSearchInput) {
      document.addEventListener('mousedown', handleClickOutsideSearch);
      return () => document.removeEventListener('mousedown', handleClickOutsideSearch);
    }
  }, [showSearchInput]);

  return (
    <div className={`barra-busqueda ${className}`} style={{
      position: 'relative',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(8px, 1.5vw, 12px)',
      flex: showSearchInput ? '1' : 'none',
      maxWidth: showSearchInput ? '450px' : 'auto',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      ...style
    }}>
      {showSearchInput ? (
        <div style={{ width: '100%', position: 'relative' }}>
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            position: 'relative'
          }}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSugerenciaActiva(-1);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="IP, MAC, Nombre, Funcionario..."
              autoFocus
              style={{
                width: '100%',
                padding: '12px 50px 12px 16px',
                borderRadius: '14px',
                border: '2px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
                outline: 'none',
                backdropFilter: 'blur(15px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
            />
            
            {/* Botón de limpiar/cerrar */}
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setShowSearchInput(false);
                setSugerencias([]);
                setSugerenciaActiva(-1);
              }}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px'
              }}
              onMouseEnter={e => {
                const target = e.target as HTMLButtonElement;
                target.style.background = 'rgba(255,255,255,0.25)';
                target.style.color = '#fff';
                target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={e => {
                const target = e.target as HTMLButtonElement;
                target.style.background = 'rgba(255,255,255,0.15)';
                target.style.color = 'rgba(255,255,255,0.8)';
                target.style.transform = 'scale(1)';
              }}
            >
              <FaTimes style={{ fontSize: '12px' }} />
            </button>
            
            {/* Indicador de carga */}
            {loadingSugerencias && (
              <div style={{
                position: 'absolute',
                right: '50px',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'busquedaSpin 1s linear infinite'
                }} />
              </div>
            )}
          </form>

          {/* Panel de Sugerencias */}
          {sugerencias.length > 0 && (
            <div 
              ref={sugerenciasRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                marginTop: '8px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 9999,
              }}
            >
              <div style={{
                padding: '8px 12px',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Sugerencias
              </div>
              
              {sugerencias.map((sugerencia, index) => (
                <div
                  key={sugerencia.id}
                  onClick={() => ejecutarBusqueda(sugerencia.texto)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    background: index === sugerenciaActiva 
                      ? 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)' 
                      : 'transparent',
                    borderLeft: index === sugerenciaActiva 
                      ? '3px solid #0277bd' 
                      : '3px solid transparent',
                  }}
                  onMouseEnter={() => setSugerenciaActiva(index)}
                  onMouseLeave={() => setSugerenciaActiva(-1)}
                >
                  <span style={{ fontSize: '16px' }}>
                    {getTipoIcon(sugerencia.tipo)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: '#1e293b',
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: 1.2
                    }}>
                      {resaltarTexto(sugerencia.texto, searchTerm)}
                    </div>
                    <div style={{
                      color: '#64748b',
                      fontSize: '11px',
                      marginTop: '2px',
                      textTransform: 'capitalize'
                    }}>
                      {sugerencia.tipo === 'ip' && 'Dirección IP'}
                      {sugerencia.tipo === 'mac' && 'Dirección MAC'}
                      {sugerencia.tipo === 'nombre' && 'Nombre del equipo'}
                      {sugerencia.tipo === 'funcionario' && 'Funcionario'}
                      {sugerencia.tipo === 'codigo' && 'Código de inventario'}
                    </div>
                  </div>
                  <FaSearch style={{
                    color: '#94a3b8',
                    fontSize: '12px'
                  }} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowSearchInput(true)}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: '#fff',
            padding: 'clamp(8px, 1.5vw, 12px)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
            fontWeight: 600,
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={e => {
            const target = e.target as HTMLButtonElement;
            target.style.background = 'rgba(255,255,255,0.25)';
            target.style.borderColor = 'rgba(255,255,255,0.4)';
            target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            const target = e.target as HTMLButtonElement;
            target.style.background = 'rgba(255,255,255,0.15)';
            target.style.borderColor = 'rgba(255,255,255,0.2)';
            target.style.transform = 'scale(1)';
          }}
        >
          <FaSearch style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }} />
          <span className="search-text">Buscar</span>
        </button>
      )}

      {/* Estilos CSS específicos para el componente */}
      <style jsx>{`
        /* Estilos para placeholder del input de búsqueda */
        .barra-busqueda input::placeholder {
          color: rgba(255,255,255,0.7);
          font-weight: 400;
        }
        
        /* Scroll personalizado para sugerencias */
        .barra-busqueda div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
        }
        
        .barra-busqueda div[style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
          border-radius: 3px;
        }
        
        .barra-busqueda div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.3);
          border-radius: 3px;
        }
        
        .barra-busqueda div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.4);
        }
        
        /* Asegurar que las sugerencias aparezcan encima de todo */
        .barra-busqueda div[style*="position: absolute"] {
          z-index: 9999 !important;
        }
        
        /* Mejoras de accesibilidad */
        .barra-busqueda input:focus {
          box-shadow: 0 0 0 3px rgba(59,130,246,0.3) !important;
        }
        
        /* Responsive para búsqueda */
        @media (max-width: 1024px) {
          .barra-busqueda {
            max-width: 350px !important;
          }
        }
        
        @media (max-width: 768px) {
          .search-text {
            display: none;
          }
          
          .barra-busqueda {
            max-width: 280px !important;
          }
          
          .barra-busqueda input {
            padding: 10px 45px 10px 14px !important;
            font-size: 14px !important;
          }
        }
        
        @media (max-width: 640px) {
          .barra-busqueda input {
            font-size: 13px !important;
            padding: 9px 40px 9px 12px !important;
          }
          
          .barra-busqueda {
            max-width: 220px !important;
          }
          
          /* Ajustar sugerencias en móvil */
          .barra-busqueda div[style*="position: absolute"] {
            left: -50px !important;
            right: -50px !important;
            max-width: calc(100vw - 32px) !important;
          }
        }
        
        @media (max-width: 480px) {
          .barra-busqueda {
            max-width: 180px !important;
            order: 3;
            width: 100% !important;
            margin-top: 8px !important;
          }
          
          .barra-busqueda input {
            font-size: 12px !important;
            padding: 8px 35px 8px 10px !important;
          }
        }
        
        /* Mejoras de animación */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Modo oscuro automático */
        @media (prefers-color-scheme: dark) {
          .barra-busqueda div[style*="background: rgba(255,255,255,0.95)"] {
            background: rgba(30,41,59,0.95) !important;
            border-color: rgba(255,255,255,0.1) !important;
          }
          
          .barra-busqueda div[style*="color: #1e293b"] {
            color: #e2e8f0 !important;
          }
          
          .barra-busqueda div[style*="color: #64748b"] {
            color: #94a3b8 !important;
          }
        }
        
        /* Animación de spin para el loading */
        @keyframes busquedaSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
