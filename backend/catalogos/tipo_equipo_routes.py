"""
Rutas para la gestión de tipo de equipo (PC de escritorio, Laptop).
Permite crear, listar, actualizar y eliminar tipos de equipo.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

tipo_equipo_bp = Blueprint('tipo_equipo', __name__)

@tipo_equipo_bp.route('/tipo_equipo', methods=['GET'])
def listar_tipo_equipo():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM tipo_equipo ORDER BY nombre')
    tipos = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(tipos)

@tipo_equipo_bp.route('/tipo_equipo', methods=['POST'])
def agregar_tipo_equipo():
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO tipo_equipo (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201

@tipo_equipo_bp.route('/tipo_equipo/<int:id>', methods=['DELETE'])
def eliminar_tipo_equipo(id):
    """Elimina un tipo de equipo por su ID."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM tipo_equipo WHERE id = %s', (id,))
        conn.commit()
        cur.close()
        conn.close()
        return '', 204
    except Exception as e:
        if 'foreign key constraint' in str(e).lower() or 'violates foreign key' in str(e).lower():
            return jsonify({'error': 'No se puede eliminar el tipo de equipo porque tiene equipos asociados.'}), 400
        return jsonify({'error': 'Error al eliminar el tipo de equipo.'}), 500


@tipo_equipo_bp.route('/tipo_equipo/<int:id>', methods=['PUT'])
def actualizar_tipo_equipo(id):
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE tipo_equipo SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': id, 'nombre': nombre})
