import { useState } from 'react'
import type { ReservaAdmin } from '@/stores/useAdminReservasStore'
import { useAdminReservasStore } from '@/stores/useAdminReservasStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trash2, 
  Eye, 
  Clock, 
  Loader2 
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
} from '@/components/ui/alert-dialog'
import DetalleReserva from './Detallereserva'


interface TablaReservasProps {
  reservas: ReservaAdmin[]
  loading: boolean
  tipo: 'activas' | 'expiradas' | 'todas'
}

export default function TablaReservas({ reservas, loading, tipo }: TablaReservasProps) {
  const { liberarReserva } = useAdminReservasStore()
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaAdmin | null>(null)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [reservaALiberar, setReservaALiberar] = useState<ReservaAdmin | null>(null)
  const [liberando, setLiberando] = useState<string | null>(null)

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto)
  }

  const obtenerBadgeEstado = (reserva: ReservaAdmin) => {
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

  const obtenerTiempoRestante = (reserva: ReservaAdmin) => {
    if (reserva.esta_expirada) {
      return <span className="text-red-600 text-sm font-medium">Expirada</span>
    }

    const minutos = reserva.tiempo_restante_minutos

    if (minutos > 5) {
      return <span className="text-green-600 text-sm font-medium">{minutos} min</span>
    } else if (minutos > 2) {
      return <span className="text-amber-600 text-sm font-medium">{minutos} min</span>
    } else {
      return <span className="text-red-600 text-sm font-medium animate-pulse">{minutos} min</span>
    }
  }

  const handleVerDetalle = (reserva: ReservaAdmin) => {
    setReservaSeleccionada(reserva)
    setMostrarDetalle(true)
  }

  const handleSolicitarLiberar = (reserva: ReservaAdmin) => {
    setReservaALiberar(reserva)
    setMostrarConfirmacion(true)
  }

  const handleConfirmarLiberar = async () => {
    if (!reservaALiberar) return

    setLiberando(reservaALiberar.id)
    setMostrarConfirmacion(false)

    await liberarReserva(reservaALiberar.id)

    setLiberando(null)
    setReservaALiberar(null)
  }

  if (loading && reservas.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (reservas.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay reservas {tipo !== 'todas' ? tipo : ''} en este momento
      </div>
    )
  }

  return (
    <>
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rifa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Boletos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Expira</TableHead>
              <TableHead>Tiempo</TableHead>
              <TableHead>Creada</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow key={reserva.id}>
                {/* Rifa */}
                <TableCell>
                  <div>
                    <p className="font-medium">{reserva.rifa_titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {reserva.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  {obtenerBadgeEstado(reserva)}
                </TableCell>

                {/* Boletos */}
                <TableCell>
                  <span className="font-medium">{reserva.cantidad}</span>
                </TableCell>

                {/* Total */}
                <TableCell>
                  <span className="font-medium">
                    {formatearMoneda(reserva.total)}
                  </span>
                </TableCell>

                {/* Expira */}
                <TableCell>
                  <span className="text-sm">
                    {formatearFecha(reserva.expira_en)}
                  </span>
                </TableCell>

                {/* Tiempo restante */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {obtenerTiempoRestante(reserva)}
                  </div>
                </TableCell>

                {/* Creada */}
                <TableCell>
                  <span className="text-sm">
                    {formatearFecha(reserva.created_at)}
                  </span>
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerDetalle(reserva)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {/* Solo mostrar botón de liberar si está activa o expirada */}
                    {(reserva.estado === 'activa' || reserva.estado === 'expirada') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSolicitarLiberar(reserva)}
                        disabled={liberando === reserva.id}
                      >
                        {liberando === reserva.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-600" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="md:hidden space-y-3">
        {reservas.map((reserva) => (
          <div key={reserva.id} className="border rounded-lg p-4 space-y-3 bg-card">
            {/* Header con título y estado */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{reserva.rifa_titulo}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {reserva.id.slice(0, 8)}...
                </p>
              </div>
              {obtenerBadgeEstado(reserva)}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Boletos</p>
                <p className="font-semibold">{reserva.cantidad}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total</p>
                <p className="font-semibold">{formatearMoneda(reserva.total)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Tiempo</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {obtenerTiempoRestante(reserva)}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Creada</p>
                <p className="text-xs">{formatearFecha(reserva.created_at)}</p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVerDetalle(reserva)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalle
              </Button>

              {(reserva.estado === 'activa' || reserva.estado === 'expirada') && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleSolicitarLiberar(reserva)}
                  disabled={liberando === reserva.id}
                  className="flex-1"
                >
                  {liberando === reserva.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Liberar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog de detalle */}
      {reservaSeleccionada && (
        <DetalleReserva
          reserva={reservaSeleccionada}
          open={mostrarDetalle}
          onClose={() => {
            setMostrarDetalle(false)
            setReservaSeleccionada(null)
          }}
        />
      )}

      {/* Confirmación de liberación */}
      <AlertDialog open={mostrarConfirmacion} onOpenChange={setMostrarConfirmacion}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Liberar esta reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de liberar la reserva de <strong>{reservaALiberar?.cantidad}</strong> boletos
              para la rifa <strong>{reservaALiberar?.rifa_titulo}</strong>.
              <br /><br />
              Esta acción liberará todos los boletos reservados y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarLiberar}
              className="bg-red-600 hover:bg-red-700"
            >
              Sí, liberar reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}