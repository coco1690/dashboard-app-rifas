

// import React, { useState, useEffect } from 'react'
// import { useVentaStore } from '@/stores/useVentaStore'
// import { useBoletoStore } from '@/stores/useBoletoStore'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// // import { Badge } from '@/components/ui/badge'
// import { RefreshCw, Package, CreditCard, User, AlertCircle, CheckCircle2, FileText } from 'lucide-react'
// import SelectorBoletosReservados from './SelectorBoletosReservados'

// interface SelectorPaquetesProps {
//   rifaId: string
//   agenciaId: string
//   refreshKey?: number
// }

// type TipoSeleccion = 'paquete' | 'personalizado'
// type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta'
// type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'

// const SelectorPaquetes: React.FC<SelectorPaquetesProps> = ({
//   rifaId,
//   agenciaId,
//   refreshKey = 0
// }) => {
//   // Store
//   const {
//     validarCantidadPaquete,
//     obtenerPaquetesPermitidos,
//     obtenerMinimoPersonalizado,
//     obtenerPrecioBoleta,
//     calcularTotal,
//     venderBoletos,
//     loading,
//     error,
//     mensaje,
//     limpiarMensajes
//   } = useVentaStore()

//   const { fetchEstadisticasRifa } = useBoletoStore()

//   // Estados del componente
//   const [tipoSeleccion, setTipoSeleccion] = useState<TipoSeleccion>('paquete')
//   const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<number>(3)
//   const [cantidadPersonalizada, setCantidadPersonalizada] = useState<number>(11)
//   const [boletosSeleccionados, setBoletosSeleccionados] = useState<string[]>([])
//   const [cedula, setCedula] = useState('')
//   const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
//   const [estadoPago, setEstadoPago] = useState<EstadoPago>('pagado') // Nuevo estado

//   // Estados para precio
//   const [precioBoleta, setPrecioBoleta] = useState<number>(0)
//   const [cargandoPrecio, setCargandoPrecio] = useState(false)
//   const [errorPrecio, setErrorPrecio] = useState<string | null>(null)
//   const [localRefreshKey, setLocalRefreshKey] = useState(0)

//   // Computadas
//   const paquetesPermitidos = obtenerPaquetesPermitidos()
//   const minimoPersonalizado = obtenerMinimoPersonalizado()
//   const cantidadSeleccionada = tipoSeleccion === 'paquete' ? paqueteSeleccionado : cantidadPersonalizada
//   const validacion = validarCantidadPaquete(cantidadSeleccionada)
//   const totalCalculado = calcularTotal(cantidadSeleccionada, precioBoleta)

//   // Validación del formulario
//   const isFormValid = validacion.valido &&
//     boletosSeleccionados.length === cantidadSeleccionada &&
//     precioBoleta > 0 &&
//     !cargandoPrecio &&
//     cedula.trim().length > 0

//   // Función para cargar precio
//   const cargarPrecio = async () => {
//     if (!rifaId) return

//     setCargandoPrecio(true)
//     setErrorPrecio(null)

//     try {
//       const precio = await obtenerPrecioBoleta(rifaId)
//       if (precio !== null) {
//         setPrecioBoleta(precio)
//       } else {
//         setErrorPrecio('No se pudo cargar el precio de la boleta')
//       }
//     } catch (error) {
//       setErrorPrecio('Error al cargar el precio')
//     } finally {
//       setCargandoPrecio(false)
//     }
//   }

//   // Función para resetear formulario
//   const resetearFormulario = () => {
//     setBoletosSeleccionados([])
//     setCedula('')
//     setMetodoPago('efectivo')
//     setEstadoPago('pagado')
//     setTipoSeleccion('paquete')
//     setPaqueteSeleccionado(3)
//     setCantidadPersonalizada(11)
//   }

//   // Función para actualizar componente
//   const actualizarComponente = () => {
//     limpiarMensajes()
//     resetearFormulario()
//     setErrorPrecio(null)
//     setLocalRefreshKey(prev => prev + 1)
//     cargarPrecio()
//   }

//   // Effects
//   useEffect(() => {
//     cargarPrecio()
//   }, [rifaId, refreshKey, localRefreshKey])

//   useEffect(() => {
//     if (mensaje || error) {
//       const timer = setTimeout(limpiarMensajes, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [mensaje, error, limpiarMensajes])

