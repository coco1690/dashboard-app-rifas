// import { create } from 'zustand'
// import { supabase } from '@/supabase/client'

// type UserSummary = {
//   id: string
//   nombre: string
//   email: string
//   phone: string
//   user_type: 'cliente' | 'agencia'
// }

// type AgencyDetails = {
//   user_id: string
//   direccion: string
//   ciudad: string
//   comision_porcentaje: number
//   is_verified: boolean
//   created_at: string
//   admin_id: string | null
//   user: UserSummary
// }

// type ClientDetails = {
//   user_id: string
//   direccion: string
//   ciudad: string
//   agencia_id: string | null
//   created_at: string
//   user: UserSummary
// }

// // Tipos para actualizaciones
// type UpdateUserData = {
//   nombre?: string
//   email?: string
//   phone?: string
//   documento_identidad?: string
// }

// type UpdateAgencyData = {
//   direccion?: string
//   ciudad?: string
//   comision_porcentaje?: number
//   is_verified?: boolean
// }

// type UpdateClientData = {
//   direccion?: string
//   ciudad?: string
//   agencia_id?: string | null
// }

// type UserListState = {
//   clientes: UserSummary[]
//   agencias: AgencyDetails[]
//   selectedAgencia: AgencyDetails | null
//   selectedCliente: ClientDetails | null
//   loading: boolean
//   error: string | null
//   agenciasLoaded: boolean
//   clientesLoaded: boolean
//   lastFetchAgencias: number | null

//   // Funciones de lectura
//   fetchClientes: () => Promise<void>
//   fetchAgencias: () => Promise<void>
//   fetchAgenciaById: (id: string) => Promise<void>
//   fetchClienteById: (id: string) => Promise<void>

//   // Funciones de actualización
//   updateAgencia: (userId: string, userData: UpdateUserData, agencyData: UpdateAgencyData) => Promise<boolean>
//   updateCliente: (userId: string, userData: UpdateUserData, clientData: UpdateClientData) => Promise<boolean>
//   toggleAgenciaVerificacion: (userId: string, isVerified: boolean) => Promise<boolean>

//   // Funciones de eliminación
//   deleteAgencia: (userId: string) => Promise<boolean>
//   deleteCliente: (userId: string) => Promise<boolean>

//   // Función para resetear el estado
//   reset: () => void
// }

// export const useUserListStore = create<UserListState>((set, get) => ({
//   clientes: [],
//   agencias: [],
//   selectedAgencia: null,
//   selectedCliente: null,
//   loading: false,
//   error: null,
//   agenciasLoaded: false,
//   clientesLoaded: false,
//   lastFetchAgencias: null,

//   fetchClientes: async () => {
//     console.log('👥 fetchClientes ejecutándose')
//     const state = get()
//     if (state.loading || state.clientesLoaded) return

//     set({ loading: true, error: null })

//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('id, nombre, email, phone, user_type')
//         .eq('user_type', 'cliente')

//       if (error) {
//         set({ error: error.message, loading: false })
//       } else {
//         set({
//           clientes: data as UserSummary[],
//           loading: false,
//           clientesLoaded: true
//         })
//       }
//     } catch (err) {
//       set({
//         error: err instanceof Error ? err.message : 'Error desconocido',
//         loading: false
//       })
//     }
//   },

//   fetchAgencias: async () => {
//     console.log('🏢 fetchAgencias ejecutándose')
//     const state = get()
//     const now = Date.now()

//     // Verificar si ya está cargando
//     if (state.loading) {
//       console.log('⏭️ fetchAgencias ya está en progreso, saltando...')
//       return
//     }

//     // Cache de 5 minutos (300000ms) - solo si ya tenemos datos y el cache es válido
//     if (state.agenciasLoaded &&
//       state.agencias.length > 0 &&
//       state.lastFetchAgencias &&
//       (now - state.lastFetchAgencias) < 300000) {
//       console.log('📋 fetchAgencias: usando cache (válido por 5 minutos)')
//       return
//     }

//     console.log('🔍 fetchAgencias: consultando servidor')
//     set({ loading: true, error: null })

//     try {
//       const { data, error } = await supabase
//         .from('agencias')
//         .select(`
//         user_id,
//         direccion,
//         ciudad,
//         comision_porcentaje,
//         is_verified,
//         created_at,
//         admin_id,
//         user:users (
//           id,
//           nombre,
//           email,
//           phone,
//           user_type
//         )
//       `)

