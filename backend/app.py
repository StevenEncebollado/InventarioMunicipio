
"""
Archivo principal de la aplicación para el sistema de inventario.
Aquí se inicializa la app y se registran los blueprints de cada módulo.
"""
#En readme están las instrucciones

from flask import Flask
from flask_cors import CORS
import sys
import os
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv


# Agregar el directorio padre al path para poder hacer imports relativos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Cargar variables de entorno
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

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
from backend.catalogos.catalogos_unificados_routes import catalogos_unificados_bp
from backend.inventario.inventario_programa_routes import inventario_programa_bp
from backend.inventario.inventario_routes import inventario_bp
from backend.usuarios.usuarios_routes import usuarios_bp
from backend.reportes.reportes_routes import reportes_bp


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.register_blueprint(catalogos_unificados_bp)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Configuración de logging
    log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
    log_file = os.getenv('LOG_FILE', 'backend/app.log')
    if not os.path.exists(os.path.dirname(log_file)):
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
    handler = RotatingFileHandler(log_file, maxBytes=1000000, backupCount=3)
    handler.setLevel(log_level)
    formatter = logging.Formatter('[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(log_level)

    # Registrar blueprints con prefijos para rutas coherentes
    app.register_blueprint(usuarios_bp, url_prefix='/usuarios')
    app.register_blueprint(dependencias_bp, url_prefix='/catalogos')
    app.register_blueprint(direcciones_bp, url_prefix='/catalogos')
    app.register_blueprint(disco_bp, url_prefix='/catalogos')
    app.register_blueprint(dispositivos_bp, url_prefix='/catalogos')
    app.register_blueprint(equipamientos_bp, url_prefix='/catalogos')
    app.register_blueprint(marca_bp, url_prefix='/catalogos')
    app.register_blueprint(office_bp, url_prefix='/catalogos')
    app.register_blueprint(programa_adicional_bp, url_prefix='/catalogos')
    app.register_blueprint(ram_bp, url_prefix='/catalogos')
    app.register_blueprint(tipo_conexion_bp, url_prefix='/catalogos')
    app.register_blueprint(tipo_equipo_bp, url_prefix='/catalogos')
    app.register_blueprint(tipo_so_bp, url_prefix='/catalogos')
    app.register_blueprint(caracteristicas_bp, url_prefix='/catalogos')
    app.register_blueprint(inventario_bp, url_prefix='/inventario')
    app.register_blueprint(inventario_programa_bp, url_prefix='/inventario')
    app.register_blueprint(reportes_bp, url_prefix='/reportes')
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
