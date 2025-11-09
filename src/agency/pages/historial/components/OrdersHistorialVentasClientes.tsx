import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useHistorialVentasStore, type HistorialVenta } from '@/stores/useHistorialVentasStore'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { useSearchParams } from 'react-router'
import { CustomPagination } from '@/components/custom/CustomPagination'
import { User, Search, ExpandIcon, Loader2 } from 'lucide-react'
import type { ClienteAgrupado } from '../types/ClienteAgrupado'
import { ClienteCard } from './ClienteCard'


interface OrdersHistorialVentasClientesProps {
  agenciaId?: string // Nuevo prop para filtrar por agencia
}

const verificarGanadores = (venta: HistorialVenta): {
  esGanadorSuerte: boolean
  esGanadorPrincipal: boolean
  numerosGanadores: string[]
} => {
  const result = {
    esGanadorSuerte: false,
    esGanadorPrincipal: false,
    numerosGanadores: [] as string[]
  }

  if (!venta.numeros_boletos || venta.numeros_boletos.length === 0) return result

  if (venta.rifa_numeros_suerte?.length) {
    const numerosGanadoresSuerte = venta.numeros_boletos.filter(n => venta.rifa_numeros_suerte!.includes(n))
    if (numerosGanadoresSuerte.length > 0) {
      result.esGanadorSuerte = true
      result.numerosGanadores.push(...numerosGanadoresSuerte)
    }
  }

  if (venta.rifa_numero_ganador && venta.numeros_boletos.includes(venta.rifa_numero_ganador)) {
    result.esGanadorPrincipal = true
    if (!result.numerosGanadores.includes(venta.rifa_numero_ganador)) {
      result.numerosGanadores.push(venta.rifa_numero_ganador)
    }
  }

  return result
}