//       if (error) {
//         set({ error: error.message, loading: false })
//       } else {
//         const agencias = (data as any[]).map((agencia) => ({
//           ...agencia,
//           user: Array.isArray(agencia.user) ? agencia.user[0] : agencia.user
//         })) as AgencyDetails[]

//         set({
//           agencias,
//           loading: false,
//           agenciasLoaded: true,
//           lastFetchAgencias: now  // ← Guardar timestamp del cache
//         })

//         console.log(`✅ fetchAgencias: cargadas ${agencias.length} agencias exitosamente`)
//       }
//     } catch (err) {
//       set({
//         error: err instanceof Error ? err.message : 'Error desconocido',
//         loading: false
//       })
//     }
//   },

//   fetchAgenciaById: async (id: string) => {
//     console.log('🏢 fetchAgenciaById ejecutándose')
//     set({ loading: true, error: null })

//     try {
//       const { data, error } = await supabase
//         .from('agencias')
//         .select(`
//           user_id,
//           direccion,
//           ciudad,
//           comision_porcentaje,
//           is_verified,
//           created_at,
//           admin_id,
//           user:users (
//             id,
//             nombre,
//             email,
//             phone,
//             user_type
//           )
//         `)
//         .eq('user_id', id)
//         .single()

//       if (error || !data) {
//         set({
//           selectedAgencia: null,
//           error: error?.message || 'No se encontró la agencia',
//           loading: false
//         })
//       } else {
//         const agenciaData = {
//           ...data,
//           user: Array.isArray(data.user) ? data.user[0] : data.user
//         } as AgencyDetails

//         set({ selectedAgencia: agenciaData, loading: false })
//       }
//     } catch (err) {
//       set({
//         selectedAgencia: null,
//         error: err instanceof Error ? err.message : 'Error desconocido',
//         loading: false
//       })
//     }
//   },

//   fetchClienteById: async (id: string) => {
//     console.log('👤 fetchClienteById ejecutándose')
//     set({ loading: true, error: null })

//     try {
//       const { data, error } = await supabase
//         .from('clientes')
//         .select(`
//           user_id,
//           direccion,
//           ciudad,
//           agencia_id,
//           created_at,
//           user:users (
//             id,
//             nombre,
//             email,
//             phone,
//             user_type
//           )
//         `)
//         .eq('user_id', id)
//         .single()

//       if (error || !data) {
//         set({
//           selectedCliente: null,
//           error: error?.message || 'No se encontró el cliente',
//           loading: false
//         })
//       } else {
//         const clienteData = {
//           ...data,
//           user: Array.isArray(data.user) ? data.user[0] : data.user
//         } as ClientDetails

//         set({ selectedCliente: clienteData, loading: false })
//       }
//     } catch (err) {
//       set({
//         selectedCliente: null,
//         error: err instanceof Error ? err.message : 'Error desconocido',
//         loading: false
//       })
//     }
//   },

//   updateAgencia: async (userId: string, userData: UpdateUserData, agencyData: UpdateAgencyData) => {
//     console.log('🏢 updateAgencia ejecutándose')
//     set({ loading: true, error: null })

//     try {
//       // Actualizar datos del usuario
//       const { error: userError } = await supabase
//         .from('users')
//         .update(userData)
//         .eq('id', userId)

//       if (userError) {
//         set({ error: userError.message, loading: false })
//         return false
//       }

//       // Actualizar datos de la agencia
//       const { error: agencyError } = await supabase
//         .from('agencias')
//         .update(agencyData)
//         .eq('user_id', userId)

//       if (agencyError) {
//         set({ error: agencyError.message, loading: false })
//         return false
//       }

//       // Actualizar el estado local
//       const state = get()
//       const updatedAgencias = state.agencias.map(agencia =>
//         agencia.user_id === userId
//           ? {
//             ...agencia,
//             ...agencyData,
//             user: { ...agencia.user, ...userData }
//           }
//           : agencia
//       )

//       set({
//         agencias: updatedAgencias,
//         loading: false,
//         error: null
//       })

//       return true
//     } catch (err) {
//       set({
//         error: err instanceof Error ? err.message : 'Error desconocido',
//         loading: false
//       })
//       return false
//     }
//   },

//   updateCliente: async (userId: string, userData: UpdateUserData, clientData: UpdateClientData) => {
//     console.log('👤 updateCliente ejecutándose')
//     set({ loading: true, error: null })

