from flask import Blueprint, request, jsonify
from ..db import get_db_connection

ram_bp = Blueprint('ram', __name__)

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
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM ram WHERE id = %s', (id,))
        conn.commit()
        cur.close()
        conn.close()
        return '', 204
    except Exception as e:
        if 'foreign key constraint' in str(e).lower() or 'violates foreign key' in str(e).lower():
            return jsonify({'error': 'No se puede eliminar la RAM porque tiene equipos asociados.'}), 400
        return jsonify({'error': 'Error al eliminar la RAM.'}), 500
"""
Rutas para la gestión de RAM.
Permite crear, listar, actualizar y eliminar opciones de memoria RAM.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

ram_bp = Blueprint('ram', __name__)


# Listar todas las opciones de RAM
@ram_bp.route('/ram', methods=['GET'])
def listar_ram():
    # Devuelve todas las opciones de RAM registradas
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, capacidad FROM ram ORDER BY capacidad')
    rams = [{'id': row[0], 'capacidad': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(rams)


# Agregar una nueva opción de RAM
@ram_bp.route('/ram', methods=['POST'])
def agregar_ram():
    # Agrega una nueva opción de RAM
    data = request.json
    capacidad = data.get('capacidad')
    if not capacidad:
        return jsonify({'error': 'La capacidad es obligatoria'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO ram (capacidad) VALUES (%s) RETURNING id', (capacidad,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'capacidad': capacidad}), 201
@ram_bp.route('/ram/<int:id>', methods=['PUT'])
def actualizar_ram(id):
    # Actualiza la capacidad de una opción de RAM por su ID
    data = request.json
    capacidad = data.get('capacidad')
    if not capacidad:
        return jsonify({'error': 'La capacidad es obligatoria'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE ram SET capacidad = %s WHERE id = %s', (capacidad, id))
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
