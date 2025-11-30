import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface FiltrosReservasProps {
  terminoBusqueda: string
  onBusquedaChange: (termino: string) => void
}

export default function FiltrosReservas({ 
  terminoBusqueda, 
  onBusquedaChange 
}: FiltrosReservasProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por rifa, session ID o ID de reserva..."
          value={terminoBusqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}