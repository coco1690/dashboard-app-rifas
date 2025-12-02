// // src/pages/carrito/CarritoPage.tsx

// import { useState } from 'react'
// import { useNavigate } from 'react-router'

// import { Button } from '@/components/ui/button'
// import { ArrowLeft, CreditCard } from 'lucide-react'

// import { useCarrito } from '@/stores/useCarritoStore'
// import { toast } from 'sonner'
// import type { DatosCliente } from '../types/carrito'
// import { DatosFacturacion } from '../components/DatosFacturacion'
// import { ResumenPedido } from '../components/ResumenPedido'

// const DATOS_INICIALES: DatosCliente = {
//   tipoDocumento: 'cedula',
//   numeroDocumento: '',
//   nombres: '',
//   apellidos: '',
//   email: '',
//   confirmarEmail: '',
//   telefono: '',
//   direccion: '',
//   pais: 'Ecuador',
//   ciudad: '',
//   provincia: ''
// }

// export const CarritoPage = () => {
//   const navigate = useNavigate()
//   const { items, isEmpty } = useCarrito()
  
//   const [datosCliente, setDatosCliente] = useState<DatosCliente>(DATOS_INICIALES)
//   const [errores, setErrores] = useState<Partial<Record<keyof DatosCliente, string>>>({})
//   const [procesando, setProcesando] = useState(false)

//   // Validar formulario
//   const validarFormulario = (): boolean => {
//     const nuevosErrores: Partial<Record<keyof DatosCliente, string>> = {}

//     // Tipo documento
//     if (!datosCliente.tipoDocumento) {
//       nuevosErrores.tipoDocumento = 'Selecciona un tipo de documento'
//     }

//     // Número documento
//     if (!datosCliente.numeroDocumento.trim()) {
//       nuevosErrores.numeroDocumento = 'Ingresa tu número de documento'
//     } else if (datosCliente.tipoDocumento === 'cedula' && datosCliente.numeroDocumento.length !== 10) {
//       nuevosErrores.numeroDocumento = 'La cédula debe tener 10 dígitos'
//     }

//     // Nombres
//     if (!datosCliente.nombres.trim()) {
//       nuevosErrores.nombres = 'Ingresa tus nombres'
//     }

//     // Apellidos
//     if (!datosCliente.apellidos.trim()) {
//       nuevosErrores.apellidos = 'Ingresa tus apellidos'
//     }

//     // Email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!datosCliente.email.trim()) {
//       nuevosErrores.email = 'Ingresa tu correo electrónico'
//     } else if (!emailRegex.test(datosCliente.email)) {
//       nuevosErrores.email = 'Ingresa un correo válido'
//     }

//     // Confirmar email
//     if (!datosCliente.confirmarEmail.trim()) {
//       nuevosErrores.confirmarEmail = 'Confirma tu correo electrónico'
//     } else if (datosCliente.email !== datosCliente.confirmarEmail) {
//       nuevosErrores.confirmarEmail = 'Los correos no coinciden'
//     }

//     // Teléfono
//     if (!datosCliente.telefono.trim()) {
//       nuevosErrores.telefono = 'Ingresa tu teléfono'
//     } else if (datosCliente.telefono.length < 9) {
//       nuevosErrores.telefono = 'Teléfono inválido'
//     }

//     // Dirección
//     if (!datosCliente.direccion.trim()) {
//       nuevosErrores.direccion = 'Ingresa tu dirección'
//     }

//     // Ciudad
//     if (!datosCliente.ciudad.trim()) {
//       nuevosErrores.ciudad = 'Ingresa tu ciudad'
//     }

//     // Provincia
//     if (!datosCliente.provincia) {
//       nuevosErrores.provincia = 'Selecciona tu provincia'
//     }

//     setErrores(nuevosErrores)
//     return Object.keys(nuevosErrores).length === 0
//   }

//   // Proceder al pago
//   const handleProcederPago = async () => {
//     if (!validarFormulario()) {
//       toast.error('Formulario incompleto', {
//         description: 'Por favor completa todos los campos requeridos'
//       })
//       return
//     }

//     setProcesando(true)

