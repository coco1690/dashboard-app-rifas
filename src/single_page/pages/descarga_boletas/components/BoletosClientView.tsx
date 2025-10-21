import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Ticket, Award } from 'lucide-react'
import type { HistorialVenta } from '@/stores/useHistorialVentasStore'
import { BoletoClientCard } from './BoletosClientCard'


interface BoletosViewProps {
    venta: HistorialVenta
    onVolver: () => void
}

export const BoletosClientView = ({ venta, onVolver }: BoletosViewProps) => {
    return (
        <div className="space-y-6">
            {/* Header con botón volver */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onVolver}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">Mis Boletos</h2>
                    <p className="text-sm text-muted-foreground">
                        Orden: {venta.orden_id.substring(0, 8).toUpperCase()}
                    </p>
                </div>
            </div>

            {/* Información de la rifa y orden */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                            <CardTitle className="text-xl">{venta.rifa_titulo}</CardTitle>
                            <CardDescription>
                                Detalles de tu compra
                            </CardDescription>
                        </div>
                        <Badge variant="default" className="ml-4">
                            <Award className="w-3 h-3 mr-1" />
                            {venta.estado_pago === 'pagado' ? 'Pagada' : venta.estado_pago}
                        </Badge>
                    </div>
                </CardHeader>
                
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Fecha de compra */}
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fecha de compra</p>
                                <p className="font-medium">
                                    {new Date(venta.fecha_venta).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Cantidad de boletos */}
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Ticket className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Boletos comprados</p>
                                <p className="font-medium text-xl">{venta.cantidad_boletos}</p>
                            </div>
                        </div>

                        {/* Total pagado */}
                        <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Award className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total pagado</p>
                                <p className="font-medium text-xl">
                                    ${venta.total_pago.toLocaleString('es-ES', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grid de boletos */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Tus Números</h3>
                {!venta.numeros_boletos || venta.numeros_boletos.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <Ticket className="w-12 h-12 text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">
                                No se encontraron boletos para esta orden
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {venta.numeros_boletos.map((numero, index) => (
                            <BoletoClientCard
                                key={`${venta.orden_id}-${numero}-${index}`}
                                numero={numero}
                                fechaVenta={venta.fecha_venta}
                                vendido={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}