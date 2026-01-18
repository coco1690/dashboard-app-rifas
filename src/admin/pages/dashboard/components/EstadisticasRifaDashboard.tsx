import { useState, useEffect } from 'react'
import { useBoletoStore } from '@/stores/useBoletoStore'
import { useRifaStore } from '@/stores/rifaStore'
import StatCard from '@/admin/components/StatCard'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Ticket, DollarSign, TrendingUp, Package } from 'lucide-react'

interface EstadisticasRifaDashboardProps {
  rifaId?: string // Si no se proporciona, usa la primera rifa activa
}

export const EstadisticasRifaDashboard = ({ rifaId }: EstadisticasRifaDashboardProps) => {
  const { fetchEstadisticasRifa, estadisticasPorRifa } = useBoletoStore()
  const { rifas, fetchRifas } = useRifaStore()
  
  const [loading, setLoading] = useState(true)
  const [rifaActual, setRifaActual] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Cargar rifas si no están cargadas
        if (rifas.length === 0) {
          await fetchRifas()
        }

        // Determinar qué rifa usar
        let rifa = null
        if (rifaId) {
          rifa = rifas.find(r => r.id === rifaId)
        } else {
          // Buscar primera rifa activa
          rifa = rifas.find(r => r.estado === 'activa') || rifas[0]
        }

        if (rifa) {
          setRifaActual(rifa)
          await fetchEstadisticasRifa(rifa.id)
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [rifaId, rifas.length])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
        </CardContent>
      </Card>
    )
  }

  if (!rifaActual) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">No hay rifas disponibles</div>
        </CardContent>
      </Card>
    )
  }

  const stats = estadisticasPorRifa[rifaActual.id]

  if (!stats) {
    return null
  }

  const porcentajeVendido = stats.total > 0 
    ? ((stats.vendidos / stats.total) * 100).toFixed(1)
    : '0'

  const porcentajeDisponible = stats.total > 0 
    ? ((stats.disponibles / stats.total) * 100).toFixed(1)
    : '0'

  const porcentajeReservado = stats.total > 0 
    ? ((stats.reservados / stats.total) * 100).toFixed(1)
    : '0'

  // Calcular cambios (simulados - podrías implementar lógica real comparando con datos históricos)
  const changeVendidos = stats.vendidos > 0 ? '+' : ''
  const changeDisponibles = stats.disponibles > 0 ? '' : '-'

  const estadisticas = [
    {
      title: 'Total Boletos',
      value: stats.total.toLocaleString(),
      change: `${rifaActual.titulo}`,
      changeType: 'neutral' as const,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Boletos Vendidos',
      value: stats.vendidos.toLocaleString(),
      change: `${changeVendidos}${porcentajeVendido}% del total`,
      changeType: stats.vendidos > 0 ? 'positive' as const : 'neutral' as const,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Boletos Reservados',
      value: stats.reservados.toLocaleString(),
      change: `${porcentajeReservado}% del total`,
      changeType: 'neutral' as const,
      icon: Ticket,
      color: 'bg-yellow-500'
    },
    {
      title: 'Boletos Disponibles',
      value: stats.disponibles.toLocaleString(),
      change: `${changeDisponibles}${porcentajeDisponible}% disponible`,
      changeType: stats.disponibles > stats.total / 2 ? 'positive' as const : 'negative' as const,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {estadisticas.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}