
"""
Archivo principal de la aplicación para el sistema de inventario.
Aquí se inicializa la app y se registran los blueprints de cada módulo.
"""

from flask import Flask
from Rutas.dependencias_routes import dependencias_bp
from Rutas.marcas_routes import devices_brands_bp
from Rutas.equipos_routes import equipos_routes_bp

def create_app():
    app = Flask(__name__)
    # Registrar blueprints
    app.register_blueprint(dependencias_bp)
    app.register_blueprint(devices_brands_bp)
    app.register_blueprint(equipos_routes_bp)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
