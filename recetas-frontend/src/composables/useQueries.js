import { useQuery } from '@tanstack/vue-query'
import axios from '../utils/axios'

export const queryKeys = {
  ingredientesTodos: ['ingredientes', 'todos'],
  categorias: ['categorias'],
  dificultades: ['dificultades'],
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
