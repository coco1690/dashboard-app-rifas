// src/pages/carrito/components/DatosFacturacion.tsx

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { DatosCliente } from '../types/carrito'
import { PROVINCIAS_ECUADOR, TIPOS_DOCUMENTO } from '../types/carrito'
import { PhoneInput } from '@/components/ui/PhoneInput'

interface DatosFacturacionProps {
  datos: DatosCliente
  onChange: (datos: DatosCliente) => void
  errores?: Partial<Record<keyof DatosCliente, string>>
}

export const DatosFacturacion = ({
  datos,
  onChange,
  errores = {}
}: DatosFacturacionProps) => {
  const [emailMatch, setEmailMatch] = useState(true)

  const handleChange = (field: keyof DatosCliente, value: string) => {
    onChange({
      ...datos,
      [field]: value
    })

    // Validar coincidencia de emails
    if (field === 'email' || field === 'confirmarEmail') {
      const email = field === 'email' ? value : datos.email
      const confirmar = field === 'confirmarEmail' ? value : datos.confirmarEmail
      setEmailMatch(email === confirmar || confirmar === '')
    }
  }

  const handlePhoneChange = (
    fullNumber: string,
    // country: Country
  ) => {
    onChange({
      ...datos,
      telefono: fullNumber
    })
  }


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Datos de Facturación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de Documento y Número */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo Documento */}
          <div className="space-y-2">
            <Label htmlFor="tipoDocumento">
              Tipo Documento <span className="text-red-500">*</span>
            </Label>
            <Select
              value={datos.tipoDocumento}
              onValueChange={(value) => handleChange('tipoDocumento', value)}
            >
              <SelectTrigger
                id="tipoDocumento"
                className={errores.tipoDocumento ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_DOCUMENTO.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errores.tipoDocumento && (
              <p className="text-sm text-red-500">{errores.tipoDocumento}</p>
            )}
          </div>

          {/* Número de Documento */}
          <div className="space-y-2">
            <Label htmlFor="numeroDocumento">
              Cédula / Pasaporte <span className="text-red-500">*</span>
            </Label>
            <Input
              id="numeroDocumento"
              type="text"
              placeholder="Documento de identidad"
              value={datos.numeroDocumento}
              onChange={(e) => handleChange('numeroDocumento', e.target.value)}
              className={errores.numeroDocumento ? 'border-red-500' : ''}
            />
            {errores.numeroDocumento && (
              <p className="text-sm text-red-500">{errores.numeroDocumento}</p>
            )}
          </div>
        </div>

        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombres */}
          <div className="space-y-2">
            <Label htmlFor="nombres">
              Nombres <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombres"
              type="text"
              placeholder="nombre y apellido"
              value={datos.nombres}
              onChange={(e) => handleChange('nombres', e.target.value)}
              className={errores.nombres ? 'border-red-500' : ''}
            />
            {errores.nombres && (
              <p className="text-sm text-red-500">{errores.nombres}</p>
            )}
          </div>

          {/* Apellidos */}
          <div className="space-y-2">
            <Label htmlFor="apellidos">
              Apellidos <span className="text-red-500">*</span>
            </Label>
            <Input
              id="apellidos"
              type="text"
              placeholder="apellido"
              value={datos.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              className={errores.apellidos ? 'border-red-500' : ''}
            />
            {errores.apellidos && (
              <p className="text-sm text-red-500">{errores.apellidos}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu email"
            value={datos.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errores.email ? 'border-red-500' : ''}
          />
          {errores.email && (
            <p className="text-sm text-red-500">{errores.email}</p>
          )}
        </div>

        {/* Confirmar Email */}
        <div className="space-y-2">
          <Label htmlFor="confirmarEmail">
            Confirmar Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="confirmarEmail"
            type="email"
            placeholder="confirmar email"
            value={datos.confirmarEmail}
            onChange={(e) => handleChange('confirmarEmail', e.target.value)}
            className={!emailMatch || errores.confirmarEmail ? 'border-red-500' : ''}
          />
          {!emailMatch && datos.confirmarEmail && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Los correos electrónicos no coinciden
              </AlertDescription>
            </Alert>
          )}
          {errores.confirmarEmail && (
            <p className="text-sm text-red-500">{errores.confirmarEmail}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label>
            Teléfono / WhatsApp <span className="text-red-500">*</span>
          </Label>
          <PhoneInput
            value={datos.telefono}
            onChange={handlePhoneChange}
            placeholder="Ingrese número"
            required
            showWhatsAppBadge
            defaultCountryCode="ec"
          />
          {errores.telefono && (
            <p className="text-sm text-red-500">{errores.telefono}</p>
          )}
        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <Label htmlFor="direccion">
            Dirección de la calle <span className="text-red-500">*</span>
          </Label>
          <Input
            id="direccion"
            type="text"
            placeholder="Tu direccion"
            value={datos.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            className={errores.direccion ? 'border-red-500' : ''}
          />
          {errores.direccion && (
            <p className="text-sm text-red-500">{errores.direccion}</p>
          )}
        </div>

        {/* País */}
        <div className="space-y-2">
          <Label>  {/* Sin htmlFor */}
            País / Región <span className="text-red-500">*</span>
          </Label>
          <div className="text-lg font-semibold text-gray-900">
            Ecuador
          </div>
          <input type="hidden" name="pais" value="Ecuador" />
        </div>

        {/* Ciudad y Provincia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ciudad */}
          <div className="space-y-2">
            <Label htmlFor="ciudad">
              Ciudad <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ciudad"
              type="text"
              placeholder="Balsas"
              value={datos.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              className={errores.ciudad ? 'border-red-500' : ''}
            />
            {errores.ciudad && (
              <p className="text-sm text-red-500">{errores.ciudad}</p>
            )}
          </div>

          {/* Provincia */}
          <div className="space-y-2">
            <Label htmlFor="provincia">
              Provincia <span className="text-red-500">*</span>
            </Label>
            <Select
              value={datos.provincia}
              onValueChange={(value) => handleChange('provincia', value)}
            >
              <SelectTrigger
                id="provincia"
                className={errores.provincia ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Selecciona provincia" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCIAS_ECUADOR.map((provincia) => (
                  <SelectItem key={provincia} value={provincia}>
                    {provincia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errores.provincia && (
              <p className="text-sm text-red-500">{errores.provincia}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}