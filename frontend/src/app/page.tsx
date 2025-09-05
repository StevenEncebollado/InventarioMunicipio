'use client';

import { useState, FormEvent } from 'react';
import { EstiloComponentesUI } from './Diseño/Estilos/EstiloComponentesUI';
import { estiloGlobal } from './Diseño/Estilos/EstiloGlobal';
import { useRouter } from 'next/navigation';
import { login, getErrorMessage, APP_CONFIG } from '@/services/api';
import { useLoading, useError } from '@/hooks';
import type { LoginResponse } from '@/types';
import Swal from 'sweetalert2';

export default function LoginPage() {
  // Función para evaluar la seguridad de la contraseña
  function getPasswordStrength(password: string): { level: string; color: string; score: number } {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9ñÑáéíóúÁÉÍÓÚüÜ]/.test(password)) score++;
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

  // Agregar variables que faltan
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);

  // Función para manejar cambios en inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };

  // Obtener strength para la contraseña actual
  const strength = getPasswordStrength(formData.password);

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
      
      if (response.cambio_password_requerido) {
        setPasswordChangeRequired(true);
        setShowPasswordChangeModal(true);
        setCurrentUsername(username);
        setFechaCambioPassword(response.fecha_cambio_password);
        stopLoading();
        return;
      }

      if (response.fecha_cambio_password) {
        const fechaCambio = new Date(response.fecha_cambio_password);
        const ahora = new Date();
        const diffInDays = Math.floor((ahora.getTime() - fechaCambio.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays >= 88 && diffInDays < 90) {
          setPasswordExpiryWarning(`Tu contraseña expirará en ${90 - diffInDays} día(s). Considera cambiarla pronto.`);
        }
      }

      localStorage.setItem(APP_CONFIG.session.storageKey, JSON.stringify(response));
      router.push('/dashboard');
    } catch (err: any) {
      if (err.message === 'Usuario o contraseña incorrectos') {
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
    <>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)' }}>
        <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 8px 32px rgba(60,60,120,0.15)', padding: '2.5rem 2rem', minWidth: 340, maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontWeight: 800, fontSize: '2.1rem', color: '#2563eb', marginBottom: 0 }}>Inventario Municipio</h1>
          <p style={{ color: '#374151', fontSize: '1.1rem', marginBottom: '2rem' }}>Sistema de Gestión de Equipos</p>
          <form onSubmit={handleSubmit} style={{ width: '100%', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label htmlFor="username" style={{ fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Usuario:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Ingrese su nombre de usuario"
                required
                autoComplete="username"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', marginTop: 2, boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
              <label htmlFor="password" style={{ fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Contraseña:</label>
              <input
                type={mostrarContrasena ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Ingrese su contraseña"
                required
                autoComplete="current-password"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', marginTop: 2, boxSizing: 'border-box', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
            onClick={() => setMostrarContrasena(!mostrarContrasena)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '2.2rem',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            {mostrarContrasena ? (
              // Ojo abierto
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            ) : (
              // Ojo cerrado
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.442-4.362M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.284 5.255M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
            )}
          </button>
          
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', boxShadow: '0 2px 8px #2563eb22', marginBottom: '0.5rem', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        
        <button
          type="button"
          onClick={() => setShowRegister(true)}
          style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'linear-gradient(90deg, #64748b 0%, #475569 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', marginTop: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          Registrar Usuario
        </button>
      </form>
          {error && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '0.95rem',
            }}>
              {error}
            </div>
          )}
        </div>
      </div>

    {/* Mensaje de advertencia de expiración de contraseña */}
    {passwordExpiryWarning && !passwordChangeRequired && (
      <div style={{ color: '#e67e22', margin: '1rem 0', textAlign: 'center' }}>
        {passwordExpiryWarning}
      </div>
    )}
      {/* Modal de cambio de contraseña obligatorio */}
      {showPasswordChangeModal && (
        <div style={{
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
          <div style={{
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
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Campos requeridos',
                    text: 'Todos los campos son requeridos para cambiar la contraseña.',
                    confirmButtonColor: '#f59e0b'
                  });
                  return;
                }
                if (newPassword !== confirmNewPassword) {
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Contraseñas no coinciden',
                    text: 'Las contraseñas ingresadas no son iguales. Por favor, verifícalas.',
                    confirmButtonColor: '#f59e0b'
                  });
                  return;
                }
                if (strength.level === 'Bajo' || strength.level === 'Moderado') {
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Contraseña débil',
                    text: 'La contraseña es demasiado débil. Por favor, aumenta la seguridad siguiendo las indicaciones.',
                    confirmButtonColor: '#f59e0b'
                  });
                  return;
                }
                if (newPassword === password) {
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Contraseña idéntica',
                    text: 'La nueva contraseña no puede ser igual a la anterior.',
                    confirmButtonColor: '#f59e0b'
                  });
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
                    
                    // Mostrar mensaje de éxito con SweetAlert2
                    await Swal.fire({
                      icon: 'success',
                      title: '¡Contraseña cambiada!',
                      text: 'Contraseña cambiada correctamente. Inicia sesión nuevamente.',
                      confirmButtonColor: '#28a745',
                      timer: 3000,
                      timerProgressBar: true
                    });
                    
                    setPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setCurrentUsername('');
                  } else {
                    // Mostrar error con SweetAlert2
                    await Swal.fire({
                      icon: 'error',
                      title: 'Error al cambiar contraseña',
                      text: data.error || 'Error al cambiar la contraseña. Verifica los datos ingresados.',
                      confirmButtonColor: '#dc3545'
                    });
                  }
                } catch (err) {
                  // Mostrar error de red con SweetAlert2
                  await Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
                    confirmButtonColor: '#dc3545'
                  });
                }
              }}
            >
              <div style={EstiloComponentesUI.formularios.formGroup}>
                <label htmlFor="current-username" style={EstiloComponentesUI.formularios.label}>Usuario actual:</label>
                <input
                  id="current-username"
                  type="text"
                  value={currentUsername}
                  onChange={e => setCurrentUsername(e.target.value)}
                  autoComplete="username"  
                  required
                  style={EstiloComponentesUI.formularios.input}
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
              <div style={{ ...EstiloComponentesUI.formularios.formGroup, position: 'relative' }}>
                <label htmlFor="new-password" style={EstiloComponentesUI.formularios.label}>Nueva contraseña:</label>
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{ ...EstiloComponentesUI.formularios.input, paddingRight: '2.5rem' }}
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
              <div style={{ ...EstiloComponentesUI.formularios.formGroup, position: 'relative' }}>
                <label htmlFor="confirm-new-password" style={EstiloComponentesUI.formularios.label}>Confirmar nueva contraseña:</label>
                <input
                  id="confirm-new-password"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{ ...EstiloComponentesUI.formularios.input, paddingRight: '2.5rem' }}
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
                style={{ ...EstiloComponentesUI.botones.btn, ...EstiloComponentesUI.botones.btnPrimary, width: '100%', marginTop: '1rem' }}
              >
                Cambiar contraseña
              </button>
              {changePasswordError && (
                <div style={{ ...estiloGlobal.errorMessage, marginTop: '1rem' }} role="alert">
                  {changePasswordError}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {/* Modal de registro */}
      {showRegister && (
        <div style={{
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
          <div style={{
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
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Campos requeridos',
                    text: 'Todos los campos son requeridos para completar el registro.',
                    confirmButtonColor: '#f59e0b'
                  });
                  return;
                }
                if (registerPassword !== registerConfirmPassword) {
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Contraseñas no coinciden',
                    text: 'Las contraseñas ingresadas no son iguales. Por favor, verifícalas.',
                    confirmButtonColor: '#f59e0b'
                  });
                  return;
                }
                if (strength.level === 'Bajo' || strength.level === 'Moderado') {
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Contraseña débil',
                    text: 'La contraseña es demasiado débil. Por favor, aumenta la seguridad siguiendo las indicaciones.',
                    confirmButtonColor: '#f59e0b'
                  });
                  return;
                }
                setRegisterLoading(true);
                try {
                  // Llamar al endpoint de registro del backend
                  const res = await fetch('http://localhost:5000/usuarios/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: registerUsername, password: registerPassword })
                  });
                  const data = await res.json();
                  if (res.ok) {
                    // Limpiar campos
                    setRegisterUsername('');
                    setRegisterPassword('');
                    setRegisterConfirmPassword('');
                    setShowRegister(false);
                    
                    // Construir datos de sesión con la estructura correcta
                    const userData = {
                      id: data.id || Date.now(), // Usar el ID del backend o un ID temporal
                      username: registerUsername, // Usar el username que ingresó el usuario
                      email: data.email || '',
                      rol: data.rol || 'usuario',
                      activo: true,
                      fecha_creacion: data.fecha_creacion || new Date().toISOString(),
                      ...data // Incluir cualquier otro dato que devuelva el backend
                    };
                    
                    // Mostrar mensaje de éxito con SweetAlert2
                    await Swal.fire({
                      icon: 'success',
                      title: '¡Registro exitoso!',
                      text: `Bienvenido ${registerUsername}. Usuario creado correctamente.`,
                      confirmButtonColor: '#28a745',
                      timer: 3000,
                      timerProgressBar: true,
                      showConfirmButton: true
                    });
                    
                    // Guardar datos de sesión y redirigir al dashboard
                    localStorage.setItem(APP_CONFIG.session.storageKey, JSON.stringify(userData));
                    router.push('/dashboard');
                  } else {
                    // Mostrar error con SweetAlert2
                    await Swal.fire({
                      icon: 'error',
                      title: 'Error en el registro',
                      text: data.message || 'Error al registrar usuario. Por favor, intenta nuevamente.',
                      confirmButtonColor: '#dc3545'
                    });
                  }
                } catch (err) {
                  // Mostrar error de red con SweetAlert2
                  await Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
                    confirmButtonColor: '#dc3545'
                  });
                } finally {
                  setRegisterLoading(false);
                }
              }}
            >
              <div style={EstiloComponentesUI.formularios.formGroup}>
                <label htmlFor="register-username" style={EstiloComponentesUI.formularios.label}>Usuario:</label>
                <input
                  id="register-username"
                  type="text"
                  value={registerUsername}
                  onChange={e => setRegisterUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={registerLoading}
                  style={EstiloComponentesUI.formularios.input}
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
              <div style={{ ...EstiloComponentesUI.formularios.formGroup, position: 'relative' }}>
                <label htmlFor="register-password" style={EstiloComponentesUI.formularios.label}>Contraseña:</label>
                <input
                  id="register-password"
                  type={showRegisterPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={registerLoading}
                  style={{ ...EstiloComponentesUI.formularios.input, paddingRight: '2.5rem' }}
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
              <div style={{ ...EstiloComponentesUI.formularios.formGroup, position: 'relative' }}>
                <label htmlFor="register-confirm-password" style={EstiloComponentesUI.formularios.label}>Confirmar contraseña:</label>
                <input
                  id="register-confirm-password"
                  type={showRegisterConfirmPassword ? 'text' : 'password'}
                  value={registerConfirmPassword}
                  onChange={e => setRegisterConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={registerLoading}
                  style={{ ...EstiloComponentesUI.formularios.input, paddingRight: '2.5rem' }}
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
                style={{ ...EstiloComponentesUI.botones.btn, ...EstiloComponentesUI.botones.btnPrimary, width: '100%', marginTop: '1rem' }}
                disabled={registerLoading}
              >
                {registerLoading ? 'Registrando...' : 'Registrar'}
              </button>
              <button
                type="button"
                style={{ ...EstiloComponentesUI.botones.btn, ...EstiloComponentesUI.botones.btnSecondary, width: '100%', marginTop: '0.5rem' }}
                onClick={() => setShowRegister(false)}
                disabled={registerLoading}
              >
                Cancelar
              </button>
              {registerError && (
                <div style={{ ...estiloGlobal.errorMessage, marginTop: '1rem' }} role="alert">
                  {registerError}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
