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
          conic-gradient(from 0deg at 30% 20%, rgba(59, 130, 246, 0.15) 0deg, rgba(16, 185, 129, 0.1) 60deg, transparent 120deg, rgba(245, 158, 11, 0.12) 180deg, rgba(239, 68, 68, 0.1) 240deg, rgba(139, 92, 246, 0.12) 300deg, rgba(59, 130, 246, 0.15) 360deg),
          conic-gradient(from 180deg at 70% 80%, rgba(168, 85, 247, 0.12) 0deg, transparent 60deg, rgba(6, 182, 212, 0.1) 120deg, transparent 180deg, rgba(251, 191, 36, 0.12) 240deg, transparent 300deg),
          radial-gradient(ellipse 200% 100% at 10% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 150% 120% at 90% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 180% 90% at 50% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 70%),
          linear-gradient(135deg, #fafafa 0%, #f4f6fa 15%, #e8f2ff 30%, #f0f9ff 45%, #f8fafc 60%, #f3f4f6 75%, #fafafa 100%)
        `,
        minHeight: '100vh', 
        padding: '0 0 64px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Sistema de partículas estables */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}>
          {/* Partículas fijas para evitar problemas de hidratación */}
          <div style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: 'rgba(59, 130, 246, 0.6)',
            borderRadius: '50%',
            top: '15%',
            left: '10%',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)',
            animation: 'particle1 12s ease-in-out infinite',
          }} />
          
          <div style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: 'rgba(16, 185, 129, 0.6)',
            borderRadius: '50%',
            top: '25%',
            right: '15%',
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
            animation: 'particle2 10s ease-in-out infinite',
          }} />
          
          <div style={{
            position: 'absolute',
            width: '5px',
            height: '5px',
            background: 'rgba(245, 158, 11, 0.6)',
            borderRadius: '50%',
            top: '45%',
            left: '20%',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)',
            animation: 'particle3 15s ease-in-out infinite',
          }} />
          
          <div style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: 'rgba(239, 68, 68, 0.6)',
            borderRadius: '50%',
            bottom: '30%',
            right: '25%',
            boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
            animation: 'particle4 11s ease-in-out infinite',
          }} />
          
          <div style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: 'rgba(139, 92, 246, 0.6)',
            borderRadius: '50%',
            top: '60%',
            left: '30%',
            boxShadow: '0 0 14px rgba(139, 92, 246, 0.6)',
            animation: 'particle5 13s ease-in-out infinite',
          }} />
          
          <div style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: 'rgba(6, 182, 212, 0.6)',
            borderRadius: '50%',
            bottom: '20%',
            left: '40%',
            boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)',
            animation: 'particle6 9s ease-in-out infinite',
          }} />
          
          {/* Partículas micro brillantes fijas */}
          <div style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            background: '#ffffff',
            borderRadius: '50%',
            top: '35%',
            left: '60%',
            boxShadow: '0 0 4px #ffffff',
            animation: 'twinkle 3s ease-in-out infinite',
          }} />
          
          <div style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            background: '#ffffff',
            borderRadius: '50%',
            top: '70%',
            right: '35%',
            boxShadow: '0 0 4px #ffffff',
            animation: 'twinkle 4s ease-in-out infinite',
            animationDelay: '1s',
          }} />
          
          <div style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            background: '#ffffff',
            borderRadius: '50%',
            top: '20%',
            right: '50%',
            boxShadow: '0 0 4px #ffffff',
            animation: 'twinkle 5s ease-in-out infinite',
            animationDelay: '2s',
          }} />
        </div>
        
        {/* Patrón geométrico estable */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.8) 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.8) 1.5px, transparent 1.5px),
            radial-gradient(circle at 40% 60%, rgba(245, 158, 11, 0.8) 1px, transparent 1px),
            radial-gradient(circle at 60% 40%, rgba(239, 68, 68, 0.8) 1.5px, transparent 1.5px),
            linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.1) 49%, rgba(59, 130, 246, 0.1) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(16, 185, 129, 0.1) 49%, rgba(16, 185, 129, 0.1) 51%, transparent 52%)
          `,
          backgroundSize: '80px 80px, 100px 100px, 60px 60px, 120px 120px, 200px 200px, 200px 200px',
          backgroundPosition: '0 0, 40px 40px, 20px 60px, 60px 20px, 0 0, 100px 100px',
          animation: 'patternMove 25s linear infinite',
          zIndex: 0,
        }} />
        
        {/* Ondas de energía dinámicas */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '-20%',
          width: '140%',
          height: '300px',
          background: `
            linear-gradient(90deg, 
              transparent, 
              rgba(59, 130, 246, 0.05), 
              rgba(16, 185, 129, 0.05), 
              rgba(59, 130, 246, 0.05), 
              transparent
            )
          `,
          borderRadius: '50%',
          transform: 'rotate(-8deg)',
          animation: 'energyWave1 20s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '-20%',
          width: '140%',
          height: '250px',
          background: `
            linear-gradient(90deg, 
              transparent, 
              rgba(245, 158, 11, 0.05), 
              rgba(239, 68, 68, 0.05), 
              rgba(245, 158, 11, 0.05), 
              transparent
            )
          `,
          borderRadius: '50%',
          transform: 'rotate(12deg)',
          animation: 'energyWave2 18s ease-in-out infinite reverse',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '-15%',
          width: '130%',
          height: '200px',
          background: `
            linear-gradient(90deg, 
              transparent, 
              rgba(139, 92, 246, 0.05), 
              rgba(6, 182, 212, 0.05), 
              rgba(139, 92, 246, 0.05), 
              transparent
            )
          `,
          borderRadius: '50%',
          transform: 'rotate(-5deg)',
          animation: 'energyWave3 22s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        {/* Elementos decorativos ultra dinámicos */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '3%',
          width: '150px',
          height: '150px',
          background: `
            conic-gradient(from 45deg, 
              rgba(59, 130, 246, 0.2), 
              rgba(16, 185, 129, 0.2), 
              rgba(245, 158, 11, 0.2), 
              rgba(59, 130, 246, 0.2)
            )
          `,
          borderRadius: '60% 40% 60% 40% / 60% 30% 70% 40%',
          filter: 'blur(60px)',
          animation: 'megaFloat1 12s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '8%',
          width: '120px',
          height: '120px',
          background: `
            conic-gradient(from 180deg, 
              rgba(239, 68, 68, 0.25), 
              rgba(245, 158, 11, 0.25), 
              rgba(139, 92, 246, 0.25), 
              rgba(239, 68, 68, 0.25)
            )
          `,
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          filter: 'blur(50px)',
          animation: 'megaFloat2 15s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '2%',
          width: '100px',
          height: '100px',
          background: `
            radial-gradient(ellipse at center, 
              rgba(6, 182, 212, 0.3) 0%, 
              rgba(59, 130, 246, 0.2) 40%, 
              rgba(16, 185, 129, 0.1) 70%, 
              transparent 100%
            )
          `,
          borderRadius: '40% 60% 30% 70% / 40% 70% 60% 30%',
          filter: 'blur(45px)',
          animation: 'megaFloat3 18s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: '130px',
          height: '130px',
          background: `
            conic-gradient(from 270deg, 
              rgba(168, 85, 247, 0.2), 
              rgba(236, 72, 153, 0.2), 
              rgba(251, 191, 36, 0.2), 
              rgba(168, 85, 247, 0.2)
            )
          `,
          borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%',
          filter: 'blur(55px)',
          animation: 'megaFloat4 14s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '15%',
          width: '90px',
          height: '90px',
          background: `
            radial-gradient(circle, 
              rgba(245, 101, 101, 0.25) 0%, 
              rgba(251, 191, 36, 0.2) 50%, 
              rgba(34, 197, 94, 0.15) 100%
            )
          `,
          borderRadius: '50% 50% 20% 80% / 25% 55% 45% 75%',
          filter: 'blur(40px)',
          animation: 'megaFloat5 11s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: '110px',
          height: '110px',
          background: `
            conic-gradient(from 90deg, 
              rgba(34, 197, 94, 0.2), 
              rgba(59, 130, 246, 0.2), 
              rgba(245, 158, 11, 0.2), 
              rgba(34, 197, 94, 0.2)
            )
          `,
          borderRadius: '80% 20% 60% 40% / 20% 80% 40% 60%',
          filter: 'blur(50px)',
          animation: 'megaFloat6 16s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '25%',
          width: '80px',
          height: '80px',
          background: `
            radial-gradient(ellipse, 
              rgba(139, 92, 246, 0.3) 0%, 
              rgba(59, 130, 246, 0.2) 60%, 
              transparent 100%
            )
          `,
          borderRadius: '60% 40% 80% 20% / 50% 70% 30% 50%',
          filter: 'blur(35px)',
          animation: 'megaFloat7 13s ease-in-out infinite',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '5%',
          width: '120px',
          height: '120px',
          background: 'conic-gradient(from 45deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float1 8s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'conic-gradient(from 180deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.12))',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          filter: 'blur(30px)',
          animation: 'float2 10s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '8%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 100%)',
          borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
          filter: 'blur(35px)',
          animation: 'float3 12s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '90px',
          height: '90px',
          background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          filter: 'blur(32px)',
          animation: 'float4 9s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '3%',
          width: '60px',
          height: '60px',
          background: 'conic-gradient(from 90deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1))',
          borderRadius: '50%',
          filter: 'blur(25px)',
          animation: 'float5 7s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        <div style={{
          position: 'absolute',
          top: '70%',
          right: '25%',
          width: '70px',
          height: '70px',
          background: 'radial-gradient(circle, rgba(245, 101, 101, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
          borderRadius: '30% 70% 40% 60% / 30% 40% 60% 70%',
          filter: 'blur(28px)',
          animation: 'float6 11s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        {/* Efecto Aurora Boreal */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: `
            linear-gradient(180deg, 
              rgba(59, 130, 246, 0.03) 0%, 
              rgba(16, 185, 129, 0.02) 25%, 
              rgba(139, 92, 246, 0.025) 50%, 
              transparent 100%
            )
          `,
          animation: 'aurora 25s ease-in-out infinite',
          zIndex: 0,
        }} />
        
        {/* Resplandor central dinámico */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '800px',
          height: '600px',
          transform: 'translate(-50%, -50%)',
          background: `
            radial-gradient(ellipse at center, 
              rgba(59, 130, 246, 0.02) 0%, 
              rgba(16, 185, 129, 0.015) 30%, 
              rgba(245, 158, 11, 0.01) 60%, 
              transparent 100%
            )
          `,
          animation: 'centralGlow 30s ease-in-out infinite',
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
        
        {/* Animaciones CSS simplificadas y estables */}
        <style>{`
          @keyframes particle1 {
            0%, 100% { 
              transform: translate(0, 0) scale(1); 
              opacity: 0.6;
            }
            50% { 
              transform: translate(50px, -30px) scale(1.2); 
              opacity: 1;
            }
          }
          
          @keyframes particle2 {
            0%, 100% { 
              transform: translate(0, 0) scale(1); 
              opacity: 0.7;
            }
            50% { 
              transform: translate(-40px, 20px) scale(1.1); 
              opacity: 1;
            }
          }
          
          @keyframes particle3 {
            0%, 100% { 
              transform: translate(0, 0) scale(1); 
              opacity: 0.5;
            }
            33% { 
              transform: translate(30px, -40px) scale(1.3); 
              opacity: 0.9;
            }
            66% { 
              transform: translate(-20px, 30px) scale(0.8); 
              opacity: 1;
            }
          }
          
          @keyframes particle4 {
            0%, 100% { 
              transform: translate(0, 0) scale(1); 
              opacity: 0.8;
            }
            50% { 
              transform: translate(-60px, -40px) scale(1.4); 
              opacity: 1;
            }
          }
          
          @keyframes particle5 {
            0%, 100% { 
              transform: translate(0, 0) scale(1); 
              opacity: 0.6;
            }
            25% { 
              transform: translate(40px, -20px) scale(1.2); 
              opacity: 1;
            }
            75% { 
              transform: translate(-30px, 40px) scale(0.9); 
              opacity: 0.8;
            }
          }
          
          @keyframes particle6 {
            0%, 100% { 
              transform: translate(0, 0) scale(1); 
              opacity: 0.7;
            }
            50% { 
              transform: translate(50px, 20px) scale(1.1); 
              opacity: 1;
            }
          }
          
          @keyframes twinkle {
            0%, 100% { 
              opacity: 0; 
              transform: scale(0); 
            }
            50% { 
              opacity: 1; 
              transform: scale(2); 
            }
          }
          
          @keyframes patternMove {
            0% { 
              transform: translateX(0) translateY(0); 
            }
            50% { 
              transform: translateX(10px) translateY(-5px); 
            }
            100% { 
              transform: translateX(0) translateY(0); 
            }
          }
          
          @keyframes energyWave1 {
            0%, 100% { 
              transform: translateX(-30px) translateY(0) rotate(-8deg); 
              opacity: 0.05;
            }
            50% { 
              transform: translateX(30px) translateY(-15px) rotate(-6deg); 
              opacity: 0.08;
            }
          }
          
          @keyframes energyWave2 {
            0%, 100% { 
              transform: translateX(0) translateY(0) rotate(12deg); 
              opacity: 0.05;
            }
            50% { 
              transform: translateX(-20px) translateY(10px) rotate(10deg); 
              opacity: 0.07;
            }
          }
          
          @keyframes energyWave3 {
            0%, 100% { 
              transform: translateX(-20px) translateY(0) rotate(-5deg); 
              opacity: 0.05;
            }
            50% { 
              transform: translateX(25px) translateY(-10px) rotate(-3deg); 
              opacity: 0.07;
            }
          }
          
          @keyframes megaFloat1 {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(1); 
              border-radius: 60% 40% 60% 40% / 60% 30% 70% 40%;
            }
            50% { 
              transform: translate(40px, -30px) rotate(180deg) scale(1.2); 
              border-radius: 40% 60% 30% 70% / 30% 60% 40% 70%;
            }
          }
          
          @keyframes megaFloat2 {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(1); 
              border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            }
            50% { 
              transform: translate(-30px, 40px) rotate(180deg) scale(1.1); 
              border-radius: 70% 30% 40% 60% / 60% 40% 30% 70%;
            }
          }
          
          @keyframes megaFloat3 {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(1); 
              border-radius: 40% 60% 30% 70% / 40% 70% 60% 30%;
            }
            33% { 
              transform: translate(25px, -40px) rotate(120deg) scale(1.3); 
              border-radius: 60% 40% 70% 30% / 30% 60% 40% 70%;
            }
            66% { 
              transform: translate(-35px, 20px) rotate(240deg) scale(0.9); 
              border-radius: 30% 70% 40% 60% / 70% 30% 60% 40%;
            }
          }
          
          @keyframes megaFloat4 {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(1); 
              border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%;
            }
            50% { 
              transform: translate(-40px, -35px) rotate(180deg) scale(1.2); 
              border-radius: 30% 70% 40% 60% / 70% 30% 60% 40%;
            }
          }
          
          @keyframes megaFloat5 {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(1); 
              border-radius: 50% 50% 20% 80% / 25% 55% 45% 75%;
            }
            50% { 
              transform: translate(60px, 15px) rotate(180deg) scale(1.1); 
              border-radius: 80% 20% 50% 50% / 55% 25% 75% 45%;
            }
          }
          
          @keyframes megaFloat6 {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(1); 
              border-radius: 80% 20% 60% 40% / 20% 80% 40% 60%;
            }
            50% { 
              transform: translate(-25px, -45px) rotate(180deg) scale(1.15); 
              border-radius: 20% 80% 40% 60% / 80% 20% 60% 40%;
            }
          }
          
          @keyframes megaFloat7 {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(1); 
              border-radius: 60% 40% 80% 20% / 50% 70% 30% 50%;
            }
            50% { 
              transform: translate(45px, -35px) rotate(180deg) scale(1.2); 
              border-radius: 40% 60% 20% 80% / 70% 50% 50% 30%;
            }
          }
          
          @keyframes aurora {
            0%, 100% { 
              opacity: 0.03; 
              transform: translateY(0);
            }
            50% { 
              opacity: 0.05; 
              transform: translateY(-10px);
            }
          }
          
          @keyframes centralGlow {
            0%, 100% { 
              opacity: 0.02; 
              transform: translate(-50%, -50%) scale(1);
            }
            50% { 
              opacity: 0.03; 
              transform: translate(-50%, -50%) scale(1.05);
            }
          }
        `}</style>
      </main>
    </div>
  );
}
