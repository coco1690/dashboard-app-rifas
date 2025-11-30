import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import { toast } from 'sonner'

// ============================================================================
// TYPES
// ============================================================================

interface ReservaResponse {
  success: boolean
  reserva_id?: string
  token?: string
  boletos_ids?: string[]
  numeros?: string[]
  cantidad?: number
  precio_unitario?: number
  total?: number
  expira_en?: string
  digitos?: number
  error?: string
  error_code?: string
  disponibles?: number
  paquetes_permitidos?: number[]
  minimo_personalizado?: number
}

interface ReservaActiva {
  reserva_id: string
  rifaId: string
  rifaTitulo: string
  rifaSubtitulo?: string
  imagenRifa?: string
  boletos_ids: string[]
  numeros: string[]
  cantidad: number
  precio_unitario: number
  total: number
  expira_en: string
  token: string
  digitos: number
  timestamp: number
}

interface ReservaStore {
  // Estado
  reservasActivas: Map<string, ReservaActiva>
  loading: boolean
  error: string | null
  sessionId: string | null

  // Acciones
  inicializarSesion: () => void
  reservarBoletos: (params: {
    rifaId: string
    rifaTitulo: string
    rifaSubtitulo?: string
    imagenRifa?: string
    cantidad: number
  }) => Promise<ReservaActiva | null>


  liberarTodasLasReservas: () => Promise<void>
  obtenerReserva: (rifaId: string) => ReservaActiva | null
  liberarReserva: (rifaId: string) => Promise<void>
  limpiarReservasExpiradas: () => void
  resetear: () => void
}

// ============================================================================
// UTILIDADES
// ============================================================================

const STORAGE_KEY_SESSION = 'eventosib_session_id'

// Obtiene o genera un session_id único para este navegador
const obtenerOCrearSessionId = (): string => {
  let sessionId = localStorage.getItem(STORAGE_KEY_SESSION)

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY_SESSION, sessionId)
  }

  return sessionId
}

// Verifica si una reserva ha expirado
const estaExpirada = (expiraEn: string): boolean => {
  return new Date(expiraEn) <= new Date()
}

// ============================================================================
// STORE
// ============================================================================

