<script setup>
import { ref } from 'vue'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import IngredienteForm from '../../../components/IngredienteForm.vue'
import { useIngredienteStore } from '../../../stores/ingredienteStore'

const ingredienteStore = useIngredienteStore()
const processing = ref(false)
const errors = ref({})

const ingredienteInicial = { nombre: '', descripcion: '', imagen: null }

const handleSubmit = async (formData) => {
  await ingredienteStore.nuevoIngrediente(processing, errors, formData)
}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-700 leading-tight">Nuevo Ingrediente</h2>
    </template>
    <IngredienteForm
      :ingrediente="ingredienteInicial"
      :errors="errors"
      :processing="processing"
      textoBoton="Nuevo Ingrediente"
      @submit="handleSubmit"
    />
  </AuthenticatedLayout>
</template>
