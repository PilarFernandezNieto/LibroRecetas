import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios, { TOKEN_KEY } from '../utils/axios'
import { useToastStore } from './toastStore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.is_admin)

  const router = useRouter()
  const toastStore = useToastStore()

  const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY)
    user.value = null
  }

  const fetchUser = async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return

    try {
      const { data } = await axios.get('/api/user')
      user.value = data
    } catch (error) {
      if (error.response?.status === 409) {
        router.push({ name: 'verify-email' })
      } else if (error.response?.status === 401) {
        clearSession()
      }
    }
  }

  const login = async (processing, errors, { ...data }) => {
    processing.value = true
    errors.value = {}

    try {
      const { data: res } = await axios.post('/api/login', data)
      setToken(res.token)
      user.value = res.user
      router.push({ name: 'dashboard' })
    } catch (error) {
      if (error.response?.status === 422) {
        errors.value = error.response?.data.errors
      }
    } finally {
      processing.value = false
    }
  }

  const register = async (processing, errors, { ...data }) => {
    processing.value = true
    errors.value = {}

    try {
      const { data: res } = await axios.post('/api/register', data)

      setToken(res.token)
      user.value = res.user
      if (!user.value.email_verified_at) {
        router.push({ name: 'verify-email' })
      } else {
        router.push({ name: 'dashboard' })
      }
    } catch (error) {
      console.log(error)
      if (error.response?.status === 422) {
        errors.value = error.response?.data.errors
      }
    } finally {
      processing.value = false
    }
  }

  const forgotPassword = async (processing, errors, status, email) => {
    processing.value = true
    errors.value = {}
    status.value = null

    try {
      const { data } = await axios.post('/api/forgot-password', { email })

      status.value = data.status
    } catch (error) {
      console.log(error)
      if (error.response.status === 422) {
        errors.value = error.response.data.errors
      }
    } finally {
      processing.value = false
    }
  }

  const resetPassword = async (processing, errors, status, { ...data }) => {
    processing.value = true
    errors.value = {}
    status.value = null

    try {
      const response = await axios.post('/api/reset-password', data)

      router.push({
        name: 'login',
        query: { reset: btoa(response.data?.status) },
      })
    } catch (error) {
      console.log(error)
      if (error.response.status === 422) {
        errors.value = error.response.data.errors
      }
    } finally {
      processing.value = false
    }
  }

  const resendEmailVerification = async (processing, status) => {
    processing.value = true
    status.value = null
    try {
      const { data } = await axios.post('/api/email/verification-notification')
      status.value = data.status
    } catch (error) {
      console.log(error)
      const msg = error?.response?.data?.message ?? 'Error inesperado'
      toastStore.mostrarError({ type: 'error', message: msg })
    } finally {
      processing.value = false
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/logout')
    } finally {
      clearSession()
      router.push({ name: 'login' })
    }
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    fetchUser,
    login,
    register,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  }
})
