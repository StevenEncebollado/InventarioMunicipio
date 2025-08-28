from flask import Flask
from . import db

# Aquí se importarán y registrarán los blueprints de cada módulo

def create_app():
    app = Flask(__name__)

    # Importar y registrar blueprints aquí
    # from .routes_inventario import inventario_bp
    # app.register_blueprint(inventario_bp)

    return app
