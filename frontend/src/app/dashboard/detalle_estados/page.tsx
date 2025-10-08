// Sirve para que el usuario pueda ver, filtrar y navegar
// una lista detallada de equipos del inventario municipal,
// con opciones avanzadas de filtrado y navegación.

"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import type { Equipo, Usuario } from '@/types';
import { useEffect, useState } from 'react';
import { getEquipos, updateEquipo, APP_CONFIG } from '@/services/api';
import { filtrarEquipos } from '@/utils/filtrarEquipos';
import { formatearFechaConHora } from '@/utils/dateUtils';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaEye, FaUser, FaBarcode, FaCircle, FaDesktop, FaNetworkWired, FaLaptopCode, FaCogs } from 'react-icons/fa';
import Swal from 'sweetalert2';

import Navbar from '../../Diseño/Diseño dashboard/Navbar';
import PanelControl from '../../Diseño/Diseño dashboard/PanelControl';
import Filtros from '../componentes/Filtros';
import TablaEquipos from '../componentes/TablaEquipos';
import { estiloGlobal } from '../../Diseño/Estilos/EstiloGlobal';
import { EstiloComponentesUI } from '../../Diseño/Estilos/EstiloComponentesUI';

const TITULOS: Record<string, string> = {
  total: 'Equipos Operativos (Activos + Mantenimiento)',
  active: 'Equipos Activos',
  maintenance: 'Equipos en Mantenimiento',
  inactive: 'Equipos Inactivos',
};