//     try {
//       // Actualizar datos del usuario
//       const { error: userError } = await supabase
//         .from('users')
//         .update(userData)
//         .eq('id', userId)

//       if (userError) {
//         set({ error: userError.message, loading: false })
//         return false
//       }

//       // Actualizar datos del cliente
//       const { error: clientError } = await supabase
//         .from('clientes')
//         .update(clientData)
//         .eq('user_id', userId)

//       if (clientError) {
//         set({ error: clientError.message, loading: false })
//         return false
//       }

//       // Actualizar el estado local
//       const state = get()
//       const updatedClientes = state.clientes.map(cliente =>
//         cliente.id === userId
//           ? { ...cliente, ...userData }
//           : cliente
//       )

//       set({
//         clientes: updatedClientes,
//         loading: false,
//         error: null
//       })

//       return true
//     } catch (err) {
//       set({
//         error: err instanceof Error ? err.message : 'Error desconocido',
//         loading: false
//       })
//       return false
//     }
//   },

//   toggleAgenciaVerificacion: async (userId: string, isVerified: boolean) => {
//     try {
//       const { error } = await supabase
//         .from('agencias')
//         .update({ is_verified: isVerified })
//         .eq('user_id', userId)

//       if (error) {
//         set({ error: error.message })
//         return false
//       }

//       // Actualizar estado local
//       const state = get()
//       const updatedAgencias = state.agencias.map(agencia =>
//         agencia.user_id === userId
//           ? { ...agencia, is_verified: isVerified }
//           : agencia
//       )

//       set({ agencias: updatedAgencias, error: null })
//       return true
//     } catch (err) {
//       set({ error: err instanceof Error ? err.message : 'Error desconocido' })
//       return false
//     }
//   },

//   deleteAgencia: async (userId: string) => {
//     set({ loading: true, error: null })

//     try {
//       // Eliminar usuario (cascade eliminará automáticamente la agencia)
//       const { error } = await supabase
//         .from('users')
//         .delete()
//         .eq('id', userId)

//       if (error) {
//         set({ error: error.message, loading: false })
//         return false
//       }

//       // Actualizar estado local
//       const state = get()
//       const updatedAgencias = state.agencias.filter(agencia => agencia.user_id !== userId)

//       set({
//         agencias: updatedAgencias,
//         loading: false,
//         error: null
//       })

//       return true
//     } catch (err) {
//       set({
//         error: err instanceof Error ? err.message : 'Error desconocido',
//         loading: false
//       })
//       return false
//     }
//   },

//   deleteCliente: async (userId: string) => {
//     set({ loading: true, error: null })

//     try {
//       // Eliminar usuario (cascade eliminará automáticamente el cliente)
//       const { error } = await supabase
//         .from('users')
//         .delete()
//         .eq('id', userId)

//       if (error) {
//         set({ error: error.message, loading: false })
//         return false
//       }

//       // Actualizar estado local
//       const state = get()
//       const updatedClientes = state.clientes.filter(cliente => cliente.id !== userId)

//       set({
//         clientes: updatedClientes,
//         loading: false,
//         error: null
//       })

//       return true
//     } catch (err) {
//       set({
//         error: err instanceof Error ? err.message : 'Error desconocido',
//         loading: false
//       })
//       return false
//     }
//   },

//   reset: () => {
//     set({
//       clientes: [],
//       agencias: [],
//       selectedAgencia: null,
//       selectedCliente: null,
//       loading: false,
//       error: null,
//       agenciasLoaded: false,
//       clientesLoaded: false
//     })
//   }
// }))

import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import bcrypt from 'bcryptjs'
import { useAuthStore } from './authStore'

type UserSummary = {
  id: string
  nombre: string
  email: string
  phone: string
  documento_identidad?: string
  user_type: 'cliente' | 'agencia'
}

type AgencyDetails = {
  user_id: string
  direccion: string
  ciudad: string
  comision_porcentaje: number
  is_verified: boolean
  created_at: string
  admin_id: string | null
  user: UserSummary
}

type ClientDetails = {
  user_id: string
  direccion: string
  ciudad: string
  agencia_id: string | null
  created_at: string
  user: UserSummary
}

// Tipos para actualizaciones
type UpdateUserData = {
  nombre?: string
  email?: string
  phone?: string
  documento_identidad?: string
}

