// import React, { useState, useEffect } from 'react'
// import { useOrdenesStore } from '@/stores/useOrdenesStore'
// import { useSearchParams } from 'react-router'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { CustomPagination } from '@/components/custom/CustomPagination'
// import {
//     RefreshCw,
//     Search,
//     Filter,
//     Edit,
//     Save,
//     X,
//     Calendar,
//     Users,
//     CreditCard,
//     FileText,
//     Ticket,
//     Send
// } from 'lucide-react'
// import { CustomMetodoNotificacionBadge } from './CustomMetodonotificacionbadge'

// type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'

// const CustomTableOrders: React.FC = () => {
//     const [searchParams, setSearchParams] = useSearchParams()
    
//     const {
//         ordenes,
//         loading,
//         error,
//         contexto,
//         filtros,
//         currentPage,
//         totalPages,
//         totalCount,
//         cargarOrdenes,
//         actualizarEstadoPago,
//         setFiltros,
//         limpiarFiltros,
//         setPage,
//         obtenerAgencias,
//         obtenerRifas
//     } = useOrdenesStore()

//     // Estados locales
//     const [editandoOrden, setEditandoOrden] = useState<string | null>(null)
//     const [nuevoEstado, setNuevoEstado] = useState<EstadoPago>('pendiente')
//     const [rifas, setRifas] = useState<{ id: string; nombre: string }[]>([])
//     const [mostrarFiltros, setMostrarFiltros] = useState(false)
//     const [datosInicialescargados, setDatosInicialesCargados] = useState(false)

//     // Estados para filtros locales
//     const [filtrosLocal, setFiltrosLocal] = useState({
//         estado_pago: 'todos' as 'todos' | EstadoPago,
//         agencia_id: 'todas',
//         rifa_id: 'todas',
//         fecha_desde: '',
//         fecha_hasta: '',
//         cliente_buscar: '',
//         orden_buscar: ''
//     })

//     // ✅ Sincronizar página de URL con store
//     useEffect(() => {
//         const pageParam = Number(searchParams.get('page')) || 1
        
//         if (pageParam !== currentPage) {
//             console.log('🔄 Sincronizando página URL → Store:', pageParam)
//             setPage(pageParam)
//         }
//     }, [searchParams])

//     // ✅ Sincronizar página de store con URL
//     useEffect(() => {
//         const pageParam = Number(searchParams.get('page')) || 1
        
//         if (currentPage !== pageParam) {
//             console.log('🔄 Sincronizando página Store → URL:', currentPage)
//             searchParams.set('page', currentPage.toString())
//             setSearchParams(searchParams)
//         }
//     }, [currentPage])

//     // Sincronizar filtros locales con el store
//     useEffect(() => {
//         setFiltrosLocal({
//             estado_pago: filtros.estado_pago || 'todos',
//             agencia_id: 'todas',
//             rifa_id: filtros.rifa_id || 'todas',
//             fecha_desde: filtros.fecha_desde || '',
//             fecha_hasta: filtros.fecha_hasta || '',
//             cliente_buscar: filtros.cliente_buscar || '',
//             orden_buscar: filtros.orden_buscar || ''
//         })
//     }, [filtros])

//     // Cargar datos iniciales
//     useEffect(() => {
//         if (contexto && !datosInicialescargados) {
//             cargarDatosIniciales()
//         }
//     }, [contexto, datosInicialescargados])

//     const cargarDatosIniciales = async () => {
//         if (datosInicialescargados) return

//         setDatosInicialesCargados(true)

//         const [listaRifas] = await Promise.all([
//             obtenerRifas(),
//             contexto === 'admin' ? obtenerAgencias() : Promise.resolve([])
//         ])

//         setRifas(listaRifas)
//     }

//     // Aplicar filtros
//     const aplicarFiltros = () => {
//         const filtrosLimpios: any = {}

