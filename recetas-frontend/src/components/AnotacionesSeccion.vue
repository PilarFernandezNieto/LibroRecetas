<script setup>
import { storeToRefs } from 'pinia'
import { useAnotaciones } from '../composables/useAnotaciones'
import { useAuthStore } from '../stores/auth.js'
import AnotacionForm from './AnotacionForm.vue'
import AnotacionItem from './AnotacionItem.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { isLoggedIn, user } = storeToRefs(useAuthStore())
const route = useRoute()
const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})
const { data: anotaciones, isLoading, isError } = useAnotaciones(props.slug)

// La nota del usuario actual en este receta (undefined si no ha escrito ninguna)
const miAnotacion = computed(() => anotaciones.value?.find((a) => a.autor?.id === user.value?.id))

const estadoUsuario = computed(() => {
  if (!isLoggedIn.value) return 'invitado'
  if (!user.value.email_verified_at) return 'sin-verificar'
  // Sin la lista (cargando o con un error) no sabemos si ya tiene nota: no mostramos nada
  if (!anotaciones.value) return 'sin-datos'
  return miAnotacion.value ? 'ya-anotada' : 'puede-anotar'
})
</script>
<template>
  <h2 class="font-titulares text-2xl text-terracota-oscuro mb-4">Notas</h2>
  <div class="p-4 border border-terracota-oscuro rounded fondo-base">
    <p v-if="estadoUsuario === 'invitado'" class="mb-4">
      <RouterLink :to="{ name: 'login', query: { redirect: route.fullPath } }" class="underline"
        >Inicia Sesión</RouterLink
      >
      para dejar tu nota.
    </p>
    <p v-else-if="estadoUsuario === 'sin-verificar'" class="mb-4">
      <RouterLink :to="{ name: 'verify-email' }" class="underline">Verifica tu correo</RouterLink>
      para poder dejar notas.
    </p>
    <p v-else-if="estadoUsuario === 'ya-anotada'" class="mb-4">
      Ya has dejado tu nota en esta receta.
    </p>

    <AnotacionForm v-else-if="estadoUsuario === 'puede-anotar'" :slug="slug" />
    <p v-if="isLoading">Cargando...</p>
    <p v-else-if="isError">Ha ocurrido un error</p>
    <p v-else-if="!anotaciones.length">Todavía no hay notas</p>

    <ul v-else>
      <AnotacionItem v-for="a in anotaciones" :key="a.id" :anotacion="a" />
    </ul>
  </div>
</template>