type UpdateAgencyData = {
  direccion?: string
  ciudad?: string
  comision_porcentaje?: number
  is_verified?: boolean
}

type UpdateClientData = {
  direccion?: string
  ciudad?: string
  agencia_id?: string | null
}

type UserListState = {
  clientes: UserSummary[]
  agencias: AgencyDetails[]
  selectedAgencia: AgencyDetails | null
  selectedCliente: ClientDetails | null
  loading: boolean
  error: string | null
  agenciasLoaded: boolean
  clientesLoaded: boolean
  lastFetchAgencias: number | null
  user?: UserSummary // Added user property

  // Funciones de lectura
  fetchClientes: () => Promise<void>
  fetchAgencias: () => Promise<void>
  fetchAgenciaById: (id: string) => Promise<void>
  fetchClienteById: (id: string) => Promise<void>

  // Funciones de actualización
  updateAgencia: (userId: string, userData: UpdateUserData, agencyData: UpdateAgencyData) => Promise<boolean>
  updateCliente: (userId: string, userData: UpdateUserData, clientData: UpdateClientData) => Promise<boolean>
  toggleAgenciaVerificacion: (userId: string, isVerified: boolean) => Promise<boolean>
  updatePassword: (userId: string, newPassword: string) => Promise<boolean> // NUEVA FUNCIÓN

  // Funciones de eliminación
  deleteAgencia: (userId: string) => Promise<boolean>
  deleteCliente: (userId: string) => Promise<boolean>

  searchCliente: (searchTerm: string) => Promise<ClientDetails | null>

  // Función para resetear el estado
  reset: () => void
}

