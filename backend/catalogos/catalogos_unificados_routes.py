from flask import Blueprint, jsonify
from backend.db import get_db_connection

catalogos_unificados_bp = Blueprint('catalogos_unificados', __name__)

@catalogos_unificados_bp.route('/api/catalogos_unificados', methods=['GET'])
def get_catalogos_unificados():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT * FROM obtener_catalogos_unificados();')
            row = cur.fetchone()
            if row:
                # row es una tupla con los campos en el orden definido en la función
                keys = [
                    'dependencias', 'direcciones', 'dispositivos', 'equipamientos', 'tiposEquipo',
                    'sistemasOperativos', 'caracteristicas', 'ram', 'disco', 'office',
                    'marcas', 'tipoConexion', 'programaAdicional'
                ]
                # Convertir cada campo JSON a objeto Python
                data = {k: row[i] for i, k in enumerate(keys)}
                return jsonify(data)
            else:
                return jsonify({'error': 'No se encontraron catálogos'}), 404
    finally:
        conn.close()
