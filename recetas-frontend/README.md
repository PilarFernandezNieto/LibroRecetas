# Libro de Recetas — Frontend

Aplicación SPA desarrollada con **Vue 3 + Vite** que consume la API REST del backend Laravel. Tiene una portada pública de recetas y un panel de administración completo protegido por autenticación.

---

## Requisitos previos

- Node.js >= 18
- npm
- Backend (`recetas-backend`) corriendo en `http://localhost:8000`

---

## Instalación y puesta en marcha

```bash
npm install
cp .env.example .env.local   # y editar con tus valores
npm run dev
```

El frontend queda disponible en **http://localhost:3000**.

### Variables de entorno (`.env.local`)

| Variable               | Descripción                          | Ejemplo                       |
| ---------------------- | ------------------------------------ | ----------------------------- |
| `VITE_APP_BACKEND_URL` | URL base de la API Laravel           | `http://localhost:8000`       |
| `VITE_APP_NAME`        | Título de la app (usado en `<title>`) | `"Libro de Recetas"`          |
| `VITE_TINYMCE_API_KEY` | Clave pública de TinyMCE             | `3mwpef...`                   |
| `CHOKIDAR_USEPOLLING`  | Fuerza polling para HMR (OneDrive)   | `true`                        |
| `CHOKIDAR_INTERVAL`    | Intervalo de polling en ms           | `300`                         |

> **Nota sobre HMR en OneDrive:** el directorio del proyecto está en OneDrive, lo que interfiere con los file watchers nativos. Tanto `CHOKIDAR_USEPOLLING=true` en `.env.local` como `watch: { usePolling: true }` en `vite.config.js` son necesarios para que el hot-reload funcione.

### Scripts disponibles

| Comando           | Descripción                                               |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo (limpia caché Vite con `--force`)  |
| `npm run build`   | Build de producción en `dist/`                            |
| `npm run preview` | Previsualización del build de producción                  |

---

## Build y despliegue en producción

El frontend se despliega en **Vercel**, en un dominio distinto al de la API (que está en un VPS). Por eso la API usa tokens Bearer y necesita CORS: el `.env` del backend debe tener `CORS_ALLOWED_ORIGINS` y `FRONTEND_URL` con la URL de Vercel. (Los datos concretos del servidor de producción están en notas privadas, no en este repo).

Vite carga las variables de entorno con esta prioridad (mayor a menor): `.env.[modo].local` > `.env.local` > `.env.[modo]` > `.env`. Por eso, si `.env.local` tiene un valor puesto, **gana sobre `.env.production`** aunque hagas build de producción — hay que tenerlo en cuenta antes de compilar para desplegar.

```bash
npm run build
```

Genera `dist/index.html` + `dist/assets/*.js|css` (nombres con hash, cambian en cada build).

### Desplegar en Vercel

1. En el proyecto de Vercel, define las variables de entorno (las `VITE_*` se incrustan en el build):
   - `VITE_APP_BACKEND_URL`: URL de la API, sin barra final.
   - `VITE_APP_NAME` y `VITE_TINYMCE_API_KEY`.
2. Vercel hace el build (`npm run build`, carpeta de salida `dist`) en cada push a la rama configurada.
3. El router usa `createWebHistory`, así que Vercel necesita reescribir todas las rutas a `index.html` (un `vercel.json` con una regla de `rewrites`); si no, recargar en una ruta como `/auth/login` da 404.

