"""
Script para importar datos desde Excel al sistema de inventario municipal.
Cada hoja del Excel representa una dependencia diferente.
"""

import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
import sys

# Cargar variables de entorno
load_dotenv()

class ImportadorExcel:
    def __init__(self):
        self.conn = None
        self.cur = None
        
    def conectar_bd(self):
        """Establece conexión con la base de datos PostgreSQL"""
        try:
            database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:05092005sC@localhost:5432/Inventario')
            self.conn = psycopg2.connect(database_url)
            self.cur = self.conn.cursor(cursor_factory=RealDictCursor)
            print("✅ Conexión a la base de datos establecida")
            return True
        except Exception as e:
            print(f"❌ Error conectando a la base de datos: {e}")
            return False
    
    def cerrar_conexion(self):
        """Cierra la conexión a la base de datos"""
        if self.cur:
            self.cur.close()
        if self.conn:
            self.conn.close()
        print("🔒 Conexión cerrada")
    
    def obtener_o_crear_catalogo(self, tabla, nombre, campo_nombre=None):
        """
        Obtiene el ID de un elemento del catálogo o lo crea si no existe
        Mapea automáticamente los nombres de campos según la tabla
        """
        try:
            # Mapear nombres de campos según la tabla
            if campo_nombre is None:
                mapeo_campos = {
                    'caracteristicas': 'descripcion',
                    'ram': 'capacidad',
                    'disco': 'capacidad', 
                    'office': 'version',
                    'usuario': 'username'
                }
                campo_nombre = mapeo_campos.get(tabla, 'nombre')
            
            # Buscar si ya existe
            query = f"SELECT id FROM {tabla} WHERE {campo_nombre} = %s"
            self.cur.execute(query, (nombre,))
            resultado = self.cur.fetchone()
            
            if resultado:
                return resultado['id']
            
            # Si no existe, crearlo
            insert_query = f"INSERT INTO {tabla} ({campo_nombre}) VALUES (%s) RETURNING id"
            self.cur.execute(insert_query, (nombre,))
            nuevo_id = self.cur.fetchone()['id']
            # No hacer commit aquí, lo haremos al final de cada equipo
            
            print(f"➕ Creado nuevo {tabla}: {nombre} (ID: {nuevo_id})")
            return nuevo_id
            
        except Exception as e:
            print(f"❌ Error con catálogo {tabla}: {e}")
            # Reiniciar la transacción para continuar procesando
            self.conn.rollback()
            return None
    
    def procesar_programas_adicionales(self, programas_str):
        """
        Procesa la cadena de programas adicionales y retorna lista de IDs
        """
        if not programas_str or pd.isna(programas_str):
            return []
        
        # Separar programas por comas, punto y coma, o saltos de línea
        programas = []
        separadores = [',', ';', '\n', '|']
        
        programas_lista = [programas_str]
        for sep in separadores:
            temp = []
            for prog in programas_lista:
                temp.extend([p.strip() for p in str(prog).split(sep)])
            programas_lista = temp
        
        # Obtener o crear IDs para cada programa
        programa_ids = []
        for programa in programas_lista:
            if programa and programa.strip():
                programa_id = self.obtener_o_crear_catalogo('programa_adicional', programa.strip())
                if programa_id:
                    programa_ids.append(programa_id)
        
        return programa_ids
    
    def importar_desde_excel(self, ruta_excel):
        """
        Importa datos desde el archivo Excel
        """
        try:
            # Leer todas las hojas del Excel
            hojas = pd.read_excel(ruta_excel, sheet_name=None)
            
            print(f"📊 Archivo Excel encontrado con {len(hojas)} hojas")
            
            total_equipos = 0
            total_errores = 0
            
            for nombre_hoja, df in hojas.items():
                print(f"\n📋 Procesando hoja: {nombre_hoja} ({len(df)} filas)")
                equipos_hoja, errores_hoja = self.procesar_hoja(nombre_hoja, df)
                total_equipos += equipos_hoja
                total_errores += errores_hoja
            
            print(f"\n🎉 RESUMEN FINAL:")
            print(f"📊 Total equipos procesados: {total_equipos}")
            print(f"❌ Total errores: {total_errores}")
            print(f"📋 Hojas procesadas: {len(hojas)}")
            print("✅ Importación completada exitosamente")
            
        except Exception as e:
            print(f"❌ Error procesando Excel: {e}")
            self.conn.rollback()
    
    def limpiar_columnas(self, df):
        """
        Limpia los nombres de las columnas eliminando espacios extra
        """
        df.columns = df.columns.str.strip()  # Eliminar espacios al inicio y final
        # Mapear nombres problemáticos
        mapeo_columnas = {
            'DISCO': 'DISCO',  # En caso de que aparezca sin espacio
            'DISCO ': 'DISCO',  # Eliminar espacio al final
            ' MARCA': 'MARCA',  # Eliminar espacio al inicio
            'PROGRAMAS  ADICIONALES': 'PROGRAMAS ADICIONALES',  # Normalizar espacios dobles
        }
        df.rename(columns=mapeo_columnas, inplace=True)
        return df
    
    def generar_codigo_unico(self, codigo_base, nombre_pc):
        """
        Genera un código único cuando el código base ya existe
        """
        if not codigo_base or codigo_base.strip() == '':
            codigo_base = 'SIN-CODIGO'
        
        # Si es PERSONAL, agregamos parte del nombre del PC para hacerlo único
        if codigo_base.upper() == 'PERSONAL':
            # Tomar las primeras letras del nombre del PC
            sufijo = ''.join([c for c in nombre_pc.upper() if c.isalnum()])[:8]
            codigo_base = f"PERSONAL-{sufijo}"
        
        codigo_original = codigo_base
        contador = 1
        
        while True:
            try:
                # Verificar si el código ya existe
                self.cur.execute("SELECT id FROM inventario WHERE codigo_inventario = %s", (codigo_base,))
                if not self.cur.fetchone():
                    return codigo_base
                
                # Si existe, agregar un número
                codigo_base = f"{codigo_original}-{contador:03d}"
                contador += 1
                
                # Prevenir loops infinitos
                if contador > 999:
                    codigo_base = f"{codigo_original}-{pd.Timestamp.now().strftime('%Y%m%d%H%M%S')}"
                    break
                    
            except Exception as e:
                print(f"❌ Error verificando código: {e}")
                return f"{codigo_original}-ERROR"
        
        return codigo_base
    
    def obtener_valor_seguro(self, fila, columna, valor_defecto='Sin especificar'):
        """
        Obtiene un valor de la fila manejando valores nulos y espacios
        """
        valor = fila.get(columna, valor_defecto)
        if pd.isna(valor) or valor == '' or str(valor).strip() == '':
            return valor_defecto
        return str(valor).strip()

    def procesar_hoja(self, nombre_dependencia, df):
        """
        Procesa una hoja individual del Excel (una dependencia)
        """
        try:
            # Limpiar nombres de columnas
            df = self.limpiar_columnas(df)
            
            print(f"📋 Columnas después de limpieza: {list(df.columns)}")
            
            # Crear o obtener la dependencia
            dependencia_id = self.obtener_o_crear_catalogo('dependencia', nombre_dependencia)
            if not dependencia_id:
                print(f"❌ No se pudo crear/obtener dependencia: {nombre_dependencia}")
                return
            
            # Crear usuario por defecto si no existe
            usuario_id = self.obtener_o_crear_catalogo('usuario', 'admin')
            
            equipos_procesados = 0
            equipos_con_errores = 0
            
            # Procesar cada fila (equipo)
            for index, fila in df.iterrows():
                try:
                    # Validar datos mínimos requeridos
                    direccion_ip = self.obtener_valor_seguro(fila, 'DIRECCION IP')
                    nombre_pc = self.obtener_valor_seguro(fila, 'NOMBRE DE PC')
                    
                    if direccion_ip == 'Sin especificar' or nombre_pc == 'Sin especificar':
                        print(f"⚠️  Saltando fila {index + 1}: faltan datos mínimos (IP: {direccion_ip}, PC: {nombre_pc})")
                        equipos_con_errores += 1
                        continue
                    
                    # Mapear y obtener IDs de catálogos con valores seguros
                    direccion_area_id = self.obtener_o_crear_catalogo('direccion_area', 
                                                                     self.obtener_valor_seguro(fila, 'DIRECCION/ AREA', 'Área General'))
                    dispositivo_id = self.obtener_o_crear_catalogo('dispositivo', 
                                                                  self.obtener_valor_seguro(fila, 'DISPOSITIVO', 'PC'))
                    equipamiento_id = self.obtener_o_crear_catalogo('equipamiento', 
                                                                   self.obtener_valor_seguro(fila, 'EQUIPAMIENTO', 'Escritorio'))
                    tipo_equipo_id = self.obtener_o_crear_catalogo('tipo_equipo', 
                                                                  self.obtener_valor_seguro(fila, 'TIPO DE EQUIPO', 'PC Escritorio'))
                    tipo_so_id = self.obtener_o_crear_catalogo('tipo_sistema_operativo', 
                                                              self.obtener_valor_seguro(fila, 'TIPO DE SISTEMA OPERATIVO', 'Windows'))
                    caracteristicas_id = self.obtener_o_crear_catalogo('caracteristicas', 
                                                                      self.obtener_valor_seguro(fila, 'CARACTERISTICAS', 'Estándar'))
                    ram_id = self.obtener_o_crear_catalogo('ram', 
                                                          self.obtener_valor_seguro(fila, 'RAM', '4GB'))
                    disco_id = self.obtener_o_crear_catalogo('disco', 
                                                            self.obtener_valor_seguro(fila, 'DISCO', '500GB'))
                    office_id = self.obtener_o_crear_catalogo('office', 
                                                             self.obtener_valor_seguro(fila, 'OFFICE', 'Sin Office'))
                    marca_id = self.obtener_o_crear_catalogo('marca', 
                                                            self.obtener_valor_seguro(fila, 'MARCA', 'Genérica'))
                    tipo_conexion_id = self.obtener_o_crear_catalogo('tipo_conexion', 
                                                                    self.obtener_valor_seguro(fila, 'TIPO DE CONEXIÓN', 'Ethernet'))
                    
                    # Generar código único si es necesario
                    codigo_original = self.obtener_valor_seguro(fila, 'CODIGO INVENTARIO', '')
                    codigo_unico = self.generar_codigo_unico(codigo_original, nombre_pc)
                    
                    # Insertar en tabla inventario
                    insert_inventario = """
                        INSERT INTO inventario (
                            usuario_id, dependencia_id, direccion_area_id, dispositivo_id,
                            direccion_ip, direccion_mac, nombre_pc, nombres_funcionario,
                            equipamiento_id, tipo_equipo_id, tipo_sistema_operativo_id,
                            caracteristicas_id, ram_id, disco_id, office_id, marca_id,
                            codigo_inventario, tipo_conexion_id, anydesk, estado
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                        ) RETURNING id
                    """
                    
                    valores = (
                        usuario_id, dependencia_id, direccion_area_id, dispositivo_id,
                        direccion_ip,
                        self.obtener_valor_seguro(fila, 'DIRECCION MAC', ''),
                        nombre_pc,
                        self.obtener_valor_seguro(fila, 'NOMBRE DEL FUNCIONARIO', ''),
                        equipamiento_id, tipo_equipo_id, tipo_so_id,
                        caracteristicas_id, ram_id, disco_id, office_id, marca_id,
                        codigo_unico,  # Usar el código único generado
                        tipo_conexion_id,
                        self.obtener_valor_seguro(fila, 'DIRECCION ANY DESK', None) if self.obtener_valor_seguro(fila, 'DIRECCION ANY DESK', '') != '' else None,
                        'ACTIVO'  # Estado por defecto
                    )
                    
                    self.cur.execute(insert_inventario, valores)
                    inventario_id = self.cur.fetchone()['id']
                    
                    # Procesar programas adicionales
                    programas_ids = self.procesar_programas_adicionales(self.obtener_valor_seguro(fila, 'PROGRAMAS ADICIONALES', ''))
                    for programa_id in programas_ids:
                        insert_programa = """
                            INSERT INTO inventario_programa (inventario_id, programa_id) 
                            VALUES (%s, %s) ON CONFLICT DO NOTHING
                        """
                        self.cur.execute(insert_programa, (inventario_id, programa_id))
                    
                    # Confirmar cada equipo individualmente
                    self.conn.commit()
                    equipos_procesados += 1
                    
                    if equipos_procesados % 10 == 0:
                        print(f"📈 Procesados {equipos_procesados} equipos...")
                    
                except Exception as e:
                    print(f"❌ Error procesando fila {index + 1} (PC: {nombre_pc}): {e}")
                    self.conn.rollback()  # Hacer rollback solo de este equipo
                    equipos_con_errores += 1
                    continue
            
            # No hacer commit general aquí ya que cada equipo hace su propio commit
            print(f"✅ Dependencia '{nombre_dependencia}': {equipos_procesados} equipos procesados, {equipos_con_errores} errores")
            
            return equipos_procesados, equipos_con_errores
            
        except Exception as e:
            print(f"❌ Error procesando dependencia {nombre_dependencia}: {e}")
            self.conn.rollback()
            return 0, 1  # 0 equipos procesados, 1 error

def main():
    """Función principal"""
    print("🚀 IMPORTADOR DE INVENTARIO DESDE EXCEL")
    print("=" * 50)
    
    # Solicitar ruta del archivo
    if len(sys.argv) > 1:
        ruta_excel = sys.argv[1]
    else:
        ruta_excel = input("📁 Ingresa la ruta del archivo Excel: ").strip().strip('"')
    
    # Verificar que el archivo existe
    if not os.path.exists(ruta_excel):
        print(f"❌ Archivo no encontrado: {ruta_excel}")
        return
    
    # Crear importador y procesar
    importador = ImportadorExcel()
    
    try:
        if importador.conectar_bd():
            importador.importar_desde_excel(ruta_excel)
        else:
            print("❌ No se pudo conectar a la base de datos")
    
    except KeyboardInterrupt:
        print("\n🛑 Importación cancelada por el usuario")
    
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
    
    finally:
        importador.cerrar_conexion()

if __name__ == "__main__":
    main()