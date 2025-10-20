

// import React, { useState, useEffect } from 'react'
// import { useBoletoStore } from '@/stores/useBoletoStore'
// import { useAuthStore } from '@/stores/authStore'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { RefreshCw, Package, Target, Zap, RotateCcw, CheckCircle } from 'lucide-react'

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
//   const { 
//     loading, 
//     error, 
//     fetchBoletosRifa, 
//     getBoletosReservados,
//     invalidarCacheRifa 
//   } = useBoletoStore()

//   const [loadingBoletos, setLoadingBoletos] = useState(false)
//   const [localRefreshKey, setLocalRefreshKey] = useState(0)

//   // Obtener ID de agencia del usuario autenticado
//   const agenciaId = user?.id 

//   // Obtener boletos reservados para esta agencia en esta rifa y mezclarlos aleatoriamente
//   const boletosReservadosRaw = getBoletosReservados(rifaId).filter(
//     boleto => boleto.reservado_para_agencia === agenciaId
//   )
  
//   // Función para mezclar array usando Fisher-Yates
//   const mezclarArray = (array: any[]) => {
//     const arr = [...array]
//     for (let i = arr.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [arr[i], arr[j]] = [arr[j], arr[i]]
//     }
//     return arr
//   }
  
//   // Aplicar mezclado aleatorio a los boletos
//   const boletosReservados = mezclarArray(boletosReservadosRaw)

//   // ACTUALIZADA: Función para cargar boletos con opción de forzar
//   const cargarBoletos = async (forzar: boolean = false) => {
//     if (!rifaId) return
    
//     setLoadingBoletos(true)
//     try {
//       // Si se fuerza, invalidar caché primero
//       if (forzar) {
//         invalidarCacheRifa(rifaId)
//       }
      
//       await fetchBoletosRifa(rifaId, forzar)
//       console.log(`🔄 Boletos ${forzar ? 'forzado a recargar' : 'cargados'} para rifa ${rifaId}`)
//     } catch (error) {
//       console.error('Error cargando boletos:', error)
//     } finally {
//       setLoadingBoletos(false)
//     }
//   }

//   // Función para actualizar solo este componente
//   const actualizarBoletos = () => {
//     onBoletosSeleccionados([]) // Limpiar selección
//     setLocalRefreshKey(prev => prev + 1)
//     cargarBoletos(true) // Forzar recarga
//   }

//   // ACTUALIZADO: Cargar boletos al montar el componente, cambiar rifaId o refreshKey
//   useEffect(() => {
//     const shouldForceReload = refreshKey > 0 || localRefreshKey > 0
//     cargarBoletos(shouldForceReload)
//   }, [rifaId, refreshKey, localRefreshKey])

 

//   // Manejar selección/deselección de boletos
//   // const toggleBoleto = (boletoId: string) => {
//   //   const nuevaSeleccion = boletosSeleccionados.includes(boletoId)
//   //     ? boletosSeleccionados.filter(id => id !== boletoId)
//   //     : boletosSeleccionados.length < cantidadRequerida
//   //       ? [...boletosSeleccionados, boletoId]
//   //       : boletosSeleccionados

//   //   onBoletosSeleccionados(nuevaSeleccion)
//   // }

//   // Seleccionar automáticamente los primeros N boletos
//   const seleccionarAutomatica = () => {
//     const primerosBoletos = boletosReservados
//       .slice(0, cantidadRequerida)
//       .map(boleto => boleto.id)
    
//     onBoletosSeleccionados(primerosBoletos)
//   }

//   // Limpiar selección
//   const limpiarSeleccion = () => {
//     onBoletosSeleccionados([])
//   }

//   if (loadingBoletos || loading) {
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
//           <div className="text-sm text-yellow-600 mb-4">
//             <p>Rifa ID: {rifaId}</p>
//             <p>Agencia ID: {agenciaId}</p>
//           </div>
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
//       {/* Header con información y controles */}
//       <Card className="bg-blue-50 border-blue-200">
//         <CardContent className="pt-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             {/* Información principal */}
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

//             {/* Controles */}
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

//       {/* Contador de selección */}
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
            
//             {/* Barra de progreso visual */}
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

//       {/* Grid de boletos */}
//       {/* <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-96 overflow-y-auto p-4 border border-gray-200 rounded-lg">
//         {boletosReservados.map((boleto) => {
//           const isSelected = boletosSeleccionados.includes(boleto.id)
//           const canSelect = isSelected || boletosSeleccionados.length < cantidadRequerida

//           return (
//             <button
//               key={boleto.id}
//               onClick={() => canSelect && toggleBoleto(boleto.id)}
//               disabled={!canSelect}
//               className={`
//                 p-2 text-sm font-mono border-2 rounded-lg transition-all duration-200 
//                 ${isSelected
//                   ? 'border-green-500 bg-green-100 text-green-800 shadow-md'
//                   : canSelect
//                     ? 'border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-400 hover:bg-blue-100'
//                     : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
//                 }
//               `}
//               title={`Boleto ${boleto.numero} - ${isSelected ? 'Seleccionado' : 'Disponible'}`}
//             >
//               {boleto.numero}
//             </button>
//           )
//         })}
//       </div> */}
//     </div>
//   )
// }

