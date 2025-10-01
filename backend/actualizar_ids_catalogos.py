import psycopg2

# Configura tu conexión
conn = psycopg2.connect(
    dbname="Inventario",
    user="postgres",
    password="05092005sC",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# Catálogos a actualizar: nombre en inventario, tabla de catálogo, campo id, campo nombre, campo id en inventario
catalogos = [
    {"inventario_campo": "dependencia", "catalogo_tabla": "dependencia", "catalogo_id": "id", "catalogo_nombre": "nombre", "inventario_id": "dependencia_id"},
    {"inventario_campo": "marca", "catalogo_tabla": "marca", "catalogo_id": "id", "catalogo_nombre": "nombre", "inventario_id": "marca_id"},
    {"inventario_campo": "tipo_equipo", "catalogo_tabla": "tipo_equipo", "catalogo_id": "id", "catalogo_nombre": "nombre", "inventario_id": "tipo_equipo_id"},
    {"inventario_campo": "direccion_area", "catalogo_tabla": "direccion_area", "catalogo_id": "id", "catalogo_nombre": "nombre", "inventario_id": "direccion_area_id"},
    # Agrega más catálogos aquí si lo necesitas
]

for cat in catalogos:
    # 1. Obtener todos los nombres e IDs del catálogo
    cur.execute(f"SELECT {cat['catalogo_id']}, {cat['catalogo_nombre']} FROM {cat['catalogo_tabla']}")
    items = {nombre.strip().upper(): id for id, nombre in cur.fetchall()}

    # 2. Buscar los equipos que tienen el nombre del catálogo
    cur.execute(f"SELECT id, {cat['inventario_campo']} FROM inventario WHERE {cat['inventario_campo']} IS NOT NULL")
    for equipo_id, nombre_item in cur.fetchall():
        if not nombre_item:
            continue
        nombre = nombre_item.strip().upper()
        item_id = items.get(nombre)
        if item_id:
            # Actualizar el campo *_id en inventario
            cur.execute(
                f"UPDATE inventario SET {cat['inventario_id']} = %s WHERE id = %s",
                (item_id, equipo_id)
            )
            print(f"Equipo {equipo_id}: {cat['inventario_id']} actualizado a {item_id}")
        else:
            print(f"Equipo {equipo_id}: '{nombre_item}' no encontrada en catálogo {cat['catalogo_tabla']}")

conn.commit()
cur.close()
conn.close()
print("Actualización terminada.")