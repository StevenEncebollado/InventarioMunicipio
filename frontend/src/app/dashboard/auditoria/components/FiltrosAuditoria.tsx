/**
 * Componente de filtros para el sistema de auditoría.
 * Diseño consistente con el resto del sistema.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { type FiltrosAuditoria, type Usuario } from '@/types';
import { FaFilter, FaTrash, FaSearch } from 'react-icons/fa';

interface Props {
  filtros: FiltrosAuditoria;
  onAplicarFiltros: (filtros: FiltrosAuditoria) => void;
  onLimpiarFiltros: () => void;
  loading?: boolean;
  usuarios?: Usuario[];
}

const FiltrosAuditoria: React.FC<Props> = ({
  filtros,
  onAplicarFiltros,
  onLimpiarFiltros,
  loading = false,
  usuarios = [],
}) => {
  const [filtrosLocales, setFiltrosLocales] = useState<FiltrosAuditoria>(filtros);

  useEffect(() => {
    setFiltrosLocales(filtros);
  }, [filtros]);

  const manejarCambio = (campo: keyof FiltrosAuditoria, valor: any) => {
    setFiltrosLocales(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const aplicarFiltros = () => {
    onAplicarFiltros(filtrosLocales);
  };

  const limpiarFiltros = () => {
    onLimpiarFiltros();
  };

  const obtenerFechaMaxima = () => {
    return new Date().toISOString().split('T')[0];
  };

  const estiloInput = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    background: '#fff',
    transition: 'all 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  };

  const estiloLabel = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: 0
        }}>
          <FaFilter style={{ color: '#3b82f6' }} />
          Filtros de Auditoría
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: '0.25rem 0 0 0'
        }}>
          Filtra el historial de acciones por diferentes criterios
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Filtro por fecha de inicio */}
        <div>
          <label style={estiloLabel}>
            📅 Fecha de Inicio
          </label>
          <input
            type="date"
            value={filtrosLocales.fechaInicio || ''}
            onChange={(e) => manejarCambio('fechaInicio', e.target.value)}
            max={obtenerFechaMaxima()}
            style={estiloInput}
          />
        </div>

        {/* Filtro por fecha de fin */}
        <div>
          <label style={estiloLabel}>
            📅 Fecha de Fin
          </label>
          <input
            type="date"
            value={filtrosLocales.fechaFin || ''}
            onChange={(e) => manejarCambio('fechaFin', e.target.value)}
            max={obtenerFechaMaxima()}
            min={filtrosLocales.fechaInicio || undefined}
            style={estiloInput}
          />
        </div>

        {/* Filtro por usuario */}
        <div>
          <label style={estiloLabel}>
            👤 Usuario
          </label>
          <select
            value={filtrosLocales.usuarioId || ''}
            onChange={(e) => manejarCambio('usuarioId', e.target.value ? parseInt(e.target.value) : undefined)}
            style={estiloInput}
          >
            <option value="">Todos los usuarios</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.username}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por acción */}
        <div>
          <label style={estiloLabel}>
            ⚡ Acción
          </label>
          <select
            value={filtrosLocales.accion || ''}
            onChange={(e) => manejarCambio('accion', e.target.value || undefined)}
            style={estiloInput}
          >
            <option value="">Todas las acciones</option>
            <option value="agregado">➕ Equipo Agregado</option>
            <option value="modificado">✏️ Equipo Modificado</option>
            <option value="inactivado">🗑️ Equipo Inactivado</option>
            <option value="cambio_estado">🔄 Cambio de Estado</option>
            <option value="usuario_registrado">👤 Usuario Registrado</option>
            <option value="login">🚪 Inicio de Sesión</option>
            <option value="logout">🚪 Cierre de Sesión</option>
            <option value="reporte_generado">📋 Reporte Generado</option>
          </select>
        </div>

        {/* Filtro por ID de equipo */}
        <div>
          <label style={estiloLabel}>
            💻 ID de Equipo
          </label>
          <input
            type="number"
            placeholder="Ingrese ID del equipo"
            value={filtrosLocales.equipoId || ''}
            onChange={(e) => manejarCambio('equipoId', e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
            style={estiloInput}
          />
        </div>

        {/* Filtro por elementos por página */}
        <div>
          <label style={estiloLabel}>
            📊 Elementos por página
          </label>
          <select
            value={filtrosLocales.limit || 50}
            onChange={(e) => manejarCambio('limit', parseInt(e.target.value))}
            style={estiloInput}
          >
            <option value={25}>25 elementos</option>
            <option value={50}>50 elementos</option>
            <option value={100}>100 elementos</option>
          </select>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={aplicarFiltros}
          disabled={loading}
          style={{
            flex: '1',
            minWidth: '150px',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Aplicando...
            </>
          ) : (
            <>
              <FaSearch />
              Aplicar Filtros
            </>
          )}
        </button>

        <button
          onClick={limpiarFiltros}
          disabled={loading}
          style={{
            flex: '1',
            minWidth: '150px',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <FaTrash />
          Limpiar Filtros
        </button>
      </div>

      {/* Indicador de filtros activos */}
      {(filtrosLocales.fechaInicio || filtrosLocales.fechaFin || filtrosLocales.usuarioId || filtrosLocales.accion || filtrosLocales.equipoId) && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#1e40af',
            margin: '0 0 0.5rem 0'
          }}>
            Filtros activos:
          </h4>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {filtrosLocales.fechaInicio && (
              <span style={{
                display: 'inline-block',
                background: '#dbeafe',
                color: '#1e40af',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontWeight: '500'
              }}>
                Desde: {filtrosLocales.fechaInicio}
              </span>
            )}
            {filtrosLocales.fechaFin && (
              <span style={{
                display: 'inline-block',
                background: '#dbeafe',
                color: '#1e40af',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontWeight: '500'
              }}>
                Hasta: {filtrosLocales.fechaFin}
              </span>
            )}
            {filtrosLocales.usuarioId && (
              <span style={{
                display: 'inline-block',
                background: '#dbeafe',
                color: '#1e40af',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontWeight: '500'
              }}>
                Usuario: {usuarios.find(u => u.id === filtrosLocales.usuarioId)?.username || filtrosLocales.usuarioId}
              </span>
            )}
            {filtrosLocales.accion && (
              <span style={{
                display: 'inline-block',
                background: '#dbeafe',
                color: '#1e40af',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontWeight: '500'
              }}>
                Acción: {filtrosLocales.accion}
              </span>
            )}
            {filtrosLocales.equipoId && (
              <span style={{
                display: 'inline-block',
                background: '#dbeafe',
                color: '#1e40af',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontWeight: '500'
              }}>
                Equipo: #{filtrosLocales.equipoId}
              </span>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Estilos responsive para los filtros */
        @media (max-width: 768px) {
          .filtros-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FiltrosAuditoria;