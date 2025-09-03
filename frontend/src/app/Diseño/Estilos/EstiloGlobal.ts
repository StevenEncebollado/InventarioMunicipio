// Estilos modulares para utilidades, estados y badges globales
export const estiloGlobal = {
  statusBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    borderRadius: '50px',
  },
  statusActivo: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusInactivo: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  statusMantenimiento: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  alert: {
    position: 'relative' as const,
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
  alertClose: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'inherit',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  spinner: {
    fontSize: '1.1rem',
    color: '#64748b',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: '1.5rem',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: '0.9rem',
    textAlign: 'center' as const,
    padding: '1rem',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '12px',
    marginTop: '1rem',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#64748b',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  serialCode: {
    fontFamily: 'Courier New, monospace',
    backgroundColor: '#f8f9fa',
    padding: '0.25rem 0.5rem',
    borderRadius: '3px',
    fontSize: '0.85rem',
    border: '1px solid #e9ecef',
  },
  // Dashboard y estadísticas
  dashboard: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  dashboardContent: {
    flex: 1,
    padding: '2rem',
  },
  dashboardHeader: {
    marginBottom: '2rem',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '2.5rem 0 0.5rem 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: '#fff',
    padding: '2rem 1.5rem 1.5rem 1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(30,41,59,0.07)',
    textAlign: 'center' as const,
    borderBottom: '4px solid #2563eb',
    transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  statCardHover: {
    transform: 'translateY(-4px) scale(1.03)',
    boxShadow: '0 4px 16px rgba(30,41,59,0.10)',
  },
  statNumber: {
    display: 'block',
    fontSize: '2.7rem',
    fontWeight: 800,
    color: '#2563eb',
    transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
  },
  statNumberSuccess: {
    color: '#22c55e',
  },
  statNumberWarning: {
    color: '#facc15',
  },
  statNumberDanger: {
    color: '#ef4444',
  },
};
