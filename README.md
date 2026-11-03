# Goalkeeper Training App

Aplicación para la gestión integral del entrenamiento de porteros.

> **Nota del fork (Izanco7):** el módulo de Sesiones (listado, crear, detalle con tareas, editar y asistencia) ya existe con páginas, API y modelos de datos —igual que los módulos de Equipos, Porteros, Tareas, Estadísticas, Penaltis y Análisis de Partido—. Este fork añade `lib/db/seed-cimino.js`, un seed que crea el equipo "Cimino Academy" con sus 4 porteros:
>
> ```bash
> node lib/db/seed-cimino.js --email=tucorreo@ejemplo.com
> # o bien: npm run db:seed-cimino -- --email=tucorreo@ejemplo.com
> ```

## Características Implementadas

### ✅ Módulo de Login

- Sistema de autenticación completo
- Formulario de login con validación
- Recordar sesión
- Gestión de estado de autenticación

### ✅ Internacionalización (i18n)

- Soporte para Español e Inglés
- Cambio de idioma en tiempo real
- Traducciones completas para toda la interfaz

### 🚧 Módulos Futuros

- **Equipos**: Gestiona tus equipos
- **Porteros**: Administra tus porteros
- **Planificación**: Planifica entrenamientos
- **Sesiones**: Crea y gestiona sesiones
- **Tareas**: Biblioteca de tareas
- **Estadísticas**: Analiza estadísticas
- **Penaltis**: Scouting de penaltis
- **Análisis de Partido**: Análisis de acciones en partido

## Tecnologías

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **next-intl** - Internacionalización
- **React Context API** - Gestión de estado

## Comenzar

1. **Instalar dependencias:**

```bash
npm install
```

2. **Ejecutar en desarrollo:**

```bash
npm run dev
```

3. **Abrir en el navegador:**

```
http://localhost:3000
```

La aplicación redirigirá automáticamente a `/es/login` (español) o puedes acceder a `/en/login` (inglés).

## Credenciales de Prueba

Por ahora, el sistema acepta cualquier email y contraseña para demostración. En producción, esto se conectará a una API real de autenticación.

## Estructura del Proyecto

```
goalkeeper-training-app/
├── app/
│   ├── [locale]/           # Rutas internacionalizadas
│   │   ├── login/          # Página de login
│   │   ├── dashboard/      # Dashboard principal
│   │   └── layout.tsx      # Layout con providers
├── components/
│   ├── ui/                 # Componentes UI reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── LanguageSwitcher.tsx
├── lib/
│   ├── contexts/
│   │   └── AuthContext.tsx # Contexto de autenticación
│   └── types/
│       └── auth.ts         # Tipos TypeScript
├── messages/
│   ├── es.json            # Traducciones español
│   └── en.json            # Traducciones inglés
├── i18n.ts                # Configuración i18n
└── middleware.ts          # Middleware de Next.js
```

## Características del Login

- ✅ Diseño responsive
- ✅ Validación de formularios
- ✅ Estados de carga
- ✅ Mensajes de error
- ✅ Recordar sesión (localStorage)
- ✅ Cambio de idioma ES/EN
- ✅ Redirección automática al dashboard

## Características del Dashboard

- ✅ Protección de ruta (requiere autenticación)
- ✅ Información del usuario
- ✅ Botón de cerrar sesión
- ✅ Grid de módulos disponibles
- ✅ Estadísticas rápidas
- ✅ Diseño responsive

## Próximos Pasos

1. Implementar módulo de Equipos
2. Implementar módulo de Porteros
3. Implementar módulo de Planificación
4. Implementar módulo de Sesiones
5. Implementar módulo de Tareas
6. Implementar módulo de Estadísticas
7. Implementar módulo de Penaltis
8. Implementar módulo de Análisis de Partido
9. Conectar con backend/API real
10. Implementar base de datos

## Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar producción
npm run start

# Linter
npm run lint
```
