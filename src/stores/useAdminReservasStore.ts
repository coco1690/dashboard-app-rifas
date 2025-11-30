import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import { toast } from 'sonner'

// ============================================================================
// TYPES
// ============================================================================

export interface BoletoReserva {
  id: string
  numero: string
  reservado_por_web: boolean
  reservado_hasta: string | null
}

export interface ReservaAdmin {
  id: string
  rifa_id: string
  rifa_titulo: string
  rifa_subtitulo?: string
  rifa_imagen?: string
  session_id: string
  token: string
  cantidad: number
  precio_unitario: number
  total: number
  estado: 'activa' | 'completada' | 'cancelada' | 'expirada' | 'pagada'
  expira_en: string
  created_at: string
  updated_at: string
  esta_expirada: boolean
  tiempo_restante_minutos: number
  boletos_count: number
  boletos: BoletoReserva[]
}

interface EstadisticasReservas {
  total: number
  activas: number
  expiradas: number
  canceladas: number
  completadas: number
  totalBoletos: number
  montoTotal: number
}

interface AdminReservasStore {
  // Estado
  reservas: ReservaAdmin[]
  loading: boolean
  error: string | null
  ultimaActualizacion: Date | null
  autoRefresh: boolean

  // Acciones
  obtenerReservas: () => Promise<void>
  liberarReserva: (reservaId: string) => Promise<boolean>
  liberarTodasExpiradas: () => Promise<boolean>
  
  // Filtros y búsqueda
  filtrarPorEstado: (estado: ReservaAdmin['estado'] | 'todas') => ReservaAdmin[]
  buscarReservas: (termino: string) => ReservaAdmin[]
  
  // Estadísticas
  obtenerEstadisticas: () => EstadisticasReservas
  
  // Configuración
  toggleAutoRefresh: () => void
  setError: (error: string | null) => void
  resetear: () => void
}

// ============================================================================
// UTILIDADES
// ============================================================================

const procesarRespuestaRPC = (data: any): any => {
  // Si es un array con un objeto que tiene la clave de la función
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0]
    
    // Caso: [{ function_name: [...] }]
    if (firstItem && typeof firstItem === 'object') {
      const keys = Object.keys(firstItem)
      
      // Si tiene una sola clave que parece ser el nombre de la función
      if (keys.length === 1 && keys[0].includes('_')) {
        return firstItem[keys[0]]
      }
    }
    
    return firstItem
  }
  
  return data
}

// ============================================================================
// STORE
// ============================================================================

