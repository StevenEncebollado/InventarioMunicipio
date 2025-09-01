"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import type { Equipo, Usuario } from '@/types';
import { useEffect, useState } from 'react';
import { getEquipos, APP_CONFIG } from '@/services/api';

import Navbar from '../components/Navbar';
import PanelControl from '../components/PanelControl';


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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Usuario | null>(null);

  // Cargar usuario de localStorage
  useEffect(() => {
    const userData = localStorage.getItem(APP_CONFIG.session.storageKey);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Cargar equipos filtrados
  useEffect(() => {
    setLoading(true);
    getEquipos().then(data => {
      let filtrados = data;
      if (tipo === 'active') filtrados = data.filter((e: Equipo) => e.estado === 'Activo');
      else if (tipo === 'maintenance') filtrados = data.filter((e: Equipo) => e.estado === 'Mantenimiento');
      else if (tipo === 'inactive') filtrados = data.filter((e: Equipo) => e.estado === 'Inactivo');
      setEquipos(filtrados);
      setLoading(false);
    });
  }, [tipo]);

  // Estadísticas para PanelControl
  const stats = {
    total: equipos.length,
    active: equipos.filter(e => e.estado === 'Activo').length,
    maintenance: equipos.filter(e => e.estado === 'Mantenimiento').length,
    inactive: equipos.filter(e => e.estado === 'Inactivo').length,
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
        <div style={{ maxWidth: 520, margin: '48px auto', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
          <h2 style={{ marginBottom: 18 }}>{TITULOS[tipo] || 'Equipos'}</h2>
          {loading ? (
            <div style={{ minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner-border text-primary" role="status" style={{ width: 56, height: 56, marginBottom: 18 }}>
                <span className="sr-only">Cargando...</span>
              </div>
              <div style={{ color: '#2563eb', fontWeight: 600, fontSize: 18, letterSpacing: 0.5 }}>Cargando...</div>
            </div>
          ) : equipos.length === 0 ? (
            <p>No hay dispositivos en este segmento.</p>
          ) : (
            <ul style={{ padding: 0, listStyle: 'none', maxHeight: 400, overflowY: 'auto' }}>
              {equipos.map(eq => (
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
