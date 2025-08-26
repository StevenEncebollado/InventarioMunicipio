// Servicio para peticiones HTTP al backend
const API_URL = 'http://localhost:5000';

export async function login(username, password) {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function getUsuarios() {
  const res = await fetch(`${API_URL}/usuarios`);
  return res.json();
}

export async function getEquipos() {
  const res = await fetch(`${API_URL}/inventario`);
  return res.json();
}