export default function EquiposLista() {
  const router = useRouter();
  const params = useSearchParams();
  const tipo = params.get('tipo') || 'total';
  const searchTerm = params.get('search') || '';
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
    // Construir URL con parámetros para indicar origen
    let url = `/dashboard/editar_equipo/${equipo.id}?from=detalle_estados&tipo=${tipo}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    router.push(url);
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
          usuario_accion_id: user?.id, // Incluir el ID del usuario que realiza la eliminación
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

  // Función para normalizar y buscar en equipos
  const buscarEnEquipos = (equipos: Equipo[], termino: string): Equipo[] => {
    if (!termino.trim()) return equipos;
    
    const terminoNormalizado = termino.toLowerCase().trim();
    
    // Función para normalizar IP (remover ceros a la izquierda)
    const normalizarIP = (ip: string): string => {
      if (!ip) return '';
      try {
        return ip.split('.').map(part => parseInt(part, 10).toString()).join('.');
      } catch {
        return ip;
      }
    };
    
    // Función para normalizar MAC (formato canónico)
    const normalizarMAC = (mac: string): string => {
      if (!mac) return '';
      return mac.replace(/[:-]/g, '').toLowerCase();
    };
    
    // Detectar si es IP o MAC
    const esIP = /^\d{1,3}\.?\d{0,3}\.?\d{0,3}\.?\d{0,3}$/.test(terminoNormalizado);
    const esMAC = /^[a-f0-9]{2}[:-]?[a-f0-9]{2}[:-]?[a-f0-9]{2}[:-]?[a-f0-9]{2}[:-]?[a-f0-9]{2}[:-]?[a-f0-9]{2}$/i.test(terminoNormalizado);
    
    return equipos.filter(equipo => {
      // Búsqueda por IP (prioridad si detecta patrón de IP)
      if (esIP && equipo.direccion_ip) {
        const ipNormalizada = normalizarIP(equipo.direccion_ip);
        const terminoIPNormalizado = normalizarIP(terminoNormalizado);
        if (ipNormalizada.includes(terminoIPNormalizado)) return true;
      }
      
      // Búsqueda por MAC (prioridad si detecta patrón de MAC)
      if (esMAC && equipo.direccion_mac) {
        const macNormalizada = normalizarMAC(equipo.direccion_mac);
        const terminoMACNormalizado = normalizarMAC(terminoNormalizado);
        if (macNormalizada.includes(terminoMACNormalizado)) return true;
      }
      
      // Búsqueda de texto general (campos de texto disponibles)
      const campos = [
        equipo.nombre_pc,
        equipo.nombres_funcionario,
        equipo.codigo_inventario,
        equipo.anydesk,
        equipo.direccion_ip,
        equipo.direccion_mac
      ].filter(Boolean).map(campo => (campo as string).toLowerCase());
      
      return campos.some(campo => campo.includes(terminoNormalizado));
    });
  };


  // Unificar todos los filtros en un objeto, pero si no hay filtros avanzados, solo filtra por tipo
  let estadoFiltro: '' | 'Activo' | 'Mantenimiento' | 'Inactivo' | undefined = '';
  if (tipo === 'active') estadoFiltro = 'Activo';
  else if (tipo === 'maintenance') estadoFiltro = 'Mantenimiento';
  else if (tipo === 'inactive') estadoFiltro = 'Inactivo';
  // Para 'total' no asignamos estadoFiltro específico, se manejará después

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

  // Aplicar filtros según el tipo y filtros avanzados
  let equiposFiltrados: Equipo[];
  
  if (tipo === 'total') {
    // Para "total", mostrar solo activos + mantenimiento (total operativo)
    if (hayFiltrosAvanzados) {
      // Aplicar filtros avanzados y luego filtrar para excluir inactivos
      const equiposConFiltrosAvanzados = filtrarEquipos(equipos, filtros);
      equiposFiltrados = equiposConFiltrosAvanzados.filter(e => e.estado === 'Activo' || e.estado === 'Mantenimiento');
    } else {
      // Solo mostrar activos + mantenimiento
      equiposFiltrados = equipos.filter(e => e.estado === 'Activo' || e.estado === 'Mantenimiento');
    }
  } else {
    // Para otros tipos (active, maintenance, inactive), usar la lógica original
    equiposFiltrados = hayFiltrosAvanzados
      ? filtrarEquipos(equipos, filtros)
      : filtrarEquipos(equipos, { estado: estadoFiltro });
  }

  // Aplicar búsqueda global después del filtrado por estado/filtros
  const equiposConBusqueda = searchTerm 
    ? buscarEnEquipos(equiposFiltrados, searchTerm)
    : equiposFiltrados;

  // Estadísticas para PanelControl
  const activeCount = filtrarEquipos(equipos, { ...filtros, estado: 'Activo' }).length;
  const maintenanceCount = filtrarEquipos(equipos, { ...filtros, estado: 'Mantenimiento' }).length;
  const inactiveCount = filtrarEquipos(equipos, { ...filtros, estado: 'Inactivo' }).length;
  
  const stats = {
    total: activeCount + maintenanceCount, // Total operativo: activos + mantenimiento (excluye inactivos)
    active: activeCount,
    maintenance: maintenanceCount,
    inactive: inactiveCount,
  };

  // Calcular datos de paginación
  const totalPages = Math.ceil(equiposConBusqueda.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const equiposPaginados = equiposConBusqueda.slice(startIndex, endIndex);

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
    <div className="detalle-estados-container" style={estiloGlobal.dashboard}>
      <Navbar user={user} onLogout={handleLogout} />
      <main style={{
        ...estiloGlobal.dashboardContent, 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        minHeight: '100vh', 
        padding: 'clamp(16px, 3vw, 32px) 0 clamp(60px, 10vh, 100px) 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 32px)',
          width: '100%'
        }}>
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
        
        {/* Indicador de búsqueda activa con botón para limpiar */}
        {searchTerm && (
          <div style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #3b82f6',
            borderRadius: '12px',
            padding: '16px 20px',
            margin: '16px auto 24px auto',
            maxWidth: '1400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: '1',
              minWidth: '0'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#1e40af'
              }}>🔍</span>
              <div>
                <p style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#1e40af'
                }}>
                  Búsqueda activa: "{searchTerm}"
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: '#3730a3',
                  opacity: 0.8
                }}>
                  {equiposConBusqueda.length} resultado{equiposConBusqueda.length !== 1 ? 's' : ''} encontrado{equiposConBusqueda.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                // Limpiar búsqueda manteniendo otros parámetros
                const newParams = new URLSearchParams(window.location.search);
                newParams.delete('search');
                router.push(`/dashboard/detalle_estados?${newParams.toString()}`);
              }}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'scale(1.05)';
                target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={e => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'scale(1)';
                target.style.boxShadow = 'none';
              }}
            >
              ✕ Limpiar búsqueda
            </button>
          </div>
        )}
        
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
          titulo={
            searchTerm 
              ? `${TITULOS[tipo] || 'Equipos'} - Búsqueda: "${searchTerm}" (${equiposConBusqueda.length} resultado${equiposConBusqueda.length !== 1 ? 's' : ''})`
              : TITULOS[tipo] || 'Equipos'
          }
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
        
        {/* Nota informativa para el total operativo */}
        {tipo === 'total' && !searchTerm && (
          <div style={{
            background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
            border: '1px solid #0277bd',
            borderRadius: '12px',
            padding: '16px 20px',
            margin: '16px auto 0 auto',
            maxWidth: '1400px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '18px', color: '#0277bd' }}>ℹ️</span>
            <p style={{
              margin: 0,
              fontSize: '0.95rem',
              color: '#0277bd',
              fontWeight: 500
            }}>
              <strong>Nota:</strong> El total operativo incluye únicamente equipos activos y en mantenimiento. 
              Los equipos inactivos se muestran por separado para facilitar la gestión del inventario.
            </p>
          </div>
        )}
        
        {/* Paginación modernizada */}
        {totalPages > 1 && (
          <div className="pagination-container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 'clamp(8px, 2vw, 12px)',
            marginTop: '24px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            padding: 'clamp(16px, 3vw, 24px)',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.05)',
            border: '1px solid rgba(226,232,240,0.8)',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 20px)',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                background: currentPage === 1 
                  ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' 
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                color: currentPage === 1 ? '#9ca3af' : '#1e293b',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.025em',
                opacity: currentPage === 1 ? 0.6 : 1,
              }}
              onMouseEnter={e => {
                if (currentPage !== 1) {
                  const target = e.target as HTMLButtonElement;
                  target.style.borderColor = '#3b82f6';
                  target.style.transform = 'translateY(-1px)';
                  target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                }
              }}
              onMouseLeave={e => {
                if (currentPage !== 1) {
                  const target = e.target as HTMLButtonElement;
                  target.style.borderColor = '#e2e8f0';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }
              }}
            >
              ← <span className="pagination-text">Anterior</span>
            </button>
            
            <div className="page-info" style={{ 
              padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 24px)',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              color: '#1e40af',
              fontWeight: 700,
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              textAlign: 'center',
              minWidth: 'fit-content',
              letterSpacing: '0.025em',
            }}>
              <span className="page-full">Página {currentPage} de {totalPages}</span>
              <span className="page-short" style={{ display: 'none' }}>{currentPage}/{totalPages}</span>
            </div>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 20px)',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                background: currentPage === totalPages 
                  ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' 
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                color: currentPage === totalPages ? '#9ca3af' : '#1e293b',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.025em',
                opacity: currentPage === totalPages ? 0.6 : 1,
              }}
              onMouseEnter={e => {
                if (currentPage !== totalPages) {
                  const target = e.target as HTMLButtonElement;
                  target.style.borderColor = '#3b82f6';
                  target.style.transform = 'translateY(-1px)';
                  target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                }
              }}
              onMouseLeave={e => {
                if (currentPage !== totalPages) {
                  const target = e.target as HTMLButtonElement;
                  target.style.borderColor = '#e2e8f0';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }
              }}
            >
              <span className="pagination-text">Siguiente</span> →
            </button>
          </div>
        )}

        {/* Botón de retorno modernizado */}
        <div style={{ 
          marginTop: 'clamp(24px, 4vw, 40px)', 
          display: 'flex', 
          justifyContent: 'center',
          paddingTop: 'clamp(16px, 3vw, 24px)'
        }}>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="return-button"
            style={{ 
              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', 
              color: '#fff', 
              border: '2px solid transparent',
              borderRadius: 16, 
              padding: 'clamp(12px, 2.5vw, 16px) clamp(20px, 4vw, 32px)', 
              fontWeight: 700, 
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              letterSpacing: '0.025em',
              boxShadow: '0 8px 25px rgba(100, 116, 139, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 2vw, 12px)',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-3px)';
              target.style.boxShadow = '0 12px 35px rgba(100, 116, 139, 0.4)';
              target.style.background = 'linear-gradient(135deg, #475569 0%, #334155 100%)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 8px 25px rgba(100, 116, 139, 0.3)';
              target.style.background = 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
            }}
          >
            <span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>←</span>
            <span>Volver al Dashboard</span>
          </button>
        </div>
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


              {/* Estado y fechas del equipo */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <div style={{
                  flex: 1,
                  background: equipoDetalle?.fecha_eliminacion ? '#fecaca' : '#dcfce7',
                  borderRadius: '12px',
                  padding: '20px',
                  border: equipoDetalle?.fecha_eliminacion ? '1px solid #fca5a5' : '1px solid #bbf7d0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <h3 style={{
                    color: equipoDetalle?.fecha_eliminacion ? '#991b1b' : '#166534',
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 600
                  }}>
                    {equipoDetalle?.fecha_eliminacion ? 'Fecha de Eliminación' : 'Fecha de Registro'}
                  </h3>
                  <p style={{
                    color: equipoDetalle?.fecha_eliminacion ? '#991b1b' : '#166534',
                    fontSize: '16px',
                    fontWeight: 500,
                    margin: 0
                  }}>
                    {equipoDetalle?.fecha_eliminacion
                      ? formatearFechaConHora(equipoDetalle.fecha_eliminacion)
                      : formatearFechaConHora(equipoDetalle?.fecha_registro ?? '')}
                  </p>
                </div>
                <div style={{
                  flex: 1,
                  background: equipoDetalle?.fecha_eliminacion ? '#f3f4f6' : '#e0f2fe',
                  borderRadius: '12px',
                  padding: '20px',
                  border: equipoDetalle?.fecha_eliminacion ? '1px solid #d1d5db' : '1px solid #bae6fd',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <h3 style={{
                    color: equipoDetalle?.fecha_eliminacion ? '#374151' : '#0891b2',
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 600
                  }}>
                    Estado del Equipo
                  </h3>
                  <p style={{
                    color: equipoDetalle?.fecha_eliminacion ? '#991b1b' : '#0891b2',
                    fontSize: '16px',
                    fontWeight: 500,
                    margin: 0
                  }}>
                    {equipoDetalle?.fecha_eliminacion ? 'Equipo inactivo en inventario' : 'Equipo activo en inventario'}
                  </p>
                </div>
              </div>

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
      
      {/* CSS responsivo para detalle de estados */}
      <style jsx global>{`
        /* Responsive para móviles */
        @media (max-width: 768px) {
          .pagination-container {
            flex-direction: column !important;
            gap: 16px !important;
            padding: 20px !important;
          }
          
          .pagination-text {
            display: none !important;
          }
          
          .page-full {
            display: none !important;
          }
          
          .page-short {
            display: inline !important;
          }
          
          .detalle-estados-container main {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .pagination-container {
            padding: 16px !important;
            border-radius: 12px !important;
          }
          
          .pagination-container button {
            padding: 10px 14px !important;
            font-size: 0.8rem !important;
          }
          
          .page-info {
            padding: 10px 16px !important;
            font-size: 0.8rem !important;
          }
          
          .return-button {
            padding: 12px 20px !important;
            font-size: 0.85rem !important;
            border-radius: 12px !important;
          }
        }
        
        /* Tablets */
        @media (min-width: 769px) and (max-width: 1024px) {
          .pagination-container {
            padding: 20px !important;
          }
        }
        
        /* Pantallas grandes */
        @media (min-width: 1441px) {
          .pagination-container {
            padding: 28px !important;
            gap: 16px !important;
          }
          
          .return-button {
            padding: 18px 36px !important;
            font-size: 1.1rem !important;
          }
        }
        
        /* Mejoras en accesibilidad */
        .pagination-container button:focus-visible,
        .return-button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Animaciones suaves */
        .pagination-container button,
        .return-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Estados disabled mejorados */
        .pagination-container button:disabled {
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
        
        .pagination-container button:disabled:hover {
          border-color: #e2e8f0 !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
