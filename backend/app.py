
"""
Archivo principal de la aplicación para el sistema de inventario.
Aquí se inicializa la app y se registran los blueprints de cada módulo.
"""

from flask import Flask
from .catalogos.dependencias_routes import dependencias_bp
from .catalogos.direcciones_routes import direcciones_bp
from .catalogos.disco_routes import disco_bp
from .catalogos.dispositivos_routes import dispositivos_bp
from .catalogos.equipamientos_routes import equipamientos_bp
from .catalogos.marca_routes import marca_bp
from .catalogos.office_routes import office_bp
from .catalogos.programa_adicional_routes import programa_adicional_bp
from .catalogos.ram_routes import ram_bp
from .catalogos.tipo_conexion_routes import tipo_conexion_bp
from .catalogos.tipo_equipo_routes import tipo_equipo_bp
from .catalogos.tipo_sistema_operativo_routes import tipo_so_bp
from .catalogos.caracteristicas_routes import caracteristicas_bp
from .inventario.inventario_programa_routes import inventario_programa_bp
from .usuarios.usuarios_routes import usuarios_bp

def create_app():
    app = Flask(__name__)
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
    app.register_blueprint(inventario_programa_bp)
    app.register_blueprint(usuarios_bp)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
