'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCatalogosContext } from '../context/CatalogosContext';
import { EstiloDashboardEspecifico } from '../../Diseño/Estilos/EstiloDashboardEspecifico';
import { EstiloComponentesUI } from '../../Diseño/Estilos/EstiloComponentesUI';
import Navbar from '../../Diseño/Diseño dashboard/Navbar';
import { useAgregarEquipo } from '../hooks/useAgregarEquipo';
import MultiSelectTags from '../componentes/MultiSelectTags';
import { APP_CONFIG } from '@/services/api';
import type { Usuario, DireccionArea } from '@/types';
import Swal from 'sweetalert2';

export default function AgregarEquipoPage() {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const [dispositivoIdSeleccionado, setDispositivoIdSeleccionado] = useState<string>('');
  const { catalogos, isLoading: catalogosLoading, error: catalogosError } = useCatalogosContext();
  const agregarEquipo = useAgregarEquipo(user?.id);

  // Configuración memoizada de campos por dispositivo
  const configuracionCampos = useMemo(() => ({
    'Computadora': ['ip', 'mac', 'codigoInventario', 'nombrePc', 'funcionario', 'anydesk', 'estado', 'tipoEquipo', 'marca', 'ram', 'disco', 'office', 'tipoConexion', 'programaAdicional', 'dependencia', 'direccion', 'equipamiento', 'caracteristicas', 'sistemaOperativo'],
    'Laptop': ['codigoInventario', 'nombrePc', 'funcionario', 'mac', 'anydesk', 'estado', 'tipoEquipo', 'marca', 'ram', 'disco', 'office', 'tipoConexion', 'programaAdicional', 'dependencia', 'direccion', 'equipamiento', 'caracteristicas', 'sistemaOperativo'],
    'Mouse': ['codigoInventario', 'nombrePc', 'funcionario', 'estado', 'marca', 'dependencia', 'direccion', 'equipamiento', 'caracteristicas'],
    'Teclado': ['codigoInventario', 'nombrePc', 'funcionario', 'estado', 'marca', 'tipoConexion', 'dependencia', 'direccion', 'equipamiento', 'caracteristicas'],
    'Monitor': ['codigoInventario', 'nombrePc', 'funcionario', 'estado', 'marca', 'tipoConexion', 'dependencia', 'direccion', 'equipamiento', 'caracteristicas'],
    'Impresora': ['ip', 'codigoInventario', 'nombrePc', 'funcionario', 'estado', 'marca', 'tipoConexion', 'dependencia', 'direccion', 'equipamiento', 'caracteristicas'],
    'Scanner': ['codigoInventario', 'nombrePc', 'funcionario', 'estado', 'marca', 'tipoConexion', 'dependencia', 'direccion', 'equipamiento', 'caracteristicas'],
    'Telefono': ['ip', 'codigoInventario', 'nombrePc', 'funcionario', 'estado', 'marca', 'dependencia', 'direccion', 'equipamiento', 'caracteristicas']
  }), []);

  // Dispositivo seleccionado memoizado
  const dispositivoSeleccionado = useMemo(() => {
    return catalogos?.dispositivos?.find(d => d.id.toString() === dispositivoIdSeleccionado);
  }, [catalogos?.dispositivos, dispositivoIdSeleccionado]);

  // Función optimizada para determinar visibilidad de campos
  const campoVisible = useCallback((campo: string): boolean => {
    if (!dispositivoIdSeleccionado || !dispositivoSeleccionado) return false;
    
    // Usar campos configurados en BD si están disponibles
    if (dispositivoSeleccionado.campos && Array.isArray(dispositivoSeleccionado.campos)) {
      return dispositivoSeleccionado.campos.includes(campo);
    }
    
    // Fallback a configuración por defecto
    const camposDispositivo = configuracionCampos[dispositivoSeleccionado.nombre as keyof typeof configuracionCampos];
    return camposDispositivo?.includes(campo) || false;
  }, [dispositivoIdSeleccionado, dispositivoSeleccionado, configuracionCampos]);

  // Direcciones filtradas memoizadas
  const direccionesFiltradas = useMemo(() => {
    if (!catalogos?.direcciones || !agregarEquipo.dependencia) return catalogos?.direcciones || [];
    return (catalogos.direcciones as DireccionArea[])
      .filter(dir => String(dir.dependencia_id) === String(agregarEquipo.dependencia));
  }, [catalogos?.direcciones, agregarEquipo.dependencia]);

  // Callbacks memoizados para evitar re-renders innecesarios
  const handleIpChange = useCallback((value: string) => agregarEquipo.setIp(value), [agregarEquipo.setIp]);
  const handleMacChange = useCallback((value: string) => agregarEquipo.setMac(value), [agregarEquipo.setMac]);
  const handleCodigoInventarioChange = useCallback((value: string) => agregarEquipo.setCodigoInventario(value), [agregarEquipo.setCodigoInventario]);
  const handleNombrePcChange = useCallback((value: string) => agregarEquipo.setNombrePc(value), [agregarEquipo.setNombrePc]);
  const handleFuncionarioChange = useCallback((value: string) => agregarEquipo.setFuncionario(value), [agregarEquipo.setFuncionario]);
  const handleAnydeskChange = useCallback((value: string) => agregarEquipo.setAnydesk(value), [agregarEquipo.setAnydesk]);
  const handleEstadoChange = useCallback((value: string) => agregarEquipo.setEstado(value), [agregarEquipo.setEstado]);
  const handleTipoEquipoChange = useCallback((value: string) => agregarEquipo.setTipoEquipo(value), [agregarEquipo.setTipoEquipo]);
  const handleMarcaChange = useCallback((value: string) => agregarEquipo.setMarca(value), [agregarEquipo.setMarca]);
  const handleRamChange = useCallback((value: string) => agregarEquipo.setRam(value), [agregarEquipo.setRam]);
  const handleDiscoChange = useCallback((value: string) => agregarEquipo.setDisco(value), [agregarEquipo.setDisco]);
  const handleOfficeChange = useCallback((value: string) => agregarEquipo.setOffice(value), [agregarEquipo.setOffice]);
  const handleTipoConexionChange = useCallback((value: string) => agregarEquipo.setTipoConexion(value), [agregarEquipo.setTipoConexion]);
  const handleDependenciaChange = useCallback((value: string) => agregarEquipo.setDependencia(value), [agregarEquipo.setDependencia]);
  const handleDireccionChange = useCallback((value: string) => agregarEquipo.setDireccion(value), [agregarEquipo.setDireccion]);
  const handleEquipamientoChange = useCallback((value: string) => agregarEquipo.setEquipamiento(value), [agregarEquipo.setEquipamiento]);
  const handleCaracteristicaChange = useCallback((value: string) => agregarEquipo.setCaracteristica(value), [agregarEquipo.setCaracteristica]);
  const handleSistemaOperativoChange = useCallback((value: string) => agregarEquipo.setSistemaOperativo(value), [agregarEquipo.setSistemaOperativo]);
  const handleDispositivoChange = useCallback((value: string) => setDispositivoIdSeleccionado(value), []);

  // Componente de campo de entrada optimizado
  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    required = false 
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
  }) => (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: 'clamp(6px, 1.5vw, 10px)', 
        fontWeight: 600, 
        color: '#374151',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)'
      }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        required={required}
        style={{ 
          width: '100%',
          padding: 'clamp(10px, 2vw, 14px)',
          borderRadius: '10px',
          border: '2px solid #e2e8f0',
          fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
          transition: 'all 0.2s ease',
          outline: 'none',
          background: '#ffffff'
        }}
        onFocus={e => {
          e.target.style.borderColor = '#2563eb';
          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        }}
        onBlur={e => {
          e.target.style.borderColor = '#e2e8f0';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );

  // Componente de select optimizado
  const SelectField = ({ 
    label, 
    value, 
    onChange, 
    options, 
    placeholder = "Seleccionar...",
    required = false,
    emptyOption = true
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ id: number | string; nombre?: string; capacidad?: string; version?: string; descripcion?: string; [key: string]: any }>;
    placeholder?: string;
    required?: boolean;
    emptyOption?: boolean;
  }) => (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: 'clamp(6px, 1.5vw, 10px)', 
        fontWeight: 600, 
        color: '#374151',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)'
      }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        required={required}
        style={{ 
          width: '100%',
          padding: 'clamp(10px, 2vw, 14px)',
          borderRadius: '10px',
          border: '2px solid #e2e8f0',
          fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
          transition: 'all 0.2s ease',
          outline: 'none',
          background: '#ffffff',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 100,
          maxHeight: '200px',
          overflowY: 'auto'
        }}
        onFocus={e => {
          e.target.style.borderColor = '#2563eb';
          e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
          e.target.style.zIndex = '999';
        }}
        onBlur={e => {
          e.target.style.borderColor = '#e2e8f0';
          e.target.style.boxShadow = 'none';
          e.target.style.zIndex = '100';
        }}
      >
        {emptyOption && <option value="">{placeholder}</option>}
        {options?.map(option => (
          <option key={option.id} value={option.id}>
            {option.nombre || option.capacidad || option.version || option.descripcion || 'Sin nombre'}
          </option>
        ))}
      </select>
    </div>
  );

  // Verificar usuario autenticado
  useEffect(() => {
    const userData = localStorage.getItem(APP_CONFIG.session.storageKey);
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem(APP_CONFIG.session.storageKey);
    router.push('/');
  };

  // Función optimizada para manejar el envío del formulario
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (agregarEquipo.addLoading) return; // Prevenir envíos dobles
    
    agregarEquipo.setAddError("");
    agregarEquipo.setAddLoading(true);
    
    try {
      if (!(await agregarEquipo.validarCampos())) {
        return;
      }
      
      const formData = agregarEquipo.getFormData();
      
      const response = await fetch('http://localhost:5000/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: '¡Equipo creado exitosamente!',
          text: 'El equipo ha sido agregado correctamente al inventario.',
          confirmButtonColor: '#10b981',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: true,
          backdrop: true,
          allowOutsideClick: false
        });
        
        agregarEquipo.limpiarCampos();
        setDispositivoIdSeleccionado('');
        router.push('/dashboard');
      } else {
        let errorMessage = 'No se pudo crear el equipo. Verifica los datos ingresados.';
        
        try {
          const errorData = await response.json();
          if (errorData?.error) errorMessage = errorData.error;
          else if (errorData?.message) errorMessage = errorData.message;
        } catch {
          errorMessage = `Error del servidor (${response.status}): ${response.statusText}`;
        }
        
        await Swal.fire({
          icon: 'error',
          title: 'Error al crear equipo',
          text: errorMessage,
          confirmButtonColor: '#ef4444',
          footer: `<small>Código de error: ${response.status}</small>`
        });
      }
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      agregarEquipo.setAddLoading(false);
    }
  }, [agregarEquipo, router]);

  // Estados de carga optimizados
  if (catalogosLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f6fa' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 80px)',
          flexDirection: 'column',
          gap: 'clamp(16px, 3vw, 24px)',
          padding: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{ 
            margin: 0, 
            color: '#1e293b',
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            textAlign: 'center'
          }}>
            Agregar Nuevo Equipo
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#64748b', 
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            textAlign: 'center'
          }}>
            Cargando formulario...
          </p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (catalogosError) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f6fa' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 80px)',
          flexDirection: 'column',
          gap: 'clamp(16px, 3vw, 24px)',
          padding: '20px'
        }}>
          <div style={{ fontSize: 'clamp(40px, 8vw, 64px)', color: '#ef4444' }}>⚠️</div>
          <h2 style={{ 
            margin: 0, 
            color: '#1e293b',
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            textAlign: 'center'
          }}>
            Agregar Nuevo Equipo
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#ef4444', 
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            Error al cargar formulario: {catalogosError}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: 'clamp(10px, 2vw, 14px) clamp(20px, 4vw, 28px)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-container {
          animation: fadeInUp 0.6s ease-out;
          position: relative;
        }
        .field-group {
          animation: fadeInUp 0.4s ease-out;
        }
        
        /* Estilos específicos para dropdowns */
        select {
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230891b2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 18px !important;
          padding-right: 45px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        }
        
        select:focus {
          transform: translateY(-1px);
        }
        
        /* Asegurar que las opciones se muestren correctamente */
        select option {
          padding: 8px 12px;
          background: white;
          color: #374151;
        }
        
        select option:checked {
          background: #2563eb !important;
          color: white !important;
        }
        
        select option:hover {
          background: #f1f5f9 !important;
        }
        
        /* Evitar que se abra hacia arriba */
        select[size] {
          height: auto !important;
        }
        
        /* Asegurar posicionamiento correcto */
        .select-container {
          position: relative;
          z-index: 9999;
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Navbar user={user} onLogout={handleLogout} />
      
      <div style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="form-container" style={{ 
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
            borderRadius: '24px', 
            padding: 'clamp(24px, 4vw, 40px)', 
            boxShadow: '0 25px 50px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.05)',
            border: '1px solid rgba(226,232,240,0.8)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ 
              marginBottom: 'clamp(24px, 4vw, 40px)', 
              textAlign: 'center' 
            }}>
              <h1 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
                fontWeight: 700, 
                color: '#1e293b', 
                margin: '0 0 clamp(8px, 2vw, 16px) 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(12px, 2vw, 20px)',
                flexWrap: 'wrap',
                letterSpacing: '-0.025em'
              }}>
                <span role="img" aria-label="Computadora" style={{ 
                  fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                  filter: 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.2))'
                }}>💻</span>
                <span>Agregar Nuevo Equipo</span>
              </h1>
              <p style={{ 
                color: '#64748b', 
                margin: 0,
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                lineHeight: '1.5',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                Complete todos los campos requeridos para registrar un nuevo equipo en el inventario
              </p>
            </div>

            {agregarEquipo.addError && (
              <div style={{ 
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', 
                border: '2px solid #fecaca', 
                color: '#dc2626', 
                padding: 'clamp(12px, 2.5vw, 16px)', 
                borderRadius: '12px', 
                marginBottom: 'clamp(20px, 3vw, 32px)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                fontWeight: 500
              }}>
                <span style={{ fontSize: '1.2em', flexShrink: 0 }}>⚠️</span>
                <span>{agregarEquipo.addError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Selector de Tipo de Dispositivo - Destacado */}
              <div style={{ 
                marginBottom: 'clamp(28px, 4vw, 40px)',
                padding: 'clamp(20px, 3vw, 28px)',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '16px',
                border: '2px solid #0891b2',
                position: 'relative',
                zIndex: 1
              }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 'clamp(8px, 2vw, 12px)', 
                  fontWeight: 700, 
                  color: '#0e7490',
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  letterSpacing: '0.025em'
                }}>
                  🏷️ Tipo de Dispositivo *
                </label>
                <div style={{ position: 'relative', zIndex: 9999 }}>
                  <select
                  value={dispositivoIdSeleccionado}
                  onChange={(e) => handleDispositivoChange(e.target.value)}
                  style={{ 
                    width: '100%',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    borderRadius: '12px',
                    border: '2px solid #0891b2',
                    background: 'white',
                    color: '#0e7490',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    position: 'relative',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#0891b2';
                    e.target.style.boxShadow = '0 4px 20px rgba(8, 145, 178, 0.3)';
                    e.target.style.zIndex = '9999';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#0891b2';
                    e.target.style.boxShadow = 'none';
                    e.target.style.zIndex = '1000';
                  }}
                  required
                >
                  <option value="">Seleccione un tipo de dispositivo</option>
                  {catalogos?.dispositivos?.map(dispositivo => (
                    <option key={dispositivo.id} value={dispositivo.id}>
                      {dispositivo.nombre}
                    </option>
                  ))}
                </select>
                </div>
                
                {dispositivoSeleccionado && (
                  <div style={{
                    marginTop: 'clamp(12px, 2vw, 16px)',
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(14, 116, 144, 0.3)',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', 
                      color: '#0e7490',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '1.1em' }}>📝</span>
                      Formulario adaptado para: {dispositivoSeleccionado.nombre}
                    </p>
                  </div>
                )}
              </div>

              <div className="field-group" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
                gap: 'clamp(16px, 3vw, 24px)',
                marginBottom: 'clamp(24px, 4vw, 32px)'
              }}>
                {/* Campos de texto */}
                {campoVisible('ip') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🌐 Dirección IP
                  </label>
                  <input 
                    value={agregarEquipo.ip} 
                    onChange={e => handleIpChange(e.target.value)} 
                    placeholder="Ej: 192.168.1.100"
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                )}

                {campoVisible('mac') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🔗 Dirección MAC
                  </label>
                  <input 
                    value={agregarEquipo.mac} 
                    onChange={e => agregarEquipo.setMac(e.target.value)} 
                    placeholder="Ej: 00:1B:63:84:45:E6"
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                )}

                {campoVisible('codigoInventario') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🏷️ Código de Inventario
                  </label>
                  <input 
                    value={agregarEquipo.codigoInventario} 
                    onChange={e => agregarEquipo.setCodigoInventario(e.target.value)} 
                    placeholder="Ej: INV-001"
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                )}

                {campoVisible('nombrePc') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    💻 Nombre de PC
                  </label>
                  <input 
                    value={agregarEquipo.nombrePc} 
                    onChange={e => agregarEquipo.setNombrePc(e.target.value)} 
                    placeholder="Ej: PC-OFICINA-01"
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                )}

                {campoVisible('funcionario') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    👤 Funcionario Responsable
                  </label>
                  <input 
                    value={agregarEquipo.funcionario} 
                    onChange={e => agregarEquipo.setFuncionario(e.target.value)} 
                    placeholder="Ej: Juan Pérez"
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                )}

                {campoVisible('anydesk') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🖥️ AnyDesk
                  </label>
                  <input 
                    value={agregarEquipo.anydesk} 
                    onChange={e => agregarEquipo.setAnydesk(e.target.value)} 
                    placeholder="Ej: 123456789"
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                )}

                {campoVisible('estado') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    ⚡ Estado
                  </label>
                  <select 
                    value={agregarEquipo.estado} 
                    onChange={(e) => agregarEquipo.setEstado(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>
                )}

                {/* Selects de catálogos optimizados */}
                {campoVisible('tipoEquipo') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🛠️ Tipo de Equipo
                  </label>
                  <select 
                    value={agregarEquipo.tipoEquipo} 
                    onChange={(e) => agregarEquipo.setTipoEquipo(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar tipo</option>
                    {catalogos?.tiposEquipo?.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {campoVisible('marca') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🏢 Marca
                  </label>
                  <select 
                    value={agregarEquipo.marca} 
                    onChange={(e) => agregarEquipo.setMarca(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar marca</option>
                    {catalogos?.marcas?.map(marca => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {campoVisible('ram') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🧠 Memoria RAM
                  </label>
                  <select 
                    value={agregarEquipo.ram} 
                    onChange={(e) => agregarEquipo.setRam(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar RAM</option>
                    {catalogos?.ram?.map(ram => (
                      <option key={ram.id} value={ram.id}>
                        {ram.capacidad}
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {campoVisible('disco') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    💾 Disco Duro
                  </label>
                  <select 
                    value={agregarEquipo.disco} 
                    onChange={(e) => agregarEquipo.setDisco(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar disco</option>
                    {catalogos?.disco?.map(disco => (
                      <option key={disco.id} value={disco.id}>
                        {disco.capacidad}
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {campoVisible('office') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    📄 Microsoft Office
                  </label>
                  <select 
                    value={agregarEquipo.office} 
                    onChange={(e) => agregarEquipo.setOffice(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar Office</option>
                    {catalogos?.office?.map(office => (
                      <option key={office.id} value={office.id}>
                        {office.version}
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {campoVisible('tipoConexion') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🔌 Tipo de Conexión
                  </label>
                  <select 
                    value={agregarEquipo.tipoConexion} 
                    onChange={(e) => agregarEquipo.setTipoConexion(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar conexión</option>
                    {catalogos?.tipoConexion?.map(conexion => (
                      <option key={conexion.id} value={conexion.id}>
                        {conexion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {campoVisible('dependencia') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🏛️ Dependencia
                  </label>
                  <select 
                    value={agregarEquipo.dependencia} 
                    onChange={e => agregarEquipo.setDependencia(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar dependencia</option>
                    {catalogos.dependencias.map(dep => <option key={dep.id} value={dep.id}>{dep.nombre}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('direccion') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    📍 Dirección/Área
                  </label>
                  <select 
                    value={agregarEquipo.direccion} 
                    onChange={(e) => agregarEquipo.setDireccion(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar dirección</option>
                    {direccionesFiltradas?.map(direccion => (
                      <option key={direccion.id} value={direccion.id}>
                        {direccion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {campoVisible('equipamiento') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    ⚙️ Equipamiento
                  </label>
                  <select 
                    value={agregarEquipo.equipamiento} 
                    onChange={(e) => agregarEquipo.setEquipamiento(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar equipamiento</option>
                    {catalogos?.equipamientos?.map(equipamiento => (
                      <option key={equipamiento.id} value={equipamiento.id}>
                        {equipamiento.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {campoVisible('caracteristicas') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🔧 Característica
                  </label>
                  <select 
                    value={agregarEquipo.caracteristica} 
                    onChange={(e) => agregarEquipo.setCaracteristica(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar característica</option>
                    {catalogos?.caracteristicas?.map(caracteristica => (
                      <option key={caracteristica.id} value={caracteristica.id}>
                        {caracteristica.descripcion || 'Sin descripción'}
                      </option>
                    ))}
                  </select>
                </div>
                )}

                {campoVisible('sistemaOperativo') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'clamp(6px, 1.5vw, 10px)', 
                    fontWeight: 600, 
                    color: '#374151',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    🖥️ Sistema Operativo
                  </label>
                  <select 
                    value={agregarEquipo.sistemaOperativo} 
                    onChange={(e) => agregarEquipo.setSistemaOperativo(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.2)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Seleccionar SO</option>
                    {catalogos?.sistemasOperativos?.map(so => (
                      <option key={so.id} value={so.id}>
                        {so.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                )}
              </div>

              {/* Programa Adicional - Sección destacada */}
              {campoVisible('programaAdicional') && (
              <div style={{ 
                marginBottom: 'clamp(32px, 5vw, 48px)',
                padding: 'clamp(20px, 3vw, 28px)',
                background: 'linear-gradient(135deg, #fef7ff 0%, #faf5ff 100%)',
                borderRadius: '16px',
                border: '2px solid #a855f7',
                gridColumn: '1 / -1' // Ocupar todo el ancho
              }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: 'clamp(12px, 2vw, 16px)', 
                  fontWeight: 700, 
                  color: '#7c3aed',
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  letterSpacing: '0.025em'
                }}>
                  🚀 Programas Adicionales
                </label>
                
                <MultiSelectTags
                  options={catalogos?.programaAdicional?.map(pa => ({
                    value: pa.id,
                    label: pa.nombre
                  })) || []}
                  value={agregarEquipo.programaAdicional}
                  onChange={agregarEquipo.setProgramaAdicional}
                  placeholder="Buscar y seleccionar programas..."
                  searchPlaceholder="Buscar programas..."
                  maxHeight={200}
                />
              </div>
              )}

              {/* Botones modernizados */}
              <div style={{ 
                display: 'flex', 
                gap: 'clamp(12px, 3vw, 20px)', 
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                marginTop: 'clamp(32px, 5vw, 48px)',
                paddingTop: 'clamp(20px, 3vw, 32px)',
                borderTop: '2px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '2px solid #cbd5e1',
                    color: '#475569',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(20px, 4vw, 28px)',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    minWidth: '120px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
                    e.currentTarget.style.borderColor = '#94a3b8';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit" 
                  disabled={agregarEquipo.addLoading || !dispositivoIdSeleccionado} 
                  style={{
                    background: agregarEquipo.addLoading ? 
                      'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' : 
                      'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    fontWeight: 700,
                    padding: 'clamp(14px, 3vw, 18px) clamp(24px, 5vw, 36px)',
                    borderRadius: '12px',
                    cursor: agregarEquipo.addLoading || !dispositivoIdSeleccionado ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    minWidth: '160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                  onMouseEnter={e => {
                    if (!agregarEquipo.addLoading && dispositivoIdSeleccionado) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                  }}
                >
                  {agregarEquipo.addLoading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Guardar Equipo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
