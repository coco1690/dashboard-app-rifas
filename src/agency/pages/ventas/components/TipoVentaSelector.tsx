// import React from 'react'
// import { Label } from '@/components/ui/label'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Badge } from '@/components/ui/badge'
// // import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Mail, MessageCircle } from 'lucide-react'

// interface TipoVentaSelectorProps {
//   tipoVenta: 'email' | 'whatsapp'
//   onChange: (tipo: 'email' | 'whatsapp') => void
// }

// export const TipoVentaSelector: React.FC<TipoVentaSelectorProps> = ({
//   tipoVenta,
//   onChange
// }) => {
//   return (
//     <div className="space-y-3 border-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
//       <Label className="text-base font-semibold flex items-center gap-2">
//         <span>Tipo de Notificación</span>
//         <Badge variant="outline" className="bg-white">
//           {tipoVenta === 'email' ? 'Email' : 'WhatsApp'}
//         </Badge>
//       </Label>

//       <RadioGroup value={tipoVenta} onValueChange={onChange} className="flex gap-6">
//         <div className="flex items-center space-x-2">
//           <RadioGroupItem value="email" id="tipo-email" />
//           <Label htmlFor="tipo-email" className="flex items-center gap-2 cursor-pointer">
//             <Mail className="h-4 w-4 text-blue-600" />
//             Venta con Email
//           </Label>
//         </div>

//         <div className="flex items-center space-x-2">
//           <RadioGroupItem value="whatsapp" id="tipo-whatsapp" />
//           <Label htmlFor="tipo-whatsapp" className="flex items-center gap-2 cursor-pointer">
//             <MessageCircle className="h-4 w-4 text-green-600" />
//             Venta con WhatsApp
//           </Label>
//         </div>
//       </RadioGroup>

//       {/* {tipoVenta === 'whatsapp' && (
//         <Alert className="border-green-500 bg-white/50 text-green-700">
//           <CheckCircle2 className="h-4 w-4 text-green-600" />
//           <AlertDescription className="text-green-800 text-sm">
//             <strong> WhatsApp Activo:</strong> El mensaje se enviará automáticamente después de la venta.
//           </AlertDescription>
//         </Alert>
//       )} */}
//     </div>
//   )
// }


import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Mail, MessageCircle, MessageSquare } from 'lucide-react'

interface TipoVentaSelectorProps {
  tipoVenta: 'email' | 'whatsapp' | 'sms'  // ← Agregar SMS
  onChange: (tipo: 'email' | 'whatsapp' | 'sms') => void
}

export const TipoVentaSelector: React.FC<TipoVentaSelectorProps> = ({
  tipoVenta,
  onChange
}) => {
  return (
    <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
      <Label className="text-base font-medium flex items-center gap-2">
        📬 Tipo de Notificación
      </Label>
      
      <RadioGroup 
        value={tipoVenta} 
        onValueChange={onChange}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {/* Email */}
        <label
          htmlFor="email"
          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            tipoVenta === 'email'
              ? 'border-blue-600 bg-blue-100'
              : 'border-gray-300 bg-white hover:border-blue-400'
          }`}
        >
          <RadioGroupItem value="email" id="email" />
          <Mail className={`h-5 w-5 ${tipoVenta === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />
          <div className="flex-1">
            <div className="font-medium text-sm">Venta con Email</div>
            <div className="text-xs text-gray-500">Cliente ya registrado</div>
          </div>
        </label>

        {/* WhatsApp */}
        <label
          htmlFor="whatsapp"
          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            tipoVenta === 'whatsapp'
              ? 'border-green-600 bg-green-100'
              : 'border-gray-300 bg-white hover:border-green-400'
          }`}
        >
          <RadioGroupItem value="whatsapp" id="whatsapp" />
          <MessageCircle className={`h-5 w-5 ${tipoVenta === 'whatsapp' ? 'text-green-600' : 'text-gray-400'}`} />
          <div className="flex-1">
            <div className="font-medium text-sm">Venta con WhatsApp</div>
            <div className="text-xs text-gray-500">Cliente nuevo/registrado</div>
          </div>
        </label>

        {/* SMS - NUEVO */}
        <label
          htmlFor="sms"
          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            tipoVenta === 'sms'
              ? 'border-purple-600 bg-purple-100'
              : 'border-gray-300 bg-white hover:border-purple-400'
          }`}
        >
          <RadioGroupItem value="sms" id="sms" />
          <MessageSquare className={`h-5 w-5 ${tipoVenta === 'sms' ? 'text-purple-600' : 'text-gray-400'}`} />
          <div className="flex-1">
            <div className="font-medium text-sm">Venta con SMS</div>
            <div className="text-xs text-gray-500">Mensaje de texto</div>
          </div>
        </label>
      </RadioGroup>
    </div>
  )
}