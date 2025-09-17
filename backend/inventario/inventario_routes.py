"""
Rutas para la gestión del inventario municipal.
Incluye endpoints CRUD y lógica relacionada.
"""
import json
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

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
        
        # Registrar en historial (acción: agregado)
        cur.execute('''
            INSERT INTO historial_inventario (inventario_id, usuario_id, accion, datos_nuevos)
            VALUES (%s, %s, %s, %s)
        ''', (new_id, data.get('usuario_id'), 'agregado', json.dumps(data)))
        
        conn.commit()
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
        
        conn.commit()
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



# Endpoint: Eliminar un item del inventario
@inventario_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_inventario(item_id):
    """Elimina un registro del inventario por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM inventario WHERE id = %s', (item_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Eliminado correctamente'})
