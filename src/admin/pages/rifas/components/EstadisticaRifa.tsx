// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'

// // Definir el tipo Boleto
// type Boleto = {
//   id: string
//   numero: string
//   rifa_id: string
//   vendido: boolean
//   vendido_a?: string
//   vendido_por?: string
//   orden_id?: string
//   fecha_venta?: string
//   reservado?: boolean
//   reservado_para_agencia?: string
// }

// interface EstadisticasRifaProps {
//   totalBoletos: number
//   disponibles: number
//   vendidos: number
//   reservados: number
//   boletos: Boleto[] // Cambiado de boletosFormateados a boletos completos
// }

// export const EstadisticasRifa = ({ 
//   totalBoletos, 
//   disponibles, 
//   vendidos, 
//   reservados,
//   boletos 
// }: EstadisticasRifaProps) => {

  

//   const porcentajeVendido = totalBoletos > 0 ? Math.round((vendidos / totalBoletos) * 100) : 0

//   // Función para determinar el estado de un boleto y su clase CSS
//   const getBoletoStyle = (boleto: Boleto) => {
//     if (boleto.vendido) {
//       return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200'
//     }
//     if (boleto.reservado_para_agencia && boleto.reservado_para_agencia.length > 0) {
//       return 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200'
//     }
//     return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200'
//   }

//   // Función para determinar el estado del boleto para mostrar en tooltip
//   const getBoletoEstado = (boleto: Boleto) => {
//     if (boleto.vendido) {
//       return `Vendido${boleto.vendido_a ? ` a ${boleto.vendido_a}` : ''}`
//     }
//     if (boleto.reservado_para_agencia && boleto.reservado_para_agencia.length > 0) {
//       return `Reservado para ${boleto.reservado_para_agencia}`
//     }
//     return 'Disponible'
//   }

//   // No mostrar si no hay boletos
//   if (totalBoletos === 0) return null

//   return (
//     <>
//       {/* Estadísticas */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Estadísticas de Boletos</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
//             <div className="text-center p-4 bg-blue-50 rounded-lg">
//               <div className="text-2xl font-bold text-blue-600">{totalBoletos.toLocaleString()}</div>
//               <div className="text-sm text-blue-700">Total</div>
//             </div>
//             <div className="text-center p-4 bg-green-50 rounded-lg">
//               <div className="text-2xl font-bold text-green-600">{disponibles.toLocaleString()}</div>
//               <div className="text-sm text-green-700">Disponibles</div>
//             </div>
//             <div className="text-center p-4 bg-yellow-50 rounded-lg">
//               <div className="text-2xl font-bold text-yellow-600">{reservados.toLocaleString()}</div>
//               <div className="text-sm text-yellow-700">Reservados</div>
//             </div>
//             <div className="text-center p-4 bg-red-50 rounded-lg">
//               <div className="text-2xl font-bold text-red-600">{vendidos.toLocaleString()}</div>
//               <div className="text-sm text-red-700">Vendidos</div>
//             </div>
//             <div className="text-center p-4 bg-pink-50 rounded-lg">
//               <div className="text-2xl font-bold text-pink-600">{porcentajeVendido}%</div>
//               <div className="text-sm text-pink-700">Progreso</div>
//             </div>
//           </div>

//            {/* Leyenda de colores */}
//           <div className="mt-4 flex flex-wrap gap-4 justify-center">
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
//               <span className="text-sm text-gray-600">Disponible</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
//               <span className="text-sm text-gray-600">Reservado</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
//               <span className="text-sm text-gray-600">Vendido</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Vista previa de boletos con colores */}
//       {boletos.length > 0 && (
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle>Vista Previa de Boletos</CardTitle>
//               <Badge variant="outline">
//                 {boletos.length.toLocaleString()} boletos
//               </Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-15 gap-2 max-h-[300px] overflow-y-auto p-4 bg-gray-50 rounded border">
//               {boletos.slice(0, 100).map((boleto) => (
//                 <span
//                   key={boleto.id}
//                   className={`text-xs font-mono border rounded px-2 py-1 text-center shadow-sm transition-colors ${getBoletoStyle(boleto)}`}
//                   title={`Boleto ${boleto.numero} - ${getBoletoEstado(boleto)}`}
//                 >
//                   {boleto.numero}
//                 </span>
//               ))}
//               {boletos.length > 100 && (
//                 <span className="text-xs text-gray-500 px-2 py-1 text-center col-span-full">
//                   ... y {(boletos.length - 100).toLocaleString()} más
//                 </span>
//               )}
//             </div>
            
