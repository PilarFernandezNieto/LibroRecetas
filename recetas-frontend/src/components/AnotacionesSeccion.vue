<script setup>
import { storeToRefs } from 'pinia'
import { useAnotaciones } from '../composables/useAnotaciones'
import { useAuthStore } from '../stores/auth.js'
import AnotacionForm from './AnotacionForm.vue'
import AnotacionItem from './AnotacionItem.vue'

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)
console.log(isLoggedIn)
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
    <AnotacionForm v-if="isLoggedIn" :slug="slug" />
    <p v-if="isLoading">Cargando...</p>
    <p v-else-if="isError">Ha ocurrido un error</p>
    <p v-else-if="!anotaciones.length">Todavía no hay notas</p>

    <ul v-else>
      <AnotacionItem v-for="a in anotaciones" :key="a.id" :anotacion="a" />
    </ul>
  </div>
</template>
