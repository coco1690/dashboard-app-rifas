import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ShoppingCart, Star, Ticket, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getPaquetesPorDigitos, getMinimoPorDigitos, obtenerDigitosRifa } from '@/stores/useVentaStore'
import { useVentaStore } from '@/stores/useVentaStore'
import { useReservaStore } from '@/stores/useReservaStore'
import { useCarritoStore } from '@/stores/useCarritoStore'

interface PackageOption {
  id: number
  quantity: number
  isRecommended?: boolean
}

interface CustomTicketSelectorProps {
  rifaId: string
  rifaTitulo?: string
  rifaSubtitulo?: string
  imagenRifa?: string
  pricePerTicket?: number
  onAddToCart?: (quantity: number, total: number) => void
  className?: string
}

export const CustomTicketSelector = ({ 
  rifaId,
  rifaTitulo = 'Rifa',
  rifaSubtitulo,
  imagenRifa,
  pricePerTicket = 2,
  onAddToCart,
  className
}: CustomTicketSelectorProps) => {
  // ============================================================================
  // STORES
  // ============================================================================
  const { obtenerPrecioBoleta } = useVentaStore()
  const { reservarBoletos, loading: reservando } = useReservaStore()
  const { agregarItem } = useCarritoStore()
  const navigate = useNavigate()

  // ============================================================================
  // ESTADOS
  // ============================================================================
  const [selectedPackage, setSelectedPackage] = useState<number>(0)
  const [customQuantity, setCustomQuantity] = useState<number>(0)
  const [paquetesDisponibles, setPaquetesDisponibles] = useState<PackageOption[]>([])
  const [minimoPersonalizado, setMinimoPersonalizado] = useState<number>(101)
  // const [ setDigitosRifa] = useState<number>(4)
  const [precioBoleta, setPrecioBoleta] = useState<number>(pricePerTicket)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const totalTickets = selectedPackage || customQuantity
  const totalPrice = totalTickets * precioBoleta

  // ============================================================================
  // FUNCIONES
  // ============================================================================

  /**
   * Carga la configuración de paquetes según los dígitos de la rifa
   */
  const cargarConfiguracion = async () => {
    if (!rifaId) {
      setError('ID de rifa no proporcionado')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Obtener dígitos de la rifa
      const digitos = await obtenerDigitosRifa(rifaId)
      // setDigitosRifa(digitos)

      // Obtener paquetes permitidos
      const paquetes = getPaquetesPorDigitos(digitos)
      
      // Convertir a formato PackageOption
      const paquetesFormateados: PackageOption[] = paquetes.map((cantidad, index) => ({
        id: index + 1,
        quantity: cantidad,
        // Marcar como recomendado el paquete del medio
        isRecommended: index === Math.floor(paquetes.length / 2)
      }))

      setPaquetesDisponibles(paquetesFormateados)

      // Obtener mínimo personalizado
      const minimo = getMinimoPorDigitos(digitos)
      setMinimoPersonalizado(minimo)

      // Obtener precio de la boleta
      const precio = await obtenerPrecioBoleta(rifaId)
      if (precio !== null) {
        setPrecioBoleta(precio)
      }

      // Seleccionar el paquete recomendado por defecto
      const paqueteRecomendado = paquetesFormateados.find(p => p.isRecommended)
      if (paqueteRecomendado) {
        setSelectedPackage(paqueteRecomendado.quantity)
      }

      // console.log(`📦 Configuración cargada: ${digitos} dígitos, ${paquetes.length} paquetes disponibles`)
    } catch (err) {
      console.error('Error cargando configuración:', err)
      setError('Error al cargar la configuración de paquetes')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Maneja la adición al carrito de forma SEGURA
   * IMPORTANTE: Ahora reserva en el backend primero
   */
  const handleAddToCart = async () => {
    if (totalTickets <= 0 || !canAddToCart()) {
      return
    }

    try {
      // ============================================================================
      // PASO 1: RESERVAR BOLETOS EN EL BACKEND
      // ============================================================================
      const reserva = await reservarBoletos({
        rifaId,
        rifaTitulo,
        rifaSubtitulo,
        imagenRifa,
        cantidad: totalTickets
      })

      // Si la reserva falló, el error ya fue manejado en el store
      if (!reserva) {
        return
      }

      // ============================================================================
      // PASO 2: AGREGAR AL CARRITO CON DATOS DEL BACKEND
      // ============================================================================
      agregarItem({
        reserva_id: reserva.reserva_id,
        token: reserva.token,
        rifaId: reserva.rifaId,
        rifaTitulo: reserva.rifaTitulo,
        rifaSubtitulo: reserva.rifaSubtitulo,
        imagenRifa: reserva.imagenRifa,
        boletos_ids: reserva.boletos_ids,
        numeros: reserva.numeros,
        cantidad: reserva.cantidad,           // ← Del backend
        precio_unitario: reserva.precio_unitario, // ← Del backend
        total: reserva.total,                 // ← Del backend
        digitos: reserva.digitos,
        expira_en: reserva.expira_en
      })
      
      // ============================================================================
      // PASO 3: CALLBACK OPCIONAL (analytics, etc)
      // ============================================================================
      if (onAddToCart) {
        onAddToCart(reserva.cantidad, reserva.total)
      }
      
      // ============================================================================
      // PASO 4: NAVEGAR AL CARRITO
      // ============================================================================
      navigate('/carrito')

    } catch (error) {
      console.error('Error en handleAddToCart:', error)
      // El error ya fue mostrado en el store de reservas
    }
  }

  /**
   * Incrementa la cantidad personalizada
   */
  // const handleIncrement = () => {
  //   const currentValue = customQuantity || selectedPackage
  //   const newValue = currentValue + 1
  //   setCustomQuantity(newValue)
  //   setSelectedPackage(0)
  // }

  /**
   * Decrementa la cantidad personalizada
   */
  // const handleDecrement = () => {
  //   if (customQuantity > 0) {
  //     const newValue = Math.max(0, customQuantity - 1)
  //     setCustomQuantity(newValue)
  //     if (newValue === 0 && paquetesDisponibles.length > 0) {
  //       // Volver al paquete recomendado
  //       const paqueteRecomendado = paquetesDisponibles.find(p => p.isRecommended)
  //       if (paqueteRecomendado) {
  //         setSelectedPackage(paqueteRecomendado.quantity)
  //       }
  //     }
  //   } else if (selectedPackage > 0) {
  //     setSelectedPackage(0)
  //   }
  // }

  /**
   * Valida si se puede agregar al carrito
   */
  const canAddToCart = () => {
    if (totalTickets === 0) return false
    
    // Si es un paquete predefinido, siempre es válido
    if (selectedPackage > 0 && paquetesDisponibles.some(p => p.quantity === selectedPackage)) {
      return true
    }
    
    // Si es personalizado, debe cumplir con el mínimo
    if (customQuantity > 0 && customQuantity >= minimoPersonalizado) {
      return true
    }
    
    return false
  }

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    cargarConfiguracion()
  }, [rifaId])

  // ============================================================================
  // RENDER - LOADING
  // ============================================================================

  if (loading) {
    return (
      <div className={cn("w-full max-w-2xl mx-auto", className)}>
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto" />
              <p className="text-sm text-gray-600">Cargando opciones de paquetes...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ============================================================================
  // RENDER - ERROR
  // ============================================================================

  if (error) {
    return (
      <div className={cn("w-full max-w-2xl mx-auto", className)}>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              onClick={cargarConfiguracion}
              className="mt-4"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ============================================================================
  // RENDER - SELECTOR
  // ============================================================================

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-4 md:space-y-6", className)}>
    

      {/* Grid de paquetes predefinidos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {paquetesDisponibles.map((pkg) => (
          <Card
            key={pkg.id}
            className={cn(
              "relative cursor-pointer transition-all hover:shadow-md hover:scale-105",
              selectedPackage === pkg.quantity && !pkg.isRecommended && "ring-2 ring-primary shadow-md",
              selectedPackage === pkg.quantity && pkg.isRecommended && "ring-2 ring-red-500 shadow-lg",
              pkg.isRecommended && selectedPackage !== pkg.quantity && "ring-2 ring-red-300",
              (reservando || loading) && "opacity-50 pointer-events-none"
            )}
            onClick={() => {
              if (!reservando && !loading) {
                setSelectedPackage(pkg.quantity)
                setCustomQuantity(0)
              }
            }}
          >
            {/* Estrella de recomendado */}
            {pkg.isRecommended && (
              <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-white rounded-full p-0.5 md:p-1 shadow-md">
                  <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-500 text-yellow-500" />
                </div>
              </div>
            )}

            <CardContent className={cn(
              "p-2 md:p-4 flex flex-col items-center justify-center space-y-1 md:space-y-2 transition-colors",
              pkg.isRecommended && selectedPackage === pkg.quantity && "bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg",
              pkg.isRecommended && selectedPackage !== pkg.quantity && "bg-gradient-to-br from-red-50 to-red-100"
            )}>
              <Ticket className={cn(
                "w-6 h-6 md:w-8 md:h-8 transition-colors",
                pkg.isRecommended && selectedPackage === pkg.quantity ? "text-white" : 
                pkg.isRecommended ? "text-red-500" : "text-gray-600"
              )} />
              
              <div className="text-center">
                <div className={cn(
                  "text-xl md:text-2xl font-bold",
                  pkg.isRecommended && selectedPackage === pkg.quantity ? "text-white" : 
                  pkg.isRecommended ? "text-red-600" : "text-gray-900"
                )}>
                  {pkg.quantity}
                </div>
                <div className={cn(
                  "text-xs md:text-sm",
                  pkg.isRecommended && selectedPackage === pkg.quantity ? "text-white/90" : 
                  pkg.isRecommended ? "text-red-600/80" : "text-gray-600"
                )}>
                  Imágenes
                </div>
                <div className={cn(
                  "text-[10px] md:text-xs font-semibold mt-0.5 md:mt-1",
                  pkg.isRecommended && selectedPackage === pkg.quantity ? "text-white" : 
                  pkg.isRecommended ? "text-red-700" : "text-gray-700"
                )}>
                  ${(pkg.quantity * precioBoleta).toLocaleString()}
                </div>
              </div>

              {pkg.isRecommended && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "font-medium text-[10px] md:text-xs py-0 md:py-0.5 px-1.5 md:px-2",
                    selectedPackage === pkg.quantity 
                      ? "bg-white text-red-600" 
                      : "bg-red-600 text-white"
                  )}
                >
                  Recomendado
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Divisor */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
         
        </div>
      </div>

      {/* Contador personalizado */}
      {/* <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 block text-center">
          Total de números a comprar
          {customQuantity > 0 && customQuantity < minimoPersonalizado && (
            <span className="block text-xs text-red-600 mt-1">
              Mínimo {minimoPersonalizado} números para cantidad personalizada
            </span>
          )}
        </label>
        <div className="flex items-center gap-3 md:gap-4 max-w-sm mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={totalTickets === 0 || reservando || loading}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full"
          >
            <Minus className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <div className="flex-1 text-center">
            <span className="text-3xl md:text-4xl font-bold text-gray-900">
              {totalTickets}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={reservando || loading}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </div> */}

      {/* Precio total */}
      <div className="space-y-2 text-center">
        <label className="text-sm font-medium text-gray-700 block">
          Precio Total
        </label>
        <div className="text-3xl md:text-5xl font-bold text-gray-900">
          ${totalPrice.toLocaleString()}
        </div>
        <p className="text-xs text-gray-500">
          ${precioBoleta.toLocaleString()} por imágen
        </p>
      </div>

      {/* Botón de añadir al carrito */}
      <Button
        size="lg"
        className="w-full bg-red-500 hover:bg-red-600 text-white text-base md:text-lg font-bold py-4 md:py-6 rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canAddToCart() || reservando || loading}
        onClick={handleAddToCart}
      >
        {reservando ? (
          <>
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
            RESERVANDO IMÁGENES...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            {canAddToCart() 
              ? `AÑADIR ${totalTickets} IMÁGEN${totalTickets > 1 ? 'ES' : ''} AL CARRITO`
              : 'SELECCIONA UNA CANTIDAD VÁLIDA'
            }
          </>
        )}
      </Button>

      {/* Información de seguridad */}
      {canAddToCart() && !reservando && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🔒 Tus imágenes serán reservadas por 10 minutos
          </p>
        </div>
      )}
    </div>
  )
}
