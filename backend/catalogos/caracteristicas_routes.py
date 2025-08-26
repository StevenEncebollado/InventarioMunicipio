from flask import Blueprint, request, jsonify
from ..db import get_db_connection

caracteristicas_bp = Blueprint('caracteristicas', __name__)

@caracteristicas_bp.route('/caracteristicas/<int:id>', methods=['PUT'])
def actualizar_caracteristica(id):
    """Actualiza el nombre de una característica por su ID."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE caracteristicas SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Característica actualizada correctamente'})

@caracteristicas_bp.route('/caracteristicas/<int:id>', methods=['DELETE'])
def eliminar_caracteristica(id):
    """Elimina una característica por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM caracteristicas WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Característica eliminada correctamente'})
"""
Rutas para la gestión de características de hardware (ej: procesador).
Permite crear, listar, actualizar y eliminar características.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

caracteristicas_bp = Blueprint('caracteristicas', __name__)


# Listar todas las características
@caracteristicas_bp.route('/caracteristicas', methods=['GET'])
def listar_caracteristicas():
    # Devuelve todas las características registradas
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM caracteristicas ORDER BY nombre')
    caracteristicas = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(caracteristicas)


# Agregar una nueva característica
@caracteristicas_bp.route('/caracteristicas', methods=['POST'])
def agregar_caracteristica():
    # Agrega una nueva característica
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # Verificar si ya existe
    cur.execute('SELECT id FROM caracteristicas WHERE nombre = %s', (nombre,))
    existe = cur.fetchone()
    if existe:
        cur.close()
        conn.close()
        return jsonify({'error': 'La característica ya existe'}), 400
    cur.execute('INSERT INTO caracteristicas (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
@caracteristicas_bp.route('/caracteristicas/<int:id>', methods=['PUT'])
def actualizar_caracteristica(id):
    # Actualiza el nombre de una característica por su ID
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE caracteristicas SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Característica actualizada correctamente'})
@caracteristicas_bp.route('/caracteristicas/<int:id>', methods=['DELETE'])
def eliminar_caracteristica(id):
    # Elimina una característica por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM caracteristicas WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Característica eliminada correctamente'})
