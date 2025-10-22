import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router"
import { useState } from "react"
import { useAuthStore } from "@/stores/authStore"

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
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0 bg-gray-800 border border-gray-600 shadow-xl rounded-lg">
        <CardContent className="grid p-0 md:grid-cols-1">
          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <p className="text-balance text-gray-400 font-montserrat">Datos del Usuario</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cedula" className="text-white">ID</Label>
                <Input
                  className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  id="cedula"
                  type="text"
                  placeholder="N° de cédula"
                  onChange={(e) => setCedula(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-white font-montserrat">Nombre</Label>
                <Input
                  className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  id="name"
                  type="text"
                  placeholder="Nombre y Apellido"
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-white font-montserrat">Teléfono</Label>
                <Input
                  className="bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  id="phone"
                  type="text"
                  placeholder="Tu WhatsApp"
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>

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
                <Label htmlFor="password" className="text-white font-montserrat">Contraseña</Label>
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
                className="w-full bg-amber-500 hover:bg-amber-400 text-black cursor-pointer font-montserrat shadow-md">
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>

              <div className="text-center text-sm text-white">
                ¿Ya tienes cuenta?{" "}
                <Link to="/auth/login" className="underline underline-offset-4 font-bold text-amber-400">
                  Ingresa ahora
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-gray-400">
        Haciendo click, estás de acuerdo con los{" "}
        <a href="#" className="underline hover:text-blue-400">términos y condiciones</a> y{" "}
        <a href="#" className="underline hover:text-blue-400">políticas de uso</a>.
      </div>
    </div>
  )
}
