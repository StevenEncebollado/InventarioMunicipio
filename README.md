
# 🏛️ Sistema de Inventario Municipal

Sistema integral para la gestión de inventario de equipos tecnológicos del Municipio de Manta. Incluye autenticación avanzada, reportes, interfaz moderna y arquitectura escalable.

---

## 📖 Tutorial de Instalación y Uso

### 1. Clonar el Repositorio
```sh
git clone <repository-url>
cd "Pasantías en munipio de Manta"
```

### 2. Configurar la Base de Datos
- Crear una base de datos PostgreSQL llamada `Inventario`.
- Ejecutar el script `SQL/Inventario.sql` para crear las tablas y datos iniciales.
- Configurar las credenciales en `backend/.env`.

### 3. Backend (Flask)
Ubicación: `backend`
```sh
cd backend
python -m venv venv
venv\Scripts\activate   # En Windows
pip install flask psycopg2-binary python-dotenv bcrypt
```

#### Ejecutar Backend
```sh
python app.py
```

### 4. Frontend (Next.js)
Ubicación: `frontend`
```sh
cd ../frontend
npm install
```

#### Instalar íconos (obligatorio para la UI)
```sh
npm install react-icons
```

#### Ejecutar Frontend
```sh
npm run dev
```

### 5. Proxy (Python)
Ubicación: raíz del proyecto
```sh
cd ..
python proxy_server.py
```

---

## 🚀 Arquitectura del Sistema

```
Frontend (Next.js) ← → Proxy (Python) ← → Backend (Flask) ← → PostgreSQL
    :3001                    :8081               :5000
```


## 🌐 URLs del Sistema

## 🌐 URLs del Sistema

- **Frontend:** http://localhost:3001
- **Proxy:** http://localhost:8081  
- **Backend:** http://localhost:5000
- **Usuarios (API):** http://localhost:5000/usuarios

## 🔗 Pruebas de API (Postman)
- **Registro de usuario (API):** http://localhost:5000/usuarios/register
- **Login (API):** http://localhost:5000/login
- **Reset password (API):** http://localhost:5000/usuarios/<id>/reset_password

## 👤 Credenciales de Prueba

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


## ✨ Características Destacadas

- 🔒 Autenticación y registro de usuarios
- 🔑 Validación de contraseña fuerte (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo especial)
- ⏰ Expiración de contraseña cada 3 meses y aviso automático
- 🗃️ Gestión completa de inventario de equipos
- 📚 Catálogos dinámicos y editables
- 👤 Validación de usuario único
- 🛑 Mensajes de error detallados en frontend y backend
- 📊 Sistema de reportes y estadísticas
- 📱 Interfaz responsive y moderna
- 🌐 CORS resuelto mediante proxy
- 🎨 UI con íconos animados y badges (requiere react-icons)

---


## 🔧 Tecnologías Utilizadas

- **Backend:** Flask, PostgreSQL, Python 3.8+
- **Frontend:** Next.js, TypeScript
- **Proxy:** HTTP Server nativo de Python
- **Base de Datos:** PostgreSQL


---
*Desarrollado para el Municipio de Manta*
