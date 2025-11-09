import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface InputCantidadPersonalizadaProps {
  cantidad: number
  minimo: number
  precioBoleta: number
  cargando: boolean
  onChange: (cantidad: number) => void
  calcularTotal: (cantidad: number, precio: number) => number
}

export const InputCantidadPersonalizada: React.FC<InputCantidadPersonalizadaProps> = ({
  cantidad,
  minimo,
  precioBoleta,
  cargando,
  onChange,
  calcularTotal
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="cantidad-personalizada">
        Cantidad de Boletos (Mínimo {minimo})
      </Label>
      <Input
        id="cantidad-personalizada"
        type="number"
        min={minimo}
        value={cantidad}
        onChange={(e) => onChange(parseInt(e.target.value) || minimo)}
        disabled={cargando}
        placeholder={`Ingrese cantidad (min. ${minimo})`}
      />
      <p className="text-xs text-muted-foreground">
        Total: ${calcularTotal(cantidad, precioBoleta).toLocaleString()}
      </p>
    </div>
  )
}