import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ShoppingCart, Trash2, ArrowLeft, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { toast } from 'sonner'
import { useCarrito } from '@/stores/useCarritoStote'

export const CarritoDeComprasPage = () => {
  const navigate = useNavigate()
  const {
    items,
    total,
    cantidadTotal,
    isEmpty,
    eliminarItem,
    actualizarCantidad,
    limpiarCarrito
  } = useCarrito()

  // Scroll to top al cargar
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (isEmpty) {
      const timer = setTimeout(() => {
        toast.info('Tu carrito está vacío', {
          description: 'Agrega números para continuar con tu compra'
        })
        navigate('/')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isEmpty, navigate])

  const handleEliminarItem = (rifaId: string, rifaTitulo: string) => {
    eliminarItem(rifaId)
    toast.success('Número eliminado', {
      description: `${rifaTitulo} fue eliminado del carrito`
    })
  }

  const handleActualizarCantidad = (rifaId: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) {
      return
    }
    actualizarCantidad(rifaId, nuevaCantidad)
  }

  const handleLimpiarCarrito = () => {
    limpiarCarrito()
    toast.success('Carrito limpiado', {
      description: 'Todos los números fueron eliminados'
    })
  }

  const handleVolverComprar = () => {
    navigate('/')
  }

  const handleProcederPago = () => {
    // TODO: Implementar integración con PayPal
    toast.info('Procesando pago', {
      description: 'Redirigiendo a PayPal...'
    })
    console.log('Datos para PayPal:', { items, total })
  }

  if (isEmpty) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-12 md:py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center space-y-4 p-4 md:p-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-7 h-7 md:w-8 md:h-8 text-gray-400" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 text-xs md:text-sm">
              Agrega números a tu carrito para continuar con tu compra
            </p>
            <Button onClick={handleVolverComprar} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a comprar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-6 md:py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
              <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
              Carrito de Compras
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {cantidadTotal} número{cantidadTotal !== 1 ? 's' : ''} en tu carrito
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleVolverComprar}
            className="w-full md:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Seguir comprando
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Lista de items */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Números seleccionados</CardTitle>
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLimpiarCarrito}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpiar todo
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6">
              {items.map((item, index) => (
                <div key={item.rifaId}>
                  <div className="flex gap-3 md:gap-4">
                    {/* Imagen */}
                    <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.imagenRifa ? (
                        <img
                          src={item.imagenRifa}
                          alt={item.rifaTitulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Detalles */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                            {item.rifaTitulo}
                          </h3>
                          {item.rifaSubtitulo && (
                            <p className="text-xs md:text-sm text-gray-600 truncate">
                              {item.rifaSubtitulo}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1 md:mt-2">
                            <Badge variant="outline" className="text-[10px] md:text-xs">
                              {item.digitos} dígitos
                            </Badge>
                            <span className="text-xs md:text-sm text-gray-600">
                              ${item.precioUnitario.toLocaleString()} c/u
                            </span>
                          </div>
                        </div>

                        {/* Precio */}
                        <div className="text-left md:text-right">
                          <p className="text-base md:text-lg font-bold text-gray-900">
                            ${item.total.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 md:mt-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActualizarCantidad(item.rifaId, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            className="h-7 w-7 md:h-8 md:w-8 p-0"
                          >
                            -
                          </Button>
                          <span className="text-xs md:text-sm font-medium w-10 md:w-12 text-center">
                            {item.cantidad}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActualizarCantidad(item.rifaId, item.cantidad + 1)}
                            className="h-7 w-7 md:h-8 md:w-8 p-0"
                          >
                            +
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminarItem(item.rifaId, item.rifaTitulo)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs md:text-sm w-full sm:w-auto"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {index < items.length - 1 && <Separator className="mt-3 md:mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumen y pago */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-4">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Resumen de compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
              {/* Desglose */}
              <div className="space-y-2 md:space-y-3">
                {items.map((item) => (
                  <div key={item.rifaId} className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">
                      {item.cantidad} número{item.cantidad > 1 ? 's' : ''} × ${item.precioUnitario.toLocaleString()}
                    </span>
                    <span className="font-medium">
                      ${item.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold">Total</span>
                <span className="text-xl md:text-2xl font-bold text-gray-900">
                  ${total.toLocaleString()}
                </span>
              </div>

              <Separator />

              {/* Botón de pago */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 md:py-6 text-base md:text-lg"
                  onClick={handleProcederPago}
                >
                  Proceder al pago
                </Button>

                {/* Aquí irá la integración de PayPal */}
                <div className="bg-gray-50 rounded-lg p-3 md:p-4 text-center">
                  <p className="text-xs md:text-sm text-gray-600 mb-2">
                    Métodos de pago disponibles:
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="text-xs">PayPal</Badge>
                    <Badge variant="outline" className="text-xs">Tarjeta</Badge>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-blue-800 leading-relaxed">
                  ✓ Compra segura y encriptada
                  <br />
                  ✓ Confirmación inmediata por email
                  <br />
                  ✓ Tus números quedarán reservados
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}