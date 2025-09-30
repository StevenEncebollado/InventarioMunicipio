"""
Rutas para la gestión del inventario municipal.
Incluye endpoints CRUD y lógica relacionada.
"""
import json
from flask import Blueprint, request, jsonify
from ..db import get_db_connection
from ..auditoria.auditoria_routes import registrar_accion_automatica

inventario_bp = Blueprint('inventario', __name__)



# Listar todos los registros del inventario

@inventario_bp.route('', methods=['GET'])
def get_inventario():
    """
    Devuelve los registros del inventario, permitiendo filtrar por cualquier campo de id (por ejemplo: dependencia_id, tipo_equipo_id, etc.)
    Los filtros deben enviarse como query params, por ejemplo: /inventario?dependencia_id=1&marca_id=2
    """
    conn = get_db_connection()
    cur = conn.cursor()
    # Lista de campos filtrables (solo los campos *_id de la tabla inventario)
    filtrables = [
        'usuario_id', 'dependencia_id', 'direccion_area_id', 'dispositivo_id',
        'equipamiento_id', 'tipo_equipo_id', 'tipo_sistema_operativo_id',
        'caracteristicas_id', 'ram_id', 'disco_id', 'office_id', 'marca_id', 'tipo_conexion_id'
    ]
    filtros = []
    valores = []
    join_programa = False
    programa_adicional = request.args.get('programa_adicional')
    if programa_adicional:
        # Puede ser una lista separada por comas
        programa_ids = [int(pid) for pid in programa_adicional.split(',') if pid.isdigit()]
        if programa_ids:
            join_programa = True
            # Filtrar inventarios que tengan TODOS los programas seleccionados
            # Usar HAVING COUNT para asegurar que tenga todos los programas
    for campo in filtrables:
        valor = request.args.get(campo)
        if valor is not None and valor != '':
            filtros.append(f"inventario.{campo} = %s")
            valores.append(valor)
    if join_programa:
        # Subquery para obtener solo los inventarios que tienen TODOS los programas seleccionados
        subquery = f'''
            SELECT inventario_id
            FROM inventario_programa
            WHERE programa_id IN ({', '.join(['%s']*len(programa_ids))})
            GROUP BY inventario_id
            HAVING COUNT(DISTINCT programa_id) = %s
        '''
        params = list(programa_ids) + [len(programa_ids)]
        where_clauses = [f"inventario.id IN ({subquery})"]
        if filtros:
            where_clauses += filtros
            params += valores
        where_sql = ' AND '.join(where_clauses)
        query = f'SELECT * FROM inventario WHERE {where_sql}'
        cur.execute(query, params)
    else:
        query = 'SELECT * FROM inventario'
        if filtros:
            query += ' WHERE ' + ' AND '.join(filtros)
        cur.execute(query, valores)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    items = []
    for row in rows:
        item = dict(zip(columns, row))
        # Obtener los programas adicionales asociados a este inventario
        cur2 = conn.cursor()
        cur2.execute('SELECT programa_id FROM inventario_programa WHERE inventario_id = %s', (item['id'],))
        item['programa_adicional_ids'] = [r[0] for r in cur2.fetchall()]
        cur2.close()
        items.append(item)
    cur.close()
    conn.close()
    return jsonify(items)


# Obtener un registro del inventario por ID
@inventario_bp.route('/<int:item_id>', methods=['GET'])
def get_inventario_by_id(item_id):
    # Devuelve un registro del inventario por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM inventario WHERE id = %s', (item_id,))
    row = cur.fetchone()
    columns = [desc[0] for desc in cur.description]
    
    if row:
        item = dict(zip(columns, row))
        # Obtener los programas adicionales asociados a este inventario
        cur.execute('SELECT programa_id FROM inventario_programa WHERE inventario_id = %s', (item_id,))
        item['programa_adicional_ids'] = [r[0] for r in cur.fetchall()]
        cur.close()
        conn.close()
        return jsonify(item)
    else:
        cur.close()
        conn.close()
        return jsonify({'error': 'No encontrado'}), 404


