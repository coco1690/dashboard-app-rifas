// import { create } from 'zustand'
// import { supabase } from '@/supabase/client'
// import { toast } from 'sonner'

// type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'
// type ContextoVista = 'admin' | 'agencia'

// interface OrdenBoletosCompleta {
//     id: string
//     cliente_id: string
//     agencia_id: string
//     rifa_id: string
//     cantidad_boletos: number
//     total_pago: number
//     estado_pago: EstadoPago
//     fecha: string
//     metodo_pago: string
//     // Datos relacionados que se cargan con JOIN
//     cliente_nombre?: string
//     documento_identidad?: string
//     agencia_nombre?: string
//     rifa_nombre?: string
// }

// interface FiltrosOrdenes {
//     estado_pago?: EstadoPago | 'todos'
//     rifa_id?: string
//     fecha_desde?: string
//     fecha_hasta?: string
//     cliente_buscar?: string
// }

// interface OrdenesStore {
//     // Estados
//     ordenes: OrdenBoletosCompleta[]
//     loading: boolean
//     error: string | null


//     // Contexto
//     contexto: ContextoVista | null
//     agenciaId: string | null

//     // Filtros (sin agencia_id porque se maneja por contexto)
//     filtros: FiltrosOrdenes

//     // Acciones principales
//     inicializarContexto: (contexto: ContextoVista, agenciaId?: string) => void
//     cargarOrdenes: (filtros?: FiltrosOrdenes) => Promise<void>
//     actualizarEstadoPago: (ordenId: string, nuevoEstado: EstadoPago) => Promise<boolean>

//     // Gestión de filtros
//     setFiltros: (filtros: Partial<FiltrosOrdenes>) => void
//     limpiarFiltros: () => void

//     // Funciones auxiliares
//     obtenerAgencias: () => Promise<{ id: string; nombre: string }[]>
//     obtenerRifas: () => Promise<{ id: string; nombre: string }[]>

//     // Utilidades
//     resetearStore: () => void
// }

// export const useOrdenesStore = create<OrdenesStore>((set, get) => ({
//     // Estados iniciales
//     ordenes: [],
//     loading: false,
//     error: null,

//     // Contexto
//     contexto: null,
//     agenciaId: null,

//     // Filtros
//     filtros: {},

//     // Inicializar contexto - DEBE llamarse antes de usar el store
//     inicializarContexto: (contexto: ContextoVista, agenciaId?: string) => {
//         if (contexto === 'agencia' && !agenciaId) {
//             console.error('agenciaId es requerido para contexto de agencia')
//             return
//         }

//         set({
//             contexto,
//             agenciaId: contexto === 'agencia' ? agenciaId! : null,
//             filtros: {}, // Limpiar filtros al cambiar contexto
//             ordenes: []  // Limpiar órdenes al cambiar contexto
//         })

//         // Cargar datos inmediatamente
//         get().cargarOrdenes()
//     },

//     // Cargar órdenes según el contexto
//     cargarOrdenes: async (filtrosParam?: FiltrosOrdenes) => {
//         const { contexto, agenciaId } = get()

//         if (!contexto) {
//             console.error('Debe inicializar el contexto antes de cargar órdenes')
//             set({ error: 'Contexto no inicializado' })
//             return
//         }

//         set({ loading: true, error: null })

//         try {
//             const filtrosActuales = filtrosParam || get().filtros

//             // Construir la consulta base
//             let query = supabase
//                 .from('ordenes_boletos')
//                 .select('*')
//                 .order('fecha', { ascending: false })

//             // APLICAR FILTRO DE AGENCIA SEGÚN CONTEXTO
//             if (contexto === 'agencia') {
//                 // Para agencias: SIEMPRE filtrar por agencia_id
//                 query = query.eq('agencia_id', agenciaId!)
//             }
//             // Para admin: NO aplicar filtro de agencia (ver todas)

//             // Aplicar filtros adicionales
//             if (filtrosActuales.estado_pago && filtrosActuales.estado_pago !== 'todos') {
//                 query = query.eq('estado_pago', filtrosActuales.estado_pago)
//             }

//             if (filtrosActuales.rifa_id) {
//                 query = query.eq('rifa_id', filtrosActuales.rifa_id)
//             }

//             if (filtrosActuales.fecha_desde) {
//                 query = query.gte('fecha', filtrosActuales.fecha_desde)
//             }

//             if (filtrosActuales.fecha_hasta) {
//                 query = query.lte('fecha', filtrosActuales.fecha_hasta)
//             }

