// Estilos consolidados específicos del dashboard
// Combina Navbar y PanelControl específicos del dashboard

export const EstiloDashboardEspecifico = {
  // ===== NAVBAR =====
  navbar: {
    navbar: {
      background: `
        linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(56, 189, 248, 0.95) 100%),
        linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)
      `,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: '#fff',
      padding: '1.4rem 2.8rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: `
        0 8px 32px rgba(37, 99, 235, 0.3),
        0 4px 16px rgba(0,0,0,0.1),
        inset 0 1px 0 rgba(255,255,255,0.3)
      `,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      position: 'relative' as const,
      overflow: 'hidden',
    },
    navBrand: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
    },
    navBrandH1: {
      fontSize: '2.1rem',
      fontWeight: 800,
      letterSpacing: '1px',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      margin: 0,
    },
    navUser: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    },
    welcomeText: {
      fontSize: '0.9rem',
    },
    userRole: {
      fontSize: '0.8rem',
      opacity: 0.8,
      fontWeight: 400,
    },
    logoutButton: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
      border: '1px solid rgba(255,255,255,0.3)',
      color: '#fff',
      padding: '0.7rem 1.8rem',
      borderRadius: 12,
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 600,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    },
    logoutButtonHover: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.25) 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    },
  },

  // ===== PANEL CONTROL =====
  panelControl: {
    container: {
      display: 'flex' as const,
      gap: 40,
      marginBottom: 56,
      marginTop: 40,
      justifyContent: 'center' as const,
      width: '100%',
      perspective: '1000px',
    },
    cardBase: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.8)',
      borderRadius: 24,
      boxShadow: `
        0 8px 32px rgba(0,0,0,0.08),
        0 4px 16px rgba(0,0,0,0.04),
        inset 0 1px 0 rgba(255,255,255,0.9)
      `,
      padding: '40px 52px',
      minWidth: 240,
      minHeight: 160,
      display: 'flex' as const,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      position: 'relative' as const,
      marginBottom: 0,
      marginTop: 0,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transformStyle: 'preserve-3d' as const,
      overflow: 'hidden',
    },
    iconButton: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
      border: '1px solid rgba(255,255,255,0.6)',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      position: 'absolute' as const,
      top: 18,
      right: 20,
      padding: 0,
      color: 'inherit',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    number: {
      fontSize: '3.2rem',
      fontWeight: 800,
      lineHeight: 1,
      marginBottom: '16px',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
      background: 'linear-gradient(135deg, #1e293b, #475569)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    label: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#64748b',
      textAlign: 'center' as const,
      letterSpacing: '0.5px',
      lineHeight: 1.3,
    },
    total: {
      background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.18) 0%, rgba(59, 130, 246, 0.18) 100%)',
      borderColor: 'rgba(29, 78, 216, 0.45)',
    },
    active: {
      background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.18) 0%, rgba(34, 197, 94, 0.18) 100%)',
      borderColor: 'rgba(5, 150, 105, 0.45)',
    },
    maintenance: {
      background: 'linear-gradient(135deg, rgba(202, 138, 4, 0.18) 0%, rgba(245, 158, 11, 0.18) 100%)',
      borderColor: 'rgba(202, 138, 4, 0.45)',
    },
    inactive: {
      background: 'linear-gradient(135deg, rgba(185, 28, 28, 0.18) 0%, rgba(239, 68, 68, 0.18) 100%)',
      borderColor: 'rgba(185, 28, 28, 0.45)',
    },
    hover: {
      transform: 'translateY(-8px) scale(1.02) rotateX(5deg)',
      boxShadow: `
        0 20px 50px rgba(0,0,0,0.15),
        0 10px 25px rgba(0,0,0,0.08),
        inset 0 1px 0 rgba(255,255,255,1)
      `,
    },
    click: {
      transform: 'translateY(-12px) scale(1.05) rotateX(8deg)',
      boxShadow: `
        0 25px 60px rgba(0,0,0,0.2),
        0 15px 30px rgba(0,0,0,0.1),
        inset 0 1px 0 rgba(255,255,255,1)
      `,
    },
    loadingOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255,255,255,0.8)',
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: 24,
      backdropFilter: 'blur(4px)',
    },
    spinner: {
      border: '3px solid rgba(59, 130, 246, 0.2)',
      borderTop: '3px solid #3b82f6',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      animation: 'spin 1s linear infinite',
    },
  },

  // ===== CATÁLOGOS =====
  catalogos: {
    selectStyle: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      background: '#fff',
      fontFamily: 'inherit',
      marginTop: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    },
  },
};
