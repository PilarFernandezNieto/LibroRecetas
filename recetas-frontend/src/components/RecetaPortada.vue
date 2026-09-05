<script setup>
import { computed } from 'vue'
import NewElementLink from './NewElementLink.vue'
import { useImagen } from '../composables/useImagen'

const { getImagen } = useImagen()

const props = defineProps({
  receta: {
    type: Object,
    required: true,
  },
})
const filtrados = computed(() => {
  const clavesPermitidas = ['comensales', 'tiempo', 'origen']
  return Object.fromEntries(
    Object.entries(props.receta).filter(([clave]) => clavesPermitidas.includes(clave)),
  )
})
</script>

<template>
  <div
    class="flex flex-col overflow-hidden bg-papel h-full transition-transform hover:-translate-y-1 hover:shadow-lg"
  >
    <div v-if="getImagen(receta.imagen)" class="w-full aspect-4/3 overflow-hidden">
      <img
        class="w-full h-full object-cover object-center"
        :src="getImagen(receta.imagen)"
        :alt="`Imagen de ${receta.nombre}`"
        loading="lazy"
      />
    </div>
    <div v-else class="w-full aspect-4/3 overflow-hidden bg-crema">
      <img src="/img/no_img.png" class="w-full h-full object-cover" />
    </div>
    <div class="flex-1 flex flex-col px-5 py-5">
      <span class="text-marron-700 text-xs font-principal font-semibold tracking-widest uppercase">
        {{ receta.categoria?.nombre }}<template v-if="receta.dificultad?.nombre"> · {{ receta.dificultad.nombre }}</template>
      </span>
      <h3 class="font-titulares text-xl text-verde-900 mt-2 mb-2 min-h-14 leading-tight">
        {{ receta.nombre }}
      </h3>
      <ul class="mb-3 flex-1 text-sm text-verde-900/80 font-principal space-y-1">
        <li v-for="(valor, clave) in filtrados" :key="clave">
          <span v-if="valor != ''" class="font-semibold capitalize">{{ clave }}: </span>
          <span v-if="valor > 0 || valor != ''" class="font-medium">{{ valor }}</span>
        </li>
      </ul>
      <NewElementLink class="mt-2 self-start" :to="{ name: 'ver-receta', params: { id: receta.id } }"
        >Ver receta</NewElementLink
      >
    </div>
  </div>
</template>
