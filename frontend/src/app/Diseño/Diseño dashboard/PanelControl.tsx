

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
  return (
    <div style={estiloPanelControl.container}>
      {/* Total */}
      <div style={{ ...estiloPanelControl.cardBase, ...estiloPanelControl.cardTotal }}>
        <div style={estiloPanelControl.cardTitle}>Total</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaServer style={{ fontSize: 32, color: '#2563eb' }} />
          {loading ? (
            <div style={{ ...estiloGlobal.spinner, width: 28, height: 28, color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#2563eb" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
            </div>
          ) : (
            <span style={{ ...estiloPanelControl.cardValue, color: '#2563eb' }}>{total}</span>
          )}
          <button title="Ver detalles" onClick={() => onInfoClick('total')} style={{ ...estiloPanelControl.iconButton, color: '#2563eb', position: 'static', marginLeft: 6 }}>
            <FaInfoCircle style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
      {/* Activos */}
      <div style={{ ...estiloPanelControl.cardBase, ...estiloPanelControl.cardActive }}>
        <div style={estiloPanelControl.cardTitle}>Activos</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaCheckCircle style={{ fontSize: 32, color: '#22c55e' }} />
          {loading ? (
            <div style={{ ...estiloGlobal.spinner, width: 28, height: 28, color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
            </div>
          ) : (
            <span style={{ ...estiloPanelControl.cardValue, color: '#22c55e' }}>{active}</span>
          )}
          <button title="Ver detalles" onClick={() => onInfoClick('active')} style={{ ...estiloPanelControl.iconButton, color: '#22c55e', position: 'static', marginLeft: 6 }}>
            <FaInfoCircle style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
      {/* Mantenimiento */}
      <div style={{ ...estiloPanelControl.cardBase, ...estiloPanelControl.cardMaintenance }}>
        <div style={estiloPanelControl.cardTitle}>Mantenimiento</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaTools style={{ fontSize: 32, color: '#facc15' }} />
          {loading ? (
            <div style={{ ...estiloGlobal.spinner, width: 28, height: 28, color: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#facc15" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
            </div>
          ) : (
            <span style={{ ...estiloPanelControl.cardValue, color: '#facc15' }}>{maintenance}</span>
          )}
          <button title="Ver detalles" onClick={() => onInfoClick('maintenance')} style={{ ...estiloPanelControl.iconButton, color: '#facc15', position: 'static', marginLeft: 6 }}>
            <FaInfoCircle style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
      {/* Inactivos */}
      <div style={{ ...estiloPanelControl.cardBase, ...estiloPanelControl.cardInactive }}>
        <div style={estiloPanelControl.cardTitle}>Inactivos</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaBan style={{ fontSize: 32, color: '#ef4444' }} />
          {loading ? (
            <div style={{ ...estiloGlobal.spinner, width: 28, height: 28, color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></circle></svg>
            </div>
          ) : (
            <span style={{ ...estiloPanelControl.cardValue, color: '#ef4444' }}>{inactive}</span>
          )}
          <button title="Ver detalles" onClick={() => onInfoClick('inactive')} style={{ ...estiloPanelControl.iconButton, color: '#ef4444', position: 'static', marginLeft: 6 }}>
            <FaInfoCircle style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
