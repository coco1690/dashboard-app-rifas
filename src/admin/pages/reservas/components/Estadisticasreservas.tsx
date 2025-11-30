import { useAdminReservasStore } from '@/stores/useAdminReservasStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Ticket, 
  DollarSign,
  ListChecks 
} from 'lucide-react'

export default function EstadisticasReservas() {
  const { obtenerEstadisticas } = useAdminReservasStore()
  const stats = obtenerEstadisticas()

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto)
  }

  // Estadísticas principales (siempre visibles)
  const estadisticasPrincipales = [
    {
      titulo: 'Total',
      valor: stats.total,
      icono: ListChecks,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      titulo: 'Activas',
      valor: stats.activas,
      icono: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      titulo: 'Expiradas',
      valor: stats.expiradas,
      icono: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  // Estadísticas secundarias (ocultas en móvil)
  const estadisticasSecundarias = [
    {
      titulo: 'Completadas',
      valor: stats.completadas,
      icono: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      titulo: 'Boletos',
      valor: stats.totalBoletos,
      icono: Ticket,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      titulo: 'Monto',
      valor: formatearMoneda(stats.montoTotal),
      icono: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ]

  return (
    <div className="space-y-3">
      {/* Estadísticas principales - Siempre visibles */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {estadisticasPrincipales.map((stat) => {
          const Icono = stat.icono
          return (
            <Card key={stat.titulo} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                <CardTitle className="text-xs md:text-sm font-medium">
                  {stat.titulo}
                </CardTitle>
                <div className={`p-1 md:p-2 rounded-lg ${stat.bgColor}`}>
                  <Icono className={`w-3 h-3 md:w-4 md:h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <div className="text-xl md:text-2xl font-bold">
                  {stat.valor}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Estadísticas secundarias - Ocultas en móvil */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {estadisticasSecundarias.map((stat) => {
          const Icono = stat.icono
          return (
            <Card key={stat.titulo} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.titulo}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icono className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.valor}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}