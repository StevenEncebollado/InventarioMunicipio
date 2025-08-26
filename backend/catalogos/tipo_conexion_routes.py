from flask import Blueprint, request, jsonify
from ..db import get_db_connection

tipo_conexion_bp = Blueprint('tipo_conexion', __name__)

@tipo_conexion_bp.route('/tipo_conexion/<int:id>', methods=['PUT'])
def actualizar_tipo_conexion(id):
    """Actualiza el nombre de un tipo de conexión por su ID."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE tipo_conexion SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Tipo de conexión actualizado correctamente'})

@tipo_conexion_bp.route('/tipo_conexion/<int:id>', methods=['DELETE'])
def eliminar_tipo_conexion(id):
    """Elimina un tipo de conexión por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM tipo_conexion WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Tipo de conexión eliminado correctamente'})
"""
Rutas para la gestión de tipo de conexión (LAN, WIFI, USB WIRELESS).
Permite crear, listar, actualizar y eliminar tipos de conexión.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

tipo_conexion_bp = Blueprint('tipo_conexion', __name__)

@tipo_conexion_bp.route('/tipo_conexion', methods=['GET'])
def listar_tipo_conexion():
    """Devuelve todos los tipos de conexión registrados."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM tipo_conexion ORDER BY nombre')
    tipos = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(tipos)

@tipo_conexion_bp.route('/tipo_conexion', methods=['POST'])
def agregar_tipo_conexion():
    """Agrega un nuevo tipo de conexión."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # Verificar si ya existe
    cur.execute('SELECT id FROM tipo_conexion WHERE nombre = %s', (nombre,))
    existe = cur.fetchone()
    if existe:
        cur.close()
        conn.close()
        return jsonify({'error': 'El tipo de conexión ya existe'}), 400
    cur.execute('INSERT INTO tipo_conexion (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