export const useAdminReservasStore = create<AdminReservasStore>((set, get) => ({
  // ============================================================================
  // ESTADO INICIAL
  // ============================================================================
  reservas: [],
  loading: false,
  error: null,
  ultimaActualizacion: null,
  autoRefresh: false,

  // ============================================================================
  // OBTENER TODAS LAS RESERVAS
  // ============================================================================
  obtenerReservas: async () => {
    set({ loading: true, error: null })

    try {
      console.log('📊 Obteniendo todas las reservas (admin)...')

      const { data, error } = await supabase.rpc('obtener_todas_reservas_admin')

      if (error) {
        console.error('❌ Error obteniendo reservas:', error)
        throw new Error(error.message)
      }

      // Log para debug
      // console.log('🔍 Data cruda:', data)
      
      let reservas: ReservaAdmin[] = []

      // Caso 1: Array con objeto wrapper [{ obtener_todas_reservas_admin: [...] }]
      if (Array.isArray(data) && data.length > 0 && data[0].obtener_todas_reservas_admin) {
        reservas = data[0].obtener_todas_reservas_admin
        console.log('✅ Caso 1: Extraído array de wrapper')
      }
      // Caso 2: Ya es un array directo
      else if (Array.isArray(data)) {
        reservas = data
        console.log('✅ Caso 2: Array directo')
      }
      // Caso 3: Objeto único
      else if (data && typeof data === 'object') {
        reservas = [data]
        console.log('✅ Caso 3: Objeto convertido a array')
      }
      else {
        console.error('❌ Formato no reconocido:', data)
        throw new Error('Formato de respuesta inválido')
      }

      console.log('📋 Reservas procesadas:', reservas.length)

      set({
        reservas,
        loading: false,
        ultimaActualizacion: new Date(),
        error: null
      })

      console.log(`✅ ${reservas.length} reservas cargadas`)

    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener reservas'
      console.error('❌ Error:', err)
      
      set({
        loading: false,
        error: errorMessage,
        reservas: []
      })

      toast.error('Error al cargar reservas', {
        description: errorMessage
      })
    }
  },

  // ============================================================================
  // LIBERAR UNA RESERVA ESPECÍFICA
  // ============================================================================
  liberarReserva: async (reservaId: string) => {
    try {
      console.log('🔓 Liberando reserva (admin):', reservaId)

      const loadingToast = toast.loading('Liberando reserva...')

      const { data, error } = await supabase.rpc('liberar_reserva_admin', {
        p_reserva_id: reservaId
      })

      if (error) {
        console.error('❌ Error liberando reserva:', error)
        toast.dismiss(loadingToast)
        throw new Error(error.message)
      }

      const response = procesarRespuestaRPC(data)

      if (!response.success) {
        toast.dismiss(loadingToast)
        toast.error('Error al liberar', {
          description: response.error || 'No se pudo liberar la reserva'
        })
        return false
      }

      toast.dismiss(loadingToast)
      toast.success('Reserva liberada', {
        description: response.mensaje || `${response.boletos_liberados} boletos liberados`
      })

      // Actualizar la lista
      await get().obtenerReservas()

      return true

    } catch (err: any) {
      const errorMessage = err.message || 'Error al liberar reserva'
      console.error('❌ Error:', err)
      
      toast.error('Error', {
        description: errorMessage
      })

      return false
    }
  },

  // ============================================================================
  // LIBERAR TODAS LAS RESERVAS EXPIRADAS
  // ============================================================================
  liberarTodasExpiradas: async () => {
    try {
      // Contar cuántas hay antes
      const expiradas = get().reservas.filter(r => r.esta_expirada && r.estado === 'activa')
      
      if (expiradas.length === 0) {
        toast.info('Sin reservas expiradas', {
          description: 'No hay reservas expiradas para liberar'
        })
        return false
      }

      console.log(`🔓 Liberando ${expiradas.length} reservas expiradas...`)

      const loadingToast = toast.loading('Liberando reservas expiradas...', {
        description: `Procesando ${expiradas.length} reservas`
      })

      const { data, error } = await supabase.rpc('liberar_reservas_expiradas')

      if (error) {
        console.error('❌ Error liberando reservas:', error)
        toast.dismiss(loadingToast)
        throw new Error(error.message)
      }

      const response = procesarRespuestaRPC(data)

      if (!response.success) {
        toast.dismiss(loadingToast)
        toast.error('Error al liberar', {
          description: response.error || 'No se pudieron liberar las reservas'
        })
        return false
      }

      toast.dismiss(loadingToast)
      toast.success('Limpieza completada', {
        description: response.mensaje || `${response.reservas_liberadas} reservas liberadas`
      })

      // Actualizar la lista
      await get().obtenerReservas()

      return true

    } catch (err: any) {
      const errorMessage = err.message || 'Error al liberar reservas'
      console.error('❌ Error:', err)
      
      toast.error('Error', {
        description: errorMessage
      })

      return false
    }
  },

  // ============================================================================
  // FILTRAR POR ESTADO
  // ============================================================================
  filtrarPorEstado: (estado) => {
    const { reservas } = get()
    
    if (estado === 'todas') {
      return reservas
    }

    return reservas.filter(r => r.estado === estado)
  },

  // ============================================================================
  // BUSCAR RESERVAS
  // ============================================================================
  buscarReservas: (termino: string) => {
    const { reservas } = get()
    
    if (!termino.trim()) {
      return reservas
    }

    const terminoLower = termino.toLowerCase()

    return reservas.filter(r => 
      r.rifa_titulo.toLowerCase().includes(terminoLower) ||
      r.session_id.toLowerCase().includes(terminoLower) ||
      r.id.toLowerCase().includes(terminoLower)
    )
  },

  // ============================================================================
  // OBTENER ESTADÍSTICAS
  // ============================================================================
  obtenerEstadisticas: () => {
    const { reservas } = get()

    return {
      total: reservas.length,
      activas: reservas.filter(r => r.estado === 'activa' && !r.esta_expirada).length,
      expiradas: reservas.filter(r => r.esta_expirada || r.estado === 'expirada').length,
      canceladas: reservas.filter(r => r.estado === 'cancelada').length,
      completadas: reservas.filter(r => r.estado === 'completada' || r.estado === 'pagada').length,
      totalBoletos: reservas.reduce((sum, r) => sum + r.cantidad, 0),
      montoTotal: reservas.reduce((sum, r) => sum + r.total, 0)
    }
  },

  // ============================================================================
  // CONFIGURACIÓN
  // ============================================================================
  toggleAutoRefresh: () => {
    set(state => ({ autoRefresh: !state.autoRefresh }))
  },

  setError: (error) => set({ error }),

  resetear: () => {
    set({
      reservas: [],
      loading: false,
      error: null,
      ultimaActualizacion: null,
      autoRefresh: false
    })
  }
}))

// ============================================================================
// AUTO-REFRESH (si está habilitado)
// ============================================================================
if (typeof window !== 'undefined') {
  setInterval(() => {
    const { autoRefresh, loading } = useAdminReservasStore.getState()
    
    if (autoRefresh && !loading) {
      console.log('🔄 Auto-refresh de reservas admin...')
      useAdminReservasStore.getState().obtenerReservas()
    }
  }, 30000) // Cada 30 segundos
}