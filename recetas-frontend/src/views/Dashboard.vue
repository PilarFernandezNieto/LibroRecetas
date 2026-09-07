<script setup>
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue'
</script>
<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-titulares text-3xl text-verde-900 leading-tight">Panel de administración</h2>
    </template>
    <div class="py-12">
      <div
        class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8 p-4 bg-papel rounded-sm flex min-h-96 h-screen items-center justify-center"
      >
        <div class="bg-crema border border-papel overflow-hidden shadow-sm rounded-sm">
          <p class="p-6 font-principal text-verde-900">
            Bienvenid@ al panel de administración de
            <span class="font-titulares">Libro de Recetas</span>
          </p>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
