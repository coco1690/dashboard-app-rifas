// import React, { useState, useEffect } from 'react'
// import { useVentaStore, getPaquetesPorDigitos, getMinimoPorDigitos, obtenerDigitosRifa, validarCantidad } from '@/stores/useVentaStore'
// import { useBoletoStore } from '@/stores/useBoletoStore'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
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
//   // ============================================================================
//   // STORE HOOKS
//   // ============================================================================
//   const {
//     obtenerPrecioBoleta,
//     calcularTotal,
//     venderBoletos,
//     loading,
//     error,
//     mensaje,
//     limpiarMensajes
//   } = useVentaStore()

//   const { fetchEstadisticasRifa } = useBoletoStore()

//   // ============================================================================
//   // ESTADOS LOCALES
//   // ============================================================================
//   const [tipoSeleccion, setTipoSeleccion] = useState<TipoSeleccion>('paquete')
//   const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<number>(10)
//   const [cantidadPersonalizada, setCantidadPersonalizada] = useState<number>(1)
//   const [boletosSeleccionados, setBoletosSeleccionados] = useState<string[]>([])
//   const [cedula, setCedula] = useState('')
//   const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')
//   const [estadoPago, setEstadoPago] = useState<EstadoPago>('pagado')
//   const [precioBoleta, setPrecioBoleta] = useState<number>(0)
//   const [cargandoPrecio, setCargandoPrecio] = useState(false)
//   const [errorPrecio, setErrorPrecio] = useState<string | null>(null)
//   const [localRefreshKey, setLocalRefreshKey] = useState(0)
//   const [enviarEmail, setEnviarEmail] = useState(true)

//   // Estados para paquetes dinámicos
//   const [paquetesPermitidos, setPaquetesPermitidos] = useState<number[]>([10, 12, 15, 20, 50, 100])
//   const [minimoPersonalizado, setMinimoPersonalizado] = useState<number>(1)
//   const [cargandoPaquetes, setCargandoPaquetes] = useState(false)
//   const [digitosRifa, setDigitosRifa] = useState<number>(4)

//   // ============================================================================
//   // COMPUTED VALUES
//   // ============================================================================
//   const cantidadSeleccionada = tipoSeleccion === 'paquete' ? paqueteSeleccionado : cantidadPersonalizada

//   const validacion = validarCantidad(
//     cantidadSeleccionada,
//     paquetesPermitidos,
//     minimoPersonalizado,
//     tipoSeleccion
//   )

//   const totalCalculado = calcularTotal(cantidadSeleccionada, precioBoleta)

//   const isFormValid = validacion.valido &&
//     boletosSeleccionados.length === cantidadSeleccionada &&
//     precioBoleta > 0 &&
//     !cargandoPrecio &&
//     cedula.trim().length > 0

//   // ============================================================================
//   // FUNCIONES DE CARGA DE DATOS
//   // ============================================================================

//   /**
//    * Carga los paquetes permitidos según los dígitos de la rifa
//    */
//   const cargarPaquetes = async () => {
//     if (!rifaId) return

//     setCargandoPaquetes(true)
//     try {
//       const digitos = await obtenerDigitosRifa(rifaId)
//       const paquetes = getPaquetesPorDigitos(digitos)
//       const minimo = getMinimoPorDigitos(digitos)

//       setDigitosRifa(digitos)
//       setPaquetesPermitidos(paquetes)
//       setMinimoPersonalizado(minimo)

//       // Ajustar paquete seleccionado si no está en la nueva lista
//       if (!paquetes.includes(paqueteSeleccionado)) {
//         setPaqueteSeleccionado(paquetes[0])
//       }

//       // Ajustar cantidad personalizada si es menor al nuevo mínimo
//       if (cantidadPersonalizada < minimo) {
//         setCantidadPersonalizada(minimo)
//       }

//       console.log(`📦 Paquetes cargados para rifa con ${digitos} dígitos:`, paquetes, `| Mínimo: ${minimo}`)
//     } catch (error) {
//       console.error('Error cargando paquetes:', error)
//       setErrorPrecio('Error al cargar configuración de paquetes')
//     } finally {
//       setCargandoPaquetes(false)
//     }
//   }

//   /**
//    * Carga el precio de la boleta desde la base de datos
//    */
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

