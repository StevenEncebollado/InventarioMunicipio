"""
Rutas para la gestión del inventario municipal.
Incluye endpoints CRUD y lógica relacionada.
"""
from flask import Blueprint, request, jsonify
from ..db import get_db_connection

inventario_bp = Blueprint('inventario', __name__)



# Listar todos los registros del inventario

@inventario_bp.route('/inventario', methods=['GET'])
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
    for campo in filtrables:
        valor = request.args.get(campo)
        if valor is not None and valor != '':
            filtros.append(f"{campo} = %s")
            valores.append(valor)
    query = 'SELECT * FROM inventario'
    if filtros:
        query += ' WHERE ' + ' AND '.join(filtros)
    cur.execute(query, valores)
    columns = [desc[0] for desc in cur.description]
    items = [dict(zip(columns, row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(items)


# Obtener un registro del inventario por ID
@inventario_bp.route('/inventario/<int:item_id>', methods=['GET'])
def get_inventario_by_id(item_id):
    # Devuelve un registro del inventario por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM inventario WHERE id = %s', (item_id,))
    row = cur.fetchone()
    columns = [desc[0] for desc in cur.description]
    cur.close()
    conn.close()
    if row:
        return jsonify(dict(zip(columns, row)))
    else:
        return jsonify({'error': 'No encontrado'}), 404

# Endpoint: Crear un nuevo item en el inventario
@inventario_bp.route('/inventario', methods=['POST'])
def create_inventario():
    """Crea un nuevo registro en el inventario."""
    data = request.json
    campos = [
        'usuario_id', 'dependencia_id', 'direccion_area_id', 'dispositivo_id', 'direccion_ip',
        'direccion_mac', 'nombre_pc', 'nombres_funcionario', 'equipamiento_id', 'tipo_equipo_id',
        'tipo_sistema_operativo_id', 'caracteristicas_id', 'ram_id', 'disco_id', 'office_id',
        'marca_id', 'codigo_inventario', 'tipo_conexion_id', 'anydesk'
    ]
    valores = [data.get(campo) for campo in campos]
    conn = get_db_connection()
    cur = conn.cursor()
    # Validar unicidad de codigo_inventario
    cur.execute('SELECT id FROM inventario WHERE codigo_inventario = %s', (data.get('codigo_inventario'),))
    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({'error': 'El código de inventario ya existe'}), 400
    # Insertar si no existe duplicado
    cur.execute(f'''
        INSERT INTO inventario ({', '.join(campos)})
        VALUES ({', '.join(['%s']*len(campos))})
        RETURNING id
    ''', valores)
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': new_id}), 201


    # Crear un nuevo registro en el inventario y registrar en historial
    @inventario_bp.route('/inventario', methods=['POST'])
    def create_inventario():
        # Crea un nuevo registro en el inventario y lo registra en el historial
        data = request.json
        campos = [
            'usuario_id', 'dependencia_id', 'direccion_area_id', 'dispositivo_id', 'direccion_ip',
            'direccion_mac', 'nombre_pc', 'nombres_funcionario', 'equipamiento_id', 'tipo_equipo_id',
            'tipo_sistema_operativo_id', 'caracteristicas_id', 'ram_id', 'disco_id', 'office_id',
            'marca_id', 'codigo_inventario', 'tipo_conexion_id', 'anydesk'
        ]
        valores = [data.get(campo) for campo in campos]
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(f'''
            INSERT INTO inventario ({', '.join(campos)})
            VALUES ({', '.join(['%s']*len(campos))})
            RETURNING id
        ''', valores)
        new_id = cur.fetchone()[0]
        # Registrar en historial (acción: agregado)
        cur.execute('''
            INSERT INTO historial_inventario (inventario_id, usuario_id, accion, datos_nuevos)
            VALUES (%s, %s, %s, %s)
        ''', (new_id, data.get('usuario_id'), 'agregado', json.dumps(data)))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'id': new_id}), 201

# Endpoint: Actualizar un item del inventario
@inventario_bp.route('/inventario/<int:item_id>', methods=['PUT'])
def update_inventario(item_id):
    """Actualiza un registro del inventario por su ID."""
    data = request.json
    campos = [
        'usuario_id', 'dependencia_id', 'direccion_area_id', 'dispositivo_id', 'direccion_ip',
        'direccion_mac', 'nombre_pc', 'nombres_funcionario', 'equipamiento_id', 'tipo_equipo_id',
        'tipo_sistema_operativo_id', 'caracteristicas_id', 'ram_id', 'disco_id', 'office_id',
        'marca_id', 'codigo_inventario', 'tipo_conexion_id', 'anydesk'
    ]
    valores = [data.get(campo) for campo in campos]
    set_clause = ', '.join([f"{campo} = %s" for campo in campos])
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f'''
        UPDATE inventario SET {set_clause} WHERE id = %s
    ''', valores + [item_id])
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Actualizado correctamente'})


    # Actualizar un registro del inventario y registrar en historial
    @inventario_bp.route('/inventario/<int:item_id>', methods=['PUT'])
    def update_inventario(item_id):
        # Actualiza un registro del inventario por su ID y lo registra en el historial
        data = request.json
        campos = [
            'usuario_id', 'dependencia_id', 'direccion_area_id', 'dispositivo_id', 'direccion_ip',
            'direccion_mac', 'nombre_pc', 'nombres_funcionario', 'equipamiento_id', 'tipo_equipo_id',
            'tipo_sistema_operativo_id', 'caracteristicas_id', 'ram_id', 'disco_id', 'office_id',
            'marca_id', 'codigo_inventario', 'tipo_conexion_id', 'anydesk'
        ]
        valores = [data.get(campo) for campo in campos]
        set_clause = ', '.join([f"{campo} = %s" for campo in campos])
        conn = get_db_connection()
        cur = conn.cursor()
        # Obtener datos anteriores
        cur.execute('SELECT * FROM inventario WHERE id = %s', (item_id,))
        row = cur.fetchone()
        columns = [desc[0] for desc in cur.description]
        datos_anteriores = dict(zip(columns, row)) if row else None
        # Actualizar
        cur.execute(f'''
            UPDATE inventario SET {set_clause} WHERE id = %s
        ''', valores + [item_id])
        # Registrar en historial (acción: modificado)
        cur.execute('''
            INSERT INTO historial_inventario (inventario_id, usuario_id, accion, datos_anteriores, datos_nuevos)
            VALUES (%s, %s, %s, %s, %s)
        ''', (item_id, data.get('usuario_id'), 'modificado', json.dumps(datos_anteriores), json.dumps(data)))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'msg': 'Actualizado correctamente'})

