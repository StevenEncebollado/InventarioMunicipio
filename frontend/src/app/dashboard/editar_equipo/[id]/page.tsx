  'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCatalogosContext } from '../../context/CatalogosContext';
import { EstiloDashboardEspecifico } from '../../../Diseño/Estilos/EstiloDashboardEspecifico';
import { EstiloComponentesUI } from '../../../Diseño/Estilos/EstiloComponentesUI';
import Navbar from '../../../Diseño/Diseño dashboard/Navbar';
import { useEditarEquipo } from '../../hooks/useEditarEquipo';
import MultiSelectTags from '../../componentes/MultiSelectTags';
import { APP_CONFIG } from '@/services/api';
import type { Usuario } from '@/types';
import Swal from 'sweetalert2';

export default function EditarEquipoPage() {
  const router = useRouter();
  const params = useParams();
  const equipoId = params.id as string;
  const [user, setUser] = useState<Usuario | null>(null);
  const { catalogos, isLoading: catalogosLoading, error: catalogosError } = useCatalogosContext();

  const editarEquipo = useEditarEquipo(equipoId, user?.id);

  // Función para determinar si un campo debe estar visible según los datos del equipo
  const campoVisible = (campo: string): boolean => {
    // Si no hay equipo cargado, no mostrar ningún campo
    if (!editarEquipo.equipo) return false;
    
    const equipo = editarEquipo.equipo;
    
    // Mapear los nombres de campos a las propiedades del equipo
    const mapaCampos: { [key: string]: any } = {
      'ip': equipo.direccion_ip,
      'mac': equipo.direccion_mac,
      'codigoInventario': equipo.codigo_inventario,
      'nombrePc': equipo.nombre_pc,
      'funcionario': equipo.nombres_funcionario,
      'anydesk': equipo.anydesk,
      'estado': equipo.estado,
      'tipoEquipo': equipo.tipo_equipo_id,
      'marca': equipo.marca_id,
      'ram': equipo.ram_id,
      'disco': equipo.disco_id,
      'office': equipo.office_id,
      'tipoConexion': equipo.tipo_conexion_id,
      'programaAdicional': equipo.programa_adicional_ids,
      'dependencia': equipo.dependencia_id,
      'direccion': equipo.direccion_area_id,
      'equipamiento': equipo.equipamiento_id,
      'caracteristicas': equipo.caracteristicas_id,
      'sistemaOperativo': equipo.tipo_sistema_operativo_id
    };
    
    const valor = mapaCampos[campo];
    
    // Mostrar el campo si tiene algún valor (no null, undefined, empty string, o array vacío)
    if (Array.isArray(valor)) {
      return valor.length > 0;
    }
    
    return valor !== null && valor !== undefined && valor !== '';
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editarEquipo.setEditError("");
    
    if (!(await editarEquipo.validarCampos())) {
      return;
    }
    
    // Mostrar confirmación antes de proceder
    const result = await Swal.fire({
      title: '¿Confirmar cambios?',
      text: '¿Estás seguro de que deseas actualizar este equipo con los cambios realizados?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      backdrop: true,
      reverseButtons: true
    });

    // Si el usuario cancela, no hacer nada
    if (!result.isConfirmed) {
      return;
    }
    
    editarEquipo.setEditLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5000/inventario/${equipoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editarEquipo.getFormData())
      });
      
      if (response.ok) {
        // Mostrar SweetAlert de éxito
        await Swal.fire({
          title: '¡Éxito!',
          text: 'El equipo ha sido actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#2563eb',
          backdrop: true,
          allowOutsideClick: false
        });
        
        router.push('/dashboard'); // Regresar al dashboard
      } else {
        // Intentar obtener el mensaje de error del backend
        let errorMessage = 'Error al actualizar equipo';
        try {
          const errorData = await response.json();
          
          // Verificación segura de las propiedades del error
          if (errorData && typeof errorData === 'object') {
            if ('message' in errorData && typeof errorData.message === 'string') {
              errorMessage = errorData.message;
            } else if ('error' in errorData && typeof errorData.error === 'string') {
              errorMessage = errorData.error;
            }
          }
        } catch {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      // Mostrar SweetAlert de error
      await Swal.fire({
        title: 'Error',
        text: `Error al actualizar equipo: ${err.message || 'Error desconocido'}`,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#dc2626',
        backdrop: true
      });
      
      editarEquipo.setEditError("Error al actualizar equipo: " + (err.message || 'Error desconocido'));
    } finally {
      editarEquipo.setEditLoading(false);
    }
  };

  if (catalogosLoading || editarEquipo.loadingEquipo) {
    return (
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2>Editar Equipo</h2>
          <p>Cargando datos del equipo...</p>
        </div>
      </div>
    );
  }

  if (catalogosError || editarEquipo.editError) {
    return (
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2>Editar Equipo</h2>
          <p style={{ color: '#e74c3c' }}>
            Error: {catalogosError || editarEquipo.editError}
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!editarEquipo.equipo) {
    return (
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2>Editar Equipo</h2>
          <p>Cargando datos del equipo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-equipo-container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' 
    }}>
      <Navbar user={user} onLogout={handleLogout} />
      
      <div style={{ 
        padding: 'clamp(20px, 4vw, 48px) clamp(16px, 3vw, 32px)',
        paddingBottom: 'clamp(60px, 10vh, 100px)'
      }}>
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          width: '100%'
        }}>
          <div className="edit-form-container" style={{ 
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
            borderRadius: '20px', 
            padding: 'clamp(24px, 4vw, 40px)', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05)',
            border: '1px solid rgba(226,232,240,0.8)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="header-section" style={{ 
              marginBottom: 'clamp(24px, 4vw, 40px)', 
              textAlign: 'center' 
            }}>
              <h1 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
                fontWeight: 700, 
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(8px, 2vw, 16px)',
                flexWrap: 'wrap',
                letterSpacing: '-0.025em'
              }}>
                <span role="img" aria-label="Editar" style={{ 
                  fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                  filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.2))'
                }}>✏️</span>
                <span>Editar Equipo</span>
              </h1>
              <p style={{ 
                color: '#64748b', 
                fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
                lineHeight: '1.5',
                maxWidth: '600px',
                margin: 'clamp(8px, 2vw, 12px) auto 0'
              }}>
                Modifique los campos necesarios para actualizar el equipo
              </p>
              <div className="equipo-info" style={{ 
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
                border: '2px solid #3b82f6', 
                color: '#1e40af', 
                padding: 'clamp(10px, 2vw, 16px) clamp(12px, 2.5vw, 20px)', 
                borderRadius: '12px', 
                marginTop: 'clamp(16px, 3vw, 24px)',
                fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                fontWeight: 600,
                display: 'inline-block',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
              }}>
                <span className="equipo-info-full">
                  ID del equipo: {equipoId} | PC: {editarEquipo.equipo.nombre_pc}
                </span>
                <span className="equipo-info-short" style={{ display: 'none' }}>
                  ID: {equipoId}
                </span>
              </div>
            </div>

            {editarEquipo.editError && (
              <div className="error-message" style={{ 
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', 
                border: '2px solid #f87171', 
                color: '#b91c1c', 
                padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)', 
                borderRadius: '12px', 
                marginBottom: 'clamp(20px, 3vw, 28px)',
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(185, 28, 28, 0.15)',
                backdropFilter: 'blur(10px)'
              }}>
                {editarEquipo.editError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', 
                gap: 'clamp(16px, 3vw, 24px)',
                marginBottom: 'clamp(20px, 3vw, 32px)'
              }}>
                {/* Campos de texto */}
                {campoVisible('ip') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Dirección IP
                  </label>
                  <input 
                    value={editarEquipo.ip} 
                    onChange={e => editarEquipo.setIp(e.target.value)} 
                    placeholder="Ej: 192.168.1.100"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>
                )}

                {campoVisible('mac') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Dirección MAC
                  </label>
                  <input 
                    value={editarEquipo.mac} 
                    onChange={e => editarEquipo.setMac(e.target.value)} 
                    placeholder="Ej: 00:1B:63:84:45:E6"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>
                )}

                {campoVisible('codigoInventario') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Código de Inventario
                  </label>
                  <input 
                    value={editarEquipo.codigoInventario} 
                    onChange={e => editarEquipo.setCodigoInventario(e.target.value)} 
                    placeholder="Ej: INV-001"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>
                )}

                {campoVisible('nombrePc') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Nombre de PC
                  </label>
                  <input 
                    value={editarEquipo.nombrePc} 
                    onChange={e => editarEquipo.setNombrePc(e.target.value)} 
                    placeholder="Ej: PC-OFICINA-01"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>
                )}

                {campoVisible('funcionario') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Funcionario Responsable
                  </label>
                  <input 
                    value={editarEquipo.funcionario} 
                    onChange={e => editarEquipo.setFuncionario(e.target.value)} 
                    placeholder="Ej: Juan Pérez"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>
                )}

                {campoVisible('anydesk') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    AnyDesk
                  </label>
                  <input 
                    value={editarEquipo.anydesk} 
                    onChange={e => editarEquipo.setAnydesk(e.target.value)} 
                    placeholder="Ej: 123456789"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>
                )}

                {/* Select Estado */}
                {campoVisible('estado') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Estado
                  </label>
                  <select 
                    value={editarEquipo.estado} 
                    onChange={e => editarEquipo.setEstado(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>
                )}

                {/* Selects de catálogos */}
                {campoVisible('tipoEquipo') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Tipo de Equipo
                  </label>
                  <select 
                    value={editarEquipo.tipoEquipo} 
                    onChange={e => editarEquipo.setTipoEquipo(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar tipo</option>
                    {catalogos.tiposEquipo.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('marca') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Marca
                  </label>
                  <select 
                    value={editarEquipo.marca} 
                    onChange={e => editarEquipo.setMarca(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar marca</option>
                    {catalogos.marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('ram') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    RAM
                  </label>
                  <select 
                    value={editarEquipo.ram} 
                    onChange={e => editarEquipo.setRam(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar RAM</option>
                    {catalogos.ram.map(r => <option key={r.id} value={r.id}>{r.capacidad}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('disco') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Disco Duro
                  </label>
                  <select 
                    value={editarEquipo.disco} 
                    onChange={e => editarEquipo.setDisco(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar disco</option>
                    {catalogos.disco.map(d => <option key={d.id} value={d.id}>{d.capacidad}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('office') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Office
                  </label>
                  <select 
                    value={editarEquipo.office} 
                    onChange={e => editarEquipo.setOffice(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar Office</option>
                    {catalogos.office.map(o => <option key={o.id} value={o.id}>{o.version}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('tipoConexion') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Tipo de Conexión
                  </label>
                  <select 
                    value={editarEquipo.tipoConexion} 
                    onChange={e => editarEquipo.setTipoConexion(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar conexión</option>
                    {catalogos.tipoConexion.map(tc => <option key={tc.id} value={tc.id}>{tc.nombre}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('dependencia') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Dependencia
                  </label>
                  <select 
                    value={editarEquipo.dependencia} 
                    onChange={e => editarEquipo.setDependencia(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar dependencia</option>
                    {catalogos.dependencias.map(dep => <option key={dep.id} value={dep.id}>{dep.nombre}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('direccion') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Dirección/Área
                  </label>
                  <select 
                    value={editarEquipo.direccion} 
                    onChange={e => editarEquipo.setDireccion(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar dirección</option>
                    {catalogos.direcciones.map(dir => <option key={dir.id} value={dir.id}>{dir.nombre}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('equipamiento') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Equipamiento
                  </label>
                  <select 
                    value={editarEquipo.equipamiento} 
                    onChange={e => editarEquipo.setEquipamiento(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar equipamiento</option>
                    {catalogos.equipamientos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('caracteristicas') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Característica
                  </label>
                  <select 
                    value={editarEquipo.caracteristica} 
                    onChange={e => editarEquipo.setCaracteristica(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar característica</option>
                    {catalogos.caracteristicas.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
                  </select>
                </div>
                )}

                {campoVisible('sistemaOperativo') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Sistema Operativo
                  </label>
                  <select 
                    value={editarEquipo.sistemaOperativo} 
                    onChange={e => editarEquipo.setSistemaOperativo(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar SO</option>
                    {catalogos.sistemasOperativos.map(so => <option key={so.id} value={so.id}>{so.nombre}</option>)}
                  </select>
                </div>
                )}
              </div>

              {/* Programa Adicional - Span completo */}
              {campoVisible('programaAdicional') && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                  Programas Adicionales
                </label>
                <MultiSelectTags
                  options={catalogos.programaAdicional.map(pa => ({
                    value: pa.id,
                    label: pa.nombre
                  }))}
                  value={editarEquipo.programaAdicional}
                  onChange={editarEquipo.setProgramaAdicional}
                  placeholder="Buscar y seleccionar programas..."
                  searchPlaceholder="Buscar programas..."
                  maxHeight={200}
                />
              </div>
              )}

              {/* Botones modernizados */}
              <div className="form-buttons" style={{ 
                display: 'flex', 
                gap: 'clamp(12px, 3vw, 20px)', 
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                marginTop: 'clamp(24px, 4vw, 32px)'
              }}>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="cancel-button"
                  style={{
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                    border: '2px solid #cbd5e1',
                    color: '#475569',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(20px, 4vw, 28px)',
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    outline: 'none',
                    minWidth: 'fit-content',
                    letterSpacing: '0.025em',
                  }}
                  onMouseEnter={e => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
                    target.style.borderColor = '#94a3b8';
                    target.style.transform = 'translateY(-1px)';
                    target.style.boxShadow = '0 4px 12px rgba(71, 85, 105, 0.2)';
                  }}
                  onMouseLeave={e => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                    target.style.borderColor = '#cbd5e1';
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = 'none';
                  }}
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit" 
                  disabled={editarEquipo.editLoading}
                  className="submit-button"
                  style={{
                    background: editarEquipo.editLoading
                      ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: '2px solid transparent',
                    color: '#ffffff',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    fontWeight: 700,
                    cursor: editarEquipo.editLoading ? 'not-allowed' : 'pointer',
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 36px)',
                    borderRadius: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    outline: 'none',
                    minWidth: 'fit-content',
                    letterSpacing: '0.025em',
                    boxShadow: editarEquipo.editLoading 
                      ? 'none' 
                      : '0 8px 25px rgba(59, 130, 246, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    if (!editarEquipo.editLoading) {
                      const target = e.target as HTMLButtonElement;
                      target.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)';
                      target.style.transform = 'translateY(-2px)';
                      target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.5)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!editarEquipo.editLoading) {
                      const target = e.target as HTMLButtonElement;
                      target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
                      target.style.transform = 'translateY(0)';
                      target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                    }
                  }}
                >
                  {editarEquipo.editLoading && (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #ffffff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  <span>{editarEquipo.editLoading ? 'Actualizando...' : 'Actualizar Equipo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* CSS responsivo para editar equipo */}
      <style jsx global>{`
        /* Animación de carga */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Responsive para móviles */
        @media (max-width: 768px) {
          .edit-form-container {
            border-radius: 16px !important;
            margin: 0 8px !important;
          }
          
          .form-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .form-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          
          .cancel-button,
          .submit-button {
            width: 100% !important;
            justify-content: center !important;
          }
          
          .equipo-info-full {
            display: none !important;
          }
          
          .equipo-info-short {
            display: inline !important;
          }
          
          .header-section h1 {
            flex-direction: column !important;
            gap: 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          .editar-equipo-container {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          
          .edit-form-container {
            padding: 20px !important;
            border-radius: 12px !important;
          }
          
          .form-grid {
            gap: 12px !important;
          }
          
          .header-section h1 span:first-child {
            font-size: 1.8rem !important;
          }
          
          .equipo-info {
            padding: 8px 12px !important;
            font-size: 0.75rem !important;
          }
          
          .error-message {
            padding: 10px 14px !important;
            font-size: 0.8rem !important;
          }
        }
        
        /* Tablets */
        @media (min-width: 769px) and (max-width: 1024px) {
          .form-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          }
          
          .edit-form-container {
            padding: 32px !important;
          }
        }
        
        /* Pantallas grandes */
        @media (min-width: 1441px) {
          .edit-form-container {
            max-width: 1000px !important;
            padding: 48px !important;
          }
          
          .form-grid {
            gap: 28px !important;
          }
        }
        
        /* Mejoras en accesibilidad */
        .cancel-button:focus-visible,
        .submit-button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Estilos para campos de formulario */
        .form-grid input,
        .form-grid select {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px !important;
          border: 2px solid #e2e8f0 !important;
          padding: 12px 16px !important;
          font-size: clamp(0.9rem, 2vw, 1rem) !important;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
        }
        
        .form-grid input:focus,
        .form-grid select:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          outline: none !important;
        }
        
        .form-grid label {
          font-weight: 600 !important;
          color: #1e293b !important;
          margin-bottom: 8px !important;
          font-size: clamp(0.85rem, 2vw, 0.95rem) !important;
          letter-spacing: 0.025em !important;
        }
        
        /* Estados disabled mejorados */
        .submit-button:disabled {
          transform: none !important;
          box-shadow: none !important;
          cursor: not-allowed !important;
        }
        
        .submit-button:disabled:hover {
          background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%) !important;
          transform: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
