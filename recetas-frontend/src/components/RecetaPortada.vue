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
  <RouterLink
    :to="{ name: 'ver-receta', params: { id: receta.id } }"
    class="block relative rounded-sm overflow-hidden group"
    style="aspect-ratio: 4/5"
  >
    <img
      v-if="getImagen(receta.imagen)"
      :src="getImagen(receta.imagen)"
      :alt="`Imagen de ${receta.nombre}`"
      loading="lazy"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <img
      v-else
      src="/img/no_img.png"
      class="absolute inset-0 w-full h-full object-cover bg-papel"
    />
    <div
      class="absolute inset-0 pointer-events-none"
      style="background: linear-gradient(to top, rgba(20, 18, 15, 0.9), rgba(20, 18, 15, 0.1) 55%)"
    ></div>
    <div class="absolute inset-x-0 bottom-0 p-6 pointer-events-none">
      <span class="text-[#c9d6b8] text-xs tracking-wider uppercase font-principal">
        {{ receta.categoria?.nombre }} · {{ receta.dificultad?.nombre }}
      </span>
      <h3 class="font-titulares text-crema text-2xl mt-2 leading-tight">
        {{ receta.nombre }}
      </h3>
    </div>
  </RouterLink>
</template>
