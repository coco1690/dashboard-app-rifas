import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, User, Package, Calendar, DollarSign, Trophy, Phone } from 'lucide-react'
import { GanadorBadge } from './GanadorBadge'
import { VentaCard } from './VentaCard'
import type { ClienteAgrupado } from '../types/ClienteAgrupado'

interface ClienteCardProps {
  cliente: ClienteAgrupado
  isOpen: boolean
  onToggle: () => void
}

export const ClienteCard: React.FC<ClienteCardProps> = ({ cliente, isOpen, onToggle }) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardHeader 
            className={`cursor-pointer hover:bg-gray-50 transition-colors p-3 sm:p-4 ${
              cliente.esGanadorPrincipal 
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-l-yellow-500' 
                : cliente.esGanadorSuerte 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500' 
                : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              {/* Información del cliente - Optimizada para móvil */}
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  <div className="relative">
                    <User className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      cliente.esGanadorPrincipal 
                        ? 'text-yellow-600' 
                        : cliente.esGanadorSuerte 
                        ? 'text-green-600' 
                        : 'text-blue-600'
                    }`} />
                    {(cliente.esGanadorPrincipal || cliente.esGanadorSuerte) && (
                      <Trophy className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <h3 className="font-semibold text-sm sm:text-lg truncate">
                      {cliente.cliente_nombre}
                    </h3>
                    <div className="sm:hidden">
                      <GanadorBadge 
                        esGanadorPrincipal={cliente.esGanadorPrincipal}
                        esGanadorSuerte={cliente.esGanadorSuerte}
                        numerosGanadores={cliente.numerosGanadores}
                        compact={true}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-600">
                      C.I: {cliente.cliente_cedula}
                    </p>
                    {cliente.cliente_telefono && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">
                          {cliente.cliente_telefono}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Badges para escritorio */}
                  <div className="hidden sm:block mt-2">
                    <GanadorBadge 
                      esGanadorPrincipal={cliente.esGanadorPrincipal}
                      esGanadorSuerte={cliente.esGanadorSuerte}
                      numerosGanadores={cliente.numerosGanadores}
                    />
                  </div>
                </div>
              </div>

              {/* Estadísticas - Optimizada para móvil */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                {/* Monto total - Siempre visible */}
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="font-bold text-green-600 text-sm sm:text-base">
                    ${cliente.totalMonto.toLocaleString()}
                  </span>
                </div>
                
                {/* Estadísticas resumidas para móvil */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    <span>{cliente.totalVentas}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{cliente.totalBoletos}</span>
                  </div>
                </div>
                
                {/* Estadísticas detalladas para escritorio */}
                <div className="hidden sm:flex sm:flex-col sm:items-end sm:gap-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>{cliente.totalVentas} ventas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{cliente.totalBoletos} boletos</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-3 sm:px-6">
            <div className="space-y-3"> 
              {cliente.ventas.map((venta) => (
                <VentaCard key={venta.orden_id} venta={venta} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}