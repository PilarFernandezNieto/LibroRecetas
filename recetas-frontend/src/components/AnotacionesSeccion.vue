<script setup>
import { useAnotaciones } from '../composables/useAnotaciones'
import AnotacionItem from './AnotacionItem.vue'
const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const { data: anotaciones, isLoading, isError } = useAnotaciones(props.slug)
</script>
<template>
  <h2 class="font-titulares text-2xl text-terracota-oscuro mb-4">Notas</h2>
  <div class="p-4 border border-terracota-oscuro rounded fondo-base">
    <p v-if="isLoading">Cargando...</p>
    <p v-else-if="isError">Ha ocurrido un error</p>
    <p v-else-if="!anotaciones.length">Todavía no hay notas</p>
    <ul v-else>
      <AnotacionItem v-for="a in anotaciones" :key="a.id" :anotacion="a" />
    </ul>
  </div>
</template>
