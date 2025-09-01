
import React from 'react';
import { FaServer, FaCheckCircle, FaTools, FaBan, FaInfoCircle } from 'react-icons/fa';

interface PanelControlProps {
  total: number;
  active: number;
  maintenance: number;
  inactive: number;
  onInfoClick: (type: 'total' | 'active' | 'maintenance' | 'inactive') => void;
}


export default function PanelControl({ total, active, maintenance, inactive, onInfoClick }: PanelControlProps) {
  // Estilos de card grandes
  const cardBase: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(56,189,248,0.08)',
    padding: '36px 48px 36px 48px', // más espacio arriba y abajo
    minWidth: 220,
    minHeight: 140,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 0,
    marginTop: 0,
    transition: 'box-shadow 0.2s',
  };
  const iconButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'absolute',
    top: 16,
    right: 18,
    padding: 0,
    color: 'inherit',
    outline: 'none',
  };
  return (
    <div style={{ display: 'flex', gap: 32, marginBottom: 48, marginTop: 32, justifyContent: 'center', width: '100%' }}>
      {/* Total */}
      <div style={{ ...cardBase, borderBottom: '3px solid #2563eb' }}>
        <div style={{ fontWeight: 600, color: '#555', fontSize: 17, marginBottom: 8 }}>Total</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaServer style={{ fontSize: 32, color: '#2563eb' }} />
          <span style={{ fontSize: 28, fontWeight: 700, color: '#2563eb' }}>{total}</span>
          <button title="Ver detalles" onClick={() => onInfoClick('total')} style={{ ...iconButtonStyle, color: '#2563eb', position: 'static', marginLeft: 6 }}>
            <FaInfoCircle style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
      {/* Activos */}
      <div style={{ ...cardBase, borderBottom: '3px solid #22c55e' }}>
        <div style={{ fontWeight: 600, color: '#555', fontSize: 17, marginBottom: 8 }}>Activos</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaCheckCircle style={{ fontSize: 32, color: '#22c55e' }} />
          <span style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>{active}</span>
          <button title="Ver detalles" onClick={() => onInfoClick('active')} style={{ ...iconButtonStyle, color: '#22c55e', position: 'static', marginLeft: 6 }}>
            <FaInfoCircle style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
      {/* Mantenimiento */}
      <div style={{ ...cardBase, borderBottom: '3px solid #facc15' }}>
        <div style={{ fontWeight: 600, color: '#555', fontSize: 17, marginBottom: 8 }}>Mantenimiento</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaTools style={{ fontSize: 32, color: '#facc15' }} />
          <span style={{ fontSize: 28, fontWeight: 700, color: '#facc15' }}>{maintenance}</span>
          <button title="Ver detalles" onClick={() => onInfoClick('maintenance')} style={{ ...iconButtonStyle, color: '#facc15', position: 'static', marginLeft: 6 }}>
            <FaInfoCircle style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
      {/* Inactivos */}
      <div style={{ ...cardBase, borderBottom: '3px solid #ef4444' }}>
        <div style={{ fontWeight: 600, color: '#555', fontSize: 17, marginBottom: 8 }}>Inactivos</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaBan style={{ fontSize: 32, color: '#ef4444' }} />
          <span style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{inactive}</span>
          <button title="Ver detalles" onClick={() => onInfoClick('inactive')} style={{ ...iconButtonStyle, color: '#ef4444', position: 'static', marginLeft: 6 }}>
            <FaInfoCircle style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
