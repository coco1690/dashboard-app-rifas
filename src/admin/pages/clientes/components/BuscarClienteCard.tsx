import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  MapPin, 
  Eye,
  Building2
} from 'lucide-react'

type ClienteFound = {
  user_id: string
  direccion: string
  ciudad: string
  agencia_id: string | null
  user: {
    id: string
    documento_identidad: string
    nombre: string
    email: string
    phone: string
    user_type: string
  }
}

type BuscarClienteCardProps = {
  cliente: ClienteFound
  onViewDetails: () => void
}

export const BuscarClienteCard = ({ cliente, onViewDetails }: BuscarClienteCardProps) => {
  return (
    <Card className="border-2 border-primary">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Header del cliente */}
          <div className="flex items-start justify-between pb-4 border-b">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{cliente.user.nombre}</h3>
                  <Badge variant="secondary" className="mt-1">Cliente</Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={onViewDetails}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Ver Detalles
            </Button>
          </div>

          {/* Información del cliente en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Documento */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Documento</p>
                <p className="font-semibold">
                  {cliente.user.documento_identidad || 'Sin documento'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold truncate">
                  {cliente.user.email}
                </p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-semibold">{cliente.user.phone}</p>
              </div>
            </div>

            {/* Ciudad */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Ciudad</p>
                <p className="font-semibold">
                  {cliente.ciudad || 'Sin ciudad'}
                </p>
              </div>
            </div>

            {/* Dirección */}
            {cliente.direccion && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-semibold">{cliente.direccion}</p>
                </div>
              </div>
            )}

            {/* Agencia */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Agencia</p>
                <Badge variant={cliente.agencia_id ? 'default' : 'outline'} className="mt-1">
                  {cliente.agencia_id ? 'Asignada' : 'Sin agencia'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}