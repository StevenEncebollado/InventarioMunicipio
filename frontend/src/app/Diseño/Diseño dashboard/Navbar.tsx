

import { FaCity, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import type { Usuario } from '@/types';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EstiloDashboardEspecifico } from '../Estilos/EstiloDashboardEspecifico';
import BarraDeBusqueda from './BarraDeBusqueda';

interface NavbarProps {
  user: Usuario | null;
  onLogout: () => void;
}

// Animación simple para el ícono (solo en cliente)
function useSpinKeyframes() {
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('navbar-spin-keyframes')) {
      const style = document.createElement('style');
      style.id = 'navbar-spin-keyframes';
      style.innerHTML = `@keyframes navbarSpin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`;
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
  
  return (
    <nav className="navbar-container" style={{
      ...EstiloDashboardEspecifico.navbar.navbar,
      position: 'relative',
      overflow: 'visible',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      zIndex: 100,
    }}>
      {/* Efecto de ondas de fondo mejorado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 15% 85%, rgba(255,255,255,0.12) 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 70%)
        `,
        zIndex: 0,
      }} />
      
      <div className="navbar-brand" style={{ 
        ...EstiloDashboardEspecifico.navbar.navBrand, 
        position: 'relative', 
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(8px, 2vw, 16px)',
        flex: '1',
        minWidth: '0'
      }}>
        <FaCity style={{ 
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', 
          color: '#fff', 
          animation: 'navbarSpin 3s linear infinite',
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))',
          flexShrink: 0,
        }} />
        <button
          onClick={handleGoHome}
          className="navbar-title"
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 'clamp(1.2rem, 3vw, 1.9rem)',
            fontWeight: 700,
            cursor: 'pointer',
            margin: 0,
            padding: '8px 0',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            letterSpacing: '-0.025em',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textAlign: 'left',
            outline: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: '0',
          }}
          onMouseEnter={e => {
            const target = e.target as HTMLButtonElement;
            target.style.transform = 'scale(1.02)';
            target.style.textShadow = '0 3px 12px rgba(0,0,0,0.6)';
          }}
          onMouseLeave={e => {
            const target = e.target as HTMLButtonElement;
            target.style.transform = 'scale(1)';
            target.style.textShadow = '0 2px 8px rgba(0,0,0,0.4)';
          }}
        >
          <span className="full-title">Inventario Municipio</span>
          <span className="short-title" style={{ display: 'none' }}>Inventario</span>
        </button>
      </div>
      
      {/* Búsqueda Global con Sugerencias */}
      <BarraDeBusqueda />
      
      
      <div className="navbar-user" style={{ 
        ...EstiloDashboardEspecifico.navbar.navUser, 
        position: 'relative', 
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(8px, 2vw, 16px)',
        flex: 'none',
        minWidth: '0'
      }}>
        {user && (
          <>
            <FaUserCircle className="user-icon" style={{ 
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', 
              color: '#fff',
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))',
              flexShrink: 0,
            }} />
            <span className="welcome-text" style={{ 
              fontWeight: 600, 
              fontSize: 'clamp(0.9rem, 2.2vw, 1.3rem)',
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: '0',
            }}>
              <span className="welcome-full">Bienvenido, </span>
              <strong style={{ 
                background: 'linear-gradient(45deg, #ffffff, #e0f2fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
              }}>{user.username}</strong>
            </span>
            <button
              onClick={onLogout}
              type="button"
              className="logout-button"
              style={{
                ...EstiloDashboardEspecifico.navbar.logoutButton,
                fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2.5vw, 20px)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 8px)',
                border: '2px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: 600,
                letterSpacing: '0.025em',
                outline: 'none',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
              }}
              onMouseEnter={e => {
                const target = e.target as HTMLButtonElement;
                target.style.background = 'rgba(255,255,255,0.25)';
                target.style.borderColor = 'rgba(255,255,255,0.4)';
                target.style.transform = 'translateY(-1px)';
                target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                const target = e.target as HTMLButtonElement;
                target.style.background = 'rgba(255,255,255,0.15)';
                target.style.borderColor = 'rgba(255,255,255,0.2)';
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
            >
              <FaSignOutAlt style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.3rem)', 
                flexShrink: 0 
              }} />
              <span className="logout-text">Cerrar Sesión</span>
              <span className="logout-text-short" style={{ display: 'none' }}>Salir</span>
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
      
      {/* Animaciones CSS mejoradas */}
      <style>{`
        @keyframes navShine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* Mejoras de animación */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Responsive para navbar */
        @media (max-width: 768px) {
          .navbar-container {
            padding: 12px 16px !important;
            gap: 12px !important;
          }
        }
        
        @media (max-width: 640px) {
          .full-title {
            display: none;
          }
          
          .short-title {
            display: inline !important;
          }
          
          .welcome-full {
            display: none;
          }
          
          .logout-text {
            display: none;
          }
          
          .logout-text-short {
            display: inline !important;
          }
        }
        
        @media (max-width: 480px) {
          .navbar-container {
            padding: 10px 12px !important;
            flex-wrap: wrap !important;
            min-height: 60px !important;
          }
          
          .navbar-brand {
            order: 1;
            flex: 1 !important;
            min-width: 0 !important;
          }
          
          .navbar-user {
            order: 2;
            flex: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
