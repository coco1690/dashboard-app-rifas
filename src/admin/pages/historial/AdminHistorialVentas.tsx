// import { OrdersHistorialVentasClientes } from "@/agency/pages/historial/components/OrdersHistorialVentasClientes"
// import { CustomTitle } from "@/components/custom/CustomTitle"



// export const AdminHistorialVentas = () => {
 
//     return (
//       <>
//         <div className="flex justify-between items-center">
//           <CustomTitle
//             title="Historial de Ventas"
//             emoji="🧾"
//             subtitle="Aquí puedes ver el estado de las ventas"
//           />
//         </div>
        
//         <OrdersHistorialVentasClientes/>
//       </>
//     )
// }


import { OrdersHistorialVentasClientes } from "@/agency/pages/historial/components/OrdersHistorialVentasClientes"
import { CustomTitle } from "@/components/custom/CustomTitle"
import { useHistorialVentasStore } from "@/stores/useHistorialVentasStore"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, ShoppingCart, TrendingUp } from "lucide-react"

export const AdminHistorialVentas = () => {
  const { ventas, loading, obtenerHistorial, error } = useHistorialVentasStore()

  // Cargar historial al montar el componente
  useEffect(() => {
    obtenerHistorial()
  }, [])

  // Función para refrescar datos
  const handleRefresh = () => {
    obtenerHistorial({}, 1)
  }

  // Estado de carga
  if (loading && ventas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <CustomTitle
            title="Historial de Ventas"
            emoji="🧾"
            subtitle="Aquí puedes ver el estado de las ventas"
          />
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Cargando historial de ventas...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estado de error
  if (error && ventas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <CustomTitle
            title="Historial de Ventas"
            emoji="🧾"
            subtitle="Aquí puedes ver el estado de las ventas"
          />
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error al cargar historial
              </h3>
              <p className="text-red-700 mb-4 max-w-md mx-auto">
                {error}
              </p>
              <Button 
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Intentar nuevamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estado vacío - No hay ventas
  if (!loading && ventas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <CustomTitle
            title="Historial de Ventas"
            emoji="🧾"
            subtitle="Aquí puedes ver el estado de las ventas"
          />
        </div>
        
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center py-16">
              <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-800 mb-3">
                No hay historial de ventas
              </h3>
              <p className="text-amber-700 mb-6 max-w-lg mx-auto">
                Aún no se han registrado ventas en el sistema. Una vez que las agencias 
                comiencen a vender boletos, aparecerán aquí organizados por cliente.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={handleRefresh}
                  disabled={loading}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Verificar nuevamente
                </Button>
                <div className="text-sm text-amber-600">
                  <p className="font-medium">Posibles acciones:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Verificar que las agencias tengan boletos asignados</li>
                    <li>• Confirmar que las rifas estén activas</li>
                    <li>• Revisar la configuración del sistema</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estado normal - Mostrar componente con datos
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <CustomTitle
          title="Historial de Ventas"
          emoji="🧾"
          subtitle="Aquí puedes ver el estado de las ventas"
        />
      </div>
      
      <OrdersHistorialVentasClientes />
    </div>
  )
}