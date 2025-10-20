import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBoletoStore } from '@/stores/useBoletoStore'
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'

interface ConfiguracionBoletosProps {
  rifaActiva: any
  totalBoletos: number
}

export const ConfiguracionBoletos = ({ rifaActiva, totalBoletos }: ConfiguracionBoletosProps) => {
  const { 
    generarBoletosParaRifa, 
    loading, 
    error, 
    // digitos, 
    // setDigitos 
  } = useBoletoStore()

  const handleGenerar = async () => {
    if (!rifaActiva) return
    
    try {
      await generarBoletosParaRifa(
        rifaActiva.id, 
        rifaActiva.numero_inicial, 
        rifaActiva.numero_final
      )
    } catch (error) {
      console.error('Error generando boletos:', error)
    }
  }

  const handleForzar = async () => {
    if (!rifaActiva) return
    
    const confirmacion = confirm('⚠️ Esto eliminará todos los boletos anteriores. ¿Deseas continuar?')
    if (confirmacion) {
      try {
        await generarBoletosParaRifa(
          rifaActiva.id, 
          rifaActiva.numero_inicial, 
          rifaActiva.numero_final, 
          true
        )
      } catch (error) {
        console.error('Error forzando generación:', error)
      }
    }
  }

  // const handleCambioDigitos = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const valor = parseInt(e.target.value)
  //   if (!isNaN(valor) && valor > 0 && valor <= 10) {
  //     setDigitos(valor)
  //   }
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Boletos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Control de dígitos */}
        {/* <div className="flex items-center gap-4">
          <Label htmlFor="digitos" className="whitespace-nowrap">
            Dígitos de formato:
          </Label>
          <Input
            id="digitos"
            type="number"
            value={digitos}
            onChange={handleCambioDigitos}
            className="w-24"
            min={1}
            max={10}
          />
          <span className="text-sm text-gray-500">
            Ejemplo: {rifaActiva?.numero_inicial?.toString().padStart(digitos, '0')}
          </span>
        </div> */}

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Button 
            onClick={handleGenerar} 
            disabled={loading || totalBoletos > 0}
            className="cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Generar Boletos
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleForzar} 
            variant="destructive" 
            disabled={loading}
            className="cursor-pointer"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Regenerar (Forzar)
          </Button>
        </div>

        {/* Mensajes de estado */}
        {loading && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generando boletos, por favor espera...
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {totalBoletos > 0 && !loading && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded">
            <CheckCircle className="h-4 w-4" />
            Boletos generados correctamente
          </div>
        )}
      </CardContent>
    </Card>
  )
}