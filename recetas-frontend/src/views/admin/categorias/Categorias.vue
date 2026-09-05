<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import NewElementLink from '../../../components/NewElementLink.vue'
import { FwbSpinner } from 'flowbite-vue'
import Categoria from '../../../components/Categoria.vue'
import { useCategoriaStore } from '../../../stores/categoriaStore'

const categoriaStore = useCategoriaStore()
onMounted(() => {
  categoriaStore.fetchCategorias()
})


</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-700 leading-tight">Listado de categorías</h2>
    </template>

    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-amber-50 overflow-hidden shadow-sm sm:rounded-md py-4 px-4 md:px-8">
          <template v-if="categoriaStore.loading">
            <div class="flex justify-center mb-8">
              <fwb-spinner size="10" color="green" />
            </div>
          </template>
          <div class=" w-full lg:w-2/3 mx-auto">
            <div class="flex flex-col gap-4 lg:flex-row mb-4 justify-end">
              <NewElementLink :to="{ name: 'nueva-categoria' }">Nueva categoria</NewElementLink>
            </div>
            <div class="grid grid-cols-1 gap-4">
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

<style scoped></style>
