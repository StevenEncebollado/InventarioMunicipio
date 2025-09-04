"""
Rutas para la gestión del inventario municipal.
Incluye endpoints CRUD y lógica relacionada.
"""
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


# Endpoint: Crear un nuevo item en el inventario (única función, robusta)
@inventario_bp.route('', methods=['POST'])
def create_inventario():
    """Crea un nuevo registro en el inventario y lo registra en el historial."""
    import json
    data = request.json
    campos = [
        'usuario_id', 'dependencia_id', 'direccion_area_id', 'dispositivo_id', 'direccion_ip',
        'direccion_mac', 'nombre_pc', 'nombres_funcionario', 'equipamiento_id', 'tipo_equipo_id',
        'tipo_sistema_operativo_id', 'caracteristicas_id', 'ram_id', 'disco_id', 'office_id',
        'marca_id', 'codigo_inventario', 'tipo_conexion_id', 'anydesk', 'estado'
    ]
    valores = [data.get(campo) for campo in campos]
    programas = data.get('programa_adicional_ids', [])  # Recibe los programas seleccionados
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Validar unicidad de codigo_inventario
        cur.execute('SELECT id FROM inventario WHERE codigo_inventario = %s', (data.get('codigo_inventario'),))
        if cur.fetchone():
            return jsonify({'error': 'El código de inventario ya existe'}), 400
        # Insertar si no existe duplicado
        cur.execute(f'''
            INSERT INTO inventario ({', '.join(campos)})
            VALUES ({', '.join(['%s']*len(campos))})
            RETURNING id
        ''', valores)
        new_id = cur.fetchone()[0]
        # Asociar programas adicionales
        for programa_id in programas:
            cur.execute('INSERT INTO inventario_programa (inventario_id, programa_id) VALUES (%s, %s)', (new_id, programa_id))
        # Registrar en historial (acción: agregado)
        cur.execute('''
            INSERT INTO historial_inventario (inventario_id, usuario_id, accion, datos_nuevos)
            VALUES (%s, %s, %s, %s)
        ''', (new_id, data.get('usuario_id'), 'agregado', json.dumps(data)))
        conn.commit()
        return jsonify({'id': new_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cur.close()
        conn.close()

# Endpoint: Actualizar un item del inventario
@inventario_bp.route('/<int:item_id>', methods=['PUT'])
def update_inventario(item_id):
    """Actualiza un registro del inventario por su ID."""
    data = request.json
    campos = [
        'usuario_id', 'dependencia_id', 'direccion_area_id', 'dispositivo_id', 'direccion_ip',
        'direccion_mac', 'nombre_pc', 'nombres_funcionario', 'equipamiento_id', 'tipo_equipo_id',
        'tipo_sistema_operativo_id', 'caracteristicas_id', 'ram_id', 'disco_id', 'office_id',
        'marca_id', 'codigo_inventario', 'tipo_conexion_id', 'anydesk', 'estado', 'fecha_eliminacion'
    ]
    valores = [data.get(campo) for campo in campos]
    set_clause = ', '.join([f"{campo} = %s" for campo in campos])
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(f'''
            UPDATE inventario SET {set_clause} WHERE id = %s
        ''', valores + [item_id])
        conn.commit()
        return jsonify({'msg': 'Actualizado correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()



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
