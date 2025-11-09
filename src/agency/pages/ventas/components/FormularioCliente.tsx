import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/PhoneInput' // ← Importar
import { User, MessageCircle } from 'lucide-react'
import type { Country } from '@/lib/countries' // ← Importar tipo

interface FormularioClienteProps {
  tipoVenta: 'email' | 'whatsapp'
  cedula?: string
  enviarEmail?: boolean
  onCedulaChange?: (value: string) => void
  onEnviarEmailChange?: (value: boolean) => void
  documento?: string
  nombreCliente?: string
  whatsapp?: string
  onWhatsAppChange?: (fullNumber: string, country: Country) => void // ← Actualizado
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

  return (
    <div className="space-y-4 border-2 p-4 rounded-lg border-green-300 bg-white/50 text-green-700">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-green-900">Datos del Cliente (WhatsApp)</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="documento">Documento de Identidad *</Label>
        <Input
          id="documento"
          type="text"
          value={documento}
          onChange={(e) => onDocumentoChange?.(e.target.value)}
          placeholder="documeto del cliente"
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
          placeholder="nombre completo del cliente"
          required
        />
      </div>

      {/* ✅ PhoneInput personalizado */}
      <PhoneInput
        value={whatsapp || ''}
        onChange={(fullNumber, country) => onWhatsAppChange?.(fullNumber, country)}
        label="Número de WhatsApp"
        placeholder="Ingrese número"
        required
        showWhatsAppBadge
        defaultCountryCode="ec"
      />
    </div>
  )
}