//         if (filtrosLocal.estado_pago && filtrosLocal.estado_pago !== 'todos') {
//             filtrosLimpios.estado_pago = filtrosLocal.estado_pago
//         }

//         if (filtrosLocal.rifa_id && filtrosLocal.rifa_id !== 'todas') {
//             filtrosLimpios.rifa_id = filtrosLocal.rifa_id
//         }

//         if (filtrosLocal.fecha_desde) {
//             filtrosLimpios.fecha_desde = filtrosLocal.fecha_desde
//         }

//         if (filtrosLocal.fecha_hasta) {
//             filtrosLimpios.fecha_hasta = filtrosLocal.fecha_hasta
//         }

//         if (filtrosLocal.cliente_buscar) {
//             filtrosLimpios.cliente_buscar = filtrosLocal.cliente_buscar
//         }

//         if (filtrosLocal.orden_buscar) {
//             filtrosLimpios.orden_buscar = filtrosLocal.orden_buscar
//         }

//         setFiltros(filtrosLimpios)
//     }

//     // Limpiar filtros
//     const handleLimpiarFiltros = () => {
//         const filtrosVacios = {
//             estado_pago: 'todos' as const,
//             agencia_id: 'todas',
//             rifa_id: 'todas',
//             fecha_desde: '',
//             fecha_hasta: '',
//             cliente_buscar: '',
//             orden_buscar: ''
//         }
//         setFiltrosLocal(filtrosVacios)
//         limpiarFiltros()
//     }

//     // Manejar edición
//     const iniciarEdicion = (ordenId: string, estadoActual: EstadoPago) => {
//         setEditandoOrden(ordenId)
//         setNuevoEstado(estadoActual)
//     }

//     const cancelarEdicion = () => {
//         setEditandoOrden(null)
//         setNuevoEstado('pendiente')
//     }

//     const guardarEstado = async (ordenId: string) => {
//         const exito = await actualizarEstadoPago(ordenId, nuevoEstado)
//         if (exito) {
//             setEditandoOrden(null)
//         }
//     }

//     // Badge de estado
//     const getEstadoBadgeColor = (estado: EstadoPago) => {
//         switch (estado) {
//             case 'pagado':
//                 return 'bg-green-600 text-white'
//             case 'pendiente':
//                 return 'bg-yellow-600 text-white'
//             case 'fallido':
//                 return 'bg-red-600 text-white'
//             case 'reembolsado':
//                 return 'bg-gray-600 text-white'
//             default:
//                 return 'bg-gray-600 text-white'
//         }
//     }

//     // Formatear fecha
//     const formatearFecha = (fecha: string) => {
//         return new Date(fecha).toLocaleDateString('es-ES', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         })
//     }

//     // Refresh manual
//     const handleRefreshManual = () => {
//         cargarOrdenes({}, true)
//     }

