# Libro de Recetas — Repositorio backend y frontend

API REST desarrollada con **Laravel 11 + Sanctum** que gestiona recetas, ingredientes, categorías, dificultades y usuarios. Expone rutas públicas de consulta y un panel de administración protegido.

---

## Requisitos previos

- PHP >= 8.2
- Composer
- SQLite (por defecto) o MySQL/PostgreSQL

---

## Instalación y puesta en marcha

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link     # enlaza storage/app/public → public/storage (imágenes)
php artisan serve --host=localhost --port=8000
```

La API queda disponible en **http://localhost:8000**.

### Variables de entorno clave (`.env`)

| Variable                   | Descripción                                      | Ejemplo                 |
| -------------------------- | ------------------------------------------------ | ----------------------- |
| `APP_URL`                  | URL del propio backend                           | `http://localhost:8000` |
| `DB_CONNECTION`            | Motor de base de datos                           | `sqlite` / `mysql`      |
| `FRONTEND_URL`             | URL del frontend Vue (para CORS)                 | `http://localhost:3000` |
| `SANCTUM_STATEFUL_DOMAINS` | Dominios con acceso a sesión (sin protocolo)     | `localhost:3000`        |
| `SESSION_DOMAIN`           | Dominio de la cookie de sesión                   | `localhost`             |
| `MAIL_*`                   | Configuración de correo (recuperación contraseña)| —                       |
| `FILESYSTEM_DISK`          | Disco de almacenamiento de imágenes              | `public`                |

> **En producción** configura `SESSION_SECURE_COOKIE=true`, `SESSION_SAME_SITE=none` (si frontend y backend están en dominios distintos) y un driver de caché real (`CACHE_DRIVER=redis` o `database`).

---

## Estructura del proyecto

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── RecetaController.php       # CRUD recetas (admin) + rutas públicas de lectura
│   │   ├── IngredienteController.php  # CRUD ingredientes + listado completo sin paginar
│   │   ├── CategoriaController.php    # CRUD categorías
│   │   ├── DificultadController.php   # CRUD dificultades (con caché permanente)
│   │   ├── UsuarioController.php      # Gestión de usuarios (admin)
│   │   └── Auth/                      # Breeze: login, registro, reset, verificación
│   │
│   ├── Middleware/
│   │   ├── UserIsAdmin.php            # Verifica is_admin=true en el usuario autenticado
│   │   └── EnsureEmailIsVerified.php
│   │
│   ├── Requests/
│   │   ├── RecetaRequest.php          # Validación de creación/edición de receta
│   │   ├── IngredienteRequest.php
│   │   ├── CategoriaRequest.php
│   │   └── UsuarioRequest.php
│   │
│   └── Resources/
│       ├── RecetaCollection.php       # Colección paginada de recetas
│       ├── CategoriaResource.php / CategoriaCollection.php
│       ├── IngredienteResource.php / IngredienteCollection.php
│       ├── DificultadResource.php / DificultadCollection.php
│       └── UsuarioResource.php / UsuarioCollection.php
│
├── Models/
│   ├── Receta.php              # Relaciones: ingredientes (pivot), categoria, dificultad
│   ├── Ingrediente.php
│   ├── RecetaIngrediente.php   # Pivot con campos extra: cantidad, unidad
│   ├── Categoria.php
│   ├── Dificultad.php
│   └── User.php                # Campo extra: is_admin (bool)
│
└── Traits/
    └── ImageHandler.php        # Sube (nombre sanitizado), convierte a WebP, reemplaza y elimina imágenes

routes/
├── api.php                     # Rutas de la API
└── auth.php                    # Rutas de autenticación Breeze

database/
└── migrations/                 # Historial completo del esquema
```

---

## Esquema de base de datos

```
users
  id, name, email, password, is_admin (bool), email_verified_at, timestamps

ingredientes
  id, nombre (unique), descripcion (nullable)

dificultades
  id, nombre

categorias
  id, nombre

recetas
  id, nombre, intro (nullable), instrucciones (text — HTML de TinyMCE),
  imagen (nullable), comensales, tiempo, origen,
  dificultad_id (FK → dificultades),
  categoria_id (FK → categorias, nullable)

receta_ingredientes   ← tabla pivot con datos extra
  id, receta_id (FK → recetas, cascade delete),
  ingrediente_id (FK → ingredientes, set null on delete),
  cantidad, unidad
