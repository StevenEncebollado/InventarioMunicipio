// Estilos modulares para PanelControl
export const estiloPanelControl = {
  container: {
    display: 'flex' as const,
    gap: 32,
    marginBottom: 48,
    marginTop: 32,
    justifyContent: 'center' as const,
    width: '100%',
  },
  cardBase: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(56,189,248,0.08)',
    padding: '36px 48px',
    minWidth: 220,
    minHeight: 140,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
    marginBottom: 0,
    marginTop: 0,
    transition: 'box-shadow 0.2s',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'absolute' as const,
    top: 16,
    right: 18,
    padding: 0,
    color: 'inherit',
    outline: 'none',
  },
  cardTitle: {
    fontWeight: 600,
    color: '#555',
    fontSize: 17,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 700,
  },
  cardTotal: {
    borderBottom: '3px solid #2563eb',
    color: '#2563eb',
  },
  cardActive: {
    borderBottom: '3px solid #22c55e',
    color: '#22c55e',
  },
  cardMaintenance: {
    borderBottom: '3px solid #facc15',
    color: '#facc15',
  },
  cardInactive: {
    borderBottom: '3px solid #ef4444',
    color: '#ef4444',
  },
};
