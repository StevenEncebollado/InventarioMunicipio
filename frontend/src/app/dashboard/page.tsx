// Es la página central donde los usuarios gestionan y visualizan el inventario
// de equipos, con todas las funcionalidades principales del dashboard

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEquipos, logout, getErrorMessage, APP_CONFIG, updateEquipo } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import type { Usuario, Equipo } from '@/types';
import { FaDesktop } from 'react-icons/fa';
import Swal from 'sweetalert2';

import Navbar from '../Diseño/Diseño dashboard/Navbar';
import PanelControl from '../Diseño/Diseño dashboard/PanelControl';
import TablaEquipos from './componentes/TablaEquipos';
import { estiloGlobal } from '../Diseño/Estilos/EstiloGlobal';
import { EstiloComponentesUI } from '../Diseño/Estilos/EstiloComponentesUI';
import { EstiloDashboard } from '../Diseño/Estilos/EstiloDashboard';

export default function Dashboard() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const { isLoading, setLoading } = useLoading(true);
  const { error, setError, clearError } = useError();
  const router = useRouter();

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      const userData = localStorage.getItem(APP_CONFIG.session.storageKey);
      if (!userData) {
        router.push('/');
        return;
      }
      
      const parsedUser: Usuario = JSON.parse(userData);
      setUser(parsedUser);
      await loadEquipos();
    } catch (err) {
      setError('Error al cargar el dashboard');
    }
  };

  const loadEquipos = async () => {
    try {
      setLoading(true);
      clearError();
      const data = await getEquipos();
      setEquipos(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getStats = () => ({
    total: equipos.length,
    active: equipos.filter(e => e.estado === 'Activo').length,
    maintenance: equipos.filter(e => e.estado === 'Mantenimiento').length,
    inactive: equipos.filter(e => e.estado === 'Inactivo').length,
  });

  if (error && !user) {
    return (
      <div style={estiloGlobal.errorContainer}>
        <p style={estiloGlobal.errorMessage}>{error}</p>
        <button onClick={() => router.push('/')} style={{...EstiloComponentesUI.botones.btn, ...EstiloComponentesUI.botones.btnPrimary}}>
          Volver al login
        </button>
      </div>
    );
  }

  const stats = getStats();

  const handlePanelInfo = (type: 'total' | 'active' | 'maintenance' | 'inactive') => {
    router.push(`/dashboard/detalle_estados?tipo=${type}`);
  };

  const handleEliminar = async (equipo: Equipo) => {
    const nombreEquipo = equipo.nombre_pc || equipo.codigo_inventario || `Equipo ID: ${equipo.id}`;
    
    // Mostrar confirmación con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas marcar como inactivo el equipo "${nombreEquipo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, marcar como inactivo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const fechaEliminacion = new Date().toISOString();
        
        // Actualizar el equipo en el backend
        await updateEquipo(equipo.id, {
          ...equipo,
          estado: 'Inactivo' as const,
          fecha_eliminacion: fechaEliminacion,
          codigo_inventario: equipo.codigo_inventario,
        });
        
        // Actualizar la lista de equipos en el estado local
        const updatedEquipos = equipos.map(e => 
          e.id === equipo.id 
            ? { ...equipo, estado: 'Inactivo' as const, fecha_eliminacion: fechaEliminacion }
            : e
        );
        setEquipos(updatedEquipos);
        
        // Mostrar mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: `El equipo "${nombreEquipo}" ha sido marcado como inactivo.`,
          confirmButtonColor: '#28a745',
          timer: 3000,
          timerProgressBar: true
        });
        
      } catch (error: any) {
        // Mostrar mensaje de error
        await Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: `Error al actualizar el equipo: ${error.message || 'Error de conexión con el servidor'}`,
          confirmButtonColor: '#dc3545'
        });
      }
    }
  };

  return (
    <div style={estiloGlobal.dashboard}>
      <Navbar user={user} onLogout={handleLogout} />
      <main style={EstiloDashboard.dashboardContent}>
        {/* Sistema de partículas estables */}
        <div style={EstiloDashboard.efectosVisuales.sistemaParticulas.contenedor}>
          {/* Partículas principales */}
          {EstiloDashboard.efectosVisuales.sistemaParticulas.particulas.map((particula, index) => (
            <div key={`particula-${index}`} style={particula} />
          ))}
          
          {/* Micro partículas brillantes */}
          {EstiloDashboard.efectosVisuales.sistemaParticulas.microParticulas.map((micro, index) => (
            <div key={`micro-${index}`} style={micro} />
          ))}
        </div>
        
        {/* Patrón geométrico estable */}
        <div style={EstiloDashboard.efectosVisuales.patronGeometrico} />
        
        {/* Ondas de energía dinámicas */}
        {EstiloDashboard.efectosVisuales.ondasEnergia.map((onda, index) => (
          <div key={`onda-${index}`} style={onda} />
        ))}
        
        {/* Efectos ambientales */}
        <div style={EstiloDashboard.efectosVisuales.efectosAmbientales.aurora} />
        <div style={EstiloDashboard.efectosVisuales.efectosAmbientales.resplandorCentral} />
        
        {/* Elementos decorativos flotantes */}
        {EstiloDashboard.efectosVisuales.elementosFlotantes.map((elemento, index) => (
          <div key={`flotante-${index}`} style={elemento} />
        ))}
        
        <div style={EstiloDashboard.contenidoRelativo}>
          <PanelControl
            total={stats.total}
            active={stats.active}
            maintenance={stats.maintenance}
            inactive={stats.inactive}
            onInfoClick={handlePanelInfo}
            loading={isLoading}
          />
          {error && (
            <div style={{...estiloGlobal.alert, ...estiloGlobal.alertError}}>
              {error}
              <button 
                onClick={clearError}
                style={estiloGlobal.alertClose}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
          )}
          <TablaEquipos 
            equipos={equipos}
            titulo="Equipos Recientes"
            icono={<FaDesktop style={{ color: '#3b82f6', fontSize: '1.5rem' }} />}
            mostrarSoloRecientes={true}
            mostrarColumnaAnyDesk={true}
            mostrarBotonEliminar={true}
            mostrarBotonAgregar={true}
            onEliminar={handleEliminar}
            maxWidth="100%"
            margin="32px auto"
            containerStyle={{
              padding: '24px',
              maxWidth: '100%',
              overflow: 'visible'
            }}
          />
        </div>
        
        {/* Animaciones CSS */}
        <style>{EstiloDashboard.animacionesCSS}</style>
      </main>
    </div>
  );
}
