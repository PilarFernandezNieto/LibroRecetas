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
const slug = route.params.slug
const { getImagen } = useImagen()

onMounted(() => recetaStore.fetchReceta(slug))

const filtrados = computed(() => {
  const clavesPermitidas = ['comensales', 'tiempo', 'origen']
  return Object.fromEntries(
    Object.entries(recetaStore.receta).filter(([clave]) => clavesPermitidas.includes(clave)),
  )
})
const safeInstrucciones = computed(() =>
  DOMPurify.sanitize(recetaStore.receta.instrucciones ?? '', { ADD_ATTR: ['target'] }),
)
</script>

<template>
  <AuthenticatedLayout>
    <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:p-6 lg:p-8">
      <div class="bg-papel overflow-hidden shadow-sm rounded-sm py-4 px-4 md:px-8">
        <template v-if="loading">
          <div class="flex justify-center my-16">
            <fwb-spinner size="10" color="green" />
          </div>
        </template>

        <div v-else class="md:grid md:grid-cols-12 gap-10 my-8 items-start">
          <div class="md:col-span-4 relative">
            <div
              v-if="getImagen(recetaStore.receta.imagen)"
              class="w-full aspect-4/5 overflow-hidden relative"
            >
              <img
                :src="getImagen(recetaStore.receta.imagen)"
                :alt="recetaStore.receta.nombre"
                class="w-full h-full object-cover"
                fetchpriority="high"
              />
              <div
                class="absolute inset-0 pointer-events-none"
                style="
                  background: linear-gradient(
                    to top,
                    rgba(20, 18, 15, 0.75),
                    rgba(20, 18, 15, 0) 45%
                  );
                "
              ></div>
            </div>
            <div v-else class="w-full aspect-4/5 overflow-hidden bg-papel">
              <img src="/img/no_img.png" class="w-full h-full object-cover" />
            </div>
            <div class="absolute left-6 bottom-6 flex gap-2 flex-wrap">
              <span
                v-if="recetaStore.receta.categoria?.nombre"
                class="bg-crema text-antracita text-xs font-principal px-4 py-2 rounded-sm"
              >
                {{ recetaStore.receta.categoria.nombre }}
              </span>
              <span
                v-if="recetaStore.receta.dificultad?.nombre"
                class="bg-verde text-crema text-xs font-principal px-4 py-2 rounded-sm"
              >
                Dificultad: {{ recetaStore.receta.dificultad.nombre }}
              </span>
            </div>
          </div>

          <div class="md:col-span-8">
            <h1 class="font-titulares text-4xl md:text-5xl leading-tight text-verde-900 mt-3 mb-5">
              {{ recetaStore.receta.nombre }}
            </h1>
            <p class="text-lg text-verde-900/80 font-principal mb-6 max-w-lg">
              {{ recetaStore.receta.intro }}
            </p>

            <div
              v-if="Object.keys(filtrados).length"
              class="flex gap-8 justify-between flex-wrap mb-8 pb-6 border-b border-antracita/10"
            >
              <div v-for="(valor, clave) in filtrados" :key="clave">
                <div
                  v-if="valor != '' && (valor > 0 || valor != '')"
                  class="text-xs uppercase tracking-wide text-verde-900/60 font-principal"
                >
                  {{ clave }}
                </div>
                <div
                  v-if="valor != '' && (valor > 0 || valor != '')"
                  class="text-base font-principal text-verde-900 mt-1"
                >
                  {{ valor }}
                </div>
              </div>
            </div>

            <div class="mt-2 bg-marron-700 text-crema rounded-sm p-7 mb-10">
              <h2 class="font-titulares text-xl mb-4">Ingredientes</h2>
              <ul class="list-none pl-0 columns-1 sm:columns-2 gap-8 font-principal space-y-2">
                <li
                  v-for="ingrediente in recetaStore.receta.ingredientes"
                  :key="ingrediente.id"
                  class="relative pl-4 break-inside-avoid"
                >
                  <span
                    class="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-verde-200"
                  ></span>
                  {{ ingrediente.nombre }} — {{ ingrediente.pivot.cantidad }}
                  {{ ingrediente.pivot.unidad }}
                </li>
              </ul>
            </div>

            <h2 class="font-titulares text-2xl text-verde-900 mb-4">Elaboración</h2>
            <div
              class="text-base font-principal instrucciones text-verde-900/90"
              v-html="safeInstrucciones"
            ></div>

            <GoBackButton class="mt-8">Atrás</GoBackButton>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