// export default SelectorBoletosReservados


// import React, { useState, useEffect } from 'react'
// import { useBoletoStore } from '@/stores/useBoletoStore'
// import { useAuthStore } from '@/stores/authStore'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { RefreshCw, Package, Target, Zap, RotateCcw, CheckCircle } from 'lucide-react'

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
//   const { 
//     loading, 
//     error, 
//     fetchBoletosRifa, 
//     getBoletosReservados,
//     invalidarCacheRifa 
//   } = useBoletoStore()

//   const [loadingBoletos, setLoadingBoletos] = useState(false)
//   const [localRefreshKey, setLocalRefreshKey] = useState(0)
//   const [lastRifaId, setLastRifaId] = useState<string>('') // Para trackear cambios

//   // Obtener ID de agencia del usuario autenticado
//   const agenciaId = user?.id 

//   // Obtener boletos reservados para esta agencia en esta rifa y mezclarlos aleatoriamente
//   const boletosReservadosRaw = getBoletosReservados(rifaId).filter(
//     boleto => boleto.reservado_para_agencia === agenciaId
//   )
  
//   // Función para mezclar array usando Fisher-Yates
//   const mezclarArray = (array: any[]) => {
//     const arr = [...array]
//     for (let i = arr.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [arr[i], arr[j]] = [arr[j], arr[i]]
//     }
//     return arr
//   }
  
//   // Aplicar mezclado aleatorio a los boletos
//   const boletosReservados = mezclarArray(boletosReservadosRaw)

//   // Función para cargar boletos con opción de forzar
//   const cargarBoletos = async (forzar: boolean = false) => {
//     if (!rifaId) return
    
//     setLoadingBoletos(true)
//     try {
//       // Si se fuerza, invalidar caché primero
//       if (forzar) {
//         invalidarCacheRifa(rifaId)
//       }
      
//       await fetchBoletosRifa(rifaId, forzar)
//       console.log(`🔄 Boletos ${forzar ? 'forzado a recargar' : 'cargados'} para rifa ${rifaId}`)
//     } catch (error) {
//       console.error('Error cargando boletos:', error)
//     } finally {
//       setLoadingBoletos(false)
//     }
//   }

//   // Función para actualizar solo este componente
//   const actualizarBoletos = () => {
//     onBoletosSeleccionados([]) // Limpiar selección
//     setLocalRefreshKey(prev => prev + 1)
//   }

//   // ✅ CORREGIDO: Cargar boletos solo cuando cambie rifaId
//   useEffect(() => {
//     if (rifaId && rifaId !== lastRifaId) {
//       setLastRifaId(rifaId)
//       cargarBoletos(false) // Carga normal con cache
//     }
//   }, [rifaId]) // Solo rifaId como dependencia

//   // ✅ SEPARADO: Efecto para refresh desde el padre
//   useEffect(() => {
//     if (refreshKey > 0 && rifaId) {
//       cargarBoletos(true) // Fuerza recarga
//     }
//   }, [refreshKey]) // Solo refreshKey

//   // ✅ SEPARADO: Efecto para refresh local
//   useEffect(() => {
//     if (localRefreshKey > 0 && rifaId) {
//       cargarBoletos(true) // Fuerza recarga local
//     }
//   }, [localRefreshKey]) // Solo localRefreshKey

//   // Seleccionar automáticamente los primeros N boletos
//   const seleccionarAutomatica = () => {
//     const primerosBoletos = boletosReservados
//       .slice(0, cantidadRequerida)
//       .map(boleto => boleto.id)
    
//     onBoletosSeleccionados(primerosBoletos)
//   }

//   // Limpiar selección
//   const limpiarSeleccion = () => {
//     onBoletosSeleccionados([])
//   }

//   if (loadingBoletos || loading) {
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
//           <div className="text-sm text-yellow-600 mb-4">
//             <p>Rifa ID: {rifaId}</p>
//             <p>Agencia ID: {agenciaId}</p>
//           </div>
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
//       {/* Header con información y controles */}
//       <Card className="bg-blue-50 border-blue-200">
//         <CardContent className="pt-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             {/* Información principal */}
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

//             {/* Controles */}
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

//       {/* Contador de selección */}
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
            
//             {/* Barra de progreso visual */}
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
      //TODO: LIMITE DE BOLETOS A TRAER
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

            <div className="flex items-center gap-2">
              <Button
                onClick={seleccionarAutomatica}
                disabled={boletosSeleccionados.length === cantidadRequerida}
                variant="default"
                size="sm"
              >
                <Zap className="h-4 w-4 mr-1" />
                Auto-seleccionar
              </Button>
              <Button
                onClick={limpiarSeleccion}
                disabled={boletosSeleccionados.length === 0}
                variant="secondary"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
              <Button
                onClick={actualizarBoletos}
                disabled={loadingBoletos}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 ${loadingBoletos ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Progreso de selección:</span>
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
            
            <div className="flex-1 max-w-32 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(boletosSeleccionados.length / cantidadRequerida) * 100}%` }}
                />
              </div>
            </div>
            
            <span className="text-xs text-gray-500">
              {Math.round((boletosSeleccionados.length / cantidadRequerida) * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SelectorBoletosReservados