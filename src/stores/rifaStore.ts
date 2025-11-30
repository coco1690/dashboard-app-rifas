import { supabase } from '@/supabase/client';
import { create } from 'zustand'

type Rifa = {
  id: string;
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  estado: 'creada' | 'activa' | 'finalizada' | 'cancelada';
  fecha_inicio: string;
  fecha_fin?: string;
  numero_inicial: number;
  numero_final: number;
  precio_boleta: number;
  imagenes?: string[];
  numero_ganador?: string;
  numeros_de_la_suerte?: string[];
  loteria?: string;
  admin_id: string;
  created_at: string;
  digitos: number;
}

interface RifaStore {
  rifas: Rifa[]
  loading: boolean
  uploadingImages: boolean
  error: string | null
  lastFetch: number | null
  deletingProgress: { paso: string; total: number } | null

  // Funciones principales
  fetchRifas: (forceRefresh?: boolean) => Promise<void>
  createRifa: (nuevaRifa: Omit<Rifa, 'id' | 'created_at'>) => Promise<void>
  deleteRifa: (id: string) => Promise<boolean>
  updateRifaWithImages: (
    rifaId: string, 
    rifaData: Partial<Omit<Rifa, 'id' | 'created_at'>>, 
    newImages: File[], 
    imagesToKeep: string[], 
    imagesToDelete: string[]
  ) => Promise<void>

  // Funciones de imágenes
  uploadImages: (files: File[], userId: string) => Promise<string[]>
  deleteImage: (imageUrl: string) => Promise<boolean>
  createRifaWithImages: (rifaData: Omit<Rifa, 'id' | 'created_at' | 'imagenes'>, images: File[]) => Promise<void>

  // Función simple para limpiar cache
  clearCache: () => void
}

