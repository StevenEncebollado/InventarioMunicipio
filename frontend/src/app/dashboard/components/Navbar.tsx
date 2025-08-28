import type { Usuario } from '@/types';

interface NavbarProps {
  user: Usuario | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="navbar" style={{background: 'linear-gradient(90deg, #3498db 0%, #2ecc71 100%)', color: '#fff', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div className="nav-brand">
        <h1 style={{fontWeight: 800, fontSize: '2.2rem', letterSpacing: '1px'}}>Inventario Municipio</h1>
      </div>
      <div className="nav-user">
        {user && (
          <>
            <span style={{fontWeight: 600, fontSize: '1.1rem'}}>Bienvenido, <strong>{user.username}</strong></span>
            <span style={{marginLeft: 8, fontStyle: 'italic', fontSize: '1rem'}}>({user.rol})</span>
            <button 
              onClick={onLogout} 
              style={{marginLeft: 18, padding: '8px 18px', borderRadius: '6px', background: '#e74c3c', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer'}}
              type="button"
            >
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
