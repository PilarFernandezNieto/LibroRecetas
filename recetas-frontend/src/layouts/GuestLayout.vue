<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ApplicationLogo from '../components/ApplicationLogo.vue'
import DropdownLink from '../components/DropdownLink.vue'
import Footer from '../components/Footer.vue'
import Dropdown from '../components/Dropdown.vue'
import DropdownButton from '../components/DropdownButton.vue'
import NavLink from '../components/NavLink.vue'
import ResponsiveNavLink from '../components/ResponsiveNavLink.vue'
import ResponsiveNavButton from '../components/ResponsiveNavButton.vue'
import { useAuthStore } from '../stores/auth'

const route = useRoute()

const { user, logout, isLoggedIn, isAdmin } = useAuthStore()

const showingNavigationDropdown = ref(false)
</script>

<!-- PARA TODAS LA VISTAS QUE NO NECESITAN LOGIN -->
<template>
  <div class="min-h-screen sm:pt-0">
    <!-- Navegación principal -->
    <nav class="shadow bg-amber-50 text-white">
      <div class="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div class="flex justify-between">
          <!-- Logo -->
          <div class="flex items-center flex-shrink-0">
            <RouterLink :to="{ name: 'home' }">
              <ApplicationLogo class="block w-48" />
            </RouterLink>
          </div>
          <!-- Navigation Links -->
          <div class="flex">
            <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <!-- <template v-if="!isLoggedIn">
                <NavLink
                  :to="{ name: 'login' }"
                  class="font-semibold text-gray-600 hover:text-gray-900"
                  >Inicia sesión</NavLink
                >
                <NavLink
                  :to="{ name: 'register' }"
                  class="ml-4 font-semibold text-gray-600 hover:text-gray-900"
                  >Registro</NavLink
                >
              </template> -->
            </div>
            <div class="hidden sm:flex sm:items-center sm:ml-6">
              <!-- Settings Dropdown User-->
              <div v-if="isLoggedIn" class="ml-3 relative">
                <Dropdown align="right" width="48">
                  <template #trigger>
                    <span class="inline-flex rounded-md">
                      <button
                        type="button"
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
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
                    <div v-if="isAdmin">
                      <DropdownLink :to="{ name: 'dashboard' }">Administrador</DropdownLink>
                    </div>

                    <DropdownButton @click="logout()">Cierra sesión</DropdownButton>
                  </template>
                </Dropdown>
              </div>
            </div>
          </div>

          <!-- Hamburger -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button
              @click="showingNavigationDropdown = !showingNavigationDropdown"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-green-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-green-800 transition duration-150 ease-in-out"
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

      <!-- Responsive Navigation Menu -->
      <div
        :class="{
          block: showingNavigationDropdown,
          hidden: !showingNavigationDropdown,
        }"
        class="sm:hidden"
      >
        <!-- <template v-if="!isLoggedIn">
          <ResponsiveNavLink
            :to="{ name: 'login' }"
            class="font-semibold text-gray-600 hover:text-gray-900"
            >Inicia sesión</ResponsiveNavLink
          >

          <ResponsiveNavLink
            :to="{ name: 'register' }"
            class="font-semibold text-gray-600 hover:text-gray-900"
            >Registro</ResponsiveNavLink
          >
        </template> -->
        <div v-if="isLoggedIn">
          <div class="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink :to="{ name: 'home' }"> Inicio </ResponsiveNavLink>
            <ResponsiveNavLink :to="{ name: 'dashboard' }" :active="route.name == 'dashboard'">
              Panel de administración
            </ResponsiveNavLink>
          </div>
          <!-- Responsive Settings Options -->
          <div class="pt-4 pb-1 border-t border-gray-200">
            <div class="px-4">
              <div class="font-medium text-base text-gray-800">
                {{ user?.name }}
              </div>
              <div class="font-medium text-sm text-gray-500">
                {{ user?.email }}
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <ResponsiveNavButton @click="logout()">Cierra sesión</ResponsiveNavButton>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <!-- Page Heading -->
      <div
        class="bg-banner-principal bg-cover bg-center bg-no-repeat h-64 sm:h-80 md:h-96 lg:h-[680px]"
      ></div>
      <header  v-if="$slots.header">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <slot name="header" />
        </div>
      </header>

      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <!-- Aquí se mostrará la pagina principal y todas las vistas que no necesiten login -->
        <slot />
      </div>
    </main>
    <div class="w-full py-8 sm:px-6 lg:px-8 overflow-hidden bg-amber-50">
      <Footer />
    </div>
  </div>
</template>
