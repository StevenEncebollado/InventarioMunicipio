"""
Script para verificar y limpiar referencias de dependencias problemáticas
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def verificar_referencias_dependencias():
    """Verifica todas las referencias de las dependencias problemáticas"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🔍 VERIFICANDO REFERENCIAS DE DEPENDENCIAS PROBLEMÁTICAS")
        print("=" * 60)
        
        dependencias_problematicas = [3, 9]  # Pxd y ECU 911
        
        for dep_id in dependencias_problematicas:
            # Obtener nombre de la dependencia
            cur.execute('SELECT nombre FROM dependencia WHERE id = %s', (dep_id,))
            dependencia = cur.fetchone()
            
            if not dependencia:
                print(f"❌ Dependencia ID {dep_id} no encontrada")
                continue
                
            nombre = dependencia[0]
            print(f"\n📋 Dependencia ID {dep_id}: '{nombre}'")
            print("-" * 40)
            
            # Verificar equipos asociados
            cur.execute('SELECT COUNT(*) FROM inventario WHERE dependencia_id = %s', (dep_id,))
            equipos = cur.fetchone()[0]
            print(f"  📦 Equipos en inventario: {equipos}")
            
            # Verificar direcciones/áreas asociadas
            cur.execute('SELECT id, nombre FROM direccion_area WHERE dependencia_id = %s', (dep_id,))
            areas = cur.fetchall()
            print(f"  📍 Áreas/direcciones asociadas: {len(areas)}")
            
            if areas:
                for area_id, area_nombre in areas:
                    # Ver si estas áreas tienen equipos asociados
                    cur.execute('SELECT COUNT(*) FROM inventario WHERE direccion_area_id = %s', (area_id,))
                    equipos_area = cur.fetchone()[0]
                    print(f"    - ID {area_id}: '{area_nombre}' ({equipos_area} equipos)")
            
            # Verificar otras posibles referencias (usuarios, etc.)
            cur.execute('SELECT COUNT(*) FROM usuario WHERE id = %s', (dep_id,))
            usuarios = cur.fetchone()[0]
            if usuarios > 0:
                print(f"  👤 Referencias en usuarios: {usuarios}")
        
        print(f"\n🛠️  ESTRATEGIA DE LIMPIEZA:")
        print("Para eliminar las dependencias problemáticas necesitamos:")
        print("1. Reasignar las áreas/direcciones a otras dependencias")
        print("2. O eliminar las áreas si no tienen equipos asociados")
        print("3. Luego eliminar las dependencias vacías")
        
        # Mostrar dependencias válidas para reasignación
        cur.execute("""
            SELECT d.id, d.nombre, COUNT(i.id) as equipos
            FROM dependencia d
            LEFT JOIN inventario i ON d.id = i.dependencia_id
            WHERE d.id NOT IN (3, 9)
            GROUP BY d.id, d.nombre
            HAVING COUNT(i.id) > 0
            ORDER BY COUNT(i.id) DESC
        """)
        
        dependencias_validas = cur.fetchall()
        print(f"\n📋 Dependencias válidas para reasignación:")
        for dep_id, nombre, equipos in dependencias_validas[:5]:  # Mostrar las top 5
            print(f"  • ID {dep_id}: {nombre} ({equipos} equipos)")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

def limpiar_referencias_dependencias():
    """Limpia las referencias de dependencias problemáticas"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("\n🧹 LIMPIANDO REFERENCIAS DE DEPENDENCIAS PROBLEMÁTICAS")
        print("=" * 60)
        
        dependencias_problematicas = [3, 9]  # Pxd y ECU 911
        
        for dep_id in dependencias_problematicas:
            # Obtener áreas asociadas
            cur.execute('SELECT id, nombre FROM direccion_area WHERE dependencia_id = %s', (dep_id,))
            areas = cur.fetchall()
            
            if not areas:
                continue
                
            cur.execute('SELECT nombre FROM dependencia WHERE id = %s', (dep_id,))
            dep_nombre = cur.fetchone()[0]
            
            print(f"\n📋 Procesando dependencia '{dep_nombre}' (ID {dep_id})")
            
            for area_id, area_nombre in areas:
                # Verificar si el área tiene equipos
                cur.execute('SELECT COUNT(*) FROM inventario WHERE direccion_area_id = %s', (area_id,))
                equipos_en_area = cur.fetchone()[0]
                
                if equipos_en_area == 0:
                    # Eliminar área sin equipos
                    cur.execute('DELETE FROM direccion_area WHERE id = %s', (area_id,))
                    print(f"  ❌ Eliminada área sin equipos: '{area_nombre}' (ID {area_id})")
                else:
                    # Reasignar área a MUNICIPIO (que tiene más equipos)
                    cur.execute('UPDATE direccion_area SET dependencia_id = 1 WHERE id = %s', (area_id,))
                    print(f"  ↗️  Reasignada área a MUNICIPIO: '{area_nombre}' (ID {area_id}, {equipos_en_area} equipos)")
        
        conn.commit()
        print(f"\n✅ Referencias limpiadas exitosamente")
        
        # Ahora intentar eliminar las dependencias problemáticas
        print(f"\n🗑️  Eliminando dependencias problemáticas...")
        
        for dep_id in dependencias_problematicas:
            cur.execute('SELECT nombre FROM dependencia WHERE id = %s', (dep_id,))
            dep_nombre = cur.fetchone()[0]
            
            try:
                cur.execute('DELETE FROM dependencia WHERE id = %s', (dep_id,))
                if cur.rowcount > 0:
                    print(f"  ✅ Eliminada: '{dep_nombre}' (ID {dep_id})")
                else:
                    print(f"  ⚠️  No se pudo eliminar: '{dep_nombre}' (ID {dep_id})")
            except Exception as e:
                print(f"  ❌ Error eliminando '{dep_nombre}': {e}")
                conn.rollback()
                continue
        
        conn.commit()
        cur.close()
        conn.close()
        
        print(f"\n🎉 Proceso completado!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    verificar_referencias_dependencias()
    
    respuesta = input("\n❓ ¿Deseas proceder con la limpieza? [y/N]: ")
    if respuesta.lower() in ['y', 'yes', 'sí', 'si']:
        limpiar_referencias_dependencias()
    else:
        print("❌ Limpieza cancelada")