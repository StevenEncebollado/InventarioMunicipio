"""
Script para identificar dependencias duplicadas o similares
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def identificar_dependencias_problematicas():
    """Identifica dependencias duplicadas o con nombres similares"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🔍 IDENTIFICANDO DEPENDENCIAS PROBLEMÁTICAS")
        print("=" * 60)
        
        # Obtener todas las dependencias con conteo de equipos
        cur.execute("""
            SELECT d.id, d.nombre, COUNT(i.id) as equipos_asociados
            FROM dependencia d
            LEFT JOIN inventario i ON d.id = i.dependencia_id
            GROUP BY d.id, d.nombre
            ORDER BY d.nombre, COUNT(i.id) DESC
        """)
        
        dependencias = cur.fetchall()
        
        print("📋 Todas las dependencias:")
        print("ID  | Equipos | Nombre")
        print("-" * 40)
        
        dependencias_sin_equipos = []
        nombres_vistos = {}
        
        for dep_id, nombre, equipos in dependencias:
            print(f"{dep_id:3d} | {equipos:7d} | {nombre}")
            
            if equipos == 0:
                dependencias_sin_equipos.append((dep_id, nombre))
            
            # Buscar nombres similares
            nombre_lower = nombre.lower().strip()
            if nombre_lower in nombres_vistos:
                nombres_vistos[nombre_lower].append((dep_id, nombre, equipos))
            else:
                nombres_vistos[nombre_lower] = [(dep_id, nombre, equipos)]
        
        print(f"\n🗑️  Dependencias sin equipos ({len(dependencias_sin_equipos)}):")
        for dep_id, nombre in dependencias_sin_equipos:
            print(f"  • ID {dep_id}: {nombre}")
        
        # Buscar posibles duplicados
        print(f"\n🔍 Posibles duplicados o similares:")
        encontrados_duplicados = False
        
        for nombre_key, lista_deps in nombres_vistos.items():
            if len(lista_deps) > 1:
                encontrados_duplicados = True
                print(f"\n  📌 Nombre similar: '{nombre_key}'")
                for dep_id, nombre_original, equipos in lista_deps:
                    estado = "✅ CON EQUIPOS" if equipos > 0 else "❌ SIN EQUIPOS"
                    print(f"    - ID {dep_id}: '{nombre_original}' ({equipos} equipos) {estado}")
        
        # Buscar específicamente ECU911 y PLAZA DEL MAR
        casos_especificos = ['ECU911', 'PLAZA DEL MAR', 'PXD']
        
        print(f"\n🎯 Casos específicos mencionados:")
        for caso in casos_especificos:
            cur.execute("""
                SELECT d.id, d.nombre, COUNT(i.id) as equipos
                FROM dependencia d
                LEFT JOIN inventario i ON d.id = i.dependencia_id
                WHERE UPPER(d.nombre) LIKE %s
                GROUP BY d.id, d.nombre
                ORDER BY COUNT(i.id) DESC
            """, (f'%{caso.upper()}%',))
            
            resultados = cur.fetchall()
            if resultados:
                print(f"\n  🔎 '{caso}':")
                for dep_id, nombre, equipos in resultados:
                    estado = "✅ MANTENER" if equipos > 0 else "🗑️  ELIMINAR"
                    print(f"    - ID {dep_id}: '{nombre}' ({equipos} equipos) {estado}")
        
        if not encontrados_duplicados:
            print("  ✅ No se encontraron duplicados exactos")
        
        cur.close()
        conn.close()
        
        print("\n✅ Análisis completado")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    identificar_dependencias_problematicas()