# Endpoint: Crear un nuevo item en el inventario (única función, robusta)
@inventario_bp.route('', methods=['POST'])
def create_inventario():
    """Crea un nuevo registro en el inventario y lo registra en el historial."""
    import json
    try:
        data = request.json
        print(f"Datos recibidos: {data}")  # Log para debugging
        
        # Validar que se recibieron datos
        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400
            
        campos = [
            'usuario_id', 'dependencia_id', 'direccion_area_id', 'dispositivo_id', 'direccion_ip',
            'direccion_mac', 'nombre_pc', 'nombres_funcionario', 'equipamiento_id', 'tipo_equipo_id',
            'tipo_sistema_operativo_id', 'caracteristicas_id', 'ram_id', 'disco_id', 'office_id',
            'marca_id', 'codigo_inventario', 'tipo_conexion_id', 'anydesk', 'estado', 'contraseña'
        ]
        
        # Validar usuario_id
        if not data.get('usuario_id'):
            return jsonify({'error': 'usuario_id es obligatorio'}), 400
            
        # Validar solo los 4 campos esenciales
        campos_obligatorios = {
            'codigo_inventario': 'Código de Inventario',
            'nombre_pc': 'Nombre del Equipo', 
            'nombres_funcionario': 'Funcionario',
            'estado': 'Estado'
        }
        
        campos_faltantes = []
        for campo, nombre in campos_obligatorios.items():
            valor = data.get(campo)
            if not valor or str(valor).strip() == '':
                campos_faltantes.append(nombre)
        
        if campos_faltantes:
            return jsonify({'error': f'Los siguientes campos son obligatorios: {", ".join(campos_faltantes)}'}), 400
        
        # Convertir string vacío a None para todos los campos
        def limpiar_valor(valor):
            if valor == '' or valor is None:
                return None
            return valor

        valores = [limpiar_valor(data.get(campo)) for campo in campos]
        programas = data.get('programa_adicional_ids', [])  # Recibe los programas seleccionados
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Validar unicidad de codigo_inventario (siempre requerido)
        codigo_inventario = data.get('codigo_inventario')
        if codigo_inventario:
            cur.execute('SELECT id FROM inventario WHERE codigo_inventario = %s', (codigo_inventario,))
            if cur.fetchone():
                return jsonify({'error': 'El código de inventario ya existe. Por favor, use un código diferente.'}), 400
        
        # Validar unicidad de direccion_ip (solo si se proporciona)
        direccion_ip = data.get('direccion_ip')
        if direccion_ip and direccion_ip.strip():
            cur.execute('SELECT id FROM inventario WHERE direccion_ip = %s', (direccion_ip,))
            if cur.fetchone():
                return jsonify({'error': f'La dirección IP {direccion_ip} ya está en uso. Por favor, use una IP diferente.'}), 400
        
        # Validar unicidad de direccion_mac (solo si se proporciona)
        direccion_mac = data.get('direccion_mac')
        if direccion_mac and direccion_mac.strip():
            cur.execute('SELECT id FROM inventario WHERE direccion_mac = %s', (direccion_mac,))
            if cur.fetchone():
                return jsonify({'error': f'La dirección MAC {direccion_mac} ya está en uso. Por favor, use una MAC diferente.'}), 400
        
        # Validar unicidad de nombre_pc (siempre requerido)
        nombre_pc = data.get('nombre_pc')
        if nombre_pc:
            cur.execute('SELECT id FROM inventario WHERE nombre_pc = %s', (nombre_pc,))
            if cur.fetchone():
                return jsonify({'error': f'El nombre de PC "{nombre_pc}" ya está en uso. Por favor, use un nombre diferente.'}), 400
            
        # Insertar si no existe duplicado
        cur.execute(f'''
            INSERT INTO inventario ({', '.join(campos)})
            VALUES ({', '.join(['%s']*len(campos))})
            RETURNING id
        ''', valores)
        new_id = cur.fetchone()[0]
        
        # Asociar programas adicionales
        for programa_id in programas:
            if programa_id:  # Solo insertar si el programa_id no está vacío
                cur.execute('INSERT INTO inventario_programa (inventario_id, programa_id) VALUES (%s, %s)', (new_id, programa_id))
        
        # IMPORTANTE: Hacer commit ANTES de registrar en auditoría
        conn.commit()
        
        # Registrar en historial (acción: agregado) - CORREGIDO PARA DISTINGUIR USUARIOS
        usuario_que_crea = data.get('usuario_accion_id') or data.get('usuario_id')
        usuario_propietario = data.get('usuario_id')  # Puede ser None si no es usuario del sistema
        funcionario_asignado = data.get('nombres_funcionario', 'N/A')
        
        print(f"🔍 DEBUG CREATE: usuario_que_crea = {usuario_que_crea}")
        print(f"🔍 DEBUG CREATE: usuario_propietario = {usuario_propietario}")
        print(f"🔍 DEBUG CREATE: funcionario_asignado = {funcionario_asignado}")
        
        # Preparar datos mejorados para auditoría
        datos_auditoria = dict(data)
        datos_auditoria.update({
            'equipo': data.get('nombre_pc', 'Nuevo Equipo'),
            'funcionario_asignado': funcionario_asignado,
            'accion_detalle': f'Equipo "{data.get("nombre_pc", "N/A")}" creado y asignado a {funcionario_asignado}'
        })
        
        registrar_accion_automatica(
            inventario_id=new_id,
            usuario_accion_id=usuario_que_crea,  # Usuario que EJECUTA la acción
            accion='agregado',
            datos_nuevos=datos_auditoria,
            usuario_propietario_id=usuario_propietario  # Usuario propietario (si es usuario del sistema)
        )
        
        print(f"🔍 DEBUG CREATE: Auditoria registrada para equipo {new_id}")
        
        return jsonify({'id': new_id, 'message': 'Equipo creado exitosamente'}), 201
        
    except Exception as e:
        print(f"Error al crear inventario: {str(e)}")  # Log para debugging
        if 'conn' in locals():
            conn.rollback()
            
        # Manejar errores específicos de base de datos
        error_msg = str(e)
        if 'duplicate key' in error_msg.lower():
            return jsonify({'error': 'Ya existe un registro con esos datos. Verifique que no haya duplicados.'}), 400
        elif 'foreign key' in error_msg.lower():
            return jsonify({'error': 'Uno o más valores seleccionados no son válidos. Verifique los catálogos.'}), 400
        elif 'not null' in error_msg.lower():
            return jsonify({'error': 'Falta información requerida. Complete todos los campos obligatorios.'}), 400
        else:
            return jsonify({'error': f'Error interno del servidor: {str(e)}'}), 500
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

