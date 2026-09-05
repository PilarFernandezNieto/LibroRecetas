<script setup>
import { ref } from 'vue'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import RecetasForm from '../../../components/RecetasForm.vue'
import { useRecetaStore } from '../../../stores/recetaStore'

const recetaStore = useRecetaStore()
const processing = ref(false)
const errors = ref({})

const recetaInicial = {
  nombre: '',
  origen: '',
  tiempo: '',
  comensales: '',
  dificultad_id: 0,
  categoria_id: 0,
  intro: '',
  instrucciones: '',
  ingredientes: [],
}

const handleSubmit = async (formData) => {
  await recetaStore.nuevaReceta(processing, errors, formData)
}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-700 leading-tight">Nueva Receta</h2>
    </template>
    <RecetasForm
      :receta="recetaInicial"
      :errors="errors"
      :processing="processing"
      textoBoton="Nueva Receta"
      @submit="handleSubmit"
    />
  </AuthenticatedLayout>
</template>
