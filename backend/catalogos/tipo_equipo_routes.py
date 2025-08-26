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