//             const { data: ordenesBasicas, error: errorBasico } = await query

//             if (errorBasico) throw errorBasico

//             if (!ordenesBasicas || ordenesBasicas.length === 0) {
//                 set({ ordenes: [], loading: false })
//                 return
//             }

//             // Obtener datos relacionados
//             const clienteIds = [...new Set(ordenesBasicas.map(o => o.cliente_id))]
//             const agenciaIds = [...new Set(ordenesBasicas.map(o => o.agencia_id))]
//             const rifaIds = [...new Set(ordenesBasicas.map(o => o.rifa_id))]

//             // Hacer consultas batch en paralelo
//             const [clientesData, agenciasData, rifasData] = await Promise.all([
//                 supabase.from('users').select('id, nombre, documento_identidad').in('id', clienteIds),
//                 supabase.from('users').select('id, nombre').in('id', agenciaIds),
//                 supabase.from('rifas').select('id, titulo').in('id', rifaIds)
//             ])

//             // Crear mapas para lookup rápido
//             const clientesMap = new Map(clientesData.data?.map(c => [c.id, c]) || [])
//             const agenciasMap = new Map(agenciasData.data?.map(a => [a.id, a]) || [])
//             const rifasMap = new Map(rifasData.data?.map(r => [r.id, r]) || [])

//             // Combinar datos
//             const ordenesCompletas = ordenesBasicas.map(orden => {
//                 const cliente = clientesMap.get(orden.cliente_id)
//                 const agencia = agenciasMap.get(orden.agencia_id)
//                 const rifa = rifasMap.get(orden.rifa_id)

//                 return {
//                     ...orden,
//                     cliente_nombre: cliente?.nombre || 'Cliente no encontrado',
//                     documento_identidad: cliente?.documento_identidad || 'Sin documento',
//                     agencia_nombre: agencia?.nombre || 'Agencia no encontrada',
//                     rifa_nombre: rifa?.titulo || 'Rifa no encontrada'
//                 }
//             })

//             // Aplicar filtro de búsqueda de cliente
//             let ordenesFiltradas = ordenesCompletas
//             if (filtrosActuales.cliente_buscar) {
//                 const buscar = filtrosActuales.cliente_buscar.toLowerCase()
//                 ordenesFiltradas = ordenesFiltradas.filter(orden =>
//                     orden.cliente_nombre?.toLowerCase().includes(buscar) ||
//                     orden.documento_identidad?.toLowerCase().includes(buscar)
//                 )
//             }

//             set({
//                 ordenes: ordenesFiltradas,
//                 filtros: filtrosActuales, // Guardar filtros aplicados
//                 loading: false
//             })

//         } catch (err: any) {
//             const errorMessage = err.message || 'Error al cargar órdenes'
//             console.error('Error cargando órdenes:', err)
//             toast.error('Error al cargar órdenes', { description: errorMessage })
//             set({ error: errorMessage, loading: false })
//         }
//     },

//     // Establecer filtros y recargar
//     setFiltros: (nuevosFiltros: Partial<FiltrosOrdenes>) => {
//         const filtrosActualizados = { ...get().filtros, ...nuevosFiltros }
//         set({ filtros: filtrosActualizados })
//         get().cargarOrdenes(filtrosActualizados)
//     },

//     // Limpiar filtros y recargar
//     limpiarFiltros: () => {
//         set({ filtros: {} })
//         get().cargarOrdenes({})
//     },

//     // Actualizar estado de pago
//     actualizarEstadoPago: async (ordenId: string, nuevoEstado: EstadoPago): Promise<boolean> => {
//         try {
//             const { error } = await supabase
//                 .from('ordenes_boletos')
//                 .update({ estado_pago: nuevoEstado })
//                 .eq('id', ordenId)

//             if (error) throw error

//             // También actualizar las transacciones relacionadas
//             await supabase
//                 .from('transacciones_venta')
//                 .update({ estado_pago: nuevoEstado })
//                 .eq('orden_id', ordenId)

//             // Actualizar el estado local
//             set(state => ({
//                 ordenes: state.ordenes.map(orden =>
//                     orden.id === ordenId
//                         ? { ...orden, estado_pago: nuevoEstado }
//                         : orden
//                 )
//             }))

//             toast.success('Estado actualizado correctamente')
//             return true

//         } catch (err: any) {
//             const errorMessage = err.message || 'Error al actualizar estado'
//             console.error('Error actualizando estado:', err)
//             toast.error('Error al actualizar estado', { description: errorMessage })
//             return false
//         }
//     },

