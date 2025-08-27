'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEquipos, logout, getErrorMessage, APP_CONFIG } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import { formatDate } from '@/utils';
import type { Usuario, Equipo } from '@/types';

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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner">Cargando...</div>
      </div>
    );
  }

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

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>Inventario Municipio</h1>
        </div>
        
        <div className="nav-user">
          {user && (
            <>
              <span className="welcome-text">
                Bienvenido, <strong>{user.username}</strong>
              </span>
              <span className="user-role">({user.rol})</span>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary logout-btn"
                type="button"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </nav>
      
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h2>Panel de Control</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total</h3>
              <span className="stat-number">{stats.total}</span>
            </div>
            <div className="stat-card">
              <h3>Activos</h3>
              <span className="stat-number stat-success">{stats.active}</span>
            </div>
            <div className="stat-card">
              <h3>Mantenimiento</h3>
              <span className="stat-number stat-warning">{stats.maintenance}</span>
            </div>
            <div className="stat-card">
              <h3>Inactivos</h3>
              <span className="stat-number stat-danger">{stats.inactive}</span>
            </div>
          </div>
        </div>
        
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
        
        <section className="equipos-section">
          <div className="section-header">
            <h3>Equipos Recientes</h3>
            <button className="btn btn-primary">+ Agregar Equipo</button>
          </div>
          
          {equipos.length > 0 ? (
            <div className="table-container">
              <table className="equipos-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Serie</th>
                    <th>Tipo</th>
                    <th>Marca</th>
                    <th>Estado</th>
                    <th>Dependencia</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {equipos.slice(0, 10).map((equipo) => (
                    <tr key={equipo.id}>
                      <td>{equipo.id}</td>
                      <td>
                        <code className="serial-code">{equipo.numero_serie}</code>
                      </td>
                      <td>{equipo.tipo_equipo}</td>
                      <td>{equipo.marca}</td>
                      <td>
                        <span className={`status-badge status-${equipo.estado.toLowerCase()}`}>
                          {equipo.estado}
                        </span>
                      </td>
                      <td>{equipo.dependencia}</td>
                      <td>
                        {equipo.fecha_adquisicion ? formatDate(equipo.fecha_adquisicion) : '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-outline" title="Ver">Ver</button>
                          <button className="btn btn-sm btn-outline" title="Editar">Editar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay equipos registrados.</p>
              <button className="btn btn-primary">Agregar primer equipo</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
