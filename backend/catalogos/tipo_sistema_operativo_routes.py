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
    # Verificar si ya existe
    cur.execute('SELECT id FROM tipo_sistema_operativo WHERE nombre = %s', (nombre,))
    existe = cur.fetchone()
    if existe:
        cur.close()
        conn.close()
        return jsonify({'error': 'El tipo de sistema operativo ya existe'}), 400
    cur.execute('INSERT INTO tipo_sistema_operativo (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
