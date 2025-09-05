// Sirve para que el usuario pueda ver, filtrar y navegar
// una lista detallada de equipos del inventario municipal,
// con opciones avanzadas de filtrado y navegación.

"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import type { Equipo, Usuario } from '@/types';
import { useEffect, useState } from 'react';
import { getEquipos, updateEquipo, APP_CONFIG } from '@/services/api';
import { filtrarEquipos } from '@/utils/filtrarEquipos';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaEye, FaUser, FaBarcode, FaCircle, FaDesktop, FaNetworkWired, FaLaptopCode, FaCogs } from 'react-icons/fa';
import Swal from 'sweetalert2';

import Navbar from '../../Diseño/Diseño dashboard/Navbar';
import PanelControl from '../../Diseño/Diseño dashboard/PanelControl';
import Filtros from '../componentes/Filtros';
import TablaEquipos from '../componentes/TablaEquipos';
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
    router.push(`/dashboard/editar_equipo/${equipo.id}`);
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
      title: '¿Estás seguro de eliminar el equipo? ',
      text: `Esta acción eliminará el equipo "${nombreEquipo}" del inventario.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Eliminar',
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
        setEquipos(data || []);
        setLoading(false);
      })
      .catch(error => {
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
        
        {/* Usar el componente TablaEquipos reutilizable */}
        <TablaEquipos
          equipos={equiposPaginados}
          titulo={TITULOS[tipo] || 'Equipos'}
          icono={
            tipo === 'active' ? <FaCircle style={{ color: '#10b981', fontSize: '1.5rem' }} /> :
            tipo === 'maintenance' ? <FaCogs style={{ color: '#f59e0b', fontSize: '1.5rem' }} /> :
            tipo === 'inactive' ? <FaCircle style={{ color: '#ef4444', fontSize: '1.5rem' }} /> :
            <FaDesktop style={{ color: '#3b82f6', fontSize: '1.5rem' }} />
          }
          mostrarSoloRecientes={false}
          mostrarColumnaAnyDesk={true}
          mostrarBotonEliminar={true}
          mostrarBotonAgregar={true}
          onEliminar={handleEliminar}
          maxWidth="100%"
          margin="32px auto"
          containerStyle={{
            padding: '24px'
          }}
        />
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: currentPage === 1 ? '#f9fafb' : '#fff',
                color: currentPage === 1 ? '#9ca3af' : '#374151',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              ← Anterior
            </button>
            
            <span style={{ 
              padding: '10px 20px',
              color: '#374151',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: currentPage === totalPages ? '#f9fafb' : '#fff',
                color: currentPage === totalPages ? '#9ca3af' : '#374151',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Botón de retorno */}
        <div style={{ 
          marginTop: 32, 
          display: 'flex', 
          justifyContent: 'center',
          paddingTop: '24px'
        }}>
          <button 
            onClick={() => router.push('/dashboard')} 
            style={{ 
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 12, 
              padding: '14px 28px', 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
            }}
          >
            ← Volver al Dashboard
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
                        {equipoDetalle?.nombres_funcionario || 'Sin asignar'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>Código de Inventario:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle?.codigo_inventario || 'Sin código'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>Nombre PC:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle?.nombre_pc || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#4b5563' }}>Estado:</strong>
                      <span style={{
                        marginLeft: '8px',
                        background: equipoDetalle?.estado === 'Activo' ? '#dcfce7' : 
                                  equipoDetalle?.estado === 'Mantenimiento' ? '#fef3c7' : '#fecaca',
                        color: equipoDetalle?.estado === 'Activo' ? '#166534' : 
                               equipoDetalle?.estado === 'Mantenimiento' ? '#92400e' : '#991b1b',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {equipoDetalle?.estado}
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
                        {equipoDetalle?.direccion_ip || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>Dirección MAC:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937', fontFamily: 'monospace' }}>
                        {equipoDetalle?.direccion_mac || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#4b5563' }}>AnyDesk:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle?.anydesk || 'N/A'}
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
                        {equipoDetalle?.usuario_id || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID Dependencia:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle?.dependencia_id || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID Tipo Equipo:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle?.tipo_equipo_id || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#4b5563' }}>ID Marca:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle?.marca_id || 'N/A'}
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
                        {equipoDetalle?.ram_id || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID Disco:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle?.disco_id || 'N/A'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#4b5563' }}>ID Office:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle?.office_id || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: '#4b5563' }}>ID Sistema Operativo:</strong>
                      <span style={{ marginLeft: '8px', color: '#1f2937' }}>
                        {equipoDetalle?.tipo_sistema_operativo_id || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {equipoDetalle?.fecha_registro && (
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
                  {equipoDetalle?.fecha_eliminacion && (
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
                    if (equipoDetalle) {
                      handleEditar(equipoDetalle);
                    }
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
