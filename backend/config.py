"""
Archivo de configuración global del backend.
Aquí se centralizan las rutas, la cadena de conexión a la base de datos y otras variables importantes.
Modifica este archivo para cambiar la configuración del sistema sin alterar el resto del código.
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Archivo para centralizar rutas y configuraciones
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:12345678@localhost:5432/Inventario')
SQL_SCRIPT_PATH = os.path.join(BASE_DIR, 'SQL', 'Inventario.sql')
