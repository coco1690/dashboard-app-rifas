import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, Mail, Phone, Building2, DollarSign, User, Users } from "lucide-react"

interface Props {
  usuarios: {
    id: string;
    nombre: string;
    email: string;
    phone: string;
    user_type: 'cliente' | 'agencia';
    ciudad?: string;
    direccion?: string;
    comision?: number;
    verificado?: boolean;
  }[];
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  onVerificadoToggle: (userId: string, isVerified: boolean) => void;
  onCardClick: (userId: string) => void;
}

export const CustomGetUsers = ({ usuarios, onEdit, onDelete, onVerificadoToggle, onCardClick }: Props) => {
  const handleCardClick = (userId: string, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="switch"]')) {
      return;
    }
    onCardClick(userId);
  };

  const getUserTypeVariant = (userType: 'cliente' | 'agencia') => {
    return userType === 'cliente' ? 'default' : 'secondary';
  };

  const getUserTypeIcon = (userType: 'cliente' | 'agencia') => {
    return userType === 'cliente' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />;
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Usuarios Registrados
          </h2>
          <p className="text-muted-foreground">
            Total de usuarios: {usuarios.length}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {usuarios.map((user) => (
            <Card
              key={user.id}
              className="hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex flex-col h-full"
              onClick={(e) => handleCardClick(user.id, e)}
            >
              {/* Header con altura fija */}
              <CardHeader className="bg-gradient-to-l from-teal-500 to-teal-700 text-white p-3 -m-6 mb-4 rounded-t-lg">
                <div className="flex items-center justify-between mr-5 ml-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      {getUserTypeIcon(user.user_type)}
                    </div>
                    <h3 className="font-semibold text-lg truncate">
                      {user.nombre}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(user.id);
                      }}
                      className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user.id);
                      }}
                      className="h-8 w-8 bg-destructive/80 hover:bg-destructive text-white border-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Content con flex-grow para que ocupe el espacio disponible */}
              <CardContent className="p-4 space-y-3 flex-grow">
                {/* Email */}
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm font-medium truncate" title={user.email}>
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Teléfono</Label>
                    <p className="text-sm font-medium">{user.phone}</p>
                  </div>
                </div>

                {/* Ciudad - condicional */}
                {user.ciudad && (
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Ciudad</Label>
                      <p className="text-sm font-medium">{user.ciudad}</p>
                    </div>
                  </div>
                )}

                {/* Comisión - condicional */}
                {user.comision !== undefined && (
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                      <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Comisión</Label>
                      <p className="text-sm font-medium">{user.comision}%</p>
                    </div>
                  </div>
                )}

                {/* Tipo de usuario */}
                <div className="flex items-center justify-between pt-1">
                  <Label className="text-xs text-muted-foreground">Tipo:</Label>
                  <Badge variant={getUserTypeVariant(user.user_type)} className="text-xs px-2 py-0.5">
                    {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                  </Badge>
                </div>
              </CardContent>

              {/* Footer siempre al final */}
              <CardFooter className="bg-muted/30 border-t py-2 px-4 mt-auto">
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs text-muted-foreground">
                    ID: {user.id.slice(0, 8)}...
                  </p>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`verified-${user.id}`} className="text-sm font-medium">
                      Verificado
                    </Label>
                    <Switch
                      id={`verified-${user.id}`}
                      checked={Boolean(user.verificado)}
                      onCheckedChange={(checked) => {
                        onVerificadoToggle(user.id, checked);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Estado vacío */}
        {usuarios.length === 0 && (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No hay usuarios registrados
              </h3>
              <p className="text-muted-foreground">
                Los usuarios aparecerán aquí cuando se registren en el sistema.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};