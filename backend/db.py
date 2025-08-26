"""
Módulo de conexión a la base de datos PostgreSQL.
Define una función reutilizable para obtener una conexión usando la configuración centralizada en config.py.
"""

import psycopg2   # Importa la librería para conectar Python con PostgreSQL
from .config import DATABASE_URL   # Importa la cadena de conexión desde el archivo de configuración

# Función para obtener una conexión a la base de datos PostgreSQL
# Úsala en cualquier parte del backend para ejecutar consultas SQL
def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn
