<script setup>
import { ref, computed, onMounted } from 'vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import NewElementLink from '../../../components/NewElementLink.vue'
import Ingrediente from '@/components/Ingrediente.vue'
import { useIngredienteStore } from '../../../stores/ingredienteStore'
import { useIngredientesTodos } from '../../../composables/useQueries'
import { FwbSpinner } from 'flowbite-vue'
import { TailwindPagination } from 'laravel-vue-pagination'

const ingredienteStore = useIngredienteStore()
const { data: ingredientesTodos } = useIngredientesTodos()

onMounted(() => {
  ingredienteStore.fetchIngredientes()
})

const buscar = ref('')
const limpiarBusqueda = () => {
  buscar.value = ''
}

const buscando = computed(() => buscar.value.trim() !== '')

const ingredientesFiltrados = computed(() => {
  if (!buscando.value) {
    return ingredienteStore.ingredientes.data ?? []
  }
  return (ingredientesTodos.value ?? []).filter((ingrediente) =>
    ingrediente.nombre.toLowerCase().includes(buscar.value.toLowerCase()),
  )
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-700 leading-tight">Listado de ingredientes</h2>
    </template>

    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-amber-50 overflow-hidden shadow-sm sm:rounded-md py-4 px-4 md:px-8">
          <template v-if="ingredienteStore.loading">
            <div class="flex justify-center mb-8">
              <fwb-spinner size="10" color="green" />
            </div>
          </template>
          <div class="flex flex-col gap-4 lg:flex-row mb-4 justify-end">
            <div class="flex items-center justify-center">
              <label for="buscar" class="sr-only">Buscar ingrediente</label>
              <input
                id="buscar"
                type="text"
                class="w-full p-2 border border-green-800 rounded-l-md focus:outline-none focus:border-green-800 focus:ring-green-800 placeholder-gray-400"
                placeholder="Buscar ingrediente"
                v-model="buscar"
              />
              <!-- Icono "X" para limpiar el campo de búsqueda -->
              <i
                v-if="buscar.trim() !== ''"
                class="fa-solid fa-xmark cursor-pointer bg-green-800 hover:bg-green-600 text-white p-3 rounded-r-md border border-green-800"
                @click="limpiarBusqueda"
              ></i>
              <i
                v-else
                class="fa-solid fa-magnifying-glass bg-green-800 hover:bg-green-800 text-white p-3 rounded-r-md border border-green-800 focus:ring-green-800"
              ></i>
            </div>
            <NewElementLink :to="{ name: 'nuevo-ingrediente' }">Nuevo ingrediente</NewElementLink>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Ingrediente
              v-for="ingrediente in ingredientesFiltrados"
              :key="ingrediente.id"
              :ingrediente="ingrediente"
            />
          </div>
        </div>
        <div class="mt-10 flex justify-center">
          <TailwindPagination
            v-if="!buscando"
            :data="ingredienteStore.ingredientes"
            :active-classes="['border-green-900', 'text-green-900', 'hover:bg-amber-50']"
            @pagination-change-page="ingredienteStore.fetchIngredientes"
          />
          <div v-if="buscando && ingredientesFiltrados.length === 0" class="text-2xl">
            No hay resultados para "{{ buscar }}"
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<style scoped></style>