export const useUserListStore = create<UserListState>((set, get) => ({
  clientes: [],
  agencias: [],
  selectedAgencia: null,
  selectedCliente: null,
  loading: false,
  error: null,
  agenciasLoaded: false,
  clientesLoaded: false,
  lastFetchAgencias: null,

  fetchClientes: async () => {
    console.log('👥 fetchClientes ejecutándose')
    const state = get()
    const now = Date.now()

    // Verificar si ya está cargando
    if (state.loading) {
      console.log('⏭️ fetchClientes ya está en progreso, saltando...')
      return
    }

    // Cache de 5 minutos (300000ms) - solo si ya tenemos datos y el cache es válido
    if (state.clientesLoaded &&  // ✅ CORREGIDO: era agenciasLoaded
      state.clientes.length > 0 &&
      state.lastFetchAgencias &&
      (now - state.lastFetchAgencias) < 300000) {
      console.log('📋 fetchClientes: usando cache (válido por 5 minutos)')
      return
    }

    console.log('🔍 fetchClientes: consultando servidor')
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('clientes')
        .select(`
        user_id,
        direccion,
        ciudad,
        agencia_id,
        created_at,
        user:users (
          id,
          documento_identidad,
          nombre,
          email,
          phone,
          user_type
        )
      `)

      if (error) {
        set({ error: error.message, loading: false })
      } else {
        const clientes = (data as any[]).map((cliente) => ({
          ...cliente,
          user: Array.isArray(cliente.user) ? cliente.user[0] : cliente.user
        })) as ClientDetails[]

        set({
          clientes: clientes.map(cliente => cliente.user),
          loading: false,
          clientesLoaded: true,  // ✅ CORREGIDO: era agenciasLoaded
          lastFetchAgencias: now
        })

        console.log(`✅ fetchClientes: cargadas ${clientes.length} clientes exitosamente`)
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      })
    }
  },

  fetchAgencias: async () => {
    console.log('🏢 fetchAgencias ejecutándose')
    const state = get()
    const now = Date.now()

    // Verificar si ya está cargando
    if (state.loading) {
      console.log('⏭️ fetchAgencias ya está en progreso, saltando...')
      return
    }

    // Cache de 5 minutos (300000ms) - solo si ya tenemos datos y el cache es válido
    if (state.agenciasLoaded &&
      state.agencias.length > 0 &&
      state.lastFetchAgencias &&
      (now - state.lastFetchAgencias) < 300000) {
      console.log('📋 fetchAgencias: usando cache (válido por 5 minutos)')
      return
    }

    console.log('🔍 fetchAgencias: consultando servidor')
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('agencias')
        .select(`
        user_id,
        direccion,
        ciudad,
        comision_porcentaje,
        is_verified,
        created_at,
        admin_id,
        user:users (
          id,
          nombre,
          email,
          phone,
          user_type
        )
      `)

      if (error) {
        set({ error: error.message, loading: false })
      } else {
        const agencias = (data as any[]).map((agencia) => ({
          ...agencia,
          user: Array.isArray(agencia.user) ? agencia.user[0] : agencia.user
        })) as AgencyDetails[]

        set({
          agencias,
          loading: false,
          agenciasLoaded: true,
          lastFetchAgencias: now
        })

        console.log(`✅ fetchAgencias: cargadas ${agencias.length} agencias exitosamente`)
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      })
    }
  },

  fetchAgenciaById: async (id: string) => {
    console.log('🏢 fetchAgenciaById ejecutándose')
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('agencias')
        .select(`
          user_id,
          direccion,
          ciudad,
          comision_porcentaje,
          is_verified,
          created_at,
          admin_id,
          user:users (
            id,
            nombre,
            email,
            phone,
            user_type
          )
        `)
        .eq('user_id', id)
        .single()

      if (error || !data) {
        set({
          selectedAgencia: null,
          error: error?.message || 'No se encontró la agencia',
          loading: false
        })
      } else {
        const agenciaData = {
          ...data,
          user: Array.isArray(data.user) ? data.user[0] : data.user
        } as AgencyDetails

        set({ selectedAgencia: agenciaData, loading: false })
      }
    } catch (err) {
      set({
        selectedAgencia: null,
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      })
    }
  },

  fetchClienteById: async (id: string) => {
    console.log('👤 fetchClienteById ejecutándose')
    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('clientes')
        .select(`
          user_id,
          direccion,
          ciudad,
          agencia_id,
          created_at,
          user:users (
            id,
            documento_identidad,
            nombre,
            email,
            phone,
            user_type
          )
        `)
        .eq('user_id', id)
        .single()

      if (error || !data) {
        set({
          selectedCliente: null,
          error: error?.message || 'No se encontró el cliente',
          loading: false
        })
      } else {
        const clienteData = {
          ...data,
          user: Array.isArray(data.user) ? data.user[0] : data.user
        } as ClientDetails

        set({ selectedCliente: clienteData, loading: false })
      }
    } catch (err) {
      set({
        selectedCliente: null,
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      })
    }
  },

  updateAgencia: async (userId: string, userData: UpdateUserData, agencyData: UpdateAgencyData) => {
    console.log('🏢 updateAgencia ejecutándose')
    set({ loading: true, error: null })

    try {
      // Actualizar datos del usuario
      const { error: userError } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)

      if (userError) {
        set({ error: userError.message, loading: false })
        return false
      }

      // Actualizar datos de la agencia
      const { error: agencyError } = await supabase
        .from('agencias')
        .update(agencyData)
        .eq('user_id', userId)

      if (agencyError) {
        set({ error: agencyError.message, loading: false })
        return false
      }

      // Actualizar el estado local
      const state = get()
      const updatedAgencias = state.agencias.map(agencia =>
        agencia.user_id === userId
          ? {
            ...agencia,
            ...agencyData,
            user: { ...agencia.user, ...userData }
          }
          : agencia
      )

      set({
        agencias: updatedAgencias,
        loading: false,
        error: null
      })

      return true
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      })
      return false
    }
  },

  updateCliente: async (userId: string, userData: UpdateUserData, clientData: UpdateClientData) => {
    console.log('👤 updateCliente ejecutándose')
    set({ loading: true, error: null })

    try {
      // Actualizar datos del usuario
      const { error: userError } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)

      if (userError) {
        set({ error: userError.message, loading: false })
        return false
      }

      // Actualizar datos del cliente
      const { error: clientError } = await supabase
        .from('clientes')
        .update(clientData)
        .eq('user_id', userId)

      if (clientError) {
        set({ error: clientError.message, loading: false })
        return false
      }

      // Actualizar el estado local
      const state = get()
      const updatedClientes = state.clientes.map(cliente =>
        cliente.id === userId
          ? { ...cliente, ...userData }
          : cliente
      )

      set({
        clientes: updatedClientes,
        loading: false,
        error: null
      })

      return true
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      })
      return false
    }
  },

  toggleAgenciaVerificacion: async (userId: string, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from('agencias')
        .update({ is_verified: isVerified })
        .eq('user_id', userId)

      if (error) {
        set({ error: error.message })
        return false
      }

      // Actualizar estado local
      const state = get()
      const updatedAgencias = state.agencias.map(agencia =>
        agencia.user_id === userId
          ? { ...agencia, is_verified: isVerified }
          : agencia
      )

      set({ agencias: updatedAgencias, error: null })
      return true
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error desconocido' })
      return false
    }
  },

  // Actualizar contraseña
  updatePassword: async (userId: string, newPassword: string) => {
    console.log('🔑 updatePassword ejecutándose para userId:', userId)
    set({ loading: true, error: null })

    try {
      // 1. Validar longitud mínima
      if (newPassword.length < 6) {
        set({
          error: 'La contraseña debe tener al menos 6 caracteres',
          loading: false
        })
        return false
      }

      // 2. Obtener usuario admin actual
      const { data: { user: currentUser } } = await supabase.auth.getUser()

      if (!currentUser) {
        // Si no hay sesión de Auth, usar el user del store
        const storeUser = get().user || useAuthStore.getState().user

        if (!storeUser || storeUser.user_type !== 'admin') {
          set({ error: 'Solo administradores pueden cambiar contraseñas', loading: false })
          return false
        }

        // Actualizar solo en tabla users (sin RPC)
        console.log('⚠️ Sin sesión Auth, actualizando solo en tabla users')
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const { error: updateError } = await supabase
          .from('users')
          .update({ password: hashedPassword })
          .eq('id', userId)

        if (updateError) {
          console.error('❌ Error actualizando contraseña:', updateError)
          set({ error: updateError.message, loading: false })
          return false
        }

        set({ loading: false, error: null })
        console.log('✅ Contraseña actualizada en tabla users')
        return true
      }

      // 3. Llamar a la función RPC que actualiza en ambos lados
      console.log('🔄 Llamando a función RPC para actualizar en ambos lados...')
      const { data, error: rpcError } = await supabase.rpc('update_user_password_both', {
        target_user_id: userId,
        new_password: newPassword,
        admin_user_id: currentUser.id
      })

      if (rpcError) {
        console.error('❌ Error en RPC:', rpcError)
        set({ error: rpcError.message, loading: false })
        return false
      }

      // 4. ✅ Éxito
      set({ loading: false, error: null })
      console.log('✅ Resultado:', data)
      return true

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('❌ Error en updatePassword:', errorMessage)
      set({ error: errorMessage, loading: false })
      return false
    }
  },

  deleteAgencia: async (userId: string) => {
    set({ loading: true, error: null })

    try {
      // Eliminar usuario (cascade eliminará automáticamente la agencia)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        set({ error: error.message, loading: false })
        return false
      }

      // Actualizar estado local
      const state = get()
      const updatedAgencias = state.agencias.filter(agencia => agencia.user_id !== userId)

      set({
        agencias: updatedAgencias,
        loading: false,
        error: null
      })

      return true
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      })
      return false
    }
  },

  deleteCliente: async (userId: string) => {
    set({ loading: true, error: null })

    try {
      // Eliminar usuario (cascade eliminará automáticamente el cliente)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        set({ error: error.message, loading: false })
        return false
      }

      // Actualizar estado local
      const state = get()
      const updatedClientes = state.clientes.filter(cliente => cliente.id !== userId)

      set({
        clientes: updatedClientes,
        loading: false,
        error: null
      })

      return true
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      })
      return false
    }
  },

  searchCliente: async (searchTerm: string) => {
    set({ loading: true, error: null })

    try {
      // Buscar usuario primero
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, documento_identidad, nombre, email, phone, user_type')
        .eq('user_type', 'cliente')
        .or(`documento_identidad.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,nombre.ilike.%${searchTerm}%`)
        .limit(1)
        .maybeSingle()

      if (userError) throw userError
      if (!userData) {
        set({ loading: false, error: 'Cliente no encontrado' })
        return null
      }

      // Obtener datos del cliente
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('user_id, direccion, ciudad, agencia_id, created_at')
        .eq('user_id', userData.id)
        .single()

      if (clienteError) throw clienteError

      const clienteCompleto = {
        ...clienteData,
        user: userData
      }

      set({ selectedCliente: clienteCompleto, loading: false })
      return clienteCompleto
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      })
      return null
    }
  },

  reset: () => {
    set({
      clientes: [],
      agencias: [],
      selectedAgencia: null,
      selectedCliente: null,
      loading: false,
      error: null,
      agenciasLoaded: false,
      clientesLoaded: false
    })
  }
}))