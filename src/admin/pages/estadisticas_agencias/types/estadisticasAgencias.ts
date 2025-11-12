export interface EstadisticasAgencia {
  agencia_id: string
  agencia_nombre: string
  agencia_email: string | null
  agencia_telefono: string | null
  ciudad: string | null
  comision_porcentaje: number
  is_verified: boolean
  boletos_recargados: number
  boletos_vendidos: number
  boletos_disponibles: number
  total_vendido: number
  ganancia_agencia: number
  ultima_venta: string | null
  created_at: string
}