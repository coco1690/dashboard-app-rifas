import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import { toast } from 'sonner'

type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'
type ContextoVista = 'admin' | 'agencia'

interface OrdenBoletosCompleta {
    id: string
    cliente_id: string
    agencia_id: string
    rifa_id: string
    cantidad_boletos: number
    total_pago: number
    estado_pago: EstadoPago
    fecha: string
    metodo_pago: string
    // Campos de notificación - NUEVOS
    enviado_email?: boolean
    enviado_whatsapp?: boolean
    enviado_sms?: boolean
    // Datos relacionados que se cargan con JOIN
    cliente_nombre?: string
    documento_identidad?: string
    agencia_nombre?: string
    rifa_nombre?: string
    cliente_phone?: string
}

interface FiltrosOrdenes {
    estado_pago?: EstadoPago | 'todos'
    rifa_id?: string
    fecha_desde?: string
    fecha_hasta?: string
    cliente_buscar?: string
    orden_buscar?: string
}

interface OrdenesStore {
    // Estados
    ordenes: OrdenBoletosCompleta[]
    loading: boolean
    error: string | null

    // Paginación - NUEVO
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number

    // Cache básico
    lastFetch: number | null
    agenciasCache: { id: string; nombre: string }[]
    rifasCache: { id: string; nombre: string }[]

    // Contexto
    contexto: ContextoVista | null
    agenciaId: string | null

    // Filtros
    filtros: FiltrosOrdenes

    // Acciones principales
    inicializarContexto: (contexto: ContextoVista, agenciaId?: string) => void
    cargarOrdenes: (filtros?: FiltrosOrdenes, forceRefresh?: boolean) => Promise<void>
    actualizarEstadoPago: (ordenId: string, nuevoEstado: EstadoPago) => Promise<boolean>
    setPage: (page: number) => void  // NUEVO

    // Gestión de filtros
    setFiltros: (filtros: Partial<FiltrosOrdenes>) => void
    limpiarFiltros: () => void

    // Funciones auxiliares
    obtenerAgencias: () => Promise<{ id: string; nombre: string }[]>
    obtenerRifas: () => Promise<{ id: string; nombre: string }[]>

    // Utilidades
    resetearStore: () => void
}

