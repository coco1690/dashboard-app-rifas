import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'


export default function CrearAgenciasPage() {
  const { signUpAgenciaByAdmin, loading, error, user } = useAuthStore()
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    telefono: '',
    correo: '',
    password: '',
    direccion: '',
    ciudad: '',
    comision: '0'
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
    if (!formData.cedula || !formData.nombre || !formData.telefono ||
      !formData.correo || !formData.password || !formData.direccion ||
      !formData.ciudad) {
      return
    }

    // Verificar que el usuario sea admin
    if (!user || user.user_type !== 'admin') {
      console.error('Solo los administradores pueden crear agencias')
      return
    }

    try {
      await signUpAgenciaByAdmin(
        formData.cedula,
        formData.nombre,
        formData.telefono,
        formData.correo,
        formData.password,
        formData.direccion,
        formData.ciudad,
        parseFloat(formData.comision)
      )

      // ✅ Verificar que NO haya error después de la operación
      const currentError = useAuthStore.getState().error

      if (!currentError) {
        setSuccess(true)
        // Limpiar formulario
        setFormData({
          cedula: '',
          nombre: '',
          telefono: '',
          correo: '',
          password: '',
          direccion: '',
          ciudad: '',
          comision: '0'
        })
      }
    } catch (err) {
      console.error('Error al crear agencia:', err)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nueva Agencia</CardTitle>
        <CardDescription>
          Registra una nueva agencia en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grid de 2 columnas para campos relacionados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cédula */}
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula / NIT</Label>
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
              <Label htmlFor="nombre">Nombre de la Agencia</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Agencia XYZ"
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
                placeholder="agencia@ejemplo.com"
                required
                disabled={loading}
              />
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Calle 123 #45-67"
                required
                disabled={loading}
              />
            </div>

            {/* Ciudad */}
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                name="ciudad"
                type="text"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Bogotá"
                required
                disabled={loading}
              />
            </div>

            {/* Comisión */}
            <div className="space-y-2">
              <Label htmlFor="comision">Comisión (%)</Label>
              <Input
                id="comision"
                name="comision"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.comision}
                onChange={handleChange}
                placeholder="0.00"
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
                Agencia creada exitosamente
              </AlertDescription>
            </Alert>
          )}

          {/* Botón de envío */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando agencia...
              </>
            ) : (
              'Crear Agencia'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}