<script setup>
import { ref, watch, nextTick } from 'vue'
import InputLabel from './InputLabel.vue'
import TextInput from './TextInput.vue'
import PrimaryButton from './PrimaryButton.vue'
import GoBackButton from './GoBackButton.vue'
import InputError from './InputError.vue'
import EditorTiny from './EditorTiny.vue'
import Modal from './Modal.vue'
import { useIngredientesTodos, useCategorias, useDificultades } from '../composables/useQueries'

const props = defineProps({
  receta: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  processing: { type: Boolean, default: false },
  imagenActual: { type: String, default: null },
  textoBoton: { type: String, default: 'Guardar' },
})

const emit = defineEmits(['submit'])

const { data: ingredientesTodos } = useIngredientesTodos()
const { data: categorias } = useCategorias()
const { data: dificultades } = useDificultades()

const form = ref({
  nombre: props.receta.nombre || '',
  origen: props.receta.origen || '',
  tiempo: props.receta.tiempo || '',
  comensales: props.receta.comensales || '',
  dificultad_id: props.receta.dificultad_id || 0,
  categoria_id: props.receta.categoria_id || 0,
  intro: props.receta.intro || '',
  instrucciones: props.receta.instrucciones || '',
})

const ingredientesSeleccionados = ref(
  (props.receta.ingredientes || []).map((ing) => ({ ...ing }))
)
const ingredienteSeleccionado = ref(null)
const cantidadIngrediente = ref('')
const unidadMedida = ref('')
const showModal = ref(false)
const nuevaImagen = ref(null)
const selectRef = ref(null)
const cantidadInputRef = ref(null)

watch(showModal, async (val) => {
  if (val) {
    await nextTick()
    cantidadInputRef.value?.focus()
  }
})

const handleIngredientChange = (event) => {
  const selectedId = event.target.value
  const ingrediente = ingredientesTodos.value?.find((ing) => ing.id === parseInt(selectedId))
  if (ingrediente) {
    ingredienteSeleccionado.value = ingrediente
    showModal.value = true
  }
}

const eliminarIngrediente = (index) => {
  ingredientesSeleccionados.value.splice(index, 1)
}

const closeModal = () => {
  showModal.value = false
  cantidadIngrediente.value = ''
  unidadMedida.value = ''
  ingredienteSeleccionado.value = null
  if (selectRef.value) selectRef.value.value = ''
}

const handleCantidadChange = () => {
  if (cantidadIngrediente.value) {
    ingredientesSeleccionados.value.push({
      ...ingredienteSeleccionado.value,
      cantidad: cantidadIngrediente.value,
      unidad: unidadMedida.value,
    })
    closeModal()
  }
}

const handleImageChange = (e) => {
  nuevaImagen.value = e.target.files[0]
}

const handleSubmit = () => {
  const formData = new FormData()
  formData.append('nombre', form.value.nombre)
  formData.append('origen', form.value.origen)
  formData.append('tiempo', form.value.tiempo)
  formData.append('comensales', form.value.comensales)
  formData.append('dificultad_id', form.value.dificultad_id)
  formData.append('categoria_id', form.value.categoria_id)
  formData.append('intro', form.value.intro)
  formData.append('instrucciones', form.value.instrucciones)

  ingredientesSeleccionados.value.forEach((ing, index) => {
    formData.append(`ingredientes[${index}][ingrediente_id]`, ing.id)
    formData.append(`ingredientes[${index}][cantidad]`, ing.cantidad)
    formData.append(`ingredientes[${index}][unidad]`, ing.unidad)
  })

  if (nuevaImagen.value) {
    formData.append('imagen', nuevaImagen.value)
  }

  emit('submit', formData)
}
</script>

