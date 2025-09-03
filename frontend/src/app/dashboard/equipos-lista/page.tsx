// Sirve para que el usuario pueda ver, filtrar y navegar
// una lista detallada de equipos del inventario municipal,
// con opciones avanzadas de filtrado y navegación.

"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import type { Equipo, Usuario } from '@/types';
import { useEffect, useState } from 'react';
import { getEquipos, APP_CONFIG } from '@/services/api';

import Navbar from '../../Diseño/Diseño dashboard/Navbar';
import PanelControl from '../../Diseño/Diseño dashboard/PanelControl';
import Filtros from '../componentes/Filtros';
import { estiloGlobal } from '../../Diseño/Estilos/EstiloGlobal';
import { estiloTablas } from '../../Diseño/Estilos/EstiloTablas';


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
  // Eliminado el estado equiposFiltrados para evitar ciclos
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
    getEquipos(filtrosBackend).then(data => {
      setEquipos(data);
      setLoading(false);
    });
  }, [dependenciaSeleccionada, direccionSeleccionada, dispositivoSeleccionado, equipamientoSeleccionado, tipoEquipoSeleccionado, tipoSistemaOperativoSeleccionado, marcaSeleccionada, caracteristicaSeleccionada, ramSeleccionada, discoSeleccionado, officeSeleccionado, tipoConexionSeleccionada]);

  // Filtrar equipos según todos los filtros y el tipo de estado
  // Filtrar solo por programa adicional (si aplica) en frontend
  const equiposFiltradosStats = programaAdicionalSeleccionado.length > 0
    ? equipos.filter(e => programaAdicionalSeleccionado.every(p => e.programa_adicional_ids?.includes(Number(p))))
    : equipos;

  // Filtrar para listado (panel de dispositivos) directamente en el render
  const equiposFiltrados = (() => {
    let filtrados = equiposFiltradosStats;
    if (tipo === 'active') filtrados = filtrados.filter((e: Equipo) => e.estado === 'Activo');
    else if (tipo === 'maintenance') filtrados = filtrados.filter((e: Equipo) => e.estado === 'Mantenimiento');
    else if (tipo === 'inactive') filtrados = filtrados.filter((e: Equipo) => e.estado === 'Inactivo');
    return filtrados;
  })();

  // Estadísticas para PanelControl
  const stats = {
    total: equiposFiltradosStats.length,
    active: equiposFiltradosStats.filter(e => e.estado === 'Activo').length,
    maintenance: equiposFiltradosStats.filter(e => e.estado === 'Mantenimiento').length,
    inactive: equiposFiltradosStats.filter(e => e.estado === 'Inactivo').length,
  };

  // Handler para navegar entre segmentos
  const handlePanelInfo = (type: 'total' | 'active' | 'maintenance' | 'inactive') => {
    router.push(`/dashboard/equipos-lista?tipo=${type}`);
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
  <div style={{ maxWidth: 520, margin: '48px auto', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
          <h2 style={{ marginBottom: 18 }}>{TITULOS[tipo] || 'Equipos'}</h2>
          {loading ? (
            <div style={{ minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ ...estiloGlobal.spinner, width: 56, height: 56, color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <svg width="56" height="56" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#2563eb" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
              </div>
              <div style={{ color: '#2563eb', fontWeight: 600, fontSize: 18, letterSpacing: 0.5 }}>Cargando...</div>
            </div>
          ) : equiposFiltrados.length === 0 ? (
            <p>No hay dispositivos en este segmento.</p>
          ) : (
            <ul style={{ padding: 0, listStyle: 'none', maxHeight: 400, overflowY: 'auto' }}>
              {equiposFiltrados.map(eq => (
                <li key={eq.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <strong>{eq.nombres_funcionario || 'Sin asignar'}</strong> - {eq.codigo_inventario || 'Sin código'} - Estado: {eq.estado}
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => router.push('/dashboard')} style={{ marginTop: 24, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, cursor: 'pointer' }}>Volver</button>
        </div>
      </main>
    </div>
  );
}
