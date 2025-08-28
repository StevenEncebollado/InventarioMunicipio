from flask import Blueprint, request, jsonify
from ..db import get_db_connection

marca_bp = Blueprint('marca', __name__)

@marca_bp.route('/marca/<int:id>', methods=['PUT'])
def actualizar_marca(id):
    """Actualiza el nombre de una marca por su ID."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE marca SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Marca actualizada correctamente'})

@marca_bp.route('/marca/<int:id>', methods=['DELETE'])
def eliminar_marca(id):
    """Elimina una marca por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM marca WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Marca eliminada correctamente'})
"""
Rutas para la gestión de marcas de equipos.
Permite crear, listar, actualizar y eliminar marcas.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

marca_bp = Blueprint('marca', __name__)

@marca_bp.route('/marca', methods=['GET'])
def listar_marca():
    """Devuelve todas las marcas registradas."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre FROM marca ORDER BY nombre')
    marcas = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(marcas)

@marca_bp.route('/marca', methods=['POST'])
def agregar_marca():
    """Agrega una nueva marca."""
    data = request.json
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'error': 'El nombre es obligatorio'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO marca (nombre) VALUES (%s) RETURNING id', (nombre,))
    nueva_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': nueva_id, 'nombre': nombre}), 201
