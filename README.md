# 🏛️ Sistema de Inventario Municipal

Sistema completo de gestión de inventario para equipos tecnológicos del municipio, desarrollado con Flask (backend) y Next.js (frontend).

## 🚀 Arquitectura del Sistema

```
Frontend (Next.js) ← → Proxy (Python) ← → Backend (Flask) ← → PostgreSQL
    :3001                    :8081               :5000
```

## ⚡ Inicio Rápido

### 1. **Clonar el Repositorio**
```bash
git clone <repository-url>
cd "Pasantías en munipio de Manta"
```

### 2. **Configurar Base de Datos**
- Crear base de datos PostgreSQL llamada `Inventario`
- Ejecutar scripts SQL en `SQL/Inventario.sql`
- Configurar credenciales en `backend/.env`

### 3. **Configurar entorno virtual (venv) para el backend**

> Recomendado para aislar dependencias de Python

```powershell
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual en Windows
venv\Scripts\activate

# Instalar dependencias necesarias
pip install flask psycopg2-binary python-dotenv bcrypt
```

### 3.2. **Ejecutar Backend (Flask)**
``` 
powershell
cd backend
python app.py
```

### 4. **Ejecutar Frontend (Next.js)**
```bash
cd frontend
npm install
npm run dev
```

### 5. **Ejecutar Proxy**
```bash
python proxy_server.py
```

## 🌐 URLs del Sistema

- **Frontend:** http://localhost:3001
- **Proxy:** http://localhost:8081  
- **Backend:** http://localhost:5000
- **Usuarios (API):** http://localhost:5000/usuarios

## Pruebas de link para postman
- **Registro de usuario (API):** http://localhost:5000/usuarios/register
- **Login (API):** http://localhost:5000/login
- **Reset password (API):** http://localhost:5000/usuarios/<id>/reset_password

## 👤 Credenciales por Defecto

- **Usuario:** `Prueba 2`
- **Contraseña:** `123456As.`

## 📁 Estructura del Proyecto

```
├── backend/             # API Flask
│   ├── catalogos/       # Rutas de catálogos
│   ├── usuarios/        # Autenticación
│   ├── inventario/      # Gestión de inventario
│   └── reportes/        # Reportes y estadísticas
├── frontend/            # Interfaz Next.js
│   └── src/
│       ├── services/    # Cliente API
│       ├── types/       # Tipos TypeScript
│       └── components/  # Componentes React
├── SQL/                 # Scripts de base de datos
└── proxy_server.py      # Servidor proxy
```

## ✨ Características

✅ Autenticación y registro de usuarios
✅ Validación de contraseña fuerte (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo especial)
✅ Expiración de contraseña cada 3 meses y aviso de expiración
✅ Gestión completa de inventario
✅ Catálogos dinámicos
✅ Validación de usuario único
✅ Mensajes de error detallados en frontend y backend
✅ Sistema de reportes
✅ Interfaz responsive
✅ CORS resuelto con proxy

## 🔧 Tecnologías

- **Backend:** Flask, PostgreSQL, Python 3.8+
- **Frontend:** Next.js, TypeScript
- **Proxy:** HTTP Server nativo de Python
- **Base de Datos:** PostgreSQL

---
*Desarrollado para el Municipio de Manta*
