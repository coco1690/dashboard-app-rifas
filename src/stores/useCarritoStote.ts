import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CarritoItem {
  rifaId: string
  rifaTitulo: string
  rifaSubtitulo?: string
  cantidad: number
  precioUnitario: number
  total: number
  digitos: number
  imagenRifa?: string
  fechaAgregado: string
}

interface CarritoStore {
  // Estado
  items: CarritoItem[]
  loading: boolean
  error: string | null

  // Acciones
  agregarItem: (item: Omit<CarritoItem, 'fechaAgregado'>) => void
  actualizarCantidad: (rifaId: string, cantidad: number) => void
  eliminarItem: (rifaId: string) => void
  limpiarCarrito: () => void
  
  // Getters
  obtenerTotal: () => number
  obtenerCantidadTotal: () => number
  obtenerItem: (rifaId: string) => CarritoItem | undefined
  
  // Utilidades
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
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
       * Agrega un item al carrito o actualiza la cantidad si ya existe
       */
      agregarItem: (item) => {
        const { items } = get()
        const itemExistente = items.find(i => i.rifaId === item.rifaId)

        if (itemExistente) {
          // Si el item ya existe, actualizar la cantidad
          set({
            items: items.map(i =>
              i.rifaId === item.rifaId
                ? {
                    ...i,
                    cantidad: item.cantidad,
                    total: item.cantidad * i.precioUnitario
                  }
                : i
            ),
            error: null
          })
          console.log(`✅ Cantidad actualizada en carrito: ${item.cantidad} números`)
        } else {
          // Si no existe, agregarlo como nuevo
          const nuevoItem: CarritoItem = {
            ...item,
            fechaAgregado: new Date().toISOString()
          }
          
          set({
            items: [...items, nuevoItem],
            error: null
          })
          console.log(`✅ Item agregado al carrito: ${item.cantidad} números`)
        }
      },

      /**
       * Actualiza la cantidad de un item específico
       */
      actualizarCantidad: (rifaId, cantidad) => {
        const { items } = get()
        
        if (cantidad <= 0) {
          // Si la cantidad es 0 o menor, eliminar el item
          set({
            items: items.filter(i => i.rifaId !== rifaId)
          })
          return
        }

        set({
          items: items.map(item =>
            item.rifaId === rifaId
              ? {
                  ...item,
                  cantidad,
                  total: cantidad * item.precioUnitario
                }
              : item
          )
        })
      },

      /**
       * Elimina un item del carrito
       */
      eliminarItem: (rifaId) => {
        const { items } = get()
        set({
          items: items.filter(item => item.rifaId !== rifaId),
          error: null
        })
        console.log(`🗑️ Item eliminado del carrito`)
      },

      /**
       * Limpia todos los items del carrito
       */
      limpiarCarrito: () => {
        set({
          items: [],
          error: null
        })
        console.log(`🗑️ Carrito limpiado`)
      },

      // ========================================================================
      // GETTERS
      // ========================================================================

      /**
       * Obtiene el total del carrito
       */
      obtenerTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.total, 0)
      },

      /**
       * Obtiene la cantidad total de números en el carrito
       */
      obtenerCantidadTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.cantidad, 0)
      },

      /**
       * Obtiene un item específico del carrito
       */
      obtenerItem: (rifaId) => {
        const { items } = get()
        return items.find(item => item.rifaId === rifaId)
      },

      // ========================================================================
      // UTILIDADES
      // ========================================================================

      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error })
    }),
    {
      name: 'carrito-storage', // nombre de la key en localStorage
      partialize: (state) => ({ 
        items: state.items // solo persistir los items
      })
    }
  )
)

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
    actualizarCantidad,
    eliminarItem,
    limpiarCarrito,
    obtenerTotal,
    obtenerCantidadTotal,
    obtenerItem
  } = useCarritoStore()

  return {
    items,
    loading,
    error,
    agregarItem,
    actualizarCantidad,
    eliminarItem,
    limpiarCarrito,
    total: obtenerTotal(),
    cantidadTotal: obtenerCantidadTotal(),
    obtenerItem,
    isEmpty: items.length === 0
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