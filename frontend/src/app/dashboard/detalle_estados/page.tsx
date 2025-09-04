// Sirve para que el usuario pueda ver, filtrar y navegar
// una lista detallada de equipos del inventario municipal,
// con opciones avanzadas de filtrado y navegación.

"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import type { Equipo, Usuario } from '@/types';
import { useEffect, useState } from 'react';
import { getEquipos, updateEquipo, APP_CONFIG } from '@/services/api';
import { filtrarEquipos } from '@/utils/filtrarEquipos';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';

import Navbar from '../../Diseño/Diseño dashboard/Navbar';
import PanelControl from '../../Diseño/Diseño dashboard/PanelControl';
import Filtros from '../componentes/Filtros';
import { estiloGlobal } from '../../Diseño/Estilos/EstiloGlobal';
import { EstiloComponentesUI } from '../../Diseño/Estilos/EstiloComponentesUI';

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

  // Estados para modal de detalles
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [equipoDetalle, setEquipoDetalle] = useState<Equipo | null>(null);

  // Funciones para manejar acciones
  const handleAgregar = () => {
    router.push('/dashboard?tab=agregar');
  };

  const handleVerDetalles = (equipo: Equipo) => {
    setEquipoDetalle(equipo);
    setShowDetalleModal(true);
  };

  const handleEditar = (equipo: Equipo) => {
    router.push(`/dashboard/editar/${equipo.id}`);
  };

  const handleEliminar = async (equipo: Equipo) => {
    // Verificar si el equipo ya está inactivo
    if (equipo.estado === 'Inactivo') {
      await Swal.fire({
        icon: 'warning',
        title: 'Equipo ya eliminado',
        text: 'Este equipo ya está eliminado',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Verificar datos del equipo
    const nombreEquipo = equipo.nombre_pc || equipo.codigo_inventario || `Equipo ID: ${equipo.id}`;
    
    // Mostrar confirmación con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el dispositivo "${nombreEquipo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const fechaEliminacion = new Date().toISOString();
        
        // Crear objeto con solo los campos necesarios para la actualización
        const equipoActualizado = {
          estado: 'Inactivo' as const,
          fecha_eliminacion: fechaEliminacion,
          // Incluir todos los campos requeridos del equipo
          anydesk: equipo.anydesk,
          caracteristicas_id: equipo.caracteristicas_id,
          codigo_inventario: equipo.codigo_inventario,
          dependencia_id: equipo.dependencia_id,
          direccion_area_id: equipo.direccion_area_id,
          direccion_ip: equipo.direccion_ip,
          direccion_mac: equipo.direccion_mac,
          disco_id: equipo.disco_id,
          dispositivo_id: equipo.dispositivo_id,
          equipamiento_id: equipo.equipamiento_id,
          fecha_registro: equipo.fecha_registro,
          marca_id: equipo.marca_id,
          nombre_pc: equipo.nombre_pc,
          nombres_funcionario: equipo.nombres_funcionario,
          office_id: equipo.office_id,
          ram_id: equipo.ram_id,
          tipo_conexion_id: equipo.tipo_conexion_id,
          tipo_equipo_id: equipo.tipo_equipo_id,
          tipo_sistema_operativo_id: equipo.tipo_sistema_operativo_id,
          usuario_id: equipo.usuario_id,
          programa_adicional_ids: equipo.programa_adicional_ids
        };

        // Usar la función updateEquipo de la API
        await updateEquipo(equipo.id, equipoActualizado);
        
        // Actualizar la lista de equipos en el estado local
        const updatedEquipos = equipos.map(e => 
          e.id === equipo.id 
            ? { ...equipo, estado: 'Inactivo' as const, fecha_eliminacion: fechaEliminacion }
            : e
        );
        setEquipos(updatedEquipos);
        
        // Mostrar mensaje de éxito con SweetAlert2
        await Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: `El equipo "${nombreEquipo}" ha sido eliminado correctamente.`,
          confirmButtonColor: '#28a745',
          timer: 3000,
          timerProgressBar: true
        });
        
      } catch (error: any) {
        console.error('Error al eliminar equipo:', error);
        
        // Mostrar mensaje de error con SweetAlert2
        await Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: `Error al actualizar el equipo: ${error.message || 'Error de conexión con el servidor'}`,
          confirmButtonColor: '#dc3545'
        });
      }
    }
  };

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

    getEquipos(filtrosBackend)
      .then(data => {
        console.log('Equipos cargados:', data);
        setEquipos(data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar equipos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'Verifica que el servidor backend esté funcionando en http://localhost:5000',
          confirmButtonColor: '#dc3545'
        });
        setEquipos([]);
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

  // Debug: Log para verificar datos
  console.log('Equipos totales:', equipos.length);
  console.log('Equipos filtrados:', equiposFiltrados.length);
  console.log('Equipos paginados:', equiposPaginados.length);
  console.log('Datos de ejemplo:', equiposPaginados[0]);

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
            <div>
              <h2 style={{ margin: 0 }}>{TITULOS[tipo] || 'Equipos'}</h2>
              <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>
                {equiposFiltrados.length} equipos encontrados
              </div>
            </div>
            
            <button
              onClick={handleAgregar}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
            >
              <FaPlus size={12} />
              Agregar Equipo
            </button>
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
              <p style={{ margin: 0 }}>
                {equipos.length === 0 
                  ? 'No se pudieron cargar equipos desde el servidor. Verifica la conexión.' 
                  : 'No se encontraron equipos que coincidan con los filtros aplicados.'
                }
              </p>
              {equipos.length === 0 && (
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Recargar página
                </button>
              )}
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
                      <th style={{ ...EstiloComponentesUI.tablas.tableHeader, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Funcionario</th>
                      <th style={{ ...EstiloComponentesUI.tablas.tableHeader, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Código</th>
                      <th style={{ ...EstiloComponentesUI.tablas.tableHeader, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Estado</th>
                      <th style={{ ...EstiloComponentesUI.tablas.tableHeader, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Nombre PC</th>
                      <th style={{ ...EstiloComponentesUI.tablas.tableHeader, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Dirección IP</th>
                      <th style={{ ...EstiloComponentesUI.tablas.tableHeader, textAlign: 'left', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>AnyDesk</th>
                      <th style={{ ...EstiloComponentesUI.tablas.tableHeader, textAlign: 'center', padding: '12px 16px', background: '#2563eb', color: '#fff' }}>Acciones</th>
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
                          <div>
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
                            {equipo.estado === 'Inactivo' && equipo.fecha_eliminacion && (
                              <div style={{ 
                                fontSize: '10px', 
                                color: '#6b7280', 
                                marginTop: '2px',
                                fontStyle: 'italic'
                              }}>
                                Eliminado: {new Date(equipo.fecha_eliminacion).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            )}
                          </div>
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
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleVerDetalles(equipo)}
                              style={{
                                background: '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                              onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                              title="Ver detalles del equipo"
                            >
                              <FaPlus size={10} />
                            </button>
                            
                            <button
                              onClick={() => handleEditar(equipo)}
                              style={{
                                background: '#f59e0b',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#d97706'}
                              onMouseOut={(e) => e.currentTarget.style.background = '#f59e0b'}
                              title="Editar equipo"
                            >
                              <FaEdit size={10} />
                            </button>
                            
                            <button
                              onClick={() => handleEliminar(equipo)}
                              disabled={equipo.estado === 'Inactivo'}
                              style={{
                                background: equipo.estado === 'Inactivo' ? '#9ca3af' : '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                cursor: equipo.estado === 'Inactivo' ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s ease',
                                opacity: equipo.estado === 'Inactivo' ? 0.6 : 1
                              }}
                              onMouseOver={(e) => {
                                if (equipo.estado !== 'Inactivo') {
                                  e.currentTarget.style.background = '#dc2626';
                                }
                              }}
                              onMouseOut={(e) => {
                                if (equipo.estado !== 'Inactivo') {
                                  e.currentTarget.style.background = '#ef4444';
                                }
                              }}
                              title={equipo.estado === 'Inactivo' ? 'Equipo ya inactivo' : 'Marcar como inactivo'}
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
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

        {/* Modal de detalles del equipo */}
        {showDetalleModal && equipoDetalle && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              minWidth: '600px',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              position: 'relative'
            }}>
              {/* Header del modal */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  color: '#1f2937', 
                  fontSize: '20px', 
                  fontWeight: 700 
                }}>
                  <FaEye style={{ marginRight: '8px', color: '#3b82f6' }} />
                  Detalles del Equipo
                </h3>
                <button
                  onClick={() => setShowDetalleModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Contenido del modal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h4 style={{ color: '#374151', marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
                    Información General
                  </h4>
                  <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>Funcionario:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.nombres_funcionario || 'Sin asignar'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>Código de Inventario:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.codigo_inventario || 'Sin código'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>Nombre PC:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.nombre_pc || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#4b5563' }}>Estado:</strong>
                      <span style={{
                        marginLeft: '8px',
                        background: equipoDetalle.estado === 'Activo' ? '#dcfce7' : 
                                  equipoDetalle.estado === 'Mantenimiento' ? '#fef3c7' : '#fecaca',
                        color: equipoDetalle.estado === 'Activo' ? '#166534' : 
                               equipoDetalle.estado === 'Mantenimiento' ? '#92400e' : '#991b1b',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {equipoDetalle.estado}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#374151', marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
                    Conectividad
                  </h4>
                  <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>Dirección IP:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937', fontFamily: 'monospace' }}>
                        {equipoDetalle.direccion_ip || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>Dirección MAC:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937', fontFamily: 'monospace' }}>
                        {equipoDetalle.direccion_mac || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#4b5563' }}>AnyDesk:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.anydesk || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#374151', marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
                    Identificadores de Sistema
                  </h4>
                  <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID Usuario:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.usuario_id || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID Dependencia:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.dependencia_id || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID Tipo Equipo:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.tipo_equipo_id || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#4b5563' }}>ID Marca:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.marca_id || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#374151', marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
                    Especificaciones Técnicas
                  </h4>
                  <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID RAM:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.ram_id || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID Disco:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.disco_id || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID Office:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.office_id || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#4b5563' }}>ID Sistema Operativo:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle.tipo_sistema_operativo_id || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {equipoDetalle.fecha_registro && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>
                    <strong>Fecha de Registro:</strong> {new Date(equipoDetalle.fecha_registro).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {equipoDetalle.fecha_eliminacion && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                      <strong>Fecha de Eliminación:</strong> {new Date(equipoDetalle.fecha_eliminacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Footer del modal */}
              <div style={{ 
                marginTop: '24px', 
                paddingTop: '16px', 
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  onClick={() => {
                    setShowDetalleModal(false);
                    handleEditar(equipoDetalle);
                  }}
                  style={{
                    background: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FaEdit size={12} />
                  Editar
                </button>
                <button
                  onClick={() => setShowDetalleModal(false)}
                  style={{
                    background: '#6b7280',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
