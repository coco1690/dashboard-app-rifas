import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ShoppingCart, Star, Minus, Plus, Ticket, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getPaquetesPorDigitos, getMinimoPorDigitos, obtenerDigitosRifa } from '@/stores/useVentaStore'
import { useVentaStore } from '@/stores/useVentaStore'
import { useCarritoStore } from '@/stores/useCarritoStote'


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
  // STORE
  // ============================================================================
  const { obtenerPrecioBoleta } = useVentaStore()
  const { agregarItem } = useCarritoStore()
  const navigate = useNavigate()

  // ============================================================================
  // ESTADOS
  // ============================================================================
  const [selectedPackage, setSelectedPackage] = useState<number>(0)
  const [customQuantity, setCustomQuantity] = useState<number>(0)
  const [paquetesDisponibles, setPaquetesDisponibles] = useState<PackageOption[]>([])
  const [minimoPersonalizado, setMinimoPersonalizado] = useState<number>(101)
  const [digitosRifa, setDigitosRifa] = useState<number>(4)
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
      setDigitosRifa(digitos)

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

      console.log(`📦 Configuración cargada: ${digitos} dígitos, ${paquetes.length} paquetes disponibles`)
    } catch (err) {
      console.error('Error cargando configuración:', err)
      setError('Error al cargar la configuración de paquetes')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Maneja la adición al carrito
   */
  const handleAddToCart = () => {
    if (totalTickets > 0) {
      // Agregar al store del carrito
      agregarItem({
        rifaId,
        rifaTitulo,
        rifaSubtitulo,
        cantidad: totalTickets,
        precioUnitario: precioBoleta,
        total: totalPrice,
        digitos: digitosRifa,
        imagenRifa
      })
      
      // Llamar al callback si existe (para toast, analytics, etc)
      if (onAddToCart) {
        onAddToCart(totalTickets, totalPrice)
      }
      
      // Navegar al carrito de compras
      navigate('/carrito')
    }
  }

  /**
   * Incrementa la cantidad personalizada
   */
  const handleIncrement = () => {
    const currentValue = customQuantity || selectedPackage
    const newValue = currentValue + 1
    setCustomQuantity(newValue)
    setSelectedPackage(0)
  }

  /**
   * Decrementa la cantidad personalizada
   */
  const handleDecrement = () => {
    if (customQuantity > 0) {
      const newValue = Math.max(0, customQuantity - 1)
      setCustomQuantity(newValue)
      if (newValue === 0 && paquetesDisponibles.length > 0) {
        // Volver al paquete recomendado
        const paqueteRecomendado = paquetesDisponibles.find(p => p.isRecommended)
        if (paqueteRecomendado) {
          setSelectedPackage(paqueteRecomendado.quantity)
        }
      }
    } else if (selectedPackage > 0) {
      setSelectedPackage(0)
    }
  }

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
      {/* Header con información de dígitos */}
      <div className="text-center">
        <Badge variant="outline" className="mb-2">
          Evento de {digitosRifa} dígitos
        </Badge>
      </div>

      {/* Grid de paquetes predefinidos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {paquetesDisponibles.map((pkg) => (
          <Card
            key={pkg.id}
            className={cn(
              "relative cursor-pointer transition-all hover:shadow-md hover:scale-105",
              selectedPackage === pkg.quantity && !pkg.isRecommended && "ring-2 ring-primary shadow-md",
              selectedPackage === pkg.quantity && pkg.isRecommended && "ring-2 ring-pink-500 shadow-lg",
              pkg.isRecommended && selectedPackage !== pkg.quantity && "ring-2 ring-pink-300"
            )}
            onClick={() => {
              setSelectedPackage(pkg.quantity)
              setCustomQuantity(0)
            }}
          >
            {/* Estrella de recomendado */}
            {pkg.isRecommended && (
              <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-white rounded-full p-0.5 md:p-1 shadow-md">
                  <Star className="w-4 h-4 md:w-5 md:h-5 fill-amber-500 text-amber-500" />
                </div>
              </div>
            )}

            <CardContent className={cn(
              "p-2 md:p-4 flex flex-col items-center justify-center space-y-1 md:space-y-2 transition-colors",
              pkg.isRecommended && selectedPackage === pkg.quantity && "bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg",
              pkg.isRecommended && selectedPackage !== pkg.quantity && "bg-gradient-to-br from-amber-50 to-amber-100"
            )}>
              <Ticket className={cn(
                "w-6 h-6 md:w-8 md:h-8 transition-colors",
                pkg.isRecommended && selectedPackage === pkg.quantity ? "text-white" : 
                pkg.isRecommended ? "text-amber-500" : "text-gray-600"
              )} />
              
              <div className="text-center">
                <div className={cn(
                  "text-xl md:text-2xl font-bold",
                  pkg.isRecommended && selectedPackage === pkg.quantity ? "text-white" : 
                  pkg.isRecommended ? "text-amber-600" : "text-gray-900"
                )}>
                  {pkg.quantity}
                </div>
                <div className={cn(
                  "text-xs md:text-sm",
                  pkg.isRecommended && selectedPackage === pkg.quantity ? "text-white/90" : 
                  pkg.isRecommended ? "text-amber-600/80" : "text-gray-600"
                )}>
                  Números
                </div>
                <div className={cn(
                  "text-[10px] md:text-xs font-semibold mt-0.5 md:mt-1",
                  pkg.isRecommended && selectedPackage === pkg.quantity ? "text-white" : 
                  pkg.isRecommended ? "text-amber-700" : "text-gray-700"
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
                      ? "bg-white text-amber-600" 
                      : "bg-amber-600 text-white"
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
          <span className="bg-white px-2 text-gray-500">
            o personaliza tu cantidad
          </span>
        </div>
      </div>

      {/* Contador personalizado */}
      <div className="space-y-3">
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
            disabled={totalTickets === 0}
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
            className="h-10 w-10 md:h-12 md:w-12 rounded-full"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </div>

      {/* Precio total */}
      <div className="space-y-2 text-center">
        <label className="text-sm font-medium text-gray-700 block">
          Precio Total
        </label>
        <div className="text-3xl md:text-5xl font-bold text-gray-900">
          ${totalPrice.toLocaleString()}
        </div>
        <p className="text-xs text-gray-500">
          ${precioBoleta.toLocaleString()} por número
        </p>
      </div>

      {/* Botón de añadir al carrito */}
      <Button
        size="lg"
        className="w-full bg-amber-500 hover:bg-amber-600 text-white text-base md:text-lg font-bold py-4 md:py-6 rounded-full transition-all hover:scale-105"
        disabled={!canAddToCart()}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        {canAddToCart() 
          ? `AÑADIR ${totalTickets} NÚMERO${totalTickets > 1 ? 'S' : ''} AL CARRITO`
          : 'SELECCIONA UNA CANTIDAD VÁLIDA'
        }
      </Button>

      {/* Información adicional */}
      {/* <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 Los paquetes son más económicos. ¡Aprovecha!
        </p>
      </div> */}
    </div>
  )
}