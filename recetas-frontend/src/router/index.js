import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'Inicio', middleware: [] },
      component: Home,
    },
    {
      path: '/ver-receta/:id',
      name: 'ver-receta',
      meta: { title: 'Receta', middleware: [] },
      component: () => import('../views/FichaRecetaPortada.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      meta: { title: 'Admin', middleware: ['auth', 'is_admin'] },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          meta: { title: 'Dashboard', middleware: ['auth', 'verified', 'is_admin'] },
          component: () => import('../views/Dashboard.vue'),
        },
        {
          path: 'ingredientes',
          name: 'ingredientes',
          meta: { title: 'Ingredientes', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/ingredientes/Ingredientes.vue'),
        },
        {
          path: 'nuevo-ingrediente',
          name: 'nuevo-ingrediente',
          meta: { title: 'Nuevo Ingrediente', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/ingredientes/NuevoIngrediente.vue'),
        },
        {
          path: 'editar-ingrediente/:id',
          name: 'editar-ingrediente',
          meta: { title: 'Editar Ingrediente', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/ingredientes/EditarIngrediente.vue'),
        },
        {
          path: 'recetas',
          name: 'recetas',
          meta: { title: 'Recetas', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/recetas/Recetas.vue'),
        },
        {
          path: 'receta/:id',
          name: 'receta',
          meta: { title: 'Receta', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/recetas/FichaReceta.vue'),
        },
        {
          path: 'nueva-receta',
          name: 'nueva-receta',
          meta: { title: 'Nueva Receta', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/recetas/NuevaReceta.vue'),
        },
        {
          path: 'editar-receta/:id',
          name: 'editar-receta',
          meta: { title: 'Editar Receta', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/recetas/EditarReceta.vue'),
        },
        {
          path: 'categorias',
          name: 'categorias',
          meta: { title: 'Categorías', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/categorias/Categorias.vue'),
        },
        {
          path: 'nueva-categoria',
          name: 'nueva-categoria',
          meta: { title: 'Nueva Categoría', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/categorias/NuevaCategoria.vue'),
        },
        {
          path: 'editar-categoria/:id',
          name: 'editar-categoria',
          meta: { title: 'Editar Categoría', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/categorias/EditarCategoria.vue'),
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          meta: { title: 'Usuarios', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/usuarios/Usuarios.vue'),
        },
        {
          path: 'editar-usuario/:id',
          name: 'editar-usuario',
          meta: { title: 'Editar Usuario', middleware: ['auth', 'is_admin'] },
          component: () => import('@/views/admin/usuarios/EditarUsuario.vue'),
        },
      ],
    },
    {
      path: '/auth',
      name: 'auth',
      meta: { title: 'Auth', middleware: ['guest'] },
      children: [
        {
          path: 'login',
          alias: '/intranet',
          name: 'login',
          meta: { title: 'Inicia sesión', middleware: ['guest'] },
          component: () => import('../views/auth/Login.vue'),
        },
        {
          path: 'register',
          name: 'register',
          meta: { title: 'Registro', middleware: ['guest'] },
          component: () => import('../views/auth/Register.vue'),
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          meta: { title: 'Recupera contraseña', middleware: ['guest'] },
          component: () => import('../views/auth/ForgotPassword.vue'),
        },
        {
          path: 'password-reset/:token',
          name: 'password-reset',
          meta: { title: 'Contraseña nueva', middleware: ['guest'] },
          component: () => import('../views/auth/PasswordReset.vue'),
        },
        {
          path: 'verify-email',
          name: 'verify-email',
          meta: { title: 'Verifica email', middleware: ['auth'] },
          component: () => import('../views/auth/VerifyEmail.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  document.title = import.meta.env.VITE_APP_NAME + ' | ' + to.meta.title

  const auth = useAuthStore()

  if (!auth.isLoggedIn) {
    await auth.fetchUser()
  }

  if (to.meta.middleware.includes('guest') && auth.isLoggedIn) next({ name: 'dashboard' })
  else if (
    to.meta.middleware.includes('verified') &&
    auth.isLoggedIn &&
    !auth.user.email_verified_at
  )
    next({ name: 'verify-email' })
  else if (to.meta.middleware.includes('auth') && !auth.isLoggedIn) next({ name: 'login' })
  else if (to.meta.middleware.includes('is_admin') && !auth.isAdmin) next({ name: 'home' })
  else next()
})

export default router
