import Axios from 'axios'

export const TOKEN_KEY = 'auth_token'

const axios = Axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 15000,
})

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'La conexión tardó demasiado. Comprueba tu conexión e inténtalo de nuevo.'
    }
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
    }
    return Promise.reject(error)
  },
)

export default axios
