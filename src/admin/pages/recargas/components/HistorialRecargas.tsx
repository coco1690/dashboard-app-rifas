// import { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
// import { useRecargaStore } from '@/stores/useRecargaStore'
// import { CheckCircle, RefreshCw, ChevronDown, ChevronRight, Ticket, Trash2 } from 'lucide-react'

// export const HistorialRecargas = () => {
//   const { recargas, fetchRecargas, loading, fetchBoletosDeRecarga, deleteAllRecargas } = useRecargaStore()
//   const [expandedRecargas, setExpandedRecargas] = useState<Set<string>>(new Set())
//   const [loadingBoletos, setLoadingBoletos] = useState<Set<string>>(new Set())
//   const [boletosData, setBoletosData] = useState<Record<string, any[]>>({})

//   const handleRefresh = async () => {
//     try {
//       await fetchRecargas()
//     } catch (error) {
//       console.error('Error al refrescar recargas:', error)
//     }
//   }

//    const handleClearHistory = async () => {
//     const confirmacion = confirm(
//       '⚠️ ¿Estás seguro de que quieres eliminar las recargas que NO tienen boletos asociados?\n\n' +
//       'Esta acción eliminará solo las recargas vacías (sin números de boletos).\n' +
//       'Las recargas con boletos se mantendrán intactas.\n\n' +
//       '¿Continuar?'
//     )

//     if (!confirmacion) return

//     try {
//       // Limpiar estado local de las recargas que se van a eliminar
//       setBoletosData({})
//       setExpandedRecargas(new Set())
//       setLoadingBoletos(new Set())

//       // Eliminar de la base de datos solo las que no tienen boletos
//       await deleteAllRecargas()

//       alert('✅ Se eliminaron las recargas sin boletos exitosamente')
//     } catch (error) {
//       console.error('Error al eliminar recargas:', error)
//       alert('❌ Error al eliminar recargas. Revisa la consola para más detalles.')
//     }
//   }

//   const toggleRecarga = async (recargaId: string) => {
//     const newExpanded = new Set(expandedRecargas)

//     if (expandedRecargas.has(recargaId)) {
//       // Contraer
//       newExpanded.delete(recargaId)
//     } else {
//       // Expandir y cargar boletos si no están cargados
//       newExpanded.add(recargaId)

//       if (!boletosData[recargaId]) {
//         setLoadingBoletos(prev => new Set(prev).add(recargaId))

//         try {
//           const boletos = await fetchBoletosDeRecarga(recargaId)
//           setBoletosData(prev => ({
//             ...prev,
//             [recargaId]: boletos
//           }))
//         } catch (error) {
//           console.error('Error al cargar boletos:', error)
//         } finally {
//           setLoadingBoletos(prev => {
//             const newSet = new Set(prev)
//             newSet.delete(recargaId)
//             return newSet
//           })
//         }
//       }
//     }

//     setExpandedRecargas(newExpanded)
//   }

//   const formatearNumerosBoletos = (boletos: any[]) => {
//     if (!boletos || boletos.length === 0) return []

//     // Extraer los números con verificación más robusta
//     const numeros = boletos
//       .map((item: any) => {
//         // Verificar diferentes posibles estructuras de datos
//         if (item?.boletos?.numero) return item.boletos.numero
//         if (item?.numero) return item.numero
//         return null
//       })
//       .filter((n: any) => n !== undefined && n !== null && typeof n === 'string')

//     if (numeros.length === 0) return []

//     // Agrupar números consecutivos
//     const grupos: string[] = []
//     let inicio = numeros[0]
//     let anterior = numeros[0]

//     for (let i = 1; i < numeros.length; i++) {
//       const actual = numeros[i]

//       if (actual === anterior + 1) {
//         // Continúa la secuencia
//         anterior = actual
//       } else {
//         // Termina la secuencia
//         if (inicio === anterior) {
//           grupos.push(inicio.toString())
//         } else {
//           grupos.push(`${inicio}-${anterior}`)
//         }
//         inicio = actual
//         anterior = actual
//       }
//     }

//     // Agregar el último grupo
//     if (inicio === anterior) {
//       grupos.push(inicio.toString())
//     } else {
//       grupos.push(`${inicio}-${anterior}`)
//     }

