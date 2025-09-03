// Es la página central donde los usuarios gestionan y visualizan el inventario
// de equipos, con todas las funcionalidades principales del dashboard


'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEquipos, logout, getErrorMessage, APP_CONFIG } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import { formatDate } from '@/utils';
import type { Usuario, Equipo } from '@/types';


import Navbar from '../Diseño/Diseño dashboard/Navbar';
import PanelControl from '../Diseño/Diseño dashboard/PanelControl';
import Filtros from './componentes/Filtros';
import TablaEquipos from './componentes/TablaEquipos';
import { useFiltros } from './hooks/useFiltros';
import { estiloGlobal } from '../Diseño/Estilos/EstiloGlobal';
import { estiloBoton } from '../Diseño/Estilos/EstiloBoton';



export default function Dashboard() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const { isLoading, setLoading } = useLoading(true);
  const { error, setError, clearError } = useError();
  const router = useRouter();

  // Hooks personalizados
  const filtros = useFiltros();

  useEffect(() => {
    initializeDashboard();
  }, []);

  // Actualizar equipos al cambiar filtros
  useEffect(() => {
    if (user) {
      filtrarEquipos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtros.dependenciaSeleccionada,
    filtros.direccionSeleccionada,
    filtros.dispositivoSeleccionado,
    filtros.equipamientoSeleccionado,
    filtros.tipoEquipoSeleccionado,
    filtros.tipoSistemaOperativoSeleccionado,
    filtros.marcaSeleccionada,
    filtros.caracteristicaSeleccionada,
    filtros.ramSeleccionada,
    filtros.discoSeleccionado,
    filtros.officeSeleccionado,
    filtros.tipoConexionSeleccionada,
    filtros.programaAdicionalSeleccionado
  ]);

  const filtrarEquipos = async () => {
    setLoading(true);
    clearError();
    try {
      const data = await getEquipos(filtros.getFiltros());
      setEquipos(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
      console.error('Error:', err);
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

  // Si hay filtro de programa adicional, filtrar aquí también (por si el backend no lo hace)
  const equiposFiltradosPrograma = filtros.programaAdicionalSeleccionado && filtros.programaAdicionalSeleccionado.length > 0
    ? equipos.filter(e => filtros.programaAdicionalSeleccionado.every((p: string) => e.programa_adicional_ids?.includes(Number(p))))
    : equipos;

  const getStats = () => ({
    total: equiposFiltradosPrograma.length,
    active: equiposFiltradosPrograma.filter(e => e.estado === 'Activo').length,
    maintenance: equiposFiltradosPrograma.filter(e => e.estado === 'Mantenimiento').length,
    inactive: equiposFiltradosPrograma.filter(e => e.estado === 'Inactivo').length,
  });

  if (error && !user) {
    return (
      <div style={estiloGlobal.errorContainer}>
        <p style={estiloGlobal.errorMessage}>{error}</p>
        <button onClick={() => router.push('/')} style={{...estiloBoton.btn, ...estiloBoton.btnPrimary}}>
          Volver al login
        </button>
      </div>
    );
  }

  const stats = getStats();

  // Handler para mostrar detalles de dispositivos según el tipo de card
  const handlePanelInfo = (type: 'total' | 'active' | 'maintenance' | 'inactive') => {
    router.push(`/dashboard/detalle_estados?tipo=${type}`);
  };

  return (
    <div style={estiloGlobal.dashboard}>
      <Navbar user={user} onLogout={handleLogout} />
      <main style={{...estiloGlobal.dashboardContent, background: '#f4f6fa', minHeight: '100vh', padding: '0 0 48px 0'}}>
        <PanelControl
          total={stats.total}
          active={stats.active}
          maintenance={stats.maintenance}
          inactive={stats.inactive}
          onInfoClick={handlePanelInfo}
          loading={isLoading}
        />
        <Filtros {...filtros} />
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
        />
      </main>
    </div>
  );
}
