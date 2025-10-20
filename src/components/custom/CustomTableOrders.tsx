import React, { useState, useEffect } from 'react'
import { useOrdenesStore } from '@/stores/useOrdenesStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    RefreshCw,
    Search,
    Filter,
    Edit,
    Save,
    X,
    Calendar,
    Users,
    CreditCard,
    FileText,
    Ticket,
} from 'lucide-react'

type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'

const CustomTableOrders: React.FC = () => {
    const {
        ordenes,
        loading,
        error,
        contexto,
        filtros,
        cargarOrdenes,
        actualizarEstadoPago,
        setFiltros,
        limpiarFiltros,
        obtenerAgencias,
        obtenerRifas
    } = useOrdenesStore()

    // Estados locales
    const [editandoOrden, setEditandoOrden] = useState<string | null>(null)
    const [nuevoEstado, setNuevoEstado] = useState<EstadoPago>('pendiente')
    // Removed unused state 'agencias'
    const [rifas, setRifas] = useState<{ id: string; nombre: string }[]>([])
    const [mostrarFiltros, setMostrarFiltros] = useState(false)

    // ✅ AGREGADO: Control de carga inicial
    const [datosInicialescargados, setDatosInicialesCargados] = useState(false)


    // Estados para filtros locales
    const [filtrosLocal, setFiltrosLocal] = useState({
        estado_pago: 'todos' as 'todos' | EstadoPago,
        agencia_id: 'todas',
        rifa_id: 'todas',
        fecha_desde: '',
        fecha_hasta: '',
        cliente_buscar: '',
        orden_buscar: ''
    })

    // Sincronizar filtros locales con el store
    useEffect(() => {
        setFiltrosLocal({
            estado_pago: filtros.estado_pago || 'todos',
            agencia_id: 'todas',
            rifa_id: filtros.rifa_id || 'todas',
            fecha_desde: filtros.fecha_desde || '',
            fecha_hasta: filtros.fecha_hasta || '',
            cliente_buscar: filtros.cliente_buscar || '',
            orden_buscar: filtros.orden_buscar || ''
        })
    }, [filtros])

    // ✅ CORREGIDO: Cargar datos iniciales solo cuando cambie el contexto
    useEffect(() => {
        if (contexto && !datosInicialescargados) {
            cargarDatosIniciales()
        }
    }, [contexto, datosInicialescargados])// Solo contexto, sin funciones

    const cargarDatosIniciales = async () => {
        if (datosInicialescargados) return

        setDatosInicialesCargados(true)

        const [listaRifas] = await Promise.all([
            obtenerRifas(),
            // Solo cargar agencias para admin si es necesario
            contexto === 'admin' ? obtenerAgencias() : Promise.resolve([])
        ])

        setRifas(listaRifas)
    }


    // Aplicar filtros - solo los permitidos según contexto
    const aplicarFiltros = () => {
        const filtrosLimpios: any = {}

        // Filtros comunes para ambos contextos
        if (filtrosLocal.estado_pago && filtrosLocal.estado_pago !== 'todos') {
            filtrosLimpios.estado_pago = filtrosLocal.estado_pago
        }

        if (filtrosLocal.rifa_id && filtrosLocal.rifa_id !== 'todas') {
            filtrosLimpios.rifa_id = filtrosLocal.rifa_id
        }

        if (filtrosLocal.fecha_desde) {
            filtrosLimpios.fecha_desde = filtrosLocal.fecha_desde
        }

        if (filtrosLocal.fecha_hasta) {
            filtrosLimpios.fecha_hasta = filtrosLocal.fecha_hasta
        }

        if (filtrosLocal.cliente_buscar) {
            filtrosLimpios.cliente_buscar = filtrosLocal.cliente_buscar
        }

        if (filtrosLocal.orden_buscar) {
            filtrosLimpios.orden_buscar = filtrosLocal.orden_buscar
        }

        setFiltros(filtrosLimpios)
    }

    // Limpiar filtros
    const handleLimpiarFiltros = () => {
        const filtrosVacios = {
            estado_pago: 'todos' as const,
            agencia_id: 'todas',
            rifa_id: 'todas',
            fecha_desde: '',
            fecha_hasta: '',
            cliente_buscar: '',
            orden_buscar: ''
        }
        setFiltrosLocal(filtrosVacios)
        limpiarFiltros()
    }

    // Manejar edición
    const iniciarEdicion = (ordenId: string, estadoActual: EstadoPago) => {
        setEditandoOrden(ordenId)
        setNuevoEstado(estadoActual)
    }

    const cancelarEdicion = () => {
        setEditandoOrden(null)
        setNuevoEstado('pendiente')
    }

    const guardarEstado = async (ordenId: string) => {
        const exito = await actualizarEstadoPago(ordenId, nuevoEstado)
        if (exito) {
            setEditandoOrden(null)
        }
    }

    // Función para obtener el color del badge según el estado
    const getEstadoBadgeColor = (estado: EstadoPago) => {
        switch (estado) {
            case 'pagado':
                return 'bg-green-600 text-white'
            case 'pendiente':
                return 'bg-yellow-600 text-white'
            case 'fallido':
                return 'bg-red-600 text-white'
            case 'reembolsado':
                return 'bg-gray-600 text-white'
            default:
                return 'bg-gray-600 text-white'
        }
    }

    // Formatear fecha
    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // ✅ AGREGADO: Manual refresh que fuerza recarga
    const handleRefreshManual = () => {
        cargarOrdenes({}, true) // Solo forzar refresh de órdenes
        // setDatosInicialesCargados(false)
        // cargarDatosIniciales()
        // cargarOrdenes()
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {contexto === 'admin' ? 'Gestión de Órdenes (Todas)' : 'Mis Órdenes de Boletos'}
                        <Badge variant="secondary">{ordenes.length} órdenes</Badge>
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            variant="outline"
                            size="sm"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filtros
                        </Button>
                        <Button
                            onClick={handleRefreshManual}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                    </div>
                </div>

                {/* Panel de filtros */}
                {mostrarFiltros && (
                    <Card className="mt-4">
                        <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {/* Filtro de estado */}
                                <div className="space-y-2">
                                    <Label htmlFor="estado-filtro">Estado</Label>
                                    <Select
                                        value={filtrosLocal.estado_pago}
                                        onValueChange={(value) => setFiltrosLocal(prev => ({
                                            ...prev,
                                            estado_pago: value as 'todos' | EstadoPago
                                        }))}
                                    >
                                        <SelectTrigger id="estado-filtro">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="pendiente">Pendiente</SelectItem>
                                            <SelectItem value="pagado">Pagado</SelectItem>
                                            <SelectItem value="fallido">Fallido</SelectItem>
                                            <SelectItem value="reembolsado">Reembolsado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filtro de rifa */}
                                <div className="space-y-2">
                                    <Label htmlFor="rifa-filtro">Rifa</Label>
                                    <Select
                                        value={filtrosLocal.rifa_id}
                                        onValueChange={(value) => setFiltrosLocal(prev => ({ ...prev, rifa_id: value }))}
                                    >
                                        <SelectTrigger id="rifa-filtro">
                                            <SelectValue placeholder="Todas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todas">Todas</SelectItem>
                                            {rifas.map(rifa => (
                                                <SelectItem key={rifa.id} value={rifa.id}>
                                                    {rifa.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filtro de Orden ID - MÁS PEQUEÑO */}
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="orden-buscar">Orden</Label>
                                    <Input
                                        id="orden-buscar"
                                        type="text"
                                        placeholder="ID orden..."
                                        className="text-sm"
                                        value={filtrosLocal.orden_buscar}
                                        onChange={(e) => setFiltrosLocal(prev => ({ ...prev, orden_buscar: e.target.value }))}
                                    />
                                </div>

                                {/* Fechas - en columnas separadas */}
                                <div className="space-y-2">
                                    <Label htmlFor="fecha-desde">Desde</Label>
                                    <Input
                                        id="fecha-desde"
                                        type="date"
                                        value={filtrosLocal.fecha_desde}
                                        onChange={(e) => setFiltrosLocal(prev => ({ ...prev, fecha_desde: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fecha-hasta">Hasta</Label>
                                    <Input
                                        id="fecha-hasta"
                                        type="date"
                                        value={filtrosLocal.fecha_hasta}
                                        onChange={(e) => setFiltrosLocal(prev => ({ ...prev, fecha_hasta: e.target.value }))}
                                    />
                                </div>

                                {/* Búsqueda de cliente */}
                                <div className="space-y-2">
                                    <Label htmlFor="cliente-buscar">Cliente</Label>
                                    <Input
                                        id="cliente-buscar"
                                        placeholder="Buscar cliente..."
                                        value={filtrosLocal.cliente_buscar}
                                        onChange={(e) => setFiltrosLocal(prev => ({ ...prev, cliente_buscar: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button onClick={aplicarFiltros} size="sm">
                                    <Search className="h-4 w-4 mr-2" />
                                    Aplicar Filtros
                                </Button>
                                <Button onClick={handleLimpiarFiltros} variant="outline" size="sm">
                                    <X className="h-4 w-4 mr-2" />
                                    Limpiar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        Cargando órdenes...
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600">
                        Error: {error}
                    </div>
                ) : ordenes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {contexto === 'admin'
                            ? 'No se encontraron órdenes en el sistema'
                            : 'No tienes órdenes registradas'
                        }
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Orden</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Cédula</TableHead>
                                    {/* Solo mostrar columna Agencia para admin */}
                                    {contexto === 'admin' && <TableHead>Agencia</TableHead>}
                                    <TableHead>Rifa</TableHead>
                                    <TableHead>Boletos</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ordenes.map((orden) => (
                                    <TableRow key={orden.id}>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-gray-500" />
                                                {formatearFecha(orden.fecha)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-1">
                                                <Ticket className="h-3 w-3 text-gray-500" />
                                                {orden.id.substring(0, 8).toUpperCase()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3 text-gray-500" />
                                                {orden.cliente_nombre}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {orden.documento_identidad}
                                        </TableCell>
                                        {/* Solo mostrar agencia para admin */}
                                        {contexto === 'admin' && (
                                            <TableCell>{orden.agencia_nombre}</TableCell>
                                        )}
                                        <TableCell>{orden.rifa_nombre}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">{orden.cantidad_boletos}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <CreditCard className="h-3 w-3 text-gray-500" />
                                                ${orden.total_pago.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {editandoOrden === orden.id ? (
                                                <Select
                                                    value={nuevoEstado}
                                                    onValueChange={(value) => setNuevoEstado(value as EstadoPago)}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                                        <SelectItem value="pagado">Pagado</SelectItem>
                                                        <SelectItem value="fallido">Fallido</SelectItem>
                                                        <SelectItem value="reembolsado">Reembolsado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Badge className={getEstadoBadgeColor(orden.estado_pago)}>
                                                    {orden.estado_pago.charAt(0).toUpperCase() + orden.estado_pago.slice(1)}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editandoOrden === orden.id ? (
                                                <div className="flex gap-1">
                                                    <Button
                                                        onClick={() => guardarEstado(orden.id)}
                                                        size="sm"
                                                        variant="default"
                                                    >
                                                        <Save className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        onClick={cancelarEdicion}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    onClick={() => iniciarEdicion(orden.id, orden.estado_pago)}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default CustomTableOrders