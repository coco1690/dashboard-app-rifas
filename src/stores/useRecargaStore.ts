import { create } from 'zustand'
import { supabase } from '@/supabase/client'

// Tipo final que queremos usar en nuestro store
type Recarga = {
    id: string
    cantidad: number
    fecha: string
    agencia: { nombre: string } | null
    admin: { nombre: string } | null
    boletos_recargados?: Array<{
        boleto: { numero: string; rifa_id: string }
    }>
}

interface FetchRecargasOptions {
    page?: number
    limit?: number
    forceRefresh?: boolean
}

interface RecargaStore {
    // Estados
    recargas: Recarga[]
    totalRecargas: number // Total de recargas en BD
    currentPage: number
    itemsPerPage: number
    loading: boolean
    error: string | null
    lastFetchRecargas: number | null

    // Acciones
    recargarBoletos: (adminId: string, agenciaId: string, cantidad: number, rifaId: string) => Promise<void>
    fetchRecargas: (options?: FetchRecargasOptions) => Promise<void>
    fetchBoletosDeRecarga: (recargaId: string) => Promise<any[]>
    clearRecargas: () => void
    deleteAllRecargas: () => Promise<void>
    deleteRecarga: (recargaId: string) => Promise<void>
}

export const useRecargaStore = create<RecargaStore>((set, get) => ({
    // Estados iniciales
    recargas: [],
    totalRecargas: 0,
    currentPage: 1,
    itemsPerPage: 10,
    loading: false,
    error: null,
    lastFetchRecargas: null,

    recargarBoletos: async (adminId, agenciaId, cantidad, rifaId) => {
        set({ loading: true, error: null })

        try {
            // Buscar boletos disponibles (no vendidos ni reservados) para esa rifa
            const { data: disponibles, error: fetchError } = await supabase
                .from('boletos')
                .select('id')
                .eq('rifa_id', rifaId)
                .eq('vendido', false)
                .eq('reservado', false)
                .is('vendido_a', null)
                .is('vendido_por', null)
                .order('id', { ascending: true })
                .limit(cantidad)

            if (fetchError) throw fetchError
            if (!disponibles || disponibles.length < cantidad) {
                throw new Error(`Solo hay ${disponibles?.length || 0} boletos disponibles, se necesitan ${cantidad}`)
            }

            const ids = disponibles.map(b => b.id)

            // 1. Insertar la recarga en la tabla
            const { data: recargaData, error: insertError } = await supabase
                .from('recargas_agencia')
                .insert({
                    admin_id: adminId,
                    agencia_id: agenciaId,
                    cantidad,
                })
                .select()
                .single()

            if (insertError) throw insertError

            // 2. Actualizar los boletos
            const { error: updateError } = await supabase
                .from('boletos')
                .update({ reservado: true, reservado_para_agencia: agenciaId })
                .in('id', ids)

            if (updateError) throw updateError

            // 3. Crear registros en boletos_recargados
            const boletosRecargados = ids.map(boletoId => ({
                recarga_id: recargaData.id,
                boleto_id: boletoId
            }))

            const { error: boletoRecargadoError } = await supabase
                .from('boletos_recargados')
                .insert(boletosRecargados)

            if (boletoRecargadoError) throw boletoRecargadoError

            // 4. Actualizar la lista de recargas después de una recarga exitosa
            // Volver a la página 1 y forzar refresh
            await get().fetchRecargas({ page: 1, forceRefresh: true })

            console.log(`✅ Se recargaron ${cantidad} boletos a la agencia`)

        } catch (err: any) {
            console.error('Error al recargar boletos:', err)
            set({ error: err.message || 'Error al recargar boletos' })
            throw err
        } finally {
            set({ loading: false })
        }
    },

    fetchRecargas: async (options = {}) => {
        const { page = 1, limit = 5, forceRefresh = false } = options
        const state = get()
        const now = Date.now()

        // Evitar múltiples peticiones simultáneas
        if (state.loading) {
            console.log('⏭️ fetchRecargas ya está en progreso, saltando...')
            return
        }

        // Cache de 2 minutos para las recargas (120000ms)
        // Solo usar cache si es la misma página y no se fuerza refresh
        if (!forceRefresh &&
            state.recargas.length > 0 &&
            state.currentPage === page &&
            state.lastFetchRecargas &&
            (now - state.lastFetchRecargas) < 120000) {
            console.log('📋 fetchRecargas: usando cache (válido por 2 minutos)')
            return
        }

        console.log(`🔄 Iniciando fetchRecargas desde servidor... (página ${page})`)

        set({ loading: true, error: null })

        try {
            // Calcular offset para paginación
            const offset = (page - 1) * limit

            // 1. Obtener el total de recargas (para calcular páginas)
            const { count, error: countError } = await supabase
                .from('vista_recargas_agencia')
                .select('*', { count: 'exact', head: true })

            if (countError) throw countError

            // 2. Obtener recargas paginadas
            const { data, error } = await supabase
                .from('vista_recargas_agencia')
                .select('*')
                .order('fecha', { ascending: false })
                .range(offset, offset + limit - 1)

            if (error) throw error
            if (!data) throw new Error('No se recibieron datos del servidor')

            // Mapeo directo
            const recargasFormateadas: Recarga[] = data.map((item: any) => ({
                id: item.id,
                cantidad: item.cantidad,
                fecha: item.fecha,
                agencia: item.agencia_nombre ? { nombre: item.agencia_nombre } : null,
                admin: item.admin_nombre ? { nombre: item.admin_nombre } : null,
                boletos_recargados_count: item.boletos_recargados
            }))

            set({
                recargas: recargasFormateadas,
                totalRecargas: count || 0,
                currentPage: page,
                itemsPerPage: limit,
                loading: false,
                error: null,
                lastFetchRecargas: now
            })

            console.log(`✅ fetchRecargas: cargadas ${data.length} recargas de ${count} totales (página ${page})`)

        } catch (err: any) {
            console.error('Error al cargar recargas:', err)

            let errorMessage = 'Error desconocido al cargar recargas'

            if (err?.message) {
                errorMessage = err.message
            } else if (err?.error_description) {
                errorMessage = err.error_description
            } else if (err?.details) {
                errorMessage = err.details
            }

            set({
                loading: false,
                error: errorMessage,
                recargas: [],
                lastFetchRecargas: null
            })
        }
    },

    fetchBoletosDeRecarga: async (recargaId: string) => {
        try {
            const { data, error } = await supabase
                .from('boletos_recargados')
                .select(`
                    boleto_id,
                    boletos (
                        numero,
                        rifa_id
                    )
                `)
                .eq('recarga_id', recargaId)

            if (error) throw error
            if (!data) return []

            return data
        } catch (err: any) {
            console.error('Error al cargar boletos de recarga:', err)
            return []
        }
    },

    clearRecargas: () => {
        set({
            recargas: [],
            totalRecargas: 0,
            currentPage: 1,
            error: null,
            lastFetchRecargas: null
        })
        console.log('🗑️ Historial de recargas limpiado')
    },

    deleteAllRecargas: async () => {
        set({ loading: true, error: null })

        try {
            // 1. Buscar recargas que NO tienen boletos asociados
            const { data: recargasSinBoletos, error: fetchError } = await supabase
                .from('recargas_agencia')
                .select(`
                    id,
                    boletos_recargados!left (
                        recarga_id
                    )
                `)

            if (fetchError) throw fetchError

            // 2. Filtrar las que no tienen boletos_recargados
            const recargasParaEliminar = recargasSinBoletos?.filter(recarga =>
                !recarga.boletos_recargados || recarga.boletos_recargados.length === 0
            ) || []

            if (recargasParaEliminar.length === 0) {
                set({ loading: false })
                console.log('No hay recargas sin boletos para eliminar')
                return
            }

            const idsParaEliminar = recargasParaEliminar.map(r => r.id)

            // 3. Eliminar las recargas que no tienen boletos
            const { error: deleteError, count } = await supabase
                .from('recargas_agencia')
                .delete()
                .in('id', idsParaEliminar)

            if (deleteError) throw deleteError

            console.log(`✅ Eliminadas ${count || recargasParaEliminar.length} recargas sin boletos de la base de datos`)

            // 4. Recargar la página actual con refresh forzado
            const state = get()
            await get().fetchRecargas({ 
                page: state.currentPage, 
                limit: state.itemsPerPage,
                forceRefresh: true 
            })

        } catch (err: any) {
            console.error('Error al eliminar recargas sin boletos:', err)
            set({
                loading: false,
                error: err.message || 'Error al eliminar recargas sin boletos'
            })
            throw err
        }
    },

    deleteRecarga: async (recargaId: string) => {
        set({ loading: true, error: null })

        try {
            // 1. Obtener los boletos asociados a esta recarga
            const { data: boletosRecargados, error: fetchError } = await supabase
                .from('boletos_recargados')
                .select('boleto_id')
                .eq('recarga_id', recargaId)

            if (fetchError) throw fetchError

            const boletoIds = boletosRecargados?.map(br => br.boleto_id) || []

            // 2. Si hay boletos, liberar su reserva (marcarlos como disponibles)
            if (boletoIds.length > 0) {
                const { error: updateError } = await supabase
                    .from('boletos')
                    .update({
                        reservado: false,
                        reservado_para_agencia: null
                    })
                    .in('id', boletoIds)

                if (updateError) throw updateError

                console.log(`✅ ${boletoIds.length} boletos liberados`)
            }

            // 3. Eliminar registros de boletos_recargados
            const { error: deleteBRError } = await supabase
                .from('boletos_recargados')
                .delete()
                .eq('recarga_id', recargaId)

            if (deleteBRError) throw deleteBRError

            // 4. Eliminar la recarga
            const { error: deleteError } = await supabase
                .from('recargas_agencia')
                .delete()
                .eq('id', recargaId)

            if (deleteError) throw deleteError

            console.log(`✅ Recarga ${recargaId} eliminada y boletos liberados`)

            // 5. Recargar la página actual con refresh forzado
            const state = get()
            await get().fetchRecargas({ 
                page: state.currentPage, 
                limit: state.itemsPerPage,
                forceRefresh: true 
            })

        } catch (err: any) {
            console.error('Error al eliminar recarga:', err)
            const errorMessage = err.message || 'Error al eliminar la recarga'
            set({
                loading: false,
                error: errorMessage
            })
            throw err
        }
    },
}))