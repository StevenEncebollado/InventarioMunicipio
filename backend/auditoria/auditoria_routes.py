"""
Rutas para el sistema de auditoría del inventario municipal.
Maneja historial de acciones, estadísticas, logs y exportación de datos.
"""

from flask import Blueprint, request, jsonify, make_response
from backend.db import get_db_connection
import json
import csv
import io
from datetime import datetime, timedelta
from collections import defaultdict
import logging

auditoria_bp = Blueprint('auditoria', __name__)

@auditoria_bp.route('/historial', methods=['GET'])
def obtener_historial():
    """
    Obtiene el historial de inventario con filtros opcionales.
    Parámetros de consulta:
    - fechaInicio: fecha de inicio (YYYY-MM-DD)
    - fechaFin: fecha de fin (YYYY-MM-DD)
    - usuarioId: ID del usuario
    - accion: tipo de acción (agregado, modificado, eliminado)
    - equipoId: ID del equipo/inventario
    - page: número de página (default: 1)
    - limit: elementos por página (default: 50)
    """
    try:
        # Obtener parámetros de filtro
        fecha_inicio = request.args.get('fechaInicio')
        fecha_fin = request.args.get('fechaFin')
        usuario_id = request.args.get('usuarioId')
        accion = request.args.get('accion')
        equipo_id = request.args.get('equipoId')
        page = int(request.args.get('page', 1))
        limit = min(int(request.args.get('limit', 50)), 100)  # Máximo 100 por página
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Construir query dinámicamente
        base_query = """
            SELECT 
                h.id,
                h.inventario_id,
                h.usuario_id,
                h.accion,
                h.fecha,
                h.datos_anteriores,
                h.datos_nuevos,
                u.username as usuario_nombre,
                i.nombre_pc as nombre_equipo,
                i.codigo_inventario as numero_serie
            FROM historial_inventario h
            LEFT JOIN usuario u ON h.usuario_id = u.id
            LEFT JOIN inventario i ON h.inventario_id = i.id
            WHERE 1=1
        """
        
        params = []
        
        # Agregar filtros
        if fecha_inicio:
            base_query += " AND h.fecha >= %s"
            params.append(fecha_inicio)
            
        if fecha_fin:
            base_query += " AND h.fecha <= %s"
            params.append(fecha_fin + " 23:59:59")
            
        if usuario_id:
            base_query += " AND h.usuario_id = %s"
            params.append(usuario_id)
            
        if accion:
            base_query += " AND h.accion = %s"
            params.append(accion)
            
        if equipo_id:
            base_query += " AND h.inventario_id = %s"
            params.append(equipo_id)
        
        # Obtener total de registros
        count_query = f"SELECT COUNT(*) FROM ({base_query}) as total"
        cur.execute(count_query, params)
        total_records = cur.fetchone()[0]
        
        # Agregar paginación y ordenamiento
        base_query += " ORDER BY h.fecha DESC LIMIT %s OFFSET %s"
        params.extend([limit, (page - 1) * limit])
        
        cur.execute(base_query, params)
        columns = [desc[0] for desc in cur.description]
        registros = [dict(zip(columns, row)) for row in cur.fetchall()]
        
        # Formatear datos para el frontend
        for registro in registros:
            if registro['datos_anteriores']:
                try:
                    registro['datos_anteriores'] = json.loads(registro['datos_anteriores'])
                except (json.JSONDecodeError, TypeError):
                    registro['datos_anteriores'] = None
                    
            if registro['datos_nuevos']:
                try:
                    registro['datos_nuevos'] = json.loads(registro['datos_nuevos'])
                except (json.JSONDecodeError, TypeError):
                    registro['datos_nuevos'] = None
        
        cur.close()
        conn.close()
        
        return jsonify({
            'historial': registros,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_records,
                'pages': (total_records + limit - 1) // limit
            }
        })
        
    except Exception as e:
        logging.error(f"Error al obtener historial: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@auditoria_bp.route('/estadisticas', methods=['GET'])
def obtener_estadisticas():
    """
    Obtiene estadísticas de auditoría.
    Retorna: totalAcciones, accionesPorTipo, actividadPorDia
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Total de acciones
        cur.execute("SELECT COUNT(*) FROM historial_inventario")
        total_acciones = cur.fetchone()[0]
        
        # Acciones por tipo
        cur.execute("""
            SELECT accion, COUNT(*) as cantidad 
            FROM historial_inventario 
            GROUP BY accion
        """)
        acciones_por_tipo = dict(cur.fetchall())
        
        # Actividad por día (últimos 30 días)
        fecha_limite = datetime.now() - timedelta(days=30)
        cur.execute("""
            SELECT DATE(fecha) as dia, COUNT(*) as cantidad
            FROM historial_inventario 
            WHERE fecha >= %s
            GROUP BY DATE(fecha)
            ORDER BY dia
        """, (fecha_limite,))
        
        actividad_por_dia = {}
        for row in cur.fetchall():
            dia, cantidad = row
            actividad_por_dia[dia.strftime('%Y-%m-%d')] = cantidad
        
        # Actividad por usuario (top 10)
        cur.execute("""
            SELECT 
                u.username as usuario,
                COUNT(*) as acciones
            FROM historial_inventario h
            LEFT JOIN usuario u ON h.usuario_id = u.id
            WHERE h.fecha >= %s
            GROUP BY h.usuario_id, u.username
            ORDER BY acciones DESC
            LIMIT 10
        """, (fecha_limite,))
        
        actividad_por_usuario = [
            {'usuario': row[0] or 'Usuario desconocido', 'acciones': row[1]}
            for row in cur.fetchall()
        ]
        
        cur.close()
        conn.close()
        
        return jsonify({
            'totalAcciones': total_acciones,
            'accionesPorTipo': acciones_por_tipo,
            'actividadPorDia': actividad_por_dia,
            'actividadPorUsuario': actividad_por_usuario
        })
        
    except Exception as e:
        logging.error(f"Error al obtener estadísticas: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@auditoria_bp.route('/logs', methods=['GET'])
def obtener_logs():
    """
    Obtiene logs técnicos detallados para administradores.
    """
    try:
        page = int(request.args.get('page', 1))
        limit = min(int(request.args.get('limit', 100)), 200)
        nivel = request.args.get('nivel')  # INFO, WARNING, ERROR
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Query más detallado para logs técnicos
        base_query = """
            SELECT 
                h.id,
                h.inventario_id,
                h.usuario_id,
                h.accion,
                h.fecha,
                h.datos_anteriores,
                h.datos_nuevos,
                u.username as usuario_completo,
                i.nombre_pc as nombre_equipo,
                i.codigo_inventario as numero_serie,
                i.direccion_ip,
                extract(epoch from (now() - h.fecha)) as segundos_transcurridos
            FROM historial_inventario h
            LEFT JOIN usuario u ON h.usuario_id = u.id
            LEFT JOIN inventario i ON h.inventario_id = i.id
            ORDER BY h.fecha DESC
            LIMIT %s OFFSET %s
        """
        
        cur.execute(base_query, [limit, (page - 1) * limit])
        columns = [desc[0] for desc in cur.description]
        logs = [dict(zip(columns, row)) for row in cur.fetchall()]
        
        # Enriquecer logs con información adicional
        for log in logs:
            # Determinar nivel de log basado en la acción
            if log['accion'] == 'eliminado':
                log['nivel'] = 'WARNING'
            elif log['accion'] == 'modificado':
                log['nivel'] = 'INFO'
            else:
                log['nivel'] = 'INFO'
            
            # Formatear tiempo transcurrido
            segundos = log.get('segundos_transcurridos', 0)
            if segundos < 3600:  # Menos de una hora
                log['tiempo_transcurrido'] = f"{int(segundos // 60)}m {int(segundos % 60)}s"
            elif segundos < 86400:  # Menos de un día
                log['tiempo_transcurrido'] = f"{int(segundos // 3600)}h {int((segundos % 3600) // 60)}m"
            else:  # Más de un día
                log['tiempo_transcurrido'] = f"{int(segundos // 86400)}d {int((segundos % 86400) // 3600)}h"
        
        # Filtrar por nivel si se especifica
        if nivel:
            logs = [log for log in logs if log['nivel'] == nivel]
        
        cur.close()
        conn.close()
        
        return jsonify({'logs': logs})
        
    except Exception as e:
        logging.error(f"Error al obtener logs: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@auditoria_bp.route('/exportar', methods=['POST'])
def exportar_auditoria():
    """
    Exporta datos de auditoría a CSV con filtros aplicados.
    """
    try:
        data = request.get_json()
        filtros = data.get('filtros', {})
        formato = data.get('formato', 'csv')
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Usar la misma lógica de filtros que en obtener_historial
        base_query = """
            SELECT 
                h.id,
                h.inventario_id,
                h.accion,
                h.fecha,
                u.username as usuario,
                i.nombre_pc as nombre_equipo,
                i.codigo_inventario as numero_serie,
                h.datos_anteriores,
                h.datos_nuevos
            FROM historial_inventario h
            LEFT JOIN usuario u ON h.usuario_id = u.id
            LEFT JOIN inventario i ON h.inventario_id = i.id
            WHERE 1=1
        """
        
        params = []
        
        # Aplicar filtros
        if filtros.get('fechaInicio'):
            base_query += " AND h.fecha >= %s"
            params.append(filtros['fechaInicio'])
            
        if filtros.get('fechaFin'):
            base_query += " AND h.fecha <= %s"
            params.append(filtros['fechaFin'] + " 23:59:59")
            
        if filtros.get('usuarioId'):
            base_query += " AND h.usuario_id = %s"
            params.append(filtros['usuarioId'])
            
        if filtros.get('accion'):
            base_query += " AND h.accion = %s"
            params.append(filtros['accion'])
        
        base_query += " ORDER BY h.fecha DESC LIMIT 10000"  # Límite de seguridad
        
        cur.execute(base_query, params)
        registros = cur.fetchall()
        
        # Crear CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Headers
        headers = ['ID', 'Equipo ID', 'Acción', 'Fecha', 'Usuario', 'Nombre Equipo', 
                  'Número Serie', 'Datos Anteriores', 'Datos Nuevos']
        writer.writerow(headers)
        
        # Datos
        for registro in registros:
            row = list(registro)
            # Convertir JSON a string para CSV
            if row[7]:  # datos_anteriores
                row[7] = json.dumps(row[7]) if isinstance(row[7], dict) else str(row[7])
            if row[8]:  # datos_nuevos
                row[8] = json.dumps(row[8]) if isinstance(row[8], dict) else str(row[8])
            writer.writerow(row)
        
        cur.close()
        conn.close()
        
        # Crear respuesta con archivo CSV
        output.seek(0)
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=auditoria_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        
        return response
        
    except Exception as e:
        logging.error(f"Error al exportar auditoría: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@auditoria_bp.route('/registrar-accion', methods=['POST'])
def registrar_accion():
    """
    Registra una acción manual en el historial.
    """
    try:
        data = request.get_json()
        
        inventario_id = data.get('inventario_id')
        usuario_id = data.get('usuario_id')
        accion = data.get('accion')
        datos_anteriores = data.get('datos_anteriores')
        datos_nuevos = data.get('datos_nuevos')
        
        if not all([inventario_id, usuario_id, accion]):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO historial_inventario 
            (inventario_id, usuario_id, accion, datos_anteriores, datos_nuevos)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            inventario_id,
            usuario_id,
            accion,
            json.dumps(datos_anteriores) if datos_anteriores else None,
            json.dumps(datos_nuevos) if datos_nuevos else None
        ))
        
        nuevo_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'id': nuevo_id,
            'message': 'Acción registrada exitosamente'
        }), 201
        
    except Exception as e:
        logging.error(f"Error al registrar acción: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


def registrar_accion_automatica(inventario_id, usuario_id, accion, datos_anteriores=None, datos_nuevos=None):
    """
    Función helper para registrar acciones automáticamente desde otros módulos.
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO historial_inventario 
            (inventario_id, usuario_id, accion, datos_anteriores, datos_nuevos)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            inventario_id,
            usuario_id,
            accion,
            json.dumps(datos_anteriores) if datos_anteriores else None,
            json.dumps(datos_nuevos) if datos_nuevos else None
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        logging.error(f"Error en auto-logging: {str(e)}")
        return False