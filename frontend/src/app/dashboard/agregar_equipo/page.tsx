'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCatalogosContext } from '../context/CatalogosContext';
import { EstiloDashboardEspecifico } from '../../Diseño/Estilos/EstiloDashboardEspecifico';
import { EstiloComponentesUI } from '../../Diseño/Estilos/EstiloComponentesUI';
import Navbar from '../../Diseño/Diseño dashboard/Navbar';
import { useAgregarEquipo } from '../hooks/useAgregarEquipo';
import MultiSelectTags from '../componentes/MultiSelectTags';
import { APP_CONFIG } from '@/services/api';
import type { Usuario } from '@/types';
import Swal from 'sweetalert2';

export default function AgregarEquipoPage() {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const { catalogos, isLoading: catalogosLoading, error: catalogosError } = useCatalogosContext();
  const agregarEquipo = useAgregarEquipo(user?.id);

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
    agregarEquipo.setAddError("");
    agregarEquipo.setAddLoading(true);
    
    if (!(await agregarEquipo.validarCampos())) {
      agregarEquipo.setAddLoading(false);
      return;
    }
    
    try {
      const formData = agregarEquipo.getFormData();
      console.log('Enviando datos al servidor:', formData);
      
      const response = await fetch('http://localhost:5000/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Mostrar mensaje de éxito con SweetAlert2
        await Swal.fire({
          icon: 'success',
          title: '¡Equipo creado exitosamente!',
          text: `El equipo ha sido agregado correctamente al inventario.`,
          confirmButtonColor: '#28a745',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: true
        });
        
        agregarEquipo.limpiarCampos();
        router.push('/dashboard'); // Regresar al dashboard
      } else {
        let errorMessage = 'No se pudo crear el equipo. Verifica los datos ingresados.';
        let errorData: any = {};
        
        try {
          errorData = await response.json();
          console.error('Error del servidor:', errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error al parsear respuesta del servidor:', parseError);
          errorMessage = `Error del servidor (${response.status}): ${response.statusText}`;
        }
        
        // Mostrar error con SweetAlert2 con más detalles
        await Swal.fire({
          icon: 'error',
          title: 'Error al crear equipo',
          text: errorMessage,
          confirmButtonColor: '#dc3545',
          footer: `Código de error: ${response.status}`
        });
      }
    } catch (err: any) {
      console.error('Error de conexión:', err);
      
      // Mostrar error de conexión con SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      agregarEquipo.setAddLoading(false);
    }
  };

  if (catalogosLoading) {
    return (
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2>Agregar Nuevo Equipo</h2>
          <p>Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (catalogosError) {
    return (
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2>Agregar Nuevo Equipo</h2>
          <p style={{ color: '#e74c3c' }}>Error al cargar formulario: {catalogosError}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fa' }}>
      <Navbar user={user} onLogout={handleLogout} />
      
      <div style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: '16px', 
            padding: '32px', 
            boxShadow: '0 4px 24px rgba(44,62,80,0.08)' 
          }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 700, 
                color: '#2563eb', 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <span role="img" aria-label="Computadora" style={{ fontSize: '2.5rem' }}>💻</span>
                Agregar Nuevo Equipo
              </h1>
              <p style={{ color: '#64748b', margin: '8px 0 0 0' }}>
                Complete todos los campos requeridos para registrar un nuevo equipo
              </p>
            </div>

            {agregarEquipo.addError && (
              <div style={{ 
                background: '#fee2e2', 
                border: '1px solid #fecaca', 
                color: '#dc2626', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '24px' 
              }}>
                {agregarEquipo.addError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px',
                marginBottom: '24px'
              }}>
                {/* Campos de texto */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Dirección IP *
                  </label>
                  <input 
                    value={agregarEquipo.ip} 
                    onChange={e => agregarEquipo.setIp(e.target.value)} 
                    placeholder="Ej: 192.168.1.100"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Dirección MAC *
                  </label>
                  <input 
                    value={agregarEquipo.mac} 
                    onChange={e => agregarEquipo.setMac(e.target.value)} 
                    placeholder="Ej: 00:1B:63:84:45:E6"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Nombre de PC *
                  </label>
                  <input 
                    value={agregarEquipo.nombrePc} 
                    onChange={e => agregarEquipo.setNombrePc(e.target.value)} 
                    placeholder="Ej: PC-OFICINA-01"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Funcionario Responsable *
                  </label>
                  <input 
                    value={agregarEquipo.funcionario} 
                    onChange={e => agregarEquipo.setFuncionario(e.target.value)} 
                    placeholder="Ej: Juan Pérez"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    AnyDesk
                  </label>
                  <input 
                    value={agregarEquipo.anydesk} 
                    onChange={e => agregarEquipo.setAnydesk(e.target.value)} 
                    placeholder="Ej: 123456789"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                {/* Select Estado */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Estado *
                  </label>
                  <select 
                    value={agregarEquipo.estado} 
                    onChange={e => agregarEquipo.setEstado(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                {/* Selects de catálogos */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Tipo de Equipo *
                  </label>
                  <select 
                    value={agregarEquipo.tipoEquipo} 
                    onChange={e => agregarEquipo.setTipoEquipo(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar tipo</option>
                    {catalogos.tiposEquipo.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Marca *
                  </label>
                  <select 
                    value={agregarEquipo.marca} 
                    onChange={e => agregarEquipo.setMarca(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar marca</option>
                    {catalogos.marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    RAM *
                  </label>
                  <select 
                    value={agregarEquipo.ram} 
                    onChange={e => agregarEquipo.setRam(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar RAM</option>
                    {catalogos.ram.map(r => <option key={r.id} value={r.id}>{r.capacidad}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Disco Duro *
                  </label>
                  <select 
                    value={agregarEquipo.disco} 
                    onChange={e => agregarEquipo.setDisco(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar disco</option>
                    {catalogos.disco.map(d => <option key={d.id} value={d.id}>{d.capacidad}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Office
                  </label>
                  <select 
                    value={agregarEquipo.office} 
                    onChange={e => agregarEquipo.setOffice(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar Office</option>
                    {catalogos.office.map(o => <option key={o.id} value={o.id}>{o.version}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Tipo de Conexión
                  </label>
                  <select 
                    value={agregarEquipo.tipoConexion} 
                    onChange={e => agregarEquipo.setTipoConexion(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar conexión</option>
                    {catalogos.tipoConexion.map(tc => <option key={tc.id} value={tc.id}>{tc.nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Dependencia *
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

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Dirección/Área
                  </label>
                  <select 
                    value={agregarEquipo.direccion} 
                    onChange={e => agregarEquipo.setDireccion(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar dirección</option>
                    {catalogos.direcciones.map(dir => <option key={dir.id} value={dir.id}>{dir.nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Equipamiento
                  </label>
                  <select 
                    value={agregarEquipo.equipamiento} 
                    onChange={e => agregarEquipo.setEquipamiento(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar equipamiento</option>
                    {catalogos.equipamientos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Característica
                  </label>
                  <select 
                    value={agregarEquipo.caracteristica} 
                    onChange={e => agregarEquipo.setCaracteristica(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar característica</option>
                    {catalogos.caracteristicas.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Sistema Operativo
                  </label>
                  <select 
                    value={agregarEquipo.sistemaOperativo} 
                    onChange={e => agregarEquipo.setSistemaOperativo(e.target.value)} 
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  >
                    <option value="">Seleccionar SO</option>
                    {catalogos.sistemasOperativos.map(so => <option key={so.id} value={so.id}>{so.nombre}</option>)}
                  </select>
                </div>
              </div>

              {/* Programa Adicional - Span completo */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                  Programas Adicionales
                </label>
                
                <MultiSelectTags
                  options={catalogos.programaAdicional.map(pa => ({
                    value: pa.id,
                    label: pa.nombre
                  }))}
                  value={agregarEquipo.programaAdicional}
                  onChange={agregarEquipo.setProgramaAdicional}
                  placeholder="Buscar y seleccionar programas..."
                  searchPlaceholder="Buscar programas..."
                  maxHeight={200}
                />
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  style={{
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit" 
                  disabled={agregarEquipo.addLoading} 
                  style={{
                    ...EstiloComponentesUI.botones.btn,
                    ...EstiloComponentesUI.botones.btnPrimary,
                    fontSize: '16px',
                    fontWeight: 600,
                    padding: '12px 32px',
                    borderRadius: '8px',
                    opacity: agregarEquipo.addLoading ? 0.6 : 1,
                    cursor: agregarEquipo.addLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {agregarEquipo.addLoading ? 'Guardando...' : 'Guardar Equipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
