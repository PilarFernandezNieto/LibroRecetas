<script setup>
import { storeToRefs } from 'pinia'
import { computed, inject, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useEliminarAnotacion } from '../composables/useAnotaciones'
import AnotacionForm from './AnotacionForm.vue'
import SecondaryButton from './SecondaryButton.vue'
import EditButton from './EditButton.vue'

const props = defineProps({
  anotacion: {
    type: Object,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
})
const swal = inject('$swal')
const { user } = storeToRefs(useAuthStore())
const { mutate: eliminar } = useEliminarAnotacion(props.slug)
const editando = ref(false)

const fechaPrueba = computed(() => {
  const [anio, mes, dia] = props.anotacion.fecha_prueba.split('-')
  return `${dia}-${mes}-${anio}`
})

// el autor gestiona su nota; un admin, todas
const puedesGestionar = computed(() => {
  if (!user.value) return false
  return user.value.id === props.anotacion.autor?.id || !!user.value.is_admin
})

const confirmarBorrado = () => {
  swal({
    icon: 'warning',
    text: '¿Seguro que desea eliminar esta nota?',
    showDenyButton: true,
    denyButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) eliminar(props.anotacion.id)
  })
}
</script>
<template>
  <li class="py-3 border-b border-antracita/10 las:border-b-0">
    <AnotacionForm
      v-if="editando"
      :slug="slug"
      :anotacion="anotacion"
      @terminado="editando = false"
    />
    <template v-else>
      <div class="flex justify-between gap-4 text-sm">
        <span class="font-semibold">{{ anotacion.autor?.name }}</span>
        <span>Probada el {{ fechaPrueba }}</span>
      </div>
      <p class="mt-1 text-sm">Valoración: {{ anotacion.valoracion }}/5</p>
      <p class="mt-2 whitespace-pre-line">{{ anotacion.texto }}</p>
      <div v-if="puedesGestionar" class="mt-4 flex gap-3">
        <SecondaryButton @click="editando = true">Editar</SecondaryButton>
        <SecondaryButton @click="confirmarBorrado">Borrar</SecondaryButton>
      </div>
    </template>
  </li>
</template>
