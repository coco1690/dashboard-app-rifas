import React from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
// import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, MessageCircle } from 'lucide-react'

interface TipoVentaSelectorProps {
  tipoVenta: 'email' | 'whatsapp'
  onChange: (tipo: 'email' | 'whatsapp') => void
}

export const TipoVentaSelector: React.FC<TipoVentaSelectorProps> = ({
  tipoVenta,
  onChange
}) => {
  return (
    <div className="space-y-3 border-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
      <Label className="text-base font-semibold flex items-center gap-2">
        <span>Tipo de Notificación</span>
        <Badge variant="outline" className="bg-white">
          {tipoVenta === 'email' ? 'Email' : 'WhatsApp'}
        </Badge>
      </Label>

      <RadioGroup value={tipoVenta} onValueChange={onChange} className="flex gap-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="email" id="tipo-email" />
          <Label htmlFor="tipo-email" className="flex items-center gap-2 cursor-pointer">
            <Mail className="h-4 w-4 text-blue-600" />
            Venta con Email
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="whatsapp" id="tipo-whatsapp" />
          <Label htmlFor="tipo-whatsapp" className="flex items-center gap-2 cursor-pointer">
            <MessageCircle className="h-4 w-4 text-green-600" />
            Venta con WhatsApp
          </Label>
        </div>
      </RadioGroup>

      {/* {tipoVenta === 'whatsapp' && (
        <Alert className="border-green-500 bg-white/50 text-green-700">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm">
            <strong> WhatsApp Activo:</strong> El mensaje se enviará automáticamente después de la venta.
          </AlertDescription>
        </Alert>
      )} */}
    </div>
  )
}