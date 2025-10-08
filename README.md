
# 🏛️ Sistema de Inventario Municipal

Sistema integral para la gestión de inventario de equipos tecnológicos del Municipio de Manta. Incluye autenticación avanzada, reportes, interfaz moderna y arquitectura escalable.

## 📦 Instalación y Configuración desde ZIP

Sigue estos pasos para instalar y ejecutar el sistema desde un archivo ZIP:

### 1. Extraer el Proyecto
Descomprime el archivo ZIP en la ubicación de tu preferencia.

### 2. Configurar la Base de Datos
1. Instala PostgreSQL si no lo tienes.
2. Abre tu gestor de base de datos (ejemplo: pgAdmin, DBeaver, etc.).
3. Crea una base de datos llamada `Inventario`.
4. Ejecuta el backup brindado en el zip para crear las tablas y datos iniciales.
5. **Importante:** Cuando agregues la base de datos a tu gestor, debes poner tu contraseña en el archivo `backend/config.py` exactamente aquí:

```python
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:TU_CONTRASEÑA@localhost:5432/Inventario')
```

Reemplaza `TU_CONTRASEÑA` por la contraseña de tu usuario de PostgreSQL.

### 3. Instalar Dependencias del Backend (Flask)
Ubicación: `backend`

1. Abre una terminal y navega a la carpeta backend:
    ```sh
    cd backend
    ```
2. (Opcional pero recomendado) Crea y activa un entorno virtual:
    ```sh
    python -m venv venv
    .\venv\Scripts\activate   # En Windows
    ```
3. Instala las dependencias necesarias:
    ```sh
    pip install -r ../requirements_excel.txt
    pip install flask psycopg2-binary python-dotenv bcrypt
    ```

### 4. Instalar Dependencias del Frontend (Next.js)
Ubicación: `frontend`

1. Abre una terminal y navega a la carpeta frontend:
    ```sh
    cd ../frontend
    ```
2. Instala las dependencias de Node.js:
    ```sh
    npm install
    npm install bootstrap
    npm install react-icons
    ```

### 5. Ejecutar el Sistema

#### 5.1. Ejecutar el Backend
Desde la carpeta `backend`:
```sh
python app.py
```

#### 5.2. Ejecutar el Frontend
Desde la carpeta `frontend`:
```sh
npm run dev
```

#### 5.3. Ejecutar el Proxy
Desde la raíz del proyecto:
```sh
python proxy_server.py
```

---

## 🚀 Arquitectura del Sistema

```
Frontend (Next.js) ← → Proxy (Python) ← → Backend (Flask) ← → PostgreSQL
    :3001                    :8081               :5000
```



## 🌐 URLs del Sistema

- **Frontend:** http://localhost:3001
- **Proxy:** http://localhost:8081  
- **Backend:** http://localhost:5000
- **Usuarios (API):** http://localhost:5000/usuarios


## 🔗 Pruebas de API (Postman)
- **Registro de usuario (API):** http://localhost:5000/usuarios/register
- **Login (API):** http://localhost:5000/login


## 👤 Credenciales de Prueba

- **Usuario:** ` MUNICIPIO `
- **Contraseña:** ` 123456As. `

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
