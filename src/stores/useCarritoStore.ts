import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useReservaStore } from './useReservaStore'
import { toast } from 'sonner'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CarritoItem {
  reserva_id: string           // ID de la reserva desde backend
  token: string                // Token de seguridad
  rifaId: string
  rifaTitulo: string
  rifaSubtitulo?: string
  imagenRifa?: string
  boletos_ids: string[]        // IDs específicos de boletos reservados
  numeros: string[]            // Números para mostrar al usuario
  cantidad: number             // Del backend (count de boletos_ids)
  precio_unitario: number      // Del backend (desde tabla rifas)
  total: number                // Del backend (calculado en BD)
  digitos: number
  expira_en: string            // Timestamp de expiración ISO
  fechaAgregado: string        // Cuándo se agregó al carrito
}

interface CarritoStore {
  // Estado
  items: CarritoItem[]
  loading: boolean
  error: string | null

  // Acciones
  agregarItem: (item: Omit<CarritoItem, 'fechaAgregado'>) => void
  eliminarItem: (rifaId: string) => void
  limpiarCarrito: () => void
  limpiarItemsExpirados: () => void

  // Getters
  obtenerTotal: () => number
  obtenerCantidadTotal: () => number
  obtenerItem: (rifaId: string) => CarritoItem | undefined
  verificarExpiraciones: () => { expirados: string[], vigentes: string[] }

  // Utilidades
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Verifica si un item ha expirado
 */
const estaExpirado = (expiraEn: string): boolean => {
  return new Date(expiraEn) <= new Date()
}

/**
 * Calcula minutos restantes hasta expiración
 */
const minutosRestantes = (expiraEn: string): number => {
  const ahora = new Date().getTime()
  const expiracion = new Date(expiraEn).getTime()
  const diferencia = expiracion - ahora
  return Math.max(0, Math.floor(diferencia / 60000))
}

// ============================================================================
// STORE CON PERSISTENCIA EN LOCALSTORAGE
// ============================================================================

export const useCarritoStore = create<CarritoStore>()(
  persist(
    (set, get) => ({
      // ========================================================================
      // ESTADO INICIAL
      // ========================================================================
      items: [],
      loading: false,
      error: null,

      // ========================================================================
      // ACCIONES
      // ========================================================================

      /**
       * Agrega un item al carrito
       * NOTA: Cada item es único por rifaId, si ya existe se reemplaza con nueva reserva
       */
      agregarItem: (item) => {
        const { items } = get()

        // CAMBIO: Buscar por reserva_id en lugar de rifaId
        const itemExistente = items.find(i => i.reserva_id === item.reserva_id)

        // Validar que no esté expirado antes de agregar
        if (estaExpirado(item.expira_en)) {
          console.warn('⚠️ Intento de agregar item expirado al carrito')
          set({ error: 'La reserva ha expirado' })
          return
        }

        // Verificar que los datos sean consistentes
        if (item.boletos_ids.length !== item.cantidad) {
          console.error('❌ Inconsistencia: cantidad no coincide con boletos_ids')
          set({ error: 'Error en los datos de reserva' })
          return
        }

        if (item.numeros.length !== item.cantidad) {
          console.error('❌ Inconsistencia: cantidad no coincide con numeros')
          set({ error: 'Error en los datos de reserva' })
          return
        }

        // CAMBIO: Si ya existe (misma reserva_id), es un error
        if (itemExistente) {
          console.warn('⚠️ Esta reserva ya está en el carrito')
          toast.warning('Reserva duplicada', {
            description: 'Esta reserva ya está en tu carrito'
          })
          return
        }

        // ✅ Agregar como nuevo item (siempre)
        const nuevoItem: CarritoItem = {
          ...item,
          fechaAgregado: new Date().toISOString()
        }

        set({
          items: [...items, nuevoItem],
          error: null
        })

        console.log(`✅ Item agregado al carrito: ${item.cantidad} números, expira en ${minutosRestantes(item.expira_en)} min`)
      },

      /**
       * Elimina un item del carrito
       * IMPORTANTE: También debería liberar la reserva en el backend
       */
      // eliminarItem: (rifaId) => {
      //   const { items } = get()
      //   const item = items.find(i => i.rifaId === rifaId)

      //   if (item) {
      //     console.log(`🗑️ Eliminando item del carrito (reserva_id: ${item.reserva_id})`)

      //     //LIBERA LA RESERVA DEL ITEM
      //     useReservaStore.getState().liberarReserva(rifaId)
      //   }

      //   set({
      //     items: items.filter(i => i.rifaId !== rifaId),
      //     error: null
      //   })
      // },

      eliminarItem: (identificador: string) => {
        const { items } = get()

        // Buscar el item por rifaId O por reserva_id
        const item = items.find(i => i.rifaId === identificador || i.reserva_id === identificador)

        if (item) {
          console.log(`🗑️ Eliminando item del carrito (reserva_id: ${item.reserva_id})`)

          // Liberar la reserva en el backend
          useReservaStore.getState().liberarReserva(item.reserva_id)
        }

        set({
          items: items.filter(i => i.rifaId !== identificador && i.reserva_id !== identificador),
          error: null
        })
      },

      
      // Limpia todos los items del carrito
      // IMPORTANTE: También debería liberar todas las reservas en el backend
      limpiarCarrito: () => {
        const { items } = get()

        if (items.length > 0) {
          console.log(`🗑️ Limpiando carrito (${items.length} items)`)

          //LIBERA LAS RESERVAS DEL CARRITO
          useReservaStore.getState().liberarTodasLasReservas()
        }

        set({
          items: [],
          error: null
        })
      },
     
      //  Limpia items expirados del carrito
      //  Debe ejecutarse periódicamente    
      limpiarItemsExpirados: () => {
        const { items } = get()
        const ahora = new Date()

        const itemsValidos = items.filter(item => {
          const expirado = new Date(item.expira_en) <= ahora
          if (expirado) {
            console.log(`⏰ Removiendo item expirado useCarritoStore: ${item.rifaTitulo}`)
            // useReservaStore.getState().liberarReserva(item.reserva_id)
          }
          return !expirado
        })

        if (itemsValidos.length !== items.length) {
          set({ items: itemsValidos })
          console.log(`🧹 ${items.length - itemsValidos.length} item(s) expirado(s) removido(s) useCarritoStore`)
          
        }
      },

      // ========================================================================
      // GETTERS
      // ========================================================================

      
      // Calcula el total del carrito
      // IMPORTANTE: Este total es solo informativo, el backend recalculará en checkout
      obtenerTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          // Solo sumar items no expirados
          if (estaExpirado(item.expira_en)) {
            return total
          }
          return total + item.total
        }, 0)
      },
      
      // Obtiene la cantidad total de números en el carrito     
      obtenerCantidadTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          // Solo contar items no expirados
          if (estaExpirado(item.expira_en)) {
            return total
          }
          return total + item.cantidad
        }, 0)
      },

      //  Obtiene un item específico del carrito    
      obtenerItem: (rifaId) => {
        const { items } = get()
        const item = items.find(i => i.rifaId === rifaId)

        // Si el item está expirado, retornar undefined
        if (item && estaExpirado(item.expira_en)) {
          return undefined
        }

        return item
      },

      // Verifica qué items están expirados y cuáles vigentes
      verificarExpiraciones: () => {
        const { items } = get()
        const ahora = new Date()

        const expirados: string[] = []
        const vigentes: string[] = []

        items.forEach(item => {
          if (new Date(item.expira_en) <= ahora) {
            expirados.push(item.rifaId)
          } else {
            vigentes.push(item.rifaId)
          }
        })

        return { expirados, vigentes }
      },

      // ========================================================================
      // UTILIDADES
      // ========================================================================

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error })
    }),
    {
      name: 'carrito-storage',
      partialize: (state) => ({
        items: state.items // Solo persistir los items
      }),
      // Versión del storage (incrementar si cambias la estructura)
      version: 2,
      // Migración desde versión anterior si es necesario
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || version === 1) {
          // Limpiar carrito de versiones antiguas
          return { items: [] }
        }
        return persistedState as CarritoStore
      }
    }
  )
)

