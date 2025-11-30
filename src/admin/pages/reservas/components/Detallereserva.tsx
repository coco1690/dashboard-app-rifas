import type { ReservaAdmin } from '@/stores/useAdminReservasStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Calendar, 
  Clock, 
  Ticket, 
  DollarSign, 
  Hash,
  User,
  Shield
} from 'lucide-react'

interface DetalleReservaProps {
  reserva: ReservaAdmin
  open: boolean
  onClose: () => void
}

export default function DetalleReserva({ reserva, open, onClose }: DetalleReservaProps) {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto)
  }

  const obtenerEstadoBadge = () => {
    if (reserva.esta_expirada) {
      return <Badge variant="destructive">Expirada</Badge>
    }

    switch (reserva.estado) {
      case 'activa':
        return <Badge variant="default" className="bg-green-600">Activa</Badge>
      case 'completada':
      case 'pagada':
        return <Badge variant="default" className="bg-blue-600">Completada</Badge>
      case 'cancelada':
        return <Badge variant="secondary">Cancelada</Badge>
      case 'expirada':
        return <Badge variant="destructive">Expirada</Badge>
      default:
        return <Badge variant="outline">{reserva.estado}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">Detalle de Reserva</DialogTitle>
              <DialogDescription className="mt-2">
                Información completa de la reserva y boletos
              </DialogDescription>
            </div>
            {obtenerEstadoBadge()}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Información de la Rifa */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Información de la Rifa</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {reserva.rifa_imagen && (
                    <img 
                      src={reserva.rifa_imagen} 
                      alt={reserva.rifa_titulo}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="font-medium text-lg">{reserva.rifa_titulo}</p>
                    {reserva.rifa_subtitulo && (
                      <p className="text-sm text-muted-foreground">{reserva.rifa_subtitulo}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Información de la Reserva */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Información de la Reserva</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">ID de Reserva</p>
                    <p className="font-mono text-sm">{reserva.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Session ID</p>
                    <p className="font-mono text-sm">{reserva.session_id.slice(0, 20)}...</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Token</p>
                    <p className="font-mono text-sm">{reserva.token.slice(0, 20)}...</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cantidad de Boletos</p>
                    <p className="font-semibold text-lg">{reserva.cantidad}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Precio Unitario</p>
                    <p className="font-semibold">{formatearMoneda(reserva.precio_unitario)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold text-lg">{formatearMoneda(reserva.total)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Creada</p>
                    <p className="text-sm">{formatearFecha(reserva.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expira</p>
                    <p className="text-sm">{formatearFecha(reserva.expira_en)}</p>
                  </div>
                </div>

                {reserva.estado === 'activa' && !reserva.esta_expirada && (
                  <div className="flex items-center gap-3 col-span-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tiempo Restante</p>
                      <p className="font-semibold text-green-600">
                        {reserva.tiempo_restante_minutos} minutos
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Boletos Reservados */}
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Boletos Reservados ({reserva.boletos?.length || 0})
              </h3>
              
              {reserva.boletos && reserva.boletos.length > 0 ? (
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {reserva.boletos.map((boleto) => (
                    <div
                      key={boleto.id}
                      className="flex items-center justify-center p-2 border rounded-lg bg-muted/50 font-mono text-sm"
                    >
                      {boleto.numero}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No hay boletos asociados</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}