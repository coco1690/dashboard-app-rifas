import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogIn, Loader2 } from 'lucide-react'
import { useHistorialVentasStore } from '@/stores/useHistorialVentasStore'
import { BoletosClientView } from './components/BoletosClientView'
import { OrdenSelector } from './components/OrdenSelector'

export const DescargaBoletasPage = () => {
    const navigate = useNavigate()
    const { user, isSessionChecked } = useAuthStore()
    const { 
        ventas, 
        loading, 
        obtenerHistorial, 
        setFiltros,
        limpiarFiltros,
        resetearEstado 
    } = useHistorialVentasStore()

    const [ordenSeleccionadaId, setOrdenSeleccionadaId] = useState<string | null>(null)

    // Obtener la venta seleccionada
    const ventaSeleccionada = ordenSeleccionadaId 
        ? ventas.find(v => v.orden_id === ordenSeleccionadaId) 
        : null

    // Cargar órdenes cuando el componente se monta
    useEffect(() => {
        if (user && user.user_type === 'cliente' && user.id) {
            // Establecer filtros para el cliente actual y solo órdenes pagadas
            setFiltros({ 
                agenciaId: undefined, // Limpiar filtro de agencia si existe
            })
            
            // Obtener historial del cliente actual
            obtenerHistorial({}, 1)
        } else if (!user && isSessionChecked) {
            // Si no hay usuario después de verificar la sesión, limpiar el store
            resetearEstado()
        }

        // Cleanup al desmontar
        return () => {
            setOrdenSeleccionadaId(null)
            limpiarFiltros()
        }
    }, [user, isSessionChecked])

    // Filtrar solo las ventas del cliente actual y que estén pagadas
    const ordenesDelCliente = user?.id 
        ? ventas.filter(v => v.cliente_id === user.id && v.estado_pago === 'pagado')
        : []

    const handleSeleccionarOrden = (ordenId: string) => {
        setOrdenSeleccionadaId(ordenId)
    }

    const handleVolver = () => {
        setOrdenSeleccionadaId(null)
    }

    // Mostrar loader mientras se verifica la sesión
    if (!isSessionChecked) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    // Si no está logueado, mostrar mensaje
    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <LogIn className="w-16 h-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">
                            Inicia sesión para ver tus boletos
                        </h2>
                        <p className="text-muted-foreground text-center mb-6">
                            Debes iniciar sesión para acceder a tus órdenes y boletos comprados
                        </p>
                        <Button onClick={() => navigate('/auth/login')}>
                            Ir a iniciar sesión
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Si el usuario no es cliente, no tiene acceso
    if (user.user_type !== 'cliente') {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg font-medium text-muted-foreground">
                            Acceso restringido
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                            Esta sección es solo para clientes
                        </p>
                        <Button 
                            variant="outline" 
                            className="mt-6"
                            onClick={() => navigate('/')}
                        >
                            Volver al inicio
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Mostrar loader mientras cargan las órdenes
    if (loading && ordenesDelCliente.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Cargando tus órdenes...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Si hay una orden seleccionada, mostrar los boletos */}
                {ventaSeleccionada ? (
                    <BoletosClientView 
                        venta={ventaSeleccionada} 
                        onVolver={handleVolver}
                    />
                ) : (
                    /* Si no hay orden seleccionada, mostrar selector de órdenes */
                    <OrdenSelector 
                        ordenes={ordenesDelCliente}
                        onSeleccionar={handleSeleccionarOrden}
                    />
                )}
            </div>
        </div>
    )
}