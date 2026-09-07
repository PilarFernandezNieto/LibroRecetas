<script setup>
import { onMounted, computed } from 'vue'
import DOMPurify from 'dompurify'
import { useRoute } from 'vue-router'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import GoBackButton from '../../../components/GoBackButton.vue'
import { FwbSpinner } from 'flowbite-vue'
import { useRecetaStore } from '@/stores/recetaStore'
import { useImagen } from '@/composables/useImagen'

const recetaStore = useRecetaStore()
const route = useRoute()
const id = route.params.id
const { getImagen } = useImagen()

onMounted(() => recetaStore.fetchReceta(id))

const filtrados = computed(() => {
  const clavesPermitidas = ['comensales', 'tiempo', 'origen']
  return Object.fromEntries(
    Object.entries(recetaStore.receta).filter(([clave]) => clavesPermitidas.includes(clave)),
  )
})
const safeInstrucciones = computed(() => DOMPurify.sanitize(recetaStore.receta.instrucciones ?? ''))
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h1 class="font-titulares text-3xl text-verde-900 leading-tight">
        {{ recetaStore.receta.nombre }}
      </h1>
    </template>
    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-papel overflow-hidden shadow-sm rounded-sm px-4 py-4 md:px-8">
          <template v-if="recetaStore.loading">
            <div class="flex justify-center mb-8"><fwb-spinner size="10" color="green" /></div>
          </template>
          <div class="md:grid grid-cols-2 gap-6 my-4 font-principal text-verde-900">
            <div>
              <p class="text-lg text-verde-900/80">{{ recetaStore.receta.intro }}</p>
              <ul class="mt-4 space-y-1">
                <li v-for="(valor, clave) in filtrados" :key="clave">
                  <span v-if="valor != ''" class="font-semibold capitalize">{{ clave }}: </span>
                  <span v-if="valor > 0 || valor != ''">{{ valor }}</span>
                </li>
                <li>
                  <span class="font-semibold capitalize">Dificultad: </span
                  ><span>{{ recetaStore.receta.dificultad?.nombre }}</span>
                </li>
                <li>
                  <span class="font-semibold capitalize">Categoría: </span
                  ><span>{{ recetaStore.receta.categoria?.nombre }}</span>
                </li>
              </ul>
              <div class="my-4">
                <h3 class="uppercase text-sm font-semibold tracking-wide text-verde-900/70">
                  Ingredientes
                </h3>
                <ul class="mt-1">
                  <li v-for="ingrediente in recetaStore.receta.ingredientes" :key="ingrediente.id">
                    {{ ingrediente.nombre }} - {{ ingrediente.pivot.cantidad }}
                    {{ ingrediente?.pivot.unidad }}
                  </li>
                </ul>
              </div>
            </div>
            <div
              v-if="getImagen(recetaStore.receta.imagen)"
              class="w-full aspect-[4/3] overflow-hidden rounded-sm"
            >
              <img
                :src="getImagen(recetaStore.receta.imagen)"
                :alt="recetaStore.receta.nombre"
                class="w-full h-full object-cover"
                fetchpriority="high"
              />
            </div>
          </div>

          <div>
            <h3 class="uppercase text-sm font-semibold tracking-wide text-verde-900/70">
              Instrucciones
            </h3>
            <div
              class="my-4 text-lg bg-crema border border-papel p-4 rounded-sm instrucciones"
              v-html="safeInstrucciones"
            ></div>
          </div>
          <GoBackButton class="w-full mt-2">Atrás</GoBackButton>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