```

`ingrediente_id` usa `ON DELETE SET NULL`: borrar un ingrediente no elimina las recetas donde aparecía, solo desvincula la relación.

---

## API Reference

### Rutas públicas

| Método | Ruta                | Descripción                                                    |
| ------ | ------------------- | -------------------------------------------------------------- |
| GET    | `/api/recetas`      | Listado paginado. Acepta `?buscar=` para filtrar por nombre.   |
| GET    | `/api/recetas/{id}` | Detalle con ingredientes, categoría y dificultad.              |

### Rutas de autenticación

Gestionadas por Laravel Breeze. Throttle `6,1` (6 intentos/minuto) en todas.

| Método | Ruta                               | Middleware   | Acción                          |
| ------ | ---------------------------------- | ------------ | ------------------------------- |
| POST   | `/register`                        | guest        | Crear cuenta                    |
| POST   | `/login`                           | guest        | Iniciar sesión                  |
| POST   | `/logout`                          | auth         | Cerrar sesión                   |
| POST   | `/forgot-password`                 | guest        | Enviar email de recuperación    |
| POST   | `/reset-password`                  | guest        | Establecer nueva contraseña     |
| GET    | `/verify-email/{id}/{hash}`        | auth, signed | Verificar email                 |
| POST   | `/email/verification-notification` | auth         | Reenviar email de verificación  |

### Rutas de administración (`/api/admin/...`)

Protegidas por `auth:sanctum + verified + is_admin`.

| Método | Ruta                            | Descripción                                                  |
| ------ | --------------------------------| ------------------------------------------------------------ |
| GET    | `/admin/recetas`                | Listado paginado + `?buscar=`                                |
| POST   | `/admin/recetas`                | Crear receta (multipart/form-data con imagen opcional)       |
| GET    | `/admin/recetas/{id}`           | Detalle                                                      |
| POST   | `/admin/recetas/{id}`           | Actualizar (POST con `_method=PUT` — necesario por multipart)|
| DELETE | `/admin/recetas/{id}`           | Eliminar receta e imagen del disco                           |
| GET    | `/admin/ingredientes`           | Listado paginado + `?buscar=`                                |
| GET    | `/admin/ingredientes-todos`     | Lista completa sin paginar (para `<select>` del formulario)  |
| POST   | `/admin/ingredientes`           | Crear                                                        |
| PUT    | `/admin/ingredientes/{id}`      | Actualizar                                                   |
| DELETE | `/admin/ingredientes/{id}`      | Eliminar                                                     |
| CRUD   | `/admin/categorias`             | Igual que ingredientes                                       |
| CRUD   | `/admin/dificultades`           | Igual que ingredientes                                       |
| CRUD   | `/admin/usuarios`               | Gestión de usuarios                                          |

---

## Autenticación — Sanctum SPA

Este backend usa autenticación basada en **cookies de sesión**, no en tokens Bearer. El flujo desde el frontend es:

1. `GET /sanctum/csrf-cookie` — obtiene la cookie CSRF antes del primer login.
2. `POST /login` — establece la cookie de sesión `HttpOnly`.
3. Todas las peticiones incluyen `withCredentials: true` para enviar las cookies automáticamente.

Para que funcione en desarrollo, `SANCTUM_STATEFUL_DOMAINS` y `SESSION_DOMAIN` deben coincidir con el dominio del frontend (sin protocolo ni barra final).

---

## Imágenes — Trait `ImageHandler`

`app/Traits/ImageHandler.php` centraliza toda la gestión de imágenes:

- **`guardarImagen($file)`**: sube el archivo usando el nombre original del explorador. Lo sanitiza: transliteración de acentos (`iconv`), minúsculas, elimina caracteres especiales y añade un sufijo único de 6 caracteres para evitar colisiones (`foto-tomate-a1b2c3.jpg`).
- **`convertToWebp($path)`**: convierte la imagen subida a WebP con calidad 80 (usando `intervention/image` v3 + GD) y elimina el archivo original. Devuelve la URL pública del `.webp`.
- **`borraImagen($url)`**: elimina el archivo del disco dado su URL o ruta relativa, independientemente del formato.

El pipeline en cada controller es: `guardarImagen()` → `convertToWebp()`. Al actualizar, `borraImagen()` se llama antes de subir la nueva.

Requiere haber ejecutado `php artisan storage:link` para que las imágenes sean accesibles en `public/storage`.

---

## Caché

`DificultadController` usa `Cache::rememberForever('dificultades', ...)` porque las dificultades son datos estáticos. Si modificas los registros de dificultades directamente en la BD, limpia la caché:

```bash
php artisan cache:clear
```

---

## Comandos Artisan útiles

```bash
php artisan migrate:fresh          # Reinicia la BD (borra todo y vuelve a migrar)
php artisan storage:link           # Crea el enlace simbólico para imágenes
php artisan cache:clear            # Limpia caché (necesario si modificas dificultades)
php artisan route:list --path=api  # Lista todas las rutas de la API
php artisan tinker                 # Consola interactiva de Laravel
```

---

## Tecnologías

| Herramienta     | Versión |
| --------------- | ------- |
| Laravel         | ^11.31  |
| Laravel Sanctum | ^4.0    |
| Laravel Breeze  | ^2.3    |
| PHP             | ^8.2    |


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
│   └── axios.js             # Instancia Axios configurada (baseURL, withCredentials, timeout)
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

### Autenticación (Sanctum SPA)

La autenticación usa **cookies de sesión**, no tokens Bearer. El flujo es:

1. Antes de hacer login, el frontend llama a `/sanctum/csrf-cookie` para obtener la cookie CSRF.
2. Las peticiones posteriores incluyen automáticamente `withCredentials: true` gracias a la configuración global de Axios.
3. El router verifica el estado de autenticación en cada navegación (`router.beforeEach`) llamando a `auth.fetchUser()` una sola vez por sesión.

La cookie de sesión es `HttpOnly`, por lo que el frontend nunca tiene acceso directo al token.

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
- `withCredentials: true`: necesario para enviar cookies Sanctum
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

