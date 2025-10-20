import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRifaStore } from '@/stores/rifaStore'
import { useBoletoStore } from '@/stores/useBoletoStore'
import { ConfiguracionBoletos } from '../components/ConfiguracionBoletos'
import { NumerosDeLaSuerte } from '../components/NumerosDeLaSuerte'
import { EstadisticasRifa } from '../components/EstadisticaRifa'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { NumeroGanador } from '../components/NumeroGandor'
import { useParams } from 'react-router'

export const AdminRifasIdPage = () => {
  const { id: rifaId } = useParams<{ id: string }>()

  const {
    fetchEstadisticasRifa,
    // digitos,
    estadisticasPorRifa
  } = useBoletoStore()

  const { rifas, fetchRifas, loading: rifaLoading } = useRifaStore()

  const [initialRifasLoaded, setInitialRifasLoaded] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)

  // Cargar rifas al inicio
  useEffect(() => {
    if (!initialRifasLoaded) {
      setInitialRifasLoaded(true)
      fetchRifas()
    }
  }, [initialRifasLoaded])

  const rifaActiva = rifas.find(r => r.id === rifaId)

  // Cargar estadísticas cuando cambia la rifa activa
  useEffect(() => {
    const loadStats = async () => {
      if (rifaActiva?.id) {
        setLoadingStats(true)
        try {
          await fetchEstadisticasRifa(rifaActiva.id)
        } catch (error) {
          console.error('Error cargando estadísticas:', error)
        } finally {
          setLoadingStats(false)
        }
      }
    }
    loadStats()
  }, [rifaActiva?.id])

  const handleRefreshAll = async () => {
    if (!rifaActiva?.id) return
    setLoadingStats(true)
    try {
      await Promise.all([
        fetchRifas(true),
        fetchEstadisticasRifa(rifaActiva.id)
      ])
    } catch (error) {
      console.error('Error al actualizar datos:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  // Obtener estadísticas del store
  const stats = rifaActiva ? estadisticasPorRifa[rifaActiva.id] : null
  const totalBoletos = stats?.total || 0
  const isLoading = rifaLoading || loadingStats

  if (rifaLoading && rifas.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Cargando rifa...</div>
        </CardContent>
      </Card>
    )
  }

  if (!rifaLoading && !rifaActiva) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">
            {rifaId ? `No se encontró la rifa con ID: ${rifaId}` : 'ID de rifa no proporcionado'}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!rifaActiva) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">No hay rifas disponibles</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Información de la rifa */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Boletos - {rifaActiva.titulo}</CardTitle>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant={rifaActiva.estado === 'activa' ? 'default' : 'secondary'}>
                  {rifaActiva.estado}
                </Badge>
                <Badge variant="outline">
                  ID: {rifaActiva.id.slice(0, 8)}...
                </Badge>
                <Badge variant="outline">
                  Rango: {rifaActiva.numero_inicial.toString()} - {rifaActiva.numero_final.toString()}
                </Badge>
                {stats && (
                  <>
                    <Badge variant="secondary">
                      Total: {stats.total.toLocaleString()}
                    </Badge>
                    {/* <Badge className="bg-green-600">
                      Disponibles: {stats.disponibles.toLocaleString()}
                    </Badge>
                    <Badge className="bg-red-600">
                      Vendidos: {stats.vendidos.toLocaleString()}
                    </Badge> */}
                  </>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>
      </Card>

      <ConfiguracionBoletos
        rifaActiva={rifaActiva}
        totalBoletos={totalBoletos}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NumerosDeLaSuerte
          rifaActiva={rifaActiva}
          totalBoletos={totalBoletos}
        />

        <NumeroGanador
          rifaActiva={rifaActiva}
          // digitos={digitos}
        />
      </div>

      <EstadisticasRifa rifaId={rifaActiva.id} />
    </div>
  )
}
