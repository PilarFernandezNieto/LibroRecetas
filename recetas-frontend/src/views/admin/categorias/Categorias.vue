<script setup>
import { onMounted } from 'vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import NewElementLink from '../../../components/NewElementLink.vue'
import { FwbSpinner } from 'flowbite-vue'
import Categoria from '../../../components/Categoria.vue'
import { useCategoriaStore } from '../../../stores/categoriaStore'

const categoriaStore = useCategoriaStore()
onMounted(() => categoriaStore.fetchCategorias())
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-titulares text-3xl text-verde-900 leading-tight">Listado de categorías</h2>
    </template>
    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-papel overflow-hidden shadow-sm rounded-sm py-4 px-4 md:px-8">
          <template v-if="categoriaStore.loading">
            <div class="flex justify-center mb-8"><fwb-spinner size="10" color="green" /></div>
          </template>
          <div class="w-full lg:w-2/3 mx-auto">
            <div class="flex gap-4 lg:flex-row mb-4 justify-end">
              <NewElementLink :to="{ name: 'nueva-categoria' }">Nueva categoría</NewElementLink>
            </div>
            <div class="grid grid-cols-1">
              <Categoria
                v-for="categoria in categoriaStore.categorias"
                :key="categoria.id"
                :categoria="categoria"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
