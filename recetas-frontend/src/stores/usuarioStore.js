import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '../utils/axios'
import { useToastStore } from './toastStore'
import { useRouter } from 'vue-router'

export const useUsuarioStore = defineStore('usuarios', () => {
  const usuarios = ref([])

  const usuario = ref({})
  const loading = ref(true)
  const toastStore = useToastStore()
  const router = useRouter()

  const fetchUsers = async () => {
    try {
      loading.value = true
      const { data } = await axios.get(`/api/admin/usuarios`)
      usuarios.value = data.data
    } catch (error) {
      toastStore.addToast({ type: 'error', message: error?.response?.data?.message ?? 'Error al cargar los usuarios' })
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (id) => {
    try {
      loading.value = true
      const { data } = await axios.get(`/api/admin/usuarios/${id}`)
      usuario.value = data.data
    } catch (error) {
      toastStore.addToast({ type: 'error', message: error?.response?.data?.message ?? 'Error al cargar el usuario' })
    } finally {
      loading.value = false
    }
  }

  const EditarUsuario = async (id, processing, errors, datos) => {
    processing.value = true
    try {
      const { data } = await axios.put(`/api/admin/usuarios/${id}`, datos, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (data.type === 'success') {
        toastStore.mostrarExito(data.message)
        router.push({ name: 'users' })
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        errors.value = error.response.data.errors
      }
    } finally {
      processing.value = false
    }
  }

  const eliminarUsuario = async (id) => {
    try {
      const { data } = await axios.delete(`/api/admin/usuarios/${id}`)
      if (data.type === 'success') {
        toastStore.mostrarExito(data.message)
        usuarios.value = usuarios.value.filter((usuarioStore) => usuarioStore.id !== id)
      }
    } catch (error) {
      toastStore.mostrarError(error?.response?.data?.message ?? 'Error al eliminar el usuario')
    }
  }

  return {
    fetchUsers,
    fetchUser,
    usuarios,
    usuario,
    EditarUsuario,
    eliminarUsuario,
    loading,
  }
})
