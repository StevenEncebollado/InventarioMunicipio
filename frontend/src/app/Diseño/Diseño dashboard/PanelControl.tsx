

import React from 'react';
import { FaServer, FaCheckCircle, FaTools, FaBan, FaInfoCircle } from 'react-icons/fa';
import { estiloPanelControl } from '../Estilos/EstiloPanelControl';
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
  const stats = [
    { 
      type: 'total' as const, 
      value: total, 
      title: 'TOTAL DE EQUIPOS', 
      icon: FaServer, 
      style: { ...estiloPanelControl.cardBase, ...estiloPanelControl.cardTotal } 
    },
    { 
      type: 'active' as const, 
      value: active, 
      title: 'EQUIPOS ACTIVOS', 
      icon: FaCheckCircle, 
      style: { ...estiloPanelControl.cardBase, ...estiloPanelControl.cardActive } 
    },
    { 
      type: 'maintenance' as const, 
      value: maintenance, 
      title: 'EN MANTENIMIENTO', 
      icon: FaTools, 
      style: { ...estiloPanelControl.cardBase, ...estiloPanelControl.cardMaintenance } 
    },
    { 
      type: 'inactive' as const, 
      value: inactive, 
      title: 'EQUIPOS INACTIVOS', 
      icon: FaBan, 
      style: { ...estiloPanelControl.cardBase, ...estiloPanelControl.cardInactive } 
    },
  ];

  return (
    <div style={estiloPanelControl.container}>
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        
        return (
          <div 
            key={stat.type}
            style={{
              ...stat.style,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => onInfoClick(stat.type)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(56,189,248,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(56,189,248,0.08)';
            }}
          >
            <button 
              style={estiloPanelControl.iconButton} 
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick(stat.type);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FaInfoCircle size={18} />
            </button>
            
            <div style={estiloPanelControl.cardTitle}>
              {stat.title}
            </div>
            
            <div style={{
              ...estiloPanelControl.cardValue,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {loading ? (
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid rgba(0,0,0,0.1)',
                  borderTopColor: 'currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
              ) : (
                <>
                  <IconComponent size={24} />
                  {stat.value}
                </>
              )}
            </div>
            
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4, opacity: 0.8 }}>
              equipos
            </div>
          </div>
        );
      })}
      
      {/* Animaciones CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