//     return (
//         <Card className="w-full">
//             <CardHeader>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                     <div className="flex items-center gap-2">
//                         <CardTitle className="flex items-center gap-2">
//                             <FileText className="h-5 w-5" />
//                             {contexto === 'admin' ? 'Gestión de Órdenes (Todas)' : 'Mis Órdenes de Boletos'}
//                         </CardTitle>
//                         <Badge variant="secondary">{totalCount} órdenes</Badge>
//                     </div>
//                     <div className="flex gap-2">
//                         <Button
//                             onClick={() => setMostrarFiltros(!mostrarFiltros)}
//                             variant="outline"
//                             size="sm"
//                         >
//                             <Filter className="h-4 w-4 mr-2" />
//                             Filtros
//                         </Button>
//                         <Button
//                             onClick={handleRefreshManual}
//                             disabled={loading}
//                             variant="outline"
//                             size="sm"
//                         >
//                             <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
//                             Actualizar
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Panel de filtros */}
//                 {mostrarFiltros && (
//                     <Card className="mt-4">
//                         <CardContent className="pt-4">
//                             <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                                 {/* Filtro de estado */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="estado-filtro">Estado</Label>
//                                     <Select
//                                         value={filtrosLocal.estado_pago}
//                                         onValueChange={(value) => setFiltrosLocal(prev => ({
//                                             ...prev,
//                                             estado_pago: value as 'todos' | EstadoPago
//                                         }))}
//                                     >
//                                         <SelectTrigger id="estado-filtro">
//                                             <SelectValue />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="todos">Todos</SelectItem>
//                                             <SelectItem value="pendiente">Pendiente</SelectItem>
//                                             <SelectItem value="pagado">Pagado</SelectItem>
//                                             <SelectItem value="fallido">Fallido</SelectItem>
//                                             <SelectItem value="reembolsado">Reembolsado</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 {/* Filtro de rifa */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="rifa-filtro">Rifa</Label>
//                                     <Select
//                                         value={filtrosLocal.rifa_id}
//                                         onValueChange={(value) => setFiltrosLocal(prev => ({ ...prev, rifa_id: value }))}
//                                     >
//                                         <SelectTrigger id="rifa-filtro">
//                                             <SelectValue placeholder="Todas" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="todas">Todas</SelectItem>
//                                             {rifas.map(rifa => (
//                                                 <SelectItem key={rifa.id} value={rifa.id}>
//                                                     {rifa.nombre}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 {/* Filtro de Orden ID */}
//                                 <div className="space-y-2 md:col-span-1">
//                                     <Label htmlFor="orden-buscar">Orden</Label>
//                                     <Input
//                                         id="orden-buscar"
//                                         type="text"
//                                         placeholder="ID orden..."
//                                         className="text-sm"
//                                         value={filtrosLocal.orden_buscar}
//                                         onChange={(e) => setFiltrosLocal(prev => ({ ...prev, orden_buscar: e.target.value }))}
//                                     />
//                                 </div>

//                                 {/* Fecha desde */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="fecha-desde">Desde</Label>
//                                     <Input
//                                         id="fecha-desde"
//                                         type="date"
//                                         value={filtrosLocal.fecha_desde}
//                                         onChange={(e) => setFiltrosLocal(prev => ({ ...prev, fecha_desde: e.target.value }))}
//                                     />
//                                 </div>

//                                 {/* Fecha hasta */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="fecha-hasta">Hasta</Label>
//                                     <Input
//                                         id="fecha-hasta"
//                                         type="date"
//                                         value={filtrosLocal.fecha_hasta}
//                                         onChange={(e) => setFiltrosLocal(prev => ({ ...prev, fecha_hasta: e.target.value }))}
//                                     />
//                                 </div>

//                                 {/* Búsqueda de cliente */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="cliente-buscar">Cliente</Label>
//                                     <Input
//                                         id="cliente-buscar"
//                                         placeholder="Buscar cliente..."
//                                         value={filtrosLocal.cliente_buscar}
//                                         onChange={(e) => setFiltrosLocal(prev => ({ ...prev, cliente_buscar: e.target.value }))}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex gap-2 mt-4">
//                                 <Button onClick={aplicarFiltros} size="sm">
//                                     <Search className="h-4 w-4 mr-2" />
//                                     Aplicar Filtros
//                                 </Button>
//                                 <Button onClick={handleLimpiarFiltros} variant="outline" size="sm">
//                                     <X className="h-4 w-4 mr-2" />
//                                     Limpiar
//                                 </Button>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}
//             </CardHeader>

