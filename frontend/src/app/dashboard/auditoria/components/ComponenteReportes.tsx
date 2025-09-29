/**
 * Componente de Reportes para el sistema de auditoría.
 * Genera y exporta reportes de inventario, equipos modificados y estadísticas.
 */

'use client';

import React, { useState } from 'react';
import { 
  FaTable, 
  FaHistory, 
  FaChartLine, 
  FaFileAlt, 
  FaDownload, 
  FaSync,
  FaFilePdf,
  FaFileExcel
} from 'react-icons/fa';
import { Usuario } from '@/types';

interface ComponenteReportesProps {
  user: Usuario | null;
  usuarios: Usuario[];
}

interface FiltrosReporte {
  estado: string;
  diasAtras: number;
  dependenciaId: string;
  fechaInicio?: string;
  fechaFin?: string;
}

interface TipoReporte {
  id: string;
  nombre: string;
  icono: React.ReactElement;
  descripcion: string;
}

const ComponenteReportes: React.FC<ComponenteReportesProps> = ({ user, usuarios }) => {
  const [tipoReporte, setTipoReporte] = useState('inventario_general');
  const [reporteData, setReporteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosReporte>({
    estado: '',
    diasAtras: 30,
    dependenciaId: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const tiposReporte: TipoReporte[] = [
    { 
      id: 'inventario_general', 
      nombre: 'Inventario General', 
      icono: <FaTable />, 
      descripcion: 'Lista completa de equipos registrados en el sistema' 
    },
    { 
      id: 'equipos_modificados', 
      nombre: 'Equipos Modificados', 
      icono: <FaHistory />, 
      descripcion: 'Equipos con cambios recientes y su historial' 
    },
    { 
      id: 'estadisticas_avanzadas', 
      nombre: 'Estadísticas Avanzadas', 
      icono: <FaChartLine />, 
      descripcion: 'Métricas y análisis del sistema de inventario' 
    }
  ];

  const generarReporte = async () => {
    if (!user) {
      alert('Usuario no autenticado');
      return;
    }
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        usuario_id: user.id.toString(),
        ...(filtros.estado && { estado: filtros.estado }),
        ...(filtros.dependenciaId && { dependencia_id: filtros.dependenciaId }),
        ...(tipoReporte === 'equipos_modificados' && { dias_atras: filtros.diasAtras.toString() }),
        ...(filtros.fechaInicio && { fecha_inicio: filtros.fechaInicio }),
        ...(filtros.fechaFin && { fecha_fin: filtros.fechaFin })
      });

      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auditoria/reportes/${tipoReporte}?${params}`;
      
      const response = await fetch(url, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReporteData(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || 'Error al generar reporte');
      }
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert(`Error al generar el reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    if (!reporteData) return;
    
    let csvContent = '';
    let filename = '';

    switch (tipoReporte) {
      case 'inventario_general':
        filename = `inventario_general_${new Date().toISOString().split('T')[0]}.csv`;
        csvContent = [
          ['Código', 'Nombre PC', 'Funcionario', 'Estado', 'Dependencia', 'Tipo Equipo', 'Marca'].join(','),
          ...reporteData.equipos.map((equipo: any) => [
            `"${equipo.codigo_inventario || ''}"`,
            `"${equipo.nombre_pc || ''}"`,
            `"${equipo.nombres_funcionario || ''}"`,
            `"${equipo.estado || ''}"`,
            `"${equipo.dependencia_nombre || ''}"`,
            `"${equipo.tipo_equipo || ''}"`,
            `"${equipo.marca || ''}"`
          ].join(','))
        ].join('\n');
        break;
      
      case 'equipos_modificados':
        filename = `equipos_modificados_${new Date().toISOString().split('T')[0]}.csv`;
        csvContent = [
          ['Código', 'Nombre PC', 'Funcionario', 'Dependencia', 'Modificaciones', 'Última Modificación', 'Último Usuario'].join(','),
          ...reporteData.equipos_modificados.map((equipo: any) => [
            `"${equipo.codigo_inventario || ''}"`,
            `"${equipo.nombre_pc || ''}"`,
            `"${equipo.nombres_funcionario || ''}"`,
            `"${equipo.dependencia_nombre || ''}"`,
            equipo.modificaciones || 0,
            `"${equipo.ultima_modificacion || ''}"`,
            `"${equipo.ultimo_usuario || ''}"`
          ].join(','))
        ].join('\n');
        break;

      case 'estadisticas_avanzadas':
        filename = `estadisticas_avanzadas_${new Date().toISOString().split('T')[0]}.csv`;
        csvContent = [
          ['Métrica', 'Valor'].join(','),
          ['Total Equipos', reporteData.total_equipos || 0].join(','),
          ['Equipos Activos', reporteData.equipos_activos || 0].join(','),
          ['Equipos Inactivos', reporteData.equipos_inactivos || 0].join(','),
          ['Total Usuarios', reporteData.total_usuarios || 0].join(','),
          ['Acciones Último Mes', reporteData.acciones_ultimo_mes || 0].join(','),
        ].join('\n');
        break;
    }

    if (csvContent) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      estado: '',
      diasAtras: 30,
      dependenciaId: '',
      fechaInicio: '',
      fechaFin: ''
    });
    setReporteData(null);
  };

  return (
    <div>
      {/* Selector de tipo de reporte */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {tiposReporte.map((tipo) => (
          <div
            key={tipo.id}
            onClick={() => {
              setTipoReporte(tipo.id);
              setReporteData(null); // Limpiar datos previos
            }}
            style={{
              padding: '1.5rem',
              border: tipoReporte === tipo.id ? '2px solid #3b82f6' : '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              background: tipoReporte === tipo.id ? '#eff6ff' : 'white',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              boxShadow: tipoReporte === tipo.id ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '0.75rem', 
              color: tipoReporte === tipo.id ? '#3b82f6' : '#64748b' 
            }}>
              {tipo.icono}
            </div>
            <h3 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#1e293b',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              {tipo.nombre}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '0.875rem', 
              color: '#64748b',
              lineHeight: '1.4'
            }}>
              {tipo.descripcion}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros específicos por tipo de reporte */}
      <div style={{
        background: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.1rem' }}>
          Filtros de Reporte - {tiposReporte.find(t => t.id === tipoReporte)?.nombre}
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          {/* Filtro de estado (para inventario general) */}
          {(tipoReporte === 'inventario_general') && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Estado del Equipo:
              </label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          )}
          
          {/* Filtro de días atrás (para equipos modificados) */}
          {tipoReporte === 'equipos_modificados' && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Período (días atrás):
              </label>
              <select
                value={filtros.diasAtras}
                onChange={(e) => setFiltros(prev => ({ ...prev, diasAtras: parseInt(e.target.value) }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value={7}>Últimos 7 días</option>
                <option value={15}>Últimos 15 días</option>
                <option value={30}>Últimos 30 días</option>
                <option value={60}>Últimos 60 días</option>
                <option value={90}>Últimos 90 días</option>
              </select>
            </div>
          )}

          {/* Filtros de fecha (para todos los reportes) */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500',
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Fecha inicio:
            </label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaInicio: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: 'white',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500',
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Fecha fin:
            </label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaFin: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: 'white',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={limpiarFiltros}
            style={{
              padding: '0.5rem 1rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#4b5563'}
            onMouseOut={(e) => e.currentTarget.style.background = '#6b7280'}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={generarReporte}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            fontSize: '0.875rem',
            boxShadow: loading ? 'none' : '0 2px 4px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? <FaSync className="animate-spin" /> : <FaFileAlt />}
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>

        {reporteData && (
          <>
            <button
              onClick={exportarCSV}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <FaDownload />
              Exportar CSV
            </button>

            <button
              onClick={() => alert('Función PDF en desarrollo')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <FaFilePdf />
              Exportar PDF
            </button>

            <button
              onClick={() => alert('Función Excel en desarrollo')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <FaFileExcel />
              Exportar Excel
            </button>
          </>
        )}
      </div>

      {/* Resultado del reporte */}
      {reporteData && (
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            padding: '1.5rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
              Resultados: {reporteData.total || reporteData.total_equipos_modificados || reporteData.total_equipos || 'N/A'} registros
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              Generado: {new Date(reporteData.timestamp || Date.now()).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <div style={{ padding: '1.5rem', maxHeight: '600px', overflow: 'auto' }}>
            <RenderizarReporte data={reporteData} tipo={tipoReporte} />
          </div>
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para renderizar diferentes tipos de reportes
const RenderizarReporte: React.FC<{ data: any; tipo: string }> = ({ data, tipo }) => {
  const estiloTabla = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.875rem'
  };

  const estiloCelda = {
    padding: '0.75rem',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'left' as const
  };

  const estiloEncabezado = {
    ...estiloCelda,
    background: '#f8fafc',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e2e8f0'
  };

  switch (tipo) {
    case 'inventario_general':
      return (
        <div style={{ overflowX: 'auto' }}>
          <table style={estiloTabla}>
            <thead>
              <tr>
                <th style={estiloEncabezado}>Código</th>
                <th style={estiloEncabezado}>Nombre PC</th>
                <th style={estiloEncabezado}>Funcionario</th>
                <th style={estiloEncabezado}>Estado</th>
                <th style={estiloEncabezado}>Dependencia</th>
                <th style={estiloEncabezado}>Tipo</th>
                <th style={estiloEncabezado}>Marca</th>
              </tr>
            </thead>
            <tbody>
              {data.equipos?.slice(0, 100).map((equipo: any, index: number) => (
                <tr key={index} style={{ background: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                  <td style={estiloCelda}>{equipo.codigo_inventario || 'N/A'}</td>
                  <td style={estiloCelda}>{equipo.nombre_pc || 'N/A'}</td>
                  <td style={estiloCelda}>{equipo.nombres_funcionario || 'N/A'}</td>
                  <td style={estiloCelda}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      background: equipo.estado === 'activo' ? '#dcfce7' : 
                                 equipo.estado === 'inactivo' ? '#fee2e2' : '#fef3c7',
                      color: equipo.estado === 'activo' ? '#166534' :
                             equipo.estado === 'inactivo' ? '#991b1b' : '#92400e'
                    }}>
                      {equipo.estado || 'N/A'}
                    </span>
                  </td>
                  <td style={estiloCelda}>{equipo.dependencia_nombre || 'N/A'}</td>
                  <td style={estiloCelda}>{equipo.tipo_equipo || 'N/A'}</td>
                  <td style={estiloCelda}>{equipo.marca || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.equipos?.length > 100 && (
            <div style={{ 
              textAlign: 'center', 
              color: '#64748b', 
              margin: '1.5rem 0',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                📋 Mostrando los primeros 100 registros de {data.total}. 
                <br />
                <strong>Exporta a CSV para ver todos los registros.</strong>
              </p>
            </div>
          )}
        </div>
      );

    case 'equipos_modificados':
      return (
        <div style={{ overflowX: 'auto' }}>
          <table style={estiloTabla}>
            <thead>
              <tr>
                <th style={estiloEncabezado}>Código</th>
                <th style={estiloEncabezado}>Nombre PC</th>
                <th style={estiloEncabezado}>Funcionario</th>
                <th style={estiloEncabezado}>Dependencia</th>
                <th style={estiloEncabezado}>Modificaciones</th>
                <th style={estiloEncabezado}>Última Modificación</th>
                <th style={estiloEncabezado}>Último Usuario</th>
              </tr>
            </thead>
            <tbody>
              {data.equipos_modificados?.map((equipo: any, index: number) => (
                <tr key={index} style={{ background: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                  <td style={estiloCelda}>{equipo.codigo_inventario || 'N/A'}</td>
                  <td style={estiloCelda}>{equipo.nombre_pc || 'N/A'}</td>
                  <td style={estiloCelda}>{equipo.nombres_funcionario || 'N/A'}</td>
                  <td style={estiloCelda}>{equipo.dependencia_nombre || 'N/A'}</td>
                  <td style={estiloCelda}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: equipo.modificaciones > 5 ? '#fee2e2' : 
                                 equipo.modificaciones > 2 ? '#fef3c7' : '#dcfce7',
                      color: equipo.modificaciones > 5 ? '#991b1b' :
                             equipo.modificaciones > 2 ? '#92400e' : '#166534'
                    }}>
                      {equipo.modificaciones || 0}
                    </span>
                  </td>
                  <td style={estiloCelda}>
                    {equipo.ultima_modificacion ? 
                      new Date(equipo.ultima_modificacion).toLocaleDateString('es-ES') : 'N/A'}
                  </td>
                  <td style={estiloCelda}>{equipo.ultimo_usuario || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'estadisticas_avanzadas':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Estadísticas Generales */}
          <div style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
              📊 Estadísticas Generales
            </h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Equipos:</span>
                <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.1rem' }}>
                  {data.total_equipos || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Equipos Activos:</span>
                <span style={{ fontWeight: '600', color: '#059669', fontSize: '1.1rem' }}>
                  {data.equipos_activos || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Equipos Inactivos:</span>
                <span style={{ fontWeight: '600', color: '#dc2626', fontSize: '1.1rem' }}>
                  {data.equipos_inactivos || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Usuarios:</span>
                <span style={{ fontWeight: '600', color: '#3b82f6', fontSize: '1.1rem' }}>
                  {data.total_usuarios || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Acciones (30 días):</span>
                <span style={{ fontWeight: '600', color: '#7c3aed', fontSize: '1.1rem' }}>
                  {data.acciones_ultimo_mes || 0}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actividad de Usuarios */}
          <div style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ color: '#1e293b', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
              👥 Actividad de Usuarios (30 días)
            </h4>
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              {data.actividad_usuarios?.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {data.actividad_usuarios.map((usuario: any, index: number) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1e293b', fontSize: '0.875rem' }}>
                          {usuario.nombre || 'Usuario Desconocido'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {usuario.email || 'Sin email'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', color: '#3b82f6', fontSize: '1rem' }}>
                          {usuario.total_acciones || 0}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          acciones
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#64748b', 
                  padding: '2rem',
                  fontSize: '0.875rem'
                }}>
                  No hay actividad registrada en los últimos 30 días
                </div>
              )}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div style={{ 
          textAlign: 'center', 
          color: '#64748b', 
          padding: '3rem',
          fontSize: '1rem'
        }}>
          ⚠️ Tipo de reporte no soportado: {tipo}
        </div>
      );
  }
};

export default ComponenteReportes;