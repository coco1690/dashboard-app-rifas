import React, { useState, useEffect } from 'react'
import { useVentaStore, getPaquetesPorDigitos, getMinimoPorDigitos, obtenerDigitosRifa, validarCantidad } from '@/stores/useVentaStore'
import { useBoletoStore } from '@/stores/useBoletoStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, Package, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'  // ← Agregar iconos
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'  // ← NUEVO: Importar Collapsible
import { TipoVentaSelector } from './TipoVentaSelector'
import { SelectorTipoPaquete } from './SelectorTipoPaquete'
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
  tipoVentaInicial?: 'email' | 'whatsapp' | 'sms'
}

const SelectorPaquetes: React.FC<SelectorPaquetesProps> = ({
  rifaId,
  agenciaId,
  refreshKey = 0,
  tipoVentaInicial = 'email'
}) => {
  const {
    obtenerPrecioBoleta,
    calcularTotal,
    venderBoletos,
    venderBoletosPorWhatsApp,
    venderBoletosPorSMS,
    loading,
    error,
    mensaje,
    errorWhatsApp,
    errorSMS,
    limpiarMensajes
  } = useVentaStore()

  const { fetchEstadisticasRifa } = useBoletoStore()

  // Estados
  const [tipoSeleccion, setTipoSeleccion] = useState<'paquete' | 'personalizado'>('personalizado')
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(10)
  const [cantidadPersonalizada, setCantidadPersonalizada] = useState(1)
  const [boletosSeleccionados, setBoletosSeleccionados] = useState<string[]>([])
  const [tipoVenta, setTipoVenta] = useState<'email' | 'whatsapp' | 'sms'>(tipoVentaInicial)
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
  const [collapsibleOpen, setCollapsibleOpen] = useState(false)  // ← NUEVO: Estado del collapsible

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

  const handleTipoVentaChange = (valor: 'email' | 'whatsapp' | 'sms') => {
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
    if (tipoVenta === 'sms') {
      resultado = await venderBoletosPorSMS({
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
    } else if (tipoVenta === 'whatsapp') {
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
    setWhatsapp(fullNumber)
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

  // ← NUEVO: Helper para obtener el texto del tipo de venta actual
  const getTipoVentaTexto = () => {
    if (tipoVenta === 'email') return '📧 Email'
    if (tipoVenta === 'whatsapp') return '💬 WhatsApp'
    return '📱 SMS'
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Venta de Boletos
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
        {errorSMS && tipoVenta === 'sms' && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{errorSMS}</AlertDescription></Alert>}
        {mensaje && <Alert><CheckCircle2 className="h-4 w-4" /><AlertDescription>{mensaje}</AlertDescription></Alert>}
        {errorPrecio && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{errorPrecio}</AlertDescription></Alert>}

       
        {/* Collapsible responsive para móvil */}
        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
          <Card className="border-2 border-blue-200 overflow-hidden">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-blue-50 h-auto"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 shrink-0">
                    📬 Notificación:
                  </span>
                  <span className="font-semibold text-sm sm:text-base truncate">
                    {getTipoVentaTexto()}
                  </span>
                </div>
                <div className="ml-2 shrink-0">
                  {collapsibleOpen ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-2 sm:px-4 pb-3 sm:pb-4">
                <TipoVentaSelector tipoVenta={tipoVenta} onChange={handleTipoVentaChange} />
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <SelectorTipoPaquete tipoSeleccion={tipoSeleccion} minimoPersonalizado={minimoPersonalizado} onChange={setTipoSeleccion} />

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
            onWhatsAppChange={handleWhatsAppChange}
          />

          <MetodoPagoSelector
            metodoPago={metodoPago}
            estadoPago={estadoPago}
            onMetodoChange={setMetodoPago}
            onEstadoChange={setEstadoPago}
          />
        </div>

        {(tipoVenta === 'whatsapp' || tipoVenta === 'sms') && paisWhatsApp && whatsapp && (
          <Card className={tipoVenta === 'sms' ? 'border-purple-200 bg-purple-50' : 'border-green-200 bg-green-50'}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FlagIcon
                    countryCode={paisWhatsApp.code}
                    size="xl"
                    className="shadow-sm"
                  />
                  <div>
                    <p className={`text-sm font-semibold ${tipoVenta === 'sms' ? 'text-purple-900' : 'text-green-900'}`}>
                      País seleccionado: {paisWhatsApp.name}
                    </p>
                    <p className={`text-xs ${tipoVenta === 'sms' ? 'text-purple-700' : 'text-green-700'}`}>
                      Código: {paisWhatsApp.dial} • Número completo: {whatsapp}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={tipoVenta === 'sms' ? 'bg-white text-purple-700 border-purple-300' : 'bg-white text-green-700 border-green-300'}>
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
