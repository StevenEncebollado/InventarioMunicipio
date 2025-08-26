# PROMPT PARA COPILOT - INTEGRACIÓN BACKEND CON FRONTEND NEXT.JS

Hola Copilot, necesito que me ayudes a modificar mi backend de Flask para que funcione perfectamente con un frontend de Next.js. El frontend ya está listo y necesita estas correcciones específicas en el backend:

## PROBLEMA 1: Blueprint de inventario no registrado
Mi archivo `backend/app.py` no tiene registrado el blueprint de inventario. Necesito:
- Importar `inventario_bp` desde `./inventario/inventario_routes.py`  
- Registrarlo en la función `create_app()` junto con los otros blueprints

## PROBLEMA 2: CORS no configurado
El frontend en localhost:3000 no puede conectarse al backend por CORS. Necesito:
- Instalar e importar `flask_cors`
- Configurar CORS para permitir conexiones desde `http://localhost:3000`

## PROBLEMA 3: Endpoint de login incorrecto  
El frontend llama a `POST /auth/login` pero mi endpoint actual es `POST /usuarios` que es para crear usuarios. Necesito:
- Crear endpoint `POST /auth/login` en `usuarios_routes.py`
- Que reciba `username` y `password` en JSON
- Que busque el usuario en la tabla `usuario` con esas credenciales
- Que retorne `{id, username}` si es válido o error 401 si no

## PROBLEMA 4: Endpoints GET faltantes en catálogos
Varios archivos de catálogos no tienen endpoints GET y el frontend los necesita:
- `/marca` GET → retornar todas las marcas  
- `/dependencias` GET → retornar todas las dependencias
- `/tipo-equipo` GET → retornar todos los tipos de equipo
- `/tipo-sistema-operativo` GET → retornar todos los sistemas operativos
- Y todos los demás catálogos que solo tienen POST/PUT/DELETE

## PROBLEMA 5: Query de inventario mejorada
En `inventario_routes.py`, el endpoint GET `/inventario` solo retorna IDs. El frontend necesita los nombres también. Modificar para:
- Hacer JOINs con todas las tablas relacionadas (usuario, dependencia, marca, tipo_equipo, etc.)
- Retornar tanto los IDs como los nombres de cada relación
- Ordenar por fecha_registro DESC

## ESTRUCTURA DE BASE DE DATOS
La BD PostgreSQL tiene estas tablas principales:
- `usuario(id, username, password)`
- `inventario(id, usuario_id, dependencia_id, marca_id, tipo_equipo_id, ... muchos más campos)`
- `dependencia(id, nombre)`, `marca(id, nombre)`, `tipo_equipo(id, nombre)`, etc.

## LO QUE YA FUNCIONA
- El backend corre con `py -m backend.app`
- La conexión a PostgreSQL está configurada en `db.py`
- Los blueprints existentes funcionan correctamente
- Las dependencias están instaladas

Por favor ayúdame a generar el código necesario para solucionar estos 5 problemas manteniendo la estructura existente del proyecto.
