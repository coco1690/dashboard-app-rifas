// stores/useEmailStore.ts

import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import { toast } from 'sonner'

interface EmailEnviado {
  id: string
  orden_id: string
  tipo: 'confirmacion_compra' | 'recordatorio' | 'resultado_sorteo'
  email_destino: string
  estado: 'enviado' | 'fallido' | 'pendiente'
  enviado_at: string | null
  created_at: string
  resend_id?: string | null
  error_mensaje?: string | null
  intentos: number
}

interface EmailEstadisticas {
  total_enviados: number
  exitosos: number
  fallidos: number
  pendientes: number
  ultimo_envio: string | null
}

interface EmailStore {
  // Estados
  enviandoEmail: boolean
  error: string | null
  ultimoEmailEnviado: EmailEnviado | null
  historialEmails: EmailEnviado[]
  estadisticas: EmailEstadisticas | null

  // Acciones principales
  enviarConfirmacionCompra: (ordenId: string) => Promise<boolean>

  // Gestión del historial
  obtenerHistorialEmails: (filtros?: {
    ordenId?: string
    tipo?: string
    estado?: string
    limite?: number
  }) => Promise<EmailEnviado[]>

  // Estadísticas
  obtenerEstadisticasEmails: (agenciaId?: string) => Promise<EmailEstadisticas | null>

  // Utilidades
  validarEmailCliente: (clienteId: string) => Promise<{ valido: boolean; email?: string }>
  reenviarEmail: (emailId: string) => Promise<boolean>

  // Gestión de estado
  limpiarError: () => void
  resetearEstado: () => void

  // Funciones auxiliares
  obtenerEmailPorOrden: (ordenId: string) => Promise<EmailEnviado | null>
  marcarEmailComoFallido: (emailId: string, errorMensaje: string) => Promise<void>
  reenviarNotificaciones: (
    ordenId: string,
    metodos: { email: boolean; whatsapp: boolean; sms: boolean }
  ) => Promise<{ email: boolean; whatsapp: boolean; sms: boolean }>
}

