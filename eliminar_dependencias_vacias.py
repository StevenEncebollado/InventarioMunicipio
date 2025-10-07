"""
Script para eliminar dependencias sin equipos asociados
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def eliminar_dependencias_vacias():
    """Elimina dependencias que no tienen equipos asociados"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🗑️  ELIMINANDO DEPENDENCIAS SIN EQUIPOS")
        print("=" * 50)
        
        # Identificar dependencias sin equipos
        cur.execute("""
            SELECT d.id, d.nombre
            FROM dependencia d
            LEFT JOIN inventario i ON d.id = i.dependencia_id
            GROUP BY d.id, d.nombre
            HAVING COUNT(i.id) = 0
            ORDER BY d.nombre
        """)
        
        dependencias_vacias = cur.fetchall()
        
        if not dependencias_vacias:
            print("✅ No hay dependencias sin equipos para eliminar")
            return
        
        print(f"📋 Dependencias sin equipos encontradas ({len(dependencias_vacias)}):")
        for dep_id, nombre in dependencias_vacias:
            print(f"  • ID {dep_id}: {nombre}")
        
        confirmacion = input(f"\n❓ ¿Deseas eliminar estas {len(dependencias_vacias)} dependencias? [y/N]: ")
        
        if confirmacion.lower() not in ['y', 'yes', 'sí', 'si']:
            print("❌ Operación cancelada")
            return
        
        # Eliminar dependencias una por una
        eliminadas = 0
        errores = 0
        
        for dep_id, nombre in dependencias_vacias:
            try:
                cur.execute('DELETE FROM dependencia WHERE id = %s', (dep_id,))
                if cur.rowcount > 0:
                    print(f"✅ Eliminada: ID {dep_id} - {nombre}")
                    eliminadas += 1
                else:
                    print(f"⚠️  No se pudo eliminar: ID {dep_id} - {nombre}")
                    errores += 1
                    
            except Exception as e:
                print(f"❌ Error eliminando ID {dep_id} - {nombre}: {e}")
                errores += 1
                conn.rollback()
                continue
        
        if eliminadas > 0:
            conn.commit()
            print(f"\n🎉 Resultado:")
            print(f"  ✅ Dependencias eliminadas: {eliminadas}")
            if errores > 0:
                print(f"  ❌ Errores: {errores}")
        else:
            print("\n❌ No se eliminó ninguna dependencia")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    eliminar_dependencias_vacias()