// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { useBoletoStore } from '@/stores/useBoletoStore'
// import { Loader2, Sparkles, Save } from 'lucide-react'

// interface NumerosDeLaSuerteProps {
//   rifaActiva: any
//   totalBoletos: number
// }

// export const NumerosDeLaSuerte = ({ rifaActiva, totalBoletos }: NumerosDeLaSuerteProps) => {
//   const { 
//     loading,
//     generarNumerosDelaSuerteAleatorios,
//     guardarNumerosDelaSuerte,
//     numerosDelaSuerte,
//     guardandoNumerosSuerte
//   } = useBoletoStore()

//   // Estado local para la cantidad de números a generar
//   const [cantidadNumeros, setCantidadNumeros] = useState(5)

//   const handleGenerarNumerosSuerte = () => {
//     if (!rifaActiva) return
//     // Pasamos la cantidad como parámetro
//     generarNumerosDelaSuerteAleatorios(rifaActiva.id, cantidadNumeros)
//   }

//   const handleGuardarNumerosSuerte = async () => {
//     if (!rifaActiva) return
    
//     try {
//       await guardarNumerosDelaSuerte(rifaActiva.id)
//       alert('¡Números de la suerte guardados exitosamente!')
//     } catch (error) {
//       console.error('Error guardando números de la suerte:', error)
//       alert('Error al guardar los números de la suerte')
//     }
//   }

//   const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const valor = parseInt(e.target.value)
//     if (valor >= 1 && valor <= Math.min(totalBoletos, 20)) {
//       setCantidadNumeros(valor)
//     }
//   }

//   // No mostrar si no hay boletos generados
//   if (totalBoletos === 0) return null

//   const maxNumeros = Math.min(totalBoletos, 20) // Máximo 20 números o total de boletos disponibles

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Sparkles className="h-5 w-5 text-yellow-500" />
//           Números de la Suerte
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {/* Input para cantidad de números */}
//         <div className="flex items-center gap-4">
//           <div className="flex flex-col gap-2">
//             <Label htmlFor="cantidad-numeros" className="text-sm font-medium">
//               Cantidad de números:
//             </Label>
//             <Input
//               id="cantidad-numeros"
//               type="number"
//               min="1"
//               max={maxNumeros}
//               value={cantidadNumeros}
//               onChange={handleCantidadChange}
//               className="w-24"
//               disabled={loading || guardandoNumerosSuerte}
//             />
//             <span className="text-xs text-gray-500">
//               Máx: {maxNumeros}
//             </span>
//           </div>
          
//           <div className="flex gap-2 mt-6">
//             <Button 
//               onClick={handleGenerarNumerosSuerte}
//               disabled={loading || guardandoNumerosSuerte || cantidadNumeros < 1}
//               variant="outline"
//               className="cursor-pointer"
//             >
//               <Sparkles className="h-4 w-4 mr-2" />
//               Generar {cantidadNumeros} Número{cantidadNumeros !== 1 ? 's' : ''}
//             </Button>
            
//             {numerosDelaSuerte.length > 0 && (
//               <Button 
//                 onClick={handleGuardarNumerosSuerte}
//                 disabled={guardandoNumerosSuerte}
//                 className="cursor-pointer bg-green-600 hover:bg-green-700"
//               >
//                 {guardandoNumerosSuerte ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Guardando...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4 mr-2" />
//                     Guardar en BD
//                   </>
//                 )}
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Mostrar números generados */}
//         {numerosDelaSuerte.length > 0 && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <h4 className="font-medium text-yellow-800 mb-3">
//               Números de la Suerte Generados ({numerosDelaSuerte.length}):
//             </h4>
//             <div className="flex flex-wrap gap-3">
//               {numerosDelaSuerte.map((numero, index) => (
//                 <div key={index} className="bg-yellow-100 border-2 border-yellow-300 rounded-lg px-4 py-2">
//                   <span className="text-lg font-bold text-yellow-800 font-mono">{numero}</span>
//                 </div>
//               ))}
//             </div>
//             <p className="text-sm text-yellow-700 mt-3">
//               Estos {numerosDelaSuerte.length} números fueron seleccionados aleatoriamente. 
//               Haz clic en "Guardar en BD" para almacenarlos permanentemente.
//             </p>
//           </div>
//         )}

//         {/* Mostrar números existentes en la BD */}
//         {rifaActiva?.numeros_de_la_suerte && rifaActiva.numeros_de_la_suerte.length > 0 && (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <h4 className="font-medium text-green-800 mb-3">
//               Números de la Suerte Guardados ({rifaActiva.numeros_de_la_suerte.length}):
//             </h4>
//             <div className="flex flex-wrap gap-3">
//               {rifaActiva.numeros_de_la_suerte.map((numero: string, index: number) => (
//                 <div key={index} className="bg-green-100 border-2 border-green-300 rounded-lg px-4 py-2">
//                   <span className="text-lg font-bold text-green-800 font-mono">{numero}</span>
//                 </div>
//               ))}
//             </div>
//             <p className="text-sm text-green-700 mt-3">
//               Estos números están guardados en la base de datos.
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBoletoStore } from '@/stores/useBoletoStore'
import { Loader2, Sparkles, Save } from 'lucide-react'

