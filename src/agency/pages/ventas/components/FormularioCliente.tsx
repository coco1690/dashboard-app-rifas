// import React from 'react'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { PhoneInput } from '@/components/ui/PhoneInput' // ← Importar
// import { User, MessageCircle } from 'lucide-react'
// import type { Country } from '@/lib/countries' // ← Importar tipo

// interface FormularioClienteProps {
//   tipoVenta: 'email' | 'whatsapp' | 'sms'
//   cedula?: string
//   enviarEmail?: boolean
//   onCedulaChange?: (value: string) => void
//   onEnviarEmailChange?: (value: boolean) => void
//   documento?: string
//   nombreCliente?: string
//   whatsapp?: string
//   onWhatsAppChange?: (fullNumber: string, country: Country) => void // ← Actualizado
//   onDocumentoChange?: (value: string) => void
//   onNombreChange?: (value: string) => void
// }

// export const FormularioCliente: React.FC<FormularioClienteProps> = ({
//   tipoVenta,
//   cedula,
//   enviarEmail,
//   onCedulaChange,
//   onEnviarEmailChange,
//   documento,
//   nombreCliente,
//   whatsapp,
//   onDocumentoChange,
//   onNombreChange,
//   onWhatsAppChange
// }) => {
//   if (tipoVenta === 'email') {
//     return (
//       <>
//         <div className="space-y-2">
//           <Label htmlFor="cedula" className="flex items-center gap-2">
//             <User className="h-4 w-4" />
//             Cédula del Cliente
//           </Label>
//           <Input
//             id="cedula"
//             type="text"
//             value={cedula}
//             onChange={(e) => onCedulaChange?.(e.target.value)}
//             placeholder="Ingrese cédula"
//           />
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             id="enviar-email"
//             checked={enviarEmail}
//             onChange={(e) => onEnviarEmailChange?.(e.target.checked)}
//             className="rounded"
//           />
//           <Label htmlFor="enviar-email" className="cursor-pointer">
//             Enviar confirmación por email
//           </Label>
//         </div>
//       </>
//     )
//   }

//   return (
//     <div className="space-y-4 border-2 p-4 rounded-lg border-green-300 bg-white/50 text-green-700">
//       <div className="flex items-center gap-2 mb-2">
//         <MessageCircle className="h-5 w-5 text-green-600" />
//         <h3 className="font-semibold text-green-900">Datos del Cliente (WhatsApp)</h3>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="documento">Documento de Identidad *</Label>
//         <Input
//           id="documento"
//           type="text"
//           value={documento}
//           onChange={(e) => onDocumentoChange?.(e.target.value)}
//           placeholder="documeto del cliente"
//           required
//         />
//         <p className="text-xs text-muted-foreground">
//           Si el cliente no existe, se creará automáticamente
//         </p>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="nombre-cliente">Nombre Completo *</Label>
//         <Input
//           id="nombre-cliente"
//           type="text"
//           value={nombreCliente}
//           onChange={(e) => onNombreChange?.(e.target.value)}
//           placeholder="nombre completo del cliente"
//           required
//         />
//       </div>

//       {/* ✅ PhoneInput personalizado */}
//       <PhoneInput
//         value={whatsapp || ''}
//         onChange={(fullNumber, country) => onWhatsAppChange?.(fullNumber, country)}
//         label="Número de WhatsApp"
//         placeholder="Ingrese número"
//         required
//         showWhatsAppBadge
//         defaultCountryCode="ec"
//       />
//     </div>
//   )
// }

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { User, MessageCircle, MessageSquare } from 'lucide-react'  // ← Agregar MessageSquare
import type { Country } from '@/lib/countries'

interface FormularioClienteProps {
  tipoVenta: 'email' | 'whatsapp' | 'sms'
  cedula?: string
  enviarEmail?: boolean
  onCedulaChange?: (value: string) => void
  onEnviarEmailChange?: (value: boolean) => void
  documento?: string
  nombreCliente?: string
  whatsapp?: string
  onWhatsAppChange?: (fullNumber: string, country: Country) => void
  onDocumentoChange?: (value: string) => void
  onNombreChange?: (value: string) => void
}

export const FormularioCliente: React.FC<FormularioClienteProps> = ({
  tipoVenta,
  cedula,
  enviarEmail,
  onCedulaChange,
  onEnviarEmailChange,
  documento,
  nombreCliente,
  whatsapp,
  onDocumentoChange,
  onNombreChange,
  onWhatsAppChange
}) => {
  // ✅ Formulario para Email
  if (tipoVenta === 'email') {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="cedula" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Cédula del Cliente
          </Label>
          <Input
            id="cedula"
            type="text"
            value={cedula}
            onChange={(e) => onCedulaChange?.(e.target.value)}
            placeholder="Ingrese cédula"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enviar-email"
            checked={enviarEmail}
            onChange={(e) => onEnviarEmailChange?.(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="enviar-email" className="cursor-pointer">
            Enviar confirmación por email
          </Label>
        </div>
      </>
    )
  }

  // ✅ Configuración dinámica para WhatsApp y SMS
  const esWhatsApp = tipoVenta === 'whatsapp'
  

  const config = {
    borderColor: esWhatsApp ? 'border-green-300' : 'border-purple-300',
    bgColor: esWhatsApp ? 'bg-green-50/50' : 'bg-purple-50/50',
    iconColor: esWhatsApp ? 'text-green-600' : 'text-purple-600',
    titleColor: esWhatsApp ? 'text-green-900' : 'text-purple-900',
    textColor: esWhatsApp ? 'text-green-700' : 'text-purple-700',
    icon: esWhatsApp ? MessageCircle : MessageSquare,
    titulo: esWhatsApp ? 'Datos del Cliente (WhatsApp)' : 'Datos del Cliente (SMS)',
    placeholder: esWhatsApp ? 'Número de WhatsApp' : 'Número de Teléfono (SMS)'
  }

  const Icon = config.icon

  // ✅ Formulario para WhatsApp y SMS
  return (
    <div className={`space-y-4 border-2 p-4 rounded-lg ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
        <h3 className={`font-semibold ${config.titleColor}`}>{config.titulo}</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="documento">Documento de Identidad *</Label>
        <Input
          id="documento"
          type="text"
          value={documento}
          onChange={(e) => onDocumentoChange?.(e.target.value)}
          placeholder="Documento del cliente"
          required
        />
        <p className="text-xs text-muted-foreground">
          Si el cliente no existe, se creará automáticamente
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre-cliente">Nombre Completo *</Label>
        <Input
          id="nombre-cliente"
          type="text"
          value={nombreCliente}
          onChange={(e) => onNombreChange?.(e.target.value)}
          placeholder="Nombre completo del cliente"
          required
        />
      </div>

      {/* ✅ PhoneInput con label dinámico */}
      <PhoneInput
        value={whatsapp || ''}
        onChange={(fullNumber, country) => onWhatsAppChange?.(fullNumber, country)}
        label={config.placeholder}
        placeholder="Ingrese número"
        required
        showWhatsAppBadge={esWhatsApp}  // ← Solo mostrar badge de WhatsApp cuando sea WhatsApp
        defaultCountryCode="ec"
      />
    </div>
  )
}