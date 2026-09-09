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
const slug = route.params.slug

onMounted(async () => {
  await ingredienteStore.fetchIngrediente(slug)
  const i = ingredienteStore.ingrediente
  ingrediente.value = { nombre: i.nombre, descripcion: i.descripcion, imagen: i.imagen }
})

const handleSubmit = async (formData) => {
  formData.append('_method', 'PUT')
  await ingredienteStore.editarIngrediente(slug, processing, errors, formData)
}
</script>
<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-titulares text-3xl text-verde-900 leading-tight">Editar ingrediente</h2>
    </template>
    <IngredienteForm v-if="ingrediente" :ingrediente="ingrediente" :errors="errors" :processing="processing" textoBoton="Guardar cambios" @submit="handleSubmit" />
  </AuthenticatedLayout>
</template>
