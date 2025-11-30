import { useEffect, useState } from 'react'
import { useAdminReservasStore } from '@/stores/useAdminReservasStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RefreshCw, Trash2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import EstadisticasReservas from './components/Estadisticasreservas'
import FiltrosReservas from './components/Filtrosreservas'
import TablaReservas from './components/Tablareservas'


export default function AdminReservas() {
  const {
    reservas,
    loading,
    error,
    ultimaActualizacion,
    autoRefresh,
    obtenerReservas,
    liberarTodasExpiradas,
    toggleAutoRefresh
  } = useAdminReservasStore()

  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [tabActiva, setTabActiva] = useState<'activas' | 'expiradas' | 'todas'>('activas')

  // Cargar reservas al montar
  useEffect(() => {
    obtenerReservas()
  }, [])

  // Filtrar reservas según tab y búsqueda
  const reservasFiltradas = reservas
    .filter(r => {
      // Filtro por tab
      if (tabActiva === 'activas') {
        return r.estado === 'activa' && !r.esta_expirada
      }
      if (tabActiva === 'expiradas') {
        return r.esta_expirada || r.estado === 'expirada'
      }
      return true // todas
    })
    .filter(r => {
      // Filtro por búsqueda
      if (!terminoBusqueda.trim()) return true
      
      const termino = terminoBusqueda.toLowerCase()
      return (
        r.rifa_titulo.toLowerCase().includes(termino) ||
        r.session_id.toLowerCase().includes(termino) ||
        r.id.toLowerCase().includes(termino)
      )
    })

  const handleLimpiarExpiradas = async () => {
    const exito = await liberarTodasExpiradas()
    if (exito) {
      // Cambiar a tab activas después de limpiar
      setTabActiva('activas')
    }
  }

  return (
    <div className="container mx-auto py-4 md:py-8 space-y-4 md:space-y-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Administración de Reservas</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Gestiona todas las reservas del sistema
          </p>
        </div>

        {/* Botones - Stack en móvil, inline en desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {/* Auto-refresh toggle - Oculto en móvil */}
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={toggleAutoRefresh}
            className="hidden sm:flex"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>

          {/* Refresh manual */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => obtenerReservas()}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>

          {/* Limpiar expiradas */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLimpiarExpiradas}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar Expiradas
          </Button>
        </div>
      </div>

      {/* Última actualización */}
      {ultimaActualizacion && (
        <p className="text-xs text-muted-foreground">
          Última actualización: {ultimaActualizacion.toLocaleTimeString()}
        </p>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <EstadisticasReservas />

      {/* Filtros y búsqueda */}
      <FiltrosReservas
        terminoBusqueda={terminoBusqueda}
        onBusquedaChange={setTerminoBusqueda}
      />

      {/* Tabs */}
      <Tabs value={tabActiva} onValueChange={(v) => setTabActiva(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activas">
            Activas ({reservas.filter(r => r.estado === 'activa' && !r.esta_expirada).length})
          </TabsTrigger>
          <TabsTrigger value="expiradas">
            Expiradas ({reservas.filter(r => r.esta_expirada || r.estado === 'expirada').length})
          </TabsTrigger>
          <TabsTrigger value="todas">
            Todas ({reservas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activas" className="mt-6">
          <TablaReservas
            reservas={reservasFiltradas}
            loading={loading}
            tipo="activas"
          />
        </TabsContent>

        <TabsContent value="expiradas" className="mt-6">
          <TablaReservas
            reservas={reservasFiltradas}
            loading={loading}
            tipo="expiradas"
          />
        </TabsContent>

        <TabsContent value="todas" className="mt-6">
          <TablaReservas
            reservas={reservasFiltradas}
            loading={loading}
            tipo="todas"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}