export const useEmailStore = create<EmailStore>((set, get) => ({
  // Estados iniciales
  enviandoEmail: false,
  error: null,
  ultimoEmailEnviado: null,
  historialEmails: [],
  estadisticas: null,

  // Enviar email de confirmación de compra
  enviarConfirmacionCompra: async (ordenId: string): Promise<boolean> => {
    set({ enviandoEmail: true, error: null })

    const loadingToast = toast.loading('Enviando confirmación por email...', {
      description: 'Preparando el comprobante digital'
    })

    try {
      // Verificar que no se haya enviado ya un email para esta orden
      const emailExistente = await get().obtenerEmailPorOrden(ordenId)
      if (emailExistente && emailExistente.estado === 'enviado') {
        toast.warning('Email ya enviado', {
          description: 'Ya se envió una confirmación para esta orden'
        })
        toast.dismiss(loadingToast)
        set({ enviandoEmail: false })
        return true
      }

      // Llamar a la Edge Function
      const { data, error } = await supabase.functions.invoke('enviar-email-confirmacion', {
        body: { ordenId }
      })

      if (error) {
        throw new Error(error.message || 'Error al invocar función de email')
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Error desconocido al enviar email')
      }

      // Toast de éxito
      toast.success('Email enviado correctamente', {
        description: `Confirmación enviada a ${data.emailDestino}`,
        duration: 4000
      })

      toast.dismiss(loadingToast)

      // Actualizar estado con el nuevo email enviado
      const nuevoEmail: EmailEnviado = {
        id: `temp-${Date.now()}`,
        orden_id: ordenId,
        tipo: 'confirmacion_compra',
        email_destino: data.emailDestino,
        estado: 'enviado',
        enviado_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        resend_id: data.resendId || null,
        intentos: 1
      }

      set({
        enviandoEmail: false,
        ultimoEmailEnviado: nuevoEmail,
        historialEmails: [nuevoEmail, ...get().historialEmails]
      })

      return true

    } catch (err: any) {
      const errorMessage = err.message || 'Error al enviar email de confirmación'
      console.error('Error enviando email:', err)

      toast.error('Error al enviar email', {
        description: errorMessage,
        duration: 5000
      })

      toast.dismiss(loadingToast)

      set({
        error: errorMessage,
        enviandoEmail: false
      })

      return false
    }
  },

  // Validar que el cliente tenga email registrado y válido
  validarEmailCliente: async (clienteId: string): Promise<{ valido: boolean; email?: string }> => {
    try {
      const { data: cliente, error } = await supabase
        .from('users')
        .select('email')
        .eq('id', clienteId)
        .single()

      if (error || !cliente) {
        return { valido: false }
      }

      if (!cliente.email || cliente.email.trim() === '') {
        return { valido: false }
      }

      // Validación básica de formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cliente.email)) {
        return { valido: false }
      }

      return {
        valido: true,
        email: cliente.email
      }

    } catch (error) {
      console.error('Error validando email del cliente:', error)
      return { valido: false }
    }
  },

  // Obtener historial de emails enviados con filtros
  obtenerHistorialEmails: async (filtros = {}): Promise<EmailEnviado[]> => {
    try {
      let query = supabase
        .from('emails_enviados')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filtros.ordenId) {
        query = query.eq('orden_id', filtros.ordenId)
      }

      if (filtros.tipo) {
        query = query.eq('tipo', filtros.tipo)
      }

      if (filtros.estado) {
        query = query.eq('estado', filtros.estado)
      }

      if (filtros.limite) {
        query = query.limit(filtros.limite)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      const emails = data || []
      set({ historialEmails: emails })
      return emails

    } catch (error) {
      console.error('Error obteniendo historial de emails:', error)
      toast.error('Error al cargar historial de emails')
      return []
    }
  },

  // Obtener estadísticas de emails
  obtenerEstadisticasEmails: async (agenciaId?: string): Promise<EmailEstadisticas | null> => {
    try {
      let funcionName = 'get_email_stats_global'
      let parametros = {}

      // Si se especifica agencia, usar función específica
      if (agenciaId) {
        funcionName = 'get_email_stats_agencia'
        parametros = { agencia_uuid: agenciaId }
      }

      const { data, error } = await supabase.rpc(funcionName, parametros)

      if (error) {
        throw error
      }

      const stats = data[0] || {
        total_enviados: 0,
        exitosos: 0,
        fallidos: 0,
        pendientes: 0,
        ultimo_envio: null
      }

      set({ estadisticas: stats })
      return stats

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      toast.error('Error al cargar estadísticas de emails')
      return null
    }
  },

  // Obtener email específico por orden
  obtenerEmailPorOrden: async (ordenId: string): Promise<EmailEnviado | null> => {
    try {
      const { data, error } = await supabase
        .from('emails_enviados')
        .select('*')
        .eq('orden_id', ordenId)
        .eq('tipo', 'confirmacion_compra')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error obteniendo email por orden:', error)
      return null
    }
  },

  // Reenviar email fallido
  reenviarEmail: async (emailId: string): Promise<boolean> => {
    try {
      set({ enviandoEmail: true, error: null })

      // Obtener datos del email
      const { data: emailData, error } = await supabase
        .from('emails_enviados')
        .select('orden_id, estado, intentos')
        .eq('id', emailId)
        .single()

      if (error || !emailData) {
        throw new Error('Email no encontrado')
      }

      if (emailData.estado === 'enviado') {
        toast.warning('Email ya enviado', {
          description: 'Este email ya fue enviado exitosamente'
        })
        set({ enviandoEmail: false })
        return true
      }

      if (emailData.intentos >= 3) {
        throw new Error('Máximo número de intentos alcanzado')
      }

      // Marcar como pendiente para reenvío
      const { error: updateError } = await supabase.rpc('marcar_email_para_reenvio', {
        email_id: emailId
      })

      if (updateError) {
        throw updateError
      }

      // Reenviar usando la orden ID
      const exito = await get().enviarConfirmacionCompra(emailData.orden_id)

      set({ enviandoEmail: false })
      return exito

    } catch (error: any) {
      console.error('Error reenviando email:', error)
      toast.error('Error al reenviar email', {
        description: error.message
      })
      set({ enviandoEmail: false, error: error.message })
      return false
    }
  },

  //  Reenviar notificaciones 
  reenviarNotificaciones: async (
    ordenId: string,
    metodos: {
      email: boolean
      whatsapp: boolean
      sms: boolean
      nuevoPhone?: string  // ✅ NUEVO
    }
  ): Promise<{ email: boolean; whatsapp: boolean; sms: boolean }> => {
    const resultados = {
      email: false,
      whatsapp: false,
      sms: false
    }

    const loadingToast = toast.loading('Reenviando notificaciones...', {
      description: 'Procesando solicitud'
    })

    try {
      // ✅ NUEVO: Si hay nuevo teléfono, actualizar en BD primero
      if (metodos.nuevoPhone) {
        console.log('📱 Actualizando número de teléfono:', metodos.nuevoPhone)

        // Obtener cliente_id de la orden
        const { data: orden, error: ordenError } = await supabase
          .from('ordenes_boletos')
          .select('cliente_id')
          .eq('id', ordenId)
          .single()

        if (!ordenError && orden) {
          // Actualizar teléfono del cliente
          const { error: updateError } = await supabase
            .from('users')
            .update({ phone: metodos.nuevoPhone })
            .eq('id', orden.cliente_id)

          if (updateError) {
            console.error('Error actualizando teléfono:', updateError)
            toast.warning('Advertencia', {
              description: 'No se pudo actualizar el teléfono en la base de datos'
            })
          } else {
            console.log('✅ Teléfono actualizado en BD')
            toast.success('Teléfono actualizado', {
              description: 'El número se actualizó correctamente'
            })
          }
        }
      }

      // Reenviar Email
      if (metodos.email) {
        try {
          resultados.email = await get().enviarConfirmacionCompra(ordenId)
        } catch (error) {
          console.error('Error reenviando email:', error)
        }
      }

      // Reenviar WhatsApp
      if (metodos.whatsapp) {
        try {
          const { data: orden, error: ordenError } = await supabase
            .from('ordenes_boletos')
            .select('id, cliente_id')
            .eq('id', ordenId)
            .single()

          if (ordenError || !orden) {
            throw new Error('No se pudo obtener datos de la orden')
          }

          const { data: cliente, error: clienteError } = await supabase
            .from('users')
            .select('nombre, phone')
            .eq('id', orden.cliente_id)
            .single()

          if (clienteError || !cliente) {
            throw new Error('No se pudo obtener datos del cliente')
          }

          // ✅ Usar el nuevo teléfono si se proporcionó
          const phoneAUsar = metodos.nuevoPhone || cliente.phone

          console.log('📱 Enviando WhatsApp a:', phoneAUsar)

          const { data, error } = await supabase.functions.invoke('enviar-whatsapp', {
            body: {
              ordenId: ordenId,
              phone: phoneAUsar,
              nombre: cliente.nombre
            }
          })

          if (error) {
            throw new Error(error.message || 'Error al enviar WhatsApp')
          }

          if (!data?.success) {
            throw new Error(data?.error || 'Error al enviar WhatsApp')
          }

          resultados.whatsapp = true

          await supabase
            .from('ordenes_boletos')
            .update({ enviado_whatsapp: true })
            .eq('id', ordenId)

          console.log('✅ WhatsApp reenviado exitosamente')

        } catch (error: any) {
          console.error('❌ Error reenviando WhatsApp:', error)
          toast.error('Error al enviar WhatsApp', {
            description: error.message
          })
        }
      }

      // Reenviar SMS
      if (metodos.sms) {
        try {
          const { data: orden, error: ordenError } = await supabase
            .from('ordenes_boletos')
            .select('id, cliente_id')
            .eq('id', ordenId)
            .single()

          if (ordenError || !orden) {
            throw new Error('No se pudo obtener datos de la orden')
          }

          const { data: cliente, error: clienteError } = await supabase
            .from('users')
            .select('nombre, phone')
            .eq('id', orden.cliente_id)
            .single()

          if (clienteError || !cliente) {
            throw new Error('No se pudo obtener datos del cliente')
          }

          // ✅ Usar el nuevo teléfono si se proporcionó
          const phoneAUsar = metodos.nuevoPhone || cliente.phone

          console.log('📱 Enviando SMS a:', phoneAUsar)

          const { data, error } = await supabase.functions.invoke('enviar-sms', {
            body: {
              ordenId: ordenId,
              phone: phoneAUsar,
              nombre: cliente.nombre
            }
          })

          if (error) {
            throw new Error(error.message || 'Error al enviar SMS')
          }

          if (!data?.success) {
            throw new Error(data?.error || 'Error al enviar SMS')
          }

          resultados.sms = true

          await supabase
            .from('ordenes_boletos')
            .update({ enviado_sms: true })
            .eq('id', ordenId)

          console.log('✅ SMS reenviado exitosamente')

        } catch (error: any) {
          console.error('❌ Error reenviando SMS:', error)
          toast.error('Error al enviar SMS', {
            description: error.message
          })
        }
      }

      toast.dismiss(loadingToast)

      // Toast de resumen
      const exitosos = []
      if (resultados.email) exitosos.push('Email')
      if (resultados.whatsapp) exitosos.push('WhatsApp')
      if (resultados.sms) exitosos.push('SMS')

      if (exitosos.length > 0) {
        toast.success('Notificaciones reenviadas', {
          description: `${exitosos.join(', ')} enviado correctamente`,
          duration: 4000
        })
      } else {
        toast.error('No se pudo reenviar ninguna notificación')
      }

    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Error general reenviando notificaciones:', error)
    }

    return resultados
  },

  // Marcar email como fallido
  marcarEmailComoFallido: async (emailId: string, errorMensaje: string): Promise<void> => {
    try {
      await supabase
        .from('emails_enviados')
        .update({
          estado: 'fallido',
          error_mensaje: errorMensaje,
          updated_at: new Date().toISOString()
        })
        .eq('id', emailId)
    } catch (error) {
      console.error('Error marcando email como fallido:', error)
    }
  },

  // Limpiar mensajes de error
  limpiarError: () => {
    set({ error: null })
  },

  // Resetear todo el estado
  resetearEstado: () => {
    set({
      enviandoEmail: false,
      error: null,
      ultimoEmailEnviado: null,
      historialEmails: [],
      estadisticas: null
    })
  }
}))

// Hook personalizado para facilitar el uso en componentes
export const useEmailActions = () => {
  const {
    enviarConfirmacionCompra,
    validarEmailCliente,
    reenviarEmail,
    enviandoEmail,
    error,
    ultimoEmailEnviado
  } = useEmailStore()

  return {
    enviarConfirmacionCompra,
    validarEmailCliente,
    reenviarEmail,
    enviandoEmail,
    error,
    ultimoEmailEnviado
  }
}

// Hook para estadísticas (útil para dashboards)
export const useEmailStats = () => {
  const {
    obtenerEstadisticasEmails,
    estadisticas,
    obtenerHistorialEmails,
    historialEmails
  } = useEmailStore()

  return {
    obtenerEstadisticasEmails,
    estadisticas,
    obtenerHistorialEmails,
    historialEmails
  }
}