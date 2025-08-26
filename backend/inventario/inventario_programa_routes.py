"""
Rutas para asociar y desasociar programas adicionales a un inventario.
Permite agregar, quitar y consultar programas asociados a un bien.
"""
from flask import Blueprint, request, jsonify
from backend.db import get_db_connection

inventario_programa_bp = Blueprint('inventario_programa', __name__)


# Listar programas adicionales asociados a un inventario
@inventario_programa_bp.route('/inventario/<int:inventario_id>/programas', methods=['GET'])
def listar_programas_de_inventario(inventario_id):
    # Devuelve todos los programas adicionales asociados a un inventario
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        SELECT pa.id, pa.nombre FROM programa_adicional pa
        JOIN inventario_programa ip ON pa.id = ip.programa_id
        WHERE ip.inventario_id = %s
        ORDER BY pa.nombre
    ''', (inventario_id,))
    programas = [{'id': row[0], 'nombre': row[1]} for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(programas)


# Asociar programas adicionales a un inventario (reemplaza los existentes)
@inventario_programa_bp.route('/inventario/<int:inventario_id>/programas', methods=['POST'])
def asociar_programas_a_inventario(inventario_id):
    # Asocia una lista de programas adicionales a un inventario
    data = request.json
    programas = data.get('programas', [])  # lista de IDs
    conn = get_db_connection()
    cur = conn.cursor()
    # Eliminar asociaciones previas
    cur.execute('DELETE FROM inventario_programa WHERE inventario_id = %s', (inventario_id,))
    # Insertar nuevas asociaciones
    for programa_id in programas:
        cur.execute('INSERT INTO inventario_programa (inventario_id, programa_id) VALUES (%s, %s)', (inventario_id, programa_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Programas asociados correctamente'})
