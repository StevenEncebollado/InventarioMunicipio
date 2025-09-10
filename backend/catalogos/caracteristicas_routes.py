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
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM caracteristicas WHERE id = %s', (id,))
        conn.commit()
        cur.close()
        conn.close()
        return '', 204
    except Exception as e:
        if 'foreign key constraint' in str(e).lower() or 'violates foreign key' in str(e).lower():
            return jsonify({'error': 'No se puede eliminar la característica porque tiene equipos asociados.'}), 400
        return jsonify({'error': 'Error al eliminar la característica.'}), 500
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
    cur.execute('SELECT id, descripcion FROM caracteristicas ORDER BY descripcion')
    caracteristicas = [{'id': row[0], 'descripcion': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(caracteristicas)


# Agregar una nueva característica
@caracteristicas_bp.route('/caracteristicas', methods=['POST'])
def agregar_caracteristica():
    # Agrega una nueva característica
    data = request.json
    descripcion = data.get('descripcion')
    if not descripcion:
        return jsonify({'error': 'La descripción es obligatoria'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO caracteristicas (descripcion) VALUES (%s) RETURNING id', (descripcion,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'descripcion': descripcion}), 201
@caracteristicas_bp.route('/caracteristicas/<int:id>', methods=['PUT'])
def actualizar_caracteristica(id):
    # Actualiza la descripción de una característica por su ID
    data = request.json
    descripcion = data.get('descripcion')
    if not descripcion:
        return jsonify({'error': 'La descripción es obligatoria'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE caracteristicas SET descripcion = %s WHERE id = %s', (descripcion, id))
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