# Endpoint: Eliminar un item del inventario
@inventario_bp.route('/inventario/<int:item_id>', methods=['DELETE'])
def delete_inventario(item_id):
    """Elimina un registro del inventario por su ID."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM inventario WHERE id = %s', (item_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Eliminado correctamente'})


    # Eliminar un registro del inventario y registrar en historial
    @inventario_bp.route('/inventario/<int:item_id>', methods=['DELETE'])
    def delete_inventario(item_id):
        # Elimina un registro del inventario por su ID y lo registra en el historial
        usuario_id = request.args.get('usuario_id')  # Se recomienda pasar el usuario por query param
        conn = get_db_connection()
        cur = conn.cursor()
        # Obtener datos anteriores
        cur.execute('SELECT * FROM inventario WHERE id = %s', (item_id,))
        row = cur.fetchone()
        columns = [desc[0] for desc in cur.description]
        datos_anteriores = dict(zip(columns, row)) if row else None
        # Eliminar
        cur.execute('DELETE FROM inventario WHERE id = %s', (item_id,))
        # Registrar en historial (acción: eliminado)
        cur.execute('''
            INSERT INTO historial_inventario (inventario_id, usuario_id, accion, datos_anteriores)
            VALUES (%s, %s, %s, %s)
        ''', (item_id, usuario_id, 'eliminado', json.dumps(datos_anteriores)))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'msg': 'Eliminado correctamente'})
