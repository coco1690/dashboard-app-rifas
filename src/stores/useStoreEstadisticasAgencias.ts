import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import { toast } from 'sonner'
import type { EstadisticasAgencia } from '@/admin/pages/estadisticas_agencias/types/estadisticasAgencias'


interface EstadisticasAgenciasStore {
  // Estados
  estadisticas: EstadisticasAgencia[]
  loading: boolean
  error: string | null
  lastFetch: number | null

  // Paginación
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number

  // Acciones
  fetchEstadisticas: (forceRefresh?: boolean) => Promise<void>
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  getPaginatedEstadisticas: () => EstadisticasAgencia[]
  clearCache: () => void
}

export const useStoreEstadisticasAgencias = create<EstadisticasAgenciasStore>((set, get) => ({
  // Estados iniciales
  estadisticas: [],
  loading: false,
  error: null,
  lastFetch: null,

  // Paginación inicial
  currentPage: 1,
  pageSize: 12,
  totalCount: 0,
  totalPages: 0,

  // Fetch de estadísticas
  fetchEstadisticas: async (forceRefresh = false) => {
    const { lastFetch } = get()

    // Si no forzamos refresh y hay datos recientes (2 minutos), no hacer nada
    if (!forceRefresh && lastFetch && Date.now() - lastFetch < 120000) {
      console.log('✅ Usando cache de estadísticas de agencias')
      return
    }

    set({ loading: true, error: null })

    try {
      console.log('🔍 Cargando estadísticas de agencias desde vista...')

      const { data, error } = await supabase
        .from('vista_estadisticas_agencias')
        .select('*')
        .order('total_vendido', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      const timestamp = Date.now()
      const totalCount = data?.length || 0
      const { pageSize } = get()
      const totalPages = Math.ceil(totalCount / pageSize)

      set({
        estadisticas: (data || []) as EstadisticasAgencia[],
        loading: false,
        lastFetch: timestamp,
        error: null,
        totalCount,
        totalPages
      })

      console.log(`✅ ${totalCount} estadísticas cargadas correctamente`)

    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido al cargar estadísticas'
      console.error('❌ Error cargando estadísticas:', err)
      
      toast.error('Error al cargar estadísticas', {
        description: errorMessage
      })

      set({
        loading: false,
        error: errorMessage
      })
    }
  },

  // Cambiar de página
  setPage: (page: number) => {
    const { totalPages } = get()
    
    if (page < 1 || page > totalPages) {
      console.warn('Página fuera de rango:', page)
      return
    }

    console.log('📄 Cambiando a página:', page)
    set({ currentPage: page })
  },

  // Cambiar tamaño de página (útil para responsive)
  setPageSize: (size: number) => {
    const { estadisticas } = get()
    const totalPages = Math.ceil(estadisticas.length / size)
    
    set({ 
      pageSize: size,
      totalPages,
      currentPage: 1 // Resetear a página 1 al cambiar el tamaño
    })
  },

  // Obtener estadísticas paginadas
  getPaginatedEstadisticas: () => {
    const { estadisticas, currentPage, pageSize } = get()
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return estadisticas.slice(startIndex, endIndex)
  },

  // Limpiar cache
  clearCache: () => {
    console.log('🗑️ Cache de estadísticas de agencias limpiado')
    set({
      estadisticas: [],
      lastFetch: null,
      currentPage: 1,
      totalCount: 0,
      totalPages: 0
    })
  }
}))