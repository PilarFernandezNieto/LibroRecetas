<script setup>
import { useAnotaciones } from '../composables/useAnotaciones'
const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const { data: anotaciones, isLoading, isError } = useAnotaciones(props.slug)
</script>
<template>
  <p v-if="isLoading">Cargando...</p>
  <p v-else-if="!anotaciones.lenght">Todavía no hay notas</p>
  <ul v-else>
    <li v-for="a in anotaciones" :key="a.id">{{ a.author?.name }}: {{ a.texto }}</li>
  </ul>
</template>
