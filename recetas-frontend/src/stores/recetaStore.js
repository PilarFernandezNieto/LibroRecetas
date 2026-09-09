import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '../utils/axios'
import { useToastStore } from './toastStore'
import { useRouter } from 'vue-router'

export const useRecetaStore = defineStore('recetas', () => {
  const recetas = ref([])
  const receta = ref([])
  const loading = ref(true)
  const toastStore = useToastStore()
  const router = useRouter()
  const fetchRecetas = async (page = 1, search = '') => {
    try {
      loading.value = true
      const { data } = await axios.get(`/api/admin/recetas?page=${page}&buscar=${search}`)
      recetas.value = data
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Error inesperado'
      toastStore.addToast({ type: 'error', message: msg })
    } finally {
      loading.value = false
    }
  }
  const fetchReceta = async (slug) => {
    try {
      loading.value = true
      const { data } = await axios.get(`/api/admin/recetas/${slug}`)
      receta.value = data
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Error inesperado'
      toastStore.addToast({ type: 'error', message: msg })
    } finally {
      loading.value = false
    }
  }

  const nuevaReceta = async (processing, errors, formData) => {
    processing.value = true
    errors.value = {}
    try {
      const { data } = await axios.post('/api/admin/recetas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (data.type === 'success') {
        toastStore.mostrarExito(data.message)
        router.push({ name: 'recetas' })
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        errors.value = error.response.data.errors
      } else {
        toastStore.mostrarError(error.response.data.message)
      }
    } finally {
      processing.value = false
    }
  }

  const editarReceta = async (slug, processing, errors, formData) => {
    processing.value = true
    errors.value = {}
    try {
      const { data } = await axios.post(`/api/admin/recetas/${slug}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (data.type === 'success') {
        await fetchReceta(slug)
        toastStore.mostrarExito(data.message)
        router.push({ name: 'recetas' })
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        errors.value = error.response.data.errors
      }
    } finally {
      processing.value = false
    }
  }
  const eliminarReceta = async (slug) => {
    try {
      const { data } = await axios.delete(`/api/admin/recetas/${slug}`)
      if (data.type === 'success') {
        toastStore.mostrarExito(data.message)

        recetas.value = {
          ...recetas.value,
          data: recetas.value.data.filter((receta) => receta.slug !== slug),
        }
      }
    } catch (error) {
      toastStore.mostrarError(error?.response?.data?.message ?? 'Error al eliminar la receta')
    }
  }

  return {
    fetchRecetas,
    fetchReceta,
    nuevaReceta,
    editarReceta,
    eliminarReceta,
    loading,
    recetas,
    receta,
  }
})
