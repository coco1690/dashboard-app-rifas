import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, FileText } from 'lucide-react'

interface MetodoPagoSelectorProps {
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta'
  estadoPago: 'pendiente' | 'pagado'
  onMetodoChange: (metodo: 'efectivo' | 'transferencia' | 'tarjeta') => void
  onEstadoChange: (estado: 'pendiente' | 'pagado') => void
}

export const MetodoPagoSelector: React.FC<MetodoPagoSelectorProps> = ({
  metodoPago,
  estadoPago,
  onMetodoChange,
  onEstadoChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="metodo-pago" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Método de Pago
        </Label>
        <Select value={metodoPago} onValueChange={onMetodoChange}>
          <SelectTrigger id="metodo-pago">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="efectivo">Efectivo</SelectItem>
            <SelectItem value="transferencia">Transferencia</SelectItem>
            <SelectItem value="tarjeta">Tarjeta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado-pago" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Estado de Pago
        </Label>
        <Select value={estadoPago} onValueChange={onEstadoChange}>
          <SelectTrigger id="estado-pago">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="pagado">Pagado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}