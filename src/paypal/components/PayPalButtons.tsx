// import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
// import { useCarritoStore } from '@/stores/useCarritoStore'
// import { useReservaStore } from '@/stores/useReservaStore'
// import { toast } from 'sonner'
// import { Loader2 } from 'lucide-react'
// import type { DatosFacturacion } from '../types/paypal.types'
// import { usePayPalStore } from '@/stores/usePaypalStore'



// interface PayPalButtonsWrapperProps {
//     datosFacturacion: DatosFacturacion
//     onSuccess?: (ventaId: string) => void
//     handleError?: (error: string) => void
// }

// export const PayPalButtonsWrapper = ({
//     datosFacturacion,
//     onSuccess,
//     handleError
// }: PayPalButtonsWrapperProps) => {

//     const [{ isPending }] = usePayPalScriptReducer()
//     // const navigate = useNavigate()

//     const { crearOrden, capturarPago } = usePayPalStore()
//     const { items, limpiarCarrito } = useCarritoStore()
//     const { sessionId, liberarTodasLasReservas } = useReservaStore()

//     // ============================================================================
//     // VALIDACIONES INICIALES
//     // ============================================================================
//     if (items.length === 0) {
//         return (
//             <div className="text-center py-4 text-gray-500">
//                 No hay items en el carrito
//             </div>
//         )
//     }

//     if (!sessionId) {
//         return (
//             <div className="text-center py-4 text-red-500">
//                 Error: Sesión no válida. Recarga la página.
//             </div>
//         )
//     }

//     // ============================================================================
//     // CREAR ORDEN (cuando PayPal carga los botones)
//     // ============================================================================

//     const createOrder = async () => {
//         try {
//             console.log('🔵 PayPal: Creando orden...')

//             // Obtener IDs de todas las reservas del carrito
//             const reservasIds = items.map(item => item.reserva_id)

//             // Llamar al store para crear orden
//             const resultado = await crearOrden(reservasIds, sessionId, datosFacturacion)

//             if (!resultado.success || !resultado.order_id) {
//                 const errorMsg = resultado.error || 'Error al crear orden'
//                 console.error('❌ Error creando orden:', errorMsg)

//                 if (handleError) {
//                     handleError(errorMsg)
//                 }

//                 throw new Error(errorMsg)
//             }

//             console.log('✅ Orden creada:', resultado.order_id)
//             return resultado.order_id

//         } catch (error: any) {
//             console.error('❌ Error crítico en createOrder:', error)
//             toast.error('Error al crear orden', {
//                 description: error.message || 'Intenta de nuevo'
//             })
//             throw error
//         }
//     }

//     // const createOrder = async (): Promise<string> => {
//     //     try {
//     //         console.log('🔵 Iniciando createOrder...')
//     //         const reservasIds = items.map(item => item.reserva_id);



//     //         const resultado = await crearOrden(reservasIds, sessionId, datosFacturacion)

//     //         if (!resultado.success || !resultado.order_id) {
//     //             const errorMsg = resultado.error || 'Error al crear orden';
//     //             console.error('❌ Error creando orden:', errorMsg);
//     //             throw new Error(errorMsg);
//     //         }

//     //         return resultado.order_id; 
//     //     } catch (error) {
//     //         console.error('❌ Error completo:', error);
//     //         if (error instanceof Error) {
//     //             console.error('Stack:', error.stack);
//     //         } else {
//     //             console.error('Stack: No stack trace available');
//     //         }
//     //         throw error;
//     //     }
//     // }

//     // ============================================================================
//     // APROBAR PAGO (cuando el usuario aprueba en PayPal)
//     // ============================================================================


//     const onApprove = async (data: any) => {
//         try {
//             console.log('🟢 PayPal: Pago aprobado, capturando...', data.orderID)

//             // Capturar el pago
//             const resultado = await capturarPago(data.orderID)

//             if (!resultado.success) {
//                 const errorMsg = resultado.error || 'Error al procesar pago'
//                 console.error('❌ Error capturando pago:', errorMsg)

//                 if (onError) {
//                     onError(errorMsg)
//                 }

//                 toast.error('Error al procesar pago', {
//                     description: errorMsg
//                 })

//                 return
//             }

//             console.log('✅ Pago capturado exitosamente:', resultado.venta_id)

//             // Limpiar carrito y reservas
//             limpiarCarrito()
//             liberarTodasLasReservas()

//             // Callback de éxito
//             if (onSuccess && resultado.venta_id) {
//                 onSuccess(resultado.venta_id)
//             }

//             // Navegar a página de éxito
//             //   navigate(`/checkout/success?venta_id=${resultado.venta_id}`)
//             console.log('✅ PAGO EXITOSO! Venta ID:', resultado.venta_id)
//             toast.success('¡Pago completado!', {
//                 description: `Venta ID: ${resultado.venta_id}`,
//                 duration: 10000
//             })

//         } catch (error: any) {
//             console.error('❌ Error crítico en onApprove:', error)
//             toast.error('Error procesando pago', {
//                 description: error.message || 'Contacta con soporte'
//             })

//             if (handleError) {
//                 handleError(error.message || 'Error desconocido')
//             }
//         }
//     }

//     // ============================================================================
//     // CANCELAR (si el usuario cierra el popup)
//     // ============================================================================
//     const onCancel = () => {
//         console.log('⚠️ PayPal: Usuario canceló el pago')
//         toast.warning('Pago cancelado', {
//             description: 'Puedes intentar de nuevo cuando quieras'
//         })
//     }

//     // ============================================================================
//     // ERROR (si algo falla en PayPal)
//     // ============================================================================
//     const onError = (err: any) => {
//         console.error('❌ PayPal: Error en el proceso:', err)
//         toast.error('Error en PayPal', {
//             description: 'Intenta de nuevo o contacta con soporte'
//         })

