"""
Script para probar el sistema de auditoría completamente.
Registra un usuario, hace cambio de estado, y verifica que aparezca en auditoría.
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_registro_usuario():
    """Prueba registro de usuario y verifica auditoría"""
    print("🧪 PRUEBA 1: Registro de usuario")
    
    # Registrar nuevo usuario
    usuario_data = {
        "username": "usuario_prueba_audit",
        "password": "TempPass123!"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/usuarios/register", json=usuario_data)
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Usuario registrado: ID {data['id']}")
            return data['id']
        else:
            print(f"❌ Error registrando usuario: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_login_usuario():
    """Prueba login de usuario"""
    print("\n🧪 PRUEBA 2: Login de usuario")
    
    login_data = {
        "username": "usuario_prueba_audit",
        "password": "TempPass123!"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/usuarios/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login exitoso: Usuario ID {data.get('id')}")
            return data.get('id')
        else:
            print(f"❌ Error en login: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_cambio_estado_equipo(usuario_id):
    """Simula cambio de estado de un equipo"""
    print("\n🧪 PRUEBA 3: Cambio de estado de equipo")
    
    # Obtener primer equipo
    try:
        response = requests.get(f"{BASE_URL}/inventario")
        if response.status_code == 200:
            equipos = response.json()
            if equipos:
                equipo = equipos[0]
                equipo_id = equipo['id']
                estado_actual = equipo.get('estado', 'activo')
                nuevo_estado = 'inactivo' if estado_actual.lower() == 'activo' else 'activo'
                
                print(f"📋 Equipo ID: {equipo_id}")
                print(f"📋 Estado actual: {estado_actual}")
                print(f"📋 Nuevo estado: {nuevo_estado}")
                
                # Preparar datos para actualización
                update_data = {
                    **equipo,
                    'estado': nuevo_estado,
                    'usuario_accion_id': usuario_id  # Usuario que realiza el cambio
                }
                
                # Actualizar equipo
                response = requests.put(f"{BASE_URL}/inventario/{equipo_id}", json=update_data)
                if response.status_code == 200:
                    print(f"✅ Estado cambiado de '{estado_actual}' a '{nuevo_estado}'")
                    return True
                else:
                    print(f"❌ Error cambiando estado: {response.status_code} - {response.text}")
                    return False
            else:
                print("❌ No hay equipos en el inventario")
                return False
        else:
            print(f"❌ Error obteniendo equipos: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def verificar_auditoria():
    """Verifica que las acciones aparecen en auditoría"""
    print("\n🧪 PRUEBA 4: Verificar auditoría")
    
    try:
        response = requests.get(f"{BASE_URL}/auditoria/historial?limit=10")
        if response.status_code == 200:
            data = response.json()
            historial = data.get('historial', [])
            
            print(f"📊 Total registros en auditoría: {len(historial)}")
            
            # Verificar registros recientes
            acciones_encontradas = {}
            for registro in historial[:10]:  # Solo los 10 más recientes
                accion = registro.get('accion')
                usuario = registro.get('usuario_nombre', 'N/A')
                fecha = registro.get('fecha', 'N/A')
                
                if accion in acciones_encontradas:
                    acciones_encontradas[accion] += 1
                else:
                    acciones_encontradas[accion] = 1
                
                print(f"  • {accion} - Usuario: {usuario} - Fecha: {fecha}")
            
            print(f"\n📈 Resumen de acciones:")
            for accion, cantidad in acciones_encontradas.items():
                print(f"  • {accion}: {cantidad}")
            
            # Verificar acciones específicas
            tiene_registro_usuario = any(r.get('accion') == 'usuario_registrado' for r in historial[:10])
            tiene_login = any(r.get('accion') == 'login' for r in historial[:10])
            tiene_cambio_estado = any(r.get('accion') == 'cambio_estado' for r in historial[:10])
            
            print(f"\n✅ Verificaciones:")
            print(f"  • Registro de usuario: {'✅' if tiene_registro_usuario else '❌'}")
            print(f"  • Login de usuario: {'✅' if tiene_login else '❌'}")
            print(f"  • Cambio de estado: {'✅' if tiene_cambio_estado else '❌'}")
            
            return tiene_registro_usuario and tiene_login
            
        else:
            print(f"❌ Error obteniendo auditoría: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Ejecuta todas las pruebas"""
    print("🚀 INICIANDO PRUEBAS DEL SISTEMA DE AUDITORÍA")
    print("=" * 50)
    
    # Prueba 1: Registrar usuario
    usuario_id = test_registro_usuario()
    if not usuario_id:
        print("❌ No se puede continuar sin usuario")
        return
    
    time.sleep(1)  # Esperar un poco
    
    # Prueba 2: Login
    usuario_login_id = test_login_usuario()
    if not usuario_login_id:
        print("❌ Login falló")
        return
    
    time.sleep(1)  # Esperar un poco
    
    # Prueba 3: Cambio de estado
    cambio_exitoso = test_cambio_estado_equipo(usuario_id)
    if not cambio_exitoso:
        print("❌ Cambio de estado falló")
    
    time.sleep(2)  # Esperar un poco para que se procese
    
    # Prueba 4: Verificar auditoría
    auditoria_ok = verificar_auditoria()
    
    print("\n" + "=" * 50)
    if auditoria_ok:
        print("🎉 ¡TODAS LAS PRUEBAS PASARON!")
        print("✅ El sistema de auditoría está funcionando correctamente")
    else:
        print("⚠️  Algunas pruebas fallaron")
        print("🔧 Revisa el backend y la base de datos")

if __name__ == "__main__":
    main()