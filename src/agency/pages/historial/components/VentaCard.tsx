import { Badge } from '@/components/ui/badge'
import { Package, DollarSign, Crown, Star } from 'lucide-react'

import { GanadorBadge } from './GanadorBadge'
import type { HistorialVenta } from '@/stores/useHistorialVentasStore'

interface VentaCardProps {
  venta: HistorialVenta
}

const verificarGanadores = (venta: HistorialVenta): {
  esGanadorSuerte: boolean
  esGanadorPrincipal: boolean
  numerosGanadores: string[]
} => {
  const result = {
    esGanadorSuerte: false,
    esGanadorPrincipal: false,
    numerosGanadores: [] as string[]
  }

  if (!venta.numeros_boletos || venta.numeros_boletos.length === 0) return result

  if (venta.rifa_numeros_suerte?.length) {
    const numerosGanadoresSuerte = venta.numeros_boletos.filter(n => venta.rifa_numeros_suerte!.includes(n))
    if (numerosGanadoresSuerte.length > 0) {
      result.esGanadorSuerte = true
      result.numerosGanadores.push(...numerosGanadoresSuerte)
    }
  }

  if (venta.rifa_numero_ganador && venta.numeros_boletos.includes(venta.rifa_numero_ganador)) {
    result.esGanadorPrincipal = true
    if (!result.numerosGanadores.includes(venta.rifa_numero_ganador)) {
      result.numerosGanadores.push(venta.rifa_numero_ganador)
    }
  }

  return result
}

const getBadgeEstado = (estado: string) => {
  const colores = {
    pagado: 'bg-green-600 text-white',
    pendiente: 'bg-yellow-600 text-white',
    fallido: 'bg-red-600 text-white',
    reembolsado: 'bg-gray-600 text-white'
  }
  return colores[estado as keyof typeof colores] || 'bg-gray-600 text-white'
}

const getBadgeMetodo = (metodo: string) => {
  const colores = {
    efectivo: 'bg-blue-600 text-white',
    transferencia: 'bg-purple-600 text-white',
    tarjeta: 'bg-orange-600 text-white'
  }
  return colores[metodo as keyof typeof colores] || 'bg-gray-600 text-white'
}

export const VentaCard: React.FC<VentaCardProps> = ({ venta }) => {
  const verificacion = verificarGanadores(venta)
  const esVentaGanadora = verificacion.esGanadorPrincipal || verificacion.esGanadorSuerte

  return (
    <div className={`p-3 rounded-lg border-l-4 ${verificacion.esGanadorPrincipal
        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-yellow-500'
        : verificacion.esGanadorSuerte
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-500'
          : 'bg-gray-50 border-l-blue-500'
      }`}>
      {/* Badge de ganador */}
      {esVentaGanadora && (
        <div className="mb-3">
          <GanadorBadge
            esGanadorPrincipal={verificacion.esGanadorPrincipal}
            esGanadorSuerte={verificacion.esGanadorSuerte}
            numerosGanadores={verificacion.numerosGanadores}
          />
        </div>
      )}

      {/* Información de la venta */}
      <div className="space-y-3">
        {/* Header de la venta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
              {venta.rifa_titulo}
            </h4>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">
                {new Date(venta.fecha_venta).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
              <span className="text-xs text-gray-500">
                ORDEN: {venta.orden_id.substring(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Monto destacado */}
          <div className="flex items-center gap-1 self-end sm:self-center">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-bold text-green-600 text-sm sm:text-base">
              ${venta.total_pago.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Detalles de la venta */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          {/* Cantidad de boletos */}
          <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 border">
            <Package className="h-3 w-3 text-gray-400" />
            <span>{venta.cantidad_boletos} boletos</span>
          </div>

          {/* Badges de método y estado */}
          <Badge className={`text-xs ${getBadgeMetodo(venta.metodo_pago)}`}>
            {venta.metodo_pago}
          </Badge>
          <Badge className={`text-xs ${getBadgeEstado(venta.estado_pago)}`}>
            {venta.estado_pago}
          </Badge>
        </div>

        {/* Números de boletos */}
        {venta.numeros_boletos && venta.numeros_boletos.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Números comprados:</p>
            <div className="flex flex-wrap gap-1">
              {venta.numeros_boletos.slice(0, 20).map((numero) => {
                const esNumeroGanador = verificacion.numerosGanadores.includes(numero)
                const esGanadorPrincipal = verificacion.esGanadorPrincipal && venta.rifa_numero_ganador === numero

                return (
                  <Badge
                    key={numero}
                    variant={esNumeroGanador ? "default" : "outline"}
                    className={`font-mono text-xs flex items-center gap-1 ${esNumeroGanador
                        ? esGanadorPrincipal
                          ? 'bg-yellow-500 text-white animate-pulse'
                          : 'bg-green-500 text-white'
                        : 'bg-white border-gray-300'
                      }`}
                  >
                    {numero}
                    {esNumeroGanador && (
                      esGanadorPrincipal
                        ? <Crown className="h-3 w-3" />
                        : <Star className="h-3 w-3" />
                    )}
                  </Badge>
                )
              })}

              {venta.numeros_boletos.length > 20 && (
                <Badge variant="outline" className="text-xs bg-gray-100">
                  +{venta.numeros_boletos.length - 20} más
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}