//         if (handleError) {
//             handleError(err.message || 'Error de PayPal')
//         }
//     }

//     // ============================================================================
//     // LOADING STATE
//     // ============================================================================
//     if (isPending) {
//         return (
//             <div className="flex items-center justify-center py-8">
//                 <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//                 <span className="ml-2 text-gray-600">Cargando PayPal...</span>
//             </div>
//         )
//     }

//     // ============================================================================
//     // RENDER BOTONES
//     // ============================================================================
//     return (
//         <div className="w-full">
//             <PayPalButtons
//                 style={{
//                     layout: 'vertical',
//                     color: 'gold',
//                     shape: 'rect',
//                     label: 'paypal',
//                     height: 45

//                 }}
//                 createOrder={createOrder}
//                 onApprove={onApprove}
//                 onCancel={onCancel}
//                 onError={onError}
//                 forceReRender={[datosFacturacion, items.length]}

//             />
//         </div>
//     )
// }


import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useCarritoStore } from '@/stores/useCarritoStore'
import { useReservaStore } from '@/stores/useReservaStore'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { DatosFacturacion } from '../types/paypal.types'
import { usePayPalStore } from '@/stores/usePaypalStore'

interface PayPalButtonsWrapperProps {
    datosFacturacion: DatosFacturacion
    onSuccess?: (ventaId: string) => void
    handleError?: (error: string) => void
}

export const PayPalButtonsWrapper = ({
    datosFacturacion,
    onSuccess,
    handleError
}: PayPalButtonsWrapperProps) => {

    const [{ isPending }] = usePayPalScriptReducer()

    const { crearOrden, capturarPago } = usePayPalStore()
    const { items, limpiarCarrito } = useCarritoStore()
    const { sessionId, liberarTodasLasReservas } = useReservaStore()

    // ============================================================================
    // VALIDACIONES INICIALES
    // ============================================================================
    if (items.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                No hay items en el carrito
            </div>
        )
    }

    if (!sessionId) {
        return (
            <div className="text-center py-4 text-red-500">
                Error: Sesión no válida. Recarga la página.
            </div>
        )
    }

    // ============================================================================
    // CREAR ORDEN
    // ============================================================================
    const createOrder = async () => {
        try {
            console.log('🔵 PayPal: Creando orden...')

            const reservasIds = items.map(item => item.reserva_id)
            const resultado = await crearOrden(reservasIds, sessionId, datosFacturacion)

            if (!resultado.success || !resultado.order_id) {
                const errorMsg = resultado.error || 'Error al crear orden'
                console.error('❌ Error creando orden:', errorMsg)

                if (handleError) {
                    handleError(errorMsg)
                }

                throw new Error(errorMsg)
            }

            console.log('✅ Orden creada:', resultado.order_id)
            return resultado.order_id

        } catch (error: any) {
            console.error('❌ Error crítico en createOrder:', error)
            toast.error('Error al crear orden', {
                description: error.message || 'Intenta de nuevo'
            })
            throw error
        }
    }

    // ============================================================================
    // APROBAR PAGO - CORREGIDO ✅
    // ============================================================================
    const onApprove = async (data: any) => {
        try {
            console.log('🟢 PayPal: Pago aprobado, capturando...', data.orderID)

            // Capturar el pago
            const resultado = await capturarPago(data.orderID)

            if (!resultado.success) {
                const errorMsg = resultado.error || 'Error al procesar pago'
                console.error('❌ Error capturando pago:', errorMsg)

                // ✅ CORREGIDO: usar handleError en lugar de onError
                if (handleError) {
                    handleError(errorMsg)
                }

                toast.error('Error al procesar pago', {
                    description: errorMsg
                })

                return
            }

            console.log('✅ Pago capturado exitosamente:', resultado.venta_id)

            // Limpiar carrito y reservas
            limpiarCarrito()
            liberarTodasLasReservas()

            // Mostrar toast de éxito
            toast.success('¡Pago completado!', {
                description: `Venta ID: ${resultado.venta_id}`,
                duration: 10000
            })

            // ✅ Callback de éxito (esto navega o hace lo que necesites)
            if (onSuccess && resultado.venta_id) {
                onSuccess(resultado.venta_id)
            }

        } catch (error: any) {
            console.error('❌ Error crítico en onApprove:', error)
            toast.error('Error procesando pago', {
                description: error.message || 'Contacta con soporte'
            })

            if (handleError) {
                handleError(error.message || 'Error desconocido')
            }
        }
    }

    // ============================================================================
    // CANCELAR
    // ============================================================================
    const onCancel = () => {
        console.log('⚠️ PayPal: Usuario canceló el pago')
        toast.warning('Pago cancelado', {
            description: 'Puedes intentar de nuevo cuando quieras'
        })
    }

    // ============================================================================
    // ERROR
    // ============================================================================
    const onError = (err: any) => {
        console.error('❌ PayPal: Error en el proceso:', err)
        toast.error('Error en PayPal', {
            description: 'Intenta de nuevo o contacta con soporte'
        })

        if (handleError) {
            handleError(err.message || 'Error de PayPal')
        }
    }

    // ============================================================================
    // LOADING STATE
    // ============================================================================
    if (isPending) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Cargando PayPal...</span>
            </div>
        )
    }

    // ============================================================================
    // RENDER BOTONES
    // ============================================================================
    return (
        <div className="w-full">
            <PayPalButtons
                style={{
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal',
                    height: 45
                }}
                createOrder={createOrder}
                onApprove={onApprove}
                onCancel={onCancel}
                onError={onError}
                forceReRender={[datosFacturacion, items.length]}
            />
        </div>
    )
}