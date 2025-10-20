import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/supabase/client'
import { toast } from 'sonner'
import { Crown, Trophy, Save, X } from 'lucide-react'

interface NumeroGanadorProps {
  rifaActiva: {
    id: string
    titulo: string
    numero_ganador?: string | null
    estado: string
    digitos: number
  }
}

export const NumeroGanador: React.FC<NumeroGanadorProps> = ({ rifaActiva }) => {
  const [numeroGanador, setNumeroGanador] = useState(rifaActiva.numero_ganador || '')
  const [guardando, setGuardando] = useState(false)
  const [editando, setEditando] = useState(false)

  // Validar que el número tenga la cantidad correcta de dígitos
  const validarNumero = (numero: string): boolean => {
    if (!numero.trim()) return false
    
    // Verificar que sea solo números
    if (!/^\d+$/.test(numero)) return false
    
    // Verificar que tenga exactamente la cantidad de dígitos configurada
    return numero.length === rifaActiva.digitos
  }

  const handleGuardar = async () => {
    if (!validarNumero(numeroGanador)) {
      if (!/^\d+$/.test(numeroGanador)) {
        toast.error('Número inválido', {
          description: 'El número debe contener solo dígitos'
        })
      } else {
        toast.error('Cantidad de dígitos incorrecta', {
          description: `El número debe tener exactamente ${rifaActiva.digitos} dígitos`
        })
      }
      return
    }

    setGuardando(true)
    
    const loadingToast = toast.loading('Guardando número ganador...', {
      description: `Estableciendo ${numeroGanador} como ganador`
    })

    try {
      const { error } = await supabase
        .from('rifas')
        .update({ numero_ganador: numeroGanador })
        .eq('id', rifaActiva.id)

      if (error) throw error

      // Actualizar estado local
      setEditando(false)
      
      toast.success('Número ganador guardado', {
        description: `El boleto ${numeroGanador} es ahora el ganador de "${rifaActiva.titulo}"`,
        duration: 4000,
        action: {
          label: 'Ver rifas',
          onClick: () => console.log('Navegando a rifas...')
        }
      })

    } catch (error: any) {
      toast.error('Error al guardar', {
        description: error.message || 'No se pudo guardar el número ganador',
        duration: 4000
      })
    } finally {
      setGuardando(false)
      toast.dismiss(loadingToast)
    }
  }

  const handleCancelar = () => {
    setNumeroGanador(rifaActiva.numero_ganador || '')
    setEditando(false)
  }

  const handleLimpiar = async () => {
    setGuardando(true)
    
    const loadingToast = toast.loading('Eliminando número ganador...', {
      description: 'Removiendo el ganador actual'
    })

    try {
      const { error } = await supabase
        .from('rifas')
        .update({ numero_ganador: null })
        .eq('id', rifaActiva.id)

      if (error) throw error

      setNumeroGanador('')
      setEditando(false)
      
      toast.success('Número ganador eliminado', {
        description: `Se removió el ganador de "${rifaActiva.titulo}"`,
        duration: 3000
      })

    } catch (error: any) {
      toast.error('Error al eliminar', {
        description: error.message || 'No se pudo eliminar el número ganador',
        duration: 4000
      })
    } finally {
      setGuardando(false)
      toast.dismiss(loadingToast)
    }
  }

  const tieneGanador = rifaActiva.numero_ganador && rifaActiva.numero_ganador.trim().length > 0
  const puedeEditar = rifaActiva.estado === 'activa' || rifaActiva.estado === 'finalizada'

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          Número Ganador
          {tieneGanador && (
            <Badge className="bg-yellow-500 text-white animate-pulse">
              <Trophy className="h-3 w-3 mr-1" />
              DEFINIDO
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estado actual */}
        {tieneGanador && !editando && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">Número ganador actual:</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-mono text-yellow-800">
                    {rifaActiva.numero_ganador}
                  </span>
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              {puedeEditar && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditando(true)}
                    variant="outline"
                    size="sm"
                  >
                    Cambiar
                  </Button>
                  <Button
                    onClick={handleLimpiar}
                    variant="destructive"
                    size="sm"
                    disabled={guardando}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Formulario de edición */}
        {(!tieneGanador || editando) && puedeEditar && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numero-ganador">
                Ingrese el número ganador ({rifaActiva.digitos} dígitos)
              </Label>
              <Input
                id="numero-ganador"
                type="text"
                value={numeroGanador}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, '') // Solo números
                  if (valor.length <= rifaActiva.digitos) {
                    setNumeroGanador(valor)
                  }
                }}
                placeholder={`Ejemplo: ${'1'.repeat(rifaActiva.digitos)}`}
                maxLength={rifaActiva.digitos}
                className="font-mono text-lg"
                disabled={guardando}
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Dígitos: {numeroGanador.length} / {rifaActiva.digitos}
                </span>
                {numeroGanador && validarNumero(numeroGanador) && (
                  <span className="text-green-600 font-medium">✓ Número válido</span>
                )}
                {numeroGanador && numeroGanador.length > 0 && !validarNumero(numeroGanador) && (
                  <span className="text-red-600 font-medium">
                    {!/^\d+$/.test(numeroGanador) 
                      ? '✗ Solo números' 
                      : `✗ Debe tener ${rifaActiva.digitos} dígitos`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGuardar}
                disabled={!validarNumero(numeroGanador) || guardando}
                className="flex-1"
              >
                {guardando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Ganador
                  </>
                )}
              </Button>
              
              {editando && (
                <Button
                  onClick={handleCancelar}
                  variant="outline"
                  disabled={guardando}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Estado no editable */}
        {!puedeEditar && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              No se puede modificar el número ganador en rifas con estado "{rifaActiva.estado}"
            </p>
          </div>
        )}

        {/* Información adicional */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <strong>Tip:</strong> Una vez definido el número ganador, el sistema detectará automáticamente 
            a los clientes que compraron ese boleto y los marcará como ganadores en el historial de ventas.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}