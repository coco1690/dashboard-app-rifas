import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Calendar, Ticket } from 'lucide-react'
import type { HistorialVenta } from '@/stores/useHistorialVentasStore'


interface OrdenSelectorProps {
    ordenes: HistorialVenta[]
    onSeleccionar: (ordenId: string) => void
}

export const OrdenSelector = ({ ordenes, onSeleccionar }: OrdenSelectorProps) => {
    if (ordenes.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                        No tienes órdenes pagadas
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Compra boletos para ver tus órdenes aquí
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Mis Órdenes</CardTitle>
                    <CardDescription>
                        Selecciona una orden para ver tus boletos
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ordenes.map((orden) => (
                    <Card 
                        key={orden.orden_id} 
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => onSeleccionar(orden.orden_id)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                    <CardTitle className="text-base line-clamp-2">
                                        {orden.rifa_titulo}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Orden: {orden.orden_id.substring(0, 8).toUpperCase()}
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="ml-2">
                                    {orden.estado_pago === 'pagado' ? 'Pagada' : orden.estado_pago}
                                </Badge>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                            {/* Info de la orden */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {new Date(orden.fecha_venta).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Ticket className="w-4 h-4" />
                                <span>{orden.cantidad_boletos} boleto(s)</span>
                            </div>

                            {/* Total */}
                            <div className="pt-3 border-t flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <span className="text-lg font-bold">
                                    ${orden.total_pago.toLocaleString('es-ES', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </span>
                            </div>

                            {/* Botón */}
                            <Button 
                                className="w-full" 
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onSeleccionar(orden.orden_id)
                                }}
                            >
                                Ver mis boletos
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}