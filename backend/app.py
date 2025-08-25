from flask import Flask, request, jsonify
import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
DATABASE = os.getenv('DATABASE_URL', 'inventario.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/inventario', methods=['POST'])
def agregar_inventario():
    data = request.json
    campos = [
        'direccion_ip', 'direccion_mac', 'nombre_pc', 'nombres_funcionario',
        'dependencia', 'direccion_area', 'dispositivo', 'equipamiento',
        'tipo_equipo', 'tipo_sistema_operativo', 'caracteristicas', 'ram',
        'disco', 'office', 'marca', 'codigo_inventario', 'tipo_conexion',
        'anydesk', 'programas_adicionales'
    ]
    valores = [data.get(campo) for campo in campos]
    conn = get_db_connection()
    conn.execute(f"""
        INSERT INTO inventario ({', '.join(campos)})
        VALUES ({', '.join(['?']*len(campos))})
    """, valores)
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Inventario agregado correctamente'}), 201

@app.route('/inventario', methods=['GET'])
def listar_inventario():
    conn = get_db_connection()
    inventario = conn.execute('SELECT * FROM inventario').fetchall()
    conn.close()
    return jsonify([dict(row) for row in inventario])

if __name__ == '__main__':
    app.run(debug=True)
