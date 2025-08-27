/**
 * Hooks personalizados para la gestión de estado y lógica reutilizable
 */

import { useState, useEffect } from 'react';
import { jsonStorage } from '../utils';
import { APP_CONFIG } from '../services/api';

/**
 * Hook para manejo de estados de carga
 */
export function useLoading(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading: setIsLoading,
  };
}

/**
 * Hook para manejo de errores
 */
export function useError() {
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);
  const setErrorMessage = (message: string) => setError(message);

  return {
    error,
    setError: setErrorMessage,
    clearError,
    hasError: !!error,
  };
}

/**
 * Hook para manejo de autenticación
 */
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay usuario en localStorage al montar el componente
    const storedUser = jsonStorage.get(APP_CONFIG.session.storageKey);
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    jsonStorage.set(APP_CONFIG.session.storageKey, userData);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(APP_CONFIG.session.storageKey);
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}

/**
 * Hook para toggle de estado booleano
 */
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  };
}

/**
 * Hook para manejar formularios
 */
export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedFields] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const setError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const clearError = (field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const setFieldTouched = (field: keyof T) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouchedFields({});
  };

  const handleChange = (field: keyof T) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setValue(field, event.target.value);
    clearError(field);
  };

  const handleBlur = (field: keyof T) => () => {
    setFieldTouched(field);
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    clearError,
    setTouched: setFieldTouched,
    reset,
    handleChange,
    handleBlur,
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
  };
}

/**
 * Hook para localStorage persistente
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Obtener valor inicial de localStorage o usar el valor por defecto
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = jsonStorage.get<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      jsonStorage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * Hook para debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para detectar clicks fuera de un elemento
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
) {
  const [ref, setRef] = useState<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && !ref.contains(event.target as Node)) {
        callback();
      }
    };

    if (ref) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [ref, callback]);

  return setRef;
}

/**
 * Hook para manejar async operations
 */
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
    } catch (error) {
      setError(error as E);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
  };
}
