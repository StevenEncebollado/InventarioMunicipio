

import { FaCity, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import type { Usuario } from '@/types';
import { useRouter } from 'next/navigation';
import { navbarStyles } from '../Estilos/Navbar.estilo';

interface NavbarProps {
  user: Usuario | null;
  onLogout: () => void;
}

// Animación simple para el ícono (solo en cliente)
import { useEffect } from 'react';

function useSpinKeyframes() {
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('spin-keyframes')) {
      const style = document.createElement('style');
      style.id = 'spin-keyframes';
      style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`;
      document.head.appendChild(style);
    }
  }, []);
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  useSpinKeyframes();
  const router = useRouter();
  const handleGoHome = () => {
    router.push('/dashboard');
  };
  return (
    <nav style={navbarStyles.navbar}>
      <div style={navbarStyles.navBrand}>
        <FaCity style={{ fontSize: '2.1rem', color: '#fff', animation: 'spin 2.5s linear infinite' }} />
        <button
          onClick={handleGoHome}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.6rem',
            fontWeight: 700,
            cursor: 'pointer',
            margin: 0,
            padding: 0,
          }}
        >
          Inventario Municipio
        </button>
      </div>
      <div style={navbarStyles.navUser}>
        {user && (
          <>
            <FaUserCircle style={{ fontSize: '1.5rem', marginRight: 6, color: '#fff' }} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Bienvenido, <strong>{user.username}</strong></span>
            <button
              onClick={onLogout}
              type="button"
              style={navbarStyles.logoutBtn}
              onMouseOver={e => Object.assign(e.currentTarget.style, navbarStyles.logoutBtnHover)}
              onMouseOut={e => Object.assign(e.currentTarget.style, navbarStyles.logoutBtn)}
            >
              <FaSignOutAlt style={{ fontSize: '1.1rem', marginRight: 4 }} />
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
