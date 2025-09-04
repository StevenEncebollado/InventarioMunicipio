

import React, { useState } from 'react';
import { FaServer, FaCheckCircle, FaTools, FaBan, FaStar } from 'react-icons/fa';
import { EstiloDashboardEspecifico } from '../Estilos/EstiloDashboardEspecifico';
import { estiloGlobal } from '../Estilos/EstiloGlobal';

interface PanelControlProps {
  total: number;
  active: number;
  maintenance: number;
  inactive: number;
  onInfoClick: (type: 'total' | 'active' | 'maintenance' | 'inactive') => void;
  loading?: boolean;
}

export default function PanelControl({ total, active, maintenance, inactive, onInfoClick, loading }: PanelControlProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [clickedCard, setClickedCard] = useState<string | null>(null);

  const stats = [
    { 
      type: 'total' as const, 
      value: total, 
      title: 'TOTAL DE EQUIPOS', 
      icon: FaServer, 
      style: { ...EstiloDashboardEspecifico.panelControl.cardBase, ...EstiloDashboardEspecifico.panelControl.total },
      color: '#1d4ed8'
    },
    { 
      type: 'active' as const, 
      value: active, 
      title: 'EQUIPOS ACTIVOS', 
      icon: FaCheckCircle, 
      style: { ...EstiloDashboardEspecifico.panelControl.cardBase, ...EstiloDashboardEspecifico.panelControl.active },
      color: '#059669'
    },
    { 
      type: 'maintenance' as const, 
      value: maintenance, 
      title: 'EN MANTENIMIENTO', 
      icon: FaTools, 
      style: { ...EstiloDashboardEspecifico.panelControl.cardBase, ...EstiloDashboardEspecifico.panelControl.maintenance },
      color: '#ca8a04'
    },
    { 
      type: 'inactive' as const, 
      value: inactive, 
      title: 'EQUIPOS INACTIVOS', 
      icon: FaBan, 
      style: { ...EstiloDashboardEspecifico.panelControl.cardBase, ...EstiloDashboardEspecifico.panelControl.inactive },
      color: '#b91c1c'
    },
  ];

  return (
    <div style={EstiloDashboardEspecifico.panelControl.container}>
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const isHovered = hoveredCard === stat.type;
        const isClicked = clickedCard === stat.type;
        
        return (
          <div 
            key={stat.type}
            style={{
              ...stat.style,
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isHovered 
                ? 'translateY(-12px) rotateX(5deg) scale(1.02)' 
                : isClicked 
                ? 'translateY(-8px) scale(0.98)' 
                : 'translateY(0) rotateX(0deg) scale(1)',
              boxShadow: isHovered
                ? `
                  0 20px 40px rgba(41, 29, 29, 0.12),
                  0 8px 24px rgba(0,0,0,0.08),
                  inset 0 1px 0 rgba(255,255,255,0.9),
                  0 0 0 1px rgba(255,255,255,0.6)
                `
                : `
                  0 8px 32px rgba(0,0,0,0.08),
                  0 4px 16px rgba(0,0,0,0.04),
                  inset 0 1px 0 rgba(255,255,255,0.9)
                `,
            }}
            onClick={(e) => {
              setClickedCard(stat.type);
              setTimeout(() => setClickedCard(null), 150);
              onInfoClick(stat.type);
            }}
            onMouseEnter={() => setHoveredCard(stat.type)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Efecto de partículas en hover */}
            {isHovered && (
              <>
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  left: '20%',
                  width: '4px',
                  height: '4px',
                  background: stat.color,
                  borderRadius: '50%',
                  animation: 'float1 2s ease-in-out infinite',
                  opacity: 0.6,
                }} />
                <div style={{
                  position: 'absolute',
                  top: '80%',
                  right: '15%',
                  width: '3px',
                  height: '3px',
                  background: stat.color,
                  borderRadius: '50%',
                  animation: 'float2 2.5s ease-in-out infinite',
                  opacity: 0.4,
                }} />
                <div style={{
                  position: 'absolute',
                  top: '60%',
                  left: '80%',
                  width: '2px',
                  height: '2px',
                  background: stat.color,
                  borderRadius: '50%',
                  animation: 'float3 1.8s ease-in-out infinite',
                  opacity: 0.5,
                }} />
              </>
            )}
            
            <div style={{
              ...EstiloDashboardEspecifico.panelControl.label,
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            }}>
              {stat.title}
            </div>
            
            <div style={{
              ...EstiloDashboardEspecifico.panelControl.number,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}>
              {loading ? (
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '4px solid rgba(0,0,0,0.1)',
                  borderTopColor: 'currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
              ) : (
                <>
                  <IconComponent 
                    size={28} 
                    style={{
                      transform: isHovered ? 'rotate(360deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: isHovered ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' : 'none',
                    }}
                  />
                  <span style={{
                    background: isHovered 
                      ? `linear-gradient(45deg, ${stat.color}, ${stat.color}CC)` 
                      : 'none',
                    WebkitBackgroundClip: isHovered ? 'text' : 'unset',
                    WebkitTextFillColor: isHovered ? 'transparent' : 'inherit',
                    backgroundClip: isHovered ? 'text' : 'unset',
                  }}>
                    {stat.value}
                  </span>
                </>
              )}
            </div>
            
            <div style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              marginTop: 6, 
              opacity: isHovered ? 0.9 : 0.7,
              transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'all 0.3s ease',
            }}>
              equipos
            </div>

            {/* Efecto de brillo en hover */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shine 1.5s ease-in-out infinite',
                borderRadius: 'inherit',
              }} />
            )}
          </div>
        );
      })}
      
      {/* Animaciones CSS mejoradas */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(90deg); }
        }
        
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
          }
          50% { 
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
          }
        }
      `}</style>
    </div>
  );
}
