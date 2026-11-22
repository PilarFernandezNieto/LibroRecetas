<script setup>
import { computed } from 'vue'

const props = defineProps({
  anotacion: {
    type: Object,
    required: true,
  },
})

const fechaPrueba = computed(() => {
  const [anio, mes, dia] = props.anotacion.fecha_prueba.split('-')
  return `${dia}-${mes}-${anio}`
})
</script>
<template>
  <li class="py-3 border-b border-antracita/10 las:border-b-0">
    <div class="flex justify-between gap-4 text-sm">
      <span class="font-semibold">{{ anotacion.autor?.name }}</span>
      <span>Probada el {{ fechaPrueba }}</span>
    </div>
    <p class="mt-1 text-sm">Valoración: {{ anotacion.valoracion }}/5</p>
    <p class="mt-2 whitespace-pre-line">{{ anotacion.texto }}</p>
  </li>
</template>