# Endpoint: Actualizar un item del inventario
@inventario_bp.route('/<int:item_id>', methods=['PUT'])
def update_inventario(item_id):
    """Actualiza un registro del inventario por su ID."""
    data = request.json
    
    # Validar que se recibieron datos
    if not data:
        return jsonify({'error': 'No se recibieron datos'}), 400
    
    # Validar solo los 4 campos esenciales
    campos_obligatorios = {
        'codigo_inventario': 'Código de Inventario',
        'nombre_pc': 'Nombre del Equipo', 
        'nombres_funcionario': 'Funcionario',
        'estado': 'Estado'
    }
    
    campos_faltantes = []
    for campo, nombre in campos_obligatorios.items():
        valor = data.get(campo)
        if not valor or str(valor).strip() == '':
            campos_faltantes.append(nombre)
    
    if campos_faltantes:
        return jsonify({'error': f'Los siguientes campos son obligatorios: {", ".join(campos_faltantes)}'}), 400
    
    campos = [
        'usuario_id', 'dependencia_id', 'direccion_area_id', 'dispositivo_id', 'direccion_ip',
        'direccion_mac', 'nombre_pc', 'nombres_funcionario', 'equipamiento_id', 'tipo_equipo_id',
        'tipo_sistema_operativo_id', 'caracteristicas_id', 'ram_id', 'disco_id', 'office_id',
        'marca_id', 'codigo_inventario', 'tipo_conexion_id', 'anydesk', 'estado', 'contraseña', 'fecha_eliminacion'
    ]
    
    # Convertir string vacío a None para todos los campos
    def limpiar_valor(valor):
        if valor == '' or valor is None:
            return None
        return valor

    valores = [limpiar_valor(data.get(campo)) for campo in campos]
    programas = data.get('programa_adicional_ids', [])  # Recibe los programas seleccionados
    set_clause = ', '.join([f"{campo} = %s" for campo in campos])
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Obtener datos anteriores para auditoría
        cur.execute('SELECT * FROM inventario WHERE id = %s', (item_id,))
        registro_anterior = cur.fetchone()
        if not registro_anterior:
            return jsonify({'error': 'Registro no encontrado'}), 404
        
        columns = [desc[0] for desc in cur.description]
        datos_anteriores = dict(zip(columns, registro_anterior))
        
        # Detectar cambios específicos para auditoría
        estado_anterior = datos_anteriores.get('estado')
        estado_nuevo = data.get('estado')
        cambio_estado = estado_anterior != estado_nuevo
        
        # 🚨 ESPECIAL: Detectar INACTIVACIÓN (cambio a "Inactivo")
        es_inactivacion = estado_nuevo == 'Inactivo' and estado_anterior != 'Inactivo'
        
        # Detectar otros cambios importantes
        nombre_anterior = datos_anteriores.get('nombre_pc')
        nombre_nuevo = data.get('nombre_pc')
        cambio_nombre = nombre_anterior != nombre_nuevo
        
        funcionario_anterior = datos_anteriores.get('nombres_funcionario')
        funcionario_nuevo = data.get('nombres_funcionario')
        cambio_funcionario = funcionario_anterior != funcionario_nuevo
        
        # DEBUG: Log específico para cambios
        print(f"🔍 DEBUG CAMBIOS:")
        print(f"   Estado: '{estado_anterior}' → '{estado_nuevo}' (cambio: {cambio_estado})")
        print(f"   🚨 INACTIVACIÓN: {es_inactivacion}")
        print(f"   Nombre: '{nombre_anterior}' → '{nombre_nuevo}' (cambio: {cambio_nombre})")
        print(f"   Funcionario: '{funcionario_anterior}' → '{funcionario_nuevo}' (cambio: {cambio_funcionario})")
        
        # Detectar si hay cambios en otros campos importantes
        otros_cambios = cambio_nombre or cambio_funcionario
        
        # También verificar otros campos
        direccion_anterior = datos_anteriores.get('direccion_area_id')
        direccion_nueva = data.get('direccion_area_id')
        cambio_direccion = direccion_anterior != direccion_nueva
        
        ip_anterior = datos_anteriores.get('direccion_ip')
        ip_nueva = data.get('direccion_ip')
        cambio_ip = ip_anterior != ip_nueva
        
        if cambio_direccion or cambio_ip:
            otros_cambios = True
            
        print(f"🔍 DEBUG RESUMEN: cambio_estado={cambio_estado}, es_inactivacion={es_inactivacion}, otros_cambios={otros_cambios}")
        
        # Validar unicidad de campos únicos (excluyendo el registro actual)
        codigo_inventario = data.get('codigo_inventario')
        if codigo_inventario:
            cur.execute('SELECT id FROM inventario WHERE codigo_inventario = %s AND id != %s', (codigo_inventario, item_id))
            if cur.fetchone():
                return jsonify({'error': 'El código de inventario ya existe. Por favor, use un código diferente.'}), 400
        
        # Validar unicidad de direccion_ip (solo si se proporciona)
        direccion_ip = data.get('direccion_ip')
        if direccion_ip and direccion_ip.strip():
            cur.execute('SELECT id FROM inventario WHERE direccion_ip = %s AND id != %s', (direccion_ip, item_id))
            if cur.fetchone():
                return jsonify({'error': f'La dirección IP {direccion_ip} ya está en uso. Por favor, use una IP diferente.'}), 400
        
        # Validar unicidad de direccion_mac (solo si se proporciona)
        direccion_mac = data.get('direccion_mac')
        if direccion_mac and direccion_mac.strip():
            cur.execute('SELECT id FROM inventario WHERE direccion_mac = %s AND id != %s', (direccion_mac, item_id))
            if cur.fetchone():
                return jsonify({'error': f'La dirección MAC {direccion_mac} ya está en uso. Por favor, use una MAC diferente.'}), 400
        
        # Validar unicidad de nombre_pc
        nombre_pc = data.get('nombre_pc')
        if nombre_pc:
            cur.execute('SELECT id FROM inventario WHERE nombre_pc = %s AND id != %s', (nombre_pc, item_id))
            if cur.fetchone():
                return jsonify({'error': f'El nombre de PC "{nombre_pc}" ya está en uso. Por favor, use un nombre diferente.'}), 400
        
        # Actualizar el registro principal
        cur.execute(f'''
            UPDATE inventario SET {set_clause} WHERE id = %s
        ''', valores + [item_id])
        
        # Actualizar programas adicionales
        # Primero eliminar todas las asociaciones existentes
        cur.execute('DELETE FROM inventario_programa WHERE inventario_id = %s', (item_id,))
        
        # Luego insertar las nuevas asociaciones
        for programa_id in programas:
            if programa_id:  # Solo insertar si el programa_id no está vacío
                cur.execute('INSERT INTO inventario_programa (inventario_id, programa_id) VALUES (%s, %s)', (item_id, programa_id))
        
        # Hacer commit ANTES de registrar auditoría
        conn.commit()
        
        # Registrar en auditoría según el tipo de cambio
        usuario_auditoria = data.get('usuario_accion_id') or data.get('usuario_id')
        
        # DEBUG: Log para verificar usuario de auditoría
        print(f"🔍 DEBUG AUDITORIA:")
        print(f"   usuario_accion_id: {data.get('usuario_accion_id')}")
        print(f"   usuario_id: {data.get('usuario_id')}")
        print(f"   usuario_auditoria final: {usuario_auditoria}")
        
        # 🚨 PRIORIDAD 1: Detectar INACTIVACIÓN (registrar como "eliminado")
        if es_inactivacion:
            print(f"🔍 REGISTRANDO: eliminado (inactivación)")
            registrar_accion_automatica(
                inventario_id=item_id,
                usuario_accion_id=usuario_auditoria,
                accion='eliminado',
                datos_anteriores={'estado': estado_anterior},
                datos_nuevos={
                    'estado': estado_nuevo,
                    'equipo': datos_anteriores.get('nombre_pc', 'N/A'),
                    'detalle': f'Equipo inactivado (de "{estado_anterior}" a "Inactivo")'
                },
                usuario_propietario_id=datos_anteriores.get('usuario_id')
            )
        
        # PRIORIDAD 2: Cambio de estado normal (NO inactivación)
        elif cambio_estado and not es_inactivacion:
            print(f"🔍 REGISTRANDO: cambio_estado")
            registrar_accion_automatica(
                inventario_id=item_id,
                usuario_accion_id=usuario_auditoria,
                accion='cambio_estado',
                datos_anteriores={'estado': estado_anterior},
                datos_nuevos={
                    'estado': estado_nuevo,
                    'equipo': datos_anteriores.get('nombre_pc', 'N/A'),
                    'detalle': f'{estado_anterior} -> {estado_nuevo}'  # 🎯 FORMATO ESPECÍFICO (compatible Windows)
                },
                usuario_propietario_id=datos_anteriores.get('usuario_id')
            )
        
        # PRIORIDAD 3: Modificaciones de otros campos (independiente del estado)
        if otros_cambios:
            print(f"🔍 REGISTRANDO: modificado")
            registrar_accion_automatica(
                inventario_id=item_id,
                usuario_accion_id=usuario_auditoria,
                accion='modificado',
                datos_anteriores=datos_anteriores,
                datos_nuevos=data,
                usuario_propietario_id=datos_anteriores.get('usuario_id')
            )
        
        # Si no hay cambios importantes, no registrar nada especial
        if not cambio_estado and not otros_cambios:
            print(f"🔍 SIN CAMBIOS IMPORTANTES DETECTADOS")
        
        return jsonify({'msg': 'Actualizado correctamente'})
    except Exception as e:
        conn.rollback()
        error_msg = str(e)
        if 'duplicate key' in error_msg.lower():
            return jsonify({'error': 'Ya existe un registro con esos datos. Verifique que no haya duplicados.'}), 400
        elif 'foreign key' in error_msg.lower():
            return jsonify({'error': 'Uno o más valores seleccionados no son válidos. Verifique los catálogos.'}), 400
        else:
            return jsonify({'error': f'Error al actualizar: {str(e)}'}), 500
    finally:
        cur.close()
        conn.close()



