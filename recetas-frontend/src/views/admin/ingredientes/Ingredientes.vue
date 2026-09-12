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

onMounted(() => ingredienteStore.fetchIngredientes())

const buscar = ref('')
const limpiarBusqueda = () => {
  buscar.value = ''
}
const buscando = computed(() => buscar.value.trim() !== '')
const ingredientesFiltrados = computed(() => {
  if (!buscando.value) return ingredienteStore.ingredientes.data ?? []
  return (ingredientesTodos.value ?? []).filter((ingrediente) =>
    ingrediente.nombre.toLowerCase().includes(buscar.value.toLowerCase()),
  )
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-titulares text-3xl text-antracita leading-tight">Listado de ingredientes</h2>
    </template>

    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-papel overflow-hidden shadow-sm rounded-sm py-4 px-4 md:px-8">
          <template v-if="ingredienteStore.loading">
            <div class="flex justify-center mb-8"><fwb-spinner size="10" color="green" /></div>
          </template>

          <div class="rounded-sm overflow-hidden border border-papel">
            <div class="flex gap-4 lg:flex-row mb-4 justify-end">
              <div class="flex items-center justify-center">
                <label for="buscar" class="sr-only">Buscar ingrediente</label>
                <input
                  type="text"
                  class="w-full p-2 bg-papel border border-terracota rounded-l-sm focus:outline-none focus:border-terracota focus:ring-terracota placeholder-antracita/40"
                  placeholder="Buscar ingrediente"
                  v-model="buscar"
                />
                <i
                  v-if="buscar.trim() !== ''"
                  class="fa-solid fa-xmark cursor-pointer bg-terracota hover:bg-terracota-oscuro text-papel p-3 rounded-r-sm border border-terracota"
                  @click="limpiarBusqueda"
                ></i>
                <i
                  v-else
                  class="fa-solid fa-magnifying-glass bg-terracota hover:bg-terracota-oscuro text-papel p-3 rounded-r-sm border border-terracota"
                ></i>
              </div>
              <NewElementLink :to="{ name: 'nuevo-ingrediente' }">Nuevo</NewElementLink>
            </div>

            <div
              class="grid md:grid-cols-12 gap-1 lg:gap-4 px-2 pb-2 border-b border-papel text-xs uppercase tracking-wide text-antracita/50 font-principal"
            >
              <span class="col-span-1"></span><span class="col-span-3">Nombre</span
              ><span class="col-span-5">Descripción</span><span class="col-span-3"></span>
            </div>
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
            :active-classes="['border-antracita', 'text-antracita', 'hover:bg-papel']"
            @pagination-change-page="ingredienteStore.fetchIngredientes"
          />
          <div
            v-if="buscando && ingredientesFiltrados.length === 0"
            class="text-xl font-principal text-antracita/70"
          >
            No hay resultados para "{{ buscar }}"
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
