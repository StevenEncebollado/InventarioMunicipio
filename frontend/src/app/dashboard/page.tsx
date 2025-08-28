'use client';
import { useState, useEffect } from 'react';
// Modal simple reutilizable
function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 0, minWidth: 350, maxWidth: 500, maxHeight: '90vh', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', zIndex: 2 }}>&times;</button>
        <div style={{ padding: 32, overflowY: 'auto', maxHeight: '90vh', minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
import { useRouter } from 'next/navigation';
import { getEquipos, logout, getErrorMessage, APP_CONFIG, createEquipo } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import { formatDate } from '@/utils';
import type { Usuario, Equipo } from '@/types';

export default function Dashboard() {
  // Modal para agregar equipo
  const [showAddEquipo, setShowAddEquipo] = useState(false);
  // Campos de texto
  const [ip, setIp] = useState("");
  const [mac, setMac] = useState("");
  const [nombrePc, setNombrePc] = useState("");
  const [funcionario, setFuncionario] = useState("");
  const [anydesk, setAnydesk] = useState("");
  // Campos select
  const [tipoEquipo, setTipoEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [ram, setRam] = useState("");
  const [disco, setDisco] = useState("");
  const [office, setOffice] = useState("");
  const [tipoConexion, setTipoConexion] = useState("");
  const [programaAdicional, setProgramaAdicional] = useState<string[]>([]);
  const [dependencia, setDependencia] = useState("");
  const [direccion, setDireccion] = useState("");
  const [equipamiento, setEquipamiento] = useState("");
  const [caracteristica, setCaracteristica] = useState("");
  const [sistemaOperativo, setSistemaOperativo] = useState("");
  // Validación y loading
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
 
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

  // Actualizar equipos al cambiar filtros
  useEffect(() => {
    if (user) {
      filtrarEquipos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
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
    programaAdicionalSeleccionado
  ]);

  const filtrarEquipos = async () => {
    setLoading(true);
    clearError();
    try {
      const filtros = {
        dependencia: dependenciaSeleccionada || undefined,
        direccion: direccionSeleccionada || undefined,
        dispositivo: dispositivoSeleccionado || undefined,
        equipamiento: equipamientoSeleccionado || undefined,
        tipo_equipo: tipoEquipoSeleccionado || undefined,
        tipo_sistema_operativo: tipoSistemaOperativoSeleccionado || undefined,
        marca: marcaSeleccionada || undefined,
        caracteristica: caracteristicaSeleccionada || undefined,
        ram: ramSeleccionada || undefined,
        disco: discoSeleccionado || undefined,
        office: officeSeleccionado || undefined,
        tipo_conexion: tipoConexionSeleccionada || undefined,
        programa_adicional: programaAdicionalSeleccionado.length > 0 ? programaAdicionalSeleccionado.join(',') : undefined
      };
      const data = await getEquipos(filtros);
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
            <button className="btn btn-primary" onClick={() => setShowAddEquipo(true)}>+ Agregar Equipo</button>
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
                        <span className={`status-badge status-${equipo.estado ? equipo.estado.toLowerCase() : 'desconocido'}`}>
                          {equipo.estado || 'Desconocido'}
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
              <button className="btn btn-primary" onClick={() => setShowAddEquipo(true)}>Agregar primer equipo</button>
            </div>
          )}
      {/* Modal para agregar equipo */}
      {showAddEquipo && (
        <Modal open={showAddEquipo} onClose={() => setShowAddEquipo(false)}>
          <h2 style={{ marginBottom: 16 }}>Agregar Nuevo Equipo</h2>
          {addError && <div style={{ color: 'red', marginBottom: 8 }}>{addError}</div>}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setAddError("");
              setAddLoading(true);
              if (!ip || !mac || !nombrePc || !funcionario || !anydesk || !tipoEquipo || !marca || !ram || !disco || !office || !tipoConexion || !dependencia || !direccion || !equipamiento || !caracteristica || !sistemaOperativo) {
                setAddError("Todos los campos son obligatorios");
                setAddLoading(false);
                return;
              }
              try {
                await fetch('http://localhost:8081/inventario', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    usuario_id: 4, // O el id real del usuario logueado
                    dependencia_id: dependencia,
                    direccion_area_id: direccion,
                    dispositivo_id: tipoEquipo,
                    direccion_ip: ip,
                    direccion_mac: mac,
                    nombre_pc: nombrePc,
                    nombres_funcionario: funcionario,
                    equipamiento_id: equipamiento,
                    tipo_equipo_id: tipoEquipo,
                    tipo_sistema_operativo_id: sistemaOperativo,
                    caracteristicas_id: caracteristica,
                    ram_id: ram,
                    disco_id: disco,
                    office_id: office,
                    marca_id: marca,
                    codigo_inventario: mac, // O el campo que uses como código único
                    tipo_conexion_id: tipoConexion,
                    anydesk: anydesk
                  })
                });
                setShowAddEquipo(false);
                // Limpiar campos
                setIp(""); setMac(""); setNombrePc(""); setFuncionario(""); setAnydesk("");
                setTipoEquipo(""); setMarca(""); setRam(""); setDisco(""); setOffice(""); setTipoConexion("");
                setProgramaAdicional([]); setDependencia(""); setDireccion(""); setEquipamiento(""); setCaracteristica(""); setSistemaOperativo("");
                // Refrescar lista
                const data = await getEquipos();
                setEquipos(data);
              } catch (err: any) {
                setAddError("Error al crear equipo");
              } finally {
                setAddLoading(false);
              }
            }}
            style={{
              display: 'flex', flexDirection: 'column', gap: 14, background: '#f8fafc', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginTop: 8
            }}
          >
            <input value={ip} onChange={e => setIp(e.target.value)} placeholder="Dirección IP" style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} />
            <input value={mac} onChange={e => setMac(e.target.value)} placeholder="Dirección MAC" style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} />
            <input value={nombrePc} onChange={e => setNombrePc(e.target.value)} placeholder="Nombre de PC" style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} />
            <input value={funcionario} onChange={e => setFuncionario(e.target.value)} placeholder="Nombres del funcionario" style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} />
            <input value={anydesk} onChange={e => setAnydesk(e.target.value)} placeholder="Anydesk" style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}} />
            <select value={tipoEquipo} onChange={e => setTipoEquipo(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Tipo de equipo</option>{tipoEquipoCatalogo.map(t => <option key={t} value={t}>{t}</option>)}</select>
            <select value={marca} onChange={e => setMarca(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Marca</option>{marcasCatalogo.map(m => <option key={m} value={m}>{m}</option>)}</select>
            <select value={ram} onChange={e => setRam(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">RAM</option>{ramCatalogo.map(r => <option key={r} value={r}>{r}</option>)}</select>
            <select value={disco} onChange={e => setDisco(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Disco</option>{discoCatalogo.map(d => <option key={d} value={d}>{d}</option>)}</select>
            <select value={office} onChange={e => setOffice(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Office</option>{officeCatalogo.map(o => <option key={o} value={o}>{o}</option>)}</select>
            <select value={tipoConexion} onChange={e => setTipoConexion(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Tipo de conexión</option>{tipoConexionCatalogo.map(tc => <option key={tc} value={tc}>{tc}</option>)}</select>
            <select value={dependencia} onChange={e => setDependencia(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Dependencia</option>{dependenciasCatalogo.map(dep => <option key={dep} value={dep}>{dep}</option>)}</select>
            <select value={direccion} onChange={e => setDireccion(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Dirección</option>{direccionesCatalogo.map(dir => <option key={dir} value={dir}>{dir}</option>)}</select>
            <select value={equipamiento} onChange={e => setEquipamiento(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Equipamiento</option>{equipamientosCatalogo.map(eq => <option key={eq} value={eq}>{eq}</option>)}</select>
            <select value={caracteristica} onChange={e => setCaracteristica(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Características</option>{caracteristicasCatalogo.map(c => <option key={c} value={c}>{c}</option>)}</select>
            <select value={sistemaOperativo} onChange={e => setSistemaOperativo(e.target.value)} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15}}><option value="">Sistema Operativo</option>{tipoSistemaOperativoCatalogo.map(so => <option key={so} value={so}>{so}</option>)}</select>
            <label style={{marginTop: 6, fontWeight: 500}}>Programa adicional:</label>
            <select multiple value={programaAdicional} onChange={e => setProgramaAdicional(Array.from(e.target.selectedOptions, opt => opt.value))} style={{padding: '10px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15, minHeight: 70}}>
              {programaAdicionalCatalogo.map(pa => <option key={pa} value={pa}>{pa}</option>)}
            </select>
            <button type="submit" className="btn btn-primary" disabled={addLoading} style={{marginTop: 12, fontWeight: 700, fontSize: 17, borderRadius: 8, padding: '12px 0'}}> {addLoading ? 'Guardando...' : 'Guardar equipo'} </button>
          </form>
        </Modal>
      )}
    </section>
      </main>
    </div>
  );
}