export const useOrdenesStore = create<OrdenesStore>((set, get) => ({
    // Estados iniciales
    ordenes: [],
    loading: false,
    error: null,

    // Paginación - NUEVO
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,

    // Cache básico
    lastFetch: null,
    agenciasCache: [],
    rifasCache: [],

    // Contexto
    contexto: null,
    agenciaId: null,

    // Filtros
    filtros: {},

    // Inicializar contexto
    inicializarContexto: (contexto: ContextoVista, agenciaId?: string) => {
        if (contexto === 'agencia' && !agenciaId) {
            console.error('agenciaId es requerido para contexto de agencia')
            return
        }

        const { contexto: contextoActual, agenciaId: agenciaActual } = get()

        console.log('🔧 Estado actual vs nuevo:', {
            contextoActual,
            contextoNuevo: contexto,
            agenciaActual,
            agenciaNueva: agenciaId
        })

        if (contextoActual === contexto && agenciaActual === agenciaId) {
            console.log('Contexto ya inicializado')
            return
        }

        set({
            contexto,
            agenciaId: contexto === 'agencia' ? agenciaId! : null,
            filtros: {},
            ordenes: [],
            lastFetch: null,
            currentPage: 1  // NUEVO: Resetear página
        })

        get().cargarOrdenes()
    },

    // ✅ ACTUALIZADO: Cargar órdenes con paginación
    cargarOrdenes: async (filtrosParam?: FiltrosOrdenes, forceRefresh = false) => {
        const { contexto, agenciaId, lastFetch, currentPage, pageSize } = get()

        if (!contexto) {
            console.error('Debe inicializar el contexto antes de cargar órdenes')
            set({ error: 'Contexto no inicializado' })
            return
        }

        if (!forceRefresh && lastFetch && Date.now() - lastFetch < 120000 && !filtrosParam) {
            console.log('Usando cache de órdenes')
            return
        }

        set({ loading: true, error: null })

        try {
            const filtrosActuales = filtrosParam || get().filtros

            // SI HAY BÚSQUEDA DE ORDEN, usar RPC (sin paginación, son pocos resultados)
            if (filtrosActuales.orden_buscar?.trim()) {
                const buscarOrden = filtrosActuales.orden_buscar.trim()

                const { data: ordenesBasicas, error: errorBasico } = await supabase
                    .rpc('buscar_ordenes_por_id_parcial', {
                        busqueda: buscarOrden,
                        contexto_agencia: contexto === 'agencia' ? agenciaId : null
                    })

                if (errorBasico) throw errorBasico

                let ordenesFiltradas = (ordenesBasicas || []) as OrdenBoletosCompleta[]

                // Aplicar filtros adicionales
                if (filtrosActuales.estado_pago && filtrosActuales.estado_pago !== 'todos') {
                    ordenesFiltradas = ordenesFiltradas.filter(o => o.estado_pago === filtrosActuales.estado_pago)
                }

                if (filtrosActuales.rifa_id) {
                    ordenesFiltradas = ordenesFiltradas.filter(o => o.rifa_id === filtrosActuales.rifa_id)
                }

                if (filtrosActuales.fecha_desde) {
                    ordenesFiltradas = ordenesFiltradas.filter(o => filtrosActuales.fecha_desde && o.fecha >= filtrosActuales.fecha_desde)
                }

                if (filtrosActuales.fecha_hasta) {
                    ordenesFiltradas = ordenesFiltradas.filter(o => filtrosActuales.fecha_hasta && o.fecha <= filtrosActuales.fecha_hasta)
                }

                if (filtrosActuales.cliente_buscar) {
                    const buscarCliente = filtrosActuales.cliente_buscar.toLowerCase()
                    ordenesFiltradas = ordenesFiltradas.filter(o =>
                        o.cliente_nombre?.toLowerCase().includes(buscarCliente) ||
                        o.documento_identidad?.toLowerCase().includes(buscarCliente)
                    )
                }

                set({
                    ordenes: ordenesFiltradas,
                    filtros: filtrosActuales,
                    totalCount: ordenesFiltradas.length,
                    totalPages: 1, // Sin paginación en búsqueda por ID
                    loading: false,
                    lastFetch: Date.now()
                })
                return
            }

            // ✅ NUEVO: Obtener COUNT total primero
            let countQuery = supabase
                .from('vista_ordenes_completas')
                .select('*', { count: 'exact', head: true })

            // Aplicar filtros de contexto
            if (contexto === 'agencia') {
                countQuery = countQuery.eq('agencia_id', agenciaId!)
            }

            // Aplicar filtros adicionales al count
            if (filtrosActuales.estado_pago && filtrosActuales.estado_pago !== 'todos') {
                countQuery = countQuery.eq('estado_pago', filtrosActuales.estado_pago)
            }

            if (filtrosActuales.rifa_id) {
                countQuery = countQuery.eq('rifa_id', filtrosActuales.rifa_id)
            }

            if (filtrosActuales.fecha_desde) {
                countQuery = countQuery.gte('fecha', filtrosActuales.fecha_desde)
            }

            if (filtrosActuales.fecha_hasta) {
                countQuery = countQuery.lte('fecha', filtrosActuales.fecha_hasta)
            }

            const { count, error: countError } = await countQuery

            if (countError) throw countError

            const totalCount = count || 0
            const totalPages = Math.ceil(totalCount / pageSize)

            console.log('📊 Paginación:', { totalCount, totalPages, currentPage, pageSize })

            // ✅ NUEVO: Obtener datos paginados
            const from = (currentPage - 1) * pageSize
            const to = from + pageSize - 1

            let dataQuery = supabase
                .from('vista_ordenes_completas')
                .select('*')
                .range(from, to)
                .order('fecha', { ascending: false })

            // Aplicar filtros de contexto
            if (contexto === 'agencia') {
                dataQuery = dataQuery.eq('agencia_id', agenciaId!)
            }

            // Aplicar filtros adicionales
            if (filtrosActuales.estado_pago && filtrosActuales.estado_pago !== 'todos') {
                dataQuery = dataQuery.eq('estado_pago', filtrosActuales.estado_pago)
            }

            if (filtrosActuales.rifa_id) {
                dataQuery = dataQuery.eq('rifa_id', filtrosActuales.rifa_id)
            }

            if (filtrosActuales.fecha_desde) {
                dataQuery = dataQuery.gte('fecha', filtrosActuales.fecha_desde)
            }

            if (filtrosActuales.fecha_hasta) {
                dataQuery = dataQuery.lte('fecha', filtrosActuales.fecha_hasta)
            }

            const { data: ordenesBasicas, error: errorBasico } = await dataQuery

            if (errorBasico) throw errorBasico

            let ordenesFiltradas = (ordenesBasicas || []) as OrdenBoletosCompleta[]

            // Aplicar filtro de cliente (en memoria, ya que ilike no funciona bien en range)
            if (filtrosActuales.cliente_buscar) {
                const buscar = filtrosActuales.cliente_buscar.toLowerCase()
                ordenesFiltradas = ordenesFiltradas.filter(orden =>
                    orden.cliente_nombre?.toLowerCase().includes(buscar) ||
                    orden.documento_identidad?.toLowerCase().includes(buscar)
                )
            }

            set({
                ordenes: ordenesFiltradas,
                filtros: filtrosActuales,
                totalCount,
                totalPages,
                loading: false,
                lastFetch: Date.now()
            })

        } catch (err: any) {
            const errorMessage = err.message || 'Error al cargar órdenes'
            console.error('Error cargando órdenes:', err)
            toast.error('Error al cargar órdenes', { description: errorMessage })
            set({ error: errorMessage, loading: false })
        }
    },

    // ✅ NUEVO: Cambiar de página
    setPage: (page: number) => {
        const { totalPages } = get()
        
        if (page < 1 || page > totalPages) {
            console.warn('Página fuera de rango:', page)
            return
        }

        console.log('📄 Cambiando a página:', page)
        set({ currentPage: page })
        get().cargarOrdenes(get().filtros, false)
    },

    // Establecer filtros y recargar (resetear a página 1)
    setFiltros: (nuevosFiltros: Partial<FiltrosOrdenes>) => {
        const filtrosActualizados = { ...get().filtros, ...nuevosFiltros }
        set({ 
            filtros: filtrosActualizados,
            currentPage: 1  // NUEVO: Resetear a página 1 al filtrar
        })
        get().cargarOrdenes(filtrosActualizados)
    },

    // Limpiar filtros y recargar (resetear a página 1)
    limpiarFiltros: () => {
        set({ 
            filtros: {},
            currentPage: 1  // NUEVO: Resetear a página 1
        })
        get().cargarOrdenes({})
    },

    // Actualizar estado de pago
    actualizarEstadoPago: async (ordenId: string, nuevoEstado: EstadoPago): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('ordenes_boletos')
                .update({ estado_pago: nuevoEstado })
                .eq('id', ordenId)

            if (error) throw error

            // Actualizar el estado local
            set(state => ({
                ordenes: state.ordenes.map(orden =>
                    orden.id === ordenId
                        ? { ...orden, estado_pago: nuevoEstado }
                        : orden
                )
            }))

            toast.success('Estado actualizado correctamente')
            return true

        } catch (err: any) {
            const errorMessage = err.message || 'Error al actualizar estado'
            console.error('Error actualizando estado:', err)
            toast.error('Error al actualizar estado', { description: errorMessage })
            return false
        }
    },

    // Obtener lista de agencias
    obtenerAgencias: async () => {
        console.log('📊 obtenerAgencias desde ordenes ejecutándose')
        const { contexto, agenciasCache } = get()

        if (contexto !== 'admin') {
            console.warn('obtenerAgencias solo está disponible en contexto admin')
            return []
        }

        if (agenciasCache.length > 0) {
            console.log('Usando cache de agencias')
            return agenciasCache
        }

        try {
            const { data, error } = await supabase
                .from('vista_agencias')
                .select('*')
                .order('nombre')

            if (error) throw error

            const agenciasFormateadas = data?.map(agencia => ({
                id: agencia.id,
                nombre: agencia.nombre
            })) || []

            set({ agenciasCache: agenciasFormateadas })

            return agenciasFormateadas

        } catch (error) {
            console.error('Error obteniendo agencias:', error)
            return []
        }
    },

    // Obtener lista de rifas
    obtenerRifas: async () => {
        const { rifasCache } = get()

        if (rifasCache.length > 0) {
            console.log('Usando cache de rifas')
            return rifasCache
        }

        try {
            const { data, error } = await supabase
                .from('rifas')
                .select('id, titulo')
                .order('titulo')

            if (error) throw error

            const rifasFormateadas = data?.map(rifa => ({
                id: rifa.id,
                nombre: rifa.titulo
            })) || []

            set({ rifasCache: rifasFormateadas })

            return rifasFormateadas

        } catch (error) {
            console.error('Error obteniendo rifas:', error)
            return []
        }
    },

    // Resetear store completamente
    resetearStore: () => {
        set({
            ordenes: [],
            loading: false,
            error: null,
            contexto: null,
            agenciaId: null,
            filtros: {},
            lastFetch: null,
            agenciasCache: [],
            rifasCache: [],
            currentPage: 1,
            pageSize: 20,
            totalCount: 0,
            totalPages: 0
        })
    }
}))