
import { FaCity, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import type { Usuario } from '@/types';
import { useRouter } from 'next/navigation';

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
    <nav className="navbar">
      <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaCity style={{ fontSize: '2.1rem', marginRight: 0, color: '#fff', animation: 'spin 2.5s linear infinite' }} />
        <button onClick={handleGoHome} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.6rem', fontWeight: 700, cursor: 'pointer', margin: 0, padding: 0 }}>
          Inventario Municipio
        </button>
      </div>
      <div className="nav-user">
        {user && (
          <>
            <FaUserCircle style={{ fontSize: '1.5rem', marginRight: 6, color: '#fff' }} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Bienvenido, <strong>{user.username}</strong></span>
            <button 
              onClick={onLogout}
              className="btn btn-secondary"
              style={{ marginLeft: 18, display: 'flex', alignItems: 'center', gap: 6 }}
              type="button"
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
