<script setup>
import { ref, watch, nextTick } from 'vue'
import InputLabel from './InputLabel.vue'
import TextInput from './TextInput.vue'
import PrimaryButton from './PrimaryButton.vue'
import GoBackButton from './GoBackButton.vue'
import InputError from './InputError.vue'
import EditorTipTap from './EditorTipTap.vue'
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

const ingredientesSeleccionados = ref((props.receta.ingredientes || []).map((ing) => ({ ...ing })))
const ingredienteSeleccionado = ref(null)
const ingredienteIdElegido = ref('')
const cantidadIngrediente = ref('')
const unidadMedida = ref('')
const showModal = ref(false)
const nuevaImagen = ref(null)
const cantidadInputRef = ref(null)
const errorIngredienteDuplicado = ref('')

watch(showModal, async (val) => {
  if (val) {
    await nextTick()
    cantidadInputRef.value?.focus()
  }
})

const handleIngredientChange = () => {
  const ingrediente = ingredientesTodos.value?.find(
    (ing) => ing.id === parseInt(ingredienteIdElegido.value),
  )
  if (!ingrediente) return

  const yaSeleccionado = ingredientesSeleccionados.value.some((ing) => ing.id === ingrediente.id)
  if (yaSeleccionado) {
    errorIngredienteDuplicado.value = `${ingrediente.nombre} ya está en la lista de ingredientes.`
    ingredienteIdElegido.value = ''
    return
  }

  errorIngredienteDuplicado.value = ''
  ingredienteSeleccionado.value = ingrediente
  showModal.value = true
}

const eliminarIngrediente = (index) => ingredientesSeleccionados.value.splice(index, 1)

const closeModal = () => {
  showModal.value = false
  cantidadIngrediente.value = ''
  unidadMedida.value = ''
  ingredienteSeleccionado.value = null
  ingredienteIdElegido.value = ''
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
  if (nuevaImagen.value) formData.append('imagen', nuevaImagen.value)
  emit('submit', formData)
}
</script>

<template>
  <div class="py-12">
    <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-papel overflow-hidden shadow-sm rounded-sm py-4 px-4 md:px-8">
        <div class="border border-crema shadow-sm p-6 rounded-sm">
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

            <div class="mt-4">
              <InputLabel for="intro" value="Introducción" />
              <TextInput id="intro" type="text" class="mt-2 block w-full" v-model="form.intro" />
              <InputError class="mt-2" :message="errors.intro?.[0]" />
            </div>

            <div class="mt-4 md:grid grid-cols-3 gap-4">
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
              <div class="mt-4 md:mt-0">
                <InputLabel for="comensales" value="Comensales" />
                <TextInput
                  id="comensales"
                  type="number"
                  class="mt-2 block w-full"
                  v-model="form.comensales"
                />
              </div>
              <div class="mt-4 md:mt-0">
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

            <div class="mt-4 md:grid grid-cols-2 gap-4">
              <div class="mt-4 md:mt-0">
                <InputLabel for="categoria" value="Categoría" />
                <select
                  v-model="form.categoria_id"
                  id="categoria"
                  class="mt-2 w-full bg-papel border-terracota-oscuro focus:border-terracota-oscuro focus:ring-terrborder-terracota-oscuro rounded-sm shadow-sm"
                >
                  <option value="">-------------</option>
                  <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                    {{ categoria.nombre }}
                  </option>
                </select>
                <InputError class="mt-2" :message="errors.categoria_id?.[0]" />
              </div>
              <div class="mt-4 md:mt-0">
                <InputLabel for="dificultad" value="Dificultad" />
                <select
                  v-model="form.dificultad_id"
                  id="dificultades"
                  class="mt-2 w-full bg-papel border-terracota-oscuro focus:border-terracota-oscuro focus:ring-terrborder-terracota-oscuro rounded-sm shadow-sm"
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
                class="cursor-pointer inline-flex bg-terracota text-papel py-2 px-4 rounded-sm hover:bg-terracota-oscuro focus:ring-2 focus:ring-terracota-oscuro text-sm font-principal"
              >
                Subir imagen
              </label>
              <input type="file" id="imagen" @change="handleImageChange" class="hidden" />
              <InputError class="mt-2" :message="errors.imagen?.[0]" />
            </div>

            <div v-if="imagenActual" class="mb-4">
              <img :src="imagenActual" alt="imagen actual" class="w-40 rounded-sm" />
            </div>

            <div class="mt-4 md:mt-0">
              <InputLabel for="ingredientes" value="Ingredientes" />
              <select
                v-model="ingredienteIdElegido"
                name="ingredientes"
                id="ingredientes"
                class="mt-2 w-full bg-papel border-terracota-oscuro focus:border-terracota-oscuro focus:ring-terracota-oscuro rounded-sm shadow-sm"
                @change="handleIngredientChange"
              >
                <option value="">-------------</option>
                <option
                  v-for="ingrediente in ingredientesTodos"
                  :key="ingrediente.id"
                  :value="ingrediente.id"
                >
                  {{ ingrediente.nombre }}
                </option>
              </select>
              <InputError
                class="mt-2"
                :message="errorIngredienteDuplicado || errors.ingredientes?.[0]"
              />
            </div>

            <div class="mt-4 p-4 border border-terracota-oscuro rounded-sm">
              <InputLabel class="font-medium">Ingredientes seleccionados:</InputLabel>
              <ul class="pl-0 space-y-2 mt-2">
                <li
                  v-for="(ingrediente, index) in ingredientesSeleccionados"
                  :key="ingrediente.id"
                  class="bg-crema p-2 rounded-sm flex justify-between items-center font-principal text-sm text-antracita"
                >
                  <span
                    >{{ ingrediente.nombre }} - {{ ingrediente.cantidad }}
                    {{ ingrediente.unidad }}</span
                  >
                  <button
                    type="button"
                    @click="eliminarIngrediente(index)"
                    class="ml-4 bg-red-600 hover:bg-red-700 text-white rounded-sm px-3 py-1 font-bold"
                  >
                    <i class="fa-solid fa-xmark text-white"></i>
                  </button>
                </li>
              </ul>
            </div>

            <div class="mt-4">
              <InputLabel for="instrucciones" value="Instrucciones" />
              <EditorTipTap v-model="form.instrucciones"></EditorTipTap>
              <InputError class="mt-2" :message="errors.instrucciones?.[0]" />
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <GoBackButton>Atrás</GoBackButton>
              <PrimaryButton :class="{ 'opacity-25': processing }" :disabled="processing">{{
                textoBoton
              }}</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="fixed inset-0 bg-black/50" v-if="processing"></div>

  <Modal :show="showModal" @close="closeModal">
    <template #default>
      <div class="p-6 font-principal text-antracita">
        <h3 class="font-titulares text-xl text-center">
          Añade la cantidad de {{ ingredienteSeleccionado?.nombre }}
        </h3>
        <div class="mt-4 flex flex-col md:flex-row items-center md:justify-center gap-4">
          <TextInput
            ref="cantidadInputRef"
            id="cantidad"
            type="text"
            v-model="cantidadIngrediente"
            placeholder="Cantidad"
            @keyup.enter="handleCantidadChange"
          />
          <TextInput
            id="unidad"
            type="text"
            v-model="unidadMedida"
            placeholder="Unidad de medida"
            @keyup.enter="handleCantidadChange"
          />
        </div>
        <div class="mt-4 flex justify-center gap-3">
          <button
            type="button"
            class="px-4 py-2 rounded-sm border border-papel text-antracita/70 hover:bg-papel"
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
