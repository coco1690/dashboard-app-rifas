// types.ts

import type { HistorialVenta } from "@/stores/useHistorialVentasStore"


export interface ClienteAgrupado {
  cliente_id: string
  cliente_nombre: string
  cliente_cedula: string
  cliente_email?: string | null
  cliente_telefono?: string | null
  ventas: HistorialVenta[]
  totalVentas: number
  totalBoletos: number
  totalMonto: number
  esGanadorPrincipal: boolean
  esGanadorSuerte: boolean
  ventasGanadoras: HistorialVenta[]
  numerosGanadores: string[]
}