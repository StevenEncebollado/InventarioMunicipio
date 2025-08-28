from flask import Blueprint, request, jsonify
from ..db import get_db_connection

office_bp = Blueprint('office', __name__)

@office_bp.route('/office/<int:id>', methods=['PUT'])
def actualizar_office(id):
    """Actualiza el nombre de una versión de Office por su ID."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE office SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Office actualizado correctamente'})

@office_bp.route('/office/<int:id>', methods=['DELETE'])
def eliminar_office(id):
    """Elimina una versión de Office por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM office WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Office eliminado correctamente'})
"""
Rutas para la gestión de versiones de Office.
Permite crear, listar, actualizar y eliminar versiones de Office.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

office_bp = Blueprint('office', __name__)


# Listar todas las versiones de Office
@office_bp.route('/office', methods=['GET'])
def listar_office():
    # Devuelve todas las versiones de Office registradas
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, version FROM office ORDER BY version')
    offices = [{'id': row[0], 'version': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(offices)


# Agregar una nueva versión de Office
@office_bp.route('/office', methods=['POST'])
def agregar_office():
    # Agrega una nueva versión de Office
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO office (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
@office_bp.route('/office/<int:id>', methods=['PUT'])
def actualizar_office(id):
    # Actualiza el nombre de una versión de Office por su ID
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE office SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Office actualizado correctamente'})
@office_bp.route('/office/<int:id>', methods=['DELETE'])
def eliminar_office(id):
    # Elimina una versión de Office por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM office WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Office eliminado correctamente'})
