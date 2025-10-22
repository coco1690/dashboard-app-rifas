
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Link } from "react-router"
import { useState } from "react"
import { useAuthStore } from "@/stores/authStore"
import { useNavigate } from "react-router";

export const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const { signInWithPassword, loading, error } = useAuthStore()


  const navigate = useNavigate()

  const handLeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // ✅ Recibir el usuario directamente del login
      const user = await signInWithPassword(email, password)
      // Redirigir según el tipo de usuario
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
    <div className={"flex flex-col gap-6"}>
      <Card className="overflow-hidden p-0 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl">

        <CardContent className="grid p-0 md:grid-cols-1">
          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          <form className="p-6 md:p-8" onSubmit={handLeSubmit}>
            <div className="flex flex-col gap-6">

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white font-montserrat">Correo</Label>
                <Input
                  className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  id="email"
                  type="email"
                  placeholder="micorreo@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white font-montserrat">Contraseña</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline text-white">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black  cursor-pointer font-montserrat shadow-md">
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </Button>

              <div className="text-center text-sm text-white">
                ¿No tienes cuenta?{" "}
                <Link to="/auth/register" className="underline underline-offset-4 font-bold text-amber-400">
                  Crea una
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Iniciando sesion, estaras de acuerdo con los <a href="#">terminos y condiciones</a> y <a href="#">politicas de uso</a>.
      </div>
    </div>
  )
}