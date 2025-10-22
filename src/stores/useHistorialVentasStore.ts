import { create } from 'zustand'
import { supabase } from '@/supabase/client'

// Tipos
export interface HistorialVenta {
  orden_id: string
  cliente_id: string
  agencia_id: string
  rifa_id: string
  cantidad_boletos: number
  total_pago: number
  estado_pago: 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'
  metodo_pago: 'efectivo' | 'transferencia' | 'tarjeta'
  fecha_venta: string

  // Información del cliente
  cliente_nombre: string
  cliente_cedula: string
  cliente_email?: string | null
  cliente_telefono?: string | null

  // Información de la rifa
  rifa_titulo: string
  precio_boleta: number
  rifa_estado: string

  // NUEVOS: Campos de ganadores desde la tabla rifas
  rifa_numero_ganador?: string | null
  rifa_numeros_suerte?: string[] | null

  // Información de la agencia
  agencia_nombre: string

  // Números de boletos (puede ser null si no hay boletos)
  numeros_boletos: string[] | null

  // Estadísticas
  precio_promedio_boleto: number
}

export interface FiltrosHistorial {
  agenciaId?: string
  rifaId?: string
  estadoPago?: string
  metodoPago?: string
  fechaDesde?: string
  fechaHasta?: string
  clienteNombre?: string
  clienteCedula?: string
}

export interface EstadisticasVentas {
  totalVentas: number
  totalMonto: number
  totalBoletos: number
  ventasPorMetodo: { [key: string]: number }
  ventasPorEstado: { [key: string]: number }
  promedioVentaPorDia: number
}

interface HistorialVentasStore {
  // Estados
  ventas: HistorialVenta[]
  loading: boolean
  error: string | null

  // Paginación
  currentPage: number
  pageSize: number
  totalCount: number

  // Filtros
  filtros: FiltrosHistorial

  // Estadísticas
  estadisticas: EstadisticasVentas | null

  //cache
  lastFetchHistorial: number | null
  lastCacheKey: string | null
  cacheDuration: number

  // Acciones principales
  obtenerHistorial: (filtros?: FiltrosHistorial, page?: number) => Promise<void>
  obtenerVentaPorId: (ordenId: string) => Promise<HistorialVenta | null>
  obtenerEstadisticas: (filtros?: FiltrosHistorial) => Promise<void>

  // Filtros y búsqueda
  setFiltros: (filtros: Partial<FiltrosHistorial>) => void
  limpiarFiltros: () => void
  buscarPorCliente: (termino: string) => Promise<void>

  // Paginación
  cambiarPagina: (page: number) => void
  cambiarTamanoPagina: (size: number) => void

  // Exportación
  exportarHistorial: (filtros?: FiltrosHistorial) => Promise<Blob>

  // Utilidades
  limpiarError: () => void
  resetearEstado: () => void
}