//           </CardContent>
//         </Card>
//       )}
//     </>
//   )
// }



import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
import { useBoletoStore } from '@/stores/useBoletoStore'
import { Loader2 } from 'lucide-react'

// type Boleto = {
//   id: string
//   numero: string
//   rifa_id: string
//   vendido: boolean
//   vendido_a?: string
//   vendido_por?: string
//   orden_id?: string
//   fecha_venta?: string
//   reservado?: boolean
//   reservado_para_agencia?: string
// }

interface EstadisticasRifaProps {
  rifaId: string
}

export const EstadisticasRifa = ({ rifaId }: EstadisticasRifaProps) => {
  const { fetchEstadisticasRifa } = useBoletoStore()
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    vendidos: 0,
    reservados: 0,
    disponibles: 0
  })
  // const [boletos, setBoletos] = useState<Boleto[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (!rifaId) return
      
      setLoading(true)
      try {
        // Cargar estadísticas
        const estadisticas = await fetchEstadisticasRifa(rifaId)
        setStats(estadisticas)
        
        // Cargar solo 100 boletos de muestra
        // const muestra = await getBoletosMuestra(rifaId, 100)
        // setBoletos(muestra)
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [rifaId])

  const porcentajeVendido = stats.total > 0 ? Math.round((stats.vendidos / stats.total) * 100) : 0

  // const getBoletoStyle = (boleto: Boleto) => {
  //   if (boleto.vendido) {
  //     return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200'
  //   }
  //   if (boleto.reservado_para_agencia && boleto.reservado_para_agencia.length > 0) {
  //     return 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200'
  //   }
  //   return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200'
  // }

  // const getBoletoEstado = (boleto: Boleto) => {
  //   if (boleto.vendido) {
  //     return `Vendido${boleto.vendido_a ? ` a ${boleto.vendido_a}` : ''}`
  //   }
  //   if (boleto.reservado_para_agencia && boleto.reservado_para_agencia.length > 0) {
  //     return `Reservado para ${boleto.reservado_para_agencia}`
  //   }
  //   return 'Disponible'
  // }

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

  if (stats.total === 0) return null

  return (
    <>
      {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Boletos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total.toLocaleString()}</div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.disponibles.toLocaleString()}</div>
              <div className="text-sm text-green-700">Disponibles</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.reservados.toLocaleString()}</div>
              <div className="text-sm text-yellow-700">Reservados</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.vendidos.toLocaleString()}</div>
              <div className="text-sm text-red-700">Vendidos</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{porcentajeVendido}%</div>
              <div className="text-sm text-pink-700">Progreso</div>
            </div>
          </div>

          {/* Leyenda de colores */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span className="text-sm text-gray-600">Reservado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm text-gray-600">Vendido</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vista previa de boletos con colores */}
      {/* {boletos.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Vista Previa de Boletos</CardTitle>
              <Badge variant="outline">
                Mostrando {boletos.length} de {stats.total.toLocaleString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-15 gap-2 max-h-[300px] overflow-y-auto p-4 bg-gray-50 rounded border">
              {boletos.map((boleto) => (
                <span
                  key={boleto.id}
                  className={`text-xs font-mono border rounded px-2 py-1 text-center shadow-sm transition-colors ${getBoletoStyle(boleto)}`}
                  title={`Boleto ${boleto.numero} - ${getBoletoEstado(boleto)}`}
                >
                  {boleto.numero}
                </span>
              ))}
            </div>
            {stats.total > 100 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Mostrando los primeros 100 boletos de {stats.total.toLocaleString()} totales
              </p>
            )}
          </CardContent>
        </Card>
      )} */}
    </>
  )
}