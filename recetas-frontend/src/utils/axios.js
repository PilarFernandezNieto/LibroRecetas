import Axios from 'axios'

const axios = Axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  timeout: 15000,
})

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'La conexión tardó demasiado. Comprueba tu conexión e inténtalo de nuevo.'
    }
    return Promise.reject(error)
  },
)

export default axios
