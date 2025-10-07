"""
Script para limpiar la tabla de inventario antes de reimportar datos
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

def limpiar_inventario():
    """Limpia todas las tablas relacionadas con el inventario"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🧹 LIMPIANDO BASE DE DATOS DE INVENTARIO")
        print("=" * 50)
        
        # Eliminar en orden (primero las tablas dependientes)
        print("📋 Eliminando registros de inventario_programa...")
        cur.execute("DELETE FROM inventario_programa")
        
        print("📋 Eliminando registros de inventario...")
        cur.execute("DELETE FROM inventario")
        
        conn.commit()
        print("\n✅ Base de datos limpiada exitosamente")
        print("💡 Ahora puedes ejecutar la importación de nuevo")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error limpiando base de datos: {e}")

if __name__ == "__main__":
    print("⚠️  ADVERTENCIA: Esto eliminará TODOS los datos del inventario")
    confirmacion = input("¿Estás seguro de continuar? [y/N]: ")
    
    if confirmacion.lower() in ['y', 'yes', 'sí', 'si']:
        limpiar_inventario()
    else:
        print("❌ Operación cancelada")