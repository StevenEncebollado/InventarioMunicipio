import pandas as pd
import os

EXCEL_PATH = os.path.join(os.path.dirname(__file__), 'INVENTARIO 2025 GAD MANTA.xlsx')

def mostrar_estructura_excel():
    xls = pd.ExcelFile(EXCEL_PATH)
    print(f"Nombre del archivo: {EXCEL_PATH}")
    print("Hojas encontradas:")
    for sheet_name in xls.sheet_names:
        print(f"- {sheet_name}")
        df = pd.read_excel(xls, sheet_name=sheet_name)
        print(f"  Columnas: {list(df.columns)}\n")

if __name__ == "__main__":
    mostrar_estructura_excel()
