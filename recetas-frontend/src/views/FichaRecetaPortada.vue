<script setup>
import { ref, onMounted, computed } from 'vue'
import DOMPurify from 'dompurify'
import { useRoute } from 'vue-router'
import { useToastStore } from '../stores/toastStore'
import axios from '../utils/axios'
import { useImagen } from '../composables/useImagen'
import GuestLayout from '../layouts/GuestLayout.vue'
import GoBackButton from '../components/GoBackButton.vue'
import { FwbSpinner } from 'flowbite-vue'

const route = useRoute()
const toastStore = useToastStore()
const id = route.params.id
const receta = ref([])
const loading = ref(true)

onMounted(async () => {
  await getRecetaPortada(id)
})

const getRecetaPortada = async () => {
  try {
    const { data } = await axios.get(`/api/recetas/${id}`)
    receta.value = data
  } catch (error) {
    const msg = error?.response?.data?.message ?? 'Error inesperado'
    toastStore.addToast({ type: 'error', message: msg })
  } finally {
    loading.value = false
  }
}

const filtrados = computed(() => {
  const clavesPermitidas = ['comensales', 'tiempo', 'origen']
  return Object.fromEntries(
    Object.entries(receta.value).filter(([clave]) => clavesPermitidas.includes(clave)),
  )
})
const safeInstrucciones = computed(() => DOMPurify.sanitize(receta.value.instrucciones ?? ''))

const { getImagen } = useImagen()
</script>

<template>
  <GuestLayout>
    <template #header>
      <h2 class="font-titulares text-3xl font-medium text-center my-4">{{ receta.nombre }}</h2>
    </template>
    <div class="w-full shadow-md rounded-md lg:p-4 mb-4 lg:bg-amber-50">
      <div class="bg-white opacity-90 rounded-md p-4">
        <template v-if="loading">
          <div class="flex justify-center mb-8">
            <fwb-spinner size="10" color="green" />
          </div>
        </template>
        <div class="md:grid md:grid-cols-12 gap-6 my-4">
          <div class="md:col-span-7">
            <p class="text-lg">{{ receta.intro }}</p>
            <ul class="mt-4">
              <li>
                <span class="font-semibold capitalize">Categoría: </span>
                <span class="font-medium">{{ receta.categoria?.nombre }}</span>
              </li>

              <li v-for="(valor, clave) in filtrados" :key="clave">
                <span v-if="valor != ''" class="font-semibold capitalize">{{ clave }}: </span>
                <span v-if="valor > 0 || valor != ''" class="font-medium">{{ valor }}</span>
              </li>
              <li>
                <span class="font-semibold capitalize">Dificultad: </span>
                <span class="font-medium">{{ receta.dificultad?.nombre }}</span>
              </li>
            </ul>
            <div class="my-4">
              <h3 class="uppercase text-lg font-bold">Ingredientes</h3>
              <ul>
                <li v-for="ingrediente in receta.ingredientes" :key="ingrediente.id">
                  {{ ingrediente.nombre }} - {{ ingrediente.pivot.cantidad }}
                  {{ ingrediente.pivot.unidad }}
                </li>
              </ul>
            </div>
          </div>
          <div v-if="getImagen(receta.imagen)" class="w-full aspect-[4/3] overflow-hidden rounded md:col-span-5">
            <img
              :src="getImagen(receta.imagen)"
              :alt="receta.nombre"
              class="w-full h-full object-cover"
              fetchpriority="high"
            />
          </div>
        </div>

        <div>
          <h3 class="uppercase text-lg font-bold">Instrucciones</h3>
          <div class="text-lg bg-white py-4 instrucciones" v-html="safeInstrucciones"></div>
        </div>
      </div>
      <GoBackButton class="w-full mt-2">Atrás</GoBackButton>
    </div>
  </GuestLayout>
</template>
<style></style>
