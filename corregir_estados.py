"""
Script para corregir los estados de equipos en la base de datos
Cambia 'ACTIVO' por 'Activo' para que coincida con el frontend
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def corregir_estados():
    """Corrige los estados de equipos para que coincidan con el frontend"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🔧 CORRIGIENDO ESTADOS DE EQUIPOS")
        print("=" * 50)
        
        # Verificar estados actuales
        cur.execute("SELECT estado, COUNT(*) FROM inventario GROUP BY estado")
        estados_actuales = cur.fetchall()
        
        print("📊 Estados actuales:")
        for estado, count in estados_actuales:
            print(f"  • {estado}: {count} equipos")
        
        # Corregir estados
        correcciones = [
            ("UPDATE inventario SET estado = 'Activo' WHERE estado = 'ACTIVO'", "ACTIVO → Activo"),
            ("UPDATE inventario SET estado = 'Inactivo' WHERE estado = 'INACTIVO'", "INACTIVO → Inactivo"), 
            ("UPDATE inventario SET estado = 'Mantenimiento' WHERE estado = 'MANTENIMIENTO'", "MANTENIMIENTO → Mantenimiento")
        ]
        
        for sql, descripcion in correcciones:
            cur.execute(sql)
            filas_afectadas = cur.rowcount
            if filas_afectadas > 0:
                print(f"✅ {descripcion}: {filas_afectadas} equipos actualizados")
        
        # Verificar estados después de la corrección
        cur.execute("SELECT estado, COUNT(*) FROM inventario GROUP BY estado")
        estados_corregidos = cur.fetchall()
        
        print("\n📊 Estados después de la corrección:")
        for estado, count in estados_corregidos:
            print(f"  • {estado}: {count} equipos")
        
        conn.commit()
        cur.close()
        conn.close()
        
        print("\n✅ Estados corregidos exitosamente")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    corregir_estados()