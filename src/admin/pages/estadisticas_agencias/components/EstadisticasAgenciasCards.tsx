import { useEffect, useState } from 'react'
import { useStoreEstadisticasAgencias } from '@/stores/useStoreEstadisticasAgencias'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import { CustomPagination } from '@/components/custom/CustomPagination'
import { useSearchParams } from 'react-router'

// Hook para detectar tamaño de pantalla
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

export default function EstadisticasAgenciasCards() {
  const { 
    loading, 
    fetchEstadisticas, 
    getPaginatedEstadisticas,
    setPage,
    setPageSize,
    totalPages,
    totalCount,
    currentPage
  } = useStoreEstadisticasAgencias()

  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})
  const [searchParams, setSearchParams] = useSearchParams()

  // Detectar tamaño de pantalla
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')

  // Calcular pageSize según el tamaño de pantalla
  const pageSize = isMobile ? 3 : isTablet ? 6 : 12

  // Obtener estadísticas paginadas desde el store
  const paginatedEstadisticas = getPaginatedEstadisticas()

  // Actualizar pageSize cuando cambia el tamaño de pantalla
  useEffect(() => {
    setPageSize(pageSize)
  }, [pageSize, setPageSize])

  // Sincronizar página con URL
  useEffect(() => {
    const queryPage = searchParams.get('page') || '1'
    const page = isNaN(+queryPage) ? 1 : +queryPage
    
    if (page !== currentPage) {
      setPage(page)
    }
  }, [searchParams, currentPage, setPage])

  // Cargar datos iniciales
  useEffect(() => {
    fetchEstadisticas()
  }, [])

  // Actualizar URL cuando cambia la página del store
  useEffect(() => {
    const queryPage = searchParams.get('page') || '1'
    if (+queryPage !== currentPage) {
      searchParams.set('page', currentPage.toString())
      setSearchParams(searchParams, { replace: true })
    }
  }, [currentPage])

  const handleRefresh = () => {
    fetchEstadisticas(true)
  }

  const toggleCollapsible = (agenciaId: string) => {
    setOpenStates(prev => ({
      ...prev,
      [agenciaId]: !prev[agenciaId]
    }))
  }

  if (loading && paginatedEstadisticas.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(pageSize)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estadísticas de Agencias</h2>
          <p className="text-muted-foreground text-sm">
            {totalCount} agencia{totalCount !== 1 ? 's' : ''} registrada{totalCount !== 1 ? 's' : ''}
            {totalCount > pageSize && (
              <span className="ml-1">
                • Mostrando {paginatedEstadisticas.length} de {totalCount}
              </span>
            )}
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Cards Grid */}
      {totalCount === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay estadísticas disponibles</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginatedEstadisticas.map((agencia) => (
              <Collapsible
                key={agencia.agencia_id}
                open={openStates[agencia.agencia_id] || false}
                onOpenChange={() => toggleCollapsible(agencia.agencia_id)}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-3 pb-2">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <CardTitle className="text-sm font-semibold line-clamp-1 flex-1">
                              {agencia.agencia_nombre}
                            </CardTitle>
                            {agencia.is_verified ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            )}
                          </div>
                          
                          {agencia.ciudad && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2">
                              <MapPin className="h-2.5 w-2.5" />
                              <span className="truncate">{agencia.ciudad}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-3 text-[11px]">
                            <div>
                              <span className="text-muted-foreground">Vendidos: </span>
                              <span className="font-semibold text-green-600">
                                {agencia.boletos_vendidos}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total: </span>
                              <span className="font-semibold">
                                ${agencia.total_vendido.toLocaleString('es-EC', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0 pt-0.5">
                          {openStates[agencia.agencia_id] ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>

                  <CollapsibleContent>
                    <CardContent className="space-y-3 p-3 pt-0">
                      <div className="space-y-1 text-xs text-muted-foreground pb-2 border-b">
                        {agencia.agencia_telefono && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="truncate">{agencia.agencia_telefono}</span>
                          </div>
                        )}
                        {agencia.agencia_email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{agencia.agencia_email}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Package className="h-3.5 w-3.5" />
                            <span>Recargados</span>
                          </div>
                          <span className="font-semibold">{agencia.boletos_recargados.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Vendidos</span>
                          </div>
                          <span className="font-semibold text-green-600">
                            {agencia.boletos_vendidos.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Package className="h-3.5 w-3.5" />
                            <span>Disponibles</span>
                          </div>
                          <span className="font-semibold text-blue-600">
                            {agencia.boletos_disponibles.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="border-t" />

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>Total Vendido</span>
                          </div>
                          <span className="font-bold text-sm">
                            ${agencia.total_vendido.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>Ganancia ({agencia.comision_porcentaje}%)</span>
                          </div>
                          <span className="font-bold text-sm text-green-600">
                            ${agencia.ganancia_agencia.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {agencia.ultima_venta && (
                        <div className="pt-2 border-t">
                          <p className="text-[10px] text-muted-foreground">
                            Última venta: {new Date(agencia.ultima_venta).toLocaleDateString('es-EC', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-6">
              <CustomPagination totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  )
}