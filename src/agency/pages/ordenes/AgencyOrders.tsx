import CustomTableOrders from '@/components/custom/CustomTableOrders'
import { useOrdenesStore } from '@/stores/useOrdenesStore'
import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'

interface AgencyOrdersProps {
  agenciaId?: string // Hacer opcional para manejar undefined
}

export const AgencyOrders = ({ agenciaId: propAgenciaId }: AgencyOrdersProps) => {
  const { inicializarContexto, contexto, agenciaId: agenciaContexto } = useOrdenesStore()
  const { user } = useAuthStore() // Obtener usuario del auth store
  const [lastAgenciaId, setLastAgenciaId] = useState<string>('')
  const [inicializado, setInicializado] = useState(false)
  
  // Usar agenciaId del prop o del usuario autenticado
  const agenciaId = propAgenciaId || user?.id
  
  console.log('🏢 AgencyOrders - Props y usuario:', { 
    propAgenciaId, 
    userId: user?.id, 
    agenciaIdFinal: agenciaId 
  })
  console.log('🏢 AgencyOrders - Store contexto:', { contexto, agenciaContexto })
  
  // Mostrar loading mientras se obtiene el usuario
  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Cargando información del usuario...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mostrar error si no hay agenciaId válido
  if (!agenciaId) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-800 font-semibold mb-2">Error de configuración</h3>
              <p className="text-red-700 mb-2">No se puede determinar el ID de agencia.</p>
              <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
                <p>Usuario: {user?.nombre || 'Sin nombre'}</p>
                <p>ID de usuario: {user?.id || 'Sin ID'}</p>
                <p>Tipo de usuario: {user?.user_type || 'Sin tipo'}</p>
                <p>Prop agenciaId: {JSON.stringify(propAgenciaId)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Inicializar contexto cuando cambie agenciaId
  useEffect(() => {
    if (agenciaId && agenciaId !== lastAgenciaId) {
      console.log('🔧 Inicializando contexto para agencia:', agenciaId)
      setLastAgenciaId(agenciaId)
      setInicializado(false)
      
      inicializarContexto('agencia', agenciaId)
      setInicializado(true)
    }
  }, [agenciaId])

  // Mostrar loading mientras se inicializa el contexto
  if (!inicializado || contexto !== 'agencia' || agenciaContexto !== agenciaId) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Inicializando contexto de agencia...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <CustomTableOrders />
}
