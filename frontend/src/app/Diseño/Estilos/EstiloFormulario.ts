// Estilos modulares para formularios y login
export const estiloFormulario = {
  formContainer: {
    maxWidth: 450,
    margin: '10vh auto',
    padding: '2rem',
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(30,41,59,0.10)',
  },
  logoSection: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  logoH1: {
    color: '#2563eb',
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  logoP: {
    color: '#64748b',
    fontSize: '0.95rem',
  },
  loginForm: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  formLabel: {
    fontWeight: 500,
    color: '#1e293b',
    fontSize: '0.9rem',
  },
  formInput: {
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    fontSize: '1rem',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  formInputFocus: {
    outline: 'none',
    borderColor: '#2563eb',
    boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)',
  },
  formInputDisabled: {
    backgroundColor: '#f8f9fa',
    cursor: 'not-allowed',
  },
};
