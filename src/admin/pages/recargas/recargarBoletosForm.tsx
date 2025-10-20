import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
} from '@/components/ui/alert-dialog'
import { useRifaStore } from '@/stores/rifaStore'
import { useAuthStore } from '@/stores/authStore'
import { useRecargaStore } from '@/stores/useRecargaStore'
import { useUserListStore } from '@/stores/userListStore'
import { Loader2, Send, AlertTriangle, Users, Ticket, CheckCircle } from 'lucide-react'
import { HistorialRecargas } from './components/HistorialRecargas'


interface FormData {
  agenciaId: string
  rifaId: string
  cantidad: string
}

export const RecargarBoletosForm = () => {
  const { recargarBoletos, fetchRecargas, loading, error } = useRecargaStore()
  const { rifas, fetchRifas } = useRifaStore()
  const { user } = useAuthStore()
  const { agencias, fetchAgencias, loading: loadingAgencias } = useUserListStore()
  
  const [formData, setFormData] = useState<FormData>({
    agenciaId: '',
    rifaId: '',
    cantidad: ''
  })

  // Estados para los diálogos
  const [showValidationDialog, setShowValidationDialog] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Usar ref para evitar re-renders infinitos
  const initializedRef = useRef(false)

  // Cargar datos iniciales - SOLO UNA VEZ
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      
      const loadInitialData = async () => {
        try {
          await Promise.all([
            fetchRifas(),
            fetchRecargas(),
            fetchAgencias()
          ])
        } catch (error) {
          console.error('Error loading initial data:', error)
        }
      }
      
      loadInitialData()
    }
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.agenciaId) {
      setValidationMessage('Debe seleccionar una agencia')
      setShowValidationDialog(true)
      return
    }
    
    if (!formData.rifaId) {
      setValidationMessage('Debe seleccionar una rifa')
      setShowValidationDialog(true)
      return
    }
    
    const cantidad = parseInt(formData.cantidad)
    if (!cantidad || cantidad <= 0) {
      setValidationMessage('La cantidad debe ser mayor a 0')
      setShowValidationDialog(true)
      return
    }
    
    if (!user?.id) {
      setValidationMessage('No se encontró información del administrador')
      setShowValidationDialog(true)
      return
    }

    try {
      await recargarBoletos(user.id, formData.agenciaId, cantidad, formData.rifaId)
      
      // Limpiar formulario después del éxito
      setFormData({
        agenciaId: '',
        rifaId: '',
        cantidad: ''
      })
      
      setSuccessMessage(`Se recargaron ${cantidad} boletos exitosamente`)
      setShowSuccessDialog(true)
      
    } catch (error) {
      // El error ya se maneja en el store
      console.error('Error en recarga:', error)
    }
  }

  const rifasActivas = rifas.filter(r => r.estado === 'activa' || r.estado === 'creada')
  const rifaSeleccionada = rifas.find(r => r.id === formData.rifaId)
  const agenciasDisponibles = agencias.filter(agencia => agencia.user.user_type === 'agencia')

  return (
    <div className="space-y-6">
      {/* Formulario de recarga */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Recargar Boletos a Agencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Selección de agencia */}
              <div>
                <Label htmlFor="agencia">Agencia *</Label>
                <Select value={formData.agenciaId} onValueChange={(value) => handleInputChange('agenciaId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingAgencias ? "Cargando..." : "Seleccionar agencia"} />
                  </SelectTrigger>
                  <SelectContent>
                    {agenciasDisponibles.map((agencia) => (
                      <SelectItem key={agencia.user_id} value={agencia.user_id}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {agencia.user.nombre}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selección de rifa */}
              <div>
                <Label htmlFor="rifa">Rifa *</Label>
                <Select value={formData.rifaId} onValueChange={(value) => handleInputChange('rifaId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rifa" />
                  </SelectTrigger>
                  <SelectContent>
                    {rifasActivas.map((rifa) => (
                      <SelectItem key={rifa.id} value={rifa.id}>
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4" />
                          {rifa.titulo}
                          <Badge variant={rifa.estado === 'activa' ? 'default' : 'secondary'} className="ml-2">
                            {rifa.estado}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cantidad de boletos */}
            <div>
              <Label htmlFor="cantidad">Cantidad de Boletos *</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                placeholder="Ej: 100"
                value={formData.cantidad}
                onChange={(e) => handleInputChange('cantidad', e.target.value)}
                required
              />
            </div>

            {/* Información de la rifa seleccionada */}
            {rifaSeleccionada && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Información de la Rifa</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Título:</span>
                    <div className="font-medium">{rifaSeleccionada.titulo}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Precio por boleto:</span>
                    <div className="font-medium">${rifaSeleccionada.precio_boleta}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Rango:</span>
                    <div className="font-medium">{rifaSeleccionada.numero_inicial} - {rifaSeleccionada.numero_final}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Estado:</span>
                    <Badge variant={rifaSeleccionada.estado === 'activa' ? 'default' : 'secondary'}>
                      {rifaSeleccionada.estado}
                    </Badge>
                  </div>
                </div>
                {formData.cantidad && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <span className="text-blue-700">Valor total de la recarga:</span>
                    <div className="text-lg font-bold text-green-600">
                      ${(parseInt(formData.cantidad) * rifaSeleccionada.precio_boleta).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botón de envío */}
            <Button 
              type="submit" 
              disabled={loading || !formData.agenciaId || !formData.rifaId || !formData.cantidad}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando recarga...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Recargar Boletos
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Componente del historial de recargas */}
      <HistorialRecargas />

      {/* Diálogos */}
      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Error de Validación
            </AlertDialogTitle>
            <AlertDialogDescription>
              {validationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationDialog(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recarga Exitosa
            </AlertDialogTitle>
            <AlertDialogDescription>
              {successMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}