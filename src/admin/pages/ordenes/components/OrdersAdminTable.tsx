import { CustomPagination } from "@/components/custom/CustomPagination"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, 
} from "@/components/ui/table"

export const OrdersAdminTable = () => {
  return (
    <>
        <Table className="overflow-x-auto bg-white p-10 shadow-xs border border-gray-200 mb-10">
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">ID_orden</TableHead>
            <TableHead>Agencia</TableHead>
            <TableHead>cliente</TableHead>
            <TableHead>C_cedula</TableHead>
            <TableHead>C_telefono</TableHead>
            <TableHead>Rifa</TableHead>
            <TableHead>status_Rifa</TableHead>
            <TableHead>Boletas_compradas</TableHead>
            <TableHead>Numeros_jugados</TableHead>
            <TableHead>Valor_Boleta</TableHead>
            <TableHead>Status_compra</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Total</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            <TableRow>
            <TableCell className="font-medium">01</TableCell>
            <TableCell>Pepito</TableCell>
            <TableCell>Diego</TableCell>
            <TableCell>1121875678</TableCell>
            <TableCell>312456987</TableCell>
            <TableCell>Moto 0km</TableCell>
            <TableCell>En juego</TableCell>
            <TableCell>5</TableCell>
            <TableCell>1234,4567,7889,8738,9290</TableCell>
            <TableCell>12.00 </TableCell>
            <TableCell>Pendiente</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$60.00</TableCell>
            </TableRow>
        </TableBody>

        </Table>

        <CustomPagination  totalPages={10}/>
    </>
  )
}