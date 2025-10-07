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
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si la dependencia existe y obtener información
        cur.execute('SELECT nombre FROM dependencia WHERE id = %s', (dependencia_id,))
        dependencia = cur.fetchone()
        
        if not dependencia:
            return jsonify({'error': 'Dependencia no encontrada'}), 404
        
        nombre_dependencia = dependencia[0]
        
        # Verificar si tiene equipos asociados
        cur.execute('SELECT COUNT(*) FROM inventario WHERE dependencia_id = %s', (dependencia_id,))
        equipos_asociados = cur.fetchone()[0]
        
        if equipos_asociados > 0:
            return jsonify({
                'error': f'No se puede eliminar la dependencia "{nombre_dependencia}" porque tiene {equipos_asociados} equipo(s) asociado(s).'
            }), 400
        
        # Eliminar la dependencia
        cur.execute('DELETE FROM dependencia WHERE id = %s', (dependencia_id,))
        
        if cur.rowcount == 0:
            return jsonify({'error': 'Error: la dependencia no pudo ser eliminada'}), 500
            
        conn.commit()
        return jsonify({'message': f'Dependencia "{nombre_dependencia}" eliminada correctamente'}), 200
        
    except Exception as e:
        print(f"Error al eliminar dependencia {dependencia_id}: {str(e)}")
        if conn:
            conn.rollback()
        
        error_msg = str(e).lower()
        if 'foreign key constraint' in error_msg or 'violates foreign key' in error_msg:
            return jsonify({'error': 'No se puede eliminar la dependencia porque tiene elementos asociados.'}), 400
        else:
            return jsonify({'error': f'Error interno: {str(e)}'}), 500
            
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


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