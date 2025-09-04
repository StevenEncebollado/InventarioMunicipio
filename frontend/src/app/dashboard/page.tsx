// Es la página central donde los usuarios gestionan y visualizan el inventario
// de equipos, con todas las funcionalidades principales del dashboard

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEquipos, logout, getErrorMessage, APP_CONFIG } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import type { Usuario, Equipo } from '@/types';

import Navbar from '../Diseño/Diseño dashboard/Navbar';
import PanelControl from '../Diseño/Diseño dashboard/PanelControl';
import TablaEquipos from './componentes/TablaEquipos';
import { estiloGlobal } from '../Diseño/Estilos/EstiloGlobal';
import { estiloBoton } from '../Diseño/Estilos/EstiloBoton';

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

  const handlePanelInfo = (type: 'total' | 'active' | 'maintenance' | 'inactive') => {
    router.push(`/dashboard/detalle_estados?tipo=${type}`);
  };

  return (
    <div style={estiloGlobal.dashboard}>
      <Navbar user={user} onLogout={handleLogout} />
      <main style={{
        ...estiloGlobal.dashboardContent, 
        background: `
          radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%),
          linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)
        `,
        minHeight: '100vh', 
        padding: '0 0 64px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Patrón geométrico de fondo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(45deg, #000 25%, transparent 25%), 
            linear-gradient(-45deg, #000 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #000 75%), 
            linear-gradient(-45deg, transparent 75%, #000 75%)
          `,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
          zIndex: 0,
        }} />
        
        {/* Elementos decorativos flotantes */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float1 6s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '8%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))',
          borderRadius: '50%',
          filter: 'blur(35px)',
          animation: 'float2 8s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
          borderRadius: '50%',
          filter: 'blur(30px)',
          animation: 'float3 7s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
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
          />
        </div>
        
        {/* Animaciones CSS para elementos flotantes */}
        <style>{`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
          }
          
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-40px, -20px) rotate(180deg); }
          }
          
          @keyframes float3 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(20px, -15px) rotate(90deg); }
            50% { transform: translate(-10px, -30px) rotate(180deg); }
            75% { transform: translate(-30px, 10px) rotate(270deg); }
          }
        `}</style>
      </main>
    </div>
  );
}
