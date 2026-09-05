import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '../utils/axios'
import { useToastStore } from './toastStore'
import { useRouter } from 'vue-router'
import { queryClient } from '../queryClient'
import { queryKeys } from '../composables/useQueries'

export const useCategoriaStore = defineStore('categorias', () => {
  const categorias = ref([])

  const categoria = ref({
    nombre: '',
  })
  const loading = ref(true)
  const toastStore = useToastStore()
  const router = useRouter()
    let eliminandoId = null

  const fetchCategorias = async () => {
    try {
      loading.value = true
      const { data } = await axios.get(`/api/admin/categorias`)
      categorias.value = data.data
    } catch (error) {
      toastStore.addToast({ type: 'error', message: error?.response?.data?.message ?? 'Error al cargar las categorías' })
    } finally {
      loading.value = false
    }
  }

  const fetchCategoria = async (id) => {
    try {
      loading.value = true
      const { data } = await axios.get(`/api/admin/categorias/${id}`)
      categoria.value = data
    } catch (error) {
      toastStore.addToast({ type: 'error', message: error?.response?.data?.message ?? 'Error al cargar la categoría' })
    } finally {
      loading.value = false
    }
  }

  const nuevaCategoria = async (processing, errors, datos) => {
    processing.value = true
    errors.value = {}

    try {
      const { data } = await axios.post('/api/admin/categorias', datos, {
        headers: {
          'Content-Type': 'application/json,',
        },
      })

      if (data.type === 'success') {
        queryClient.invalidateQueries({ queryKey: queryKeys.categorias })
        toastStore.mostrarExito(data.message)
        router.push({ name: 'categorias' })
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        errors.value = error.response.data.errors
      }
    } finally {
      processing.value = false
    }
  }
  const editarCategoria = async (id, processing, errors, datos) => {
    processing.value = true
    try {
      const { data } = await axios.put(`/api/admin/categorias/${id}`, datos, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (data.type === 'success') {
        queryClient.invalidateQueries({ queryKey: queryKeys.categorias })
        toastStore.mostrarExito(data.message)
        router.push({ name: 'categorias' })
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        errors.value = error.response.data.errors
      }
    } finally {
      processing.value = false
    }
  }

  const eliminarCategoria = async (id) => {
    if (eliminandoId === id) return // sale de aquí si ya se está eliminando este ingrediente
    eliminandoId = id // Evita múltiples clics
    try {
      const { data } = await axios.delete(`/api/admin/categorias/${id}`)

      if (data.type === 'success') {
        queryClient.invalidateQueries({ queryKey: queryKeys.categorias })
        toastStore.mostrarExito(data.message)
        categorias.value = categorias.value.filter((categoriaStore) => categoriaStore.id !== id)
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toastStore.mostrarError(error.response.data.message)
      } else {
        toastStore.mostrarError('Error al eliminar la categoría')
      }
    } finally {
      eliminandoId = null // Resetea el ID al finalizar
    }
  }

  return {
    fetchCategorias,
    fetchCategoria,
    categorias,
    categoria,
    nuevaCategoria,
    editarCategoria,
    eliminarCategoria,
    loading,
  }
})
