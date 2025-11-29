
// ============================================================================
// TYPES DE PAYPAL
// ============================================================================

export interface DatosFacturacion {
  nombre: string
  cedula: string
  email: string
  telefono: string
}

export interface CreateOrderResponse {
  success: boolean
  order_id?: string
  transaccion_id?: string
  monto_total?: number
  total_boletos?: number
  error?: string
  error_code?: string
}

export interface CapturePaymentResponse {
  success: boolean
  venta_id?: string
  boletos_vendidos?: number
  monto_total?: number
  comprador_email?: string
  comprador_nombre?: string
  rifas?: any[]
  paypal_order_id?: string
  paypal_capture_id?: string
  error?: string
  error_code?: string
}

export interface PayPalState {
  // Estado
  loading: boolean
  error: string | null
  currentOrderId: string | null
  currentTransactionId: string | null
  ventaCompletada: CapturePaymentResponse | null

  // Acciones
  crearOrden: (
    reservasIds: string[],
    sessionId: string,
    datosFacturacion: DatosFacturacion
  ) => Promise<CreateOrderResponse>

  capturarPago: (orderId: string) => Promise<CapturePaymentResponse>

  resetear: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}