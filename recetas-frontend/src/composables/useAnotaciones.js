import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import axios from '../utils/axios'
import { queryKeys } from './useQueries'
import { computed, toValue } from 'vue'
import { useToastStore } from '../stores/toastStore'

export const useAnotaciones = (slug) =>
  useQuery({
    queryKey: computed(() => queryKeys.anotaciones(toValue(slug))),
    queryFn: async () => {
      const { data } = await axios.get(`/api/recetas/${toValue(slug)}/anotaciones`)

      return data.data ?? []
    },
  })

// Tras escribir, refresca todo lo que muestra notas o la media
const useInvalidarAnotaciones = (slug) => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.anotaciones(toValue(slug)) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.recetaPublica(toValue(slug)) }),
      queryClient.invalidateQueries({ queryKey: ['recetas', 'publicas'] }),
    ])
}

// Los errores 422 los pinta el formulario; el resto, un toast
const avisarError = (toastStore) => (error) => {
  if (error.response?.status !== 422) {
    toastStore.mostrarError(error.response?.data?.message ?? 'Ha ocurrido un error')
  }
}

export const useCrearAnotacion = (slug) => {
  const toastStore = useToastStore()
  const invalidar = useInvalidarAnotaciones(slug)
  return useMutation({
    mutationFn: async (datos) => {
      const { data } = await axios.post(`/api/recetas/${toValue(slug)}/anotaciones`, datos)
      return data
    },
    onSuccess: async (data) => {
      await invalidar()
      toastStore.mostrarExito(data.message)
    },
    onError: avisarError(toastStore),
  })
}
export const useActualizarAnotacion = (slug) => {
  const toastStore = useToastStore()
  const invalidar = useInvalidarAnotaciones(slug)
  return useMutation({
    mutationFn: async ({ id, ...datos }) => {
      const { data } = await axios.put(`/api/anotaciones/${id}`, datos)
      return data
    },
    onSuccess: async (data) => {
      await invalidar()
      toastStore.mostrarExito(data.message)
    },
    onError: avisarError(toastStore),
  })
}
export const useEliminarAnotacion = (slug) => {
  const toastStore = useToastStore()
  const invalidar = useInvalidarAnotaciones(slug)
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/api/anotaciones/${id}`)
      return data
    },
    onSuccess: async (data) => {
      await invalidar()
      toastStore.mostrarExito(data.message)
    },
    onError: avisarError(toastStore),
  })
}
