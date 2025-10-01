import pandas as pd
import os
from db import get_db_connection

EXCEL_PATH = os.path.join(os.path.dirname(__file__), 'INVENTARIO 2025 GAD MANTA.xlsx')

COLUMN_MAP = {
    'DIRECCION IP': 'direccion_ip',
    'DIRECCION MAC': 'direccion_mac',
    'NOMBRE DE PC': 'nombre_pc',
    'NOMBRE DEL FUNCIONARIO': 'nombre_funcionario',
    'DIRECCION/ AREA': 'direccion_area',
    'INSTITUCIONAL/PERSONAL': 'institucional_personal',
    'TIPO DE EQUIPO': 'tipo_equipo',
    'TIPO DE SISTEMA OPERATIVO': 'tipo_sistema_operativo',
    'CARACTERISTICAS': 'caracteristicas',
    'RAM': 'ram',
    'DISCO ': 'disco',
    'OFFICE': 'office',
    'CPU MARCA': 'cpu_marca',  # Usar solo una clave para cpu_marca
    'CPU DOC INVENTARIO': 'cpu_doc_inventario',
    'TIPO DE CONEXIÓN': 'tipo_conexion',
    'MONITOR  MARCA': 'monitor_marca',
    'MONITOR COD INVENTARIO': 'monitor_cod_inventario',
    'TECLADO MARCA': 'teclado_marca',
    'TECLADO INVENTARIO': 'teclado_inventario',
    'MOUSE MARCA': 'mouse_marca',
    'MOUSE COD INVENTARIO': 'mouse_cod_inventario',
    'DIRECCION ANY DESK': 'direccion_anydesk',
    'CONTRASEÑA': 'contrasena',
    'PROGRAMAS': 'programas',  # Usar solo una clave para programas
    'INDICADORES': 'indicadores'
}

CAMPOS = list(dict.fromkeys(COLUMN_MAP.values()))  # Eliminar duplicados si los hay

CAMPOS = list(COLUMN_MAP.values())

def importar_excel():
    xls = pd.ExcelFile(EXCEL_PATH)
    conn = get_db_connection()
    cur = conn.cursor()
    for hoja in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=hoja)
        # Insertar dependencia si no existe
        cur.execute('SELECT id FROM dependencia WHERE nombre = %s', (hoja,))
        dep = cur.fetchone()
        if dep:
            dependencia_id = dep[0]
        else:
            cur.execute('INSERT INTO dependencia (nombre) VALUES (%s) RETURNING id', (hoja,))
            dependencia_id = cur.fetchone()[0]
            conn.commit()
        # Insertar cada fila como inventario
        for _, row in df.iterrows():
            valores = []
            for db_col in CAMPOS:
                # Buscar la primera columna del Excel que mapea a este campo
                excel_col = next((col for col, campo in COLUMN_MAP.items() if campo == db_col), None)
                valor = row.get(excel_col, None) if excel_col else None
                # Ajuste especial para el campo 'programas'
                if db_col == 'programas':
                    val1 = row.get('PROGRAMAS', None)
                    val2 = row.get('PROGRAMAS ', None)
                    if val1 and val2:
                        valor = f"{val1}\n{val2}"
                    elif val1:
                        valor = val1
                    elif val2:
                        valor = val2
                valores.append(valor)
            cur.execute(f"""
                INSERT INTO inventario (
                    dependencia_id, {', '.join(CAMPOS)}
                ) VALUES (
                    %s, {', '.join(['%s']*len(CAMPOS))}
                )
            """, [dependencia_id] + valores)
        conn.commit()
    cur.close()
    conn.close()
    print('Importación completada.')

if __name__ == "__main__":
    importar_excel()
