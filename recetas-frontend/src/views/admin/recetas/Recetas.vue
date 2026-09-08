<script setup>
import { ref, onMounted, watch } from 'vue'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import NewElementLink from '../../../components/NewElementLink.vue'
import Receta from '../../../components/Receta.vue'
import { FwbSpinner } from 'flowbite-vue'
import { useRecetaStore } from '@/stores/recetaStore'
import { TailwindPagination } from 'laravel-vue-pagination'

const recetaStore = useRecetaStore()
const buscar = ref('')
const debounceTimer = ref(null)

onMounted(() => recetaStore.fetchRecetas())

const limpiarBusqueda = () => {
  buscar.value = ''
}

watch(buscar, (nuevoValor) => {
  clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(() => recetaStore.fetchRecetas(1, nuevoValor.trim()), 500)
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-titulares text-3xl text-verde-900 leading-tight">Listado de recetas</h2>
    </template>
    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-papel overflow-hidden shadow-sm rounded-sm py-4 px-4 md:px-8">
          <template v-if="recetaStore.loading">
            <div class="flex justify-center mb-8"><fwb-spinner size="10" color="green" /></div>
          </template>
          <div class="flex gap-4 mb-4 justify-end">
            <div class="flex items-center justify-center">
              <input
                type="text"
                class="w-full p-2 bg-crema border border-verde rounded-l-sm focus:outline-none focus:border-verde focus:ring-verde placeholder-verde-900/40"
                placeholder="Buscar receta"
                v-model="buscar"
              />
              <i
                v-if="buscar.trim() !== ''"
                class="fa-solid fa-xmark cursor-pointer bg-verde hover:bg-verde-800 text-crema p-3 rounded-r-sm border border-verde"
                @click="limpiarBusqueda"
              ></i>
              <i
                v-else
                class="fa-solid fa-magnifying-glass bg-verde hover:bg-verde-800 text-crema p-3 rounded-r-sm border border-verde"
              ></i>
            </div>
            <NewElementLink :to="{ name: 'nueva-receta' }">Nueva receta</NewElementLink>
          </div>
          <div
            class="grid md:grid-cols-12 gap-1 lg:gap-4 px-2 pb-2 border-b border-papel text-xs uppercase tracking-wide text-verde-900/50 font-principal"
          >
            <span class="col-span-1"></span>
            <span class="col-span-4">Receta</span>
            <span class="col-span-2">Categoría</span>
            <span class="col-span-">Dificultad</span>
            <span class="col-span-2">Tiempo</span>
            <span class="col-span-2"></span>
          </div>
          <Receta v-for="receta in recetaStore.recetas.data" :key="receta.id" :receta="receta" />
        </div>
        <div class="mt-10 flex justify-center">
          <TailwindPagination
            :data="recetaStore.recetas"
            :active-classes="['border-verde-900', 'text-verde-900', 'hover:bg-papel']"
            @pagination-change-page="recetaStore.fetchRecetas"
          />
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
