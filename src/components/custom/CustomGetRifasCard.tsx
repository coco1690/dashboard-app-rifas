import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Eye, Trash2, Users, DollarSign, Calendar, Trophy, Sparkles, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Rifa {
  id: string
  titulo: string
  subtitulo?: string
  descripcion?: string
  estado: 'creada' | 'activa' | 'finalizada' | 'cancelada'
  fecha_inicio: string
  fecha_fin?: string
  numero_inicial: number
  numero_final: number
  precio_boleta: number
  imagenes?: string[]
  numero_ganador?: string
  numeros_de_la_suerte?: string[]
  loteria?: string
  admin_id: string
  created_at: string
}

interface CustomGetRifasCardProps {
  rifa: Rifa
  onDelete?: (id: string) => void
  onEdit?: (rifa: Rifa) => void
  onView?: (rifa: Rifa) => void
  showActions?: boolean
  className?: string
}

export const CustomGetRifasCard: React.FC<CustomGetRifasCardProps> = ({
  rifa,
  onDelete,
  onEdit,
  onView,
  showActions = true,
  className
}) => {
  const totalBoletos = rifa.numero_final - rifa.numero_inicial + 1
  const valorTotal = totalBoletos * rifa.precio_boleta

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'activa': 'bg-green-100 text-green-800 border-green-200',
      'creada': 'bg-blue-100 text-blue-800 border-blue-200',
      'finalizada': 'bg-gray-100 text-gray-800 border-gray-200',
      'cancelada': 'bg-red-100 text-red-800 border-red-200'
    }
    return variants[estado as keyof typeof variants] || variants.creada
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <Card className={cn("w-full max-w-sm hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div>
            <CardTitle className="text-lg leading-6">
              {rifa.titulo}
            </CardTitle>
          </div>
          
          {/* Badge del estado como elemento separado */}
          <div>
            <Badge 
              variant="outline"
              className={cn("text-xs font-medium px-2 py-1 w-fit", getEstadoBadge(rifa.estado))}
            >
              {rifa.estado.charAt(0).toUpperCase() + rifa.estado.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información básica */}
        <div className="space-y-3">
          {/* <div className="flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Rango:</span>
            <span className="font-medium">
              {String(rifa.numero_inicial).padStart(4, '0')} - {String(rifa.numero_final).padStart(4, '0')}
            </span>
          </div> */}

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Boletas:</span>
            <span className="font-medium">{totalBoletos.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Precio:</span>
            <span className="font-medium">${rifa.precio_boleta.toFixed(2)}</span>
          </div>
        </div>

        {/* Valor total destacado */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">Valor Total</span>
            <span className="text-lg font-bold text-green-600">
              ${valorTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="space-y-2">
          {rifa.loteria && (
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Lotería:</span>
              <span className="font-medium">{rifa.loteria}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Inicio:</span>
            <span className="font-medium">{formatFecha(rifa.fecha_inicio)}</span>
          </div>
        </div>

        {/* Números de la suerte */}
        {rifa.numeros_de_la_suerte && rifa.numeros_de_la_suerte.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Números de la Suerte ({rifa.numeros_de_la_suerte.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {rifa.numeros_de_la_suerte.slice(0, 5).map((numero, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-green-100 text-green-700 border-green-300 text-xs font-mono"
                >
                  {numero}
                </Badge>
              ))}
              {rifa.numeros_de_la_suerte.length > 5 && (
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                  +{rifa.numeros_de_la_suerte.length - 5}
                </Badge>
              )}
            </div>
            <p className="text-xs text-green-700 mt-2">
              Números seleccionados especialmente para esta rifa
            </p>
          </div>
        )}

        {/* Acciones */}
        {showActions && (
          <>
            <Separator />
            <div className="flex gap-2">
              {onView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(rifa)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
              )}
              
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(rifa)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(rifa.id)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}