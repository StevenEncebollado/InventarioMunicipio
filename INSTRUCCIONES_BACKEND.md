# 🚀 INSTRUCCIONES PARA INTEGRACIÓN BACKEND - FRONTEND

¡Hola! Este documento contiene todas las modificaciones necesarias en el backend para que funcione perfectamente con el frontend de Next.js que está en la rama `samuel`.

## ⚡ CAMBIOS CRÍTICOS (NECESARIOS PARA FUNCIONAR)

### 1. 🔧 REGISTRAR BLUEPRINT DE INVENTARIO FALTANTE

**Archivo:** `backend/app.py`

**PROBLEMA:** El blueprint de inventario no está registrado en la aplicación.

**SOLUCIÓN:** Agregar estas líneas:

```python
# En la parte de imports, agregar:
from .inventario.inventario_routes import inventario_bp

# En la función create_app(), agregar después de los otros blueprints:
def create_app():
    app = Flask(__name__)
    
    # ... blueprints existentes ...
    app.register_blueprint(inventario_programa_bp)
    app.register_blueprint(usuarios_bp)
    
    # AGREGAR ESTA LÍNEA:
    app.register_blueprint(inventario_bp)
    
    return app
```

### 2. 🌐 AGREGAR CORS PARA PERMITIR CONEXIONES DEL FRONTEND

**Archivo:** `backend/app.py`

**PROBLEMA:** El frontend no puede conectarse al backend por restricciones CORS.

**SOLUCIÓN:**

```python
# 1. Instalar flask-cors (si no está instalado):
# pip install flask-cors

# 2. En backend/app.py, agregar en los imports:
from flask_cors import CORS

# 3. En la función create_app(), agregar después de crear la app:
def create_app():
    app = Flask(__name__)
    
    # AGREGAR ESTAS LÍNEAS DESPUÉS DE Flask(__name__):
    CORS(app, origins=[
        'http://localhost:3000',  # Frontend en desarrollo
        'http://127.0.0.1:3000'   # Frontend alternativo
    ])
    
    # ... resto del código ...
```

### 3. 🔐 CREAR ENDPOINT DE LOGIN ESPECÍFICO

**Archivo:** `backend/usuarios/usuarios_routes.py`

**PROBLEMA:** El frontend llama a `/auth/login` pero no existe. El endpoint `/usuarios` es para crear usuarios.

**SOLUCIÓN:** Agregar este endpoint al final del archivo:

```python
# Endpoint específico para autenticación
@usuarios_bp.route('/auth/login', methods=['POST'])
def login():
    """Endpoint para autenticar usuarios"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Usuario y contraseña requeridos'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Buscar usuario con credenciales
    cur.execute('SELECT id, username FROM usuario WHERE username = %s AND password = %s', 
                (username, password))
    user = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if user:
        return jsonify({
            'id': user[0],
            'username': user[1]
        }), 200
    else:
        return jsonify({'error': 'Credenciales inválidas'}), 401
```

## 🔧 CAMBIOS IMPORTANTES (PARA MEJOR FUNCIONAMIENTO)

### 4. 📋 AGREGAR ENDPOINTS GET FALTANTES EN CATÁLOGOS

Varios catálogos no tienen endpoints GET. Agregar estos métodos:

**En `backend/catalogos/marca_routes.py`:**
```python
@marca_bp.route('/marca', methods=['GET'])
def get_marcas():
    """Obtener todas las marcas"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM marca ORDER BY nombre')
    columns = [desc[0] for desc in cur.description]
    marcas = [dict(zip(columns, row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(marcas)
```

**Repetir el mismo patrón para estos archivos:**
- `dependencias_routes.py` → endpoint GET `/dependencias`
- `direcciones_routes.py` → endpoint GET `/direcciones`
- `dispositivos_routes.py` → endpoint GET `/dispositivos`
- `equipamientos_routes.py` → endpoint GET `/equipamientos`
- `tipo_equipo_routes.py` → endpoint GET `/tipo-equipo`
- `tipo_sistema_operativo_routes.py` → endpoint GET `/tipo-sistema-operativo`
- `ram_routes.py` → endpoint GET `/ram`
- `disco_routes.py` → endpoint GET `/disco`
- `office_routes.py` → endpoint GET `/office`
- `tipo_conexion_routes.py` → endpoint GET `/tipo-conexion`
- `caracteristicas_routes.py` → endpoint GET `/caracteristicas`
- `programa_adicional_routes.py` → endpoint GET `/programa-adicional`

### 5. 🔄 MEJORAR ENDPOINT DE INVENTARIO CON JOINS

**Archivo:** `backend/inventario/inventario_routes.py`

**PROBLEMA:** El frontend recibe solo IDs, necesita los nombres también.

**SOLUCIÓN:** Modificar el método `get_inventario()`:

