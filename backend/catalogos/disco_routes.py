from flask import Blueprint, request, jsonify
from ..db import get_db_connection

disco_bp = Blueprint('disco', __name__)

@disco_bp.route('/disco/<int:id>', methods=['PUT'])
def actualizar_disco(id):
    """Actualiza el nombre de una opción de disco por su ID."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE disco SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Disco actualizado correctamente'})

@disco_bp.route('/disco/<int:id>', methods=['DELETE'])
def eliminar_disco(id):
    """Elimina una opción de disco por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM disco WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Disco eliminado correctamente'})
"""
Rutas para la gestión de discos duros.
Permite crear, listar, actualizar y eliminar opciones de disco.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

disco_bp = Blueprint('disco', __name__)


# Listar todas las opciones de disco
@disco_bp.route('/disco', methods=['GET'])
def listar_disco():
    # Devuelve todas las opciones de disco registradas
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM disco ORDER BY nombre')
    discos = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(discos)


# Agregar una nueva opción de disco
@disco_bp.route('/disco', methods=['POST'])
def agregar_disco():
    # Agrega una nueva opción de disco
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # Verificar si ya existe
    cur.execute('SELECT id FROM disco WHERE nombre = %s', (nombre,))
    existe = cur.fetchone()
    if existe:
        cur.close()
        conn.close()
        return jsonify({'error': 'La opción de disco ya existe'}), 400
    cur.execute('INSERT INTO disco (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
@disco_bp.route('/disco/<int:id>', methods=['PUT'])
def actualizar_disco(id):
    # Actualiza el nombre de una opción de disco por su ID
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE disco SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Disco actualizado correctamente'})
@disco_bp.route('/disco/<int:id>', methods=['DELETE'])
def eliminar_disco(id):
    # Elimina una opción de disco por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM disco WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Disco eliminado correctamente'})