export const useHistorialVentasStore = create<HistorialVentasStore>((set, get) => ({
  // Estados iniciales
  ventas: [],
  loading: false,
  error: null,

  // Paginación
  currentPage: 1,
  pageSize: 20,
  totalCount: 0,

  // Filtros
  filtros: {},

  // Estadísticas
  estadisticas: null,

  // Cache
  lastFetchHistorial: null,
  lastCacheKey: null,
  cacheDuration: 120000,

  // Obtener historial con filtros y paginación
  // obtenerHistorial: async (filtros = {}, page = 1) => {
  //   set({ loading: true, error: null })

  //   try {
  //     const { pageSize } = get()
  //     const offset = (page - 1) * pageSize

  //     // Combinar filtros existentes con los nuevos
  //     const filtrosActuales = { ...get().filtros, ...filtros }

  //     // Construir query base
  //     let query = supabase
  //       .from('vista_historial_ventas')
  //       .select('*', { count: 'exact' })
  //       .range(offset, offset + pageSize - 1)
  //       .order('fecha_venta', { ascending: false })

  //     // Aplicar filtro de agencia PRIMERO (más importante)
  //     if (filtrosActuales.agenciaId) {
  //       query = query.eq('agencia_id', filtrosActuales.agenciaId)
  //     }

  //     // Aplicar otros filtros
  //     if (filtrosActuales.rifaId) {
  //       query = query.eq('rifa_id', filtrosActuales.rifaId)
  //     }

  //     if (filtrosActuales.estadoPago) {
  //       query = query.eq('estado_pago', filtrosActuales.estadoPago)
  //     }

  //     if (filtrosActuales.metodoPago) {
  //       query = query.eq('metodo_pago', filtrosActuales.metodoPago)
  //     }

  //     if (filtrosActuales.fechaDesde) {
  //       query = query.gte('fecha_venta', filtrosActuales.fechaDesde)
  //     }

  //     if (filtrosActuales.fechaHasta) {
  //       query = query.lte('fecha_venta', filtrosActuales.fechaHasta)
  //     }

  //     if (filtrosActuales.clienteNombre) {
  //       query = query.ilike('cliente_nombre', `%${filtrosActuales.clienteNombre}%`)
  //     }

  //     if (filtrosActuales.clienteCedula) {
  //       query = query.eq('cliente_cedula', filtrosActuales.clienteCedula)
  //     }

  //     const { data, error, count } = await query

  //     if (error) throw error

  //     set({
  //       ventas: data as HistorialVenta[],
  //       currentPage: page,
  //       totalCount: count || 0,
  //       filtros: filtrosActuales, // Guardar filtros combinados
  //       loading: false
  //     })

  //   } catch (err: any) {
  //     set({
  //       error: err.message || 'Error al obtener historial',
  //       loading: false
  //     })
  //   }
  // },

  obtenerHistorial: async (filtros = {}, page = 1) => {
    const state = get()
    const now = Date.now()

    // Combinar filtros existentes con los nuevos
    const filtrosActuales = { ...state.filtros, ...filtros }

    // Generar clave única para cache basada en filtros y página
    const cacheKey = JSON.stringify({ filtros: filtrosActuales, page })
    const lastCacheKey = state.lastCacheKey || ''

    // Verificar si ya está cargando
    if (state.loading) {
      console.log('⏭️ obtenerHistorial ya está en progreso, saltando...')
      return
    }

    // Cache de 2 minutos - solo si coinciden filtros y página exacta
    if (state.ventas.length > 0 &&
      state.lastFetchHistorial &&
      cacheKey === lastCacheKey &&
      (now - state.lastFetchHistorial) < state.cacheDuration) {
      console.log('📋 obtenerHistorial: usando cache (válido por 2 minutos)')
      return
    }

    console.log('🔍 obtenerHistorial: consultando servidor con filtros:', filtrosActuales)
    set({ loading: true, error: null })

    try {
      const { pageSize } = get()
      const offset = (page - 1) * pageSize

      // Construir query base
      let query = supabase
        .from('vista_historial_ventas')
        .select('*', { count: 'exact' })
        .range(offset, offset + pageSize - 1)
        .order('fecha_venta', { ascending: false })

      // Aplicar filtro de agencia PRIMERO (más importante)
      if (filtrosActuales.agenciaId) {
        query = query.eq('agencia_id', filtrosActuales.agenciaId)
      }

      // Aplicar otros filtros
      if (filtrosActuales.rifaId) {
        query = query.eq('rifa_id', filtrosActuales.rifaId)
      }

      if (filtrosActuales.estadoPago) {
        query = query.eq('estado_pago', filtrosActuales.estadoPago)
      }

      if (filtrosActuales.metodoPago) {
        query = query.eq('metodo_pago', filtrosActuales.metodoPago)
      }

      if (filtrosActuales.fechaDesde) {
        query = query.gte('fecha_venta', filtrosActuales.fechaDesde)
      }

      if (filtrosActuales.fechaHasta) {
        query = query.lte('fecha_venta', filtrosActuales.fechaHasta)
      }

      if (filtrosActuales.clienteNombre) {
        query = query.ilike('cliente_nombre', `%${filtrosActuales.clienteNombre}%`)
      }

      if (filtrosActuales.clienteCedula) {
        query = query.eq('cliente_cedula', filtrosActuales.clienteCedula)
      }

      const { data, error, count } = await query

      if (error) throw error

      set({
        ventas: data as HistorialVenta[],
        currentPage: page,
        totalCount: count || 0,
        filtros: filtrosActuales,
        loading: false,
        lastFetchHistorial: now,        // ← Timestamp del cache
        lastCacheKey: cacheKey           // ← Clave del cache
      })

      console.log(`✅ obtenerHistorial: cargadas ${data?.length || 0} ventas desde servidor`)

    } catch (err: any) {
      console.error('Error al obtener historial:', err)
      set({
        error: err.message || 'Error al obtener historial',
        loading: false,
        lastFetchHistorial: null,       // ← Reset cache en error
        lastCacheKey: null               // ← Reset clave cache
      })
    }
  },
  // Obtener una venta específica por ID
  obtenerVentaPorId: async (ordenId: string) => {
    try {
      const { data, error } = await supabase
        .from('vista_historial_ventas')
        .select('*')
        .eq('orden_id', ordenId)
        .single()

      if (error) throw error

      return data as HistorialVenta

    } catch (err: any) {
      set({ error: err.message || 'Error al obtener la venta' })
      return null
    }
  },

  // Obtener estadísticas
  obtenerEstadisticas: async (filtros = {}) => {
    try {
      let query = supabase
        .from('vista_historial_ventas')
        .select('*')

      // Aplicar mismos filtros que en historial
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          if (key === 'fechaDesde') {
            query = query.gte('fecha_venta', value)
          } else if (key === 'fechaHasta') {
            query = query.lte('fecha_venta', value)
          } else if (key === 'clienteNombre') {
            query = query.ilike('cliente_nombre', `%${value}%`)
          } else {
            query = query.eq(key.replace(/([A-Z])/g, '_$1').toLowerCase(), value)
          }
        }
      })

      const { data, error } = await query

      if (error) throw error

      // Calcular estadísticas
      const ventas = data as HistorialVenta[]

      const estadisticas: EstadisticasVentas = {
        totalVentas: ventas.length,
        totalMonto: ventas.reduce((sum, v) => sum + v.total_pago, 0),
        totalBoletos: ventas.reduce((sum, v) => sum + v.cantidad_boletos, 0),
        ventasPorMetodo: ventas.reduce((acc, v) => {
          acc[v.metodo_pago] = (acc[v.metodo_pago] || 0) + 1
          return acc
        }, {} as { [key: string]: number }),
        ventasPorEstado: ventas.reduce((acc, v) => {
          acc[v.estado_pago] = (acc[v.estado_pago] || 0) + 1
          return acc
        }, {} as { [key: string]: number }),
        promedioVentaPorDia: ventas.length > 0 ?
          ventas.reduce((sum, v) => sum + v.total_pago, 0) /
          new Set(ventas.map(v => v.fecha_venta.split('T')[0])).size : 0
      }

      set({ estadisticas })

    } catch (err: any) {
      set({ error: err.message || 'Error al obtener estadísticas' })
    }
  },

  // Establecer filtros
  // setFiltros: (nuevosFiltros) => {
  //   const filtrosActualizados = { ...get().filtros, ...nuevosFiltros }
  //   set({ filtros: filtrosActualizados })
  //   get().obtenerHistorial(filtrosActualizados, 1)
  // },

  // Establecer filtros (manteniendo agenciaId si existe)
  setFiltros: (nuevosFiltros) => {
    const filtrosActuales = get().filtros
    const filtrosActualizados = { ...filtrosActuales, ...nuevosFiltros }

    // Si ya hay un agenciaId establecido, mantenerlo a menos que se pase uno nuevo
    if (filtrosActuales.agenciaId && !nuevosFiltros.agenciaId) {
      filtrosActualizados.agenciaId = filtrosActuales.agenciaId
    }

    set({ filtros: filtrosActualizados })
    get().obtenerHistorial(filtrosActualizados, 1)
  },

  // Limpiar filtros
  limpiarFiltros: () => {
    set({ filtros: {}, currentPage: 1 })
    get().obtenerHistorial({}, 1)
  },

  // Buscar por cliente (nombre o cédula)
  buscarPorCliente: async (termino: string) => {
    const filtros = termino.match(/^\d+$/)
      ? { clienteCedula: termino }
      : { clienteNombre: termino }

    await get().obtenerHistorial(filtros, 1)
  },

  // Cambiar página
  cambiarPagina: (page: number) => {
    const { filtros } = get()
    get().obtenerHistorial(filtros, page)
  },

  // Cambiar tamaño de página
  cambiarTamanoPagina: (size: number) => {
    set({ pageSize: size, currentPage: 1 })
    const { filtros } = get()
    get().obtenerHistorial(filtros, 1)
  },

  // Exportar historial a CSV
  exportarHistorial: async (filtros = {}) => {
    try {
      let query = supabase
        .from('vista_historial_ventas')
        .select('*')
        .order('fecha_venta', { ascending: false })

      // Aplicar filtros (sin paginación para exportar todo)
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          if (key === 'fechaDesde') {
            query = query.gte('fecha_venta', value)
          } else if (key === 'fechaHasta') {
            query = query.lte('fecha_venta', value)
          } else if (key === 'clienteNombre') {
            query = query.ilike('cliente_nombre', `%${value}%`)
          } else {
            query = query.eq(key.replace(/([A-Z])/g, '_$1').toLowerCase(), value)
          }
        }
      })

      const { data, error } = await query

      if (error) throw error

      // Convertir a CSV
      const ventas = data as HistorialVenta[]
      const headers = [
        'Orden ID', 'Fecha', 'Cliente', 'Cédula', 'Rifa',
        'Cantidad Boletos', 'Total Pago', 'Método Pago',
        'Estado', 'Agencia', 'Números Boletos'
      ]
      const csvContent = [
        headers.join(','),
        ...ventas.map(v => [
          v.orden_id,
          new Date(v.fecha_venta).toLocaleDateString(),
          `"${v.cliente_nombre}"`,
          v.cliente_cedula,
          `"${v.rifa_titulo}"`,
          v.cantidad_boletos,
          v.total_pago,
          v.metodo_pago,
          v.estado_pago,
          `"${v.agencia_nombre}"`,
          `"${v.numeros_boletos ? v.numeros_boletos.join(', ') : 'Sin boletos'}"` // ← Fix aquí
        ].join(','))
      ].join('\n')

      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    } catch (err: any) {
      set({ error: err.message || 'Error al exportar historial' })
      throw err
    }
  },

  // Limpiar error
  limpiarError: () => set({ error: null }),

  // Resetear estado
  resetearEstado: () => set({
    ventas: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalCount: 0,
    filtros: {},
    estadisticas: null
  })
}))