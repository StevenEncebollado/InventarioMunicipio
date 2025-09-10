'use client';
import { useState } from 'react';
import { FaCog, FaPlus, FaDatabase, FaEdit } from 'react-icons/fa';

interface FooterProps {
  onModificarCategorias: () => void;
}

export default function Footer({ onModificarCategorias }: FooterProps) {
  const [isHovered, setIsHovered] = useState(false);

  const footerStyles = {
    footer: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #2563eb 100%)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
      zIndex: 1000,
      boxShadow: '0 -4px 20px rgba(30,64,175,0.15), 0 -1px 3px rgba(0,0,0,0.1)',
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      color: 'rgba(255,255,255,0.9)',
      fontSize: '0.95rem',
      fontWeight: 500,
    },
    centerSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'rgba(255,255,255,0.8)',
      fontSize: '0.9rem',
      fontWeight: 400,
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 24px',
      background: isHovered 
        ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '50px',
      color: '#fff',
      fontSize: '0.95rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      boxShadow: isHovered 
        ? '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
        : '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      backdropFilter: 'blur(10px)',
    },
    icon: {
      fontSize: '1.1rem',
      color: '#fff',
      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
    },
    databaseIcon: {
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.7)',
      animation: 'pulse 2s infinite',
    },
    versionText: {
      fontSize: '0.85rem',
      color: 'rgba(255,255,255,0.6)',
      fontWeight: 400,
    }
  };

  return (
    <>
      <footer style={footerStyles.footer}>
        {/* Efectos de fondo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
          zIndex: 0,
        }} />
        
        <div style={{ ...footerStyles.container, position: 'relative', zIndex: 1 }}>
          {/* Sección Izquierda - Info del Sistema */}
          <div style={footerStyles.leftSection}>
            <FaDatabase style={footerStyles.databaseIcon} />
            <span>Sistema de Inventario Municipal</span>
          </div>
          
          {/* Sección Central - Estado */}
          <div style={footerStyles.centerSection}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981',
              animation: 'pulse 1.5s infinite',
            }} />
            <span>Sistema Activo</span>
            <span style={footerStyles.versionText}>v2.1.0</span>
          </div>
          
          {/* Sección Derecha - Botón Principal */}
          <div style={footerStyles.rightSection}>
            <button
              style={footerStyles.button}
              onClick={onModificarCategorias}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              type="button"
            >
              <FaCog style={footerStyles.icon} />
              <span>Modificar Categorías</span>
              <FaEdit style={{ fontSize: '0.9rem', opacity: 0.8 }} />
            </button>
          </div>
        </div>
        
        {/* Brillo animado */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'footerShine 6s ease-in-out infinite',
          zIndex: 0,
        }} />
      </footer>
      
      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        @keyframes footerShine {
          0% { left: -100%; }
          50% { left: -50%; }
          100% { left: 100%; }
        }
        
        @media (max-width: 768px) {
          footer div:first-child div:first-child span {
            display: none;
          }
          
          footer div:first-child div:nth-child(2) {
            flex-direction: column;
            gap: 2px;
            font-size: 0.8rem;
          }
          
          footer div:first-child div:last-child button {
            padding: 10px 16px;
            font-size: 0.85rem;
            gap: 6px;
          }
          
          footer div:first-child div:last-child button span {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          footer div:first-child {
            padding: 0 12px;
          }
          
          footer div:first-child div:last-child button {
            padding: 8px 12px;
            border-radius: 40px;
          }
        }
      `}</style>
    </>
  );
}
