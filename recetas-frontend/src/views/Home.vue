<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toastStore'
import GuestLayout from '../layouts/GuestLayout.vue'
import RecetaPortada from '../components/RecetaPortada.vue'
import { TailwindPagination } from 'laravel-vue-pagination'
import Buscador from '../components/Buscador.vue'
import { FwbSpinner } from 'flowbite-vue'
import axios from '../utils/axios'

const { isLoggedIn } = useAuthStore()
const toastStore = useToastStore()
const recetas = ref([])
const loading = ref(true)
const buscar = ref('')
const debounceTimer = ref(null)

onMounted(async () => {
  await getRecetasIndex()
})

watch(buscar, (nuevoValor) => {
  clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(() => {
    getRecetasIndex(1, nuevoValor.trim())
  }, 500)
})

const getRecetasIndex = async (page = 1, search = '') => {
  loading.value = true
  try {
    const { data } = await axios.get(`/api/recetas?page=${page}&buscar=${search}`)
    recetas.value = data
  } catch (error) {
    toastStore.addToast({ type: 'error', message: error?.response?.data?.message ?? 'Error al cargar las recetas' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <GuestLayout>
    <div
      class="relative flex flex-col justify-center items-center min-h-screen selection:bg-green-800 selection:text-white"
    >
      <section class="w-full max-w-7xl mx-auto lg:p-8 bg bg-cover bg-center">
        <template v-if="loading">
          <div class="flex justify-center mb-8">
            <fwb-spinner size="10" color="green" />
          </div>
        </template>

        <Buscador v-model="buscar" />

        <div class="bg-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <RecetaPortada v-for="receta in recetas.data" :key="receta.id" :receta="receta" />
        </div>
        <div class="mt-10 flex justify-center">
          <TailwindPagination
            :data="recetas"
            :active-classes="['border-green-900', 'text-green-900', 'hover:bg-amber-100']"
            @pagination-change-page="(page) => getRecetasIndex(page, buscar.value)"
          />
        </div>
      </section>
    </div>
  </GuestLayout>
</template>

<style scoped></style>
