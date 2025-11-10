// import { Label } from '@/components/ui/label'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Mail, MessageCircle, MessageSquare } from 'lucide-react'

// interface TipoVentaSelectorProps {
//   tipoVenta: 'email' | 'whatsapp' | 'sms'  // ← Agregar SMS
//   onChange: (tipo: 'email' | 'whatsapp' | 'sms') => void
// }

// export const TipoVentaSelector: React.FC<TipoVentaSelectorProps> = ({
//   tipoVenta,
//   onChange
// }) => {
//   return (
//     <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
//       <Label className="text-base font-medium flex items-center gap-2">
//         📬 Tipo de Notificación
//       </Label>
      
//       <RadioGroup 
//         value={tipoVenta} 
//         onValueChange={onChange}
//         className="grid grid-cols-1 sm:grid-cols-3 gap-3"
//       >
//         {/* Email */}
//         <label
//           htmlFor="email"
//           className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
//             tipoVenta === 'email'
//               ? 'border-blue-600 bg-blue-100'
//               : 'border-gray-300 bg-white hover:border-blue-400'
//           }`}
//         >
//           <RadioGroupItem value="email" id="email" />
//           <Mail className={`h-5 w-5 ${tipoVenta === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />
//           <div className="flex-1">
//             <div className="font-medium text-sm">Venta con Email</div>
//             <div className="text-xs text-gray-500">Cliente con Email registrado</div>
//           </div>
//         </label>

//         {/* WhatsApp */}
//         <label
//           htmlFor="whatsapp"
//           className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
//             tipoVenta === 'whatsapp'
//               ? 'border-green-600 bg-green-100'
//               : 'border-gray-300 bg-white hover:border-green-400'
//           }`}
//         >
//           <RadioGroupItem value="whatsapp" id="whatsapp" />
//           <MessageCircle className={`h-5 w-5 ${tipoVenta === 'whatsapp' ? 'text-green-600' : 'text-gray-400'}`} />
//           <div className="flex-1">
//             <div className="font-medium text-sm">Venta con WhatsApp</div>
//             <div className="text-xs text-gray-500">Cliente nuevo/registrado</div>
//           </div>
//         </label>

//         {/* SMS - NUEVO */}
//         <label
//           htmlFor="sms"
//           className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
//             tipoVenta === 'sms'
//               ? 'border-purple-600 bg-purple-100'
//               : 'border-gray-300 bg-white hover:border-purple-400'
//           }`}
//         >
//           <RadioGroupItem value="sms" id="sms" />
//           <MessageSquare className={`h-5 w-5 ${tipoVenta === 'sms' ? 'text-purple-600' : 'text-gray-400'}`} />
//           <div className="flex-1">
//             <div className="font-medium text-sm">Venta con SMS</div>
//             <div className="text-xs text-gray-500">Mensaje de texto</div>
//           </div>
//         </label>
//       </RadioGroup>
//     </div>
//   )
// }

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Mail, MessageCircle, MessageSquare, Lock } from 'lucide-react'  // ← Agregar Lock

interface TipoVentaSelectorProps {
  tipoVenta: 'email' | 'whatsapp' | 'sms'
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
            <div className="text-xs text-gray-500">Cliente con Email registrado</div>
          </div>
        </label>

        {/* WhatsApp - DESHABILITADO */}
        <div
          className="flex items-center space-x-3 p-4 rounded-lg border-2 bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed relative"
        >
          <RadioGroupItem value="whatsapp" id="whatsapp" disabled className="cursor-not-allowed" />
          <MessageCircle className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <div className="font-medium text-sm text-gray-600 flex items-center gap-2">
              Venta con WhatsApp
              <Lock className="h-3 w-3" />
            </div>
            <div className="text-xs text-gray-500">No disponible por el momento</div>
          </div>
        </div>

        {/* SMS */}
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