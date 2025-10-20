import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function NewClientePage() {
  const { signUpClienteByAgencia, loading, error, user } = useAuthStore()
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    telefono: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)

    // Validación básica
    if (!formData.cedula || !formData.nombre || !formData.telefono || !formData.correo || !formData.password) {
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
        user.id!  // ID de la agencia logueada
      )

      // Si no hay error, mostrar éxito
      if (!error) {
        setSuccess(true)
        // Limpiar formulario
        setFormData({
          cedula: '',
          nombre: '',
          telefono: '',
          correo: '',
          password: ''
        })
      }
    } catch (err) {
      console.error('Error al crear cliente:', err)
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
            <Label htmlFor="cedula">Cédula</Label>
            <Input
              id="cedula"
              name="cedula"
              type="text"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="1234567890"
              required
              disabled={loading}
            />
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
              disabled={loading}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="3001234567"
              required
              disabled={loading}
            />
          </div>

          {/* Correo */}
          <div className="space-y-2">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              id="correo"
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              disabled={loading}
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
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
                Cliente creado exitosamente
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