import { Badge } from '@/components/ui/badge'
import { Crown, Star, Gift } from 'lucide-react'

interface GanadorBadgeProps {
  esGanadorPrincipal: boolean
  esGanadorSuerte: boolean
  numerosGanadores?: string[]
  compact?: boolean
}

export const GanadorBadge: React.FC<GanadorBadgeProps> = ({ 
  esGanadorPrincipal, 
  esGanadorSuerte, 
  numerosGanadores = [],
  compact = false 
}) => {
  if (!esGanadorPrincipal && !esGanadorSuerte) return null

  return (
    <div className={`flex flex-wrap gap-1 ${compact ? 'justify-center' : ''}`}>
      {esGanadorPrincipal && (
        <Badge className="bg-yellow-500 text-white animate-pulse text-xs">
          <Crown className="h-3 w-3 mr-1" />
          {compact ? 'PRINCIPAL' : 'GANADOR PRINCIPAL'}
        </Badge>
      )}
      {esGanadorSuerte && (
        <Badge className="bg-green-500 text-white text-xs">
          <Star className="h-3 w-3 mr-1" />
          {compact ? 'SUERTE' : 'NÚMERO DE LA SUERTE'}
        </Badge>
      )}
      {numerosGanadores.length > 0 && (
        <Badge variant="outline" className="bg-blue-50 border-blue-300 text-xs">
          <Gift className="h-3 w-3 mr-1" />
          {numerosGanadores.slice(0, compact ? 2 : 5).join(', ')}
          {compact && numerosGanadores.length > 2 && '...'}
        </Badge>
      )}
    </div>
  )
}