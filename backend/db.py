"""
Módulo de conexión a la base de datos PostgreSQL.
Define una función reutilizable para obtener una conexión usando la configuración centralizada en config.py.
"""

import psycopg2   # Importa la librería para conectar Python con PostgreSQL
from config import DATABASE_URL, TIMEZONE  # Importa la cadena de conexión y zona horaria desde el archivo de configuración

# Función para obtener una conexión a la base de datos PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    # Configurar la zona horaria para esta conexión
    cur = conn.cursor()
    cur.execute(f"SET timezone = '{TIMEZONE}'")
    conn.commit()
    cur.close()
    return conn