//   // Handlers
//   const handleCambioPersonalizado = (valor: number) => {
//     setCantidadPersonalizada(Math.max(minimoPersonalizado, valor))
//   }

//   const handleTipoSeleccionChange = (valor: string) => {
//     setTipoSeleccion(valor as TipoSeleccion)
//   }


//   const handleVenta = async () => {
//     if (!isFormValid) return

//     const resultado = await venderBoletos({
//       documento_identidad: cedula,
//       agenciaId,
//       rifaId,
//       boletos: boletosSeleccionados,
//       totalPago: totalCalculado,
//       metodoPago,
//       estadoPago
//     })

//     if (resultado) {
//       // ✅ CRÍTICO: Actualizar estado de boletos después de venta exitosa
//       console.log('🔄 Venta exitosa, actualizando estado de boletos en Zustand...')

//       // Invalidar caché para forzar recarga desde BD
//       invalidarCacheRifa(rifaId)

//       // Recargar boletos con datos actualizados (forzar = true)
//       await fetchBoletosRifa(rifaId, true)

//       console.log('✅ Estado de boletos actualizado y guardado en localStorage')

//       // Actualizar componentes
//       setLocalRefreshKey(prev => prev + 1)
//       setTimeout(resetearFormulario, 100)
//     }
//   }

//   // const handleVenta = async () => {
//   //   if (!isFormValid) return

//   //   const resultado = await venderBoletos({
//   //     documento_identidad: cedula,
//   //     agenciaId,
//   //     rifaId,
//   //     boletos: boletosSeleccionados,
//   //     totalPago: totalCalculado,
//   //     metodoPago,
//   //     estadoPago // Pasar el estado de pago
//   //   })

//   //   if (resultado) {
//   //     setLocalRefreshKey(prev => prev + 1)
//   //     setTimeout(resetearFormulario, 100)
//   //   }
//   // }

//   // Función para obtener el color del badge según el estado
//   // const getEstadoPagoBadgeColor = (estado: EstadoPago) => {
//   //   switch (estado) {
//   //     case 'pagado':
//   //       return 'bg-green-600 text-white'
//   //     case 'pendiente':
//   //       return 'bg-yellow-600 text-white'
//   //     case 'fallido':
//   //       return 'bg-red-600 text-white'
//   //     case 'reembolsado':
//   //       return 'bg-gray-600 text-white'
//   //     default:
//   //       return 'bg-gray-600 text-white'
//   //   }
//   // }

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2">
//             <Package className="h-5 w-5" />
//             Venta de Boletos por Paquetes
//           </CardTitle>
//           <Button
//             onClick={actualizarComponente}
//             disabled={loading || cargandoPrecio}
//             variant="outline"
//             size="sm"
//           >
//             <RefreshCw className={`h-4 w-4 mr-2 ${loading || cargandoPrecio ? 'animate-spin' : ''}`} />
//             Actualizar
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         {/* Mensajes de estado */}
//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {mensaje && (
//           <Alert>
//             <CheckCircle2 className="h-4 w-4" />
//             <AlertDescription>{mensaje}</AlertDescription>
//           </Alert>
//         )}

//         {errorPrecio && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{errorPrecio}</AlertDescription>
//           </Alert>
//         )}

//         {/* Información de precio */}
//         {/* {precioBoleta > 0 && (
//           <Card className="bg-blue-50 border-blue-200">
//             <CardContent className="pt-4">
//               <div className="flex justify-between items-center text-sm">
//                 <span>Precio por boleta:</span>
//                 <Badge variant="secondary">${precioBoleta.toLocaleString()}</Badge>
//               </div>
//               <div className="flex justify-between items-center text-sm mt-2">
//                 <span>Cantidad seleccionada:</span>
//                 <Badge>{cantidadSeleccionada}</Badge>
//               </div>
//               <div className="flex justify-between items-center text-sm mt-2">
//                 <span>Estado de pago:</span>
//                 <Badge className={getEstadoPagoBadgeColor(estadoPago)}>
//                   {estadoPago.charAt(0).toUpperCase() + estadoPago.slice(1)}
//                 </Badge>
//               </div>
//               <div className="flex justify-between items-center text-lg font-semibold mt-2 pt-2 border-t">
//                 <span>Total a pagar:</span>
//                 <Badge className="bg-green-600 text-white">
//                   ${totalCalculado.toLocaleString()}
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//         )} */}

