// import React from 'react'
// import { Label } from '@/components/ui/label'
// import { Button } from '@/components/ui/button'
// import { RefreshCw } from 'lucide-react'

// interface GridPaquetesPredefinidosProps {
//   paquetes: number[]
//   paqueteSeleccionado: number
//   precioBoleta: number
//   cargando: boolean
//   onSelect: (cantidad: number) => void
//   calcularTotal: (cantidad: number, precio: number) => number
// }

// export const GridPaquetesPredefinidos: React.FC<GridPaquetesPredefinidosProps> = ({
//   paquetes,
//   paqueteSeleccionado,
//   precioBoleta,
//   cargando,
//   onSelect,
//   calcularTotal
// }) => {
//   if (cargando) {
//     return (
//       <div className="flex justify-center py-8">
//         <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-3">
//       <Label className="text-base font-medium">Seleccionar Paquete</Label>
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//         {paquetes.map((cantidad) => {
//           const totalPaquete = calcularTotal(cantidad, precioBoleta)
//           const isSelected = paqueteSeleccionado === cantidad
          
//           return (
//             <Button
//               key={cantidad}
//               onClick={() => onSelect(cantidad)}
//               disabled={cargando}
//               variant={isSelected ? "default" : "outline"}
//               className="h-auto p-4 flex flex-col gap-1"
//             >
//               <span className="font-semibold">{cantidad} Boletos</span>
//               <span className="text-xs opacity-75">
//                 ${totalPaquete.toLocaleString()}
//               </span>
//             </Button>
//           )
//         })}
//       </div>
//     </div>
//   )
// }