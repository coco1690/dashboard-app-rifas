import { Ticket } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BoletoCardProps {
    numero: string
    fechaVenta: string
    vendido: boolean
}

export const BoletoClientCard = ({ numero, fechaVenta, vendido }: BoletoCardProps) => {
    return (
        <Card className="relative overflow-hidden border-2 hover:shadow-md transition-shadow">
            {/* Decoración de boleto - perforaciones */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-background rounded-full -ml-1.5 border-2 border-border" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-background rounded-full -mr-1.5 border-2 border-border" />
            
            <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                    {/* Icono y número */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                            <Ticket className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground leading-tight">Número</p>
                            <p className="text-xl font-bold leading-tight">{numero}</p>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-muted-foreground mb-0.5 leading-tight">Estado</p>
                        <Badge variant={vendido ? "default" : "secondary"} className="text-[10px] h-5">
                            {vendido ? 'Vendido' : 'Disponible'}
                        </Badge>
                    </div>
                </div>

                {/* Fecha */}
                <div className="pt-2 border-t">
                    <p className="text-[10px] text-muted-foreground leading-tight">
                        Comprado el: {new Date(fechaVenta).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}