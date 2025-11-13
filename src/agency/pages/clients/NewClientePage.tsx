import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/PhoneInput' // ← NUEVO
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, User, CreditCard, Mail, Lock } from 'lucide-react' // ← Agregado iconos
import { useAuthStore } from '@/stores/authStore'
// import type { Country } from '@/lib/countries' // ← NUEVO

export default function NewClientePage() {
  const { signUpClienteByAgencia, loading, error, user } = useAuthStore()
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    telefono: '', // ← Ahora guardará formato internacional: +573001234567
    correo: '',
    password: ''
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // ← NUEVO: Handler para teléfono con país
  const handlePhoneChange = (
    fullNumber: string,
    // country: Country
  ) => {
    setFormData({
      ...formData,
      telefono: fullNumber // +573001234567
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)

    // Validación básica
    if (!formData.cedula || !formData.nombre || !formData.telefono || !formData.correo || !formData.password) {
      return
    }

    // Validar formato de teléfono
    if (!formData.telefono.startsWith('+')) {
      console.error('Formato de teléfono inválido')
      return
    }

    // Verificar que el usuario sea una agencia
    if (!user || user.user_type !== 'agencia') {
      console.error('Solo las agencias pueden crear clientes')
      return
    }

    try {
      await signUpClienteByAgencia(
        formData.cedula,
        formData.nombre,
        formData.telefono,
        formData.correo,
        formData.password,
        user.id!
      )

      // Si llegamos aquí, fue exitoso
      setSuccess(true)
      setFormData({
        cedula: '',
        nombre: '',
        telefono: '',
        correo: '',
        password: ''
      })
    } catch (err) {
      //  Si hay error, no se muestra éxito
      console.error('Error al crear cliente:', err)
      // El error ya se mostró en el toast desde el store
    }
  }
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Cliente</CardTitle>
        <CardDescription>
          Registra un nuevo cliente en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cédula */}
          <div className="space-y-2">
            <Label htmlFor="cedula" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Cédula
            </Label>
            <Input
              id="cedula"
              name="cedula"
              type="text"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="1234567890"
              required
              disabled={loading}
              className="border-2 border-gray-200 focus:border-amber-500"
            />
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nombre Completo
            </Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="nombre completo"
              required
              disabled={loading}
              className="border-2 border-gray-200 focus:border-amber-500"
            />
          </div>

          {/* ✅ TELÉFONO CON SELECTOR DE PAÍS */}
          <div className="space-y-2">
            <PhoneInput
              value={formData.telefono}
              onChange={handlePhoneChange}
              label="Teléfono / WhatsApp"
              placeholder="Ingrese número"
              required
              disabled={loading}
              showWhatsAppBadge
              defaultCountryCode="ec"
            />
          </div>

          {/* Correo */}
          <div className="space-y-2">
            <Label htmlFor="correo" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Correo Electrónico
            </Label>
            <Input
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              disabled={loading}
              className="border-2 border-gray-200 focus:border-amber-500"
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
              className="border-2 border-gray-200 focus:border-amber-500"
            />
          </div>

          {/* Mensajes de error/éxito */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Cliente creado exitosamente con número: {formData.telefono}
              </AlertDescription>
            </Alert>
          )}

          {/* Botón de envío */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cliente...
              </>
            ) : (
              'Crear Cliente'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}