import { useEffect } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useSearchParams } from 'react-router'
import { Input } from '@/components/ui/input'
import { useHistorialVentasStore } from '@/stores/useHistorialVentasStore'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { CustomPagination } from '@/components/custom/CustomPagination'


export const OrdersHistorialVentas = () => {
  const [searchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')
  const termino = searchParams.get('cliente') || ''

  const {
    ventas,
    obtenerHistorial,
    totalCount,
    pageSize,
    filtros,
    buscarPorCliente,
  } = useHistorialVentasStore()

  const [debouncedTermino] = useDebounceValue(termino, 500)
  const totalPages = Math.ceil(totalCount / pageSize)

  useEffect(() => {
    obtenerHistorial(filtros, page)
  }, [page])

  useEffect(() => {
    if (debouncedTermino) {
      buscarPorCliente(debouncedTermino)
    } else {
      obtenerHistorial(filtros, 1)
    }
  }, [debouncedTermino])

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Historial de ventas</h2>
          <Input
            placeholder="Buscar por cliente o cédula"
            defaultValue={termino}
            onChange={(e) => {
              const value = e.target.value
              searchParams.set('cliente', value)
              searchParams.set('page', '1')
              window.history.replaceState(null, '', `?${searchParams.toString()}`)
            }}
            className="max-w-sm"
          />
        </div>

        <ScrollArea className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Agencia</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Rifa</TableHead>
                <TableHead>Cant. Boletos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.orden_id}>
                  <TableCell>{new Date(venta.fecha_venta).toLocaleString()}</TableCell>
                  <TableCell>{venta.agencia_nombre}</TableCell>
                  <TableCell>{venta.cliente_nombre}</TableCell>
                  <TableCell>{venta.cliente_cedula}</TableCell>
                  <TableCell>{venta.rifa_titulo}</TableCell>
                  <TableCell>{venta.cantidad_boletos}</TableCell>
                  <TableCell>${venta.total_pago.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{venta.metodo_pago}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      venta.estado_pago === 'pagado'
                        ? 'default'
                        : venta.estado_pago === 'pendiente'
                          ? 'secondary'
                          : 'destructive'
                    }>
                      {venta.estado_pago}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="flex justify-center pt-4">
          <CustomPagination totalPages={totalPages} />
        </div>
      </CardContent>
    </Card>
  )
}