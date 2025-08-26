@programa_adicional_bp.route('/programas_adicionales/<int:id>', methods=['PUT'])
def actualizar_programa_adicional(id):
    """Actualiza el nombre de un programa adicional por su ID."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE programa_adicional SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Programa adicional actualizado correctamente'})

@programa_adicional_bp.route('/programas_adicionales/<int:id>', methods=['DELETE'])
def eliminar_programa_adicional(id):
    """Elimina un programa adicional por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM programa_adicional WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Programa adicional eliminado correctamente'})
"""
Rutas para la gestión de programas adicionales (multi-select en inventario).
Permite crear, listar, actualizar y eliminar programas adicionales.
"""
from flask import Blueprint, request, jsonify
from backend.db import get_db_connection

programa_adicional_bp = Blueprint('programa_adicional', __name__)


# Listar todos los programas adicionales
@programa_adicional_bp.route('/programas_adicionales', methods=['GET'])
def listar_programas_adicionales():
    # Devuelve todos los programas adicionales registrados
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM programa_adicional ORDER BY nombre')
    programas = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(programas)


# Agregar un nuevo programa adicional
@programa_adicional_bp.route('/programas_adicionales', methods=['POST'])
def agregar_programa_adicional():
    # Agrega un nuevo programa adicional
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO programa_adicional (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
@programa_adicional_bp.route('/programas_adicionales/<int:id>', methods=['PUT'])
def actualizar_programa_adicional(id):
    # Actualiza el nombre de un programa adicional por su ID
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE programa_adicional SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Programa adicional actualizado correctamente'})
@programa_adicional_bp.route('/programas_adicionales/<int:id>', methods=['DELETE'])
def eliminar_programa_adicional(id):
    # Elimina un programa adicional por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM programa_adicional WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Programa adicional eliminado correctamente'})
