
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// import { Link } from "react-router"
// import { useState } from "react"
// import { useAuthStore } from "@/stores/authStore"
// import { useNavigate } from "react-router";

// export const LoginPage = () => {

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('')
//   const { signInWithPassword, loading, error } = useAuthStore()


//   const navigate = useNavigate()

//   const handLeSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       // ✅ Recibir el usuario directamente del login
//       const user = await signInWithPassword(email, password)
//       // Redirigir según el tipo de usuario
//       if (user?.user_type === 'admin') {
//         navigate('/admin')
//       } else if (user?.user_type === 'agencia') {
//         navigate('/agency')
//       } else {
//         navigate('/')
//       }
//     } catch (error) {
//       console.error('Error en login:', error)
//     }
//   }

//   return (
//     <div className={"flex flex-col gap-6"}>
//       <Card className="overflow-hidden p-0 bg-gray-400 border border-gray-400 rounded-lg shadow-2xl">

//         <CardContent className="grid p-0 md:grid-cols-1">
//           {error && (
//             <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm">
//               <strong>Error:</strong> {error}
//             </div>
//           )}
//           <form className="p-6 md:p-8" onSubmit={handLeSubmit}>
//             <div className="flex flex-col gap-6">

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
//                 <div className="flex items-center">
//                   <Label htmlFor="password" className="text-white font-montserrat">Contraseña</Label>
//                   <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline text-white">
//                     ¿Olvidaste tu contraseña?
//                   </a>
//                 </div>
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
//                 className="w-full bg-amber-500 hover:bg-amber-400 text-black  cursor-pointer font-montserrat shadow-md">
//                 {loading ? 'Cargando...' : 'Iniciar Sesión'}
//               </Button>

//               <div className="text-center text-sm text-white">
//                 ¿No tienes cuenta?{" "}
//                 <Link to="/auth/register" className="underline underline-offset-4 font-bold text-amber-400">
//                   Crea una
//                 </Link>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
//         Iniciando sesion, estaras de acuerdo con los <a href="#">terminos y condiciones</a> y <a href="#">politicas de uso</a>.
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
import { useNavigate } from "react-router"
import { Mail, Lock, AlertCircle } from "lucide-react"

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInWithPassword, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const user = await signInWithPassword(email, password)
      if (user?.user_type === 'admin') {
        navigate('/admin')
      } else if (user?.user_type === 'agencia') {
        navigate('/agency')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Error en login:', error)
    }
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-900 font-semibold font-montserrat"
              >
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
                  autoComplete="email"  // Agregado
                  className="pl-10 border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-gray-900 font-semibold font-montserrat"
                >
                  Contraseña
                </Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-amber-600 hover:text-amber-700 hover:underline transition-colors font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"  // ✅ Agregado
                  className="pl-10 border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cargando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link
                  to="/auth/register"
                  className="font-bold text-amber-600 hover:text-amber-700 underline underline-offset-4 transition-colors"
                >
                  Crea una gratis
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-500">
        Al iniciar sesión, aceptas nuestros{" "}
        <Link to="/terms" className="text-amber-600 hover:text-amber-700 underline underline-offset-2">
          términos y condiciones
        </Link>{" "}
        y{" "}
        <Link to="/privacy" className="text-amber-600 hover:text-amber-700 underline underline-offset-2">
          políticas de privacidad
        </Link>
        .
      </div>
    </div>
  )
}