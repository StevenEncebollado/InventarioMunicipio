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

  const getStats = () => {
    const active = equipos.filter(e => e.estado === 'Activo').length;
    const maintenance = equipos.filter(e => e.estado === 'Mantenimiento').length;
    const inactive = equipos.filter(e => e.estado === 'Inactivo').length;
    
    return {
      total: active + maintenance, // Total operativo: solo activos + mantenimiento (excluye inactivos)
      active,
      maintenance,
      inactive,
    };
  };

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
        
        // Actualizar el equipo en el backend
        await updateEquipo(equipo.id, {
          ...equipo,
          estado: 'Inactivo' as const,
          fecha_eliminacion: fechaEliminacion,
          codigo_inventario: equipo.codigo_inventario,
          usuario_accion_id: user?.id // Incluir el ID del usuario que realiza la eliminación
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
        <main style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          paddingBottom: 'clamp(80px, 12vh, 120px)',
        }}>
          <div className="dashboard-container" style={{ 
            padding: 'clamp(16px, 3vw, 32px)', 
            maxWidth: '1400px', 
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            width: '100%'
          }}>
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
      </main>
      
      {/* CSS responsivo para el dashboard */}
      <style jsx global>{`
        /* Responsive para móviles */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px !important;
          }
          
          main {
            padding-bottom: 80px !important;
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-container {
            padding: 12px !important;
          }
          
          main {
            padding-bottom: 60px !important;
          }
        }
        
        /* Responsive para tablets */
        @media (min-width: 769px) and (max-width: 1024px) {
          .dashboard-container {
            padding: 24px !important;
          }
        }
        
        /* Pantallas grandes */
        @media (min-width: 1441px) {
          .dashboard-container {
            padding: 40px !important;
            max-width: 1600px !important;
          }
        }
        
        /* Mejoras generales de performance */
        * {
          box-sizing: border-box;
        }
        
        /* Scroll suave */
        html {
          scroll-behavior: smooth;
        }
        
        /* Optimización de imágenes y elementos */
        img, svg {
          display: block;
          max-width: 100%;
          height: auto;
        }
        
        /* Mejoras en accesibilidad */
        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Transiciones globales optimizadas */
        button, 
        input, 
        select, 
        .interactive-element {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
