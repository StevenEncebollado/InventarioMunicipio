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

export default function EditarEquipoPage() {
  const router = useRouter();
  const params = useParams();
  const equipoId = params.id as string;
  const [user, setUser] = useState<Usuario | null>(null);
  const { catalogos, isLoading: catalogosLoading, error: catalogosError } = useCatalogosContext();
  const editarEquipo = useEditarEquipo(equipoId, user?.id);

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
    editarEquipo.setEditLoading(true);
    
    if (!editarEquipo.validarCampos()) {
      editarEquipo.setEditLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/inventario/${equipoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editarEquipo.getFormData())
      });
      
      if (response.ok) {
        router.push('/dashboard'); // Regresar al dashboard
      } else {
        throw new Error('Error al actualizar equipo');
      }
    } catch (err: any) {
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
          <h2>Equipo no encontrado</h2>
          <p style={{ color: '#e74c3c' }}>
            El equipo con ID {equipoId} no existe.
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
                <span role="img" aria-label="Editar" style={{ fontSize: '2.5rem' }}>✏️</span>
                Editar Equipo
              </h1>
              <p style={{ color: '#64748b', margin: '8px 0 0 0' }}>
                Modifique los campos necesarios para actualizar el equipo
              </p>
              <div style={{ 
                background: '#f0f9ff', 
                border: '1px solid #0ea5e9', 
                color: '#0369a1', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                marginTop: '16px',
                fontSize: '14px'
              }}>
                ID del equipo: {equipoId} | PC: {editarEquipo.equipo.nombre_pc}
              </div>
            </div>

            {editarEquipo.editError && (
              <div style={{ 
                background: '#fee2e2', 
                border: '1px solid #fecaca', 
                color: '#dc2626', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '24px' 
              }}>
                {editarEquipo.editError}
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
                    value={editarEquipo.ip} 
                    onChange={e => editarEquipo.setIp(e.target.value)} 
                    placeholder="192.168.1.100"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Dirección MAC *
                  </label>
                  <input 
                    value={editarEquipo.mac} 
                    onChange={e => editarEquipo.setMac(e.target.value)} 
                    placeholder="00:1B:63:84:45:E6"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Nombre de PC *
                  </label>
                  <input 
                    value={editarEquipo.nombrePc} 
                    onChange={e => editarEquipo.setNombrePc(e.target.value)} 
                    placeholder="PC-OFICINA-01"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Funcionario Responsable *
                  </label>
                  <input 
                    value={editarEquipo.funcionario} 
                    onChange={e => editarEquipo.setFuncionario(e.target.value)} 
                    placeholder="Juan Pérez"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    AnyDesk
                  </label>
                  <input 
                    value={editarEquipo.anydesk} 
                    onChange={e => editarEquipo.setAnydesk(e.target.value)} 
                    placeholder="123456789"
                    style={{ ...EstiloDashboardEspecifico.catalogos.selectStyle, width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Observaciones
                  </label>
                  <textarea 
                    value={editarEquipo.observaciones} 
                    onChange={e => editarEquipo.setObservaciones(e.target.value)} 
                    placeholder="Observaciones adicionales..."
                    rows={3}
                    style={{ 
                      ...EstiloDashboardEspecifico.catalogos.selectStyle, 
                      width: '100%',
                      resize: 'vertical',
                      minHeight: '80px'
                    }}
                  />
                </div>

                {/* Select Estado */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Estado *
                  </label>
                  <select 
                    value={editarEquipo.estado} 
                    onChange={e => editarEquipo.setEstado(e.target.value)} 
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
                    value={editarEquipo.tipoEquipo} 
                    onChange={e => editarEquipo.setTipoEquipo(e.target.value)} 
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
                    value={editarEquipo.marca} 
                    onChange={e => editarEquipo.setMarca(e.target.value)} 
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
                    value={editarEquipo.ram} 
                    onChange={e => editarEquipo.setRam(e.target.value)} 
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
                    value={editarEquipo.disco} 
                    onChange={e => editarEquipo.setDisco(e.target.value)} 
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
                    value={editarEquipo.office} 
                    onChange={e => editarEquipo.setOffice(e.target.value)} 
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
                    value={editarEquipo.tipoConexion} 
                    onChange={e => editarEquipo.setTipoConexion(e.target.value)} 
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
                    value={editarEquipo.dependencia} 
                    onChange={e => editarEquipo.setDependencia(e.target.value)} 
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
                    value={editarEquipo.direccion} 
                    onChange={e => editarEquipo.setDireccion(e.target.value)} 
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
                    value={editarEquipo.equipamiento} 
                    onChange={e => editarEquipo.setEquipamiento(e.target.value)} 
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
                    value={editarEquipo.caracteristica} 
                    onChange={e => editarEquipo.setCaracteristica(e.target.value)} 
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
                    value={editarEquipo.sistemaOperativo} 
                    onChange={e => editarEquipo.setSistemaOperativo(e.target.value)} 
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
                  value={editarEquipo.programaAdicional}
                  onChange={editarEquipo.setProgramaAdicional}
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
                  disabled={editarEquipo.editLoading} 
                  style={{
                    ...EstiloComponentesUI.botones.btn,
                    ...EstiloComponentesUI.botones.btnPrimary,
                    fontSize: '16px',
                    fontWeight: 600,
                    padding: '12px 32px',
                    borderRadius: '8px',
                    opacity: editarEquipo.editLoading ? 0.6 : 1,
                    cursor: editarEquipo.editLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {editarEquipo.editLoading ? 'Actualizando...' : 'Actualizar Equipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
