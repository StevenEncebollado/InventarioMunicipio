# 📦 Inventario Municipio - Frontend

Sistema de gestión de inventario municipal desarrollado con **Next.js 15** y **TypeScript**.

## 🚀 Tecnologías

- **Next.js 15** - Framework de React con App Router
- **TypeScript** - Tipado estático para mejor desarrollo
- **React 18** - Biblioteca de interfaz de usuario
- **CSS Modules** - Estilos organizados y modulares

## 📋 Características

- ✅ **Autenticación segura** con middleware
- ✅ **Dashboard interactivo** con estadísticas
- ✅ **Gestión de equipos** (CRUD completo)
- ✅ **Tipado completo** con TypeScript
- ✅ **Responsive design** para móviles
- ✅ **Manejo de errores** robusto
- ✅ **Carga optimizada** con lazy loading

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Linter de código
npm run type-check   # Verificar tipos TypeScript
```

## 🏗️ Estructura del Proyecto

```
frontend/
├── app/                 # App Router de Next.js
│   ├── dashboard/      # Panel de control
│   ├── globals.css     # Estilos globales
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página de login
├── components/         # Componentes reutilizables
├── lib/               # Utilidades y API
├── types/             # Definiciones de TypeScript
├── middleware.ts      # Middleware de autenticación
└── package.json
```

## 🔧 Configuración

### Variables de Entorno

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Inventario Municipio
NEXT_PUBLIC_SESSION_TIMEOUT=30
```

## 🎯 Funcionalidades Principales

### Autenticación
- Login seguro con validación
- Middleware para proteger rutas
- Manejo de sesiones

### Dashboard
- Estadísticas en tiempo real
- Tabla de equipos paginada
- Estados visuales (badges)
- Acciones rápidas

### Gestión de Equipos
- Formularios con validación TypeScript
- CRUD completo con API tipada
- Filtros y búsquedas
- Historial de cambios

## 📊 API Integration

```typescript
// Ejemplo de uso de la API tipada
import { getEquipos, createEquipo } from '@/lib/api';
import type { Equipo, EquipoFormData } from '@/types';

// Obtener equipos con filtros
const equipos: Equipo[] = await getEquipos({
  estado: 'Activo',
  tipo_equipo: 'Laptop'
});

// Crear nuevo equipo
const nuevoEquipo: EquipoFormData = {
  numero_serie: 'ABC123',
  marca: 'Dell',
  tipo_equipo: 'Laptop',
  estado: 'Activo'
};

await createEquipo(nuevoEquipo);
```

## 🔒 Seguridad

- **Validación de tipos** en tiempo de compilación
- **Middleware de autenticación** en rutas protegidas
- **Sanitización de datos** en formularios
- **Manejo de errores** centralizado

## 📱 Responsive Design

El sistema está optimizado para:
- 📱 Móviles (320px+)
- 📟 Tablets (768px+)  
- 💻 Desktop (1024px+)
- 🖥️ Pantallas grandes (1200px+)

## 🐛 Debugging

```bash
# Verificar tipos
npm run type-check

# Linting completo
npm run lint

# Build de prueba
npm run build
```

## 📈 Performance

- **Tree shaking** automático
- **Code splitting** por rutas
- **Optimización de imágenes** con Next.js
- **Caching estratégico** en API calls

## 🤝 Contribución

1. Fork del proyecto
2. Crear branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Proyecto municipal - Uso interno únicamente.

---

**Desarrollado con ❤️ para la gestión municipal**
