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
    toastStore.addToast({
      type: 'error',
      message: error?.response?.data?.message ?? 'Error al cargar las recetas',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <GuestLayout>
    <div
      class="relative flex flex-col min-h-screen bg-papel selection:bg-crema selection:text-antracita"
    >
      <!-- HERO -->
      <section class="w-full -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div class="max-w-7xl mx-auto flex flex-wrap gap-10 md:gap-14 items-center">
          <div
            class="flex-1 min-w-70 relative flex items-center justify-center min-h-70 md:min-h-95 pl-8 pr-3 sm:pl-10 sm:pr-4"
          >
            <div
              class="absolute inset-0 m-auto w-[90%] h-[90%] bg-papel shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
              style="transform: rotate(4deg) translate(18px, 16px)"
            ></div>
            <div
              class="relative w-[95%] aspect-square shadow-xl overflow-hidden"
              style="transform: rotate(-2deg)"
            >
              <img
                src="/img/platos_en_mesa.jpg"
                alt="Mesa de recetas de temporada"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <div class="flex-1 min-w-70 max-w-xl">
            <span
              class="inline-block text-verde font-principal font-semibold text-sm tracking-widest uppercase mb-4"
              >Recetario</span
            >
            <h1 class="font-titulares text-4xl md:text-5xl leading-tight text-verde-900 mb-5">
              Recetas para compartir
            </h1>
            <p class="text-verde-900/80 font-principal text-lg mb-8 max-w-md">
              Una colección de platos con ingredientes honestos, pasos claros y fotografías que
              huelen a casa.
            </p>
            <Buscador v-model="buscar" />
          </div>
        </div>
      </section>

      <!-- RECETAS -->
      <section class="w-full max-w-7xl mx-auto pb-16">
        <h2 class="font-titulares text-2xl md:text-3xl text-verde-900 mb-6">Recetas destacadas</h2>

        <template v-if="loading">
          <div class="flex justify-center mb-8">
            <fwb-spinner size="10" color="green" />
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          <RecetaPortada v-for="receta in recetas.data" :key="receta.id" :receta="receta" />
        </div>
        <div class="mt-10 flex justify-center">
          <TailwindPagination
            :data="recetas"
            :active-classes="['border-terracota-osucro', 'text-terrcaota-oscuro', 'hover:bg-crema']"
            @pagination-change-page="(page) => getRecetasIndex(page, buscar.value)"
          />
        </div>
      </section>
    </div>
  </GuestLayout>
</template>

<style scoped></style>
