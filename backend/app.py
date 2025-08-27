
"""
Archivo principal de la aplicación para el sistema de inventario.
Aquí se inicializa la app y se registran los blueprints de cada módulo.
"""

from flask import Flask
# from flask_cors import CORS  # Comentado temporalmente
import sys
import os

# Agregar el directorio padre al path para poder hacer imports relativos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.catalogos.dependencias_routes import dependencias_bp
from backend.catalogos.direcciones_routes import direcciones_bp
from backend.catalogos.disco_routes import disco_bp
from backend.catalogos.dispositivos_routes import dispositivos_bp
from backend.catalogos.equipamientos_routes import equipamientos_bp
from backend.catalogos.marca_routes import marca_bp
from backend.catalogos.office_routes import office_bp
from backend.catalogos.programa_adicional_routes import programa_adicional_bp
from backend.catalogos.ram_routes import ram_bp
from backend.catalogos.tipo_conexion_routes import tipo_conexion_bp
from backend.catalogos.tipo_equipo_routes import tipo_equipo_bp
from backend.catalogos.tipo_sistema_operativo_routes import tipo_so_bp
from backend.catalogos.caracteristicas_routes import caracteristicas_bp
from backend.inventario.inventario_programa_routes import inventario_programa_bp
from backend.inventario.inventario_routes import inventario_bp
from backend.usuarios.usuarios_routes import usuarios_bp

def create_app():
    app = Flask(__name__)
    
    # Habilitamos CORS de manera manual y simple para desarrollo
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    # Registrar blueprints
    app.register_blueprint(dependencias_bp)
    app.register_blueprint(direcciones_bp)
    app.register_blueprint(disco_bp)
    app.register_blueprint(dispositivos_bp)
    app.register_blueprint(equipamientos_bp)
    app.register_blueprint(marca_bp)
    app.register_blueprint(office_bp)
    app.register_blueprint(programa_adicional_bp)
    app.register_blueprint(ram_bp)
    app.register_blueprint(tipo_conexion_bp)
    app.register_blueprint(tipo_equipo_bp)
    app.register_blueprint(tipo_so_bp)
    app.register_blueprint(caracteristicas_bp)
    app.register_blueprint(inventario_bp)
    app.register_blueprint(inventario_programa_bp)
    app.register_blueprint(usuarios_bp)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
