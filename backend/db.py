"""
Módulo de conexión a la base de datos PostgreSQL.
Define una función reutilizable para obtener una conexión usando la configuración centralizada en config.py.
"""

import psycopg2   # Importa la librería para conectar Python con PostgreSQL
import psycopg2.extras
from psycopg2 import tz
from .config import DATABASE_URL, TIMEZONE   # Importa la cadena de conexión y zona horaria desde el archivo de configuración

# Función para obtener una conexión a la base de datos PostgreSQL
def get_db_connection():
    """
    Crea y configura una conexión a PostgreSQL con timezone-aware datetimes.
    Esto asegura que todas las fechas se manejen correctamente con zona horaria de Ecuador.
    """
    conn = psycopg2.connect(DATABASE_URL)
    
    # Configurar la zona horaria para esta conexión
    cur = conn.cursor()
    cur.execute(f"SET timezone = '{TIMEZONE}'")
    conn.commit()
    cur.close()
    
    # CRÍTICO: Configurar psycopg2 para devolver datetime con timezone
    # Esto hace que Python reciba objetos datetime "aware" en lugar de "naive"
    # sin esto, las fechas se interpretarían como UTC
    psycopg2.extras.register_default_jsonb(conn)
    
    return conn
