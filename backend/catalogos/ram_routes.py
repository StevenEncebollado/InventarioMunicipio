@ram_bp.route('/ram/<int:id>', methods=['PUT'])
def actualizar_ram(id):
    """Actualiza el nombre de una opción de RAM por su ID."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE ram SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'RAM actualizada correctamente'})

@ram_bp.route('/ram/<int:id>', methods=['DELETE'])
def eliminar_ram(id):
    """Elimina una opción de RAM por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM ram WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'RAM eliminada correctamente'})
"""
Rutas para la gestión de RAM.
Permite crear, listar, actualizar y eliminar opciones de memoria RAM.
"""
from flask import Blueprint, request, jsonify
from backend.db import get_db_connection

ram_bp = Blueprint('ram', __name__)


# Listar todas las opciones de RAM
@ram_bp.route('/ram', methods=['GET'])
def listar_ram():
    # Devuelve todas las opciones de RAM registradas
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM ram ORDER BY nombre')
    rams = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rams)


# Agregar una nueva opción de RAM
@ram_bp.route('/ram', methods=['POST'])
def agregar_ram():
    # Agrega una nueva opción de RAM
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO ram (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
@ram_bp.route('/ram/<int:id>', methods=['PUT'])
def actualizar_ram(id):
    # Actualiza el nombre de una opción de RAM por su ID
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE ram SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'RAM actualizada correctamente'})
@ram_bp.route('/ram/<int:id>', methods=['DELETE'])
def eliminar_ram(id):
    # Elimina una opción de RAM por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM ram WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'RAM eliminada correctamente'})
