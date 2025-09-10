"""
Rutas para la gestión de dispositivos (hardware).
Permite crear, listar, actualizar y eliminar dispositivos.
"""
import json
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

dispositivos_bp = Blueprint('dispositivos', __name__)

@dispositivos_bp.route('/dispositivos', methods=['GET'])
def listar_dispositivos():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre, campos FROM dispositivo ORDER BY nombre')
    dispositivos = [{'id': row[0], 'nombre': row[1], 'campos': row[2] or []} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(dispositivos)


@dispositivos_bp.route('/dispositivos', methods=['POST'])
def agregar_dispositivo():
    """Agrega un nuevo dispositivo con sus campos configurables."""
    data = request.json
    nombre = data.get('nombre')
    campos = data.get('campos', [])
    
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO dispositivo (nombre, campos) VALUES (%s, %s) RETURNING id', 
                (nombre, json.dumps(campos)))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre, 'campos': campos}), 201

# Endpoint para actualizar un dispositivo existente
@dispositivos_bp.route('/dispositivos/<int:id>', methods=['PUT'])
def actualizar_dispositivo(id):
    """Actualiza el nombre y campos de un dispositivo por su ID."""
    data = request.json
    nombre = data.get('nombre')
    campos = data.get('campos', [])
    
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE dispositivo SET nombre = %s, campos = %s WHERE id = %s', 
                (nombre, json.dumps(campos), id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Dispositivo actualizado correctamente'})

# Endpoint para eliminar un dispositivo existente
@dispositivos_bp.route('/dispositivos/<int:id>', methods=['DELETE'])
def eliminar_dispositivo(id):
    """Elimina un dispositivo por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM dispositivo WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Dispositivo eliminado correctamente'})
