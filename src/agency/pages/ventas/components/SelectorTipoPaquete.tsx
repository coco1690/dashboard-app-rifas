import React from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface SelectorTipoPaqueteProps {
  tipoSeleccion: 'paquete' | 'personalizado'
  minimoPersonalizado: number
  onChange: (tipo: 'paquete' | 'personalizado') => void
}

export const SelectorTipoPaquete: React.FC<SelectorTipoPaqueteProps> = ({
  tipoSeleccion,
  minimoPersonalizado,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Tipo de Paquete</Label>
      <RadioGroup value={tipoSeleccion} onValueChange={onChange} className="flex gap-6">
        
        {/* <div className="flex items-center space-x-2">
          <RadioGroupItem value="paquete" id="paquete" />
          <Label htmlFor="paquete">Paquetes Predefinidos</Label>
        </div> */}
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="personalizado" id="personalizado" />
          <Label htmlFor="personalizado">
            Paquete Personalizado (min. {minimoPersonalizado})
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}