//     try {
//       // Aquí irá la lógica de PayPal en la siguiente fase
//       console.log('📝 Datos del cliente:', datosCliente)
//       console.log('🛒 Items del carrito:', items)
      
//       toast.success('Datos validados', {
//         description: 'Redirigiendo al pago...'
//       })
      
//       // Por ahora solo simular delay
//       await new Promise(resolve => setTimeout(resolve, 1000))
      
//     } catch (error) {
//       console.error('Error procesando pago:', error)
//       toast.error('Error al procesar', {
//         description: 'Intenta de nuevo'
//       })
//     } finally {
//       setProcesando(false)
//     }
//   }

//   // Si el carrito está vacío
//   if (isEmpty) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="text-6xl mb-4">🛒</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Tu carrito está vacío
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Agrega algunos números para continuar
//           </p>
//           <Button
//             onClick={() => navigate('/')}
//             className="bg-amber-500 hover:bg-amber-600"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver al inicio
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <Button
//             variant="ghost"
//             onClick={() => navigate('/')}
//             className="mb-4"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Seguir comprando
//           </Button>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Finalizar Compra
//           </h1>
//         </div>

//         {/* Grid de 2 columnas */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Columna izquierda: Formulario */}
//           <div className="lg:col-span-2">
//             <DatosFacturacion
//               datos={datosCliente}
//               onChange={setDatosCliente}
//               errores={errores}
//             />

//             {/* Botón de proceder (móvil) */}
//             <div className="lg:hidden mt-6">
//               <Button
//                 size="lg"
//                 className="w-full bg-amber-500 hover:bg-amber-600 text-white"
//                 onClick={handleProcederPago}
//                 disabled={procesando}
//               >
//                 <CreditCard className="w-5 h-5 mr-2" />
//                 {procesando ? 'Procesando...' : 'Proceder al Pago'}
//               </Button>
//             </div>
//           </div>

//           {/* Columna derecha: Resumen */}
//           <div className="lg:col-span-1">
//             <div className="space-y-4">
//               <ResumenPedido />
              
//               {/* Botón de proceder (desktop) */}
//               <div className="hidden lg:block">
//                 <Button
//                   size="lg"
//                   className="w-full bg-amber-500 hover:bg-amber-600 text-white"
//                   onClick={handleProcederPago}
//                   disabled={procesando}
//                 >
//                   <CreditCard className="w-5 h-5 mr-2" />
//                   {procesando ? 'Procesando...' : 'Proceder al Pago'}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useCarrito } from '@/stores/useCarritoStore'
import { useReservaStore } from '@/stores/useReservaStore'
import { toast } from 'sonner'
import type { DatosCliente } from '../types/carrito'
import type { DatosFacturacion as DatosFacturacionPayPal } from '@/paypal/types/paypal.types'
import { DatosFacturacion } from '../components/DatosFacturacion'
import { ResumenPedido } from '../components/ResumenPedido'

const DATOS_INICIALES: DatosCliente = {
  tipoDocumento: 'cedula',
  numeroDocumento: '',
  nombres: '',
  apellidos: '',
  email: '',
  confirmarEmail: '',
  telefono: '',
  direccion: '',
  pais: 'Ecuador',
  ciudad: '',
  provincia: ''
}

