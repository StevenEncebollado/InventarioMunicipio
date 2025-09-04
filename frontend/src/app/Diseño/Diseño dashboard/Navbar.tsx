

import { FaCity, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import type { Usuario } from '@/types';
import { useRouter } from 'next/navigation';
import { EstiloDashboardEspecifico } from '../Estilos/EstiloDashboardEspecifico';

interface NavbarProps {
  user: Usuario | null;
  onLogout: () => void;
}

// Animación simple para el ícono (solo en cliente)
import { useEffect } from 'react';

function useSpinKeyframes() {
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('spin-keyframes')) {
      const style = document.createElement('style');
      style.id = 'spin-keyframes';
      style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`;
      document.head.appendChild(style);
    }
  }, []);
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  useSpinKeyframes();
  const router = useRouter();
  const handleGoHome = () => {
    router.push('/dashboard');
  };
  
  const handleGoToAddEquipo = () => {
    router.push('/dashboard/agregar_equipo');
  };
  
  return (
    <nav style={EstiloDashboardEspecifico.navbar.navbar}>
      {/* Efecto de ondas de fondo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
        `,
        zIndex: 0,
      }} />
      
      <div style={{ ...EstiloDashboardEspecifico.navbar.navBrand, position: 'relative', zIndex: 1 }}>
        <FaCity style={{ 
          fontSize: '2.4rem', 
          color: '#fff', 
          animation: 'spin 3s linear infinite',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }} />
        <button
          onClick={handleGoHome}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            margin: 0,
            padding: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.textShadow = '0 2px 8px rgba(0,0,0,0.5)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
          }}
        >
          Inventario Municipio
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1 }}>
        <button
          onClick={handleGoToAddEquipo}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: '16px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          Agregar Equipo
        </button>
      </div>
      
      <div style={{ ...EstiloDashboardEspecifico.navbar.navUser, position: 'relative', zIndex: 1 }}>
        {user && (
          <>
            <FaUserCircle style={{ 
              fontSize: '1.8rem', 
              marginRight: 8, 
              color: '#fff',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }} />
            <span style={{ 
              fontWeight: 700, 
              fontSize: '1.2rem',
            }}>
              Bienvenido, <strong style={{ 
                background: 'linear-gradient(45deg, #fff, #e0f2fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{user.username}</strong>
            </span>
            <button
              onClick={onLogout}
              type="button"
              style={EstiloDashboardEspecifico.navbar.logoutButton}
              onMouseOver={e => Object.assign(e.currentTarget.style, EstiloDashboardEspecifico.navbar.logoutButtonHover)}
              onMouseOut={e => Object.assign(e.currentTarget.style, EstiloDashboardEspecifico.navbar.logoutButton)}
            >
              <FaSignOutAlt style={{ fontSize: '1.2rem', marginRight: 4 }} />
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
      
      {/* Efecto de brillo animado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        animation: 'navShine 4s ease-in-out infinite',
        zIndex: 0,
      }} />
      
      {/* Animaciones CSS */}
      <style>{`
        @keyframes navShine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </nav>
  );
}
