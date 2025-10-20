import { useState, useEffect } from "react"
import { useRifaStore } from "@/stores/rifaStore"
import { useAuthStore } from "@/stores/authStore"
import { CustomTitle } from "@/components/custom/CustomTitle"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Ticket } from "lucide-react"
import { toast } from "sonner"
import SelectorPaquetes from "../../../agency/pages/ventas/components/SelectorPaquetes"

export const AgencyVentasPage = () => {
  // Estados
  const [rifaSeleccionada, setRifaSeleccionada] = useState<string>("")
  const [refreshKey, setRefreshKey] = useState(0)
  
  // Stores
  const { rifas, fetchRifas, loading } = useRifaStore()
  const { user } = useAuthStore()

  // Cargar rifas al montar el componente
  useEffect(() => {
    fetchRifas()
  }, [])

  // Computadas
  const rifasActivas = rifas.filter(rifa => rifa.estado === 'activa')
  const agenciaId = user?.id

  // Handlers
  const handleRifaChange = (rifaId: string) => {
    setRifaSeleccionada(rifaId)
  }

  const handleRefresh = async () => {
    const loadingToast = toast.loading('Actualizando datos...', {
      description: 'Recargando información de rifas'
    })
    
    try {
      await fetchRifas()
      
      if (rifasActivas.length === 0) {
        toast.warning('No hay rifas disponibles', {
          description: 'No se encontraron rifas activas para vender boletos.',
          duration: 4000
        })
        return
      }
      
      if (!rifaSeleccionada) {
        toast.warning('Rifa no seleccionada', {
          description: 'Por favor, selecciona una rifa antes de actualizar.',
          duration: 3000
        })
        return
      }
      
      setRefreshKey(prev => prev + 1)
      
      toast.success('Datos actualizados', {
        description: 'La información se ha actualizado correctamente.',
        duration: 2000
      })
    } catch (error) {
      toast.error('Error al actualizar', {
        description: 'Hubo un problema al recargar los datos.',
        duration: 3000
      })
    } finally {
      toast.dismiss(loadingToast)
    }
  }

  // Renderizado condicional para usuario no autenticado
  if (!agenciaId) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p>Debes estar autenticado para acceder a las ventas.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CustomTitle
          title="Ventas"
          emoji="🧾"
          subtitle="Aquí puedes realizar las ventas de los boletos"
        />
        <Button
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Estado vacío - Sin rifas activas */}
      {rifasActivas.length === 0 && !loading && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Ticket className="h-12 w-12 mx-auto text-amber-600" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-amber-800">
                  No hay rifas disponibles
                </h3>
                <p className="text-amber-700 text-sm max-w-md mx-auto">
                  No se encontraron rifas activas para realizar ventas. 
                  Contacta al administrador para activar rifas o crear nuevas.
                </p>
              </div>
              <Button 
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Verificar nuevamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selector de rifa */}
      {rifasActivas.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="rifa-select" className="text-sm font-medium">
                Seleccionar Rifa
              </Label>
              <Select value={rifaSeleccionada} onValueChange={handleRifaChange}>
                <SelectTrigger id="rifa-select" className="max-w-md">
                  <SelectValue placeholder="Seleccione una rifa" />
                </SelectTrigger>
                <SelectContent>
                  {rifasActivas.map(rifa => (
                    <SelectItem key={rifa.id} value={rifa.id}>
                      {rifa.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Componente de ventas */}
      {rifaSeleccionada && (
        <SelectorPaquetes 
          key={`selector-${rifaSeleccionada}-${refreshKey}`}
          rifaId={rifaSeleccionada}
          agenciaId={agenciaId}
          refreshKey={refreshKey}
        />
      )}
    </div>
  )
}