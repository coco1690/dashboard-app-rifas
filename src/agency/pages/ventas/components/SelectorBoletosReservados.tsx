// import React, { useState, useEffect } from 'react'
// import { useBoletoStore } from '@/stores/useBoletoStore'
// import { useAuthStore } from '@/stores/authStore'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { RefreshCw, Package, Target, Zap, RotateCcw, CheckCircle } from 'lucide-react'

// type Boleto = {
//   id: string
//   numero: string
//   rifa_id: string
//   vendido: boolean
//   reservado_para_agencia?: string
// }

// interface SelectorBoletosReservadosProps {
//   rifaId: string
//   cantidadRequerida: number
//   onBoletosSeleccionados: (boletos: string[]) => void
//   boletosSeleccionados: string[]
//   refreshKey?: number
// }

// const SelectorBoletosReservados: React.FC<SelectorBoletosReservadosProps> = ({
//   rifaId,
//   cantidadRequerida,
//   onBoletosSeleccionados,
//   boletosSeleccionados,
//   refreshKey = 0
// }) => {
//   const { user } = useAuthStore()
//   const { getBoletosReservadosParaAgencia } = useBoletoStore()

//   const [loadingBoletos, setLoadingBoletos] = useState(false)
//   const [boletosReservados, setBoletosReservados] = useState<Boleto[]>([])
//   const [error, setError] = useState<string | null>(null)
//   const [lastRefreshKey, setLastRefreshKey] = useState(0)

//   const agenciaId = user?.id

//   const cargarBoletos = async () => {
//     if (!rifaId || !agenciaId) return

//     setLoadingBoletos(true)
//     setError(null)
//     try {
//       //TODO: LIMITE DE BOLETOS A TRAER
//       const limit = Math.max(cantidadRequerida + 2000, 3000)
//       const boletos = await getBoletosReservadosParaAgencia(rifaId, agenciaId, limit)
      
//       const boletosMezclados = [...boletos]
//       for (let i = boletosMezclados.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [boletosMezclados[i], boletosMezclados[j]] = [boletosMezclados[j], boletosMezclados[i]]
//       }
      
//       setBoletosReservados(boletosMezclados)
//       console.log(`✅ Cargados ${boletosMezclados.length} boletos reservados`)
//     } catch (err: any) {
//       console.error('Error cargando boletos:', err)
//       setError(err.message || 'Error al cargar boletos')
//     } finally {
//       setLoadingBoletos(false)
//     }
//   }

//   useEffect(() => {
//     cargarBoletos()
//   }, [rifaId, agenciaId])

//   useEffect(() => {
//     if (refreshKey > 0 && refreshKey !== lastRefreshKey) {
//       setLastRefreshKey(refreshKey)
//       cargarBoletos()
//     }
//   }, [refreshKey])

//   const actualizarBoletos = () => {
//     onBoletosSeleccionados([])
//     cargarBoletos()
//   }

//   const seleccionarAutomatica = () => {
//     const primerosBoletos = boletosReservados
//       .slice(0, cantidadRequerida)
//       .map(boleto => boleto.id)
    
//     onBoletosSeleccionados(primerosBoletos)
//   }

//   const limpiarSeleccion = () => {
//     onBoletosSeleccionados([])
//   }

//   if (loadingBoletos) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Cargando boletos...</span>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-50 border border-red-200 rounded-md">
//         <p className="text-red-700">Error: {error}</p>
//         <Button 
//           onClick={actualizarBoletos}
//           variant="outline" 
//           size="sm" 
//           className="mt-2"
//         >
//           <RefreshCw className="h-4 w-4 mr-2" />
//           Reintentar
//         </Button>
//       </div>
//     )
//   }

