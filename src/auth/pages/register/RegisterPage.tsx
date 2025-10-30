// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Link } from "react-router"
// import { useState } from "react"
// import { useAuthStore } from "@/stores/authStore"

// export const RegisterPage = () => {
//   const [cedula, setCedula] = useState('')
//   const [fullName, setFullName] = useState('')
//   const [telefono, setTelefono] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const { signUp, loading, error } = useAuthStore()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     await signUp(cedula, fullName, telefono, email, password)
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <Card className="overflow-hidden p-0 bg-gray-800 border border-gray-600 shadow-xl rounded-lg">
//         <CardContent className="grid p-0 md:grid-cols-1">
//           {error && (
//             <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm">
//               <strong>Error:</strong> {error}
//             </div>
//           )}
//           <form className="p-6 md:p-8" onSubmit={handleSubmit}>
//             <div className="flex flex-col gap-6">
//               <div className="flex flex-col items-center text-center">
//                 <p className="text-balance text-gray-400 font-montserrat">Datos del Usuario</p>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="cedula" className="text-white">ID</Label>
//                 <Input
//                   className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                   id="cedula"
//                   type="text"
//                   placeholder="N° de cédula"
//                   onChange={(e) => setCedula(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="name" className="text-white font-montserrat">Nombre</Label>
//                 <Input
//                   className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                   id="name"
//                   type="text"
//                   placeholder="Nombre y Apellido"
//                   onChange={(e) => setFullName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="phone" className="text-white font-montserrat">Teléfono</Label>
//                 <Input
//                   className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                   id="phone"
//                   type="text"
//                   placeholder="Tu WhatsApp"
//                   onChange={(e) => setTelefono(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="email" className="text-white font-montserrat">Correo</Label>
//                 <Input
//                   className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                   id="email"
//                   type="email"
//                   placeholder="micorreo@example.com"
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="password" className="text-white font-montserrat">Contraseña</Label>
//                 <Input
//                   className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                   id="password"
//                   type="password"
//                   placeholder="Contraseña"
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-amber-500 hover:bg-amber-400 text-black cursor-pointer font-montserrat shadow-md">
//                 {loading ? 'Registrando...' : 'Registrarse'}
//               </Button>

//               <div className="text-center text-sm text-white">
//                 ¿Ya tienes cuenta?{" "}
//                 <Link to="/auth/login" className="underline underline-offset-4 font-bold text-amber-400">
//                   Ingresa ahora
//                 </Link>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       <div className="text-balance text-center text-xs text-gray-400">
//         Haciendo click, estás de acuerdo con los{" "}
//         <a href="#" className="underline hover:text-blue-400">términos y condiciones</a> y{" "}
//         <a href="#" className="underline hover:text-blue-400">políticas de uso</a>.
//       </div>
//     </div>
//   )
// }


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router"
import { useState } from "react"
import { useAuthStore } from "@/stores/authStore"
import { Mail, Lock, User, Phone, CreditCard, AlertCircle } from "lucide-react"

export const RegisterPage = () => {
  const [cedula, setCedula] = useState('')
  const [fullName, setFullName] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signUp, loading, error } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signUp(cedula, fullName, telefono, email, password)
  }

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto">
      <Card className="bg-white border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden">
        <CardContent className="p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong className="font-semibold">Error:</strong> {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-6">
              <p className="text-gray-600 font-montserrat">Datos del Usuario</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula" className="text-gray-900 font-semibold font-montserrat">
                ID
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <Input
                  id="cedula"
                  type="text"
                  placeholder="N° de cédula"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  autoComplete="off"  //  Agregado (desactiva autocompletado para ID)
                  className="pl-10 border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900 font-semibold font-montserrat">
                Nombre
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre y Apellido"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"  //  Agregado
                  className="pl-10 border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 font-semibold font-montserrat">
                Teléfono
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <Input
                  id="phone"
                  type="text"
                  placeholder="Tu WhatsApp"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  autoComplete="tel"  // ✅ Agregado
                  className="pl-10 border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-semibold font-montserrat">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="micorreo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"  // ✅ Agregado
                  className="pl-10 border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-semibold font-montserrat">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"  // ✅ Agregado (para nueva contraseña)
                  className="pl-10 border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </span>
              ) : (
                'Registrarse'
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/auth/login"
                  className="font-bold text-amber-600 hover:text-amber-700 underline underline-offset-4 transition-colors"
                >
                  Ingresa ahora
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-500">
        Al registrarte, aceptas nuestros{" "}
        <Link to="/terms" className="text-amber-600 hover:text-amber-700 underline underline-offset-2">
          términos y condiciones
        </Link>{" "}
        y{" "}
        <Link to="/privacy" className="text-amber-600 hover:text-amber-700 underline underline-offset-2">
          políticas de uso
        </Link>
        .
      </div>
    </div>
  )
}