//     // Obtener lista de agencias (solo para admin)
//     obtenerAgencias: async () => {
//         const { contexto } = get()

//         if (contexto !== 'admin') {
//             console.warn('obtenerAgencias solo está disponible en contexto admin')
//             return []
//         }

//         try {
//             const { data: agencias, error: errorAgencias } = await supabase
//                 .from('agencias')
//                 .select('user_id')

//             if (errorAgencias) throw errorAgencias

//             if (!agencias || agencias.length === 0) return []

//             // Obtener nombres de usuarios
//             const userIds = agencias.map(a => a.user_id)
//             const { data: usuarios, error: errorUsuarios } = await supabase
//                 .from('users')
//                 .select('id, nombre')
//                 .in('id', userIds)

//             if (errorUsuarios) throw errorUsuarios

//             const usuariosMap = new Map(usuarios?.map(u => [u.id, u.nombre]) || [])

//             const agenciasConNombres = agencias.map(agencia => ({
//                 id: agencia.user_id,
//                 nombre: usuariosMap.get(agencia.user_id) || `Agencia ${agencia.user_id.substring(0, 8)}`
//             }))

//             return agenciasConNombres.sort((a, b) => a.nombre.localeCompare(b.nombre))

//         } catch (error) {
//             console.error('Error obteniendo agencias:', error)
//             return []
//         }
//     },

//     // Obtener lista de rifas
//     obtenerRifas: async () => {
//         try {
//             const { data, error } = await supabase
//                 .from('rifas')
//                 .select('id, titulo')
//                 .order('titulo')

//             if (error) throw error

//             return data?.map(rifa => ({
//                 id: rifa.id,
//                 nombre: rifa.titulo
//             })) || []

//         } catch (error) {
//             console.error('Error obteniendo rifas:', error)
//             return []
//         }
//     },

