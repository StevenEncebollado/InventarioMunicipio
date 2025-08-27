#!/usr/bin/env python3
"""
Servidor proxy para conectar el Frontend (Next.js) con el Backend (Flask)
del Sistema de Inventario Municipal.

Frontend: http://localhost:3001
Backend Flask: http://localhost:5000
Proxy: http://localhost:8081
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import urllib.error
import sys

class InventarioProxyHandler(BaseHTTPRequestHandler):
    """
    Clase que maneja las peticiones HTTP del proxy para el sistema de inventario.
    Reenvía todas las peticiones del frontend al backend Flask.
    """
    
    def do_OPTIONS(self):
        """
        Maneja peticiones OPTIONS (preflight CORS)
        """
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        """
        Maneja peticiones GET del frontend y las reenvía al backend Flask
        """
        self._proxy_request('GET')
    
    def do_POST(self):
        """
        Maneja peticiones POST del frontend y las reenvía al backend Flask
        """
        self._proxy_request('POST')
    
    def do_PUT(self):
        """
        Maneja peticiones PUT del frontend y las reenvía al backend Flask
        """
        self._proxy_request('PUT')
    
    def do_DELETE(self):
        """
        Maneja peticiones DELETE del frontend y las reenvía al backend Flask
        """
        self._proxy_request('DELETE')
    
    def _proxy_request(self, method):
        """
        Método genérico que reenvía cualquier petición al backend Flask
        """
        try:
            # 1. Construir la URL del backend Flask
            backend_url = f'http://localhost:5000{self.path}'
            print(f"📨 {method} {self.path} -> {backend_url}")
            
            # 2. Preparar los datos si es POST/PUT
            data = None
            if method in ['POST', 'PUT'] and 'Content-Length' in self.headers:
                content_length = int(self.headers['Content-Length'])
                data = self.rfile.read(content_length)
                print(f"📤 Datos enviados: {data.decode() if data else 'Sin datos'}")
            
            # 3. Preparar headers para el backend
            headers = {}
            if 'Content-Type' in self.headers:
                headers['Content-Type'] = self.headers['Content-Type']
            
            # 4. Crear la petición al backend
            req = urllib.request.Request(
                backend_url,
                data=data,
                headers=headers,
                method=method
            )
            
            # 5. Enviar petición al backend Flask
            with urllib.request.urlopen(req, timeout=10) as response:
                backend_response = response.read()
                backend_status = response.status
                backend_headers = dict(response.headers)
                
                print(f"📥 Respuesta del backend: Status {backend_status}")
                
                # 6. Reenviar respuesta al frontend con CORS
                self.send_response(backend_status)
                self.send_cors_headers()
                
                # Reenviar headers importantes del backend
                if 'Content-Type' in backend_headers:
                    self.send_header('Content-Type', backend_headers['Content-Type'])
                
                self.end_headers()
                self.wfile.write(backend_response)
                
        except urllib.error.HTTPError as e:
            # Manejar errores HTTP del backend (400, 404, 500, etc.)
            print(f"❌ Error HTTP del backend: {e.code} - {e.reason}")
            
            # Leer el mensaje de error del backend
            try:
                error_body = e.read()
                print(f"📥 Error del backend: {error_body.decode()}")
            except:
                error_body = json.dumps({"error": f"Error {e.code}: {e.reason}"}).encode()
            
            self.send_response(e.code)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(error_body)
            
        except urllib.error.URLError as e:
            # Error de conexión al backend
            print(f"❌ No se puede conectar al backend: {e}")
            self.send_response(503)  # Service Unavailable
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = json.dumps({
                "error": "Backend no disponible",
                "detail": str(e)
            }).encode()
            self.wfile.write(error_response)
            
        except Exception as e:
            # Error general del proxy
            print(f"❌ Error del proxy: {e}")
            self.send_response(500)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = json.dumps({
                "error": "Error interno del proxy",
                "detail": str(e)
            }).encode()
            self.wfile.write(error_response)
    
    def send_cors_headers(self):
        """
        Agrega los headers CORS necesarios para permitir peticiones desde el frontend
        """
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    def log_message(self, format, *args):
        """
        Personalizar los logs del servidor
        """
        return  # Silenciar logs por defecto, usamos nuestros prints

if __name__ == '__main__':
    # Configuración del servidor proxy
    PROXY_HOST = 'localhost'
    PROXY_PORT = 8081
    BACKEND_HOST = 'localhost'
    BACKEND_PORT = 5000
    FRONTEND_PORT = 3001
    
    print("=" * 60)
    print("🚀 SERVIDOR PROXY PARA SISTEMA DE INVENTARIO MUNICIPAL")
    print("=" * 60)
    print(f"📡 Proxy ejecutándose en: http://{PROXY_HOST}:{PROXY_PORT}")
    print(f"🎨 Frontend (Next.js): http://localhost:{FRONTEND_PORT}")
    print(f"🔧 Backend (Flask): http://{BACKEND_HOST}:{BACKEND_PORT}")
    print("=" * 60)
    print("🔗 Flujo: Frontend → Proxy → Backend Flask")
    print("📋 Endpoints disponibles:")
    print("   • /usuarios (GET, POST)")
    print("   • /login (POST)")
    print("   • /dispositivos, /dependencias, etc. (GET, POST)")
    print("=" * 60)
    
    try:
        server = HTTPServer((PROXY_HOST, PROXY_PORT), InventarioProxyHandler)
        print("✅ Servidor proxy iniciado correctamente")
        print("💡 Para detener el servidor: Ctrl+C")
        print("-" * 60)
        
        # El servidor queda esperando peticiones
        server.serve_forever()
        
    except KeyboardInterrupt:
        print("\n" + "=" * 60)
        print("🛑 Deteniendo servidor proxy...")
        server.server_close()
        print("✅ Servidor proxy detenido correctamente")
        print("=" * 60)
    except Exception as e:
        print(f"❌ Error al iniciar el servidor proxy: {e}")
        sys.exit(1)
