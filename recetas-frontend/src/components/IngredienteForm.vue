<script setup>
import { ref } from 'vue'
import InputLabel from './InputLabel.vue'
import TextInput from './TextInput.vue'
import PrimaryButton from './PrimaryButton.vue'
import GoBackButton from './GoBackButton.vue'
import InputError from './InputError.vue'
import { useImagen } from '../composables/useImagen'

const props = defineProps({
  ingrediente: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  processing: { type: Boolean, default: false },
  textoBoton: { type: String, default: 'Guardar' },
})
const emit = defineEmits(['submit'])
const { getImagen } = useImagen()

const form = ref({
  nombre: props.ingrediente.nombre || '',
  descripcion: props.ingrediente.descripcion || '',
})
const nuevaImagen = ref(null)
const handleImageChange = (e) => {
  nuevaImagen.value = e.target.files[0]
}

const handleSubmit = () => {
  const formData = new FormData()
  formData.append('nombre', form.value.nombre)
  formData.append('descripcion', form.value.descripcion)
  if (nuevaImagen.value) formData.append('imagen', nuevaImagen.value)
  emit('submit', formData)
}
</script>
<template>
  <div class="py-12">
    <div class="w-[90%] lg:w-contenedor-sm max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-papel overflow-hidden shadow-sm rounded-sm py-4 px-4 md:px-8">
        <div class="bg-crema border border-papel shadow-sm p-6 rounded-sm">
          <form @submit.prevent="handleSubmit">
            <div>
              <InputLabel for="nombre" value="Nombre" />
              <TextInput
                id="nombre"
                type="text"
                class="mt-2 block w-full"
                v-model="form.nombre"
                autofocus
              />
              <InputError class="mt-2" :message="errors.nombre?.[0]" />
            </div>

            <div class="my-6">
              <label
                for="imagen"
                class="cursor-pointer inline-flex bg-verde text-crema py-2 px-4 rounded-sm hover:bg-verde-800 focus:ring-2 focus:ring-verde text-sm font-principal"
              >
                Subir imagen
              </label>
              <input type="file" id="imagen" @change="handleImageChange" class="hidden" />
              <InputError class="mt-2" :message="errors.imagen?.[0]" />
            </div>

            <div v-if="getImagen(ingrediente.imagen)" class="mb-4">
              <img
                :src="getImagen(ingrediente.imagen)"
                alt="imagen actual"
                class="w-40 rounded-sm"
              />
            </div>

            <div>
              <InputLabel for="descripcion" value="Descripción" />
              <textarea
                id="descripcion"
                v-model="form.descripcion"
                class="mt-2 w-full min-h-28 p-2 bg-crema border border-papel focus:border-verde focus:ring-verde shadow-sm rounded-sm"
              ></textarea>
              <InputError class="mt-2" :message="errors.descripcion?.[0]" />
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <GoBackButton>Atrás</GoBackButton>
              <PrimaryButton
                :class="{ 'opacity-25': processing }"
                :disabled="processing"
                >{{ textoBoton }}</PrimaryButton
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