//         {/* Selector de tipo de paquete */}
//         <div className="space-y-3">
//           <Label className="text-base font-medium">Tipo de Paquete</Label>
//           <RadioGroup
//             value={tipoSeleccion}
//             onValueChange={handleTipoSeleccionChange}
//             className="flex gap-6"
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="paquete" id="paquete" />
//               <Label htmlFor="paquete">Paquetes Predefinidos</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="personalizado" id="personalizado" />
//               <Label htmlFor="personalizado">Paquete Personalizado</Label>
//             </div>
//           </RadioGroup>
//         </div>

//         {/* Selector de paquetes predefinidos */}
//         {tipoSeleccion === 'paquete' && (
//           <div className="space-y-3">
//             <Label className="text-base font-medium">Seleccionar Paquete</Label>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               {paquetesPermitidos.map((cantidad) => {
//                 const totalPaquete = calcularTotal(cantidad, precioBoleta)
//                 const isSelected = paqueteSeleccionado === cantidad
//                 return (
//                   <Button
//                     key={cantidad}
//                     onClick={() => setPaqueteSeleccionado(cantidad)}
//                     disabled={cargandoPrecio}
//                     variant={isSelected ? "default" : "outline"}
//                     className="h-auto p-4 flex flex-col gap-1"
//                   >
//                     <span className="font-semibold">{cantidad} Boletos</span>
//                     <span className="text-xs opacity-75">
//                       ${totalPaquete.toLocaleString()}
//                     </span>
//                   </Button>
//                 )
//               })}
//             </div>
//           </div>
//         )}

//         {/* Input para paquete personalizado */}
//         {tipoSeleccion === 'personalizado' && (
//           <div className="space-y-2">
//             <Label htmlFor="cantidad-personalizada">
//               Cantidad de Boletos (Mínimo {minimoPersonalizado})
//             </Label>
//             <Input
//               id="cantidad-personalizada"
//               type="number"
//               min={minimoPersonalizado}
//               value={cantidadPersonalizada}
//               onChange={(e) => handleCambioPersonalizado(parseInt(e.target.value) || minimoPersonalizado)}
//               disabled={cargandoPrecio}
//               placeholder={`Ingrese cantidad (min. ${minimoPersonalizado})`}
//             />
//           </div>
//         )}

//         {/* Información de validación */}
//         {!validacion.valido && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{validacion.mensaje}</AlertDescription>
//           </Alert>
//         )}

//         {/* Formulario de cliente - Layout responsive mejorado */}
//         <div className="space-y-4">
//           {/* Cédula - Ocupa toda la fila en móvil */}
//           <div className="space-y-2">
//             <Label htmlFor="cedula" className="flex items-center gap-2">
//               <User className="h-4 w-4" />
//               Cédula del Cliente
//             </Label>
//             <Input
//               id="cedula"
//               type="text"
//               value={cedula}
//               onChange={(e) => setCedula(e.target.value)}
//               placeholder="Ingrese cédula"
//             />
//           </div>

//           {/* Método de Pago y Estado de Pago - Lado a lado en móvil */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="metodo-pago" className="flex items-center gap-2">
//                 <CreditCard className="h-4 w-4" />
//                 Método de Pago
//               </Label>
//               <Select value={metodoPago} onValueChange={(value) => setMetodoPago(value as MetodoPago)}>
//                 <SelectTrigger id="metodo-pago">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="efectivo">Efectivo</SelectItem>
//                   <SelectItem value="transferencia">Transferencia</SelectItem>
//                   <SelectItem value="tarjeta">Tarjeta</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="estado-pago" className="flex items-center gap-2">
//                 <FileText className="h-4 w-4" />
//                 Estado de Pago
//               </Label>
//               <Select value={estadoPago} onValueChange={(value) => setEstadoPago(value as EstadoPago)}>
//                 <SelectTrigger id="estado-pago">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="pendiente">Pendiente</SelectItem>
//                   <SelectItem value="pagado">Pagado</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         {/* Selector de boletos reservados */}
//         <div>
//           <SelectorBoletosReservados
//             key={rifaId}
//             rifaId={rifaId}
//             cantidadRequerida={cantidadSeleccionada}
//             onBoletosSeleccionados={setBoletosSeleccionados}
//             boletosSeleccionados={boletosSeleccionados}
//             refreshKey={localRefreshKey}
//           />
//         </div>

