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
  const dependenciasCatalogo = [
    "Edificio Municipal",
    "Patronato"
  ];
  const direccionesCatalogo = [
    "Avalúos y Catastros",
    "Financiero",
    "Financiero - Rentas",
    "Deportes"
  ];
  const dispositivosCatalogo = [
    "CPU",
    "Monitor",
    "Teclado",
    "Mouse",
    "Impresora Laser",
    "Impresora Tinta",
    "Impresora Térmica",
    "Impresora Plotter",
    "Tablet",
    "UPS"
  ];
  const equipamientosCatalogo = [
    "Institucional",
    "Personal",
    "Donación"
  ];
  const tipoEquipoCatalogo = [
    "PC DE ESCRITORIO",
    "LAPTOP",
    "TODO EN 1",
    "MAC"
  ];
  const tipoSistemaOperativoCatalogo = [
    "WINDOWS 7 ULTIMATE 32 BITS",
    "WINDOWS 7 ULTIMATE 64 BITS",
    "WINDOWS 8.1",
    "WINDOWS LITE PRO 10",
    "WINDOWS 10 EDUCACION",
    "WINDOWS 10 ENTERPRISE LTSC 64 BITS",
    "WINDOWS 10 HOME 64 BITS",
    "WINDOWS 10 PRO 64 BITS",
    "WINDOWS 11 HOME 64 BITS",
    "WINDOWS 11 PRO"
  ];
  // Eliminar duplicados para evitar keys repetidas
  const caracteristicasCatalogo = Array.from(new Set([
    
    "11th Gen Intel (R) Core (TM) i5-1135G7 2.40 Ghz",
    "11th Gen Intel (R) Core (TM) i5-11400 i5-11400 2.60 Ghz",
    "11th Gen Intel (R) Core (TM) i7-11390 3.40 Ghz",
    "11th GenIntel (R) Core (TM) i3-1115G4 3.00 Ghz",
    "12th Gen Intel (R) Core (TM) i3-1215U 1.20 Ghz",
    "12th Gen Intel (R) Core (TM) i5-12450H 2.00 Ghz",
    "12th Gen Intel (R) Core (TM) i5-12500 3.00 Ghz",
    "13th Gen Intel (R) Core (TM) i5-1335U 1.30 Ghz",
    "AMD E1-2150 APU with Radeon (TM) HD Graphics 1.05 Ghz",
    "AMD FX - 8370 Eigth Core Processor 4.00 Ghz",
    "AMD FX-8370 Eigth Core Processor",
    "AMD FX(tm)-6300 Six-Core Processor 3.50 GHz",
    "AMD FX(tm)-6300 Six-Core Processor3.50 GHz",
    "AMD FX-8320E Eight-Core Processor 3.20 Ghz",
    "AMD FX-8370 Eigth- Core Processor 4.00 Ghz",
    "AMD Ryzen 5 5500U with Radeon Graphics 2.10 GHz",
    "AMD Ryzen 5 5600 H with Radeon Graphics",
    "AMD Ryzen 7 5800H with Radeon Graphics 3.20 Ghz",
    "AMD ryzen 7-5800H with Radeon Graphics 3.20 Ghz",
    "Intel (R) Core (TM) i4440 CPU 3.10 Ghz",
    "Intel (R) Core (TM) i5-1035G1 CPU 1.00 Ghz 1.20 Ghz",
    "Intel (R) Core (TM) i5-10400 CPU 2.90 Ghz",
    "Intel (R) Core (TM) i5-2400 CPU 3.10 Ghz",
    "Intel (R) Core (TM) i5-7400 CPU 3.00 Ghz",
    "Intel (R) Core (TM) i7-2600 CPU 3.40 Ghz",
    "Intel (R) Core (TM) i7-8700 CPU 3.20 Ghz",
    "Intel (R) Core (TM) i7-9700 CPU 3.00 Ghz",
    "Intel (R) Core (TM) i7-9700 CPU 3.20 Ghz",
    "Intel (R) Core (TM) 2 duo CPU E7500 2.93 Ghz",
    "Intel (R) Core (TM) 2 QUAD CPU Q955 2.83 Ghz",
    "Intel (R) Core (TM) i3-10100T CPU 3.00 Ghz",
    "Intel (R) Core (TM) i3-2100 CPU 3.10 Ghz",
    "Intel (R) Core (TM) i3-2100 CPU 3.10 Ghz 3.10 Ghz",
    "Intel (R) Core (TM) i3-3240 CPU 3.40 Ghz",
    "Intel (R) Core (TM) i3-4130 CPU 3.40 Ghz",
    "Intel (R) Core (TM) i3-4160 CPU 3.60 Ghz",
    "Intel (R) Core (TM) i3-4170 CPU 3.70 Ghz",
    "Intel (R) Core (TM) i5 - 8400 CPU 2.80 Ghz",
    "Intel (R) Core (TM) i5 CPU M 480 2.67 Ghz",
    "Intel (R) Core (TM) i5-1021U CPU 1.69 Ghz",
    "Intel (R) Core (TM) i5-3320M CPU 2.60 Ghz",
    "Intel (R) Core (TM) i5-3330 CPU 3.00 Ghz",
    "Intel (R) Core (TM) i5-3470 CPU 3.20 Ghz 3.20 Ghz",
    "Intel (R) Core (TM) i5-4440 CPU 3.10 Ghz",
    "Intel (R) Core (TM) i5-4460 CPU 3.20 Ghz",
    "Intel (R) Core (TM) i5-4570 CPU 3.20 Ghz",
    "Intel (R) Core (TM) i5-4590 CPU 3.30 Ghz",
    "Intel (R) Core (TM) i5-5200U CPU 2.20 Ghz",
    "Intel (R) Core (TM) i5-7200U CPU 2.50 Ghz 2.71 Ghz",
    "Intel (R) Core (TM) i5-8400 CPU 2.80 Ghz",
    "Intel (R) Core (TM) i5-8400 CPU 2.89 Ghz",
    "Intel (R) Core (TM) i5-9400 CPU 2.90 Ghz 2.90 Ghz",
    "Intel (R) Core (TM) i7-1065G7 CPU 1.30 Ghz",
    "Intel (R) Core (TM) i7-10750H CPU 2.60 Ghz",
    "Intel (R) Core (TM) i7-3770 CPU 3.40 Ghz",
    "Intel (R) Core (TM) i7-4770 CPU 3.40 Ghz",
    "Intel (R) Core (TM) i7-6700 CPU 3.40 Ghz",
    "Intel (R) Core (TM) i7-7500 CPU 2.70 Ghz",
    "Intel (R) Core (TM) i7-7700 CPU 3.60 Ghz",
    "Intel (R) Core (TM) i7-8750H CPU 2.20 Ghz",
    "Intel (R) Core (TM)-3470 CPU 3.20 Ghz",
    "Intel (R) Core (TM)-3770 CPU 3.40 Ghz",
    "Intel (R) Pentium (R) CPU G2020 2.90 Ghz",
    "Intel (R) Pentium (R) CPU G3220 3.00 Ghz",
    "Intel (R) Pentium (R) CPU G3220 3.00 Ghz 3.00 Ghz",
    "Intel (R) Pentium (R) CPU G3260 3.30 Ghz",
    "Intel (R) Core ™2 Duo CPU E7500 2.93GHz",
    "Intel(R) Celeron(R) N4000 CPU 1.10GH",
    "Intel(R) Core(TM) i3-3217U CPU 1.20GHz",
    "Intel(R) Core(TM) i3-5100U CPU 1.10 GHz",
    "Intel(R) Core(TM) i7-2600 CPU 3.40GHz",
    "Intel(R) Core(TM) i7-7500U CPU 2.70GHz",
    "Pentium  (R) Dual Core CPU E5300 2.60 Ghz",
    "Pentium  (R) Dual Core CPU E5500 2.80 Ghz"
  ])).sort();
  const marcasCatalogo = Array.from(new Set([
    "ADIKTA",
    "AOC",
    "ARI",
    "ASUS",
    "BENQ",
    "CLON",
    "DELL",
    "GAMER",
    "HP",
    "HP VICTUS",
    "HP/AOC",
    "HURRICANE",
    "INS",
    "LENOVO",
    "LENOVO LEGION",
    "LG",
    "MONITOR MARCA",
    "MSI",
    "NO",
    "QBEX",
    "QBEX/LG",
    "QUASAD",
    "SAMSUNG",
    "SM",
    "TOSHIBA",
    "VANTEC",
    "XTRATECH"
  ]));
  const ramCatalogo = [
    "2 GB",
    "4 GB",
    "6 GB",
    "8 GB",
    "12 GB",
    "16 GB",
    "24 GB",
    "32 GB"
  ];
  const discoCatalogo = Array.from(new Set([
    "100 GB",
    "128 GB",
    "200 GB",
    "240 GB",
    "320 GB",
    "480 GB",
    "500 GB",
    "600 GB",
    "700 GB",
    "800 GB",
    "1 TB",
    "1.5 TB",
    "2 TB",
    "3 TB"
  ]));
  const officeCatalogo = Array.from(new Set([
    "2010",
    "2013",
    "2016",
    "2019",
    "2021",
    "MS-365"
  ]));
  const tipoConexionCatalogo = [
    "LAN",
    "WIFI",
    "USB - WIFI"
  ];
    const programaAdicionalCatalogo = Array.from(new Set([
    "Adobe Acrobat Reade",
    "Adobe Illustrator",
    "Adobe Photoshop",
    "Antivirus cortex",
    "Autocad",
    "Google Chrome",
    "Google Maps",
    "Microsoft Teams",
    "Winrar",
    "Zoom",
    "ZWCAD"
  ]));

  const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState("");
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState("");
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState("");
  const [tipoEquipoSeleccionado, setTipoEquipoSeleccionado] = useState("");
  const [tipoSistemaOperativoSeleccionado, setTipoSistemaOperativoSeleccionado] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [caracteristicaSeleccionada, setCaracteristicaSeleccionada] = useState("");
  const [ramSeleccionada, setRamSeleccionada] = useState("");
  const [discoSeleccionado, setDiscoSeleccionado] = useState("");
  const [officeSeleccionado, setOfficeSeleccionado] = useState("");
  const [tipoConexionSeleccionada, setTipoConexionSeleccionada] = useState("");
  const [programaAdicionalSeleccionado, setProgramaAdicionalSeleccionado] = useState<string[]>([]);
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
      <nav className="navbar" style={{background: 'linear-gradient(90deg, #3498db 0%, #2ecc71 100%)', color: '#fff', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div className="nav-brand">
          <h1 style={{fontWeight: 800, fontSize: '2.2rem', letterSpacing: '1px'}}>Inventario Municipio</h1>
        </div>
        <div className="nav-user">
          {user && (
            <>
              <span style={{fontWeight: 600, fontSize: '1.1rem'}}>Bienvenido, <strong>{user.username}</strong></span>
              <span style={{marginLeft: 8, fontStyle: 'italic', fontSize: '1rem'}}>({user.rol})</span>
              <button 
                onClick={handleLogout} 
                style={{marginLeft: 18, padding: '8px 18px', borderRadius: '6px', background: '#e74c3c', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer'}}
                type="button"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </nav>
      <main className="dashboard-content" style={{background: '#f4f6fa', minHeight: '100vh', padding: '0 0 48px 0'}}>
        <div className="dashboard-header" style={{maxWidth: 1200, margin: '0 auto', padding: '32px 0'}}>
          <h2 style={{fontWeight: 700, fontSize: '2rem', color: '#222'}}>Panel de Control</h2>
          <div className="stats-grid" style={{display: 'flex', gap: '32px', margin: '32px 0'}}>
            <div className="stat-card" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', flex: 1, textAlign: 'center'}}>
              <h3 style={{color: '#2980b9'}}>Total</h3>
              <span style={{fontWeight: 700, fontSize: '2.2rem'}}>{stats.total}</span>
            </div>
            <div className="stat-card" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', flex: 1, textAlign: 'center'}}>
              <h3 style={{color: '#27ae60'}}>Activos</h3>
              <span style={{fontWeight: 700, fontSize: '2.2rem', color: '#27ae60'}}>{stats.active}</span>
            </div>
            <div className="stat-card" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', flex: 1, textAlign: 'center'}}>
              <h3 style={{color: '#f1c40f'}}>Mantenimiento</h3>
              <span style={{fontWeight: 700, fontSize: '2.2rem', color: '#f1c40f'}}>{stats.maintenance}</span>
            </div>
            <div className="stat-card" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', flex: 1, textAlign: 'center'}}>
              <h3 style={{color: '#e74c3c'}}>Inactivos</h3>
              <span style={{fontWeight: 700, fontSize: '2.2rem', color: '#e74c3c'}}>{stats.inactive}</span>
            </div>
          </div>
        </div>
        {/* Filtros visuales de catálogos - rediseño moderno */}
        <section style={{maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(44,62,80,0.08)', padding: '40px 32px', marginBottom: '32px'}}>
          <h3 style={{fontWeight: 700, fontSize: '1.5rem', color: '#2980b9', marginBottom: '24px'}}>Filtros de Inventario</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px'}}>
            <div>
              <label style={{ fontWeight: 600 }}>Dependencia</label>
              <select style={selectStyle} value={dependenciaSeleccionada} onChange={e => setDependenciaSeleccionada(e.target.value)}>
                <option value="">Todas</option>
                {dependenciasCatalogo.map(dep => (<option key={dep} value={dep}>{dep}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Dirección/Área</label>
              <select style={selectStyle} value={direccionSeleccionada} onChange={e => setDireccionSeleccionada(e.target.value)}>
                <option value="">Todas</option>
                {direccionesCatalogo.map(dir => (<option key={dir} value={dir}>{dir}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Dispositivo</label>
              <select style={selectStyle} value={dispositivoSeleccionado} onChange={e => setDispositivoSeleccionado(e.target.value)}>
                <option value="">Todos</option>
                {dispositivosCatalogo.map(d => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Equipamiento</label>
              <select style={selectStyle} value={equipamientoSeleccionado} onChange={e => setEquipamientoSeleccionado(e.target.value)}>
                <option value="">Todos</option>
                {equipamientosCatalogo.map(eq => (<option key={eq} value={eq}>{eq}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Tipo de Equipo</label>
              <select style={selectStyle} value={tipoEquipoSeleccionado} onChange={e => setTipoEquipoSeleccionado(e.target.value)}>
                <option value="">Todos</option>
                {tipoEquipoCatalogo.map(te => (<option key={te} value={te}>{te}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Tipo de Sistema Operativo</label>
              <select style={selectStyle} value={tipoSistemaOperativoSeleccionado} onChange={e => setTipoSistemaOperativoSeleccionado(e.target.value)}>
                <option value="">Todos</option>
                {tipoSistemaOperativoCatalogo.map(so => (<option key={so} value={so}>{so}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Características</label>
              <select style={selectStyle} value={caracteristicaSeleccionada} onChange={e => setCaracteristicaSeleccionada(e.target.value)}>
                <option value="">Todas</option>
                {caracteristicasCatalogo.map(c => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Marca</label>
              <select style={selectStyle} value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)}>
                <option value="">Todas</option>
                {marcasCatalogo.map(m => (<option key={m} value={m}>{m}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>RAM</label>
              <select style={selectStyle} value={ramSeleccionada} onChange={e => setRamSeleccionada(e.target.value)}>
                <option value="">Todas</option>
                {ramCatalogo.map(r => (<option key={r} value={r}>{r}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Disco</label>
              <select style={selectStyle} value={discoSeleccionado} onChange={e => setDiscoSeleccionado(e.target.value)}>
                <option value="">Todos</option>
                {discoCatalogo.map(d => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Office</label>
              <select style={selectStyle} value={officeSeleccionado} onChange={e => setOfficeSeleccionado(e.target.value)}>
                <option value="">Todos</option>
                {officeCatalogo.map(o => (<option key={o} value={o}>{o}</option>))}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Programa Adicional</label>
              <div style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: '#f9f9f9',
                padding: '10px',
                minHeight: '48px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '16px',
                marginTop: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                {programaAdicionalCatalogo.map(pa => (
                  <label key={pa} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 400 }}>
                    <input
                      type="checkbox"
                      value={pa}
                      checked={programaAdicionalSeleccionado.includes(pa)}
                      onChange={e => {
                        if (e.target.checked) {
                          setProgramaAdicionalSeleccionado([...programaAdicionalSeleccionado, pa]);
                        } else {
                          setProgramaAdicionalSeleccionado(programaAdicionalSeleccionado.filter(item => item !== pa));
                        }
                      }}
                      style={{ accentColor: '#2980b9', width: 18, height: 18 }}
                    />
                    {pa}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Tipo de Conexión</label>
              <select style={selectStyle} value={tipoConexionSeleccionada} onChange={e => setTipoConexionSeleccionada(e.target.value)}>
                <option value="">Todas</option>
                {tipoConexionCatalogo.map(tc => (<option key={tc} value={tc}>{tc}</option>))}
              </select>
            </div>
          </div>
        </section>
        
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
