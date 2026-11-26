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
import AnotacionesSeccion from '../components/AnotacionesSeccion.vue'
import { useRecetaPublica } from '../composables/useQueries.js'
import StarRating from '../components/StarRating.vue'

const route = useRoute()
const slug = route.params.slug

const { data: receta, isLoading, isError } = useRecetaPublica(slug)

const filtrados = computed(() => {
  const clavesPermitidas = ['comensales', 'tiempo', 'origen']
  return Object.fromEntries(
    Object.entries(receta.value ?? {}).filter(([clave]) => clavesPermitidas.includes(clave)),
  )
})
const safeInstrucciones = computed(() =>
  DOMPurify.sanitize(receta.value?.instrucciones ?? '', { ADD_ATTR: ['target'] }),
)

const media = computed(() => {
  Number(receta.value?.anotaciones_avg_valoracion ?? 0).toLocaleString('es-ES', {
    maximumFractionDigits: 1,
  })
})
console.log(media.value)

const { getImagen } = useImagen()
</script>

<template>
  <GuestLayout>
    <div class="w-full mb-4">
      <template v-if="isLoading">
        <div class="flex justify-center my-16">
          <fwb-spinner size="10" color="green" />
        </div>
      </template>
      <p v-else-if="isError" class="text-center my-16 font-principal">
        No se ha podido cargar la receta.
      </p>

      <div v-else class="md:grid md:grid-cols-12 gap-10 my-8 items-start">
        <div class="md:col-span-5 relative">
          <div v-if="getImagen(receta.imagen)" class="w-full aspect-4/5 overflow-hidden relative">
            <img
              :src="getImagen(receta.imagen)"
              :alt="receta.nombre"
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
              v-if="receta.categoria?.nombre"
              class="bg-papel text-antracita text-xs font-principal px-4 py-2 rounded-sm"
            >
              {{ receta.categoria.nombre }}
            </span>
            <span
              v-if="receta.dificultad?.nombre"
              class="bg-terracota-claro text-papel text-xs font-principal px-4 py-2 rounded-sm"
            >
              Dificultad: {{ receta.dificultad.nombre }}
            </span>
          </div>
        </div>

        <div class="md:col-span-7">
          <h1
            class="font-titulares text-4xl md:text-5xl leading-tight text-terracota-oscuro mt-3 mb-5"
          >
            {{ receta.nombre }}
          </h1>
          <div
            v-if="receta.anotaciones_count > 0"
            class="flex items-center gap-2 mb-6 font-principal text-antracita/80"
          >
            <StarRating :model-value="receta.anotaciones_avg_valoracion" />
            <span class="text-sm"
              >{{ media }} - {{ receta.anotaciones_count }}
              {{ receta.anotaciones_count === 1 ? 'nota' : 'notas' }}</span
            >
          </div>
          <p class="text-lg text-antracita/80 font-principal mb-6 max-w-lg">{{ receta.intro }}</p>

          <div
            v-if="Object.keys(filtrados).length"
            class="flex gap-8 justify-between flex-wrap mb-8 pb-6 border-b border-antracita/10"
          >
            <div v-for="(valor, clave) in filtrados" :key="clave">
              <div
                v-if="valor != '' && (valor > 0 || valor != '')"
                class="text-xs uppercase tracking-wide text-antracita/80 font-principal"
              >
                {{ clave }}
              </div>
              <div
                v-if="valor != '' && (valor > 0 || valor != '')"
                class="text-base font-principal text-antracita mt-1"
              >
                {{ valor }}
              </div>
            </div>
          </div>

          <div class="mt-2 bg-terracota text-papel rounded-sm p-7 mb-10">
            <h2 class="font-titulares text-xl mb-4">Ingredientes</h2>
            <ul class="list-none pl-0 columns-1 sm:columns-2 gap-8 font-principal space-y-2">
              <li
                v-for="ingrediente in receta.ingredientes"
                :key="ingrediente.id"
                class="relative pl-4 break-inside-avoid"
              >
                <span class="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-papel"></span>
                {{ ingrediente.nombre }} — {{ ingrediente.pivot.cantidad }}
                {{ ingrediente.pivot.unidad }}
              </li>
            </ul>
          </div>

          <h2 class="font-titulares text-2xl text-terracota-oscuro mb-4">Elaboración</h2>
          <div
            class="text-base font-principal instrucciones text-antracita/90 marker:text-terracota-claro marker:text-2xl"
            v-html="safeInstrucciones"
          ></div>
        </div>
      </div>
      <AnotacionesSeccion v-if="receta" :slug="slug" />
    </div>
    <div class="flex justify-end">
      <GoBackButton class="my-8">Atrás</GoBackButton>
    </div>
  </GuestLayout>
</template>
<style></style>
