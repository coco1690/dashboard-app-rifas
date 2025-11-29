// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Separator } from '@/components/ui/separator'
// import { Badge } from '@/components/ui/badge'
// import { useCarrito } from '@/stores/useCarritoStore'
// import { Clock, Ticket, X } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { useState, useEffect } from 'react'

// export const ResumenPedido = () => {
//   const { items, total, eliminarItem } = useCarrito()
//   const [tiemposRestantes, setTiemposRestantes] = useState<Record<string, number>>({})

//   // Actualizar tiempos restantes cada segundo
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const nuevos: Record<string, number> = {}
//       items.forEach(item => {
//         const ahora = new Date().getTime()
//         const expiracion = new Date(item.expira_en).getTime()
//         const diferencia = Math.max(0, expiracion - ahora)
//         nuevos[item.reserva_id] = Math.floor(diferencia / 1000) // segundos
//       })
//       setTiemposRestantes(nuevos)
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [items])

//   const formatearTiempo = (segundos: number): string => {
//     const minutos = Math.floor(segundos / 60)
//     const segs = segundos % 60
//     return `${minutos}:${segs.toString().padStart(2, '0')}`
//   }

//   if (items.length === 0) {
//     return (
//       <Card className="w-full sticky top-4">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-gray-900">
//             Tu pedido
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center py-8">
//             <div className="text-5xl mb-4">🛒</div>
//             <p className="text-gray-600">
//               No tienes números seleccionados
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card className="w-full sticky top-4">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-gray-900">
//           Tu pedido
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {/* Cabecera de tabla */}
//         <div className="flex justify-between text-sm font-semibold text-gray-700 pb-2">
//           <span>Producto</span>
//           <span>Subtotal</span>
//         </div>

//         <Separator />

//         {/* Items del carrito */}
//         <div className="space-y-4">
//           {items.map((item) => {
//             const segundosRestantes = tiemposRestantes[item.reserva_id] || 0
//             const tiempoExpirando = segundosRestantes < 120 // menos de 2 minutos

//             return (
//               <div key={item.reserva_id} className="space-y-2">
//                 {/* Información del producto */}
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1 pr-4">
//                     <h4 className="font-medium text-gray-900 text-sm leading-tight">
//                       {item.rifaTitulo}
//                     </h4>
//                     {item.rifaSubtitulo && (
//                       <p className="text-xs text-gray-600 mt-0.5">
//                         {item.rifaSubtitulo}
//                       </p>
//                     )}
//                     <div className="flex items-center gap-2 mt-1">
//                       <Badge variant="outline" className="text-xs">
//                         <Ticket className="w-3 h-3 mr-1" />
//                         × {item.cantidad}
//                       </Badge>
//                       <span className="text-xs text-gray-600">
//                         ${item.precio_unitario} c/u
//                       </span>
//                     </div>
//                   </div>
//                   <div className="text-right flex items-start gap-2">
//                     <span className="font-semibold text-gray-900">
//                       ${item.total.toLocaleString()}
//                     </span>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-6 w-6 text-gray-400 hover:text-red-600"
//                       onClick={() => eliminarItem(item.reserva_id)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Números asignados */}
//                 <div className="bg-gray-50 rounded-md p-2">
//                   <p className="text-xs text-gray-600 mb-1">
//                     Números asignados:
//                   </p>
//                   <div className="flex flex-wrap gap-1">
//                     {item.numeros.slice(0, 10).map((numero, idx) => (
//                       <span
//                         key={idx}
//                         className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-200"
//                       >
//                         {numero}
//                       </span>
//                     ))}
//                     {item.numeros.length > 10 && (
//                       <span className="text-xs text-gray-500 px-2 py-0.5">
//                         +{item.numeros.length - 10} más
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Tiempo restante */}
//                 <div className={`flex items-center gap-1 text-xs ${
//                   tiempoExpirando ? 'text-red-600' : 'text-green-600'
//                 }`}>
//                   <Clock className="w-3 h-3" />
//                   <span>
//                     Expira en: {formatearTiempo(segundosRestantes)}
//                   </span>
//                 </div>

//                 <Separator />
//               </div>
//             )
//           })}
//         </div>

//         {/* Total */}
//         <div className="pt-4">
//           <div className="flex justify-between items-center text-xl font-bold">
//             <span className="text-gray-900">Total</span>
//             <span className="text-gray-900">
//               ${total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
//             </span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


