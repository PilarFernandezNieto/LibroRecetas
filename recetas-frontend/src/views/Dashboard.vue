<script setup>
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue'
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-800 leading-tight">Panel Administración</h2>
    </template>

    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8 p-4 bg-amber-50  flex min-h-96 h-screen items-center justify-center" >
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-md ">
          <p class="p-6 text-gray-900">
            Bienvenid@ al panel de administración de <span class="font-titulares">Libro de Recetas</span>
          </p>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<style scoped></style>

