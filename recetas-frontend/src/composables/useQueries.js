import { useQuery } from '@tanstack/vue-query'
import axios from '../utils/axios'
import { computed, toValue } from 'vue'

export const queryKeys = {
  ingredientesTodos: ['ingredientes', 'todos'],
  categorias: ['categorias'],
  dificultades: ['dificultades'],
  anotaciones: (slug) => ['anotaciones', slug],
  recetaPublica: (slug) => ['recetas', 'publica', slug],
  recetasPublicas: (page, buscar) => ['recetas', 'publicas', { page, buscar }],
}

export const useIngredientesTodos = () =>
  useQuery({
    queryKey: queryKeys.ingredientesTodos,
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/ingredientes-todos')

      return data.data ?? []
    },
    staleTime: 2 * 60 * 1000, // 2 min — refresca en background si el usuario lleva más tiempo
  })

export const useCategorias = () =>
  useQuery({
    queryKey: queryKeys.categorias,
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/categorias')
      return data.data ?? []
    },
    staleTime: 5 * 60 * 1000, // 5 min
  })

export const useDificultades = () =>
  useQuery({
    queryKey: queryKeys.dificultades,
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/dificultades')
      return data.data ?? []
    },
    staleTime: Infinity, // datos estáticos, no refrescar nunca
  })

export const useRecetaPublica = (slug) =>
  useQuery({
    queryKey: computed(() => queryKeys.recetaPublica(toValue(slug))),
    queryFn: async () => {
      const { data } = await axios.get(`/api/recetas/${toValue(slug)}`)
      console.log(data)
      return data
    },
    staleTime: 30 * 1000, // 30 segundos: volver a la receta enseguida no repite la petición
  })
