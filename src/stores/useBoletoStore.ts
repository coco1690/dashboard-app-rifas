import { supabase } from '@/supabase/client'
import { create } from 'zustand'

type Boleto = {
  id: string
  numero: string
  rifa_id: string
  vendido: boolean
  vendido_a?: string
  vendido_por?: string
  orden_id?: string
  fecha_venta?: string
  reservado?: boolean
  reservado_para_agencia?: string
}

interface EstadisticasRifa {
  total: number
  vendidos: number
  reservados: number
  disponibles: number
}

interface BoletoStore {
  // Solo guardar estadísticas, no todos los boletos
  estadisticasPorRifa: Record<string, EstadisticasRifa>
  loading: boolean
  error: string | null
  digitos: number
  rifaCreada: any | null
  boletosGenerados: boolean
  numerosDelaSuerte: string[]
  mostrarSelectorSuerte: boolean
  guardandoNumerosSuerte: boolean

  setDigitos: (valor: number) => void
  fetchEstadisticasRifa: (rifaId: string) => Promise<EstadisticasRifa>
  generarBoletosParaRifa: (rifaId: string, min: number, max: number, forzar?: boolean) => Promise<void>
  setRifaCreada: (rifa: any) => void
  generarNumerosDelaSuerteAleatorios: (rifaId: string, cantidad?: number) => Promise<void>
  guardarNumerosDelaSuerte: (rifaId: string) => Promise<void>
  resetearEstadoCreacion: () => void

  // Funciones optimizadas - consultan BD directamente
  getTotalBoletos: (rifaId: string) => Promise<number>
  getBoletosVendidosCount: (rifaId: string) => Promise<number>
  getBoletosReservadosCount: (rifaId: string) => Promise<number>
  getBoletosReservadosParaAgencia: (rifaId: string, agenciaId: string, limit?: number) => Promise<Boleto[]>
  getBoletosMuestra: (rifaId: string, limit?: number) => Promise<Boleto[]>
}

const STORAGE_KEY = 'boleto-config'

// const saveToLocalStorage = (state: Partial<BoletoStore>) => {
//   try {
//     const dataToSave = {
//       digitos: state.digitos,
//     }
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
//   } catch (error) {
//     console.error('Error guardando configuración:', error)
//   }
// }

const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error cargando configuración:', error)
  }
  return {}
}

const savedData = loadFromLocalStorage()