interface NumerosDeLaSuerteProps {
  rifaActiva: any
  totalBoletos: number
}

export const NumerosDeLaSuerte = ({ rifaActiva, totalBoletos }: NumerosDeLaSuerteProps) => {
  const { 
    loading,
    generarNumerosDelaSuerteAleatorios,
    guardarNumerosDelaSuerte,
    numerosDelaSuerte,
    guardandoNumerosSuerte
  } = useBoletoStore()

  // Estado local para la cantidad de números a generar
  const [cantidadNumeros, setCantidadNumeros] = useState(5)
  // Estado local para el loading de generar números
  const [generandoNumeros, setGenerandoNumeros] = useState(false)

  const handleGenerarNumerosSuerte = async () => {
    if (!rifaActiva) return
    
    setGenerandoNumeros(true)
    try {
      // Pasamos la cantidad como parámetro
      await generarNumerosDelaSuerteAleatorios(rifaActiva.id, cantidadNumeros)
    } catch (error) {
      console.error('Error generando números:', error)
    } finally {
      setGenerandoNumeros(false)
    }
  }

  const handleGuardarNumerosSuerte = async () => {
    if (!rifaActiva) return
    
    try {
      await guardarNumerosDelaSuerte(rifaActiva.id)
      alert('¡Números de la suerte guardados exitosamente!')
    } catch (error) {
      console.error('Error guardando números de la suerte:', error)
      alert('Error al guardar los números de la suerte')
    }
  }

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseInt(e.target.value)
    if (valor >= 1 && valor <= Math.min(totalBoletos, 20)) {
      setCantidadNumeros(valor)
    }
  }

  // No mostrar si no hay boletos generados
  if (totalBoletos === 0) return null

  const maxNumeros = Math.min(totalBoletos, 20) // Máximo 20 números o total de boletos disponibles

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Números de la Suerte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input para cantidad de números con mejor alineación */}
        <div className="flex items-end gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cantidad-numeros" className="text-sm font-medium">
              Cantidad de números:
            </Label>
            <Input
              id="cantidad-numeros"
              type="number"
              min="1"
              max={maxNumeros}
              value={cantidadNumeros}
              onChange={handleCantidadChange}
              className="w-24"
              disabled={loading || guardandoNumerosSuerte}
            />
            <span className="text-xs text-gray-500">
              Máx: {maxNumeros}
            </span>
          </div>
          
          <div className="flex gap-2 mb-6">
            <Button 
              onClick={handleGenerarNumerosSuerte}
              disabled={generandoNumeros || guardandoNumerosSuerte || cantidadNumeros < 1}
              variant="outline"
              className="cursor-pointer min-w-[140px]"
            >
              {generandoNumeros ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generar {cantidadNumeros} Número{cantidadNumeros !== 1 ? 's' : ''}
                </>
              )}
            </Button>
            
            {numerosDelaSuerte.length > 0 && (
              <Button 
                onClick={handleGuardarNumerosSuerte}
                disabled={guardandoNumerosSuerte || generandoNumeros}
                className="cursor-pointer bg-green-600 hover:bg-green-700 min-w-[130px]"
              >
                {guardandoNumerosSuerte ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar en BD
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mostrar números generados */}
        {numerosDelaSuerte.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-3">
              Números de la Suerte Generados ({numerosDelaSuerte.length}):
            </h4>
            <div className="flex flex-wrap gap-3">
              {numerosDelaSuerte.map((numero, index) => (
                <div key={index} className="bg-yellow-100 border-2 border-yellow-300 rounded-lg px-4 py-2">
                  <span className="text-lg font-bold text-yellow-800 font-mono">{numero}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-yellow-700 mt-3">
              Estos {numerosDelaSuerte.length} números fueron seleccionados aleatoriamente. 
              Haz clic en "Guardar en BD" para almacenarlos permanentemente.
            </p>
          </div>
        )}

        {/* Mostrar números existentes en la BD */}
        {rifaActiva?.numeros_de_la_suerte && rifaActiva.numeros_de_la_suerte.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3">
              Números de la Suerte Guardados ({rifaActiva.numeros_de_la_suerte.length}):
            </h4>
            <div className="flex flex-wrap gap-3">
              {rifaActiva.numeros_de_la_suerte.map((numero: string, index: number) => (
                <div key={index} className="bg-green-100 border-2 border-green-300 rounded-lg px-4 py-2">
                  <span className="text-lg font-bold text-green-800 font-mono">{numero}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-green-700 mt-3">
              Estos números están guardados en la base de datos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