//   if (boletosReservados.length === 0) {
//     return (
//       <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
//         <div className="text-center">
//           <h3 className="text-lg font-semibold text-yellow-800 mb-2">
//             Sin Boletos Reservados
//           </h3>
//           <p className="text-yellow-700 mb-4">
//             No tienes boletos reservados para esta rifa. Contacta al administrador para solicitar una recarga.
//           </p>
//           <Button 
//             onClick={actualizarBoletos}
//             variant="outline" 
//             size="sm"
//           >
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Actualizar Boletos
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   if (boletosReservados.length < cantidadRequerida) {
//     return (
//       <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
//         <div className="text-center">
//           <h3 className="text-lg font-semibold text-orange-800 mb-2">
//             Boletos Insuficientes
//           </h3>
//           <p className="text-orange-700 mb-4">
//             Tienes {boletosReservados.length} boletos reservados, pero necesitas {cantidadRequerida} para este paquete.
//           </p>
//           <p className="text-sm text-orange-600 mb-4">
//             Contacta al administrador para solicitar más boletos.
//           </p>
//           <Button 
//             onClick={actualizarBoletos}
//             variant="outline" 
//             size="sm"
//           >
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Actualizar Boletos
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       <Card className="bg-blue-50 border-blue-200">
//         <CardContent className="pt-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="space-y-1">
//               <h3 className="text-lg font-semibold text-blue-900">
//                 Seleccionar Boletos Reservados
//               </h3>
//               <div className="flex items-center gap-4 text-sm text-blue-700">
//                 <div className="flex items-center gap-1">
//                   <Package className="h-4 w-4" />
//                   <span>{boletosReservados.length} disponibles</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Target className="h-4 w-4" />
//                   <span>Necesitas {cantidadRequerida}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button
//                 onClick={seleccionarAutomatica}
//                 disabled={boletosSeleccionados.length === cantidadRequerida}
//                 variant="default"
//                 size="sm"
//               >
//                 <Zap className="h-4 w-4 mr-1" />
//                 Auto-seleccionar
//               </Button>
//               <Button
//                 onClick={limpiarSeleccion}
//                 disabled={boletosSeleccionados.length === 0}
//                 variant="secondary"
//                 size="sm"
//               >
//                 <RotateCcw className="h-4 w-4 mr-1" />
//                 Limpiar
//               </Button>
//               <Button
//                 onClick={actualizarBoletos}
//                 disabled={loadingBoletos}
//                 variant="outline"
//                 size="sm"
//               >
//                 <RefreshCw className={`h-4 w-4 ${loadingBoletos ? 'animate-spin' : ''}`} />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="bg-gray-50">
//         <CardContent className="py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <span className="text-sm font-medium text-gray-700">Progreso de selección:</span>
//               <div className="flex items-center gap-2">
//                 <Badge variant="outline" className="bg-white">
//                   {boletosSeleccionados.length} / {cantidadRequerida}
//                 </Badge>
//                 {boletosSeleccionados.length === cantidadRequerida && (
//                   <Badge className="bg-green-600 text-white">
//                     <CheckCircle className="h-3 w-3 mr-1" />
//                     Completo
//                   </Badge>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex-1 max-w-32 mx-4">
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${(boletosSeleccionados.length / cantidadRequerida) * 100}%` }}
//                 />
//               </div>
//             </div>
            
//             <span className="text-xs text-gray-500">
//               {Math.round((boletosSeleccionados.length / cantidadRequerida) * 100)}%
//             </span>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default SelectorBoletosReservados

import React, { useState, useEffect } from 'react'
import { useBoletoStore } from '@/stores/useBoletoStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Package, Target, Zap, RotateCcw, CheckCircle } from 'lucide-react'

type Boleto = {
  id: string
  numero: string
  rifa_id: string
  vendido: boolean
  reservado_para_agencia?: string
}

interface SelectorBoletosReservadosProps {
  rifaId: string
  cantidadRequerida: number
  onBoletosSeleccionados: (boletos: string[]) => void
  boletosSeleccionados: string[]
  refreshKey?: number
}

const SelectorBoletosReservados: React.FC<SelectorBoletosReservadosProps> = ({
  rifaId,
  cantidadRequerida,
  onBoletosSeleccionados,
  boletosSeleccionados,
  refreshKey = 0
}) => {
  const { user } = useAuthStore()
  const { getBoletosReservadosParaAgencia } = useBoletoStore()

  const [loadingBoletos, setLoadingBoletos] = useState(false)
  const [boletosReservados, setBoletosReservados] = useState<Boleto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshKey, setLastRefreshKey] = useState(0)

  const agenciaId = user?.id

  const cargarBoletos = async () => {
    if (!rifaId || !agenciaId) return

    setLoadingBoletos(true)
    setError(null)
    try {
      const limit = Math.max(cantidadRequerida + 2000, 3000)
      const boletos = await getBoletosReservadosParaAgencia(rifaId, agenciaId, limit)
      
      const boletosMezclados = [...boletos]
      for (let i = boletosMezclados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [boletosMezclados[i], boletosMezclados[j]] = [boletosMezclados[j], boletosMezclados[i]]
      }
      
      setBoletosReservados(boletosMezclados)
      console.log(`✅ Cargados ${boletosMezclados.length} boletos reservados`)
    } catch (err: any) {
      console.error('Error cargando boletos:', err)
      setError(err.message || 'Error al cargar boletos')
    } finally {
      setLoadingBoletos(false)
    }
  }

  useEffect(() => {
    cargarBoletos()
  }, [rifaId, agenciaId])

  useEffect(() => {
    if (refreshKey > 0 && refreshKey !== lastRefreshKey) {
      setLastRefreshKey(refreshKey)
      cargarBoletos()
    }
  }, [refreshKey])

  const actualizarBoletos = () => {
    onBoletosSeleccionados([])
    cargarBoletos()
  }

  const seleccionarAutomatica = () => {
    const primerosBoletos = boletosReservados
      .slice(0, cantidadRequerida)
      .map(boleto => boleto.id)
    
    onBoletosSeleccionados(primerosBoletos)
  }

  const limpiarSeleccion = () => {
    onBoletosSeleccionados([])
  }

  if (loadingBoletos) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando boletos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Error: {error}</p>
        <Button 
          onClick={actualizarBoletos}
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  if (boletosReservados.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Sin Boletos Reservados
          </h3>
          <p className="text-yellow-700 mb-4">
            No tienes boletos reservados para esta rifa. Contacta al administrador para solicitar una recarga.
          </p>
          <Button 
            onClick={actualizarBoletos}
            variant="outline" 
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar Boletos
          </Button>
        </div>
      </div>
    )
  }

  if (boletosReservados.length < cantidadRequerida) {
    return (
      <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Boletos Insuficientes
          </h3>
          <p className="text-orange-700 mb-4">
            Tienes {boletosReservados.length} boletos reservados, pero necesitas {cantidadRequerida} para este paquete.
          </p>
          <p className="text-sm text-orange-600 mb-4">
            Contacta al administrador para solicitar más boletos.
          </p>
          <Button 
            onClick={actualizarBoletos}
            variant="outline" 
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar Boletos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          {/* ✅ LAYOUT RESPONSIVE MEJORADO */}
          <div className="space-y-4">
            {/* Información - Siempre arriba */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-blue-900">
                Seleccionar Boletos Reservados
              </h3>
              <div className="flex items-center gap-4 text-sm text-blue-700">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{boletosReservados.length} disponibles</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>Necesitas {cantidadRequerida}</span>
                </div>
              </div>
            </div>

            {/* Botones - Responsive grid */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <Button
                onClick={seleccionarAutomatica}
                disabled={boletosSeleccionados.length === cantidadRequerida}
                variant="default"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Zap className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Auto-seleccionar</span>
                <span className="sm:hidden">Auto</span>
              </Button>
              
              <Button
                onClick={limpiarSeleccion}
                disabled={boletosSeleccionados.length === 0}
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
              >
                <RotateCcw className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Limpiar</span>
                <span className="sm:hidden">Limpiar</span>
              </Button>
              
              <Button
                onClick={actualizarBoletos}
                disabled={loadingBoletos}
                variant="outline"
                size="sm"
                className="col-span-2 sm:col-span-1 sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 ${loadingBoletos ? 'animate-spin' : ''} sm:mr-1`} />
                <span className="hidden sm:inline">Actualizar</span>
                <span className="sm:hidden">Actualizar Boletos</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50">
        <CardContent className="py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Progreso:</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  {boletosSeleccionados.length} / {cantidadRequerida}
                </Badge>
                {boletosSeleccionados.length === cantidadRequerida && (
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completo
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:w-32">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(boletosSeleccionados.length / cantidadRequerida) * 100}%` }}
                  />
                </div>
              </div>
              
              <span className="text-xs text-gray-500 min-w-[40px] text-right">
                {Math.round((boletosSeleccionados.length / cantidadRequerida) * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SelectorBoletosReservados