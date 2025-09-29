"""
Script de prueba para verificar que los endpoints de auditoría funcionan correctamente.
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:5000"
AUDITORIA_URL = f"{BASE_URL}/auditoria"

def test_endpoints():
    """Prueba todos los endpoints de auditoría"""
    print("🧪 Probando endpoints de auditoría...")
    
    # 1. Probar historial de auditoría
    print("\n1. Probando historial de auditoría...")
    try:
        response = requests.get(f"{AUDITORIA_URL}/historial?page=1&limit=10")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Historial: {len(data.get('historial', []))} registros encontrados")
        else:
            print(f"   ❌ Error en historial: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error en historial: {e}")
    
    # 2. Probar estadísticas
    print("\n2. Probando estadísticas...")
    try:
        response = requests.get(f"{AUDITORIA_URL}/estadisticas")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Estadísticas obtenidas correctamente")
        else:
            print(f"   ❌ Error en estadísticas: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error en estadísticas: {e}")
    
    # 3. Probar logs
    print("\n3. Probando logs...")
    try:
        response = requests.get(f"{AUDITORIA_URL}/logs?page=1&limit=10")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Logs: {len(data.get('logs', []))} registros encontrados")
        else:
            print(f"   ❌ Error en logs: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error en logs: {e}")
    
    # 4. Probar reportes
    print("\n4. Probando reportes...")
    
    # 4.1 Inventario General
    try:
        response = requests.get(f"{AUDITORIA_URL}/reportes/inventario_general?usuario_id=1")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Reporte Inventario General: {data.get('total', 0)} equipos")
        else:
            print(f"   ❌ Error en inventario general: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"   ❌ Error en inventario general: {e}")
    
    # 4.2 Equipos Modificados
    try:
        response = requests.get(f"{AUDITORIA_URL}/reportes/equipos_modificados?usuario_id=1&dias_atras=30")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Reporte Equipos Modificados: {data.get('total_equipos_modificados', 0)} equipos")
        else:
            print(f"   ❌ Error en equipos modificados: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"   ❌ Error en equipos modificados: {e}")
    
    # 4.3 Estadísticas Avanzadas
    try:
        response = requests.get(f"{AUDITORIA_URL}/reportes/estadisticas_avanzadas?usuario_id=1")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Reporte Estadísticas Avanzadas: {data.get('total_equipos', 0)} equipos totales")
        else:
            print(f"   ❌ Error en estadísticas avanzadas: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"   ❌ Error en estadísticas avanzadas: {e}")
    
    print("\n🎉 Pruebas completadas!")

if __name__ == "__main__":
    test_endpoints()