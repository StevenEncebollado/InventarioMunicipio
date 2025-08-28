interface EstadisticasProps {
  total: number;
  active: number;
  maintenance: number;
  inactive: number;
}

export default function Estadisticas({ total, active, maintenance, inactive }: EstadisticasProps) {
  return (
    <div className="dashboard-header" style={{maxWidth: 1200, margin: '0 auto', padding: '32px 0'}}>
      <h2 style={{fontWeight: 700, fontSize: '2rem', color: '#222'}}>Panel de Control</h2>
      <div className="stats-grid" style={{display: 'flex', gap: '32px', margin: '32px 0'}}>
        <div className="stat-card" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', flex: 1, textAlign: 'center'}}>
          <h3 style={{color: '#2980b9'}}>Total</h3>
          <span style={{fontWeight: 700, fontSize: '2.2rem'}}>{total}</span>
        </div>
        <div className="stat-card" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', flex: 1, textAlign: 'center'}}>
          <h3 style={{color: '#27ae60'}}>Activos</h3>
          <span style={{fontWeight: 700, fontSize: '2.2rem', color: '#27ae60'}}>{active}</span>
        </div>
        <div className="stat-card" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', flex: 1, textAlign: 'center'}}>
          <h3 style={{color: '#f1c40f'}}>Mantenimiento</h3>
          <span style={{fontWeight: 700, fontSize: '2.2rem', color: '#f1c40f'}}>{maintenance}</span>
        </div>
        <div className="stat-card" style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '24px', flex: 1, textAlign: 'center'}}>
          <h3 style={{color: '#e74c3c'}}>Inactivos</h3>
          <span style={{fontWeight: 700, fontSize: '2.2rem', color: '#e74c3c'}}>{inactive}</span>
        </div>
      </div>
    </div>
  );
}
