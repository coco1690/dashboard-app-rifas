
// src/stores/usePayPalStore.ts

import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import { toast } from 'sonner'
import type { CapturePaymentResponse, CreateOrderResponse, DatosFacturacion, PayPalState } from '@/paypal/types/paypal.types'


// ============================================================================
// STORE
// ============================================================================

export const usePayPalStore = create<PayPalState>((set) => ({
  // ========================================================================
  // ESTADO INICIAL
  // ========================================================================
  loading: false,
  error: null,
  currentOrderId: null,
  currentTransactionId: null,
  ventaCompletada: null,

  // ========================================================================
  // CREAR ORDEN EN PAYPAL
  // ========================================================================
  crearOrden: async (reservasIds, sessionId, datosFacturacion) => {
    set({ loading: true, error: null })

    const loadingToast = toast.loading('Preparando pago...', {
      description: 'Conectando con PayPal'
    })

    try {
      console.log('📝 Creando orden PayPal...', {
        reservas: reservasIds.length,
        email: datosFacturacion.email
      })

      // Validar datos
      if (!reservasIds || reservasIds.length === 0) {
        throw new Error('No hay reservas para procesar')
      }

      if (!sessionId) {
        throw new Error('Sesión inválida')
      }

      if (!datosFacturacion.nombre || !datosFacturacion.email) {
        throw new Error('Datos de facturación incompletos')
      }

      // Llamar a la Edge Function
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          reservas_ids: reservasIds,
          session_id: sessionId,
          datos_facturacion: datosFacturacion
        }
      })

      if (error) {
        console.error('❌ Error invocando Edge Function:', error)
        throw new Error(error.message || 'Error al crear orden')
      }

      if (!data || !data.success) {
        console.error('❌ Edge Function retornó error:', data?.error)

        // Manejar errores específicos
        switch (data?.error_code) {
          case 'RESERVA_EXPIRADA':
            toast.error('Reserva expirada', {
              description: 'Tus boletos expiraron. Intenta de nuevo.'
            })
            break
          case 'SESSION_MISMATCH':
            toast.error('Sesión inválida', {
              description: 'Por favor recarga la página'
            })
            break
          case 'BOLETOS_NO_DISPONIBLES':
            toast.error('Boletos no disponibles', {
              description: 'Algunos boletos ya no están disponibles'
            })
            break
          default:
            toast.error('Error al crear orden', {
              description: data?.error || 'Intenta de nuevo'
            })
        }

        set({
          loading: false,
          error: data?.error || 'Error desconocido',
          currentOrderId: null,
          currentTransactionId: null
        })

        toast.dismiss(loadingToast)

        return {
          success: false,
          error: data?.error,
          error_code: data?.error_code
        }
      }

      console.log('✅ Orden PayPal creada:', data.order_id)

      set({
        loading: false,
        error: null,
        currentOrderId: data.order_id,
        currentTransactionId: data.transaccion_id
      })

      toast.success('Orden creada', {
        description: 'Redirigiendo a PayPal...'
      })

      toast.dismiss(loadingToast)

      return {
        success: true,
        order_id: data.order_id,
        transaccion_id: data.transaccion_id,
        monto_total: data.monto_total,
        total_boletos: data.total_boletos
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido al crear orden'
      console.error('❌ Error crítico creando orden:', err)

      toast.error('Error al crear orden', {
        description: errorMessage
      })

      toast.dismiss(loadingToast)

      set({
        loading: false,
        error: errorMessage,
        currentOrderId: null,
        currentTransactionId: null
      })

      return {
        success: false,
        error: errorMessage
      }
    }
  },

  // ========================================================================
  // CAPTURAR PAGO EN PAYPAL
  // ========================================================================
  capturarPago: async (orderId) => {
    set({ loading: true, error: null })

    const loadingToast = toast.loading('Procesando pago...', {
      description: 'Confirmando con PayPal'
    })

    try {
      console.log('💰 Capturando pago PayPal...', orderId)

      // Validar order_id
      if (!orderId) {
        throw new Error('Order ID no proporcionado')
      }

      // Llamar a la Edge Function
      const { data, error } = await supabase.functions.invoke('capture-paypal-payment', {
        body: { order_id: orderId }
      })

      if (error) {
        console.error('❌ Error invocando Edge Function:', error)
        throw new Error(error.message || 'Error al capturar pago')
      }

      if (!data || !data.success) {
        console.error('❌ Edge Function retornó error:', data?.error)

        // Manejar errores específicos
        switch (data?.error_code) {
          case 'TRANSACTION_NOT_FOUND':
            toast.error('Transacción no encontrada', {
              description: 'No se encontró la orden de pago'
            })
            break
          case 'ALREADY_COMPLETED':
            toast.warning('Pago ya procesado', {
              description: 'Esta compra ya fue completada anteriormente'
            })
            break
          default:
            toast.error('Error al procesar pago', {
              description: data?.error || 'Intenta de nuevo'
            })
        }

        toast.dismiss(loadingToast)

        set({
          loading: false,
          error: data?.error || 'Error desconocido'
        })

        return {
          success: false,
          error: data?.error,
          error_code: data?.error_code
        }
      }

      console.log('✅ Pago capturado y venta completada:', data.venta_id)

      // Guardar datos de la venta
      set({
        loading: false,
        error: null,
        ventaCompletada: data
      })

      toast.success('¡Compra exitosa!', {
        description: `${data.boletos_vendidos} boletos comprados`
      })

      toast.dismiss(loadingToast)

      return {
        success: true,
        venta_id: data.venta_id,
        boletos_vendidos: data.boletos_vendidos,
        monto_total: data.monto_total,
        comprador_email: data.comprador_email,
        comprador_nombre: data.comprador_nombre,
        rifas: data.rifas,
        paypal_order_id: data.paypal_order_id,
        paypal_capture_id: data.paypal_capture_id
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Error capturando pago'
      console.error('❌ Error capturando pago:', err)

      toast.error('Error al procesar pago', {
        description: errorMessage
      })

      toast.dismiss(loadingToast)

      set({
        loading: false,
        error: errorMessage
      })

      return {
        success: false,
        error: errorMessage
      }
    }
  },

  // ========================================================================
  // UTILIDADES
  // ========================================================================
  resetear: () => {
    set({
      loading: false,
      error: null,
      currentOrderId: null,
      currentTransactionId: null,
      ventaCompletada: null
    })
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error })
}))

// ============================================================================
// HOOKS PERSONALIZADOS
// ============================================================================

export const useCrearOrdenPayPal = () => {
  const { crearOrden, loading, error } = usePayPalStore()
  return { crearOrden, loading, error }
}

export const useCapturarPagoPayPal = () => {
  const { capturarPago, loading, error, ventaCompletada } = usePayPalStore()
  return { capturarPago, loading, error, ventaCompletada }
}

export const usePayPalState = () => {
  const { currentOrderId, currentTransactionId, loading, error } = usePayPalStore()
  return { currentOrderId, currentTransactionId, loading, error }
}

// ============================================================================
// RE-EXPORTAR TIPOS PARA FACILITAR IMPORTS
// ============================================================================
export type { DatosFacturacion, CreateOrderResponse, CapturePaymentResponse}