//   // ============================================================================
//   // HANDLERS
//   // ============================================================================

//   /**
//    * Resetea el formulario a sus valores iniciales
//    */
//   const resetearFormulario = () => {
//     setBoletosSeleccionados([])
//     setCedula('')
//     setMetodoPago('efectivo')
//     setEstadoPago('pagado')
//     setTipoSeleccion('paquete')
//     // No reseteamos paqueteSeleccionado ni cantidadPersonalizada
//     // porque se ajustan automáticamente en cargarPaquetes
//   }

//   /**
//    * Actualiza todo el componente (recarga datos y resetea formulario)
//    */
//   const actualizarComponente = () => {
//     limpiarMensajes()
//     resetearFormulario()
//     setErrorPrecio(null)
//     setLocalRefreshKey(prev => prev + 1)
//     cargarPaquetes()
//     cargarPrecio()
//   }

//   /**
//    * Maneja el cambio de cantidad personalizada
//    */
//   const handleCambioPersonalizado = (valor: number) => {
//     setCantidadPersonalizada(Math.max(minimoPersonalizado, valor))
//   }

//   /**
//    * Maneja el cambio de tipo de selección (paquete/personalizado)
//    */
//   const handleTipoSeleccionChange = (valor: string) => {
//     setTipoSeleccion(valor as TipoSeleccion)
//   }

//   /**
//    * Procesa la venta de boletos
//    */
//   const handleVenta = async () => {
//     if (!isFormValid) return

//     const resultado = await venderBoletos({
//       documento_identidad: cedula,
//       agenciaId,
//       rifaId,
//       boletos: boletosSeleccionados,
//       totalPago: totalCalculado,
//       metodoPago,
//       estadoPago,
//       enviarEmail: enviarEmail
//     })

//     if (resultado) {
//       console.log('🔄 Venta exitosa, actualizando estadísticas...')

//       // Actualizar estadísticas después de venta
//       await fetchEstadisticasRifa(rifaId)

//       console.log('✅ Estadísticas actualizadas')

//       setLocalRefreshKey(prev => prev + 1)
//       setTimeout(resetearFormulario, 100)
//     }
//   }

//   // ============================================================================
//   // EFFECTS
//   // ============================================================================

//   /**
//    * Carga paquetes y precio cuando cambia la rifa
//    */
//   useEffect(() => {
//     cargarPaquetes()
//     cargarPrecio()
//   }, [rifaId, refreshKey, localRefreshKey])

//   /**
//    * Limpia mensajes automáticamente después de 5 segundos
//    */
//   useEffect(() => {
//     if (mensaje || error) {
//       const timer = setTimeout(limpiarMensajes, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [mensaje, error, limpiarMensajes])

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2">
//             <Package className="h-5 w-5" />
//             Venta de Boletos por Paquetes
//             {digitosRifa && (
//               <span className="text-sm font-normal text-muted-foreground">
//                 ({digitosRifa} dígitos)
//               </span>
//             )}
//           </CardTitle>
//           <Button
//             onClick={actualizarComponente}
//             disabled={loading || cargandoPrecio || cargandoPaquetes}
//             variant="outline"
//             size="sm"
//           >
//             <RefreshCw className={`h-4 w-4 mr-2 ${(loading || cargandoPrecio || cargandoPaquetes) ? 'animate-spin' : ''}`} />
//             Actualizar
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         {/* Alertas de error y éxito */}
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
//               <Label htmlFor="personalizado">Paquete Personalizado (min. {minimoPersonalizado})</Label>
//             </div>
//           </RadioGroup>
//         </div>

