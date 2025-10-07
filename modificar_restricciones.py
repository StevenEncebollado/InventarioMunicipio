"""
Script para modificar restricciones de unicidad y permitir duplicados controlados
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def modificar_restricciones():
    """Modifica las restricciones para permitir ciertos duplicados"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🔧 MODIFICANDO RESTRICCIONES DE UNICIDAD")
        print("=" * 50)
        
        # Eliminar restricciones problemáticas
        restricciones = [
            "ALTER TABLE inventario DROP CONSTRAINT IF EXISTS unique_anydesk",
            "ALTER TABLE inventario DROP CONSTRAINT IF EXISTS inventario_anydesk_key"
        ]
        
        for sql in restricciones:
            try:
                cur.execute(sql)
                print(f"✅ Ejecutado: {sql}")
            except Exception as e:
                print(f"⚠️  {sql}: {e}")
        
        # Agregar usuario admin con password
        try:
            cur.execute("INSERT INTO usuario (username, password) VALUES (%s, %s) ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password", 
                       ('admin', 'admin123'))
            print("✅ Usuario admin creado/actualizado")
        except Exception as e:
            print(f"⚠️  Error con usuario admin: {e}")
        
        conn.commit()
        cur.close()
        conn.close()
        
        print("✅ Restricciones modificadas exitosamente")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    modificar_restricciones()