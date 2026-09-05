import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '../utils/axios'
import { useToastStore } from './toastStore'
import { useRouter } from 'vue-router'
import { queryClient } from '../queryClient'
import { queryKeys } from '../composables/useQueries'

export const useIngredienteStore = defineStore('ingredientes', () => {
  const ingredientes = ref([])
  const ingredientesTodos = ref([])
  const ingrediente = ref({})
  const loading = ref(true)
  const toastStore = useToastStore()
  const router = useRouter()
  let eliminandoId = null

  const fetchIngredientes = async (page = 1) => {
    try {
      loading.value = true
      const { data } = await axios.get(`/api/admin/ingredientes?page=${page}`)
      ingredientes.value = data
    } catch (error) {
      toastStore.addToast({ type: 'error', message: error?.response?.data?.message ?? 'Error al cargar los ingredientes' })
    } finally {
      loading.value = false
    }
  }

  /**
   * Carga todos los ingredientes para el select de ingredientes en la receta
   */
  const fetchAllIngredientes = async () => {
    try {
      const { data } = await axios.get('/api/admin/ingredientes-todos')
      ingredientesTodos.value = data.data
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Error inesperado'
      toastStore.addToast({ type: 'error', message: msg })
    } finally {
      loading.value = false
    }
  }
  const fetchIngrediente = async (id) => {
    try {
      loading.value = true
      const { data } = await axios.get(`/api/admin/ingredientes/${id}`)

      ingrediente.value = data
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Error inesperado'
      toastStore.addToast({ type: 'error', message: msg })
    } finally {
      loading.value = false
    }
  }

  const nuevoIngrediente = async (processing, errors, formData) => {
    processing.value = true
    errors.value = {}

    try {
      const { data } = await axios.post('/api/admin/ingredientes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (data.type === 'success') {
        queryClient.invalidateQueries({ queryKey: queryKeys.ingredientesTodos })
        toastStore.mostrarExito(data.message)
        router.push({ name: 'ingredientes' })
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        errors.value = error.response.data.errors
      }
    } finally {
      processing.value = false
    }
  }
  const editarIngrediente = async (id, processing, errors, formData) => {
    processing.value = true
    errors.value = {}
    try {
      const { data } = await axios.post(`/api/admin/ingredientes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (data.type === 'success') {
        queryClient.invalidateQueries({ queryKey: queryKeys.ingredientesTodos })
        toastStore.mostrarExito(data.message)
        router.push({ name: 'ingredientes' })
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        errors.value = error.response.data.errors
      }
    } finally {
      processing.value = false
    }
  }

  const eliminarIngrediente = async (id) => {
    if (eliminandoId === id) return // sale de aquí si ya se está eliminando este ingrediente
    eliminandoId = id // Evita múltiples clics
    try {
      const { data } = await axios.delete(`/api/admin/ingredientes/${id}`)

      if (data.type === 'success') {
        queryClient.invalidateQueries({ queryKey: queryKeys.ingredientesTodos })
        toastStore.mostrarExito(data.message)
        ingredientes.value = {
          ...ingredientes.value,
          data: ingredientes.value.data.filter((ingredienteStore) => ingredienteStore.id !== id),
        }
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toastStore.mostrarError(error.response.data.message)
      } else {
        toastStore.mostrarError('Error al eliminar el ingrediente')
      }
    } finally {
      eliminandoId = null // Resetea el ID al finalizar
    }
  }

  return {
    ingredientes,
    ingredientesTodos,
    ingrediente,
    fetchIngredientes,
    fetchAllIngredientes,
    fetchIngrediente,
    loading,
    nuevoIngrediente,
    editarIngrediente,
    eliminarIngrediente,
  }
})
