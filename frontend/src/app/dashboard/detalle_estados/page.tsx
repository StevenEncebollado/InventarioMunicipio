// Sirve para que el usuario pueda ver, filtrar y navegar
// una lista detallada de equipos del inventario municipal,
// con opciones avanzadas de filtrado y navegación.

"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import type { Equipo, Usuario } from '@/types';
import { useEffect, useState } from 'react';
import { getEquipos, APP_CONFIG } from '@/services/api';
import { filtrarEquipos } from '@/utils/filtrarEquipos';

import Navbar from '../../Diseño/Diseño dashboard/Navbar';
import PanelControl from '../../Diseño/Diseño dashboard/PanelControl';
import Filtros from '../componentes/Filtros';
import { estiloGlobal } from '../../Diseño/Estilos/EstiloGlobal';
import { estiloTablas } from '../../Diseño/Estilos/EstiloTablas';

const TITULOS: Record<string, string> = {
  total: 'Todos los Equipos',
  active: 'Equipos Activos',
  maintenance: 'Equipos en Mantenimiento',
  inactive: 'Equipos Inactivos',
};

export default function EquiposLista() {
  const router = useRouter();
  const params = useSearchParams();
  const tipo = params.get('tipo') || 'total';
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Usuario | null>(null);
  
  // Estados de filtros
  const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState('');
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState('');
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState('');
  const [tipoEquipoSeleccionado, setTipoEquipoSeleccionado] = useState('');
  const [tipoSistemaOperativoSeleccionado, setTipoSistemaOperativoSeleccionado] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
  const [caracteristicaSeleccionada, setCaracteristicaSeleccionada] = useState('');
  const [ramSeleccionada, setRamSeleccionada] = useState('');
  const [discoSeleccionado, setDiscoSeleccionado] = useState('');
  const [officeSeleccionado, setOfficeSeleccionado] = useState('');
  const [tipoConexionSeleccionada, setTipoConexionSeleccionada] = useState('');
  const [programaAdicionalSeleccionado, setProgramaAdicionalSeleccionado] = useState<string[]>([]);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cargar usuario de localStorage
  useEffect(() => {
    const userData = localStorage.getItem(APP_CONFIG.session.storageKey);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Cargar equipos filtrados desde el backend según los filtros principales
  useEffect(() => {
    setLoading(true);
    const filtrosBackend: any = {};
    if (dependenciaSeleccionada) filtrosBackend.dependencia = dependenciaSeleccionada;
    if (direccionSeleccionada) filtrosBackend.direccion = direccionSeleccionada;
    if (dispositivoSeleccionado) filtrosBackend.dispositivo = dispositivoSeleccionado;
    if (equipamientoSeleccionado) filtrosBackend.equipamiento = equipamientoSeleccionado;
    if (tipoEquipoSeleccionado) filtrosBackend.tipo_equipo = tipoEquipoSeleccionado;
    if (tipoSistemaOperativoSeleccionado) filtrosBackend.tipo_sistema_operativo = tipoSistemaOperativoSeleccionado;
    if (marcaSeleccionada) filtrosBackend.marca = marcaSeleccionada;
    if (caracteristicaSeleccionada) filtrosBackend.caracteristica = caracteristicaSeleccionada;
    if (ramSeleccionada) filtrosBackend.ram = ramSeleccionada;
    if (discoSeleccionado) filtrosBackend.disco = discoSeleccionado;
    if (officeSeleccionado) filtrosBackend.office = officeSeleccionado;
    if (tipoConexionSeleccionada) filtrosBackend.tipo_conexion = tipoConexionSeleccionada;

    getEquipos(filtrosBackend).then(data => {
      setEquipos(data);
      setLoading(false);
    });
  }, [dependenciaSeleccionada, direccionSeleccionada, dispositivoSeleccionado, equipamientoSeleccionado, tipoEquipoSeleccionado, tipoSistemaOperativoSeleccionado, marcaSeleccionada, caracteristicaSeleccionada, ramSeleccionada, discoSeleccionado, officeSeleccionado, tipoConexionSeleccionada]);


  // Unificar todos los filtros en un objeto, pero si no hay filtros avanzados, solo filtra por tipo
  let estadoFiltro: '' | 'Activo' | 'Mantenimiento' | 'Inactivo' | undefined = '';
  if (tipo === 'active') estadoFiltro = 'Activo';
  else if (tipo === 'maintenance') estadoFiltro = 'Mantenimiento';
  else if (tipo === 'inactive') estadoFiltro = 'Inactivo';

  const filtros = {
    dependenciaSeleccionada,
    direccionSeleccionada,
    dispositivoSeleccionado,
    equipamientoSeleccionado,
    tipoEquipoSeleccionado,
    tipoSistemaOperativoSeleccionado,
    marcaSeleccionada,
    caracteristicaSeleccionada,
    ramSeleccionada,
    discoSeleccionado,
    officeSeleccionado,
    tipoConexionSeleccionada,
    programaAdicionalSeleccionado,
    estado: estadoFiltro
  };

  // Si no hay ningún filtro avanzado, solo filtra por estado (tipo)
  const hayFiltrosAvanzados = [
    dependenciaSeleccionada,
    direccionSeleccionada,
    dispositivoSeleccionado,
    equipamientoSeleccionado,
    tipoEquipoSeleccionado,
    tipoSistemaOperativoSeleccionado,
    marcaSeleccionada,
    caracteristicaSeleccionada,
    ramSeleccionada,
    discoSeleccionado,
    officeSeleccionado,
    tipoConexionSeleccionada,
    programaAdicionalSeleccionado.length > 0
  ].some(Boolean);

  const equiposFiltrados = hayFiltrosAvanzados
    ? filtrarEquipos(equipos, filtros)
    : filtrarEquipos(equipos, { estado: estadoFiltro });

  // Estadísticas para PanelControl
  const stats = {
    total: filtrarEquipos(equipos, { ...filtros, estado: '' }).length,
    active: filtrarEquipos(equipos, { ...filtros, estado: 'Activo' }).length,
    maintenance: filtrarEquipos(equipos, { ...filtros, estado: 'Mantenimiento' }).length,
    inactive: filtrarEquipos(equipos, { ...filtros, estado: 'Inactivo' }).length,
  };

  // Calcular datos de paginación
  const totalPages = Math.ceil(equiposFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const equiposPaginados = equiposFiltrados.slice(startIndex, endIndex);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [dependenciaSeleccionada, direccionSeleccionada, dispositivoSeleccionado, equipamientoSeleccionado, tipoEquipoSeleccionado, tipoSistemaOperativoSeleccionado, marcaSeleccionada, caracteristicaSeleccionada, ramSeleccionada, discoSeleccionado, officeSeleccionado, tipoConexionSeleccionada, programaAdicionalSeleccionado, tipo]);

  // Handler para navegar entre segmentos
  const handlePanelInfo = (type: 'total' | 'active' | 'maintenance' | 'inactive') => {
    router.push(`/dashboard/detalle_estados?tipo=${type}`);
  };

  // Handler para logout
  const handleLogout = () => {
    localStorage.removeItem(APP_CONFIG.session.storageKey);
    localStorage.removeItem(APP_CONFIG.session.tokenKey);
    router.push('/');
  };

  return (
    <div style={estiloGlobal.dashboard}>
      <Navbar user={user} onLogout={handleLogout} />
      <main style={{...estiloGlobal.dashboardContent, background: '#f4f6fa', minHeight: '100vh', padding: '0 0 48px 0'}}>
        <Filtros
          dependenciaSeleccionada={dependenciaSeleccionada}
          setDependenciaSeleccionada={setDependenciaSeleccionada}
          direccionSeleccionada={direccionSeleccionada}
          setDireccionSeleccionada={setDireccionSeleccionada}
          dispositivoSeleccionado={dispositivoSeleccionado}
          setDispositivoSeleccionado={setDispositivoSeleccionado}
          equipamientoSeleccionado={equipamientoSeleccionado}
          setEquipamientoSeleccionado={setEquipamientoSeleccionado}
          tipoEquipoSeleccionado={tipoEquipoSeleccionado}
          setTipoEquipoSeleccionado={setTipoEquipoSeleccionado}
          tipoSistemaOperativoSeleccionado={tipoSistemaOperativoSeleccionado}
          setTipoSistemaOperativoSeleccionado={setTipoSistemaOperativoSeleccionado}
          marcaSeleccionada={marcaSeleccionada}
          setMarcaSeleccionada={setMarcaSeleccionada}
          caracteristicaSeleccionada={caracteristicaSeleccionada}
          setCaracteristicaSeleccionada={setCaracteristicaSeleccionada}
          ramSeleccionada={ramSeleccionada}
          setRamSeleccionada={setRamSeleccionada}
          discoSeleccionado={discoSeleccionado}
          setDiscoSeleccionado={setDiscoSeleccionado}
          officeSeleccionado={officeSeleccionado}
          setOfficeSeleccionado={setOfficeSeleccionado}
          tipoConexionSeleccionada={tipoConexionSeleccionada}
          setTipoConexionSeleccionada={setTipoConexionSeleccionada}
          programaAdicionalSeleccionado={programaAdicionalSeleccionado}
          setProgramaAdicionalSeleccionado={setProgramaAdicionalSeleccionado}
        />
        <PanelControl
          total={stats.total}
          active={stats.active}
          maintenance={stats.maintenance}
          inactive={stats.inactive}
          onInfoClick={handlePanelInfo}
          loading={loading}
        />
        <div style={{ maxWidth: 1200, margin: '48px auto', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>{TITULOS[tipo] || 'Equipos'}</h2>
            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
              {equiposFiltrados.length} equipos encontrados
            </div>
          </div>
          
          {loading ? (
            <div style={{ minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ ...estiloGlobal.spinner, width: 56, height: 56, color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <svg width="56" height="56" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#2563eb" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
              </div>
              <div style={{ color: '#2563eb', fontWeight: 600, fontSize: 18, letterSpacing: 0.5 }}>Cargando...</div>
            </div>
          ) : equiposFiltrados.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#64748b'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No hay equipos</h3>
              <p style={{ margin: 0 }}>No se encontraron equipos que coincidan con los filtros aplicados.</p>
            </div>
          ) : (
            <>
              {/* Tabla de equipos */}
              <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ ...estiloTablas.equiposTableTh, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Funcionario</th>
                      <th style={{ ...estiloTablas.equiposTableTh, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Código</th>
                      <th style={{ ...estiloTablas.equiposTableTh, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Estado</th>
                      <th style={{ ...estiloTablas.equiposTableTh, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Nombre PC</th>
                      <th style={{ ...estiloTablas.equiposTableTh, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Dirección IP</th>
                      <th style={{ ...estiloTablas.equiposTableTh, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>AnyDesk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equiposPaginados.map((equipo, index) => (
                      <tr 
                        key={equipo.id} 
                        style={{ 
                          borderBottom: '1px solid #e2e8f0',
                          background: index % 2 === 0 ? '#fff' : '#f9fafb'
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                          {equipo.nombres_funcionario || 'Sin asignar'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {equipo.codigo_inventario || 'Sin código'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: equipo.estado === 'Activo' ? '#dcfce7' : 
                                      equipo.estado === 'Mantenimiento' ? '#fef3c7' : '#fecaca',
                            color: equipo.estado === 'Activo' ? '#166534' : 
                                   equipo.estado === 'Mantenimiento' ? '#92400e' : '#991b1b',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            {equipo.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {equipo.nombre_pc || 'N/A'}
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>
                          {equipo.direccion_ip || 'N/A'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {equipo.anydesk || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación simple */}
              {totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '20px'
                }}>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: currentPage === 1 ? '#f9fafb' : '#fff',
                      color: currentPage === 1 ? '#9ca3af' : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: 500
                    }}
                  >
                    Anterior
                  </button>
                  
                  <span style={{ 
                    padding: '8px 16px',
                    color: '#374151',
                    fontWeight: 500
                  }}>
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: currentPage === totalPages ? '#f9fafb' : '#fff',
                      color: currentPage === totalPages ? '#9ca3af' : '#374151',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontWeight: 500
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
          
          <button 
            onClick={() => router.push('/dashboard')} 
            style={{ 
              marginTop: 24, 
              background: '#2563eb', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '10px 22px', 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Volver al Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
