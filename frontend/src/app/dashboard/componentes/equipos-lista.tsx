"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import type { Equipo } from '@/types';
import { useEffect, useState } from 'react';
import { getEquipos } from '@/services/api';

const TITULOS: Record<string, string> = {
  total: 'Todos los Equipos',
  active: 'Equipos Activos',
  maintenance: 'Equipos en Mantenimiento',
  inactive: 'Equipos Inactivos',
};

export default function EquiposLista() {
  const router = useRouter();
  const params = useSearchParams();
  const tipo = params.get('tipo') || 'total';
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEquipos().then(data => {
      let filtrados = data;
      if (tipo === 'active') filtrados = data.filter((e: Equipo) => e.estado === 'Activo');
      else if (tipo === 'maintenance') filtrados = data.filter((e: Equipo) => e.estado === 'Mantenimiento');
      else if (tipo === 'inactive') filtrados = data.filter((e: Equipo) => e.estado === 'Inactivo');
      setEquipos(filtrados);
      setLoading(false);
    });
  }, [tipo]);

  return (
    <div style={{ maxWidth: 520, margin: '48px auto', background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ marginBottom: 18 }}>{TITULOS[tipo] || 'Equipos'}</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : equipos.length === 0 ? (
        <p>No hay dispositivos en este segmento.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none', maxHeight: 400, overflowY: 'auto' }}>
          {equipos.map(eq => (
            <li key={eq.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <strong>{eq.nombres_funcionario || 'Sin asignar'}</strong> - {eq.codigo_inventario || 'Sin código'} - Estado: {eq.estado}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => router.back()} style={{ marginTop: 24, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, cursor: 'pointer' }}>Volver</button>
    </div>
  );
}
