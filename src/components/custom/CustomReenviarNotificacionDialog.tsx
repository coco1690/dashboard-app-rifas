import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Mail, MessageSquare, Loader2, AlertCircle, MessageCircle, Edit2, Check } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { PhoneInput } from '@/components/ui/PhoneInput'

interface ReenviarNotificacionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orden: {
    id: string
    cliente_nombre: string
    cliente_phone: string  
    enviado_email: boolean
    enviado_whatsapp: boolean
    enviado_sms: boolean
  }
  onConfirm: (metodos: { 
    email: boolean
    whatsapp: boolean
    sms: boolean
    nuevoPhone?: string  
  }) => Promise<void>
  loading?: boolean
}

export const CustomReenviarNotificacionDialog = ({
  open,
  onOpenChange,
  orden,
  onConfirm,
  loading = false
}: ReenviarNotificacionDialogProps) => {
  const [metodos, setMetodos] = useState({
    email: false,
    whatsapp: false,
    sms: false
  })

  //  Estados para edición de teléfono
  const [editandoPhone, setEditandoPhone] = useState(false)
  const [nuevoPhone, setNuevoPhone] = useState(orden.cliente_phone)
  const [phoneValido, setPhoneValido] = useState(true)

  // Resetear teléfono cuando cambia la orden
  useEffect(() => {
    setNuevoPhone(orden.cliente_phone)
    setEditandoPhone(false)
  }, [orden.cliente_phone, open])

  // Verificar qué métodos fueron enviados originalmente
  const metodosDisponibles = {
    email: orden.enviado_email,
    whatsapp: orden.enviado_whatsapp,
    sms: orden.enviado_sms
  }

  const algunMetodoEnviado = metodosDisponibles.email || metodosDisponibles.whatsapp || metodosDisponibles.sms
  const requierePhone = metodos.whatsapp || metodos.sms
  const phoneModificado = nuevoPhone !== orden.cliente_phone

  //  Validar teléfono
  const validarPhone = (phone: string): boolean => {
    if (!phone) return false
    if (!phone.startsWith('+')) return false
    // Mínimo 10 dígitos después del código de país
    const digitos = phone.replace(/[^\d]/g, '')
    return digitos.length >= 10
  }

  const handlePhoneChange = (fullNumber: string) => {
    setNuevoPhone(fullNumber)
    setPhoneValido(validarPhone(fullNumber))
  }

  const handleConfirm = async () => {
    if (!metodos.email && !metodos.whatsapp && !metodos.sms) {
      return
    }

    // Validar teléfono si se requiere
    if (requierePhone && !phoneValido) {
      return
    }

    await onConfirm({
      ...metodos,
      nuevoPhone: phoneModificado ? nuevoPhone : undefined
    })
    
    // Resetear selección
    setMetodos({ email: false, whatsapp: false, sms: false })
    setEditandoPhone(false)
    onOpenChange(false)
  }

  const alMenosUnoSeleccionado = metodos.email || metodos.whatsapp || metodos.sms

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reenviar Notificación
          </DialogTitle>
          <DialogDescription>
            Selecciona el método para reenviar la confirmación a {orden.cliente_nombre}
          </DialogDescription>
        </DialogHeader>

        {!algunMetodoEnviado ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No se envió ninguna notificación originalmente para esta orden. No hay nada que reenviar.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4 py-4">
            {/* Sección de teléfono editable */}
            {(metodosDisponibles.whatsapp || metodosDisponibles.sms) && (
              <div className="mb-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">
                    Número de teléfono
                  </Label>
                  {!editandoPhone ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditandoPhone(true)}
                      className="h-8 gap-2"
                    >
                      <Edit2 className="h-3 w-3" />
                      Editar
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditandoPhone(false)
                        setNuevoPhone(orden.cliente_phone)
                      }}
                      className="h-8 gap-2"
                    >
                      <Check className="h-3 w-3" />
                      Listo
                    </Button>
                  )}
                </div>

                {editandoPhone ? (
                  <div className="space-y-2">
                    <PhoneInput
                      value={nuevoPhone}
                      onChange={handlePhoneChange}
                      placeholder="Ingrese número"
                      disabled={loading}
                      defaultCountryCode="ec"
                    />
                    {!phoneValido && nuevoPhone && (
                      <p className="text-xs text-destructive">
                        ⚠️ Número de teléfono inválido
                      </p>
                    )}
                    {phoneModificado && phoneValido && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          El número será actualizado en la base de datos
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono">{nuevoPhone}</p>
                    {phoneModificado && (
                      <Badge variant="secondary" className="text-xs">
                        Modificado
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="text-sm text-muted-foreground mb-2">
              Solo puedes reenviar por los métodos que fueron usados originalmente:
            </div>

            {/* Email */}
            {metodosDisponibles.email && (
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                <Checkbox
                  id="email"
                  checked={metodos.email}
                  onCheckedChange={(checked: boolean) => {
                    setMetodos(prev => ({ ...prev, email: checked }))
                  }}
                  disabled={loading}
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    Correo Electrónico
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    Enviado originalmente
                  </Badge>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {metodosDisponibles.whatsapp && (
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                <Checkbox
                  id="whatsapp"
                  checked={metodos.whatsapp}
                  onCheckedChange={(checked: boolean) => {
                    setMetodos(prev => ({ ...prev, whatsapp: checked }))
                  }}
                  disabled={loading}
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor="whatsapp"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    Enviado originalmente
                  </Badge>
                </div>
              </div>
            )}

            {/* SMS */}
            {metodosDisponibles.sms && (
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                <Checkbox
                  id="sms"
                  checked={metodos.sms}
                  onCheckedChange={(checked: boolean) => {
                    setMetodos(prev => ({ ...prev, sms: checked }))
                  }}
                  disabled={loading}
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor="sms"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    SMS
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    Enviado originalmente
                  </Badge>
                </div>
              </div>
            )}

            {/* Advertencias */}
            {!alMenosUnoSeleccionado && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Selecciona al menos un método de notificación
                </AlertDescription>
              </Alert>
            )}

            {requierePhone && !phoneValido && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  El número de teléfono es inválido para WhatsApp/SMS
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              loading || 
              !alMenosUnoSeleccionado || 
              !algunMetodoEnviado ||
              (requierePhone && !phoneValido)
            }
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                {phoneModificado ? 'Actualizar y Reenviar' : 'Reenviar'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}