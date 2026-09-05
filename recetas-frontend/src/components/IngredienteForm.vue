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
  if (nuevaImagen.value) {
    formData.append('imagen', nuevaImagen.value)
  }
  emit('submit', formData)
}
</script>

<template>
  <div class="py-12">
    <div class="w-[90%] lg:w-contenedor-sm max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-amber-50 overflow-hidden shadow-sm sm:rounded-md py-4 px-4 md:px-8">
        <div class="bg-white shadow-sm p-4 rounded-md">
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

            <div class="my-8">
              <label
                for="imagen"
                class="cursor-pointer bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-900 focus:ring-2 focus:ring-green-800"
              >
                Subir imagen
              </label>
              <input type="file" id="imagen" @change="handleImageChange" class="hidden" />
              <InputError class="mt-2" :message="errors.imagen?.[0]" />
            </div>

            <div v-if="getImagen(ingrediente.imagen)" class="mb-4">
              <img :src="getImagen(ingrediente.imagen)" alt="imagen actual" class="w-40" />
            </div>

            <div>
              <InputLabel for="descripcion" value="Descripción" />
              <textarea
                id="descripcion"
                v-model="form.descripcion"
                class="mt-2 w-full min-h-[7rem] p-2 bg-white border border-gray-300 focus:border-green-800 focus:ring-green-800 shadow-sm rounded-md"
              ></textarea>
              <InputError class="mt-2" :message="errors.descripcion?.[0]" />
            </div>

            <PrimaryButton
              class="w-full mt-2"
              :class="{ 'opacity-25': processing }"
              :disabled="processing"
            >
              {{ textoBoton }}
            </PrimaryButton>
          </form>
          <GoBackButton class="w-full mt-2">Atrás</GoBackButton>
        </div>
      </div>
    </div>
  </div>
</template>