<template>
  <div class="py-12">
    <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
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

            <div class="mt-2">
              <InputLabel for="intro" value="Introducción" />
              <TextInput id="intro" type="text" class="mt-2 block w-full" v-model="form.intro" />
              <InputError class="mt-2" :message="errors.intro?.[0]" />
            </div>

            <div class="mt-2 md:grid grid-cols-3 gap-4">
              <div>
                <InputLabel for="origen" value="Origen" />
                <TextInput
                  id="origen"
                  type="text"
                  class="mt-2 block w-full"
                  v-model="form.origen"
                />
                <InputError class="mt-2" :message="errors.origen?.[0]" />
              </div>
              <div class="mt-2 md:mt-0">
                <InputLabel for="comensales" value="Comensales" />
                <TextInput
                  id="comensales"
                  type="number"
                  class="mt-2 block w-full"
                  v-model="form.comensales"
                />
              </div>
              <div class="mt-2 md:mt-0">
                <InputLabel for="tiempo" value="Tiempo" />
                <TextInput
                  id="tiempo"
                  type="text"
                  class="mt-2 block w-full"
                  v-model="form.tiempo"
                />
                <InputError class="mt-2" :message="errors.tiempo?.[0]" />
              </div>
            </div>

            <div class="mt-2 md:grid grid-cols-2 gap-4">
              <div class="mt-2 md:mt-0">
                <InputLabel for="categoria" value="Categoría" />
                <select
                  v-model="form.categoria_id"
                  id="categoria"
                  class="mt-2 w-full border-gray-300 focus:border-green-800 focus:ring-green-800 rounded-md shadow-sm"
                >
                  <option value="">-------------</option>
                  <option
                    v-for="categoria in categorias"
                    :key="categoria.id"
                    :value="categoria.id"
                  >
                    {{ categoria.nombre }}
                  </option>
                </select>
                <InputError class="mt-2" :message="errors.categoria_id?.[0]" />
              </div>
              <div class="mt-2 md:mt-0">
                <InputLabel for="dificultad" value="Dificultad" />
                <select
                  v-model="form.dificultad_id"
                  id="dificultades"
                  class="mt-2 w-full border-gray-300 focus:border-green-800 focus:ring-green-800 rounded-md shadow-sm"
                >
                  <option value="">-------------</option>
                  <option
                    v-for="dificultad in dificultades"
                    :key="dificultad.id"
                    :value="dificultad.id"
                  >
                    {{ dificultad.nombre }}
                  </option>
                </select>
                <InputError class="mt-2" :message="errors.dificultad_id?.[0]" />
              </div>
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

            <div v-if="imagenActual" class="mb-4">
              <img :src="imagenActual" alt="imagen actual" class="w-40" />
            </div>

            <!-- INGREDIENTES -->
            <div class="mt-2 md:mt-0">
              <InputLabel for="ingredientes" value="Ingredientes" />
              <select
                ref="selectRef"
                name="ingredientes"
                id="ingredientes"
                class="mt-2 w-full border-gray-300 focus:border-green-800 focus:ring-green-800 rounded-md shadow-sm"
                @change="handleIngredientChange"
              >
                <option selected>-------------</option>
                <option
                  v-for="ingrediente in ingredientesTodos"
                  :key="ingrediente.id"
                  :value="ingrediente.id"
                >
                  {{ ingrediente.nombre }}
                </option>
              </select>
              <InputError class="mt-2" :message="errors.ingredientes?.[0]" />
            </div>

            <div class="mt-4 p-4 border border-green-800 rounded-md">
              <InputLabel class="font-medium">Ingredientes Seleccionados:</InputLabel>
              <ul class="list-disc marker:text-green-800 pl-0">
                <li
                  v-for="(ingrediente, index) in ingredientesSeleccionados"
                  :key="ingrediente.id"
                  class="mt-2 bg-amber-50 p-2 rounded-md flex justify-between items-center"
                >
                  <span>{{ ingrediente.nombre }} - {{ ingrediente.cantidad }} {{ ingrediente.unidad }}</span>
                  <button
                    type="button"
                    @click="eliminarIngrediente(index)"
                    class="ml-4 bg-red-600 hover:bg-red-800 text-white rounded-md px-3 py-1 font-bold"
                  >
                    <i class="fa-solid fa-xmark text-white"></i>
                  </button>
                </li>
              </ul>
            </div>

            <div class="mt-4">
              <InputLabel for="instrucciones" value="Instrucciones" />
              <EditorTiny v-model="form.instrucciones"></EditorTiny>
              <InputError class="mt-2" :message="errors.instrucciones?.[0]" />
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

  <div class="fixed inset-0 bg-black opacity-50" v-if="processing"></div>

  <Modal :show="showModal" @close="closeModal">
    <template #default>
      <div class="p-4">
        <h3 class="text-xl font-semibold text-center">
          Añade la cantidad de {{ ingredienteSeleccionado?.nombre }}
        </h3>
        <div class="mt-4 flex flex-col md:flex-row items-center md:justify-center gap-4">
          <div>
            <TextInput
              ref="cantidadInputRef"
              id="cantidad"
              type="text"
              v-model="cantidadIngrediente"
              placeholder="Cantidad"
              @keyup.enter="handleCantidadChange"
            />
          </div>
          <div>
            <TextInput
              id="unidad"
              type="text"
              v-model="unidadMedida"
              placeholder="Unidad de medida"
              @keyup.enter="handleCantidadChange"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-center gap-3">
          <button
            type="button"
            class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            @click="closeModal"
          >
            Cancelar
          </button>
          <PrimaryButton @click="handleCantidadChange">Añadir</PrimaryButton>
        </div>
      </div>
    </template>
  </Modal>
</template>
