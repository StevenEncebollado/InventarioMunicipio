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
        
        # Construir query dinámicamente - MEJORADA para incluir todos los registros
        base_query = """
            SELECT 
                h.id,
                h.inventario_id,
                h.usuario_id,
                h.accion,
                h.fecha,
                h.datos_anteriores,
                h.datos_nuevos,
                COALESCE(u.username, 'Usuario Eliminado') as usuario_nombre,
                COALESCE(i.nombre_pc, 'N/A') as nombre_equipo,
                COALESCE(i.codigo_inventario, 'N/A') as numero_serie,
                CASE 
                    WHEN h.inventario_id IS NULL THEN 
                        CASE 
                            WHEN h.accion = 'usuario_registrado' THEN 'Registro de Usuario'
                            WHEN h.accion = 'login' THEN 'Inicio de Sesión'
                            WHEN h.accion = 'reporte_generado' THEN 'Generación de Reporte'
                            ELSE 'Acción del Sistema'
                        END
                    WHEN h.datos_nuevos ? 'descripcion_accion' THEN h.datos_nuevos->>'descripcion_accion'
                    WHEN h.datos_nuevos ? 'detalle' THEN h.datos_nuevos->>'detalle'
                    ELSE COALESCE(i.nombre_pc, 'N/A')
                END as descripcion_accion
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
        
        # Acciones por tipo (mejorado para contar cambios de estado a inactivo como eliminados)
        cur.execute("""
            SELECT accion, COUNT(*) as cantidad 
            FROM historial_inventario 
            GROUP BY accion
        """)
        acciones_raw = dict(cur.fetchall())
        
        # Contar cambios a estado "Inactivo" como eliminados
        cur.execute("""
            SELECT COUNT(*) 
            FROM historial_inventario 
            WHERE accion = 'cambio_estado' 
            AND (
                datos_nuevos::text LIKE '%"estado": "Inactivo"%' 
                OR datos_nuevos::text LIKE '%"estado":"Inactivo"%'
            )
        """)
        equipos_inactivos = cur.fetchone()[0]
        
        # Estructurar acciones por tipo de manera más intuitiva
        acciones_por_tipo = {
            'agregado': acciones_raw.get('agregado', 0),
            'modificado': acciones_raw.get('modificado', 0) + acciones_raw.get('cambio_estado', 0) - equipos_inactivos,
            'eliminado': acciones_raw.get('eliminado', 0) + equipos_inactivos,  # Incluir cambios a inactivo
            'cambio_estado': acciones_raw.get('cambio_estado', 0),
            'login': acciones_raw.get('login', 0),
            'registro': acciones_raw.get('registro', 0)
        }
        
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


@auditoria_bp.route('/reportes/inventario_general', methods=['GET'])
def reporte_inventario_general():
    """
    Genera reporte general de inventario con filtros avanzados.
    Unificado desde reportes_routes.py para centralizar en auditoría.
    """
    try:
        usuario_id = request.args.get('usuario_id', type=int)
        estado_filtro = request.args.get('estado')
        dependencia_filtro = request.args.get('dependencia_id', type=int)
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Query con filtros opcionales
        query = """
            SELECT 
                i.*,
                d.nombre as dependencia_nombre,
                da.nombre as direccion_area_nombre,
                u.username as usuario_propietario
            FROM inventario i
            LEFT JOIN dependencia d ON i.dependencia_id = d.id
            LEFT JOIN direccion_area da ON i.direccion_area_id = da.id
            LEFT JOIN usuario u ON i.usuario_id = u.id
            WHERE 1=1
        """
        params = []
        
        if estado_filtro:
            query += " AND i.estado = %s"
            params.append(estado_filtro)
            
        if dependencia_filtro:
            query += " AND i.dependencia_id = %s"
            params.append(dependencia_filtro)
        
        query += " ORDER BY i.fecha_registro DESC"
        
        cur.execute(query, params)
        columns = [desc[0] for desc in cur.description]
        equipos = [dict(zip(columns, row)) for row in cur.fetchall()]
        
        # Registrar generación de reporte en auditoría
        if usuario_id:
            registrar_accion_automatica(
                inventario_id=None,
                usuario_accion_id=usuario_id,
                accion='reporte_generado',
                datos_nuevos={
                    'tipo_reporte': 'inventario_general',
                    'filtros_aplicados': {
                        'estado': estado_filtro,
                        'dependencia_id': dependencia_filtro
                    },
                    'cantidad_registros': len(equipos),
                    'accion_detalle': f'Generación de reporte general con {len(equipos)} equipos'
                }
            )
        
        cur.close()
        conn.close()
        
        return jsonify({
            'equipos': equipos,
            'total': len(equipos),
            'filtros_aplicados': {
                'estado': estado_filtro,
                'dependencia_id': dependencia_filtro
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logging.error(f"Error al generar reporte de inventario: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@auditoria_bp.route('/reportes/equipos_modificados', methods=['GET'])
def reporte_equipos_modificados():
    """
    Reporte de equipos modificados en un período específico.
    """
    try:
        usuario_id = request.args.get('usuario_id', type=int)
        dias_atras = int(request.args.get('dias_atras', 30))
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Obtener equipos modificados en el período
        cur.execute("""
            SELECT 
                h.inventario_id,
                i.codigo_inventario,
                i.nombre_pc,
                i.nombres_funcionario,
                d.nombre as dependencia_nombre,
                COUNT(h.id) as modificaciones,
                MAX(h.fecha) as ultima_modificacion,
                u.username as ultimo_usuario
            FROM historial_inventario h
            INNER JOIN inventario i ON h.inventario_id = i.id
            LEFT JOIN dependencia d ON i.dependencia_id = d.id
            LEFT JOIN usuario u ON h.usuario_id = u.id
            WHERE h.fecha >= NOW() - INTERVAL '%s days'
                AND h.accion IN ('modificado', 'cambio_estado')
            GROUP BY h.inventario_id, i.codigo_inventario, i.nombre_pc, 
                     i.nombres_funcionario, d.nombre, u.username
            ORDER BY COUNT(h.id) DESC, MAX(h.fecha) DESC
        """, (dias_atras,))
        
        columns = [desc[0] for desc in cur.description]
        equipos_modificados = [dict(zip(columns, row)) for row in cur.fetchall()]
        
        # Registrar generación de reporte
        if usuario_id:
            registrar_accion_automatica(
                inventario_id=None,
                usuario_accion_id=usuario_id,
                accion='reporte_generado',
                datos_nuevos={
                    'tipo_reporte': 'equipos_modificados',
                    'periodo_dias': dias_atras,
                    'cantidad_registros': len(equipos_modificados),
                    'accion_detalle': f'Reporte de equipos modificados en {dias_atras} días'
                }
            )
        
        cur.close()
        conn.close()
        
        return jsonify({
            'equipos_modificados': equipos_modificados,
            'periodo_dias': dias_atras,
            'total_equipos_modificados': len(equipos_modificados),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logging.error(f"Error al generar reporte de equipos modificados: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@auditoria_bp.route('/reportes/estadisticas_avanzadas', methods=['GET'])
def estadisticas_avanzadas():
    """
    Estadísticas avanzadas del sistema para el dashboard de auditoría.
    """
    try:
        usuario_id = request.args.get('usuario_id', type=int)
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Estadísticas generales
        cur.execute("SELECT COUNT(*) FROM inventario")
        total_equipos = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM inventario WHERE estado = 'Activo'")
        equipos_activos = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM inventario WHERE estado = 'Inactivo'")
        equipos_inactivos = cur.fetchone()[0]
        
        # Actividad por usuarios
        cur.execute("""
            SELECT 
                u.username,
                COUNT(h.id) as acciones_realizadas,
                MAX(h.fecha) as ultima_actividad
            FROM historial_inventario h
            INNER JOIN usuario u ON h.usuario_id = u.id
            WHERE h.fecha >= NOW() - INTERVAL '30 days'
            GROUP BY u.username
            ORDER BY COUNT(h.id) DESC
            LIMIT 10
        """)
        columns = [desc[0] for desc in cur.description]
        actividad_usuarios = [dict(zip(columns, row)) for row in cur.fetchall()]
        
        # Acciones por día (últimos 7 días)
        cur.execute("""
            SELECT 
                DATE(h.fecha) as fecha,
                h.accion,
                COUNT(*) as cantidad
            FROM historial_inventario h
            WHERE h.fecha >= NOW() - INTERVAL '7 days'
            GROUP BY DATE(h.fecha), h.accion
            ORDER BY DATE(h.fecha) DESC, h.accion
        """)
        tendencias_semanales = [dict(zip(columns, row)) for row in cur.fetchall()]
        
        # Registrar generación de estadísticas
        if usuario_id:
            registrar_accion_automatica(
                inventario_id=None,
                usuario_accion_id=usuario_id,
                accion='reporte_generado',
                datos_nuevos={
                    'tipo_reporte': 'estadisticas_avanzadas',
                    'accion_detalle': 'Consulta de estadísticas avanzadas del sistema'
                }
            )
        
        cur.close()
        conn.close()
        
        return jsonify({
            'estadisticas_generales': {
                'total_equipos': total_equipos,
                'equipos_activos': equipos_activos,
                'equipos_inactivos': equipos_inactivos
            },
            'actividad_usuarios': actividad_usuarios,
            'tendencias_semanales': tendencias_semanales,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logging.error(f"Error al generar estadísticas avanzadas: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500
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


def sanitizar_datos_para_json(datos):
    """Convierte objetos datetime y otros tipos no serializables a string para JSON"""
    if not datos:
        return datos
    
    if isinstance(datos, dict):
        datos_limpios = {}
        for key, value in datos.items():
            if isinstance(value, datetime):
                datos_limpios[key] = value.isoformat()
            elif hasattr(value, '__dict__'):
                datos_limpios[key] = str(value)
            else:
                datos_limpios[key] = value
        return datos_limpios
    
    return datos


def registrar_accion_automatica(inventario_id, usuario_accion_id, accion, datos_anteriores=None, datos_nuevos=None, usuario_propietario_id=None):
    """
    Registra acciones automáticamente en el historial de auditoría.
    
    Args:
        inventario_id: ID del equipo afectado
        usuario_accion_id: ID del usuario que realiza la acción
        accion: Tipo de acción ('agregado', 'modificado', 'eliminado', etc.)
        datos_anteriores: Datos antes del cambio
        datos_nuevos: Datos después del cambio
        usuario_propietario_id: ID del usuario propietario del equipo
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if datos_nuevos is None:
            datos_nuevos = {}
        
        # Generar descripción específica según el tipo de acción
        descripcion_accion = generar_descripcion_accion(accion, datos_anteriores, datos_nuevos)
        
        # Agregar metadatos útiles
        if isinstance(datos_nuevos, dict):
            datos_nuevos['timestamp'] = datetime.now().isoformat()
            datos_nuevos['descripcion_accion'] = descripcion_accion
            if usuario_propietario_id and usuario_propietario_id != usuario_accion_id:
                datos_nuevos['usuario_propietario_id'] = usuario_propietario_id
        
        # Limpiar datos antes de serializar a JSON
        datos_anteriores_limpios = sanitizar_datos_para_json(datos_anteriores)
        datos_nuevos_limpios = sanitizar_datos_para_json(datos_nuevos)
        
        cur.execute("""
            INSERT INTO historial_inventario 
            (inventario_id, usuario_id, accion, datos_anteriores, datos_nuevos)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            inventario_id,
            usuario_accion_id,
            accion,
            json.dumps(datos_anteriores_limpios) if datos_anteriores_limpios else None,
            json.dumps(datos_nuevos_limpios) if datos_nuevos_limpios else None
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        logging.error(f"Error en auditoría: {str(e)}")
        return False


def generar_descripcion_accion(accion, datos_anteriores=None, datos_nuevos=None):
    """
    Genera descripciones específicas para cada tipo de acción.
    """
    try:
        if accion == 'cambio_estado':
            estado_anterior = datos_anteriores.get('estado', 'N/A') if datos_anteriores else 'N/A'
            estado_nuevo = datos_nuevos.get('estado', 'N/A') if datos_nuevos else 'N/A'
            return f"{estado_anterior} -> {estado_nuevo}"
        
        elif accion == 'usuario_registrado':
            username = datos_nuevos.get('username', 'N/A') if datos_nuevos else 'N/A'
            return f"Nuevo usuario '{username}' registrado en el sistema"
        
        elif accion == 'login':
            username = datos_nuevos.get('username', 'N/A') if datos_nuevos else 'N/A'
            return f"Usuario '{username}' inició sesión"
        
        elif accion == 'logout':
            username = datos_nuevos.get('username', 'N/A') if datos_nuevos else 'N/A'
            return f"Usuario '{username}' cerró sesión"
        
        elif accion == 'agregado':
            nombre_pc = datos_nuevos.get('nombre_pc', 'N/A') if datos_nuevos else 'N/A'
            codigo = datos_nuevos.get('codigo_inventario', 'N/A') if datos_nuevos else 'N/A'
            funcionario = datos_nuevos.get('nombres_funcionario', '') if datos_nuevos else ''
            
            if funcionario:
                return f"Equipo '{nombre_pc}' (Código: {codigo}) agregado y asignado a {funcionario}"
            else:
                return f"Equipo '{nombre_pc}' (Código: {codigo}) agregado al inventario"
        
        elif accion == 'modificado':
            nombre_pc = datos_nuevos.get('nombre_pc', 'N/A') if datos_nuevos else 'N/A'
            campos_cambiados = []
            detalles_cambios = []
            
            if datos_anteriores and datos_nuevos:
                funcionario_anterior = datos_anteriores.get('nombres_funcionario', '')
                funcionario_nuevo = datos_nuevos.get('nombres_funcionario', '')
                if funcionario_anterior != funcionario_nuevo:
                    if funcionario_anterior and funcionario_nuevo:
                        detalles_cambios.append(f"Reasignado de {funcionario_anterior} a {funcionario_nuevo}")
                    elif funcionario_nuevo:
                        detalles_cambios.append(f"Asignado a {funcionario_nuevo}")
                    elif funcionario_anterior:
                        detalles_cambios.append(f"Desasignado de {funcionario_anterior}")
                
                for campo in ['nombre_pc', 'estado', 'direccion_ip', 'codigo_inventario']:
                    if datos_anteriores.get(campo) != datos_nuevos.get(campo):
                        campos_cambiados.append(campo.replace('_', ' ').title())
            
            descripcion = f"Equipo '{nombre_pc}' modificado"
            if detalles_cambios:
                descripcion += f": {', '.join(detalles_cambios)}"
            elif campos_cambiados:
                descripcion += f": {', '.join(campos_cambiados)}"
            
            return descripcion
        
        elif accion == 'eliminado':
            nombre_pc = datos_anteriores.get('nombre_pc', 'N/A') if datos_anteriores else 'N/A'
            estado_anterior = datos_anteriores.get('estado', 'N/A') if datos_anteriores else 'N/A'
            
            if datos_nuevos and datos_nuevos.get('estado') == 'Inactivo':
                return f"{estado_anterior} -> Inactivo"
            else:
                codigo = datos_anteriores.get('codigo_inventario', 'N/A') if datos_anteriores else 'N/A'
                return f"Equipo '{nombre_pc}' (Código: {codigo}) eliminado del inventario"
            
        elif accion == 'inactivado':
            nombre_pc = datos_anteriores.get('nombre_pc', 'N/A') if datos_anteriores else 'N/A'
            codigo = datos_anteriores.get('codigo_inventario', 'N/A') if datos_anteriores else 'N/A'
            return f"Equipo '{nombre_pc}' (Código: {codigo}) inactivado del sistema"
        
        elif accion == 'reporte_generado':
            tipo_reporte = datos_nuevos.get('tipo_reporte', 'N/A') if datos_nuevos else 'N/A'
            cantidad = datos_nuevos.get('cantidad_registros', 0) if datos_nuevos else 0
            return f"Reporte '{tipo_reporte}' generado con {cantidad} registros"
        
        else:
            return f"Acción '{accion}' realizada"
            
    except Exception as e:
        logging.error(f"Error generando descripción de acción: {str(e)}")
        return f"Acción '{accion}' realizada"