//         {/* Botón de venta */}
//         <Button
//           onClick={handleVenta}
//           disabled={!isFormValid || loading}
//           className="w-full"
//           size="lg"
//         >
//           {loading ? (
//             <>
//               <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//               Procesando Venta...
//             </>
//           ) : (
//             `Vender ${cantidadSeleccionada} Boletos - $${totalCalculado.toLocaleString()}`
//           )}
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }

// export default SelectorPaquetes


import React, { useState, useEffect } from 'react'
import { useVentaStore } from '@/stores/useVentaStore'
import { useBoletoStore } from '@/stores/useBoletoStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, Package, CreditCard, User, AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import SelectorBoletosReservados from './SelectorBoletosReservados'

interface SelectorPaquetesProps {
  rifaId: string
  agenciaId: string
  refreshKey?: number
}

type TipoSeleccion = 'paquete' | 'personalizado'
type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta'
type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'

const SelectorPaquetes: React.FC<SelectorPaquetesProps> = ({
  rifaId,
  agenciaId,
  refreshKey = 0
}) => {
  const {
    validarCantidadPaquete,
    obtenerPaquetesPermitidos,
    obtenerMinimoPersonalizado,
    obtenerPrecioBoleta,
    calcularTotal,
    venderBoletos,
    loading,
    error,
    mensaje,
    limpiarMensajes
  } = useVentaStore()

  const { fetchEstadisticasRifa } = useBoletoStore()

  const [tipoSeleccion, setTipoSeleccion] = useState<TipoSeleccion>('paquete')
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<number>(10)
  const [cantidadPersonalizada, setCantidadPersonalizada] = useState<number>(101)
  const [boletosSeleccionados, setBoletosSeleccionados] = useState<string[]>([])
  const [cedula, setCedula] = useState('')
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
  const [estadoPago, setEstadoPago] = useState<EstadoPago>('pagado')
  const [precioBoleta, setPrecioBoleta] = useState<number>(0)
  const [cargandoPrecio, setCargandoPrecio] = useState(false)
  const [errorPrecio, setErrorPrecio] = useState<string | null>(null)
  const [localRefreshKey, setLocalRefreshKey] = useState(0)
  const [enviarEmail, setEnviarEmail] = useState(true)

  const paquetesPermitidos = obtenerPaquetesPermitidos()
  const minimoPersonalizado = obtenerMinimoPersonalizado()
  const cantidadSeleccionada = tipoSeleccion === 'paquete' ? paqueteSeleccionado : cantidadPersonalizada
  const validacion = validarCantidadPaquete(cantidadSeleccionada)
  const totalCalculado = calcularTotal(cantidadSeleccionada, precioBoleta)

  const isFormValid = validacion.valido &&
    boletosSeleccionados.length === cantidadSeleccionada &&
    precioBoleta > 0 &&
    !cargandoPrecio &&
    cedula.trim().length > 0

  const cargarPrecio = async () => {
    if (!rifaId) return
    setCargandoPrecio(true)
    setErrorPrecio(null)
    try {
      const precio = await obtenerPrecioBoleta(rifaId)
      if (precio !== null) {
        setPrecioBoleta(precio)
      } else {
        setErrorPrecio('No se pudo cargar el precio de la boleta')
      }
    } catch (error) {
      setErrorPrecio('Error al cargar el precio')
    } finally {
      setCargandoPrecio(false)
    }
  }

  const resetearFormulario = () => {
    setBoletosSeleccionados([])
    setCedula('')
    setMetodoPago('efectivo')
    setEstadoPago('pagado')
    setTipoSeleccion('paquete')
    setPaqueteSeleccionado(10)
    setCantidadPersonalizada(101)
  }

  const actualizarComponente = () => {
    limpiarMensajes()
    resetearFormulario()
    setErrorPrecio(null)
    setLocalRefreshKey(prev => prev + 1)
    cargarPrecio()
  }

  useEffect(() => {
    cargarPrecio()
  }, [rifaId, refreshKey, localRefreshKey])

  useEffect(() => {
    if (mensaje || error) {
      const timer = setTimeout(limpiarMensajes, 5000)
      return () => clearTimeout(timer)
    }
  }, [mensaje, error, limpiarMensajes])

  const handleCambioPersonalizado = (valor: number) => {
    setCantidadPersonalizada(Math.max(minimoPersonalizado, valor))
  }

  const handleTipoSeleccionChange = (valor: string) => {
    setTipoSeleccion(valor as TipoSeleccion)
  }

  const handleVenta = async () => {
    if (!isFormValid) return

    const resultado = await venderBoletos({
      documento_identidad: cedula,
      agenciaId,
      rifaId,
      boletos: boletosSeleccionados,
      totalPago: totalCalculado,
      metodoPago,
      estadoPago,
      enviarEmail: enviarEmail
    })

    if (resultado) {
      console.log('🔄 Venta exitosa, actualizando estadísticas...')

      // ✅ Actualizar estadísticas después de venta
      await fetchEstadisticasRifa(rifaId)

      console.log('✅ Estadísticas actualizadas')

      setLocalRefreshKey(prev => prev + 1)
      setTimeout(resetearFormulario, 100)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Venta de Boletos por Paquetes
          </CardTitle>
          <Button
            onClick={actualizarComponente}
            disabled={loading || cargandoPrecio}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading || cargandoPrecio ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mensaje && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{mensaje}</AlertDescription>
          </Alert>
        )}

        {errorPrecio && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorPrecio}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Label className="text-base font-medium">Tipo de Paquete</Label>
          <RadioGroup
            value={tipoSeleccion}
            onValueChange={handleTipoSeleccionChange}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paquete" id="paquete" />
              <Label htmlFor="paquete">Paquetes Predefinidos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="personalizado" id="personalizado" />
              <Label htmlFor="personalizado">Paquete Personalizado</Label>
            </div>
          </RadioGroup>
        </div>

        {tipoSeleccion === 'paquete' && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Seleccionar Paquete</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paquetesPermitidos.map((cantidad) => {
                const totalPaquete = calcularTotal(cantidad, precioBoleta)
                const isSelected = paqueteSeleccionado === cantidad
                return (
                  <Button
                    key={cantidad}
                    onClick={() => setPaqueteSeleccionado(cantidad)}
                    disabled={cargandoPrecio}
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col gap-1"
                  >
                    <span className="font-semibold">{cantidad} Boletos</span>
                    <span className="text-xs opacity-75">
                      ${totalPaquete.toLocaleString()}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {tipoSeleccion === 'personalizado' && (
          <div className="space-y-2">
            <Label htmlFor="cantidad-personalizada">
              Cantidad de Boletos (Mínimo {minimoPersonalizado})
            </Label>
            <Input
              id="cantidad-personalizada"
              type="number"
              min={minimoPersonalizado}
              value={cantidadPersonalizada}
              onChange={(e) => handleCambioPersonalizado(parseInt(e.target.value) || minimoPersonalizado)}
              disabled={cargandoPrecio}
              placeholder={`Ingrese cantidad (min. ${minimoPersonalizado})`}
            />
          </div>
        )}

        {!validacion.valido && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validacion.mensaje}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cedula" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Cédula del Cliente
            </Label>
            <Input
              id="cedula"
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ingrese cédula"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metodo-pago" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Método de Pago
              </Label>
              <Select value={metodoPago} onValueChange={(value) => setMetodoPago(value as MetodoPago)}>
                <SelectTrigger id="metodo-pago">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado-pago" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Estado de Pago
              </Label>
              <Select value={estadoPago} onValueChange={(value) => setEstadoPago(value as EstadoPago)}>
                <SelectTrigger id="estado-pago">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enviar-email"
                checked={enviarEmail}
                onChange={(e) => setEnviarEmail(e.target.checked)}
              />
              <Label htmlFor="enviar-email">Enviar confirmación por email</Label>
            </div>
          </div>
        </div>

        <div>
          <SelectorBoletosReservados
            key={rifaId}
            rifaId={rifaId}
            cantidadRequerida={cantidadSeleccionada}
            onBoletosSeleccionados={setBoletosSeleccionados}
            boletosSeleccionados={boletosSeleccionados}
            refreshKey={localRefreshKey}
          />
        </div>

        <Button
          onClick={handleVenta}
          disabled={!isFormValid || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Procesando Venta...
            </>
          ) : (
            `Vender ${cantidadSeleccionada} Boletos - $${totalCalculado.toLocaleString()}`
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export default SelectorPaquetes