# Endpoint: Eliminar un item del inventario (INACTIVAR)
@inventario_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_inventario(item_id):
    """Inactiva un registro del inventario marcándolo como eliminado."""
    data = request.get_json() or {}
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Obtener datos antes de "eliminar" para auditoría
        cur.execute('SELECT * FROM inventario WHERE id = %s', (item_id,))
        registro_anterior = cur.fetchone()
        if not registro_anterior:
            return jsonify({'error': 'Registro no encontrado'}), 404
        
        columns = [desc[0] for desc in cur.description]
        datos_anteriores = dict(zip(columns, registro_anterior))
        
        # INACTIVAR en lugar de eliminar: marcar fecha_eliminacion
        cur.execute('UPDATE inventario SET fecha_eliminacion = NOW() WHERE id = %s', (item_id,))
        
        # Registrar en historial (acción: inactivado)
        usuario_para_auditoria = data.get('usuario_accion_id') or data.get('usuario_id')
        
        registrar_accion_automatica(
            inventario_id=item_id,
            usuario_accion_id=usuario_para_auditoria,  # Usuario que inactiva
            accion='inactivado',  # Cambiar de 'eliminado' a 'inactivado'
            datos_anteriores=datos_anteriores,
            datos_nuevos={
                'fecha_eliminacion': 'NOW()',
                'accion_detalle': f'Equipo "{datos_anteriores.get("nombre_pc", "N/A")}" inactivado del sistema'
            }
        )
        
        conn.commit()
        return jsonify({'msg': 'Eliminado correctamente'})
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Error al eliminar: {str(e)}'}), 500
    finally:
        cur.close()
        conn.close()
