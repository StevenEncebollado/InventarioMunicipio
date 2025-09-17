"""
Rutas para la gestión de dependencias (departamentos/áreas).
Permite crear, listar, actualizar y eliminar dependencias.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

dependencias_bp = Blueprint('dependencias', __name__)

@dependencias_bp.route('/dependencias', methods=['GET'])
def listar_dependencias():
    """Devuelve todas las dependencias registradas."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute('SELECT id, nombre FROM dependencia ORDER BY nombre')
            dependencias = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    return jsonify(dependencias)

@dependencias_bp.route('/dependencias', methods=['POST'])
def agregar_dependencia():
    """Agrega una nueva dependencia."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO dependencia (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201


@dependencias_bp.route('/dependencias/<int:dependencia_id>', methods=['DELETE'])
def eliminar_dependencia(dependencia_id):
    """Elimina una dependencia por su ID."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM dependencia WHERE id = %s', (dependencia_id,))
        conn.commit()
        cur.close()
        conn.close()
        return '', 204
    except Exception as e:
        if 'foreign key constraint' in str(e).lower() or 'violates foreign key' in str(e).lower():
            return jsonify({'error': 'No se puede eliminar la dependencia porque tiene direcciones o equipos asociados.'}), 400
        return jsonify({'error': 'Error al eliminar la dependencia.'}), 500


@dependencias_bp.route('/dependencias/<int:dependencia_id>', methods=['PUT'])
def actualizar_dependencia(dependencia_id):
    """Actualiza el nombre de una dependencia por su ID."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE dependencia SET nombre = %s WHERE id = %s', (nombre, dependencia_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Dependencia actualizada correctamente'})