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

  // Función para mostrar notificaciones de error elegantes
  const showErrorNotification = async (error: any) => {
    let title = 'Error en el Sistema';
    let message = 'Ha ocurrido un error inesperado. Por favor, intente nuevamente.';
    let icon: 'error' | 'warning' | 'info' = 'error';
    
    // Casos especiales de validación
    if (error && typeof error === 'object' && error.message === 'validation_required') {
      title = 'Campos Requeridos';
      message = '📝 ' + (error.details || 'Todos los campos son obligatorios.');
      icon = 'info';
    }
    // Analizar el tipo de error específico
    else if (typeof error === 'string') {
      if (error.includes('401') || error.includes('UNAUTHORIZED') || error.includes('Usuario o contraseña incorrectos')) {
        title = 'Credenciales Incorrectas';
        message = '🔒 El usuario o contraseña que ingresaste no son válidos. Verifica tus datos e intenta nuevamente.';
        icon = 'warning';
      } else if (error.includes('403') || error.includes('FORBIDDEN')) {
        title = 'Acceso Denegado';
        message = '🚫 No tienes permisos para acceder al sistema. Contacta al administrador.';
        icon = 'warning';
      } else if (error.includes('404') || error.includes('NOT FOUND')) {
        title = 'Servicio No Disponible';
        message = '🔍 El servicio de autenticación no está disponible en este momento.';
        icon = 'info';
      } else if (error.includes('500') || error.includes('INTERNAL SERVER ERROR')) {
        title = 'Error del Servidor';
        message = '⚠️ Hay un problema en el servidor. Nuestro equipo técnico ya fue notificado.';
        icon = 'error';
      } else if (error.includes('network') || error.includes('conexión') || error.includes('connection')) {
        title = 'Problema de Conexión';
        message = '🌐 No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.';
        icon = 'warning';
      } else if (error.includes('timeout')) {
        title = 'Tiempo de Espera Agotado';
        message = '⏱️ El servidor está tardando demasiado en responder. Por favor, intenta más tarde.';
        icon = 'warning';
      }
    }
    // Si el error tiene propiedades específicas
    else if (error && typeof error === 'object') {
      if (error.message) {
        if (error.message.includes('Usuario o contraseña incorrectos')) {
          title = 'Datos Incorrectos';
          message = '🔒 Las credenciales ingresadas no son correctas. Revisa tu usuario y contraseña.';
          icon = 'warning';
        } else if (error.message.includes('Network Error')) {
          title = 'Sin Conexión';
          message = '🌐 No se pudo establecer conexión con el servidor. Verifica tu conexión a internet.';
          icon = 'error';
        } else if (error.message.includes('fetch')) {
          title = 'Error de Comunicación';
          message = '📡 Hubo un problema al comunicarse con el servidor. Intenta nuevamente.';
          icon = 'warning';
        }
      }
    }

    await Swal.fire({
      icon: icon,
      title: title,
      html: `
        <div style="text-align: left; padding: 10px 0;">
          <p style="margin: 0; font-size: 1rem; line-height: 1.5; color: #374151;">
            ${message}
          </p>
          <div style="margin-top: 15px; padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 4px solid ${icon === 'warning' ? '#f59e0b' : '#ef4444'};">
            <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">
              💡 <strong>Sugerencia:</strong> ${
                icon === 'warning' && title.includes('Credenciales') 
                  ? 'Asegúrate de que no esté activado el Caps Lock y que estés usando las credenciales correctas.'
                  : icon === 'error' && title.includes('Conexión')
                  ? 'Intenta recargar la página o verifica que el servidor esté funcionando.'
                  : 'Revise su usuario o contraseña. Si el problema persiste, contacta al administrador del sistema.'
              }
            </p>
          </div>
        </div>
      `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: icon === 'warning' ? '#f59e0b' : '#ef4444',
      backdrop: 'rgba(0,0,0,0.4)',
      allowOutsideClick: false,
      customClass: {
        popup: 'error-notification-popup',
        title: 'error-notification-title',
        confirmButton: 'error-notification-button'
      }
    });
  };
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
  const [showingValidationAlert, setShowingValidationAlert] = useState(false);
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
      await showErrorNotification({
        message: 'validation_required',
        details: 'Todos los campos son obligatorios para iniciar sesión.'
      });
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
          // Mostrar advertencia de expiración con estilo bonito
          await Swal.fire({
            icon: 'info',
            title: '⏰ Contraseña Próxima a Expirar',
            html: `
              <div style="text-align: center; padding: 15px 0;">
                <p style="margin: 0; font-size: 1rem; color: #374151; line-height: 1.5;">
                  Tu contraseña expirará en <strong>${90 - diffInDays} día(s)</strong>.
                </p>
                <p style="margin: 10px 0 0 0; font-size: 0.9rem; color: #6b7280;">
                  Te recomendamos cambiarla pronto para evitar inconvenientes.
                </p>
              </div>
            `,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3b82f6',
            timer: 5000,
            timerProgressBar: true
          });
        }
      }

      localStorage.setItem(APP_CONFIG.session.storageKey, JSON.stringify(response));
      router.push('/dashboard');
    } catch (err: any) {
      // Usar la nueva función de notificaciones elegantes
      await showErrorNotification(err);
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
          style={{ 
            width: '100%', 
            padding: '0.8rem', 
            borderRadius: '8px', 
            background: isLoading ? '#6b7280' : '#2563eb', 
            color: '#fff', 
            fontWeight: 700, 
            fontSize: '1.1rem', 
            border: 'none', 
            boxShadow: isLoading ? 'none' : '0 2px 8px #2563eb22', 
            marginBottom: '0.5rem', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid #ffffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Iniciando sesión...
            </>
          ) : 'Iniciar Sesión'}
        </button>
        
        <button
          type="button"
          onClick={() => setShowRegister(true)}
          style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'linear-gradient(90deg, #64748b 0%, #475569 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', marginTop: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          Registrar Usuario
        </button>
      </form>
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
                  setNewPassword('');
                  setConfirmNewPassword('');
                  await showErrorNotification('Las contraseñas ingresadas no son iguales. Por favor, verifícalas.');
                  return;
                }
                if (strength.level === 'Bajo' || strength.level === 'Moderado') {
                  setNewPassword('');
                  setConfirmNewPassword('');
                  await showErrorNotification('La contraseña es demasiado débil. Por favor, aumenta la seguridad siguiendo las indicaciones.');
                  return;
                }
                if (newPassword === password) {
                  setNewPassword('');
                  setConfirmNewPassword('');
                  await showErrorNotification('La nueva contraseña no puede ser igual a la anterior.');
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
                    // Obtener mensaje de error de manera segura
                    let errorMessage = 'Error al cambiar la contraseña. Verifica los datos ingresados.';
                    if (data && typeof data === 'object' && 'error' in data) {
                      errorMessage = data.error || errorMessage;
                    } else if (data && typeof data === 'object' && 'message' in data) {
                      errorMessage = data.message || errorMessage;
                    }
                    
                    setNewPassword('');
                    setConfirmNewPassword('');
                    // Mostrar error usando la misma función que el login
                    await showErrorNotification(errorMessage);
                  }
                } catch (err) {
                  setNewPassword('');
                  setConfirmNewPassword('');
                  // Mostrar error usando la misma función que el login
                  await showErrorNotification('No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.');
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
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-container" style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            padding: '2.5rem',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            minWidth: '320px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05)',
            position: 'relative',
            border: '1px solid rgba(226,232,240,0.8)',
            overflow: 'hidden'
          }}>
            {/* Decoración de fondo */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,197,253,0.05) 100%)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="modal-title" style={{ 
                marginBottom: '1.5rem',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#1e40af',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Registro de Usuario
              </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setRegisterError('');
                const strength = getPasswordStrength(registerPassword);
                if (!registerUsername.trim() || !registerPassword.trim() || !registerConfirmPassword.trim()) {
                  setShowRegister(false);
                  setTimeout(() => {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Campos requeridos',
                      text: 'Todos los campos son requeridos para completar el registro.',
                      confirmButtonColor: '#f59e0b'
                    }).then(() => {
                      setTimeout(() => {
                        setShowRegister(true);
                      }, 300);
                    });
                  }, 100);
                  return;
                }
                if (registerPassword !== registerConfirmPassword) {
                  setShowRegister(false);
                  setTimeout(() => {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Contraseñas no coinciden',
                      text: 'Las contraseñas ingresadas no son iguales. Por favor, verifícalas.',
                      confirmButtonColor: '#f59e0b',
                      confirmButtonText: 'Entendido'
                    }).then(() => {
                      setTimeout(() => {
                        setShowRegister(true);
                      }, 300);
                    });
                  }, 100);
                  return;
                }
                if (strength.level === 'Bajo' || strength.level === 'Moderado') {
                  setShowRegister(false);
                  setTimeout(() => {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Contraseña débil',
                      text: 'La contraseña es demasiado débil. Por favor, aumenta la seguridad siguiendo las indicaciones.',
                      confirmButtonColor: '#f59e0b',
                      confirmButtonText: 'Entendido'
                    }).then(() => {
                      setTimeout(() => {
                        setShowRegister(true);
                      }, 300);
                    });
                  }, 100);
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
                    // Obtener mensaje de error de manera segura
                    let errorMessage = 'Error al registrar usuario. Por favor, intenta nuevamente.';
                    if (data && typeof data === 'object' && 'message' in data) {
                      errorMessage = data.message || errorMessage;
                    }
                    
                    // Mostrar error con la misma solución que funciona
                    setShowRegister(false);
                    setTimeout(() => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar',
                        text: errorMessage,
                        confirmButtonColor: '#dc2626',
                        confirmButtonText: 'Entendido'
                      }).then(() => {
                        setTimeout(() => {
                          setShowRegister(true);
                        }, 300);
                      });
                    }, 100);
                    setRegisterPassword('');
                    setRegisterConfirmPassword('');
                  }
                } catch (err) {
                  // Mostrar error con la misma solución que funciona
                  setShowRegister(false);
                  setTimeout(() => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error de conexión',
                      text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
                      confirmButtonColor: '#dc2626',
                      confirmButtonText: 'Entendido'
                    }).then(() => {
                      setTimeout(() => {
                        setShowRegister(true);
                      }, 300);
                    });
                  }, 100);
                  setRegisterPassword('');
                  setRegisterConfirmPassword('');
                } finally {
                  setRegisterLoading(false);
                }
              }}
            >
              <div style={{
                ...EstiloComponentesUI.formularios.formGroup,
                marginBottom: '1.5rem'
              }}>
                <label htmlFor="register-username" style={{
                  ...EstiloComponentesUI.formularios.label,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '8px'
                }}>Usuario:</label>
                <input
                  id="register-username"
                  type="text"
                  value={registerUsername}
                  onChange={e => setRegisterUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={registerLoading}
                  placeholder="Ingrese su nombre de usuario"
                  style={{
                    ...EstiloComponentesUI.formularios.input,
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    padding: '12px 16px',
                    transition: 'all 0.2s ease',
                    background: registerLoading ? '#f8fafc' : '#ffffff',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
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
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '1.5rem'
              }}>
                <button
                  type="submit"
                  style={{
                    ...EstiloComponentesUI.botones.btn,
                    ...EstiloComponentesUI.botones.btnPrimary,
                    width: '100%',
                    padding: '14px 24px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    background: registerLoading 
                      ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    color: '#ffffff',
                    cursor: registerLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: registerLoading 
                      ? 'none'
                      : '0 4px 12px rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(0)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  disabled={registerLoading}
                  onMouseEnter={e => {
                    if (!registerLoading) {
                      const target = e.target as HTMLButtonElement;
                      target.style.transform = 'translateY(-2px)';
                      target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!registerLoading) {
                      const target = e.target as HTMLButtonElement;
                      target.style.transform = 'translateY(0)';
                      target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                    }
                  }}
                >
                  {registerLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Registrando...
                    </div>
                  ) : 'Registrar Usuario'}
                </button>
                
                <button
                  type="button"
                  style={{
                    ...EstiloComponentesUI.botones.btn,
                    ...EstiloComponentesUI.botones.btnSecondary,
                    width: '100%',
                    padding: '14px 24px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                    border: '2px solid #e2e8f0',
                    color: '#475569',
                    cursor: registerLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    // Limpiar todos los campos al cancelar
                    setRegisterUsername('');
                    setRegisterPassword('');
                    setRegisterConfirmPassword('');
                    setRegisterError('');
                    setShowRegister(false);
                  }}
                  disabled={registerLoading}
                  onMouseEnter={e => {
                    if (!registerLoading) {
                      const target = e.target as HTMLButtonElement;
                      target.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
                      target.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!registerLoading) {
                      const target = e.target as HTMLButtonElement;
                      target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                      target.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  Cancelar
                </button>
              </div>
              {registerError && (
                <div style={{ 
                  ...estiloGlobal.errorMessage, 
                  marginTop: '1rem',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c'
                }} role="alert">
                  {registerError}
                </div>
              )}
            </form>
            </div>
            
            {/* CSS para animaciones y estilos globales */}
            <style jsx global>{`
              /* Animación del spinner para carga */
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              
              /* Animaciones del modal de registro */
              
              /* Estilos personalizados para SweetAlert2 */
              .error-notification-popup {
                border-radius: 16px !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
                border: 1px solid rgba(226, 232, 240, 0.8) !important;
              }
              
              .error-notification-title {
                font-size: 1.5rem !important;
                font-weight: 700 !important;
                color: #1f2937 !important;
                margin-bottom: 1rem !important;
              }
              
              .error-notification-button {
                border-radius: 10px !important;
                font-weight: 600 !important;
                padding: 12px 24px !important;
                font-size: 0.95rem !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
              }
              
              .error-notification-button:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
              }
              
              .swal2-popup {
                animation: slideInUp 0.3s ease-out !important;
              }
              
              @keyframes slideInUp {
                from {
                  transform: translateY(30px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
              
              .swal2-backdrop-show {
                animation: fadeIn 0.2s ease-out !important;
              }
              
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
              
              /* Responsive para móviles */
              @media (max-width: 640px) {
                .modal-container {
                  padding: 1.5rem !important;
                  margin: 10px !important;
                }
                
                .modal-title {
                  font-size: 1.5rem !important;
                }
                
                .form-input {
                  font-size: 16px !important; /* Previene zoom en iOS */
                }
                
                .requirements-grid {
                  grid-template-columns: 1fr !important;
                }
                
                .button-group {
                  gap: 8px !important;
                }
                
                .form-button {
                  padding: 12px 20px !important;
                  font-size: 0.95rem !important;
                }
                
                .error-notification-popup {
                  margin: 20px !important;
                  max-width: calc(100% - 40px) !important;
                }
                
                .error-notification-title {
                  font-size: 1.25rem !important;
                }
                
                .swal2-html-container {
                  font-size: 0.9rem !important;
                  line-height: 1.5 !important;
                }
              }
              
              @media (max-width: 480px) {
                .modal-container {
                  padding: 1rem !important;
                  border-radius: 12px !important;
                }
                
                .requirements-container {
                  padding: 12px !important;
                }
                
                .requirement-item {
                  font-size: 0.8rem !important;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}
