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
  X
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
    deleteRecarga
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

  const handleDeleteRecarga = async (recargaId: string) => {
    try {
      setDeletingRecarga(recargaId)

      await deleteRecarga(recargaId)

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

      if (esUltimo || siguienteNum !== actualNum + 1) {
        if (inicioIdx === i) {
          grupos.push(numeros[i])
        } else {
          grupos.push(`${numeros[inicioIdx]}-${numeros[i]}`)
        }
        inicioIdx = i + 1
      }
    }

    return grupos
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Historial de Recargas</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearHistory}
                disabled={loading || recargas.length === 0}
                className="flex items-center gap-1.5 text-xs sm:text-sm flex-1 sm:flex-initial"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Limpiar vacías</span>
                <span className="xs:hidden">Limpiar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {recargas.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No hay recargas registradas
            </div>
          ) : (
            <div className="space-y-3">
              {recargas.slice(0, 10).map((recarga) => (
                <Collapsible key={recarga.id}>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-start sm:items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                        {/* Chevron - siempre visible */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleRecarga(recarga.id)
                          }}
                          className="mt-0.5 sm:mt-0 flex-shrink-0"
                        >
                          {expandedRecargas.has(recarga.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>

                        {/* Contenido principal */}
                        <div 
                          className="flex-1 min-w-0"
                          onClick={() => toggleRecarga(recarga.id)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            {/* Info de agencia */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm sm:text-base truncate">
                                {recarga.agencia?.nombre || 'Agencia desconocida'}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 truncate">
                                Recargado por: {recarga.admin?.nombre || 'Admin desconocido'}
                              </div>
                            </div>

                            {/* Cantidad y fecha */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                              <div className="flex items-center gap-1.5">
                                <div className="font-bold text-blue-600 text-sm sm:text-base">
                                  {recarga.cantidad}
                                </div>
                                <div className="text-xs text-gray-500">boletos</div>
                              </div>
                              
                              <div className="text-right flex-shrink-0">
                                <div className="text-xs sm:text-sm text-gray-600">
                                  {new Date(recarga.fecha).toLocaleDateString('es', { 
                                    day: '2-digit', 
                                    month: '2-digit',
                                    year: '2-digit'
                                  })}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(recarga.fecha).toLocaleTimeString('es', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Botón eliminar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setRecargaToDelete(recarga.id)
                          }}
                          disabled={deletingRecarga === recarga.id}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                        >
                          {deletingRecarga === recarga.id ? (
                            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          )}
                        </Button>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
                        {loadingBoletos.has(recarga.id) ? (
                          <div className="flex items-center justify-center py-4">
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-xs sm:text-sm text-gray-600">Cargando boletos...</span>
                          </div>
                        ) : boletosData[recarga.id] ? (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Ticket className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <span className="font-medium text-xs sm:text-sm">
                                Números de boletos recargados ({boletosData[recarga.id].length})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {formatearNumerosBoletos(boletosData[recarga.id]).map((grupo, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-[10px] sm:text-xs font-mono bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5"
                                >
                                  {grupo}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-xs sm:text-sm">
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

      {/* Diálogo de confirmación */}
      <AlertDialog open={!!recargaToDelete} onOpenChange={() => setRecargaToDelete(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              ¿Eliminar esta recarga?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Esta acción eliminará la recarga y <strong>liberará todos los boletos</strong> asociados,
              dejándolos disponibles nuevamente.
              <br /><br />
              Los boletos volverán a estar <strong>disponibles</strong> para ser recargados
              o vendidos.
              <br /><br />
              ¿Estás seguro de continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => recargaToDelete && handleDeleteRecarga(recargaToDelete)}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}