export const CarritoPage = () => {
  const navigate = useNavigate()
  const { isEmpty } = useCarrito()
  const { sessionId } = useReservaStore()
  
  const [datosCliente, setDatosCliente] = useState<DatosCliente>(DATOS_INICIALES)
  const [errores, setErrores] = useState<Partial<Record<keyof DatosCliente, string>>>({})
  const [datosValidados, setDatosValidados] = useState<DatosFacturacionPayPal | null>(null)

  const formularioValido = useMemo(() => {
  return (
    !!datosCliente.tipoDocumento &&
    datosCliente.numeroDocumento.length >= 10 &&
    datosCliente.nombres.trim() !== '' &&
    datosCliente.apellidos.trim() !== '' &&
    datosCliente.email.includes('@') &&
    datosCliente.confirmarEmail === datosCliente.email &&
    datosCliente.telefono.length >= 9 &&
    datosCliente.direccion.trim() !== '' &&
    datosCliente.ciudad.trim() !== '' &&
    datosCliente.provincia !== ''
  )
}, [datosCliente])

  // Validar formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<Record<keyof DatosCliente, string>> = {}

    if (!datosCliente.tipoDocumento) {
      nuevosErrores.tipoDocumento = 'Selecciona un tipo de documento'
    }

    if (!datosCliente.numeroDocumento.trim()) {
      nuevosErrores.numeroDocumento = 'Ingresa tu número de documento'
    } else if (datosCliente.tipoDocumento === 'cedula' && datosCliente.numeroDocumento.length !== 10) {
      nuevosErrores.numeroDocumento = 'La cédula debe tener 10 dígitos'
    }

    if (!datosCliente.nombres.trim()) {
      nuevosErrores.nombres = 'Ingresa tus nombres'
    }

    if (!datosCliente.apellidos.trim()) {
      nuevosErrores.apellidos = 'Ingresa tus apellidos'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!datosCliente.email.trim()) {
      nuevosErrores.email = 'Ingresa tu correo electrónico'
    } else if (!emailRegex.test(datosCliente.email)) {
      nuevosErrores.email = 'Ingresa un correo válido'
    }

    if (!datosCliente.confirmarEmail.trim()) {
      nuevosErrores.confirmarEmail = 'Confirma tu correo electrónico'
    } else if (datosCliente.email !== datosCliente.confirmarEmail) {
      nuevosErrores.confirmarEmail = 'Los correos no coinciden'
    }

    if (!datosCliente.telefono.trim()) {
      nuevosErrores.telefono = 'Ingresa tu teléfono'
    } else if (datosCliente.telefono.length < 9) {
      nuevosErrores.telefono = 'Teléfono inválido'
    }

    if (!datosCliente.direccion.trim()) {
      nuevosErrores.direccion = 'Ingresa tu dirección'
    }

    if (!datosCliente.ciudad.trim()) {
      nuevosErrores.ciudad = 'Ingresa tu ciudad'
    }

    if (!datosCliente.provincia) {
      nuevosErrores.provincia = 'Selecciona tu provincia'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Proceder al pago
  const handleProcederPago = () => {
    if (!validarFormulario()) {
      toast.error('Formulario incompleto', {
        description: 'Por favor completa todos los campos requeridos'
      })
      return
    }

    if (!sessionId) {
      toast.error('Error de sesión', {
        description: 'Por favor recarga la página'
      })
      return
    }

    // Convertir datos y mostrar PayPal
    setDatosValidados({
      nombre: `${datosCliente.nombres} ${datosCliente.apellidos}`.trim(),
      cedula: datosCliente.numeroDocumento,
      email: datosCliente.email,
      telefono: datosCliente.telefono
    })

    toast.success('Datos validados', {
      description: 'Completa el pago con PayPal'
    })
  }

  // Callbacks de PayPal
  const handlePayPalSuccess = (ventaId: string) => {
    toast.success('¡Compra exitosa!', {
      description: 'Redirigiendo...'
    })
    navigate(`/checkout/success?venta_id=${ventaId}`)
  }

  const handlePayPalError = (error: string) => {
    toast.error('Error en el pago', { description: error })
    setDatosValidados(null) // Volver a mostrar botón
  }

  // Volver a editar datos
  const handleVolverEditar = () => {
    setDatosValidados(null)
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-6">
            Agrega algunas imágenes para continuar
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Seguir comprando
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Finalizar Compra
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <DatosFacturacion
              datos={datosCliente}
              onChange={setDatosCliente}
              errores={errores}
            />

            {datosValidados && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  onClick={handleVolverEditar}
                  className="text-gray-600"
                >
                  ← Volver a editar datos
                </Button>
              </div>
            )}
          </div>

          {/* Resumen con PayPal */}
          <div className="lg:col-span-1">
            <ResumenPedido
              datosFacturacion={datosValidados}
              formularioValido={formularioValido}
              onProcederPago={handleProcederPago}
              onPayPalSuccess={handlePayPalSuccess}
              onPayPalError={handlePayPalError}
            />
          </div>
        </div>
      </div>
    </div>
  )
}