"""
Rutas para la gestión de tipo de sistema operativo.
Permite crear, listar, actualizar y eliminar tipos de sistema operativo.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

tipo_so_bp = Blueprint('tipo_sistema_operativo', __name__)

@tipo_so_bp.route('/tipo_sistema_operativo', methods=['GET'])
def listar_tipo_so():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM tipo_sistema_operativo ORDER BY nombre')
    tipos = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(tipos)

@tipo_so_bp.route('/tipo_sistema_operativo', methods=['POST'])
def agregar_tipo_so():
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO tipo_sistema_operativo (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201

@tipo_so_bp.route('/tipo_sistema_operativo/<int:id>', methods=['DELETE'])
def eliminar_tipo_so(id):
    """Elimina un tipo de sistema operativo por su ID."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM tipo_sistema_operativo WHERE id = %s', (id,))
        conn.commit()
        cur.close()
        conn.close()
        return '', 204
    except Exception as e:
        if 'foreign key constraint' in str(e).lower() or 'violates foreign key' in str(e).lower():
            return jsonify({'error': 'No se puede eliminar el tipo de sistema operativo porque tiene equipos asociados.'}), 400
        return jsonify({'error': 'Error al eliminar el tipo de sistema operativo.'}), 500
