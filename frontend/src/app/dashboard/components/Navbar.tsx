import { FaCity, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import type { Usuario } from '@/types';

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

// Usar hook en el componente
export default function Navbar({ user, onLogout }: NavbarProps) {
  useSpinKeyframes();
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <FaCity style={{ fontSize: '2.1rem', marginRight: 8, color: '#fff', animation: 'spin 2.5s linear infinite' }} />
        <h1>Inventario Municipio</h1>
      </div>
      <div className="nav-user">
        {user && (
          <>
            <FaUserCircle style={{ fontSize: '1.5rem', marginRight: 6, color: '#fff' }} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Bienvenido, <strong>{user.username}</strong></span>
            <span style={{ marginLeft: 8, fontStyle: 'italic', fontSize: '1rem', color: '#c7d2fe' }}>({user.rol})</span>
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
