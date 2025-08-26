"""
Rutas para la gestión de equipamiento (institucional/personal).
Permite crear, listar, actualizar y eliminar equipamiento.
"""
from flask import Blueprint, request, jsonify
from backend.db import get_db_connection

equipamientos_bp = Blueprint('equipamientos', __name__)

@equipamientos_bp.route('/equipamientos', methods=['GET'])
def listar_equipamientos():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM equipamiento ORDER BY nombre')
    equipamientos = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(equipamientos)


@equipamientos_bp.route('/equipamientos', methods=['POST'])
def agregar_equipamiento():
    """Agrega un nuevo equipamiento."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO equipamiento (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201

# Endpoint para actualizar un equipamiento existente
@equipamientos_bp.route('/equipamientos/<int:id>', methods=['PUT'])
def actualizar_equipamiento(id):
    """Actualiza el nombre de un equipamiento por su ID."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE equipamiento SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Equipamiento actualizado correctamente'})

# Endpoint para eliminar un equipamiento existente
@equipamientos_bp.route('/equipamientos/<int:id>', methods=['DELETE'])
def eliminar_equipamiento(id):
    """Elimina un equipamiento por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM equipamiento WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Equipamiento eliminado correctamente'})
