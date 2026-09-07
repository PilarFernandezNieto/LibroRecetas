<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ApplicationLogo from '../components/ApplicationLogo.vue'
import Dropdown from '../components/Dropdown.vue'
import DropdownButton from '../components/DropdownButton.vue'
import NavLink from '../components/NavLink.vue'
import ResponsiveNavLink from '../components/ResponsiveNavLink.vue'
import ResponsiveNavButton from '../components/ResponsiveNavButton.vue'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const { user, logout } = useAuthStore()
const showingNavigationDropdown = ref(false)
</script>

<template>
  <div class="min-h-screen bg-crema font-principal">
    <nav class="bg-crema border-b border-papel">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between">
          <div class="flex">
            <div class="flex items-center shrink-0">
              <RouterLink :to="{ name: 'dashboard' }">
                <ApplicationLogo class="block w-32 py-5" />
              </RouterLink>
            </div>
            <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex items-center">
              <NavLink :to="{ name: 'home' }" :active="route.name == 'home'"> Inicio </NavLink>
              <NavLink :to="{ name: 'usuarios' }" :active="route.name == 'usuarios'">
                Usuarios
              </NavLink>
              <NavLink :to="{ name: 'categorias' }" :active="route.name == 'categorias'"
                >Categorías</NavLink
              >
              <NavLink :to="{ name: 'ingredientes' }" :active="route.name == 'ingredientes'"
                >Ingredientes</NavLink
              >
              <NavLink :to="{ name: 'recetas' }" :active="route.name == 'recetas'">Recetas</NavLink>
            </div>
          </div>

          <div class="hidden sm:flex sm:items-center sm:ml-6">
            <div class="ml-3 relative">
              <Dropdown align="right" width="48">
                <template #trigger>
                  <span class="inline-flex rounded-suave">
                    <button
                      type="button"
                      class="inline-flex items-center px-3 py-2 border border-transparent text-base leading-4 font-medium rounded-suave text-verde-900/70 bg-crema hover:text-verde focus:outline-none transition ease-in-out duration-150"
                    >
                      {{ user?.name }}
                      <svg
                        class="ml-2 -mr-0.5 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                </template>
                <template #content>
                  <DropdownButton @click="logout()">Cierra sesión</DropdownButton>
                </template>
              </Dropdown>
            </div>
          </div>

          <div class="-mr-2 flex items-center sm:hidden">
            <button
              @click="showingNavigationDropdown = !showingNavigationDropdown"
              class="inline-flex items-center justify-center p-2 rounded-suave text-verde-900/50 hover:text-verde hover:bg-papel focus:outline-none focus:bg-papel focus:text-verde transition duration-150 ease-in-out"
            >
              <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  :class="{
                    hidden: showingNavigationDropdown,
                    'inline-flex': !showingNavigationDropdown,
                  }"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  :class="{
                    hidden: !showingNavigationDropdown,
                    'inline-flex': showingNavigationDropdown,
                  }"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        :class="{ block: showingNavigationDropdown, hidden: !showingNavigationDropdown }"
        class="sm:hidden"
      >
        <div class="pt-2 pb-3 space-y-1">
          <ResponsiveNavLink :to="{ name: 'home' }"> Inicio </ResponsiveNavLink>
          <ResponsiveNavLink :to="{ name: 'usuarios' }"> Usuarios </ResponsiveNavLink>
          <ResponsiveNavLink :to="{ name: 'categorias' }" :active="route.name == 'categorias'"
            >Categorías</ResponsiveNavLink
          >
          <ResponsiveNavLink :to="{ name: 'ingredientes' }" :active="route.name == 'ingredientes'"
            >Ingredientes</ResponsiveNavLink
          >
          <ResponsiveNavLink :to="{ name: 'recetas' }" :active="route.name == 'recetas'"
            >Recetas</ResponsiveNavLink
          >
        </div>
        <div class="pt-4 pb-1 border-t border-papel">
          <div class="px-4">
            <div class="font-medium text-base text-verde-900">{{ user?.name }}</div>
            <div class="font-medium text-base text-verde-900/60">{{ user?.email }}</div>
          </div>
          <div class="mt-3 space-y-1">
            <ResponsiveNavButton @click="logout()">Cierra sesión</ResponsiveNavButton>
          </div>
        </div>
      </div>
    </nav>

    <header class="bg-papel" v-if="$slots.header">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <slot name="header" />
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