export const useReservaStore = create<ReservaStore>((set, get) => ({
  // ============================================================================
  // ESTADO INICIAL
  // ============================================================================
  reservasActivas: new Map(),
  loading: false,
  error: null,
  sessionId: null,


  // INICIALIZAR SESIÓN

  inicializarSesion: () => {
    const sessionId = obtenerOCrearSessionId()
    set({ sessionId })

    // Iniciar limpieza periódica de reservas expiradas
    setInterval(() => {
      get().limpiarReservasExpiradas()
    }, 60000) // Cada minuto

    // console.log('🔑 Sesión inicializada:', sessionId)
  },

  // RESERVAR BOLETOS
  reservarBoletos: async ({
    rifaId,
    rifaTitulo,
    rifaSubtitulo,
    imagenRifa,
    cantidad
  }) => {
    const { sessionId } = get()

    if (!sessionId) {
      toast.error('Error de sesión', {
        description: 'Por favor recarga la página'
      })
      return null
    }

    set({ loading: true, error: null })

    const loadingToast = toast.loading('Reservando boletos...', {
      description: `Buscando ${cantidad} números disponibles`
    })

    try {
      console.log('📝 Llamando RPC para reservar boletos...')


      // LLAMADA SEGURA AL BACKEND

      const { data, error } = await supabase.rpc('reservar_boletos_para_carrito', {
        p_rifa_id: rifaId,
        p_cantidad: cantidad,
        p_session_id: sessionId
      })

      // ✅ AGREGADO: Logging detallado
      // console.log('🔍 RPC Response completa:', { data, error })

      if (error) {
        console.error('❌ Error en RPC:', error)
        throw new Error(error.message || 'Error al reservar boletos')
      }

      //  Extraer la respuesta correctamente

      let response: ReservaResponse

      // Supabase a veces retorna [{ function_name: {...} }]
      if (Array.isArray(data) && data.length > 0) {
        // Caso 1: Array con objeto anidado
        const firstItem = data[0]
        if (firstItem && typeof firstItem === 'object' && 'reservar_boletos_para_carrito' in firstItem) {
          response = firstItem.reservar_boletos_para_carrito as ReservaResponse
        } else {
          response = firstItem as ReservaResponse
        }
      } else if (data && typeof data === 'object') {
        // Caso 2: Objeto directo
        response = data as ReservaResponse
      } else {
        throw new Error('Formato de respuesta inválido')
      }

      // console.log('📦 Response procesada:', response)

      // ============================================================================
      // VALIDAR RESPUESTA
      // ============================================================================
      if (!response.success) {
        console.error('❌ Reserva falló:', response.error)

        // Manejar errores específicos
        switch (response.error_code) {
          case 'INSUFFICIENT_TICKETS':
            toast.error('Boletos insuficientes', {
              description: `Solo quedan ${response.disponibles} boletos disponibles`
            })
            break
          case 'INVALID_QUANTITY':
            toast.error('Cantidad inválida', {
              description: response.error
            })
            break
          case 'RIFA_INACTIVE':
            toast.error('Rifa no disponible', {
              description: 'Esta rifa ya no está activa'
            })
            break
          default:
            toast.error('Error al reservar', {
              description: response.error || 'Intenta de nuevo'
            })
        }

        set({ loading: false, error: response.error || 'Error desconocido' })
        toast.dismiss(loadingToast)
        return null
      }

      // ============================================================================
      // RESERVA EXITOSA - GUARDAR EN STORE LOCAL
      // ============================================================================
      const reserva: ReservaActiva = {
        reserva_id: response.reserva_id!,
        rifaId,
        rifaTitulo,
        rifaSubtitulo,
        imagenRifa,
        boletos_ids: response.boletos_ids!,
        numeros: response.numeros!,
        cantidad: response.cantidad!,
        precio_unitario: response.precio_unitario!,
        total: response.total!,
        expira_en: response.expira_en!,
        token: response.token!,
        digitos: response.digitos!,
        timestamp: Date.now()
      }

      set(state => {
        const nuevasReservas = new Map(state.reservasActivas)
        nuevasReservas.set(reserva.reserva_id, reserva)
        return {
          reservasActivas: nuevasReservas,
          loading: false,
          error: null
        }
      })

      toast.success('¡Boletos reservados!', {
        description: `${cantidad} números reservados por 10 minutos`
      })

      toast.dismiss(loadingToast)

      // console.log('✅ Reserva exitosa:', reserva)
      return reserva

    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido al reservar'
      console.error('❌ Error reservando boletos:', err)

      toast.error('Error al reservar boletos', {
        description: errorMessage
      })

      toast.dismiss(loadingToast)

      set({
        loading: false,
        error: errorMessage
      })

      return null
    }
  },

  // OBTENER RESERVA
  obtenerReserva: (rifaId: string) => {
    const reserva = get().reservasActivas.get(rifaId)

    if (!reserva) return null

    // Verificar si expiró
    if (estaExpirada(reserva.expira_en)) {
      get().liberarReserva(rifaId)
      return null
    }

    return reserva
  },

  // LIBERAR RESERVA
  liberarReserva: async (rifaId: string) => {
    const reserva = get().reservasActivas.get(rifaId)


    if (!reserva) {
      console.log('⚠️ No hay reserva para liberar:', rifaId)
      return
    }

    try {
      console.log('🔓 Liberando reserva lib :', rifaId)

      // Llamar RPC para liberar en BD
      const { data, error } = await supabase.rpc('liberar_reserva_web', {
        p_reserva_id: reserva.reserva_id,
        p_token: reserva.token,
        p_session_id: get().sessionId
      })

      if (error) {
        console.error('❌ Error liberando reserva en BD:', error)
        // Continuar de todos modos para limpiar localmente
      } else {
        console.log('✅ Reserva liberada en BD:', data)
      }

      // Limpiar del store local
      set(state => {
        const nuevasReservas = new Map(state.reservasActivas)
        nuevasReservas.delete(rifaId)
        return { reservasActivas: nuevasReservas }
      })

      console.log('✅ Reserva limpiada del store local')

    } catch (error) {
      console.error('❌ Error crítico liberando reserva:', error)
    }
  },

  // LIMPIAR RESERVAS EXPIRADAS
  // limpiarReservasExpiradas: () => {
  //   const { reservasActivas } = get()
  //   const ahora = new Date()
  //   let algunaExpirada = false

  //   reservasActivas.forEach((reserva, rifaId) => {
  //     if (new Date(reserva.expira_en) <= ahora) {
  //       console.log('⏰ Reserva expirada localmente usereservastore :', rifaId)
  //       get().liberarReserva(rifaId)
  //       algunaExpirada = true
  //     }
  //   })

  //   if (algunaExpirada) {
  //     toast.warning('Reserva expirada', {
  //       description: 'Algunos boletos fueron liberados por tiempo'
  //     })
  //   }
  // },

  limpiarReservasExpiradas: () => {
    const { reservasActivas } = get()
    const ahora = new Date()

    reservasActivas.forEach((reserva, rifaId) => {
      if (new Date(reserva.expira_en) <= ahora) {
        console.log('⏰ Reserva expirada localmente usereservastore:', rifaId)
        get().liberarReserva(rifaId)
      }
    })

  },

  liberarTodasLasReservas: async () => {
    const { sessionId, reservasActivas } = get()

    if (!sessionId || reservasActivas.size === 0) {
      console.log('⚠️ No hay reservas para liberar')
      return
    }

    try {
      console.log(`🔓 Liberando todas las reservas (${reservasActivas.size} items)`)

      // Llamar RPC para liberar todas las reservas de esta sesión
      const { data, error } = await supabase.rpc('liberar_reservas_sesion', {
        p_session_id: sessionId
      })

      if (error) {
        console.error('❌ Error liberando reservas en BD:', error)
      } else {
        console.log('✅ Reservas liberadas en BD:', data)
      }

      // Limpiar store local
      set({ reservasActivas: new Map() })

    } catch (error) {
      console.error('❌ Error crítico liberando todas las reservas:', error)
    }
  },

  // RESETEAR
  resetear: () => {
    set({
      reservasActivas: new Map(),
      loading: false,
      error: null
    })
  }
}))