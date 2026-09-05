<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import IngredienteForm from '../../../components/IngredienteForm.vue'
import { useIngredienteStore } from '../../../stores/ingredienteStore'

const route = useRoute()
const ingredienteStore = useIngredienteStore()
const ingrediente = ref(null)
const processing = ref(false)
const errors = ref({})
const id = route.params.id

onMounted(async () => {
  await ingredienteStore.fetchIngrediente(id)
  const i = ingredienteStore.ingrediente
  ingrediente.value = {
    nombre: i.nombre,
    descripcion: i.descripcion,
    imagen: i.imagen,
  }
})

const handleSubmit = async (formData) => {
  formData.append('_method', 'PUT')
  await ingredienteStore.editarIngrediente(id, processing, errors, formData)
}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-700 leading-tight">Editar Ingrediente</h2>
    </template>
    <IngredienteForm
      v-if="ingrediente"
      :ingrediente="ingrediente"
      :errors="errors"
      :processing="processing"
      textoBoton="Guardar Cambios"
      @submit="handleSubmit"
    />
  </AuthenticatedLayout>
</template>