//         {/* Paquetes predefinidos */}
//         {tipoSeleccion === 'paquete' && (
//           <div className="space-y-3">
//             <Label className="text-base font-medium">Seleccionar Paquete</Label>
//             {cargandoPaquetes ? (
//               <div className="flex justify-center py-8">
//                 <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {paquetesPermitidos.map((cantidad) => {
//                   const totalPaquete = calcularTotal(cantidad, precioBoleta)
//                   const isSelected = paqueteSeleccionado === cantidad
//                   return (
//                     <Button
//                       key={cantidad}
//                       onClick={() => setPaqueteSeleccionado(cantidad)}
//                       disabled={cargandoPrecio}
//                       variant={isSelected ? "default" : "outline"}
//                       className="h-auto p-4 flex flex-col gap-1"
//                     >
//                       <span className="font-semibold">{cantidad} Boletos</span>
//                       <span className="text-xs opacity-75">
//                         ${totalPaquete.toLocaleString()}
//                       </span>
//                     </Button>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Paquete personalizado */}
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
//               disabled={cargandoPrecio || cargandoPaquetes}
//               placeholder={`Ingrese cantidad (min. ${minimoPersonalizado})`}
//             />
//             <p className="text-xs text-muted-foreground">
//               Total: ${calcularTotal(cantidadPersonalizada, precioBoleta).toLocaleString()}
//             </p>
//           </div>
//         )}

//         {/* Mensaje de validación */}
//         {!validacion.valido && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{validacion.mensaje}</AlertDescription>
//           </Alert>
//         )}

//         {/* Información del cliente y pago */}
//         <div className="space-y-4">
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

//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="enviar-email"
//               checked={enviarEmail}
//               onChange={(e) => setEnviarEmail(e.target.checked)}
//               className="rounded"
//             />
//             <Label htmlFor="enviar-email" className="cursor-pointer">
//               Enviar confirmación por email
//             </Label>
//           </div>
//         </div>

//         {/* Selector de boletos */}
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
import { useVentaStore, getPaquetesPorDigitos, getMinimoPorDigitos, obtenerDigitosRifa, validarCantidad } from '@/stores/useVentaStore'
import { useBoletoStore } from '@/stores/useBoletoStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, Package, AlertCircle, CheckCircle2 } from 'lucide-react'
import { TipoVentaSelector } from './TipoVentaSelector'
import { SelectorTipoPaquete } from './SelectorTipoPaquete'
// import { GridPaquetesPredefinidos } from './GridPaquetesPredefinidos'
import { InputCantidadPersonalizada } from './InputCantidadPersonalizada'
import { FormularioCliente } from './FormularioCliente'
import { MetodoPagoSelector } from './MetodoPagoSelector'
import { BotonVenta } from './BotonVenta'
import SelectorBoletosReservados from './SelectorBoletosReservados'
import type { Country } from '@/lib/countries'
import { Badge } from '@/components/ui/badge'
import { FlagIcon } from '@/components/ui/FlagIcon'

interface SelectorPaquetesProps {
  rifaId: string
  agenciaId: string
  refreshKey?: number
}

