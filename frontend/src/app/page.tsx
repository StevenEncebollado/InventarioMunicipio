'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login, getErrorMessage, APP_CONFIG } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import type { LoginResponse } from '@/types';

export default function LoginPage() {
  // Función para evaluar la seguridad de la contraseña
  function getPasswordStrength(password: string): { level: string; color: string; score: number } {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;
    if (score <= 2) return { level: 'Bajo', color: '#e74c3c', score };
    if (score === 3) return { level: 'Moderado', color: '#f1c40f', score };
    if (score === 4) return { level: 'Alto', color: '#3498db', score };
    return { level: 'Muy Alto', color: '#27ae60', score };
  }
  const [passwordChangeRequired, setPasswordChangeRequired] = useState(false);
  const [passwordExpiryWarning, setPasswordExpiryWarning] = useState('');
  const [fechaCambioPassword, setFechaCambioPassword] = useState<string | null>(null);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const router = useRouter();
  const [currentUsername, setCurrentUsername] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    
    if (!username.trim() || !password.trim()) {
      setError('Usuario y contraseña son requeridos');
      return;
    }

    startLoading();
    try {
      const response: any = await login(username, password);
      // Guardar fecha de cambio para avisos
      if (response.fecha_cambio_password) {
        setFechaCambioPassword(response.fecha_cambio_password);
        // Calcular días restantes
        const fechaCambio = new Date(response.fecha_cambio_password);
        const hoy = new Date();
        const diasPasados = Math.floor((hoy.getTime() - fechaCambio.getTime()) / (1000 * 60 * 60 * 24));
        const diasRestantes = 90 - diasPasados;
        if (diasRestantes <= 7 && diasRestantes > 3) setPasswordExpiryWarning('Tu contraseña expirará en menos de una semana.');
        if (diasRestantes <= 3 && diasRestantes > 1) setPasswordExpiryWarning('Tu contraseña expirará en menos de 3 días.');
        if (diasRestantes === 1) setPasswordExpiryWarning('Tu contraseña expirará mañana.');
      }
      if (response.require_password_change) {
        setPasswordChangeRequired(true);
        setShowPasswordChangeModal(true);
        setError('Debes cambiar tu contraseña antes de continuar.');
        return;
      }
      if (response.id) {
        localStorage.setItem(APP_CONFIG.session.storageKey, JSON.stringify(response));
        router.push('/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err: any) {
      if (err && err.status === 401 && err.message && err.message.includes('Tu usuario o contraseña son incorrectos')) {
        setError('Tu usuario o contraseña son incorrectos');
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      stopLoading();
    }
  };

  const userId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(APP_CONFIG.session.storageKey) || '{}').id : null;

  return (
  <div className="form-container">
      <div className="logo-section">
        <h1>Inventario Municipio</h1>
        <p>Sistema de Gestión de Equipos</p>
      </div>
      
  <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            id="username"
            type="text"
            placeholder="Ingrese su usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
            required
          />
        </div>
        
        <div className="form-group" style={{ position: 'relative' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            required
            style={{ paddingRight: '2.5rem' }}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '2.2rem',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              height: '2rem',
              width: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showPassword ? (
              // Ojo abierto
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            ) : (
              // Ojo cerrado
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.442-4.362M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.284 5.255M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
            )}
          </button>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={() => {
            setShowRegister(true);
            setRegisterError('');
            setRegisterUsername('');
            setRegisterPassword('');
          }}
        >
          Registrarse
        </button>
      </form>
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {passwordExpiryWarning && !passwordChangeRequired && (
        <div className="warning-message" style={{ color: '#e67e22', margin: '1rem 0', textAlign: 'center' }}>
          {passwordExpiryWarning}
        </div>
      )}
      {/* Modal de cambio de contraseña obligatorio */}
      {showPasswordChangeModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '320px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Cambio de Contraseña Obligatorio</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setChangePasswordError('');
                const strength = getPasswordStrength(newPassword);
                if (!currentUsername.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
                  setChangePasswordError('Todos los campos son requeridos');
                  return;
                }
                if (newPassword !== confirmNewPassword) {
                  setChangePasswordError('Las contraseñas no coinciden');
                  return;
                }
                if (strength.level === 'Bajo' || strength.level === 'Moderado') {
                  setChangePasswordError('La contraseña es demasiado débil. Por favor, aumenta la seguridad.');
                  return;
                }
                if (newPassword === password) {
                  setChangePasswordError('La nueva contraseña no puede ser igual a la anterior.');
                  return;
                }
                try {
                  const res = await fetch(`http://localhost:5000/usuarios/reset_password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: currentUsername, actual: password, nueva: newPassword })
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setShowPasswordChangeModal(false);
                    setPasswordChangeRequired(false);
                    setError('');
                    alert('Contraseña cambiada correctamente. Inicia sesión nuevamente.');
                    setPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setCurrentUsername('');
                  } else {
                    setChangePasswordError(data.error || 'Error al cambiar la contraseña');
                  }
                } catch (err) {
                  setChangePasswordError('Error de red o servidor');
                }
              }}
            >
              <div className="form-group">
                <label htmlFor="current-username">Usuario actual:</label>
                <input
                  id="current-username"
                  type="text"
                  value={currentUsername}
                  onChange={e => setCurrentUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#555' }}>
                <strong>Indicaciones para la contraseña:</strong>
                <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0' }}>
                  <li style={{ color: registerPassword.length >= 8 ? 'green' : '#555', fontWeight: registerPassword.length >= 8 ? 600 : 400 }}>
                    - Mínimo 8 caracteres
                  </li>
                  <li style={{ color: /[A-Z]/.test(registerPassword) ? 'green' : '#555', fontWeight: /[A-Z]/.test(registerPassword) ? 600 : 400 }}>
                    - Al menos una mayúscula
                  </li>
                  <li style={{ color: /[a-z]/.test(registerPassword) ? 'green' : '#555', fontWeight: /[a-z]/.test(registerPassword) ? 600 : 400 }}>
                    - Al menos una minúscula
                  </li>
                  <li style={{ color: /[0-9]/.test(registerPassword) ? 'green' : '#555', fontWeight: /[0-9]/.test(registerPassword) ? 600 : 400 }}>
                    - Al menos un número
                  </li>
                  <li style={{ color: /[^A-Za-z0-9]/.test(registerPassword) ? 'green' : '#555', fontWeight: /[^A-Za-z0-9]/.test(registerPassword) ? 600 : 400 }}>
                    - Al menos un símbolo especial
                  </li>
                </ul>
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="new-password">Nueva contraseña:</label>
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowNewPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '2.2rem',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    height: '2rem',
                    width: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showNewPassword ? (
                    // Ojo abierto
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    // Ojo cerrado
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.442-4.362M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.284 5.255M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  )}
                </button>
                {/* Barra de seguridad */}
                <div style={{ marginTop: '0.5rem' }}>
                  {newPassword && (() => {
                    const strength = getPasswordStrength(newPassword);
                    return (
                      <div>
                        <div style={{ height: '6px', borderRadius: '4px', background: '#eee', marginBottom: '0.3rem' }}>
                          <div style={{ width: `${strength.score * 20}%`, height: '100%', background: strength.color, borderRadius: '4px', transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ color: strength.color, fontWeight: 'bold', fontSize: '0.95rem' }}>
                          Seguridad: {strength.level}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="confirm-new-password">Confirmar nueva contraseña:</label>
                <input
                  id="confirm-new-password"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  aria-label={showConfirmNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowConfirmNewPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '2.2rem',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    height: '2rem',
                    width: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showConfirmNewPassword ? (
                    // Ojo abierto
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    // Ojo cerrado
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.442-4.362M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.284 5.255M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Cambiar contraseña
              </button>
              {changePasswordError && (
                <div className="error-message" role="alert" style={{ marginTop: '1rem' }}>
                  {changePasswordError}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {/* Modal de registro */}
      {showRegister && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '320px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Registro de Usuario</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setRegisterError('');
                const strength = getPasswordStrength(registerPassword);
                if (!registerUsername.trim() || !registerPassword.trim() || !registerConfirmPassword.trim()) {
                  setRegisterError('Todos los campos son requeridos');
                  return;
                }
                if (registerPassword !== registerConfirmPassword) {
                  setRegisterError('Las contraseñas no coinciden');
                  return;
                }
                if (strength.level === 'Bajo' || strength.level === 'Moderado') {
                  setRegisterError('La contraseña es demasiado débil. Por favor, aumenta la seguridad.');
                  return;
                }
                setRegisterLoading(true);
                try {
                  // Llamar al endpoint de registro del backend
                  const res = await fetch('http://localhost:8081/usuarios/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: registerUsername, password: registerPassword })
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setShowRegister(false);
                    alert('Usuario registrado exitosamente');
                  } else {
                    setRegisterError(data.message || 'Error al registrar usuario');
                  }
                } catch (err) {
                  setRegisterError('Error de red o servidor');
                } finally {
                  setRegisterLoading(false);
                }
              }}
            >
              <div className="form-group">
                <label htmlFor="register-username">Usuario:</label>
                <input
                  id="register-username"
                  type="text"
                  value={registerUsername}
                  onChange={e => setRegisterUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={registerLoading}
                />
              </div>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#555' }}>
                <strong>Indicaciones para la contraseña:</strong>
                <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0' }}>
                  <li style={{ color: registerPassword.length >= 8 ? 'green' : '#555', fontWeight: registerPassword.length >= 8 ? 600 : 400 }}>
                    - Mínimo 8 caracteres
                  </li>
                  <li style={{ color: /[A-Z]/.test(registerPassword) ? 'green' : '#555', fontWeight: /[A-Z]/.test(registerPassword) ? 600 : 400 }}>
                    - Al menos una mayúscula
                  </li>
                  <li style={{ color: /[a-z]/.test(registerPassword) ? 'green' : '#555', fontWeight: /[a-z]/.test(registerPassword) ? 600 : 400 }}>
                    - Al menos una minúscula
                  </li>
                  <li style={{ color: /[0-9]/.test(registerPassword) ? 'green' : '#555', fontWeight: /[0-9]/.test(registerPassword) ? 600 : 400 }}>
                    - Al menos un número
                  </li>
                  <li style={{ color: /[^A-Za-z0-9]/.test(registerPassword) ? 'green' : '#555', fontWeight: /[^A-Za-z0-9]/.test(registerPassword) ? 600 : 400 }}>
                    - Al menos un símbolo especial
                  </li>
                </ul>
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="register-password">Contraseña:</label>
                <input
                  id="register-password"
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={registerLoading}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  aria-label={showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowRegisterPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '2.2rem',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    height: '2rem',
                    width: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showRegisterPassword ? (
                    // Ojo abierto
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    // Ojo cerrado
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.442-4.362M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.284 5.255M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  )}
                </button>
                {/* Barra de seguridad */}
                <div style={{ marginTop: '0.5rem' }}>
                  {registerPassword && (
                    (() => {
                      const strength = getPasswordStrength(registerPassword);
                      return (
                        <div>
                          <div style={{
                            width: '100%',
                            height: '8px',
                            background: '#eee',
                            borderRadius: '4px',
                            marginBottom: '0.3rem',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${(strength.score / 5) * 100}%`,
                              height: '100%',
                              background: strength.color,
                              transition: 'width 0.3s',
                            }} />
                          </div>
                          <span style={{ color: strength.color, fontWeight: 'bold' }}>
                            Seguridad: {strength.level}
                          </span>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="register-confirm-password">Confirmar contraseña:</label>
                <input
                  id="register-confirm-password"
                  type={showRegisterConfirmPassword ? 'text' : 'password'}
                  value={registerConfirmPassword}
                  onChange={e => setRegisterConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={registerLoading}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  aria-label={showRegisterConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowRegisterConfirmPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '2.2rem',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    height: '2rem',
                    width: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showRegisterConfirmPassword ? (
                    // Ojo abierto
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    // Ojo cerrado
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.442-4.362M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.284 5.255M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={registerLoading}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {registerLoading ? 'Registrando...' : 'Registrar'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => setShowRegister(false)}
                disabled={registerLoading}
              >
                Cancelar
              </button>
              {registerError && (
                <div className="error-message" role="alert" style={{ marginTop: '1rem' }}>
                  {registerError}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
