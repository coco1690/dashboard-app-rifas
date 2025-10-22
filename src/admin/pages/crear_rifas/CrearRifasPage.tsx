
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, X, AlertCircle } from "lucide-react"
import { useRifaStore } from "@/stores/rifaStore"
import { useAuthStore } from "@/stores/authStore"
import { useNavigate } from "react-router"
import { Alert, AlertDescription } from "@/components/ui/alert"


interface FormData {
  titulo: string
  subtitulo: string
  descripcion: string
  estado: string
  fecha_fin: string
  numero_inicial: string
  numero_final: string
  precio_boleta: string
  loteria: string
  digitos: string
}

export const CrearRifasPage = () => {
  const { createRifaWithImages, loading, uploadingImages, error } = useRifaStore()
  const { user } = useAuthStore()
  const navigate = useNavigate();



  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    subtitulo: "",
    descripcion: "",
    estado: "",
    fecha_fin: "",
    numero_inicial: "0",
    numero_final: "9999",
    precio_boleta: "",
    loteria: "",
    digitos: "5"
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [showValidationAlert, setShowValidationAlert] = useState(false)

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setShowValidationAlert(false)
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      subtitulo: "",
      descripcion: "",
      estado: "",
      fecha_fin: "",
      numero_inicial: "0",
      numero_final: "9999",
      precio_boleta: "",
      loteria: "",
      digitos: "5"
    })
    setSelectedFiles([])
    setImagePreviews([])
    setShowValidationAlert(false)
  }

  // Función para manejar la selección de archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Validar cantidad máxima
    if (selectedFiles.length + files.length > 5) {
      alert("Máximo 5 imágenes permitidas")
      return
    }

    // Validar archivos y crear previews
    const validFiles: File[] = []
    const newPreviews: string[] = []
    let loadedCount = 0

    files.forEach(file => {
      // Validar tipo y tamaño básico (el store hará validación completa)
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`)
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} es muy grande. Máximo 5MB`)
        return
      }

      validFiles.push(file)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string)
        loadedCount++

        if (loadedCount === validFiles.length) {
          setSelectedFiles(prev => [...prev, ...validFiles])
          setImagePreviews(prev => [...prev, ...newPreviews])
          setShowValidationAlert(false)
        }
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ''
  }

  // Función para remover una imagen
  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Validación de campos requeridos y obtener lista de campos faltantes
  const validationResult = useMemo(() => {
    const missingFields: string[] = []

    if (!formData.titulo.trim()) missingFields.push("Título")
    if (!formData.estado) missingFields.push("Estado")
    if (!formData.loteria.trim()) missingFields.push("Lotería")
    if (!formData.precio_boleta || parseFloat(formData.precio_boleta) <= 0) missingFields.push("Precio por boleta")
    if (!formData.digitos) missingFields.push("Dígitos")
    if (selectedFiles.length === 0) missingFields.push("Al menos una imagen")
    
    // Validación de números
    if (parseInt(formData.numero_inicial) >= parseInt(formData.numero_final)) {
      missingFields.push("Número final debe ser mayor al inicial")
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    }
  }, [formData, selectedFiles])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mostrar alerta si hay campos faltantes
    if (!validationResult.isValid) {
      setShowValidationAlert(true)
      return
    }

    // Verificar autenticación
    if (!user?.id) {
      alert("Debe estar autenticado para crear una rifa")
      return
    }

    if (user.user_type !== 'admin') {
      alert("Solo los administradores pueden crear rifas")
      return
    }

    try {
      // Preparar datos de la rifa (sin imágenes)
      const rifaData = {
        titulo: formData.titulo.trim(),
        subtitulo: formData.subtitulo.trim() || undefined,
        descripcion: formData.descripcion.trim() || undefined,
        estado: formData.estado as 'creada' | 'activa' | 'finalizada' | 'cancelada',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: formData.fecha_fin ? new Date(formData.fecha_fin).toISOString() : undefined,
        numero_inicial: parseInt(formData.numero_inicial),
        numero_final: parseInt(formData.numero_final),
        precio_boleta: parseFloat(formData.precio_boleta),
        admin_id: user.id!,
        loteria: formData.loteria.trim() || undefined,
        digitos: parseInt(formData.digitos) || 5
      }

      // Usar la función del store que maneja todo
      await createRifaWithImages(rifaData, selectedFiles)

      alert("¡Rifa creada exitosamente!")
      resetForm()
      navigate('/admin/admin_rifas')

    } catch (error) {
      console.error("Error al crear rifa:", error)
      // El error ya se maneja en el store, pero podemos mostrar un mensaje aquí también
    }
  }

  // Calcular totales
  const totalBoletas = () => {
    const inicial = parseInt(formData.numero_inicial) || 0
    const final = parseInt(formData.numero_final) || 0
    return Math.max(0, final - inicial + 1)
  }

  const valorTotal = () => {
    const precio = parseFloat(formData.precio_boleta) || 0
    return totalBoletas() * precio
  }

  const isProcessing = loading || uploadingImages

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Rifa</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}

          {/* Alerta de validación */}
          {showValidationAlert && !validationResult.isValid && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Por favor completa los siguientes campos requeridos:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Título y Subtítulo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  placeholder="Ej: iPhone 15 Pro Max"
                  value={formData.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  className={!formData.titulo.trim() && showValidationAlert ? "border-red-500" : ""}
                />
              </div>

              <div>
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  placeholder="Ej: 256GB - Color Negro"
                  value={formData.subtitulo}
                  onChange={(e) => handleChange('subtitulo', e.target.value)}
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción del premio..."
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={3}
              />
            </div>

            {/* Estado y Fecha  */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Estado *</Label>
                <Select 
                  value={formData.estado} 
                  onValueChange={(value) => handleChange('estado', value)}
                >
                  <SelectTrigger className={!formData.estado && showValidationAlert ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creada">Creada</SelectItem>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="finalizada">Finalizada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="loteria">Lotería *</Label>
                <Input
                  id="loteria"
                  type="text"
                  placeholder="Ej: Lotería Nacional"
                  value={formData.loteria}
                  onChange={(e) => handleChange('loteria', e.target.value)}
                  className={!formData.loteria.trim() && showValidationAlert ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor="fecha_fin">Fecha de Sorteo</Label>
                <Input
                  id="fecha_fin"
                  type="datetime-local"
                  value={formData.fecha_fin}
                  onChange={(e) => handleChange('fecha_fin', e.target.value)}
                />
              </div>
            </div>

            {/* Configuración de números y precio  */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="numero_inicial">Número Inicial</Label>
                <Input
                  id="numero_inicial"
                  type="number"
                  min="0"
                  value={formData.numero_inicial}
                  onChange={(e) => handleChange('numero_inicial', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="numero_final">Número Final</Label>
                <Input
                  id="numero_final"
                  type="number"
                  min="0"
                  value={formData.numero_final}
                  onChange={(e) => handleChange('numero_final', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="precio_boleta">Precio por Boleta *</Label>
                <Input
                  id="precio_boleta"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.precio_boleta}
                  onChange={(e) => handleChange('precio_boleta', e.target.value)}
                  className={(!formData.precio_boleta || parseFloat(formData.precio_boleta) <= 0) && showValidationAlert ? "border-red-500" : ""}
                />
              </div>

              <div>
                <Label htmlFor="digitos">Dígitos *</Label>
                <Select
                  value={formData.digitos}
                  onValueChange={(value) => handleChange("digitos", value)}
                >
                  <SelectTrigger className={!formData.digitos && showValidationAlert ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona dígitos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Resumen */}
            {formData.numero_inicial && formData.numero_final && formData.precio_boleta && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Resumen</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>Total de boletas: <span className="font-bold">{totalBoletas().toLocaleString()}</span></div>
                  <div>Valor total: <span className="font-bold text-green-600">${valorTotal().toFixed(2)}</span></div>
                  <div>Imágenes: <span className={`font-bold ${selectedFiles.length === 0 ? 'text-red-600' : ''}`}>{selectedFiles.length}/5 {selectedFiles.length === 0 && '*'}</span></div>
                </div>
              </div>
            )}

            {/* Subida de imágenes */}
            <div className="space-y-4">
              <Label>Imágenes del Premio * (Máximo 5 imágenes)</Label>

              <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                selectedFiles.length === 0 && showValidationAlert ? 'border-red-500' : 'border-gray-300'
              }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="imageUpload"
                  disabled={selectedFiles.length >= 5 || isProcessing}
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <Upload className={`mx-auto h-12 w-12 mb-4 ${selectedFiles.length === 0 && showValidationAlert ? 'text-red-400' : 'text-gray-400'}`} />
                  <p className="text-lg font-medium text-gray-700">
                    {selectedFiles.length >= 5 ? "Máximo alcanzado" : "Seleccionar imágenes"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG, WEBP (máx. 5MB cada una)</p>
                  <p className={`text-xs mt-1 ${selectedFiles.length === 0 && showValidationAlert ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                    {selectedFiles.length}/5 imágenes seleccionadas {selectedFiles.length === 0 && '(Requerido)'}
                  </p>
                </label>
              </div>

              {/* Preview de imágenes */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={isProcessing}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isProcessing}
                className="flex-1 bg-blue-400 hover:bg-blue-600 cursor-pointer"
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                disabled={!validationResult.isValid || isProcessing}
                className={`flex-1 cursor-pointer ${
                  !validationResult.isValid ? 'bg-gray-400 hover:bg-gray-400' : 'bg-blue-400 hover:bg-blue-600'
                }`}
              >
                {uploadingImages ? "Subiendo imágenes..." : loading ? "Creando rifa..." : "Crear Rifa"}
              </Button>
            </div>

            {/* Mensaje informativo cuando el botón está deshabilitado */}
            {!validationResult.isValid && !showValidationAlert && (
              <p className="text-sm text-gray-500 text-center">
                Completa todos los campos requeridos (*) para crear la rifa
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}