```python
@inventario_bp.route('/inventario', methods=['GET'])
def get_inventario():
    """Devuelve todos los registros del inventario con datos expandidos"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Query con JOINs para obtener nombres en lugar de IDs
    query = """
    SELECT 
        i.*,
        u.username as usuario,
        d.nombre as dependencia,
        da.nombre as direccion_area,
        dv.nombre as dispositivo,
        e.nombre as equipamiento,
        te.nombre as tipo_equipo,
        tso.nombre as tipo_sistema_operativo,
        c.descripcion as caracteristicas,
        r.capacidad as ram,
        ds.capacidad as disco,
        o.version as office,
        m.nombre as marca,
        tc.nombre as tipo_conexion
    FROM inventario i
    LEFT JOIN usuario u ON i.usuario_id = u.id
    LEFT JOIN dependencia d ON i.dependencia_id = d.id
    LEFT JOIN direccion_area da ON i.direccion_area_id = da.id
    LEFT JOIN dispositivo dv ON i.dispositivo_id = dv.id
    LEFT JOIN equipamiento e ON i.equipamiento_id = e.id
    LEFT JOIN tipo_equipo te ON i.tipo_equipo_id = te.id
    LEFT JOIN tipo_sistema_operativo tso ON i.tipo_sistema_operativo_id = tso.id
    LEFT JOIN caracteristicas c ON i.caracteristicas_id = c.id
    LEFT JOIN ram r ON i.ram_id = r.id
    LEFT JOIN disco ds ON i.disco_id = ds.id
    LEFT JOIN office o ON i.office_id = o.id
    LEFT JOIN marca m ON i.marca_id = m.id
    LEFT JOIN tipo_conexion tc ON i.tipo_conexion_id = tc.id
    ORDER BY i.fecha_registro DESC
    """
    
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    items = [dict(zip(columns, row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(items)
```

## 🗄️ CONFIGURACIÓN DE BASE DE DATOS

### 6. 📊 EJECUTAR SCRIPTS SQL

**En pgAdmin4:**

1. **Crear base de datos:**
   ```sql
   CREATE DATABASE "Inventario";
   ```

2. **Conectarse a la base de datos "Inventario"**

3. **Ejecutar scripts en orden:**
   - Primero: `SQL/Inventario.sql`
   - Segundo: `SQL/historial_inventario.sql`

4. **Agregar datos de prueba:**
   ```sql
   -- Usuarios de prueba
   INSERT INTO usuario (username, password) VALUES 
   ('admin', 'admin123'),
   ('usuario', 'user123');

   -- Dependencias
   INSERT INTO dependencia (nombre) VALUES 
   ('Sistemas'), ('Contabilidad'), ('Recursos Humanos');

   -- Marcas
   INSERT INTO marca (nombre) VALUES 
   ('Dell'), ('HP'), ('Lenovo'), ('Acer');

   -- Tipos de equipo
   INSERT INTO tipo_equipo (nombre) VALUES 
   ('Laptop'), ('Desktop'), ('Servidor'), ('Impresora');

   -- Sistemas operativos
   INSERT INTO tipo_sistema_operativo (nombre) VALUES 
   ('Windows 11'), ('Windows 10'), ('Ubuntu 22.04'), ('macOS');

   -- RAM
   INSERT INTO ram (capacidad) VALUES 
   ('4GB'), ('8GB'), ('16GB'), ('32GB');

   -- Disco
   INSERT INTO disco (capacidad) VALUES 
   ('250GB SSD'), ('500GB SSD'), ('1TB HDD'), ('2TB HDD');
   ```

## ✅ LISTA DE VERIFICACIÓN

Antes de hacer merge, verificar que:

- [ ] Blueprint de inventario registrado en `app.py`
- [ ] CORS configurado y flask-cors instalado
- [ ] Endpoint `/auth/login` creado
- [ ] Base de datos "Inventario" creada en PostgreSQL
- [ ] Scripts SQL ejecutados
- [ ] Datos de prueba insertados
- [ ] Backend corriendo en puerto 5000: `py -m backend.app`
- [ ] Endpoints GET agregados a catálogos
- [ ] Query del inventario mejorada con JOINs

## 🧪 PRUEBAS RÁPIDAS

Una vez implementados los cambios, probar:

1. **Backend funcionando:**
   ```bash
   curl http://localhost:5000/usuarios
   ```

2. **Login funcionando:**
   ```bash
   curl -X POST http://localhost:5000/auth/login \
   -H "Content-Type: application/json" \
   -d '{"username":"admin","password":"admin123"}'
   ```

3. **Inventario funcionando:**
   ```bash
   curl http://localhost:5000/inventario
   ```

4. **CORS funcionando:**
   - Abrir frontend en http://localhost:3000
   - Intentar login con admin/admin123
   - Debería redirigir al dashboard

## 📞 CONTACTO

Si tienes dudas con algún cambio, revisa:
- El código del frontend en la rama `samuel`
- Los tipos TypeScript en `frontend/src/types/index.ts`
- Los servicios API en `frontend/src/services/api.ts`

¡Todo está listo para el merge! 🚀