//     return grupos
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2">
//             <CheckCircle className="h-5 w-5" />
//             Historial de Recargas
//           </CardTitle>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={handleClearHistory}
//               disabled={loading || recargas.length === 0}
//               className="flex items-center gap-2"
//             >
//               <Trash2 className="h-4 w-4" />
//               Limpiar
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleRefresh}
//               disabled={loading}
//               className="flex items-center gap-2"
//             >
//               <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//               Actualizar
//             </Button>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {recargas.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             No hay recargas registradas
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {recargas.slice(0, 10).map((recarga) => (
//               <Collapsible key={recarga.id}>
//                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                   {/* Header de la recarga */}
//                   <CollapsibleTrigger asChild>
//                     <div
//                       className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
//                       onClick={() => toggleRecarga(recarga.id)}
//                     >
//                       <div className="flex items-center gap-3">
//                         {expandedRecargas.has(recarga.id) ? (
//                           <ChevronDown className="h-4 w-4 text-gray-500" />
//                         ) : (
//                           <ChevronRight className="h-4 w-4 text-gray-500" />
//                         )}
//                         <div className="flex-1">
//                           <div className="font-medium">
//                             {recarga.agencia?.nombre || 'Agencia desconocida'}
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             Recargado por: {recarga.admin?.nombre || 'Admin desconocido'}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <div className="text-center">
//                           <div className="font-bold text-blue-600">{recarga.cantidad}</div>
//                           <div className="text-xs text-gray-500">boletos</div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-sm text-gray-600">
//                             {new Date(recarga.fecha).toLocaleDateString()}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {new Date(recarga.fecha).toLocaleTimeString()}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CollapsibleTrigger>

//                   {/* Contenido expandible con los boletos */}
//                   <CollapsibleContent>
//                     <div className="p-4 bg-white border-t border-gray-200">
//                       {loadingBoletos.has(recarga.id) ? (
//                         <div className="flex items-center justify-center py-4">
//                           <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                           <span className="text-sm text-gray-600">Cargando boletos...</span>
//                         </div>
//                       ) : boletosData[recarga.id] ? (
//                         <div>
//                           <div className="flex items-center gap-2 mb-3">
//                             <Ticket className="h-4 w-4 text-blue-600" />
//                             <span className="font-medium text-sm">
//                               Números de boletos recargados ({boletosData[recarga.id].length})
//                             </span>
//                           </div>
//                           <div className="flex flex-wrap gap-2">
//                             {formatearNumerosBoletos(boletosData[recarga.id]).map((grupo, index) => (
//                               <Badge
//                                 key={index}
//                                 variant="outline"
//                                 className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200"
//                               >
//                                 {grupo}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-center py-4 text-gray-500 text-sm">
//                           No se pudieron cargar los boletos
//                         </div>
//                       )}
//                     </div>
//                   </CollapsibleContent>
//                 </div>
//               </Collapsible>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// HistorialRecargas.tsx

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useRecargaStore } from '@/stores/useRecargaStore'
import {
  CheckCircle,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Ticket,
  Trash2,
  X // <-- Nuevo ícono para eliminar individual
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export const HistorialRecargas = () => {
  const {
    recargas,
    fetchRecargas,
    loading,
    fetchBoletosDeRecarga,
    deleteAllRecargas,
    deleteRecarga // <-- Nueva función
  } = useRecargaStore()

  const [expandedRecargas, setExpandedRecargas] = useState<Set<string>>(new Set())
  const [loadingBoletos, setLoadingBoletos] = useState<Set<string>>(new Set())
  const [boletosData, setBoletosData] = useState<Record<string, any[]>>({})
  const [deletingRecarga, setDeletingRecarga] = useState<string | null>(null)
  const [recargaToDelete, setRecargaToDelete] = useState<string | null>(null)

  const handleRefresh = async () => {
    try {
      await fetchRecargas()
    } catch (error) {
      console.error('Error al refrescar recargas:', error)
    }
  }

  const handleClearHistory = async () => {
    const confirmacion = confirm(
      '⚠️ ¿Estás seguro de que quieres eliminar las recargas que NO tienen boletos asociados?\n\n' +
      'Esta acción eliminará solo las recargas vacías (sin números de boletos).\n' +
      'Las recargas con boletos se mantendrán intactas.\n\n' +
      '¿Continuar?'
    )

    if (!confirmacion) return

    try {
      setBoletosData({})
      setExpandedRecargas(new Set())
      setLoadingBoletos(new Set())

      await deleteAllRecargas()

      alert('✅ Se eliminaron las recargas sin boletos exitosamente')
    } catch (error) {
      console.error('Error al eliminar recargas:', error)
      alert('❌ Error al eliminar recargas. Revisa la consola para más detalles.')
    }
  }

  // 🆕 Nueva función para eliminar recarga individual
  const handleDeleteRecarga = async (recargaId: string) => {
    try {
      setDeletingRecarga(recargaId)

      // Eliminar del store
      await deleteRecarga(recargaId)

      // Limpiar estado local relacionado
      setBoletosData(prev => {
        const newData = { ...prev }
        delete newData[recargaId]
        return newData
      })

      setExpandedRecargas(prev => {
        const newSet = new Set(prev)
        newSet.delete(recargaId)
        return newSet
      })

      // Cerrar el diálogo
      setRecargaToDelete(null)

    } catch (error) {
      console.error('Error al eliminar recarga:', error)
      alert('❌ Error al eliminar la recarga. Revisa la consola para más detalles.')
    } finally {
      setDeletingRecarga(null)
    }
  }

  const toggleRecarga = async (recargaId: string) => {
    const newExpanded = new Set(expandedRecargas)

    if (expandedRecargas.has(recargaId)) {
      newExpanded.delete(recargaId)
    } else {
      newExpanded.add(recargaId)

      if (!boletosData[recargaId]) {
        setLoadingBoletos(prev => new Set(prev).add(recargaId))

        try {
          const boletos = await fetchBoletosDeRecarga(recargaId)
          setBoletosData(prev => ({
            ...prev,
            [recargaId]: boletos
          }))
        } catch (error) {
          console.error('Error al cargar boletos:', error)
        } finally {
          setLoadingBoletos(prev => {
            const newSet = new Set(prev)
            newSet.delete(recargaId)
            return newSet
          })
        }
      }
    }

    setExpandedRecargas(newExpanded)
  }

  const formatearNumerosBoletos = (boletos: any[]) => {
    if (!boletos || boletos.length === 0) return []

    // Extraer números manteniendo el formato string original
    const numeros = boletos
      .map((item: any) => {
        if (item?.boletos?.numero) return item.boletos.numero
        if (item?.numero) return item.numero
        return null
      })
      .filter((n): n is string => typeof n === 'string' && n.length > 0)
      

    if (numeros.length === 0) return []

    const grupos: string[] = []
    let inicioIdx = 0

    for (let i = 0; i < numeros.length; i++) {
      const esUltimo = i === numeros.length - 1
      const actualNum = parseInt(numeros[i])
      const siguienteNum = esUltimo ? null : parseInt(numeros[i + 1])

      // Si no es consecutivo o es el último
      if (esUltimo || siguienteNum !== actualNum + 1) {
        if (inicioIdx === i) {
          // Un solo número
          grupos.push(numeros[i])
        } else {
          // Rango de números
          grupos.push(`${numeros[inicioIdx]}-${numeros[i]}`)
        }
        inicioIdx = i + 1
      }
    }

    return grupos
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Historial de Recargas
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearHistory}
                disabled={loading || recargas.length === 0}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar vacías
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recargas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay recargas registradas
            </div>
          ) : (
            <div className="space-y-3">
              {recargas.slice(0, 10).map((recarga) => (
                <Collapsible key={recarga.id}>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <div
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div
                          className="flex items-center gap-3 flex-1"
                          onClick={() => toggleRecarga(recarga.id)}
                        >
                          {expandedRecargas.has(recarga.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">
                              {recarga.agencia?.nombre || 'Agencia desconocida'}
                            </div>
                            <div className="text-sm text-gray-600">
                              Recargado por: {recarga.admin?.nombre || 'Admin desconocido'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold text-blue-600">{recarga.cantidad}</div>
                            <div className="text-xs text-gray-500">boletos</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {new Date(recarga.fecha).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(recarga.fecha).toLocaleTimeString()}
                            </div>
                          </div>
                          {/* 🆕 Botón de eliminar individual */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setRecargaToDelete(recarga.id)
                            }}
                            disabled={deletingRecarga === recarga.id}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            {deletingRecarga === recarga.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="p-4 bg-white border-t border-gray-200">
                        {loadingBoletos.has(recarga.id) ? (
                          <div className="flex items-center justify-center py-4">
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm text-gray-600">Cargando boletos...</span>
                          </div>
                        ) : boletosData[recarga.id] ? (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Ticket className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-sm">
                                Números de boletos recargados ({boletosData[recarga.id].length})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {formatearNumerosBoletos(boletosData[recarga.id]).map((grupo, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {grupo}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No se pudieron cargar los boletos
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🆕 Diálogo de confirmación */}
      <AlertDialog open={!!recargaToDelete} onOpenChange={() => setRecargaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta recarga?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la recarga y <strong>liberará todos los boletos</strong> asociados,
              dejándolos disponibles nuevamente.
              <br /><br />
              Los boletos volverán a estar <strong>disponibles</strong> para ser recargados
              o vendidos.
              <br /><br />
              ¿Estás seguro de continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => recargaToDelete && handleDeleteRecarga(recargaToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}