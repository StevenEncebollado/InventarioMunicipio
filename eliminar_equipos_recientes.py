"""
Script para eliminar solo los equipos agregados recientemente
"""

import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

def eliminar_equipos_recientes():
    """Elimina solo los equipos agregados en la última hora"""
    try:
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🗑️  ELIMINANDO EQUIPOS AGREGADOS RECIENTEMENTE")
        print("=" * 50)
        
        # Verificar equipos agregados en la última hora
        cur.execute("""
            SELECT id, nombre_pc, codigo_inventario, fecha_registro
            FROM inventario 
            WHERE fecha_registro >= NOW() - INTERVAL '1 hour'
            ORDER BY fecha_registro DESC
        """)
        
        equipos_recientes = cur.fetchall()
        
        if not equipos_recientes:
            print("✅ No hay equipos agregados recientemente")
            return
        
        print(f"📋 Equipos agregados en la última hora ({len(equipos_recientes)}):")
        for equipo_id, nombre_pc, codigo, fecha in equipos_recientes:
            print(f"  • ID {equipo_id}: {nombre_pc} ({codigo}) - {fecha}")
        
        confirmacion = input(f"\n❓ ¿Deseas eliminar estos {len(equipos_recientes)} equipos? [y/N]: ")
        
        if confirmacion.lower() not in ['y', 'yes', 'sí', 'si']:
            print("❌ Operación cancelada")
            return
        
        # Obtener IDs para eliminar
        ids_eliminar = [equipo[0] for equipo in equipos_recientes]
        
        # Eliminar de inventario_programa primero (tabla dependiente)
        cur.execute("DELETE FROM inventario_programa WHERE inventario_id = ANY(%s)", (ids_eliminar,))
        programas_eliminados = cur.rowcount
        
        # Eliminar de inventario
        cur.execute("DELETE FROM inventario WHERE id = ANY(%s)", (ids_eliminar,))
        equipos_eliminados = cur.rowcount
        
        conn.commit()
        
        print(f"\n✅ Resultado:")
        print(f"  📦 Equipos eliminados: {equipos_eliminados}")
        print(f"  🔗 Relaciones de programas eliminadas: {programas_eliminados}")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if conn:
            conn.rollback()

if __name__ == "__main__":
    eliminar_equipos_recientes()