const SelectorPaquetes: React.FC<SelectorPaquetesProps> = ({
  rifaId,
  agenciaId,
  refreshKey = 0
}) => {
  const {
    obtenerPrecioBoleta,
    calcularTotal,
    venderBoletos,
    venderBoletosPorWhatsApp,
    loading,
    error,
    mensaje,
    errorWhatsApp,
    limpiarMensajes
  } = useVentaStore()

  const { fetchEstadisticasRifa } = useBoletoStore()

  // Estados
  const [tipoSeleccion, setTipoSeleccion] = useState<'paquete' | 'personalizado'>('personalizado')
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(10)
  const [cantidadPersonalizada, setCantidadPersonalizada] = useState(1)
  const [boletosSeleccionados, setBoletosSeleccionados] = useState<string[]>([])
  const [tipoVenta, setTipoVenta] = useState<'email' | 'whatsapp'>('email')
  const [cedula, setCedula] = useState('')
  const [enviarEmail, setEnviarEmail] = useState(true)
  const [documento, setDocumento] = useState('')
  const [nombreCliente, setNombreCliente] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo')
  const [estadoPago, setEstadoPago] = useState<'pendiente' | 'pagado'>('pagado')
  const [precioBoleta, setPrecioBoleta] = useState(0)
  const [cargandoPrecio, setCargandoPrecio] = useState(false)
  const [errorPrecio, setErrorPrecio] = useState<string | null>(null)
  const [localRefreshKey, setLocalRefreshKey] = useState(0)
  const [paquetesPermitidos, setPaquetesPermitidos] = useState<number[]>([10, 12, 15, 20, 50, 100])
  const [minimoPersonalizado, setMinimoPersonalizado] = useState(1)
  const [cargandoPaquetes, setCargandoPaquetes] = useState(false)
  // const [digitosRifa, setDigitosRifa] = useState(4)

  const cantidadSeleccionada = tipoSeleccion === 'paquete' ? paqueteSeleccionado : cantidadPersonalizada
  const validacion = validarCantidad(cantidadSeleccionada, paquetesPermitidos, minimoPersonalizado, tipoSeleccion)
  const totalCalculado = calcularTotal(cantidadSeleccionada, precioBoleta)

  const [paisWhatsApp, setPaisWhatsApp] = useState<Country | null>(null)

  const isFormValid = validacion.valido &&
    boletosSeleccionados.length === cantidadSeleccionada &&
    precioBoleta > 0 &&
    !cargandoPrecio &&
    (tipoVenta === 'email'
      ? cedula.trim().length > 0
      : documento.trim().length > 0 && nombreCliente.trim().length > 0 && whatsapp.trim().length > 0
    )

  // Funciones
  const cargarPaquetes = async () => {
    if (!rifaId) return
    setCargandoPaquetes(true)
    try {
      const digitos = await obtenerDigitosRifa(rifaId)
      const paquetes = getPaquetesPorDigitos(digitos)
      const minimo = getMinimoPorDigitos(digitos)
      // setDigitosRifa(digitos)
      setPaquetesPermitidos(paquetes)
      setMinimoPersonalizado(minimo)
      if (!paquetes.includes(paqueteSeleccionado)) setPaqueteSeleccionado(paquetes[0])
      if (cantidadPersonalizada < minimo) setCantidadPersonalizada(minimo)
    } catch (error) {
      setErrorPrecio('Error al cargar configuración de paquetes')
    } finally {
      setCargandoPaquetes(false)
    }
  }

  const cargarPrecio = async () => {
    if (!rifaId) return
    setCargandoPrecio(true)
    setErrorPrecio(null)
    try {
      const precio = await obtenerPrecioBoleta(rifaId)
      if (precio !== null) setPrecioBoleta(precio)
      else setErrorPrecio('No se pudo cargar el precio de la boleta')
    } catch (error) {
      setErrorPrecio('Error al cargar el precio')
    } finally {
      setCargandoPrecio(false)
    }
  }

  const resetearFormulario = () => {
    setBoletosSeleccionados([])
    setCedula('')
    setDocumento('')
    setNombreCliente('')
    setWhatsapp('')
    setPaisWhatsApp(null)
    setMetodoPago('efectivo')
    setEstadoPago('pagado')
    // setTipoSeleccion('paquete')
    setTipoSeleccion('personalizado')
    setEnviarEmail(true)
  }

  const actualizarComponente = () => {
    limpiarMensajes()
    resetearFormulario()
    setErrorPrecio(null)
    setLocalRefreshKey(prev => prev + 1)
    cargarPaquetes()
    cargarPrecio()
  }

  const handleTipoVentaChange = (valor: 'email' | 'whatsapp') => {
    setTipoVenta(valor)
    setCedula('')
    setDocumento('')
    setNombreCliente('')
    setWhatsapp('')
    setPaisWhatsApp(null)
  }

  const handleVenta = async () => {
    if (!isFormValid) return

    let resultado
    if (tipoVenta === 'whatsapp') {
      resultado = await venderBoletosPorWhatsApp({
        documento_identidad: documento,
        nombre: nombreCliente,
        phone: whatsapp,
        agenciaId,
        rifaId,
        boletos: boletosSeleccionados,
        totalPago: totalCalculado,
        metodoPago,
        estadoPago
      })
    } else {
      resultado = await venderBoletos({
        documento_identidad: cedula,
        agenciaId,
        rifaId,
        boletos: boletosSeleccionados,
        totalPago: totalCalculado,
        metodoPago,
        estadoPago,
        enviarEmail
      })
    }

    if (resultado) {
      await fetchEstadisticasRifa(rifaId)
      setLocalRefreshKey(prev => prev + 1)
      setTimeout(resetearFormulario, 100)
    }
  }

  const handleWhatsAppChange = (fullNumber: string, country: Country) => {
    setWhatsapp(fullNumber) // Guarda número completo: +573001234567
    setPaisWhatsApp(country)
    console.log('📱 Número actualizado:', fullNumber, 'País:', country.name)
  }

  useEffect(() => {
    cargarPaquetes()
    cargarPrecio()
  }, [rifaId, refreshKey, localRefreshKey])

  useEffect(() => {
    if (mensaje || error) {
      const timer = setTimeout(limpiarMensajes, 5000)
      return () => clearTimeout(timer)
    }
  }, [mensaje, error, limpiarMensajes])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Venta de Boletos por Paquetes
            {/* {digitosRifa && (
              <span className="text-sm font-normal text-muted-foreground">
                ({digitosRifa} dígitos)
              </span>
            )} */}
          </CardTitle>
          <Button onClick={actualizarComponente} disabled={loading || cargandoPrecio || cargandoPaquetes} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${(loading || cargandoPrecio || cargandoPaquetes) ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
        {errorWhatsApp && tipoVenta === 'whatsapp' && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{errorWhatsApp}</AlertDescription></Alert>}
        {mensaje && <Alert><CheckCircle2 className="h-4 w-4" /><AlertDescription>{mensaje}</AlertDescription></Alert>}
        {errorPrecio && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{errorPrecio}</AlertDescription></Alert>}

        <TipoVentaSelector tipoVenta={tipoVenta} onChange={handleTipoVentaChange} />
        <SelectorTipoPaquete tipoSeleccion={tipoSeleccion} minimoPersonalizado={minimoPersonalizado} onChange={setTipoSeleccion} />

        {/* {tipoSeleccion === 'paquete' && (
          <GridPaquetesPredefinidos
            paquetes={paquetesPermitidos}
            paqueteSeleccionado={paqueteSeleccionado}
            precioBoleta={precioBoleta}
            cargando={cargandoPaquetes}
            onSelect={setPaqueteSeleccionado}
            calcularTotal={calcularTotal}
          />
        )} */}

        {tipoSeleccion === 'personalizado' && (
          <InputCantidadPersonalizada
            cantidad={cantidadPersonalizada}
            minimo={minimoPersonalizado}
            precioBoleta={precioBoleta}
            cargando={cargandoPrecio || cargandoPaquetes}
            onChange={(valor) => setCantidadPersonalizada(Math.max(minimoPersonalizado, valor))}
            calcularTotal={calcularTotal}
          />
        )}

        {!validacion.valido && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{validacion.mensaje}</AlertDescription></Alert>}

        <div className="space-y-4">
          <FormularioCliente
            tipoVenta={tipoVenta}
            cedula={cedula}
            enviarEmail={enviarEmail}
            onCedulaChange={setCedula}
            onEnviarEmailChange={setEnviarEmail}
            documento={documento}
            nombreCliente={nombreCliente}
            whatsapp={whatsapp}
            onDocumentoChange={setDocumento}
            onNombreChange={setNombreCliente}
            onWhatsAppChange={handleWhatsAppChange} // ← Handler actualizado
          />

          <MetodoPagoSelector
            metodoPago={metodoPago}
            estadoPago={estadoPago}
            onMetodoChange={setMetodoPago}
            onEstadoChange={setEstadoPago}
          />
        </div>

        {/* ✅ MOSTRAR PAÍS SELECCIONADO (esto usa paisWhatsApp) */}
        {tipoVenta === 'whatsapp' && paisWhatsApp && whatsapp && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* ✅ Usar FlagIcon con Twemoji */}
                  <FlagIcon
                    countryCode={paisWhatsApp.code}
                    size="xl"
                    className="shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      País seleccionado: {paisWhatsApp.name}
                    </p>
                    <p className="text-xs text-green-700">
                      Código: {paisWhatsApp.dial} • Número completo: {whatsapp}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white text-green-700 border-green-300">
                  ✓ Válido
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        
        <SelectorBoletosReservados
          key={rifaId}
          rifaId={rifaId}
          cantidadRequerida={cantidadSeleccionada}
          onBoletosSeleccionados={setBoletosSeleccionados}
          boletosSeleccionados={boletosSeleccionados}
          refreshKey={localRefreshKey}
        />

        <BotonVenta
          tipoVenta={tipoVenta}
          cantidad={cantidadSeleccionada}
          total={totalCalculado}
          loading={loading}
          disabled={!isFormValid}
          onClick={handleVenta}
        />
      </CardContent>
    </Card>
  )
}

export default SelectorPaquetes