//     // Resetear store completamente
//     resetearStore: () => {
//         set({
//             ordenes: [],
//             loading: false,
//             error: null,
//             contexto: null,
//             agenciaId: null,
//             filtros: {}
//         })
//     }
// }))

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
    // Datos relacionados que se cargan con JOIN
    cliente_nombre?: string
    documento_identidad?: string
    agencia_nombre?: string
    rifa_nombre?: string
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

    // Cache básico
    lastFetch: number | null
    agenciasCache: { id: string; nombre: string }[]
    rifasCache: { id: string; nombre: string }[]

    // Contexto
    contexto: ContextoVista | null
    agenciaId: string | null

    // Filtros (sin agencia_id porque se maneja por contexto)
    filtros: FiltrosOrdenes

    // Acciones principales
    inicializarContexto: (contexto: ContextoVista, agenciaId?: string) => void
    cargarOrdenes: (filtros?: FiltrosOrdenes, forceRefresh?: boolean) => Promise<void>
    actualizarEstadoPago: (ordenId: string, nuevoEstado: EstadoPago) => Promise<boolean>

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

    // Cache básico
    lastFetch: null,
    agenciasCache: [],
    rifasCache: [],

    // Contexto
    contexto: null,
    agenciaId: null,

    // Filtros
    filtros: {},

    // Inicializar contexto - DEBE llamarse antes de usar el store
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

        // Solo reinicializar si cambió el contexto
        if (contextoActual === contexto && agenciaActual === agenciaId) {
            console.log('Contexto ya inicializado')
            return
        }

        set({
            contexto,
            agenciaId: contexto === 'agencia' ? agenciaId! : null,
            filtros: {}, // Limpiar filtros al cambiar contexto
            ordenes: [], // Limpiar órdenes al cambiar contexto
            lastFetch: null // Invalidar cache al cambiar contexto
        })

        // Cargar datos inmediatamente
        get().cargarOrdenes()
    },

    // Cargar órdenes según el contexto
    // cargarOrdenes: async (filtrosParam?: FiltrosOrdenes, forceRefresh = false) => {
    //     const { contexto, agenciaId, lastFetch } = get()

    //     console.log('📊 cargarOrdenes - Contexto:', { contexto, agenciaId })

    //     if (!contexto) {
    //         console.error('Debe inicializar el contexto antes de cargar órdenes')
    //         set({ error: 'Contexto no inicializado' })
    //         return
    //     }

    //     // Cache simple: si no forzamos refresh y hay datos recientes (2 minutos), no recargar
    //     if (!forceRefresh && lastFetch && Date.now() - lastFetch < 120000 && !filtrosParam) {
    //         console.log('Usando cache de órdenes')
    //         return
    //     }

    //     set({ loading: true, error: null })

    //     try {
    //         const filtrosActuales = filtrosParam || get().filtros

    //         // Construir la consulta base USANDO LA VISTA
    //         let query = supabase
    //             .from('vista_ordenes_completas')
    //             .select('*')
    //             .order('fecha', { ascending: false })

    //         // APLICAR FILTRO DE AGENCIA SEGÚN CONTEXTO
    //         if (contexto === 'agencia') {
    //             console.log('🔍 Aplicando filtro de agencia:', agenciaId)
    //             query = query.eq('agencia_id', agenciaId!)
    //         } else {
    //             console.log('🔍 Contexto admin - mostrando todas las órdenes')
    //         }
    //         // Para admin: NO aplicar filtro de agencia (ver todas)

    //         // Aplicar filtros adicionales
    //         if (filtrosActuales.estado_pago && filtrosActuales.estado_pago !== 'todos') {
    //             query = query.eq('estado_pago', filtrosActuales.estado_pago)
    //         }

    //         if (filtrosActuales.rifa_id) {
    //             query = query.eq('rifa_id', filtrosActuales.rifa_id)
    //         }

    //         if (filtrosActuales.fecha_desde) {
    //             query = query.gte('fecha', filtrosActuales.fecha_desde)
    //         }

    //         if (filtrosActuales.fecha_hasta) {
    //             query = query.lte('fecha', filtrosActuales.fecha_hasta)
    //         }


    //         if (filtrosActuales.orden_buscar) {
    //             const buscarOrden = filtrosActuales.orden_buscar.trim()
    //             if (buscarOrden.length > 0) {
    //                 // Usar función RPC personalizada
    //                 const { data: ordenesBasicas, error: errorBasico } = await supabase
    //                     .rpc('buscar_ordenes_por_id_parcial', {
    //                         busqueda: buscarOrden,
    //                         contexto_agencia: contexto === 'agencia' ? agenciaId : null
    //                     })

    //                 if (errorBasico) throw errorBasico

    //                 // Aplicar TODOS los demás filtros manualmente
    //                 let ordenesFiltradas = ordenesBasicas as OrdenBoletosCompleta[]

    //                 // Aplicar filtros adicionales que la función RPC no maneja
    //                 if (filtrosActuales.estado_pago && filtrosActuales.estado_pago !== 'todos') {
    //                     ordenesFiltradas = ordenesFiltradas.filter(o => o.estado_pago === filtrosActuales.estado_pago)
    //                 }

    //                 if (filtrosActuales.rifa_id) {
    //                     ordenesFiltradas = ordenesFiltradas.filter(o => o.rifa_id === filtrosActuales.rifa_id)
    //                 }

    //                 if (filtrosActuales.fecha_desde) {
    //                     ordenesFiltradas = ordenesFiltradas.filter(o => filtrosActuales.fecha_desde && o.fecha >= filtrosActuales.fecha_desde)
    //                 }

    //                 if (filtrosActuales.fecha_hasta) {
    //                     ordenesFiltradas = ordenesFiltradas.filter(o => filtrosActuales.fecha_hasta && o.fecha <= filtrosActuales.fecha_hasta)
    //                 }

    //                 if (filtrosActuales.cliente_buscar) {
    //                     const buscarCliente = filtrosActuales.cliente_buscar.toLowerCase()
    //                     ordenesFiltradas = ordenesFiltradas.filter(o =>
    //                         o.cliente_nombre?.toLowerCase().includes(buscarCliente) ||
    //                         o.documento_identidad?.toLowerCase().includes(buscarCliente)
    //                     )
    //                 }

    //                 set({
    //                     ordenes: ordenesFiltradas,
    //                     filtros: filtrosActuales,
    //                     loading: false,
    //                     lastFetch: Date.now()
    //                 })
    //                 return
    //             }
    //         }

    //         const { data: ordenesBasicas, error: errorBasico } = await query

    //         if (errorBasico) throw errorBasico

    //         if (!ordenesBasicas || ordenesBasicas.length === 0) {
    //             set({
    //                 ordenes: [],
    //                 loading: false,
    //                 lastFetch: Date.now()
    //             })
    //             return
    //         }

    //         // ¡Usar la vista que ya tiene todos los datos! 
    //         // Ya no necesitamos hacer consultas adicionales
    //         const ordenesCompletas = ordenesBasicas as OrdenBoletosCompleta[]

    //         // Aplicar filtro de búsqueda de cliente
    //         let ordenesFiltradas = ordenesCompletas
    //         if (filtrosActuales.cliente_buscar) {
    //             const buscar = filtrosActuales.cliente_buscar.toLowerCase()
    //             ordenesFiltradas = ordenesFiltradas.filter(orden =>
    //                 orden.cliente_nombre?.toLowerCase().includes(buscar) ||
    //                 orden.documento_identidad?.toLowerCase().includes(buscar)
    //             )
    //         }

    //         set({
    //             ordenes: ordenesFiltradas,
    //             filtros: filtrosActuales, // Guardar filtros aplicados
    //             loading: false,
    //             lastFetch: Date.now() // Actualizar cache
    //         })

    //     } catch (err: any) {
    //         const errorMessage = err.message || 'Error al cargar órdenes'
    //         console.error('Error cargando órdenes:', err)
    //         toast.error('Error al cargar órdenes', { description: errorMessage })
    //         set({ error: errorMessage, loading: false })
    //     }
    // },

    cargarOrdenes: async (filtrosParam?: FiltrosOrdenes, forceRefresh = false) => {
        const { contexto, agenciaId, lastFetch } = get()

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

            // SI HAY BÚSQUEDA DE ORDEN, usar RPC
            if (filtrosActuales.orden_buscar?.trim()) {
                const buscarOrden = filtrosActuales.orden_buscar.trim()

                const { data: ordenesBasicas, error: errorBasico } = await supabase
                    .rpc('buscar_ordenes_por_id_parcial', {
                        busqueda: buscarOrden,
                        contexto_agencia: contexto === 'agencia' ? agenciaId : null
                    })

                if (errorBasico) throw errorBasico

                let ordenesFiltradas = (ordenesBasicas || []) as OrdenBoletosCompleta[]

                // Aplicar filtros adicionales manualmente
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
                    loading: false,
                    lastFetch: Date.now()
                })
                return
            }

            // SI NO HAY BÚSQUEDA DE ORDEN, usar query normal
            let query = supabase
                .from('vista_ordenes_completas')
                .select('*')
                .order('fecha', { ascending: false })

            // Aplicar filtros en la query
            if (contexto === 'agencia') {
                query = query.eq('agencia_id', agenciaId!)
            }

            if (filtrosActuales.estado_pago && filtrosActuales.estado_pago !== 'todos') {
                query = query.eq('estado_pago', filtrosActuales.estado_pago)
            }

            if (filtrosActuales.rifa_id) {
                query = query.eq('rifa_id', filtrosActuales.rifa_id)
            }

            if (filtrosActuales.fecha_desde) {
                query = query.gte('fecha', filtrosActuales.fecha_desde)
            }

            if (filtrosActuales.fecha_hasta) {
                query = query.lte('fecha', filtrosActuales.fecha_hasta)
            }

            const { data: ordenesBasicas, error: errorBasico } = await query

            if (errorBasico) throw errorBasico

            let ordenesFiltradas = (ordenesBasicas || []) as OrdenBoletosCompleta[]

            // Aplicar filtro de cliente
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

    // Establecer filtros y recargar
    setFiltros: (nuevosFiltros: Partial<FiltrosOrdenes>) => {
        const filtrosActualizados = { ...get().filtros, ...nuevosFiltros }
        set({ filtros: filtrosActualizados })
        get().cargarOrdenes(filtrosActualizados)
    },

    // Limpiar filtros y recargar
    limpiarFiltros: () => {
        set({ filtros: {} })
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

            // También actualizar las transacciones relacionadas
            // await supabase
            //     .from('transacciones_venta')
            //     .update({ estado_pago: nuevoEstado })
            //     .eq('orden_id', ordenId)

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

    // Obtener lista de agencias (solo para admin) - USANDO VISTA
    obtenerAgencias: async () => {
        console.log('📊 obtenerAgencias desde ordenes ejecutándose')
        const { contexto, agenciasCache } = get()

        if (contexto !== 'admin') {
            console.warn('obtenerAgencias solo está disponible en contexto admin')
            return []
        }

        // Usar cache si existe
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

            // Guardar en cache
            set({ agenciasCache: agenciasFormateadas })

            return agenciasFormateadas

        } catch (error) {
            console.error('Error obteniendo agencias:', error)
            return []
        }
    },

    // Obtener lista de rifas - CON CACHE
    obtenerRifas: async () => {
        const { rifasCache } = get()

        // Usar cache si existe
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

            // Guardar en cache
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
            rifasCache: []
        })
    }
}))