export const useBoletoStore = create<BoletoStore>((set, get) => ({
  estadisticasPorRifa: {},
  loading: false,
  error: null,
  digitos: savedData.digitos || 5,
  rifaCreada: null,
  boletosGenerados: false,
  numerosDelaSuerte: [],
  mostrarSelectorSuerte: false,
  guardandoNumerosSuerte: false,

  setDigitos: (valor: number) => {
    set({ digitos: valor })
    // saveToLocalStorage(get())
  },

  // Obtener solo estadísticas (sin cargar todos los boletos)
  fetchEstadisticasRifa: async (rifaId: string) => {
    try {
      const { count: total } = await supabase
        .from('boletos')
        .select('*', { count: 'exact', head: true })
        .eq('rifa_id', rifaId)

      const { count: vendidos } = await supabase
        .from('boletos')
        .select('*', { count: 'exact', head: true })
        .eq('rifa_id', rifaId)
        .eq('vendido', true)

      const { count: reservados } = await supabase
        .from('boletos')
        .select('*', { count: 'exact', head: true })
        .eq('rifa_id', rifaId)
        .not('reservado_para_agencia', 'is', null)
        .eq('vendido', false)

      const stats = {
        total: total || 0,
        vendidos: vendidos || 0,
        reservados: reservados || 0,
        disponibles: (total || 0) - (vendidos || 0)
      }

      set(state => ({
        estadisticasPorRifa: {
          ...state.estadisticasPorRifa,
          [rifaId]: stats
        }
      }))

      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return { total: 0, vendidos: 0, reservados: 0, disponibles: 0 }
    }
  },

  generarBoletosParaRifa: async (rifaId, forzar = 0) => {
    set({ loading: true, error: null })

    try {
      const { count, error: countError } = await supabase
        .from('boletos')
        .select('*', { count: 'exact', head: true })
        .eq('rifa_id', rifaId)

      if (countError) throw countError

      if (count && count > 0 && !forzar) {
        throw new Error(`Ya existen ${count} boletos`)
      }

      if (count && count > 0 && forzar) {
        const { error: delErr } = await supabase
          .from('boletos')
          .delete()
          .eq('rifa_id', rifaId)
        if (delErr) throw delErr
      }

      // 3. Llamar a la función SQL para generar boletos masivos
      const { error: genErr } = await supabase.rpc("generar_boletos", {
        rifa_id: rifaId,
      })
      if (genErr) throw genErr

      // const numeros = generarNumerosAleatoriosUnicos(min, max)

      // const { digitos } = get()

      // const boletos = numeros.map((numero) => ({
      //   numero: numero.toString().padStart(digitos, '0'),
      //   rifa_id: rifaId,
      //   vendido: false,
      // }))

      // const batchSize = 1000
      // for (let i = 0; i < boletos.length; i += batchSize) {
      //   const batch = boletos.slice(i, i + batchSize)
      //   const { error } = await supabase.from('boletos').insert(batch)
      //   if (error) throw error
      //   console.log(`Insertados ${i + batch.length} de ${boletos.length} boletos`)
      // }

      // Actualizar estadísticas
      await get().fetchEstadisticasRifa(rifaId)

      set({ boletosGenerados: true, mostrarSelectorSuerte: true, loading: false })
      console.log(`Boletos generados para rifa ${rifaId}`)

    } catch (err: any) {
      console.error('Error al generar boletos:', err)
      set({ error: err.message || 'Error al generar boletos', loading: false })
      throw err
    }
  },

  setRifaCreada: (rifa: any) => {
    set({
      rifaCreada: rifa,
      boletosGenerados: false,
      numerosDelaSuerte: [],
      mostrarSelectorSuerte: false
    })
  },

  generarNumerosDelaSuerteAleatorios: async (rifaId: string, cantidad: number = 5) => {
    try {
      // Obtener total de boletos
      const { count } = await supabase
        .from('boletos')
        .select('*', { count: 'exact', head: true })
        .eq('rifa_id', rifaId)

      if (!count || count === 0) {
        set({ error: 'No hay boletos disponibles' })
        return
      }

      const cantidadFinal = Math.min(cantidad, count)

      // Generar índices aleatorios
      const indicesAleatorios = new Set<number>()
      while (indicesAleatorios.size < cantidadFinal) {
        indicesAleatorios.add(Math.floor(Math.random() * count))
      }

      // Obtener boletos usando offset aleatorio
      const boletos: string[] = []
      for (const offset of indicesAleatorios) {
        const { data } = await supabase
          .from('boletos')
          .select('numero')
          .eq('rifa_id', rifaId)
          .range(offset, offset)
          .single()

        if (data) boletos.push(data.numero)
      }

      set({ numerosDelaSuerte: boletos })
      console.log('Números de la suerte generados:', boletos)

    } catch (error) {
      console.error('Error generando números de la suerte:', error)
      set({ error: 'Error al generar números de la suerte' })
    }
  },

  guardarNumerosDelaSuerte: async (rifaId: string) => {
    const { numerosDelaSuerte } = get()

    if (numerosDelaSuerte.length === 0) {
      set({ error: 'No hay números de la suerte para guardar' })
      return
    }

    set({ guardandoNumerosSuerte: true, error: null })

    try {
      const { error } = await supabase
        .from('rifas')
        .update({ numeros_de_la_suerte: numerosDelaSuerte })
        .eq('id', rifaId)

      //TODO: Guardar en localStorage para persistencia
      localStorage.setItem('numerosDelaSuerte', JSON.stringify(numerosDelaSuerte))
      console.log('Números de la suerte guardados en localStorage')

      if (error) throw error
      console.log('Números de la suerte guardados exitosamente')



    } catch (err: any) {
      console.error('Error guardando números de la suerte:', err)
      set({ error: err.message })
      throw err
    } finally {
      set({ guardandoNumerosSuerte: false })
    }
  },

  resetearEstadoCreacion: () => {
    set({
      rifaCreada: null,
      boletosGenerados: false,
      numerosDelaSuerte: [],
      mostrarSelectorSuerte: false,
      guardandoNumerosSuerte: false,
      error: null
    })
  },

  // Funciones optimizadas que consultan BD directamente
  getTotalBoletos: async (rifaId: string) => {
    const stats = get().estadisticasPorRifa[rifaId]
    if (stats) return stats.total

    const newStats = await get().fetchEstadisticasRifa(rifaId)
    return newStats.total
  },

  getBoletosVendidosCount: async (rifaId: string) => {
    const stats = get().estadisticasPorRifa[rifaId]
    if (stats) return stats.vendidos

    const newStats = await get().fetchEstadisticasRifa(rifaId)
    return newStats.vendidos
  },

  getBoletosReservadosCount: async (rifaId: string) => {
    const stats = get().estadisticasPorRifa[rifaId]
    if (stats) return stats.reservados

    const newStats = await get().fetchEstadisticasRifa(rifaId)
    return newStats.reservados
  },

  getBoletosReservadosParaAgencia: async (rifaId: string, agenciaId: string, limit: number = 100) => {
    try {
      const { data, error } = await supabase
        .from('boletos')
        .select('*')
        .eq('rifa_id', rifaId)
        .eq('reservado_para_agencia', agenciaId)
        .eq('vendido', false)
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error obteniendo boletos reservados:', error)
      return []
    }
  },

  // getBoletosMuestra: async (rifaId: string, limit: number = 100) => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('boletos')
  //       .select('*')
  //       .eq('rifa_id', rifaId)
  //       .limit(limit)

  //     if (error) throw error
  //     return data || []
  //   } catch (error) {
  //     console.error('Error obteniendo muestra de boletos:', error)
  //     return []
  //   }
  // }

  getBoletosMuestra: async (rifaId: string, limit: number = 100) => {
    try {
      const { data, error } = await supabase
        .from('boletos')
        .select('*')
        .eq('rifa_id', rifaId)
        .order('id', { ascending: true }) 
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error obteniendo muestra de boletos:', error)
      return []
    }
  }
}))

// function generarNumerosAleatoriosUnicos(min: number, max: number): number[] {
//   const numeros = Array.from({ length: max - min + 1 }, (_, i) => i + min)
//   for (let i = numeros.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [numeros[i], numeros[j]] = [numeros[j], numeros[i]]
//   }
//   return numeros
// }

export const formatearNumero = (num: number, digitos: number = 5): string =>
  num.toString().padStart(digitos, '0')



