"""
Script para verificar que los datos están correctamente en la base de datos
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def verificar_datos():
    """Verifica que los datos estén correctamente en la base de datos"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🔍 VERIFICANDO DATOS EN LA BASE DE DATOS")
        print("=" * 50)
        
        # Contar total de equipos
        cur.execute("SELECT COUNT(*) FROM inventario")
        total_equipos = cur.fetchone()[0]
        print(f"📊 Total de equipos: {total_equipos}")
        
        # Contar por estado
        cur.execute("SELECT estado, COUNT(*) FROM inventario GROUP BY estado ORDER BY estado")
        estados = cur.fetchall()
        
        print("\n📋 Equipos por estado:")
        for estado, count in estados:
            print(f"  • {estado}: {count}")
        
        # Contar por dependencia
        cur.execute("""
            SELECT d.nombre, COUNT(i.id) 
            FROM dependencia d 
            LEFT JOIN inventario i ON d.id = i.dependencia_id 
            GROUP BY d.nombre 
            ORDER BY COUNT(i.id) DESC
        """)
        dependencias = cur.fetchall()
        
        print("\n🏢 Equipos por dependencia:")
        for dep, count in dependencias:
            if count > 0:
                print(f"  • {dep}: {count}")
        
        # Verificar datos de muestra
        cur.execute("SELECT nombre_pc, estado, codigo_inventario FROM inventario LIMIT 5")
        muestra = cur.fetchall()
        
        print("\n🔍 Muestra de equipos:")
        for pc, estado, codigo in muestra:
            print(f"  • {pc} ({codigo}) - {estado}")
        
        cur.close()
        conn.close()
        
        print("\n✅ Verificación completada")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    verificar_datos()