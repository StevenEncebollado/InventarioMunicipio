"""
Rutas para reportes y consultas específicas del inventario.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection
from ..auditoria.auditoria_routes import registrar_accion_automatica

reportes_bp = Blueprint('reportes', __name__)


# Reporte general de inventario
@reportes_bp.route('/inventario_general', methods=['GET'])
def reporte_inventario_general():
    # Devuelve todos los registros del inventario para reporte general
    usuario_id = request.args.get('usuario_id', type=int)
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM inventario')
    data = cur.fetchall()
    cur.close()
    conn.close()
    
    # Registrar generación de reporte en auditoría
    if usuario_id:
        registrar_accion_automatica(
            inventario_id=None,
            usuario_id=usuario_id,
            accion='reporte_generado',
            datos_nuevos={
                'tipo_reporte': 'inventario_general',
                'accion_detalle': 'Generación de reporte general de inventario',
                'cantidad_registros': len(data)
            }
        )
    
    return jsonify(data)



# Consultar historial de inventario, filtrando por acción
@reportes_bp.route('/historial', methods=['GET'])
def historial_inventario():
    # Devuelve el historial de acciones sobre el inventario. Permite filtrar por acción
    accion = request.args.get('accion')  # Puede ser 'agregado', 'modificado', 'eliminado' o None
    conn = get_db_connection()
    cur = conn.cursor()
    if accion:
        cur.execute('SELECT * FROM historial_inventario WHERE accion = %s ORDER BY fecha DESC', (accion,))
    else:
        cur.execute('SELECT * FROM historial_inventario ORDER BY fecha DESC')
    columns = [desc[0] for desc in cur.description]
    historial = [dict(zip(columns, row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(historial)
