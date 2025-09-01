'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEquipos, logout, getErrorMessage, APP_CONFIG } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import { formatDate } from '@/utils';
import type { Usuario, Equipo } from '@/types';

// Componentes modulares
import Navbar from './components/Navbar';
import PanelControl from './components/PanelControl';
import Estadisticas from './components/Estadisticas';
import Filtros from './components/Filtros';
import TablaEquipos from './components/TablaEquipos';
import AgregarEquipoForm from './components/AgregarEquipoForm';

// Hooks personalizados
import { useFiltros } from './hooks/useFiltros';
import { useAgregarEquipo } from './hooks/useAgregarEquipo';

export default function Dashboard() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [showAddEquipo, setShowAddEquipo] = useState(false);
  const { isLoading, setLoading } = useLoading(true);
  const { error, setError, clearError } = useError();
  const router = useRouter();

  // Hooks personalizados
  const filtros = useFiltros();
  const agregarEquipo = useAgregarEquipo();

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

  const getStats = () => ({
    total: equipos.length,
    active: equipos.filter(e => e.estado === 'Activo').length,
    maintenance: equipos.filter(e => e.estado === 'Mantenimiento').length,
    inactive: equipos.filter(e => e.estado === 'Inactivo').length,
  });

  const handleSubmitEquipo = async (e: React.FormEvent) => {
    e.preventDefault();
    agregarEquipo.setAddError("");
    agregarEquipo.setAddLoading(true);
    
    if (!agregarEquipo.validarCampos()) {
      agregarEquipo.setAddLoading(false);
      return;
    }
    
    try {
      await fetch('http://localhost:8081/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agregarEquipo.getFormData())
      });
      
      setShowAddEquipo(false);
      agregarEquipo.limpiarCampos();
      
      // Refrescar lista
      const data = await getEquipos();
      setEquipos(data);
    } catch (err: any) {
      agregarEquipo.setAddError("Error al crear equipo");
    } finally {
      agregarEquipo.setAddLoading(false);
    }
  };

  if (error && !user) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => router.push('/')} className="btn btn-primary">
          Volver al login
        </button>
      </div>
    );
  }

  const stats = getStats();

  // Handler para mostrar detalles de dispositivos según el tipo de card
  const handlePanelInfo = (type: 'total' | 'active' | 'maintenance' | 'inactive') => {
    router.push(`/dashboard/equipos-lista?tipo=${type}`);
  };

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="dashboard-content" style={{background: '#f4f6fa', minHeight: '100vh', padding: '0 0 48px 0'}}>
        <PanelControl
          total={stats.total}
          active={stats.active}
          maintenance={stats.maintenance}
          inactive={stats.inactive}
          onInfoClick={handlePanelInfo}
        />

        {/* Puedes dejar Estadisticas si quieres ambas vistas, o eliminarla si solo usarás PanelControl */}
        {/* <Estadisticas 
          total={stats.total}
          active={stats.active}
          maintenance={stats.maintenance}
          inactive={stats.inactive}
        /> */}

        <Filtros {...filtros} />
        
        {error && (
          <div className="alert alert-error">
            {error}
            <button 
              onClick={clearError}
              className="alert-close"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        )}
        

        <TablaEquipos 
          equipos={equipos}
          onAgregarClick={() => setShowAddEquipo(true)}
        />



        <AgregarEquipoForm
          showAddEquipo={showAddEquipo}
          setShowAddEquipo={setShowAddEquipo}
          onSubmit={handleSubmitEquipo}
          {...agregarEquipo}
        />
      </main>
    </div>
  );
}