// src/pages/carrito/components/ResumenPedido.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCarrito } from '@/stores/useCarritoStore'
import { Clock, Ticket, X, CreditCard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PayPalButtonsWrapper } from '@/paypal/components/PayPalButtons'
import type { DatosFacturacion } from '@/paypal/types/paypal.types'

interface ResumenPedidoProps {
  datosFacturacion?: DatosFacturacion | null
  formularioValido?: boolean
  onProcederPago?: () => void
  onPayPalSuccess?: (ventaId: string) => void
  onPayPalError?: (error: string) => void
}

export const ResumenPedido = ({
  datosFacturacion,
  formularioValido = false,
  onProcederPago,
  onPayPalSuccess,
  onPayPalError
}: ResumenPedidoProps) => {
  const { items, total, eliminarItem } = useCarrito()
  const [tiemposRestantes, setTiemposRestantes] = useState<Record<string, number>>({})

  // Actualizar tiempos restantes cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const nuevos: Record<string, number> = {}
      items.forEach(item => {
        const ahora = new Date().getTime()
        const expiracion = new Date(item.expira_en).getTime()
        const diferencia = Math.max(0, expiracion - ahora)
        nuevos[item.reserva_id] = Math.floor(diferencia / 1000)
      })
      setTiemposRestantes(nuevos)
    }, 1000)

    return () => clearInterval(interval)
  }, [items])

  const formatearTiempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${minutos}:${segs.toString().padStart(2, '0')}`
  }

  if (items.length === 0) {
    return (
      <Card className="w-full sticky top-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Tu pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-600">
              No tienes números seleccionados
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full sticky top-40">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Tu pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cabecera de tabla */}
        <div className="flex justify-between text-sm font-semibold text-gray-700 pb-2">
          <span>Producto</span>
          <span>Subtotal</span>
        </div>

        <Separator />

        {/* Items del carrito */}
        <div className="space-y-4">
          {items.map((item) => {
            const segundosRestantes = tiemposRestantes[item.reserva_id] || 0
            const tiempoExpirando = segundosRestantes < 120

            return (
              <div key={item.reserva_id} className="space-y-2">
                {/* Información del producto */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight">
                      {item.rifaTitulo}
                    </h4>
                    {/* {item.rifaSubtitulo && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        {item.rifaSubtitulo}
                      </p>
                    )} */}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Ticket className="w-3 h-3 mr-1" />
                        × {item.cantidad}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        ${item.precio_unitario} c/u
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-start gap-2">
                    <span className="font-semibold text-gray-900">
                      ${item.total.toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-600"
                      onClick={() => eliminarItem(item.reserva_id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Números asignados */}
                {/* <div className="bg-gray-50 rounded-md p-2">
                  <p className="text-xs text-gray-600 mb-1">
                    Números asignados:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.numeros.slice(0, 10).map((numero, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-200"
                      >
                        {numero}
                      </span>
                    ))}
                    {item.numeros.length > 10 && (
                      <span className="text-xs text-gray-500 px-2 py-0.5">
                        +{item.numeros.length - 10} más
                      </span>
                    )}
                  </div>
                </div> */}

                {/* Tiempo restante */}
                <div className={`flex items-center gap-1 text-xs ${
                  tiempoExpirando ? 'text-red-600' : 'text-green-600'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>
                    Expira en: {formatearTiempo(segundosRestantes)}
                  </span>
                </div>

                <Separator />
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div className="pt-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">
              ${total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <Separator />

        {/* ✅ BOTONES DE PAGO */}
        {!datosFacturacion ? (
          // Mostrar botón de "Proceder al Pago" si no hay datos de facturación
          <Button
            size="lg"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            onClick={onProcederPago}
            disabled={!formularioValido}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Proceder al Pago
          </Button>
        ) : (
          // Mostrar botones de PayPal si ya hay datos de facturación
          <div className="space-y-3">
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-medium mb-1">
                🔒 Pago Seguro
              </p>
              <p className="text-xs text-blue-700">
                PayPal procesa tu pago de forma segura
              </p>
            </div> */}

            <PayPalButtonsWrapper
              datosFacturacion={datosFacturacion}
              onSuccess={onPayPalSuccess}
              handleError={onPayPalError}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}