//             <CardContent>
//                 {loading ? (
//                     <div className="flex items-center justify-center py-8">
//                         <RefreshCw className="h-6 w-6 animate-spin mr-2" />
//                         Cargando órdenes...
//                     </div>
//                 ) : error ? (
//                     <div className="text-center py-8 text-red-600">
//                         Error: {error}
//                     </div>
//                 ) : ordenes.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                         {contexto === 'admin'
//                             ? 'No se encontraron órdenes en el sistema'
//                             : 'No tienes órdenes registradas'
//                         }
//                     </div>
//                 ) : (
//                     <>
//                         <div className="overflow-x-auto">
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>Fecha</TableHead>
//                                         <TableHead>Orden</TableHead>
//                                         <TableHead>Cliente</TableHead>
//                                         <TableHead>Cédula</TableHead>
//                                         {contexto === 'admin' && <TableHead>Agencia</TableHead>}
//                                         {/* <TableHead>Rifa</TableHead> */}
//                                         <TableHead>Boletos</TableHead>
//                                         <TableHead>Total</TableHead>
//                                         <TableHead>
//                                             <div className="flex items-center gap-1">
//                                                 <Send className="h-3 w-3" />
//                                                 <span className="hidden sm:inline">Notificación</span>
//                                             </div>
//                                         </TableHead>
//                                         <TableHead>Estado</TableHead>
//                                         <TableHead>Acciones</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {ordenes.map((orden) => (
//                                         <TableRow key={orden.id}>
//                                             <TableCell className="text-sm">
//                                                 <div className="flex items-center gap-1">
//                                                     <Calendar className="h-3 w-3 text-gray-500" />
//                                                     {formatearFecha(orden.fecha)}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell className="text-sm">
//                                                 <div className="flex items-center gap-1">
//                                                     <Ticket className="h-3 w-3 text-gray-500" />
//                                                     {orden.id.substring(0, 8).toUpperCase()}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex items-center gap-1">
//                                                     <Users className="h-3 w-3 text-gray-500" />
//                                                     {orden.cliente_nombre}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell className="font-mono text-sm">
//                                                 {orden.documento_identidad}
//                                             </TableCell>
//                                             {contexto === 'admin' && (
//                                                 <TableCell>{orden.agencia_nombre}</TableCell>
//                                             )}
//                                             {/* <TableCell>{orden.rifa_nombre}</TableCell> */}
//                                             <TableCell className="text-center">
//                                                 <Badge variant="outline">{orden.cantidad_boletos}</Badge>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex items-center gap-1">
//                                                     <CreditCard className="h-3 w-3 text-gray-500" />
//                                                     ${orden.total_pago.toLocaleString()}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <CustomMetodoNotificacionBadge
//                                                     enviado_email={orden.enviado_email}
//                                                     enviado_whatsapp={orden.enviado_whatsapp}
//                                                     enviado_sms={orden.enviado_sms}
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 {editandoOrden === orden.id ? (
//                                                     <Select
//                                                         value={nuevoEstado}
//                                                         onValueChange={(value) => setNuevoEstado(value as EstadoPago)}
//                                                     >
//                                                         <SelectTrigger className="w-32">
//                                                             <SelectValue />
//                                                         </SelectTrigger>
//                                                         <SelectContent>
//                                                             <SelectItem value="pendiente">Pendiente</SelectItem>
//                                                             <SelectItem value="pagado">Pagado</SelectItem>
//                                                             <SelectItem value="fallido">Fallido</SelectItem>
//                                                             <SelectItem value="reembolsado">Reembolsado</SelectItem>
//                                                         </SelectContent>
//                                                     </Select>
//                                                 ) : (
//                                                     <Badge className={getEstadoBadgeColor(orden.estado_pago)}>
//                                                         {orden.estado_pago.charAt(0).toUpperCase() + orden.estado_pago.slice(1)}
//                                                     </Badge>
//                                                 )}
//                                             </TableCell>
//                                             <TableCell>
//                                                 {editandoOrden === orden.id ? (
//                                                     <div className="flex gap-1">
//                                                         <Button
//                                                             onClick={() => guardarEstado(orden.id)}
//                                                             size="sm"
//                                                             variant="default"
//                                                         >
//                                                             <Save className="h-3 w-3" />
//                                                         </Button>
//                                                         <Button
//                                                             onClick={cancelarEdicion}
//                                                             size="sm"
//                                                             variant="outline"
//                                                         >
//                                                             <X className="h-3 w-3" />
//                                                         </Button>
//                                                     </div>
//                                                 ) : (
//                                                     <Button
//                                                         onClick={() => iniciarEdicion(orden.id, orden.estado_pago)}
//                                                         size="sm"
//                                                         variant="outline"
//                                                     >
//                                                         <Edit className="h-3 w-3" />
//                                                     </Button>
//                                                 )}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </div>

//                         {/* ✅ Paginación */}
//                         {totalPages > 1 && (
//                             <div className="mt-6 border-t pt-4">
//                                 <CustomPagination totalPages={totalPages} />
//                             </div>
//                         )}
//                     </>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }

// export default CustomTableOrders


import React, { useState, useEffect } from 'react'
import { useOrdenesStore } from '@/stores/useOrdenesStore'
import { useSearchParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CustomPagination } from '@/components/custom/CustomPagination'
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
    Send,

} from 'lucide-react'
import { CustomMetodoNotificacionBadge } from './CustomMetodonotificacionbadge'
import { useEmailStore } from '@/stores/useEmailStore'

import { toast } from 'sonner'
import { CustomReenviarNotificacionDialog } from './CustomReenviarNotificacionDialog'

type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'

const CustomTableOrders: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const {
        ordenes,
        loading,
        error,
        contexto,
        filtros,
        currentPage,
        totalPages,
        totalCount,
        cargarOrdenes,
        actualizarEstadoPago,
        setFiltros,
        limpiarFiltros,
        setPage,
        obtenerAgencias,
        obtenerRifas
    } = useOrdenesStore()

    // Estados locales
    const [editandoOrden, setEditandoOrden] = useState<string | null>(null)
    const [nuevoEstado, setNuevoEstado] = useState<EstadoPago>('pendiente')
    const [rifas, setRifas] = useState<{ id: string; nombre: string }[]>([])
    const [mostrarFiltros, setMostrarFiltros] = useState(false)
    const [datosInicialescargados, setDatosInicialesCargados] = useState(false)

    //  Estados para reenvío de notificaciones
    const [ordenReenvio, setOrdenReenvio] = useState<string | null>(null)
    const [reenviando, setReenviando] = useState(false)

    //  Hook del store de emails
    const { reenviarNotificaciones } = useEmailStore()

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

    // Sincronizar página de URL con store
    useEffect(() => {
        const pageParam = Number(searchParams.get('page')) || 1

        if (pageParam !== currentPage) {
            console.log('🔄 Sincronizando página URL → Store:', pageParam)
            setPage(pageParam)
        }
    }, [searchParams])

    // Sincronizar página de store con URL
    useEffect(() => {
        const pageParam = Number(searchParams.get('page')) || 1

        if (currentPage !== pageParam) {
            console.log('🔄 Sincronizando página Store → URL:', currentPage)
            searchParams.set('page', currentPage.toString())
            setSearchParams(searchParams)
        }
    }, [currentPage])

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

    // Cargar datos iniciales
    useEffect(() => {
        if (contexto && !datosInicialescargados) {
            cargarDatosIniciales()
        }
    }, [contexto, datosInicialescargados])

    const cargarDatosIniciales = async () => {
        if (datosInicialescargados) return

        setDatosInicialesCargados(true)

        const [listaRifas] = await Promise.all([
            obtenerRifas(),
            contexto === 'admin' ? obtenerAgencias() : Promise.resolve([])
        ])

        setRifas(listaRifas)
    }

    // Aplicar filtros
    const aplicarFiltros = () => {
        const filtrosLimpios: any = {}

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

    // Handler para reenviar notificaciones
    const handleReenviarNotificaciones = async (
        metodos: { email: boolean; whatsapp: boolean; sms: boolean, nuevoPhone?: string}
    ) => {
        if (!ordenReenvio) return

        setReenviando(true)
        try {
            const resultados = await reenviarNotificaciones(ordenReenvio, metodos)

            if (resultados.email || resultados.whatsapp || resultados.sms) {
                // Recargar órdenes para actualizar estado
                cargarOrdenes({}, true)
            }
        } catch (error) {
            console.error('Error reenviando notificaciones:', error)
            toast.error('Error al reenviar notificaciones')
        } finally {
            setReenviando(false)
        }
    }

    // Badge de estado
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

    // Refresh manual
    const handleRefreshManual = () => {
        cargarOrdenes({}, true)
    }

    // ✅ Obtener orden seleccionada para el dialog
    const ordenSeleccionada = ordenes.find(o => o.id === ordenReenvio)

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {contexto === 'admin' ? 'Gestión de Órdenes (Todas)' : 'Mis Órdenes de Boletos'}
                        </CardTitle>
                        <Badge variant="secondary">{totalCount} órdenes</Badge>
                    </div>
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

                                {/* Filtro de Orden ID */}
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

                                {/* Fecha desde */}
                                <div className="space-y-2">
                                    <Label htmlFor="fecha-desde">Desde</Label>
                                    <Input
                                        id="fecha-desde"
                                        type="date"
                                        value={filtrosLocal.fecha_desde}
                                        onChange={(e) => setFiltrosLocal(prev => ({ ...prev, fecha_desde: e.target.value }))}
                                    />
                                </div>

                                {/* Fecha hasta */}
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
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Orden</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Cédula</TableHead>
                                        {contexto === 'admin' && <TableHead>Agencia</TableHead>}
                                        <TableHead>Boletos</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-1">
                                                <Send className="h-3 w-3" />
                                                <span className="hidden sm:inline">Notificación</span>
                                            </div>
                                        </TableHead>
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
                                            {contexto === 'admin' && (
                                                <TableCell>{orden.agencia_nombre}</TableCell>
                                            )}
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
                                                <CustomMetodoNotificacionBadge
                                                    enviado_email={orden.enviado_email}
                                                    enviado_whatsapp={orden.enviado_whatsapp}
                                                    enviado_sms={orden.enviado_sms}
                                                />
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
                                                    <div className="flex gap-1">
                                                        {/* Botón Editar Estado */}
                                                        <Button
                                                            onClick={() => iniciarEdicion(orden.id, orden.estado_pago)}
                                                            size="sm"
                                                            variant="outline"
                                                            title="Editar estado"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>

                                                        {/*  Botón Reenviar Notificación */}
                                                        <Button
                                                            onClick={() => setOrdenReenvio(orden.id)}
                                                            size="sm"
                                                            variant="outline"
                                                            title="Reenviar notificación"
                                                        >
                                                            <Send className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="mt-6 border-t pt-4">
                                <CustomPagination totalPages={totalPages} />
                            </div>
                        )}
                    </>
                )}
            </CardContent>

            {/* ✅ Dialog de Reenvío de Notificaciones */}
            {ordenSeleccionada && (
                <CustomReenviarNotificacionDialog
                    open={!!ordenReenvio}
                    onOpenChange={(open: boolean) => !open && setOrdenReenvio(null)}
                    orden={{
                        id: ordenSeleccionada.id,
                        cliente_nombre: ordenSeleccionada.cliente_nombre ?? '',
                        cliente_phone: ordenSeleccionada.cliente_phone || '',
                        enviado_email: ordenSeleccionada.enviado_email ?? false,
                        enviado_whatsapp: ordenSeleccionada.enviado_whatsapp ?? false,
                        enviado_sms: ordenSeleccionada.enviado_sms ?? false
                    }}
                    onConfirm={handleReenviarNotificaciones}
                    loading={reenviando}
                />
            )}
        </Card>
    )
}

export default CustomTableOrders