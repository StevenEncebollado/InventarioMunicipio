import { FaServer, FaCheckCircle, FaTools, FaBan } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

interface EstadisticasProps {
  total: number;
  active: number;
  maintenance: number;
  inactive: number;
}

export default function Estadisticas({ total, active, maintenance, inactive }: EstadisticasProps) {
  usePulseKeyframes();
  return (
    <div className="dashboard-header">
      <h2>
        <MdDashboard style={{ color: '#2563eb', fontSize: '2rem', marginRight: 10, animation: 'pulse 2s infinite alternate' }} />
        Panel de Control
      </h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <span className="stat-number">
            <FaServer style={{ color: '#2563eb', marginRight: 8, verticalAlign: 'middle', animation: 'pulse 2s infinite alternate' }} />
            {total}
          </span>
        </div>
        <div className="stat-card">
          <h3>Activos</h3>
          <span className="stat-number stat-success">
            <FaCheckCircle style={{ color: '#22c55e', marginRight: 8, verticalAlign: 'middle', animation: 'pulse 2s infinite alternate' }} />
            {active}
          </span>
        </div>
        <div className="stat-card">
          <h3>Mantenimiento</h3>
          <span className="stat-number stat-warning">
            <FaTools style={{ color: '#facc15', marginRight: 8, verticalAlign: 'middle', animation: 'pulse 2s infinite alternate' }} />
            {maintenance}
          </span>
        </div>
        <div className="stat-card">
          <h3>Inactivos</h3>
          <span className="stat-number stat-danger">
            <FaBan style={{ color: '#ef4444', marginRight: 8, verticalAlign: 'middle', animation: 'pulse 2s infinite alternate' }} />
            {inactive}
          </span>
        </div>
      </div>
    </div>
  );
}


// Animación sutil para los íconos (solo en cliente)
import { useEffect } from 'react';

function usePulseKeyframes() {
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('pulse-keyframes')) {
      const style = document.createElement('style');
      style.id = 'pulse-keyframes';
      style.innerHTML = `@keyframes pulse { 0% { transform: scale(1);} 100% { transform: scale(1.12);} }`;
      document.head.appendChild(style);
    }
  }, []);
}
