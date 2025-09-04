// Estilos consolidados para componentes UI
// Combina botones, formularios, modales y tablas

export const EstiloComponentesUI = {
  // ===== BOTONES =====
  botones: {
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
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
    },
    btnSecondary: {
      background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(100,116,139,0.25)',
    },
    btnSuccess: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
    },
    btnWarning: {
      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(217,119,6,0.25)',
    },
    btnDanger: {
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
    },
    btnOutline: {
      background: 'transparent',
      color: '#2563eb',
      border: '1px solid #2563eb',
    },
    btnGhost: {
      background: 'transparent',
      color: '#374151',
      border: 'none',
    },
    btnIcon: {
      width: 40,
      height: 40,
      padding: 0,
      borderRadius: 8,
    },
    btnSm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    },
    btnLg: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
    },
  },

  // ===== FORMULARIOS =====
  formularios: {
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
    logoSubtitle: {
      color: '#64748b',
      fontSize: '1rem',
      fontWeight: 400,
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#374151',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: 8,
      outline: 'none',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box' as const,
    },
    inputFocus: {
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37,99,235,0.10)',
    },
    inputError: {
      borderColor: '#dc2626',
      boxShadow: '0 0 0 3px rgba(220,38,38,0.10)',
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: 8,
      outline: 'none',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box' as const,
      background: 'white',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: 8,
      outline: 'none',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box' as const,
      resize: 'vertical' as const,
      minHeight: 100,
    },
    errorMessage: {
      color: '#dc2626',
      fontSize: '0.875rem',
      marginTop: '0.25rem',
    },
    helpText: {
      color: '#6b7280',
      fontSize: '0.875rem',
      marginTop: '0.25rem',
    },
  },

  // ===== MODALES =====
  modales: {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.25)',
      zIndex: 1000,
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    modal: {
      background: '#fff',
      borderRadius: 12,
      padding: 0,
      minWidth: 350,
      maxWidth: 500,
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    },
    header: {
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#111827',
      margin: 0,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6b7280',
      padding: 4,
      borderRadius: 4,
    },
    body: {
      padding: '1.5rem',
      maxHeight: '60vh',
      overflow: 'auto',
    },
    footer: {
      padding: '1rem 1.5rem',
      borderTop: '1px solid #e5e7eb',
      display: 'flex' as const,
      justifyContent: 'flex-end' as const,
      gap: '0.75rem',
    },
  },

  // ===== TABLAS =====
  tablas: {
    tableContainer: {
      background: 'white',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(30,41,59,0.08)',
    },
    tableHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    tableTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#111827',
      margin: 0,
    },
    tableActions: {
      display: 'flex' as const,
      gap: '0.75rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
    th: {
      background: '#f9fafb',
      padding: '1rem',
      textAlign: 'left' as const,
      fontWeight: 600,
      color: '#374151',
      fontSize: '0.875rem',
      borderBottom: '1px solid #e5e7eb',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #f3f4f6',
      color: '#374151',
      fontSize: '0.875rem',
    },
    trHover: {
      transition: 'background-color 0.15s ease',
    },
    pagination: {
      padding: '1rem 1.5rem',
      borderTop: '1px solid #e5e7eb',
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    paginationInfo: {
      color: '#6b7280',
      fontSize: '0.875rem',
    },
    paginationControls: {
      display: 'flex' as const,
      gap: '0.5rem',
    },
  },

  // ===== ALERTS =====
  alerts: {
    alert: {
      padding: '1rem',
      borderRadius: 8,
      marginBottom: '1rem',
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'flex-start' as const,
    },
    alertSuccess: {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0',
    },
    alertError: {
      background: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #fecaca',
    },
    alertWarning: {
      background: '#fffbeb',
      color: '#92400e',
      border: '1px solid #fed7aa',
    },
    alertInfo: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '1px solid #bfdbfe',
    },
    alertClose: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.25rem',
      opacity: 0.7,
      padding: 0,
      marginLeft: '0.5rem',
    },
  },
};
