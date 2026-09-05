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
  <!-- <div class="rounded-md overflow-hidden bg-white shadow mb-4 border border-gray-300"> -->
      <div class="flex flex-col rounded-md overflow-hidden bg-white shadow border border-gray-300 h-full">
    <div class="flex-1 px-6 py-4">
      <div class="font-bold text-xl mb-2 min-h-[56px]">{{ receta.nombre }}</div>
      <ul class="my-4 min-h-[180px]">
        <li> <span class="font-semibold capitalize">Categoría: </span class="font-medium"><span>{{ receta.categoria?.nombre }}</span></li>
        <li v-for="(valor, clave) in filtrados" :key="clave">
            <span v-if="valor != ''" class="font-semibold capitalize">{{ clave }}: </span>
            <span v-if="valor >0 || valor != ''" class="font-medium">{{ valor }}</span>
        </li>
        <li> <span class="font-semibold capitalize">Dificultad: </span class="font-medium"><span>{{ receta.dificultad?.nombre }}</span></li>
        
      </ul>
      <NewElementLink :to="{ name: 'ver-receta', params: {id: receta.id} }">Ver receta</NewElementLink>
    
    </div>
    <div v-if="getImagen(receta.imagen)" class="w-full aspect-[4/3] overflow-hidden">
      <img class="w-full h-full object-cover object-center" :src="getImagen(receta.imagen)" :alt="`Imagen de ${receta.nombre}`" loading="lazy" />
    </div>
  </div>
</template>
