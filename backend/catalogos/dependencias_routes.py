"""
Rutas para la gestión de dependencias (departamentos/áreas).
Permite crear, listar, actualizar y eliminar dependencias.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

dependencias_bp = Blueprint('dependencias', __name__)

@dependencias_bp.route('/dependencias', methods=['GET'])
def listar_dependencias():
    """Devuelve todas las dependencias registradas."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM dependencia ORDER BY nombre')
    dependencias = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(dependencias)

@dependencias_bp.route('/dependencias', methods=['POST'])
def agregar_dependencia():
    """Agrega una nueva dependencia."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO dependencia (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
