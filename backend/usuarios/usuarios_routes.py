"""
Rutas para la gestión de usuarios del sistema.
Incluye endpoints CRUD y lógica relacionada.
"""


from flask import Blueprint, request, jsonify
from ..db import get_db_connection
import re
import bcrypt

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/register', methods=['POST'])
def register_usuario():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'Usuario y contraseña son requeridos'}), 400
    # Validar contraseña fuerte
    password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:\'",.<>/?]).{8,}$'
    if not re.match(password_regex, password):
        return jsonify({'message': 'La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos.'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # Validar unicidad de username
    cur.execute('SELECT id FROM usuario WHERE username = %s', (username,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({'message': 'El nombre de usuario ya existe'}), 400
    # Hashear la contraseña
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    # Insertar si no existe duplicado y guardar fecha de cambio
    cur.execute('INSERT INTO usuario (username, password, fecha_cambio_password) VALUES (%s, %s, NOW()) RETURNING id', (username, hashed.decode('utf-8')))
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': new_id, 'message': 'Usuario registrado exitosamente'}), 201

@usuarios_bp.route('/login', methods=['POST'])
def login_usuario():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se enviaron datos'}), 400
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Usuario y contraseña son requeridos'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Error al procesar datos: {str(e)}'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, password, fecha_cambio_password FROM usuario WHERE username = %s', (username,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row or not bcrypt.checkpw(password.encode('utf-8'), row[1].encode('utf-8')):
        return jsonify({'error': 'Tu usuario o contraseña son incorrectos'}), 401
    user_id, db_password, fecha_cambio = row
    # Verificar si han pasado más de 3 meses desde el último cambio
    from datetime import datetime, timedelta
    fecha_cambio_str = str(fecha_cambio) if fecha_cambio else None
    if fecha_cambio:
        fecha_cambio_dt = fecha_cambio if isinstance(fecha_cambio, datetime) else datetime.strptime(str(fecha_cambio), '%Y-%m-%d %H:%M:%S')
        if datetime.now() - fecha_cambio_dt > timedelta(days=90):
            return jsonify({'msg': 'Debes cambiar tu contraseña. Han pasado más de 3 meses desde el último cambio.', 'id': user_id, 'username': username, 'require_password_change': True, 'fecha_cambio_password': fecha_cambio_str}), 200
    return jsonify({'msg': 'Login exitoso', 'id': user_id, 'username': username, 'fecha_cambio_password': fecha_cambio_str}), 200

# Endpoint: Obtener todos los usuarios

@usuarios_bp.route('', methods=['GET'])
def get_usuarios():
    # Devuelve todos los usuarios registrados
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM usuario')
    columns = [desc[0] for desc in cur.description]
    usuarios = [dict(zip(columns, row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(usuarios)

# Endpoint: Obtener un usuario por ID

@usuarios_bp.route('/<int:user_id>', methods=['GET'])
def get_usuario_by_id(user_id):
    # Devuelve un usuario por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM usuario WHERE id = %s', (user_id,))
    row = cur.fetchone()
    columns = [desc[0] for desc in cur.description]
    cur.close()
    conn.close()
    if row:
        return jsonify(dict(zip(columns, row)))
    else:
        return jsonify({'error': 'No encontrado'}), 404

# Endpoint: Crear un nuevo usuario

@usuarios_bp.route('', methods=['POST'])
def create_usuario():
    # Crea un nuevo usuario
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = get_db_connection()
    cur = conn.cursor()
    # Validar unicidad de username
    cur.execute('SELECT id FROM usuario WHERE username = %s', (username,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({'error': 'El nombre de usuario ya existe'}), 400
    # Insertar si no existe duplicado
    cur.execute('INSERT INTO usuario (username, password) VALUES (%s, %s) RETURNING id', (username, password))
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': new_id}), 201

# Endpoint: Actualizar un usuario

@usuarios_bp.route('/<int:user_id>', methods=['PUT'])
def update_usuario(user_id):
    # Actualiza los datos de un usuario por su ID
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = get_db_connection()
    cur = conn.cursor()
    # Si se cambia la contraseña, actualizar fecha
    if password:
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        cur.execute('UPDATE usuario SET username = %s, password = %s, fecha_cambio_password = NOW() WHERE id = %s', (username, hashed.decode('utf-8'), user_id))
    else:
        cur.execute('UPDATE usuario SET username = %s WHERE id = %s', (username, user_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Actualizado correctamente'})
@usuarios_bp.route('/<int:user_id>/reset_password', methods=['POST'])
def reset_password(user_id):
    data = request.json
    actual = data.get('actual')
    nueva = data.get('nueva')
    if not actual or not nueva:
        return jsonify({'error': 'Debes ingresar la contraseña actual y la nueva'}), 400
    # Validar contraseña fuerte
    password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:\'",.<>/?]).{8,}$'
    if not re.match(password_regex, nueva):
        return jsonify({'error': 'La nueva contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos.'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT password FROM usuario WHERE id = %s', (user_id,))
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return jsonify({'error': 'Usuario no encontrado'}), 404
    actual_hash = row[0]
    if not bcrypt.checkpw(actual.encode('utf-8'), actual_hash.encode('utf-8')):
        cur.close()
        conn.close()
        return jsonify({'error': 'La contraseña actual es incorrecta'}), 401
    if bcrypt.checkpw(nueva.encode('utf-8'), actual_hash.encode('utf-8')):
        cur.close()
        conn.close()
        return jsonify({'error': 'La nueva contraseña no puede ser igual a la actual'}), 400
    nueva_hash = bcrypt.hashpw(nueva.encode('utf-8'), bcrypt.gensalt())
    cur.execute('UPDATE usuario SET password = %s, fecha_cambio_password = NOW() WHERE id = %s', (nueva_hash.decode('utf-8'), user_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Contraseña actualizada correctamente'})

@usuarios_bp.route('/reset_password', methods=['POST'])
def reset_password_by_username():
    data = request.json
    username = data.get('username')
    actual = data.get('actual')
    nueva = data.get('nueva')
    if not username or not actual or not nueva:
        return jsonify({'error': 'Debes ingresar usuario, contraseña actual y la nueva'}), 400
    # Validar contraseña fuerte
    password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:\'\",.<>/?]).{8,}$'
    if not re.match(password_regex, nueva):
        return jsonify({'error': 'La nueva contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos.'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, password FROM usuario WHERE username = %s', (username,))
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return jsonify({'error': 'Usuario no encontrado'}), 404
    user_id, actual_hash = row
    if not bcrypt.checkpw(actual.encode('utf-8'), actual_hash.encode('utf-8')):
        cur.close()
        conn.close()
        return jsonify({'error': 'La contraseña actual es incorrecta'}), 401
    if bcrypt.checkpw(nueva.encode('utf-8'), actual_hash.encode('utf-8')):
        cur.close()
        conn.close()
        return jsonify({'error': 'La nueva contraseña no puede ser igual a la actual'}), 400
    nueva_hash = bcrypt.hashpw(nueva.encode('utf-8'), bcrypt.gensalt())
    cur.execute('UPDATE usuario SET password = %s, fecha_cambio_password = NOW() WHERE id = %s', (nueva_hash.decode('utf-8'), user_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Contraseña actualizada correctamente'})

# Endpoint: Eliminar un usuario

@usuarios_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_usuario(user_id):
    # Elimina un usuario por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM usuario WHERE id = %s', (user_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Eliminado correctamente'})
