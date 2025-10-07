"""
Script para importar el nuevo archivo Excel con estructura simplificada
Campos: NOMBRE DE PC, NOMBRE DEL FUNCIONARIO, DIRECCION/AREA, MARCA, CODIGO INVENTARIO, DISPOSITIVO
"""

import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
import sys

# Cargar variables de entorno
load_dotenv()

class ImportadorExcelSimplificado:
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
            
            print(f"➕ Creado nuevo {tabla}: {nombre} (ID: {nuevo_id})")
            return nuevo_id
            
        except Exception as e:
            print(f"❌ Error con catálogo {tabla}: {e}")
            self.conn.rollback()
            return None
    
    def limpiar_columnas(self, df):
        """
        Limpia los nombres de las columnas eliminando espacios extra
        """
        df.columns = df.columns.str.strip()
        # Mapear nombres problemáticos específicos para el nuevo formato
        mapeo_columnas = {
            ' MARCA': 'MARCA',  # Eliminar espacio al inicio si existe
            'CODIGO INVENTARIO ': 'CODIGO INVENTARIO',  # Eliminar espacio al final
        }
        df.rename(columns=mapeo_columnas, inplace=True)
        return df
    
    def obtener_valor_seguro(self, fila, columna, valor_defecto='Sin especificar'):
        """
        Obtiene un valor de la fila manejando valores nulos y espacios
        """
        valor = fila.get(columna, valor_defecto)
        if pd.isna(valor) or valor == '' or str(valor).strip() == '':
            return valor_defecto
        return str(valor).strip()
    
    def generar_codigo_unico(self, codigo_base, nombre_pc):
        """
        Genera un código único cuando el código base ya existe
        """
        if not codigo_base or codigo_base.strip() == '':
            codigo_base = 'SIN-CODIGO'
        
        # Si es PERSONAL, agregamos parte del nombre del PC para hacerlo único
        if codigo_base.upper() == 'PERSONAL':
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
    
    def procesar_hoja(self, nombre_dependencia, df):
        """
        Procesa una hoja individual del Excel con el formato simplificado
        """
        try:
            # Limpiar nombres de columnas
            df = self.limpiar_columnas(df)
            
            print(f"📋 Columnas detectadas: {list(df.columns)}")
            
            # Verificar que tiene las columnas esperadas
            columnas_esperadas = ['NOMBRE DE PC', 'NOMBRE DEL FUNCIONARIO', 'DIRECCION/ AREA', 'MARCA', 'CODIGO INVENTARIO', 'DISPOSITIVO']
            columnas_faltantes = [col for col in columnas_esperadas if col not in df.columns]
            
            if columnas_faltantes:
                print(f"⚠️  Columnas faltantes: {columnas_faltantes}")
                print("📋 Intentando mapear columnas similares...")
                
                # Mapear columnas con nombres similares
                mapeo_alternativo = {}
                for col_esperada in columnas_faltantes:
                    for col_actual in df.columns:
                        if col_esperada.lower().replace('/', '').replace(' ', '') in col_actual.lower().replace('/', '').replace(' ', ''):
                            mapeo_alternativo[col_actual] = col_esperada
                            break
                
                if mapeo_alternativo:
                    df.rename(columns=mapeo_alternativo, inplace=True)
                    print(f"✅ Columnas remapeadas: {mapeo_alternativo}")
            
            # Crear o obtener la dependencia
            dependencia_id = self.obtener_o_crear_catalogo('dependencia', nombre_dependencia)
            if not dependencia_id:
                print(f"❌ No se pudo crear/obtener dependencia: {nombre_dependencia}")
                return 0, 1
            
            # Crear usuario por defecto si no existe
            usuario_id = self.obtener_o_crear_catalogo('usuario', 'admin', 'username')
            
            equipos_procesados = 0
            equipos_con_errores = 0
            
            # Procesar cada fila (equipo)
            for index, fila in df.iterrows():
                try:
                    # Validar datos mínimos requeridos
                    nombre_pc = self.obtener_valor_seguro(fila, 'NOMBRE DE PC')
                    
                    if nombre_pc == 'Sin especificar':
                        print(f"⚠️  Saltando fila {index + 1}: falta nombre de PC")
                        equipos_con_errores += 1
                        continue
                    
                    # Obtener o crear IDs de catálogos SOLO para campos disponibles en el Excel
                    direccion_area_id = self.obtener_o_crear_catalogo('direccion_area', 
                                                                     self.obtener_valor_seguro(fila, 'DIRECCION/ AREA', 'Área General'))
                    dispositivo_id = self.obtener_o_crear_catalogo('dispositivo', 
                                                                  self.obtener_valor_seguro(fila, 'DISPOSITIVO', 'PC'))
                    marca_id = self.obtener_o_crear_catalogo('marca', 
                                                            self.obtener_valor_seguro(fila, 'MARCA', 'Genérica'))
                    
                    # Generar código único si es necesario
                    codigo_original = self.obtener_valor_seguro(fila, 'CODIGO INVENTARIO', '')
                    codigo_unico = self.generar_codigo_unico(codigo_original, nombre_pc)
                    
                    # Insertar en tabla inventario - SOLO campos mínimos requeridos + disponibles en Excel
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
                        None,  # direccion_ip - NULL porque no está en el Excel
                        None,  # direccion_mac - NULL porque no está en el Excel
                        nombre_pc,
                        self.obtener_valor_seguro(fila, 'NOMBRE DEL FUNCIONARIO', ''),
                        None,  # equipamiento_id - NULL porque no está en el Excel
                        None,  # tipo_equipo_id - NULL porque no está en el Excel
                        None,  # tipo_sistema_operativo_id - NULL porque no está en el Excel
                        None,  # caracteristicas_id - NULL porque no está en el Excel
                        None,  # ram_id - NULL porque no está en el Excel
                        None,  # disco_id - NULL porque no está en el Excel
                        None,  # office_id - NULL porque no está en el Excel
                        marca_id,
                        codigo_unico,
                        None,  # tipo_conexion_id - NULL porque no está en el Excel
                        None,  # anydesk - NULL porque no está en el Excel
                        'Activo'  # Estado por defecto
                    )
                    
                    self.cur.execute(insert_inventario, valores)
                    inventario_id = self.cur.fetchone()['id']
                    
                    # Confirmar cada equipo individualmente
                    self.conn.commit()
                    equipos_procesados += 1
                    
                    if equipos_procesados % 10 == 0:
                        print(f"📈 Procesados {equipos_procesados} equipos...")
                    
                except Exception as e:
                    print(f"❌ Error procesando fila {index + 1} (PC: {nombre_pc}): {e}")
                    self.conn.rollback()
                    equipos_con_errores += 1
                    continue
            
            print(f"✅ Dependencia '{nombre_dependencia}': {equipos_procesados} equipos procesados, {equipos_con_errores} errores")
            
            return equipos_procesados, equipos_con_errores
            
        except Exception as e:
            print(f"❌ Error procesando dependencia {nombre_dependencia}: {e}")
            self.conn.rollback()
            return 0, 1
    
    def importar_desde_excel(self, ruta_excel):
        """
        Importa datos desde el archivo Excel con formato simplificado
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

def main():
    """Función principal"""
    print("🚀 IMPORTADOR DE INVENTARIO SIMPLIFICADO")
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
    importador = ImportadorExcelSimplificado()
    
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