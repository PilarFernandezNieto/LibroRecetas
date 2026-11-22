<script setup>
import InputLabel from './InputLabel.vue'
import TextInput from './TextInput.vue'
import PrimaryButton from './PrimaryButton.vue'
import { computed, ref } from 'vue'
import { useCrearAnotacion } from '../composables/useAnotaciones.js'
import InputError from './InputError.vue'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const hoy = new Date().toLocaleDateString('en-CA')
const form = ref({
  texto: '',
  valoracion: '',
  fecha_prueba: hoy,
})

const { mutate: crear, isPending, error } = useCrearAnotacion(props.slug)

// Errores de validación (422) que devuelve Laravel
const errores = computed(() => error.value?.response?.data?.errors ?? {})

const guardar = () => {
  crear(form.value, {
    onSuccess: () => {
      form.value = { texto: '', valoracion: '', fecha_prueba: hoy }
    },
  })
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
        <InputLabel for="valoracion" value="Valoración" />
        <select
          v-model.number="form.valoracion"
          id="valoracion"
          class="mt-1 block w-full border-terracota-oscuro bg-papel focus:border-terracota-oscuro rounded-sm shadow-sm"
        >
          <option value="" disabled>Elige una puntuación</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
        <InputError class="mt-2" :message="errores.valoracion?.[0]" />
      </div>
      <InputError class="mt-2" :message="errores.receta?.[0]" />
      <PrimaryButton class="mt-4" :class="{ 'opacity-25': isPending }" :disabled="isPending"
        >Guardar nota</PrimaryButton
      >
    </form>
  </div>
</template>
