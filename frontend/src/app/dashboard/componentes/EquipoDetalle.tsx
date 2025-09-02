import React from 'react';
import type { Equipo } from '@/types';

interface EquipoDetalleProps {
  equipo: Equipo;
}

export default function EquipoDetalle({ equipo }: EquipoDetalleProps) {
  if (!equipo) return null;
  return (
    <div style={{ padding: 8 }}>
      <h2 style={{ marginBottom: 12 }}>Detalle del Equipo</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><strong>ID:</strong> {equipo.id}</li>
        <li><strong>Funcionario:</strong> {equipo.nombres_funcionario || 'Sin asignar'}</li>
        <li><strong>Código Inventario:</strong> {equipo.codigo_inventario || '-'}</li>
        <li><strong>Nombre PC:</strong> {equipo.nombre_pc || '-'}</li>
        <li><strong>Estado:</strong> {equipo.estado}</li>
        <li><strong>AnyDesk:</strong> {equipo.anydesk || '-'}</li>
        <li><strong>Dirección IP:</strong> {equipo.direccion_ip || '-'}</li>
        <li><strong>Dirección MAC:</strong> {equipo.direccion_mac || '-'}</li>
        <li><strong>Fecha Registro:</strong> {equipo.fecha_registro || '-'}</li>
        {/* Agrega más campos según lo que se necesite mostrar */}
      </ul>
    </div>
  );
}
