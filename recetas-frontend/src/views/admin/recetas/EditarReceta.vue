<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import RecetasForm from '../../../components/RecetasForm.vue'
import { useRecetaStore } from '../../../stores/recetaStore'

const route = useRoute()
const recetaStore = useRecetaStore()
const receta = ref(null)
const processing = ref(false)
const errors = ref({})
const id = route.params.id

onMounted(async () => {
  await recetaStore.fetchReceta(id)
  const r = recetaStore.receta
  receta.value = {
    nombre: r.nombre,
    origen: r.origen,
    tiempo: r.tiempo,
    comensales: r.comensales,
    dificultad_id: r.dificultad_id,
    categoria_id: r.categoria_id,
    intro: r.intro,
    instrucciones: r.instrucciones,
    imagen: r.imagen,
    ingredientes: r.ingredientes.map((ing) => ({
      id: ing.id,
      nombre: ing.nombre,
      cantidad: ing.pivot?.cantidad,
      unidad: ing.pivot?.unidad,
    })),
  }
})

const getImagen = (imagen) => {
  if (!imagen) return null
  const base = import.meta.env.VITE_APP_BACKEND_URL.replace(/\/+$/, '')
  const path = imagen.replace(/^\/+/, '')
  return `${base}/${path}`
}

const handleSubmit = async (formData) => {
  formData.append('_method', 'PUT')
  await recetaStore.editarReceta(id, processing, errors, formData)
}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-700 leading-tight">Editar Receta</h2>
    </template>
    <RecetasForm
      v-if="receta"
      :receta="receta"
      :errors="errors"
      :processing="processing"
      :imagenActual="getImagen(receta.imagen)"
      textoBoton="Guardar Cambios"
      @submit="handleSubmit"
    />
  </AuthenticatedLayout>
</template>
