
"""
Rutas para la gestión de usuarios del sistema.
Incluye endpoints CRUD y lógica relacionada.
"""

from flask import Blueprint, request, jsonify
from ..db import get_db_connection

usuarios_bp = Blueprint('usuarios', __name__)

# Endpoint: Registro de usuario
@usuarios_bp.route('/usuarios/register', methods=['POST'])
def register_usuario():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'Usuario y contraseña son requeridos'}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    # Validar unicidad de username
    cur.execute('SELECT id FROM usuario WHERE username = %s', (username,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({'message': 'El nombre de usuario ya existe'}), 400
    # Insertar si no existe duplicado
    cur.execute('INSERT INTO usuario (username, password) VALUES (%s, %s) RETURNING id', (username, password))
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'id': new_id, 'message': 'Usuario registrado exitosamente'}), 201

# Endpoint: Login de usuario
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
    cur.execute('SELECT id, password FROM usuario WHERE username = %s', (username,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row or password != row[1]:
        return jsonify({'error': 'Tu usuario o contraseña son incorrectos'}), 401
    user_id, db_password = row
    return jsonify({'msg': 'Login exitoso', 'id': user_id, 'username': username}), 200

# Endpoint: Obtener todos los usuarios

# Listar todos los usuarios
@usuarios_bp.route('/usuarios', methods=['GET'])
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

# Obtener un usuario por ID
@usuarios_bp.route('/usuarios/<int:user_id>', methods=['GET'])
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

# Crear un nuevo usuario
@usuarios_bp.route('/usuarios', methods=['POST'])
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

# Actualizar un usuario existente
@usuarios_bp.route('/usuarios/<int:user_id>', methods=['PUT'])
def update_usuario(user_id):
    # Actualiza los datos de un usuario por su ID
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('UPDATE usuario SET username = %s, password = %s WHERE id = %s', (username, password, user_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Actualizado correctamente'})

# Endpoint: Eliminar un usuario

# Eliminar un usuario existente
@usuarios_bp.route('/usuarios/<int:user_id>', methods=['DELETE'])
def delete_usuario(user_id):
    # Elimina un usuario por su ID
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM usuario WHERE id = %s', (user_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'msg': 'Eliminado correctamente'})
