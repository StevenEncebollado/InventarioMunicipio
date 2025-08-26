import React, { useEffect, useState } from 'react';
import { getUsuarios, getEquipos } from '../services/api';

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    getUsuarios().then(setUsuarios);
    getEquipos().then(setEquipos);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <h3>Usuarios</h3>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.username}</li>
        ))}
      </ul>
      <h3>Equipos</h3>
      <ul>
        {equipos.map(e => (
          <li key={e.id}>{e.nombre_pc || e.codigo_inventario}</li>
        ))}
      </ul>
    </div>
  );
}
