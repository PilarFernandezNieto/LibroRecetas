<script setup>
import InputLabel from './InputLabel.vue'
import TextInput from './TextInput.vue'
import PrimaryButton from './PrimaryButton.vue'
import SecondaryButton from './SecondaryButton.vue'
import StarRating from './StarRating.vue'
import { computed, ref } from 'vue'
import { useActualizarAnotacion, useCrearAnotacion } from '../composables/useAnotaciones.js'
import InputError from './InputError.vue'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
  anotacion: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['terminado'])

const hoy = new Date().toLocaleDateString('en-CA')
const form = ref({
  texto: props.anotacion?.texto ?? '',
  valoracion: props.anotacion?.valoracion ?? '',
  fecha_prueba: props.anotacion?.fecha_prueba ?? hoy,
})

const crear = useCrearAnotacion(props.slug)
const actualizar = useActualizarAnotacion(props.slug)

// El modo se decide una sola vez: este componente se monta ya en modo crear o en modo editar
const editando = props.anotacion !== null
const mutacion = editando ? actualizar : crear
const isPending = mutacion.isPending
const errores = computed(() => mutacion.error.value?.response.data?.errors ?? {})

const guardar = () => {
  if (editando) {
    actualizar.mutate(
      { id: props.anotacion.id, ...form.value },
      { onSuccess: () => emit('terminado') },
    )
  } else {
    crear.mutate(form.value, {
      onSuccess: () => {
        form.value = { texto: '', valoracion: '', fecha_prueba: hoy }
      },
    })
  }
}
</script>
<template>
  <div>
    <form @submit.prevent="guardar" class="mb-6">
      <div>
        <InputLabel for="texto" value="Anotación" />
        <textarea
          v-model="form.texto"
          id="texto"
          rows="4"
          placeholder="¿Qué tal te salió?"
          class="mt-1 block w-full border-terracota-oscuro bg-papel focus:border-terracota-oscuro rounded-sm shadow-sm placeholder:text-gray-500"
        ></textarea>
        <InputError class="mt-2" :message="errores.texto?.[0]" />
      </div>

      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel for="fecha_prueba" value="Fecha" />
          <TextInput
            id="fecha_prueba"
            type="date"
            class="mt-2 block w-full"
            v-model="form.fecha_prueba"
            :max="hoy"
          />
          <InputError class="mt-2" :message="errores.fecha_prueba?.[0]" />
        </div>
      </div>

      <div class="mt-4">
        <InputLabel value="Valoración" />
        <StarRating v-model="form.valoracion" editable />
        <InputError class="mt-2" :message="errores.valoracion?.[0]" />
      </div>
      <InputError class="mt-2" :message="errores.receta?.[0]" />
      <div class="mt-4 flex gap-3">
        <PrimaryButton class="mt-4" :class="{ 'opacity-25': isPending }" :disabled="isPending">{{
          editando ? 'Guardar Cambios' : 'Guardar Nota'
        }}</PrimaryButton>
        <SecondaryButton v-if="editando" @click="emit('terminado')">Cancelar</SecondaryButton>
      </div>
    </form>
  </div>
</template>
