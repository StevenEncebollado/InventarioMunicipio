"""
Script para revisar las columnas del Excel y diagnosticar problemas de importación
"""

import pandas as pd
import sys

def revisar_excel(ruta_excel):
    """Revisa la estructura del Excel para diagnosticar problemas"""
    try:
        # Leer todas las hojas
        hojas = pd.read_excel(ruta_excel, sheet_name=None)
        
        print("🔍 DIAGNÓSTICO DEL ARCHIVO EXCEL")
        print("=" * 50)
        
        for nombre_hoja, df in hojas.items():
            print(f"\n📋 Hoja: {nombre_hoja}")
            print(f"📊 Filas: {len(df)}, Columnas: {len(df.columns)}")
            print("\n🏷️ Columnas encontradas:")
            for i, col in enumerate(df.columns, 1):
                print(f"  {i:2d}. '{col}'")
            
            # Mostrar algunas filas de ejemplo
            print(f"\n📄 Primeras 3 filas de datos:")
            print(df.head(3).to_string())
            
            # Revisar valores nulos por columna
            print(f"\n❌ Valores nulos por columna:")
            nulos = df.isnull().sum()
            for col, count in nulos.items():
                if count > 0:
                    print(f"  • {col}: {count} nulos de {len(df)} filas")
            
            break  # Solo revisar la primera hoja como ejemplo
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ruta_excel = sys.argv[1]
    else:
        ruta_excel = input("📁 Ruta del Excel: ").strip().strip('"')
    
    revisar_excel(ruta_excel)