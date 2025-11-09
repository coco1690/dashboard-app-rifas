// import { useState } from 'react'
// import { useNavigate } from 'react-router'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
// import { useAuthStore } from '@/stores/authStore'

// export default function CrearClientePage() {
//   const navigate = useNavigate()
//   const { signUpClienteByAdmin, loading, error, user } = useAuthStore()
//   const [formData, setFormData] = useState({
//     cedula: '',
//     nombre: '',
//     telefono: '',
//     correo: '',
//     password: ''
//   })
//   const [success, setSuccess] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSuccess(false)

//     // Validación básica
//     if (!formData.cedula || !formData.nombre || !formData.telefono || 
//         !formData.correo || !formData.password) {
//       return
//     }

//     // Verificar que el usuario sea admin
//     if (!user || user.user_type !== 'admin') {
//       console.error('Solo los administradores pueden crear clientes')
//       return
//     }

//     try {
//       await signUpClienteByAdmin(
//         formData.cedula,
//         formData.nombre,
//         formData.telefono,
//         formData.correo,
//         formData.password
//       )

//       // ✅ Verificar que NO haya error después de la operación
//       const currentError = useAuthStore.getState().error

//       if (!currentError) {
//         setSuccess(true)
//         // Limpiar formulario
//         setFormData({
//           cedula: '',
//           nombre: '',
//           telefono: '',
//           correo: '',
//           password: ''
//         })

//         // Redirigir después de 2 segundos
//         setTimeout(() => {
//           navigate('/admin/admin_clientes')
//         }, 2000)
//       }
//     } catch (err) {
//       console.error('Error al crear cliente:', err)
//     }
//   }

//   const handleBack = () => {
//     navigate('/admin/admin_clientes')
//   }

//   return (
//     <div className="space-y-6">
//       {/* Botón de regreso */}
//       <Button
//         variant="ghost"
//         onClick={handleBack}
//         className="flex items-center gap-2"
//       >
//         <ArrowLeft className="h-4 w-4" />
//         Volver a la lista
//       </Button>

//       <Card className="w-full max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle>Crear Nuevo Cliente</CardTitle>
//           <CardDescription>
//             Registra un nuevo cliente en el sistema. El cliente podrá iniciar sesión con su correo y contraseña.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Grid de 2 columnas */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Cédula */}
//               <div className="space-y-2">
//                 <Label htmlFor="cedula">Cédula / Documento</Label>
//                 <Input
//                   id="cedula"
//                   name="cedula"
//                   type="text"
//                   value={formData.cedula}
//                   onChange={handleChange}
//                   placeholder="1234567890"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               {/* Nombre */}
//               <div className="space-y-2">
//                 <Label htmlFor="nombre">Nombre Completo</Label>
//                 <Input
//                   id="nombre"
//                   name="nombre"
//                   type="text"
//                   value={formData.nombre}
//                   onChange={handleChange}
//                   placeholder="Juan Pérez"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               {/* Teléfono */}
//               <div className="space-y-2">
//                 <Label htmlFor="telefono">Teléfono</Label>
//                 <Input
//                   id="telefono"
//                   name="telefono"
//                   type="tel"
//                   value={formData.telefono}
//                   onChange={handleChange}
//                   placeholder="3001234567"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               {/* Correo */}
//               <div className="space-y-2">
//                 <Label htmlFor="correo">Correo Electrónico</Label>
//                 <Input
//                   id="correo"
//                   name="correo"
//                   type="email"
//                   value={formData.correo}
//                   onChange={handleChange}
//                   placeholder="correo@ejemplo.com"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               {/* Contraseña */}
//               <div className="space-y-2 md:col-span-2">
//                 <Label htmlFor="password">Contraseña</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   required
//                   disabled={loading}
//                   minLength={6}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Mínimo 6 caracteres
//                 </p>
//               </div>
//             </div>

//             {/* Info adicional */}
//             <Alert>
//               <AlertDescription>
//                 <strong>Nota:</strong> El cliente será creado sin agencia asignada. 
//                 Podrás asignarle una agencia posteriormente desde la página de edición.
//               </AlertDescription>
//             </Alert>

//             {/* Mensajes de error/éxito */}
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {success && (
//               <Alert className="border-green-500 bg-green-50">
//                 <CheckCircle2 className="h-4 w-4 text-green-600" />
//                 <AlertDescription className="text-green-800">
//                   Cliente creado exitosamente. Redirigiendo...
//                 </AlertDescription>
//               </Alert>
//             )}

//             {/* Botones */}
//             <div className="flex gap-3 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleBack}
//                 disabled={loading}
//                 className="flex-1"
//               >
//                 Cancelar
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creando...
//                   </>
//                 ) : (
//                   'Crear Cliente'
//                 )}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/PhoneInput' // ← NUEVO
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2, ArrowLeft, User, CreditCard, Mail, Lock } from 'lucide-react' // ← Agregado iconos
import { useAuthStore } from '@/stores/authStore'
// import type { Country } from '@/lib/countries'

export default function CrearClientePage() {
  const navigate = useNavigate()
  const { signUpClienteByAdmin, loading, error, user } = useAuthStore()
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
    if (!formData.cedula || !formData.nombre || !formData.telefono || 
        !formData.correo || !formData.password) {
      return
    }

    // ← NUEVO: Validar formato de teléfono
    if (!formData.telefono.startsWith('+')) {
      console.error('Formato de teléfono inválido')
      return
    }

    // Verificar que el usuario sea admin
    if (!user || user.user_type !== 'admin') {
      console.error('Solo los administradores pueden crear clientes')
      return
    }

    try {
      await signUpClienteByAdmin(
        formData.cedula,
        formData.nombre,
        formData.telefono,
        formData.correo,
        formData.password
      )

      const currentError = useAuthStore.getState().error

      if (!currentError) {
        setSuccess(true)
        setFormData({
          cedula: '',
          nombre: '',
          telefono: '',
          correo: '',
          password: ''
        })

        setTimeout(() => {
          navigate('/admin/admin_clientes')
        }, 2000)
      }
    } catch (err) {
      console.error('Error al crear cliente:', err)
    }
  }

  const handleBack = () => {
    navigate('/admin/admin_clientes')
  }

  return (
    <div className="space-y-6">
      {/* Botón de regreso */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la lista
      </Button>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crear Nuevo Cliente</CardTitle>
          <CardDescription>
            Registra un nuevo cliente en el sistema. El cliente podrá iniciar sesión con su correo y contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid de 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cédula */}
              <div className="space-y-2">
                <Label htmlFor="cedula" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Cédula / Documento
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
              <div className="space-y-2 md:col-span-2">
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
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>
            </div>

            {/* Info adicional */}
            <Alert>
              <AlertDescription>
                <strong>Nota:</strong> El cliente será creado sin agencia asignada. 
                Podrás asignarle una agencia posteriormente desde la página de edición.
              </AlertDescription>
            </Alert>

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
                  Cliente creado exitosamente con número: {formData.telefono}. Redirigiendo...
                </AlertDescription>
              </Alert>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Cliente'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}