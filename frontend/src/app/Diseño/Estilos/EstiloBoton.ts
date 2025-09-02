// Estilos modulares para botones
export const estiloBoton = {
  btn: {
    display: 'inline-flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    textAlign: 'center' as const,
    textDecoration: 'none',
    border: '1px solid transparent',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    lineHeight: 1.2,
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
    color: 'white',
  },
  btnPrimaryHover: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  btnSecondary: {
    backgroundColor: '#64748b',
    borderColor: '#64748b',
    color: 'white',
  },
  btnSecondaryHover: {
    backgroundColor: '#545b62',
    borderColor: '#545b62',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderColor: '#e2e8f0',
    color: '#1e293b',
  },
  btnOutlineHover: {
    backgroundColor: '#f8fafc',
  },
  btnSm: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
  },
};
