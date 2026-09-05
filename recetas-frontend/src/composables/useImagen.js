export const useImagen = () => {
  const getImagen = (imagen) => {
    if (!imagen) return null
    const base = import.meta.env.VITE_APP_BACKEND_URL.replace(/\/+$/, '')
    const path = imagen.replace(/^\/+/, '')
    return `${base}/${path}`
  }

  return { getImagen }
}
