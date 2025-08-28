"""
Rutas para la gestión de direcciones (ubicaciones físicas).
Permite crear, listar, actualizar y eliminar direcciones.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

direcciones_bp = Blueprint('direcciones', __name__)

@direcciones_bp.route('/direcciones', methods=['GET'])
def listar_direcciones():
    """Devuelve todas las direcciones registradas."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM direccion_area ORDER BY nombre')
    direcciones = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(direcciones)

@direcciones_bp.route('/direcciones', methods=['POST'])
def agregar_direccion():
    """Agrega una nueva dirección."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO direccion_area (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