export const OrdersHistorialVentasClientes: React.FC<OrdersHistorialVentasClientesProps> = ({
  agenciaId
}) => {
  const [searchParams] = useSearchParams()
  const pageParam = Number(searchParams.get('page')) || 1
  const [clienteBusqueda, setClienteBusqueda] = useState('')
  const debouncedCliente = useDebounceValue(clienteBusqueda, 500)
  const [openClients, setOpenClients] = useState<Set<string>>(new Set())

  const {
    ventas, loading, error, totalCount, pageSize,
    obtenerHistorial, buscarPorCliente, setFiltros
  } = useHistorialVentasStore()

  // useEffect(() => {
  //   obtenerHistorial({}, pageParam)
  // }, [pageParam])

  // Establecer filtro de agencia al montar el componente
  useEffect(() => {
    if (agenciaId) {
      setFiltros({ agenciaId })
    }
  }, [agenciaId, setFiltros])

  // Cargar historial inicial
  useEffect(() => {
    const filtrosIniciales = agenciaId ? { agenciaId } : {}
    obtenerHistorial(filtrosIniciales, pageParam)
  }, [pageParam, agenciaId])

  useEffect(() => {
    if (debouncedCliente.length > 0) buscarPorCliente(debouncedCliente)
    else obtenerHistorial({}, 1)
  }, [debouncedCliente])



  const agruparVentasPorCliente = (ventas: HistorialVenta[]): ClienteAgrupado[] => {
    const clientesMap = new Map<string, ClienteAgrupado>()

    ventas.forEach(venta => {
      const clienteId = venta.cliente_id
      const verificacion = verificarGanadores(venta)

      if (clientesMap.has(clienteId)) {
        const cliente = clientesMap.get(clienteId)!
        cliente.ventas.push(venta)
        cliente.totalVentas += 1
        cliente.totalBoletos += venta.cantidad_boletos
        cliente.totalMonto += venta.total_pago
        if (verificacion.esGanadorPrincipal) cliente.esGanadorPrincipal = true
        if (verificacion.esGanadorSuerte) cliente.esGanadorSuerte = true
        if (verificacion.esGanadorPrincipal || verificacion.esGanadorSuerte) cliente.ventasGanadoras.push(venta)
        cliente.numerosGanadores = [...new Set([...cliente.numerosGanadores, ...verificacion.numerosGanadores])]
      } else {
        clientesMap.set(clienteId, {
          cliente_id: venta.cliente_id,
          cliente_nombre: venta.cliente_nombre,
          cliente_cedula: venta.cliente_cedula,
          cliente_email: venta.cliente_email,
          cliente_telefono: venta.cliente_telefono,
          ventas: [venta],
          totalVentas: 1,
          totalBoletos: venta.cantidad_boletos,
          totalMonto: venta.total_pago,
          esGanadorPrincipal: verificacion.esGanadorPrincipal,
          esGanadorSuerte: verificacion.esGanadorSuerte,
          ventasGanadoras: (verificacion.esGanadorPrincipal || verificacion.esGanadorSuerte) ? [venta] : [],
          numerosGanadores: verificacion.numerosGanadores
        })
      }
    })

    // return Array.from(clientesMap.values()).sort((a, b) => {
    //   if (a.esGanadorPrincipal && !b.esGanadorPrincipal) return -1
    //   if (!a.esGanadorPrincipal && b.esGanadorPrincipal) return 1
    //   if (a.esGanadorSuerte && !b.esGanadorSuerte) return -1
    //   if (!a.esGanadorSuerte && b.esGanadorSuerte) return 1
    //   return a.cliente_nombre.localeCompare(b.cliente_nombre)
    // })

    return Array.from(clientesMap.values()).sort((a, b) => {
      // 1. Ganadores principales primero
      if (a.esGanadorPrincipal && !b.esGanadorPrincipal) return -1
      if (!a.esGanadorPrincipal && b.esGanadorPrincipal) return 1

      // 2. Ganadores de suerte segundo
      if (a.esGanadorSuerte && !b.esGanadorSuerte) return -1
      if (!a.esGanadorSuerte && b.esGanadorSuerte) return 1

      // 3. ✅ NUEVO: Ordenar por fecha de venta más reciente
      const fechaA = new Date(a.ventas[0].fecha_venta).getTime()
      const fechaB = new Date(b.ventas[0].fecha_venta).getTime()
      return fechaB - fechaA  // Más reciente primero
    })

  }

  const toggleClient = (clienteId: string) => {
    const newOpenClients = new Set(openClients)
    newOpenClients.has(clienteId) ? newOpenClients.delete(clienteId) : newOpenClients.add(clienteId)
    setOpenClients(newOpenClients)
  }

  const toggleAll = () => {
    if (openClients.size === clientesAgrupados.length) setOpenClients(new Set())
    else setOpenClients(new Set(clientesAgrupados.map(c => c.cliente_id)))
  }

  const clientesAgrupados = agruparVentasPorCliente(ventas)
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo optimizado para móvil */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 py-4 sm:px-6">
        <div className="space-y-3">
          {/* Título */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Historial de Ventas
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Ventas agrupadas por cliente
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o cédula..."
                value={clienteBusqueda}
                onChange={(e) => setClienteBusqueda(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>

            {/* Botón expandir/colapsar */}
            {clientesAgrupados.length > 0 && (
              <Button
                onClick={toggleAll}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 shrink-0"
              >
                <ExpandIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {openClients.size === clientesAgrupados.length ? 'Colapsar Todo' : 'Expandir Todo'}
                </span>
                <span className="sm:hidden">
                  {openClients.size === clientesAgrupados.length ? 'Colapsar' : 'Expandir'}
                </span>
              </Button>
            )}
          </div>

          {/* Resumen de resultados */}
          {!loading && clientesAgrupados.length > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-blue-50 rounded-lg px-3 py-2">
              <span>
                {clientesAgrupados.length} cliente{clientesAgrupados.length !== 1 ? 's' : ''} encontrado{clientesAgrupados.length !== 1 ? 's' : ''}
              </span>
              <span>
                {clientesAgrupados.filter(c => c.esGanadorPrincipal || c.esGanadorSuerte).length} ganador{clientesAgrupados.filter(c => c.esGanadorPrincipal || c.esGanadorSuerte).length !== 1 ? 'es' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-3 py-4 sm:px-6">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando ventas...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Lista de clientes */}
        <div className="space-y-3 mb-6">
          {clientesAgrupados.map((cliente) => (
            <ClienteCard
              key={cliente.cliente_id}
              cliente={cliente}
              isOpen={openClients.has(cliente.cliente_id)}
              onToggle={() => toggleClient(cliente.cliente_id)}
            />
          ))}
        </div>

        {/* Estado vacío */}
        {!loading && clientesAgrupados.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No se encontraron clientes
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {clienteBusqueda
                  ? `No hay ventas que coincidan con "${clienteBusqueda}"`
                  : "No hay ventas registradas en el sistema"
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Paginación fija en la parte inferior */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-3 py-4 sm:px-6">
          <CustomPagination totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}