'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEquipos, logout, getErrorMessage, APP_CONFIG } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import { formatDate } from '@/utils';
import type { Usuario, Equipo } from '@/types';

export default function Dashboard() {
  // Estilo para los selects de filtros
  const selectStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginTop: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    background: "#f9f9f9",
    transition: "border-color 0.2s"
  };
  const [user, setUser] = useState<Usuario | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const { isLoading, setLoading } = useLoading(true);
  const { error, setError, clearError } = useError();
  const router = useRouter();
  // Catálogo de dependencias (puedes conectar al backend luego)
  // Catálogos base (pueden venir del backend en el futuro)
  // Catálogos base (pueden venir del backend en el futuro)
  const dependenciasCatalogo = ["Edificio Municipal", "Patronato"];
  const direccionesCatalogo = ["Avalúos y Catastros", "Financiero", "Financiero - Rentas", "Deportes"];
  const dispositivosCatalogo = ["CPU", "Monitor", "Teclado", "Mouse"];
  const equipamientosCatalogo = ["Institucional", "Personal"];
  const tipoEquipoCatalogo = ["PC DE ESCRITORIO", "LAPTOP"];
  const tipoSistemaOperativoCatalogo = ["WINDOWS 10 PRO 64 BITS", "WINDOWS 11 PRO", "WINDOWS 11 HOME 64 BITS"];
  const marcasCatalogo = ["CLON", "HP"];
  const ramCatalogo = ["6 GB", "12 GB", "16 GB"];
  const discoCatalogo = ["480 GB", "1 TB", "2 TB"];
  const officeCatalogo = ["2019", "2021", "MS-365"];
  const tipoConexionCatalogo = ["LAN", "WIFI"];

  const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState("");
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState("");
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState("");
  const [tipoEquipoSeleccionado, setTipoEquipoSeleccionado] = useState("");
  const [tipoSistemaOperativoSeleccionado, setTipoSistemaOperativoSeleccionado] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [ramSeleccionada, setRamSeleccionada] = useState("");
  const [discoSeleccionado, setDiscoSeleccionado] = useState("");
  const [officeSeleccionado, setOfficeSeleccionado] = useState("");
  const [tipoConexionSeleccionada, setTipoConexionSeleccionada] = useState("");
  const [showFiltros, setShowFiltros] = useState(false);

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

        {/* Filtros visuales de catálogos */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "32px 0" }}>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            padding: "24px",
            maxWidth: "600px",
            textAlign: "center"
          }}>
            <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>Filtros de Inventario</h3>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: "#3498db",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "12px"
              }}
              onClick={() => setShowFiltros(!showFiltros)}
            >
              {showFiltros ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
            {showFiltros && (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Dependencia</label>
                  <select style={selectStyle} value={dependenciaSeleccionada} onChange={e => setDependenciaSeleccionada(e.target.value)}>
                    <option value="">Todas</option>
                    {dependenciasCatalogo.map(dep => (<option key={dep} value={dep}>{dep}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Dirección/Área</label>
                  <select style={selectStyle} value={direccionSeleccionada} onChange={e => setDireccionSeleccionada(e.target.value)}>
                    <option value="">Todas</option>
                    {direccionesCatalogo.map(dir => (<option key={dir} value={dir}>{dir}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Dispositivo</label>
                  <select style={selectStyle} value={dispositivoSeleccionado} onChange={e => setDispositivoSeleccionado(e.target.value)}>
                    <option value="">Todos</option>
                    {dispositivosCatalogo.map(d => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Equipamiento</label>
                  <select style={selectStyle} value={equipamientoSeleccionado} onChange={e => setEquipamientoSeleccionado(e.target.value)}>
                    <option value="">Todos</option>
                    {equipamientosCatalogo.map(eq => (<option key={eq} value={eq}>{eq}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Tipo de Equipo</label>
                  <select style={selectStyle} value={tipoEquipoSeleccionado} onChange={e => setTipoEquipoSeleccionado(e.target.value)}>
                    <option value="">Todos</option>
                    {tipoEquipoCatalogo.map(te => (<option key={te} value={te}>{te}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Tipo de Sistema Operativo</label>
                  <select style={selectStyle} value={tipoSistemaOperativoSeleccionado} onChange={e => setTipoSistemaOperativoSeleccionado(e.target.value)}>
                    <option value="">Todos</option>
                    {tipoSistemaOperativoCatalogo.map(so => (<option key={so} value={so}>{so}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Marca</label>
                  <select style={selectStyle} value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
                    <option value="">Todas</option>
                    {marcasCatalogo.map(m => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>RAM</label>
                  <select style={selectStyle} value={ramSeleccionada} onChange={e => setRamSeleccionada(e.target.value)}>
                    <option value="">Todas</option>
                    {ramCatalogo.map(r => (<option key={r} value={r}>{r}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Disco</label>
                  <select style={selectStyle} value={discoSeleccionado} onChange={e => setDiscoSeleccionado(e.target.value)}>
                    <option value="">Todos</option>
                    {discoCatalogo.map(d => (<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Office</label>
                  <select style={selectStyle} value={officeSeleccionado} onChange={e => setOfficeSeleccionado(e.target.value)}>
                    <option value="">Todos</option>
                    {officeCatalogo.map(o => (<option key={o} value={o}>{o}</option>))}
                  </select>
                </div>
                <div style={{ minWidth: 220 }}>
                  <label style={{ fontWeight: 600 }}>Tipo de Conexión</label>
                  <select style={selectStyle} value={tipoConexionSeleccionada} onChange={e => setTipoConexionSeleccionada(e.target.value)}>
                    <option value="">Todas</option>
                    {tipoConexionCatalogo.map(tc => (<option key={tc} value={tc}>{tc}</option>))}
                  </select>
                </div>
              </div>
            )}
            {(dependenciaSeleccionada || direccionSeleccionada) && (
              <div style={{ marginTop: "18px", color: "#27ae60", fontWeight: "bold" }}>
                {dependenciaSeleccionada && <span>Dependencia: {dependenciaSeleccionada} </span>}
                {direccionSeleccionada && <span> | Dirección/Área: {direccionSeleccionada}</span>}
              </div>
            )}
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
