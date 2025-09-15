

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
      title: 'TOTAL OPERATIVO', 
      subtitle: 'Activos + Mantenimiento',
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
            className="panel-card"
            style={{
              ...stat.style,
              cursor: 'pointer',
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: isHovered 
                ? 'translateY(-16px) rotateX(8deg) rotateY(2deg) scale(1.03)' 
                : isClicked 
                ? 'translateY(-8px) rotateX(4deg) scale(0.98)' 
                : 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)',
              boxShadow: isHovered
                ? `
                  0 25px 50px rgba(0, 0, 0, 0.25),
                  0 12px 24px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.9),
                  0 0 0 1px rgba(255, 255, 255, 0.4)
                `
                : `
                  0 8px 25px rgba(0, 0, 0, 0.08),
                  0 4px 10px rgba(0, 0, 0, 0.06),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
              filter: isHovered ? 'brightness(1.08) saturate(1.1)' : 'brightness(1)',
              borderRadius: '20px',
              position: 'relative',
              overflow: 'hidden',
              transformStyle: 'preserve-3d',
              perspective: '1000px',
              willChange: 'transform, box-shadow, filter',
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
              {(stat as any).subtitle && (
                <div style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  marginTop: '2px',
                  opacity: 0.8,
                  color: '#6b7280'
                }}>
                  {(stat as any).subtitle}
                </div>
              )}
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
                  animation: 'panelSpin 1s linear infinite',
                }} />
              ) : (
                <>
                  <IconComponent 
                    size={28} 
                    style={{
                      transform: isHovered ? 'rotateY(15deg) rotateX(5deg) scale(1.15)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
                      transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      filter: isHovered ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      animation: 'float1 4s ease-in-out infinite',
                      transformStyle: 'preserve-3d',
                    }}
                  />
                  <span style={{
                    backgroundImage: isHovered 
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
              animation: 'float3 4s ease-in-out infinite',
              position: 'relative',
              zIndex: 2,
            }}>
              equipos
            </div>

            {/* Efecto moderno de brillo */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: isHovered 
                ? 'linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)'
                : 'none',
              backgroundSize: '300% 300%',
              backgroundPosition: isHovered ? '0% 0%' : '-200% 0%',
              animation: isHovered ? 'shimmer 3s ease-in-out infinite' : 'none',
              borderRadius: 'inherit',
              zIndex: 1,
              transformStyle: 'preserve-3d',
            }} />

            {/* Partículas modernas al hover */}
            {isHovered && (
              <>
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '20%',
                  width: '3px',
                  height: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                  animation: 'modernFloat 2s ease-in-out infinite',
                  zIndex: 2,
                  filter: 'blur(0.5px)',
                  transformStyle: 'preserve-3d',
                }} />
                <div style={{
                  position: 'absolute',
                  top: '60%',
                  left: '80%',
                  width: '2px',
                  height: '2px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '50%',
                  animation: 'modernPulse 1.5s ease-in-out infinite',
                  animationDelay: '0.5s',
                  zIndex: 2,
                  filter: 'blur(0.3px)',
                  transformStyle: 'preserve-3d',
                }} />
                <div style={{
                  position: 'absolute',
                  top: '40%',
                  left: '15%',
                  width: '4px',
                  height: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '50%',
                  animation: 'modernDrift 3s ease-in-out infinite',
                  animationDelay: '1s',
                  zIndex: 2,
                  filter: 'blur(0.8px)',
                  transformStyle: 'preserve-3d',
                }} />
              </>
            )}
          </div>
        );
      })}
      
      {/* Animaciones CSS mejoradas */}
      <style jsx>{`
        @keyframes panelSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float1 {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg); 
          }
          50% { 
            transform: translateY(-8px) rotateX(2deg); 
          }
        }
        
        @keyframes float2 {
          0%, 100% { 
            transform: translateY(0px) rotateY(0deg); 
          }
          50% { 
            transform: translateY(-6px) rotateY(1deg); 
          }
        }
        
        @keyframes float3 {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg) rotateY(0deg); 
          }
          50% { 
            transform: translateY(-4px) rotateX(1deg) rotateY(0.5deg); 
          }
        }
        
        @keyframes shine {
          0% { 
            transform: translateX(-100%); 
          }
          100% { 
            transform: translateX(100%); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.02);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
          }
          50% { 
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
          }
        }

        @keyframes modernFloat {
          0%, 100% { 
            transform: translateY(0px) translateZ(0px) scale(1); 
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-12px) translateZ(8px) scale(1.1); 
            opacity: 0.8;
          }
        }

        @keyframes modernPulse {
          0%, 100% { 
            transform: scale(1) translateZ(0px); 
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.3) translateZ(4px); 
            opacity: 0.7;
          }
        }

        @keyframes modernDrift {
          0% { 
            transform: translateX(0px) translateY(0px) translateZ(0px) rotateY(0deg); 
            opacity: 0.5;
          }
          33% { 
            transform: translateX(8px) translateY(-6px) translateZ(3px) rotateY(120deg); 
            opacity: 0.8;
          }
          66% { 
            transform: translateX(-4px) translateY(-12px) translateZ(6px) rotateY(240deg); 
            opacity: 0.6;
          }
          100% { 
            transform: translateX(0px) translateY(0px) translateZ(0px) rotateY(360deg); 
            opacity: 0.5;
          }
        }

        @keyframes shimmer {
          0% { 
            backgroundPosition: -200% 0;
            transform: translateZ(0px);
          }
          100% { 
            backgroundPosition: 200% 0;
            transform: translateZ(2px);
          }
        }
        
        /* Efecto hover limpio */
        .panel-card {
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          perspective: 1200px;
          backface-visibility: hidden;
        }
        
        .panel-card * {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
