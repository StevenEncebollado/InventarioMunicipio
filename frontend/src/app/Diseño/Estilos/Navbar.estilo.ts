// Estilos modulares para el Navbar - DISEÑO MEJORADO
export const navbarStyles = {
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
    color: '#adb5bd',
  },
  logoutBtn: {
    fontSize: '0.875rem',
    padding: '0.6rem 1.4rem',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: 16,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginLeft: 20,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  logoutBtnHover: {
    background: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.5)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
  },
};