export const useRifaStore = create<RifaStore>((set, get) => ({
  rifas: [],
  loading: false,
  uploadingImages: false,
  error: null,
  lastFetch: null,
  deletingProgress: null,

  fetchRifas: async (forceRefresh = false) => {
    // console.log('🔍 fetchRifas ejecutándose, forceRefresh:', forceRefresh)

    const { rifas, lastFetch } = get()
    const CACHE_KEY = 'rifas_cache'
    const CACHE_TIME_KEY = 'rifas_lastFetch'

    // Intentar cargar desde localStorage si no hay datos en memoria
    if (rifas.length === 0 && !forceRefresh) {
      try {
        const cachedRifas = localStorage.getItem(CACHE_KEY)
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY)

        if (cachedRifas && cachedTime) {
          const parsedRifas = JSON.parse(cachedRifas)
          const parsedTime = parseInt(cachedTime)

          // Si el cache es válido (menos de 5 minutos)
          if (Date.now() - parsedTime < 300000) {
            // console.log('✅ Cargando desde localStorage')
            set({
              rifas: parsedRifas,
              lastFetch: parsedTime,
              loading: false
            })
            return
          }
        }
      } catch (error) {
        console.error('Error al leer localStorage:', error)
      }
    } 

    // Si no forzamos refresh y hay datos recientes (5 minutos), no hacer nada
    if (!forceRefresh && rifas.length > 0 && rifas[0].numero_ganador !== null && lastFetch && Date.now() - lastFetch < 300000) {
      console.log('Usando cache en memoria (datos recientes)')
      return
    }

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase.from('rifas').select('*')

      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      const timestamp = Date.now()

      // Guardar en localStorage
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
        localStorage.setItem(CACHE_TIME_KEY, timestamp.toString())
        // console.log('💾 Datos guardados en localStorage')
      } catch (error) {
        console.error('Error al guardar en localStorage:', error)
      }

      set({
        rifas: data as Rifa[],
        loading: false,
        lastFetch: timestamp,
        error: null
      })

      console.log('✅ Datos actualizados desde BD')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      set({ loading: false, error: errorMessage })
    }
  },

  // Limpiar cache manualmente
  clearCache: () => {
    console.log('🗑️ Cache de rifas limpiado - Stack:', new Error().stack?.split('\n')[2])
    set({ rifas: [], lastFetch: null })
  },

  createRifa: async (nuevaRifa) => {
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('rifas')
        .insert([nuevaRifa])
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // Actualizar cache local
      const { rifas } = get()
      set({
        rifas: [...rifas, data as Rifa],
        loading: false,
        lastFetch: Date.now()
      })

      try {
        localStorage.setItem('rifas_cache', JSON.stringify(get().rifas))
        localStorage.setItem('rifas_lastFetch', Date.now().toString())
      } catch (error) {
        console.error('Error actualizando localStorage:', error)
      }

      console.log("Rifa creada exitosamente")

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  uploadImages: async (files: File[], userId: string): Promise<string[]> => {
    if (!files || files.length === 0) return []

    set({ uploadingImages: true, error: null })
    const uploadedUrls: string[] = []

    try {
      for (const file of files) {
        // Validar archivo
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} no es una imagen válida`)
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} es muy grande. Máximo 5MB`)
        }

        // Generar nombre único
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `rifas/${fileName}`

        // Subir a Supabase Storage
        const { error } = await supabase.storage
          .from('rifa-images')
          .upload(filePath, file)

        if (error) {
          throw new Error(`Error subiendo ${file.name}: ${error.message}`)
        }

        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from('rifa-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(urlData.publicUrl)
      }

      set({ uploadingImages: false })
      return uploadedUrls

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      set({ uploadingImages: false, error: errorMessage })
      throw error
    }
  },

  deleteImage: async (imageUrl: string): Promise<boolean> => {
    try {
      // Extraer el path de la URL
      const urlParts = imageUrl.split('/rifa-images/')
      if (urlParts.length !== 2) {
        console.error('URL de imagen inválida')
        return false
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('rifa-images')
        .remove([filePath])

      if (error) {
        console.error('Error eliminando imagen:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error en deleteImage:', error)
      return false
    }
  },

  createRifaWithImages: async (rifaData, images: File[]) => {
    set({ loading: true, error: null })

    try {
      let imageUrls: string[] = []

      // Si hay imágenes, subirlas primero
      if (images && images.length > 0) {
        imageUrls = await get().uploadImages(images, rifaData.admin_id)
      }

      // Crear la rifa con las URLs de las imágenes
      const nuevaRifa: Omit<Rifa, 'id' | 'created_at'> = {
        ...rifaData,
        imagenes: imageUrls.length > 0 ? imageUrls : undefined,
        digitos: rifaData.digitos
      }

      const { data, error } = await supabase
        .from('rifas')
        .insert([nuevaRifa])
        .select()
        .single()

      if (error) {
        // Si falla la creación de la rifa, eliminar las imágenes subidas
        if (imageUrls.length > 0) {
          for (const url of imageUrls) {
            await get().deleteImage(url)
          }
        }
        throw new Error(error.message)
      }

      // Actualizar cache local
      const { rifas } = get()
      set({
        rifas: [...rifas, data as Rifa],
        loading: false,
        lastFetch: Date.now()
      })

      try {
        localStorage.setItem('rifas_cache', JSON.stringify(get().rifas))
        localStorage.setItem('rifas_lastFetch', Date.now().toString())
      } catch (error) {
        console.error('Error actualizando localStorage:', error)
      }

      console.log("Rifa creada exitosamente con imágenes")

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  // Actualizar rifa con gestión de imágenes
  updateRifaWithImages: async (
    rifaId: string,
    rifaData: Partial<Omit<Rifa, 'id' | 'created_at'>>,
    newImages: File[],
    imagesToKeep: string[],
    imagesToDelete: string[]
  ) => {
    console.log('📝 Iniciando actualización de rifa:', rifaId)
    set({ loading: true, error: null })

    try {
      let finalImageUrls: string[] = [...imagesToKeep]

      // 1. Eliminar imágenes marcadas para eliminar
      if (imagesToDelete.length > 0) {
        console.log(`🗑️ Eliminando ${imagesToDelete.length} imágenes...`)
        for (const imageUrl of imagesToDelete) {
          await get().deleteImage(imageUrl)
        }
      }

      // 2. Subir nuevas imágenes
      if (newImages.length > 0) {
        console.log(`📤 Subiendo ${newImages.length} nuevas imágenes...`)
        const uploadedUrls = await get().uploadImages(newImages, rifaData.admin_id || '')
        finalImageUrls = [...finalImageUrls, ...uploadedUrls]
      }

      // 3. Validar que no exceda el límite de 5 imágenes
      if (finalImageUrls.length > 5) {
        throw new Error('No se pueden tener más de 5 imágenes')
      }

      // 4. Actualizar la rifa en la base de datos
      const updateData = {
        ...rifaData,
        imagenes: finalImageUrls.length > 0 ? finalImageUrls : null,
      }

      const { data, error } = await supabase
        .from('rifas')
        .update(updateData)
        .eq('id', rifaId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // 5. Actualizar cache local
      const { rifas } = get()
      const rifasActualizadas = rifas.map(r => 
        r.id === rifaId ? (data as Rifa) : r
      )

      const timestamp = Date.now()

      set({
        rifas: rifasActualizadas,
        loading: false,
        lastFetch: timestamp,
        error: null
      })

      // 6. Actualizar localStorage
      try {
        localStorage.setItem('rifas_cache', JSON.stringify(rifasActualizadas))
        localStorage.setItem('rifas_lastFetch', timestamp.toString())
        console.log('💾 localStorage actualizado')
      } catch (error) {
        console.error('Error actualizando localStorage:', error)
      }

      console.log('✅ Rifa actualizada exitosamente')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error('❌ Error actualizando rifa:', errorMessage)
      set({ loading: false, error: errorMessage })
      throw error
    }
  },

  deleteRifa: async (id: string): Promise<boolean> => {
    console.log('🗑️ Iniciando eliminación de rifa:', id)
    set({ loading: true, error: null, deletingProgress: null })

    const CACHE_KEY = 'rifas_cache'
    const CACHE_TIME_KEY = 'rifas_lastFetch'

    try {
      // 1. Verificar que la rifa existe y obtener sus datos
      const { data: rifaData, error: checkError } = await supabase
        .from('rifas')
        .select('id, imagenes')
        .eq('id', id)
        .single()

      if (checkError || !rifaData) {
        throw new Error('La rifa no existe o ya fue eliminada')
      }

      // 2. Intentar eliminar imágenes del Storage ANTES de eliminar la rifa
      if (rifaData.imagenes && Array.isArray(rifaData.imagenes) && rifaData.imagenes.length > 0) {
        console.log(`📸 Eliminando ${rifaData.imagenes.length} imágenes...`)
        set({ deletingProgress: { paso: 'Eliminando imágenes', total: rifaData.imagenes.length } })

        for (const imageUrl of rifaData.imagenes) {
          try {
            const urlParts = imageUrl.split('/rifa-images/')
            if (urlParts.length === 2) {
              const filePath = urlParts[1]
              const { error: deleteImageError } = await supabase.storage
                .from('rifa-images')
                .remove([filePath])

              if (deleteImageError) {
                console.warn(`⚠️ No se pudo eliminar imagen ${filePath}:`, deleteImageError)
              } else {
                console.log(`✓ Imagen eliminada: ${filePath}`)
              }
            }
          } catch (imgError) {
            console.warn('Error procesando eliminación de imagen:', imgError)
          }
        }
      }

      // 3. Usar la función RPC para eliminar la rifa y sus relaciones
      console.log('🗄️ Ejecutando eliminación en base de datos...')
      set({ deletingProgress: { paso: 'Eliminando boletos y rifa', total: 0 } })

      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('delete_rifa_completa', { rifa_uuid: id })

      if (rpcError) {
        console.error('❌ Error en RPC delete_rifa_completa:', rpcError)
        throw new Error(`Error al eliminar la rifa: ${rpcError.message}`)
      }

      console.log('✅ Resultado de eliminación:', rpcResult)

      // 4. Actualizar el estado local Y el localStorage
      const rifasActualizadas = get().rifas.filter(r => r.id !== id)
      const timestamp = Date.now()

      // Actualizar localStorage
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(rifasActualizadas))
        localStorage.setItem(CACHE_TIME_KEY, timestamp.toString())
        console.log('💾 localStorage actualizado después de eliminar')
      } catch (error) {
        console.error('⚠️ Error actualizando localStorage:', error)
      }

      set({
        rifas: rifasActualizadas,
        loading: false,
        error: null,
        lastFetch: timestamp,
        deletingProgress: null
      })

      // 5. Limpiar cache de estadísticas de boletos si existe
      try {
        const { useBoletoStore } = await import('./useBoletoStore')
        const boletoStore = useBoletoStore.getState()
        if (boletoStore.estadisticasPorRifa && boletoStore.estadisticasPorRifa[id]) {
          delete boletoStore.estadisticasPorRifa[id]
        }
      } catch (error) {
        console.warn('⚠️ Error limpiando cache de boletos:', error)
      }

      console.log("✅ Rifa eliminada exitosamente (BD + localStorage)")
      return true

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar la rifa'
      console.error('❌ Error en deleteRifa:', errorMessage)

      set({
        loading: false,
        error: errorMessage,
        deletingProgress: null
      })

      throw error
    }
  },

}))