Ver [recetas-backend/README.md](../recetas-backend/README.md#despliegue-en-producción) para el despliegue de la API.

---

## Estructura del proyecto

```
src/
├── main.js                  # Punto de entrada: monta Vue, registra plugins
├── queryClient.js           # Instancia singleton de TanStack QueryClient
├── App.vue                  # Componente raíz con RouterView
│
├── router/
│   └── index.js             # Rutas y guards de navegación (auth, is_admin, guest)
│
├── layouts/
│   ├── AuthenticatedLayout.vue   # Layout con navbar para usuarios logueados
│   ├── GuestLayout.vue           # Layout público (portada, ficha receta)
│   └── AuthLayout.vue            # Layout de formularios de auth (login, registro)
│
├── stores/                  # Estado global con Pinia
│   ├── auth.js              # Usuario autenticado, login, logout
│   ├── recetaStore.js       # CRUD de recetas, búsqueda paginada
│   ├── ingredienteStore.js  # CRUD de ingredientes, paginación
│   ├── categoriaStore.js    # CRUD de categorías
│   ├── usuarioStore.js      # Gestión de usuarios (solo admin)
│   └── toastStore.js        # Notificaciones toast globales
│
├── composables/
│   ├── useQueries.js        # Queries TanStack Query para datos estáticos
│   └── useImagen.js         # getImagen(): construye la URL pública de una imagen
│
├── utils/
│   └── axios.js             # Instancia Axios configurada (baseURL, token Bearer, timeout)
│
├── components/              # Componentes reutilizables
│   ├── Receta.vue           # Tarjeta de receta (panel admin)
│   ├── RecetaPortada.vue    # Tarjeta de receta (portada pública)
│   ├── RecetasForm.vue      # Formulario compartido crear/editar receta
│   ├── IngredienteForm.vue  # Formulario compartido crear/editar ingrediente
│   ├── Ingrediente.vue      # Fila de ingrediente (panel admin)
│   ├── Categoria.vue        # Fila de categoría
│   ├── Usuario.vue          # Fila de usuario
│   ├── Buscador.vue         # Input de búsqueda reutilizable
│   ├── EditorTiny.vue       # Wrapper de TinyMCE
│   ├── Modal.vue            # Modal genérico
│   ├── EditButton.vue       # Botón de edición estilizado
│   ├── DeleteButton.vue     # Botón de borrado estilizado
│   ├── PrimaryButton.vue    # Botón principal
│   ├── SecondaryButton.vue  # Botón secundario
│   ├── DangerButton.vue     # Botón de acción destructiva
│   ├── GoBackButton.vue     # Volver atrás
│   ├── NewElementLink.vue   # Enlace para crear nuevos elementos
│   ├── InputLabel.vue       # Etiqueta de campo de formulario
│   ├── TextInput.vue        # Input de texto
│   ├── InputError.vue       # Mensaje de error de validación
│   ├── Checkbox.vue         # Checkbox
│   ├── NavLink.vue          # Enlace de navegación activo/inactivo
│   ├── ResponsiveNavLink.vue
│   ├── ResponsiveNavButton.vue
│   ├── Dropdown.vue
│   ├── DropdownButton.vue
│   ├── DropdownLink.vue
│   ├── ApplicationLogo.vue
│   └── Footer.vue
│
└── views/
    ├── Home.vue                  # Portada pública: listado paginado + búsqueda
    ├── FichaRecetaPortada.vue    # Detalle público de una receta
    ├── Dashboard.vue             # Panel de bienvenida post-login
    │
    ├── admin/
    │   ├── recetas/
    │   │   ├── Recetas.vue       # Listado con búsqueda y paginación
    │   │   ├── NuevaReceta.vue   # Formulario de creación
    │   │   ├── EditarReceta.vue  # Formulario de edición
    │   │   └── FichaReceta.vue   # Vista detalle (panel admin)
    │   ├── ingredientes/
    │   │   ├── Ingredientes.vue
    │   │   ├── NuevoIngrediente.vue
    │   │   └── EditarIngrediente.vue
    │   ├── categorias/
    │   │   ├── Categorias.vue
    │   │   ├── NuevaCategoria.vue
    │   │   └── EditarCategoria.vue
    │   └── usuarios/
    │       ├── Usuarios.vue
    │       └── EditarUsuario.vue
    │
    └── auth/
        ├── Login.vue
        ├── Register.vue
        ├── ForgotPassword.vue
        ├── PasswordReset.vue
        └── VerifyEmail.vue
```

---

## Arquitectura y decisiones de diseño

### Autenticación (Sanctum con tokens Bearer)

La autenticación usa **tokens Bearer**, no cookies de sesión. El flujo es:

1. `login` y `register` (en `src/stores/auth.js`) reciben `{ token, user }` de la API y guardan el token en `localStorage` (clave `auth_token`).
2. Un interceptor de petición de Axios (`src/utils/axios.js`) añade `Authorization: Bearer <token>` a cada petición si hay token.
3. El router verifica el estado de autenticación en cada navegación (`router.beforeEach`) llamando a `auth.fetchUser()` si aún no hay usuario cargado; sin token no se llama a la API.
4. Si la API responde 401, el interceptor de respuesta borra el token y el guard del router redirige al login.
5. `logout` revoca el token en el servidor y lo borra de `localStorage`.

Al estar en `localStorage`, el token es accesible desde JavaScript: hay que evitar cualquier vulnerabilidad XSS (de ahí el uso de DOMPurify para el contenido enriquecido).

### Guards de navegación

Las rutas usan el campo `meta.middleware` para declarar sus requisitos:

| Middleware  | Comportamiento si no se cumple          |
| ----------- | --------------------------------------- |
| `auth`      | Redirige a `/auth/login`                |
| `is_admin`  | Redirige a `/` (portada pública)        |
| `verified`  | Redirige a `/auth/verify-email`         |
| `guest`     | Redirige a `/admin/dashboard`           |

### Estado global — Pinia

Cada dominio tiene su propio store. Los stores de CRUD (recetas, ingredientes, categorías, usuarios) siguen este patrón:

- Mantienen la lista paginada actual en `recetas.data` / `recetas.meta`.
- Las búsquedas se hacen en el servidor con debounce (300 ms), nunca en memoria.
- Los errores se notifican vía `toastStore` en lugar de `console.error`.

### Datos estáticos — TanStack Query

Los datos que no cambian o cambian raramente (ingredientes, categorías, dificultades) se gestionan con **TanStack Query** en lugar de Pinia, para aprovechar la caché automática y evitar cargar todo en memoria en cada montaje:

```
src/composables/useQueries.js
    useIngredientesTodos()  → staleTime: 2 min
    useCategorias()         → staleTime: 5 min
    useDificultades()       → staleTime: Infinity (datos estáticos)
```

La instancia compartida de `QueryClient` está en `src/queryClient.js`. Los stores de Pinia usan ese mismo cliente para invalidar queries cuando crean, editan o borran registros.

### Comunicación con la API

`src/utils/axios.js` configura una instancia global con:
- `baseURL`: leída de `VITE_APP_BACKEND_URL`
- Interceptor de petición: añade la cabecera `Authorization: Bearer <token>` leyendo el token de `localStorage`
- `timeout: 15000 ms`: evita estados de carga permanentes ante peticiones colgadas
- Interceptor de respuesta: captura errores `ECONNABORTED` (timeout) y `ERR_NETWORK` para mostrar un toast en lugar de fallar silenciosamente

### Contenido enriquecido — TinyMCE + DOMPurify

El campo "instrucciones" de las recetas se edita con TinyMCE y se almacena como HTML. Al mostrarlo con `v-html` se sanitiza con **DOMPurify** para prevenir XSS:

```js
const safeInstrucciones = computed(() => DOMPurify.sanitize(receta.instrucciones ?? ''))
```

Esto aplica tanto en `FichaReceta.vue` (admin) como en `FichaRecetaPortada.vue` (pública).

### Imágenes

Las imágenes se suben al backend y se almacenan en `storage/app/public` como WebP. La URL pública se construye mediante el composable `useImagen`:

```js
import { useImagen } from '../composables/useImagen'
const { getImagen } = useImagen()
// getImagen(receta.imagen) → "http://localhost:8000/storage/img/foto-a1b2c3.webp"
```

Todos los componentes que muestran imágenes usan este composable. No hay lógica de URL duplicada.

---

## Rutas de la aplicación

| Ruta                          | Nombre             | Acceso      | Vista                      |
| ----------------------------- | ------------------ | ----------- | -------------------------- |
| `/`                           | `home`             | Público     | Home.vue                   |
| `/ver-receta/:id`             | `ver-receta`       | Público     | FichaRecetaPortada.vue     |
| `/intranet`                   | `login` (alias)    | Guest       | Login.vue                  |
| `/auth/register`              | `register`         | Guest       | Register.vue               |
| `/auth/forgot-password`       | `forgot-password`  | Guest       | ForgotPassword.vue         |
| `/auth/password-reset/:token` | `password-reset`   | Guest       | PasswordReset.vue          |
| `/auth/verify-email`          | `verify-email`     | Auth        | VerifyEmail.vue            |
| `/admin/dashboard`            | `dashboard`        | Auth+Admin  | Dashboard.vue              |
| `/admin/recetas`              | `recetas`          | Auth+Admin  | admin/recetas/Recetas.vue  |
| `/admin/nueva-receta`         | `nueva-receta`     | Auth+Admin  | NuevaReceta.vue            |
| `/admin/editar-receta/:id`    | `editar-receta`    | Auth+Admin  | EditarReceta.vue           |
| `/admin/receta/:id`           | `receta`           | Auth+Admin  | FichaReceta.vue            |
| `/admin/ingredientes`         | `ingredientes`     | Auth+Admin  | Ingredientes.vue           |
| `/admin/categorias`           | `categorias`       | Auth+Admin  | Categorias.vue             |
| `/admin/usuarios`             | `usuarios`         | Auth+Admin  | Usuarios.vue               |

---

## Dependencias principales

| Paquete                  | Uso                                            |
| ------------------------ | ---------------------------------------------- |
| `vue` ^3.3               | Framework principal                            |
| `vue-router` ^4          | Enrutamiento SPA                               |
| `pinia` ^2               | Estado global                                  |
| `@tanstack/vue-query` ^5 | Caché de datos estáticos (ingredientes, etc.)  |
| `axios` ^1               | Cliente HTTP                                   |
| `tailwindcss` ^3         | CSS utilitario                                 |
| `flowbite-vue` ^0.1      | Componentes UI sobre Tailwind                  |
| `@tinymce/tinymce-vue`   | Editor de texto enriquecido                    |
| `dompurify` ^3           | Sanitización HTML antes de `v-html`            |
| `vue-sweetalert2`        | Diálogos de confirmación                       |
| `vue-toast-notification` | Notificaciones toast                           |
| `laravel-vue-pagination` | Componente de paginación compatible con Laravel |

---

## Tecnologías

| Herramienta   | Versión  |
| ------------- | -------- |
| Vue           | ^3.3.4   |
| Vite          | ^4.3.9   |
| Tailwind CSS  | ^3.3.2   |
| Node.js       | >= 18    |