// ============================================================================
// INICIALIZACIÓN - Limpieza periódica de expirados
// ============================================================================

// Ejecutar limpieza cada minuto
if (typeof window !== 'undefined') {
  setInterval(() => {
     useCarritoStore.getState().limpiarItemsExpirados()
  }, 2000) // 2 segundos

  // Ejecutar limpieza al cargar
  setTimeout(() => {
     useCarritoStore.getState().limpiarItemsExpirados()
  }, 1000)
}

// ============================================================================
// HOOKS PERSONALIZADOS
// ============================================================================

/**
 * Hook para usar el carrito con funciones comunes
 */
export const useCarrito = () => {
  const {
    items,
    loading,
    error,
    agregarItem,
    eliminarItem,
    limpiarCarrito,
    limpiarItemsExpirados,
    obtenerTotal,
    obtenerCantidadTotal,
    obtenerItem,
    verificarExpiraciones
  } = useCarritoStore()

  return {
    items,
    loading,
    error,
    agregarItem,
    eliminarItem,
    limpiarCarrito,
    limpiarItemsExpirados,
    total: obtenerTotal(),
    cantidadTotal: obtenerCantidadTotal(),
    obtenerItem,
    verificarExpiraciones,
    isEmpty: items.length === 0,
    tieneItemsExpirados: verificarExpiraciones().expirados.length > 0
  }
}

/**
 * Hook simplificado para componentes que solo necesitan agregar al carrito
 */
export const useAgregarAlCarrito = () => {
  const agregarItem = useCarritoStore(state => state.agregarItem)
  return agregarItem
}

/**
 * Hook para obtener solo el contador del carrito (para navbar)
 */
export const useContadorCarrito = () => {
  const obtenerCantidadTotal = useCarritoStore(state => state.obtenerCantidadTotal)
  return obtenerCantidadTotal()
}

/**
 * Hook para verificar expiraciones (útil para mostrar alertas)
 */
export const useVerificarExpiraciones = () => {
  const verificarExpiraciones = useCarritoStore(state => state.verificarExpiraciones)
  const limpiarItemsExpirados = useCarritoStore(state => state.limpiarItemsExpirados)

  return {
    verificar: verificarExpiraciones,
    limpiar: limpiarItemsExpirados
  }
}