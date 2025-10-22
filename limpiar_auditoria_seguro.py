"""
Script SEGURO para limpiar la tabla historial_inventario.
Hace backup automático antes de limpiar.
"""

import psycopg2
from datetime import datetime

DATABASE_URL = 'postgresql://postgres:12345678@localhost:1717/Inventario'

def limpiar_auditoria():
    print("=" * 70)
    print("🧹 LIMPIEZA SEGURA DE TABLA HISTORIAL_INVENTARIO")
    print("=" * 70)
    print()
    
    try:
        # Conectar
        print("📡 Conectando a la base de datos...")
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        print("✅ Conectado exitosamente")
        print()
        
        # 1. Ver cuántos registros hay
        cur.execute("SELECT COUNT(*) FROM historial_inventario")
        total_antes = cur.fetchone()[0]
        print(f"📊 Total de registros actuales: {total_antes}")
        print()
        
        # 2. Crear backup automático
        fecha_backup = datetime.now().strftime("%Y%m%d_%H%M%S")
        tabla_backup = f"historial_inventario_backup_{fecha_backup}"
        
        print(f"💾 Creando backup: {tabla_backup}")
        cur.execute(f"CREATE TABLE {tabla_backup} AS SELECT * FROM historial_inventario")
        conn.commit()
        print("✅ Backup creado exitosamente")
        print()
        
        # 3. Verificar que el backup se creó
        cur.execute(f"SELECT COUNT(*) FROM {tabla_backup}")
        total_backup = cur.fetchone()[0]
        print(f"✅ Backup verificado: {total_backup} registros copiados")
        print()
        
        # 4. Preguntar confirmación
        print("⚠️  ATENCIÓN: Estás a punto de limpiar la tabla historial_inventario")
        print(f"   Se van a ELIMINAR {total_antes} registros")
        print(f"   Backup guardado en: {tabla_backup}")
        print()
        respuesta = input("¿Estás SEGURO de continuar? (escribe 'SI' en mayúsculas): ")
        print()
        
        if respuesta != "SI":
            print("❌ Operación CANCELADA por el usuario")
            print("   No se eliminó nada. El backup sigue ahí por si acaso.")
            cur.close()
            conn.close()
            return False
        
        # 5. Limpiar la tabla (TRUNCATE es más rápido y seguro que DELETE)
        print("🗑️  Limpiando tabla historial_inventario...")
        cur.execute("TRUNCATE TABLE historial_inventario RESTART IDENTITY CASCADE")
        conn.commit()
        print("✅ Tabla limpiada exitosamente")
        print()
        
        # 6. Verificar que está vacía
        cur.execute("SELECT COUNT(*) FROM historial_inventario")
        total_despues = cur.fetchone()[0]
        print(f"📊 Registros después de limpiar: {total_despues}")
        print()
        
        # 7. Mostrar instrucciones de recuperación
        print("=" * 70)
        print("✅ LIMPIEZA COMPLETADA")
        print("=" * 70)
        print()
        print(f"📌 Información importante:")
        print(f"   • Registros eliminados: {total_antes}")
        print(f"   • Tabla de backup: {tabla_backup}")
        print()
        print("💡 Si necesitas recuperar los datos:")
        print(f'   INSERT INTO historial_inventario SELECT * FROM {tabla_backup};')
        print()
        print("🗑️  Para eliminar el backup cuando ya no lo necesites:")
        print(f'   DROP TABLE {tabla_backup};')
        print()
        
        cur.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print()
        print("=" * 70)
        print("❌ ERROR EN LA BASE DE DATOS")
        print("=" * 70)
        print(f"Código: {e.pgcode}")
        print(f"Mensaje: {e.pgerror}")
        print()
        print("⚠️  NO se eliminó nada. Tus datos están seguros.")
        return False
        
    except Exception as e:
        print()
        print(f"❌ Error inesperado: {e}")
        print("⚠️  NO se eliminó nada. Tus datos están seguros.")
        return False


if __name__ == '__main__':
    print()
    limpiar_auditoria()
    print()
    input("Presiona ENTER para salir...")
