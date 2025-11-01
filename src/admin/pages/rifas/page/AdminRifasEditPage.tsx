
import { useState, useMemo, useEffect } from "react"
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
import { Upload, X, AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { useRifaStore } from "@/stores/rifaStore"
import { useAuthStore } from "@/stores/authStore"
import { useNavigate, useParams } from "react-router"
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

export const AdminRifasEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const { updateRifaWithImages, loading, uploadingImages, error, rifas, fetchRifas } = useRifaStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

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

  // Estado para imágenes
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [showValidationAlert, setShowValidationAlert] = useState(false)
  const [loadingRifa, setLoadingRifa] = useState(true)

  // Cargar datos de la rifa
  useEffect(() => {
    const loadRifa = async () => {
      if (!id) {
        navigate('/admin/admin_rifas')
        return
      }

      // Si no hay rifas cargadas, cargarlas
      if (rifas.length === 0) {
        await fetchRifas()
      }

      const rifa = rifas.find(r => r.id === id)

      if (!rifa) {
        alert('Rifa no encontrada')
        navigate('/admin/admin_rifas')
        return
      }

      // Cargar datos en el formulario
      setFormData({
        titulo: rifa.titulo || "",
        subtitulo: rifa.subtitulo || "",
        descripcion: rifa.descripcion || "",
        estado: rifa.estado || "",
        fecha_fin: rifa.fecha_fin ? new Date(rifa.fecha_fin).toISOString().slice(0, 16) : "",
        numero_inicial: rifa.numero_inicial?.toString() || "0",
        numero_final: rifa.numero_final?.toString() || "9999",
        precio_boleta: rifa.precio_boleta?.toString() || "",
        loteria: rifa.loteria || "",
        digitos: rifa.digitos?.toString() || "5"
      })

      // Cargar imágenes existentes
      if (rifa.imagenes && rifa.imagenes.length > 0) {
        setExistingImages(rifa.imagenes)
      }

      setLoadingRifa(false)
    }

    loadRifa()
  }, [id, rifas, fetchRifas, navigate])

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setShowValidationAlert(false)
  }

  // Función para manejar la selección de nuevos archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalImages = existingImages.length - imagesToDelete.length + newFiles.length + files.length

    // Validar cantidad máxima
    if (totalImages > 5) {
      alert("Máximo 5 imágenes permitidas en total")
      return
    }

    // Validar archivos y crear previews
    const validFiles: File[] = []
    const previews: string[] = []
    let loadedCount = 0

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`)
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} es muy grande. Máximo 5MB`)
        return
      }

      validFiles.push(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        previews.push(e.target?.result as string)
        loadedCount++

        if (loadedCount === validFiles.length) {
          setNewFiles(prev => [...prev, ...validFiles])
          setNewPreviews(prev => [...prev, ...previews])
          setShowValidationAlert(false)
        }
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ''
  }

  // Función para marcar una imagen existente para eliminar
  const markExistingImageForDelete = (imageUrl: string) => {
    if (imagesToDelete.includes(imageUrl)) {
      // Si ya estaba marcada, desmarcarla
      setImagesToDelete(prev => prev.filter(url => url !== imageUrl))
    } else {
      // Marcarla para eliminar
      setImagesToDelete(prev => [...prev, imageUrl])
    }
  }

  // Función para remover una nueva imagen antes de subir
  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index))
    setNewPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Validación de campos requeridos
  const validationResult = useMemo(() => {
    const missingFields: string[] = []
    const totalImages = existingImages.length - imagesToDelete.length + newFiles.length

    if (!formData.titulo.trim()) missingFields.push("Título")
    if (!formData.estado) missingFields.push("Estado")
    if (!formData.loteria.trim()) missingFields.push("Lotería")
    if (!formData.precio_boleta || parseFloat(formData.precio_boleta) <= 0) missingFields.push("Precio por boleta")
    if (!formData.digitos) missingFields.push("Dígitos")
    if (totalImages === 0) missingFields.push("Al menos una imagen")
    
    if (parseInt(formData.numero_inicial) >= parseInt(formData.numero_final)) {
      missingFields.push("Número final debe ser mayor al inicial")
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    }
  }, [formData, existingImages, imagesToDelete, newFiles])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validationResult.isValid) {
      setShowValidationAlert(true)
      return
    }

    if (!user?.id || user.user_type !== 'admin') {
      alert("No tienes permisos para editar rifas")
      return
    }

    if (!id) return

    try {
      // Preparar datos de actualización
      const rifaData = {
        titulo: formData.titulo.trim(),
        subtitulo: formData.subtitulo.trim() || undefined,
        descripcion: formData.descripcion.trim() || undefined,
        estado: formData.estado as 'creada' | 'activa' | 'finalizada' | 'cancelada',
        fecha_fin: formData.fecha_fin ? new Date(formData.fecha_fin).toISOString() : undefined,
        numero_inicial: parseInt(formData.numero_inicial),
        numero_final: parseInt(formData.numero_final),
        precio_boleta: parseFloat(formData.precio_boleta),
        admin_id: user.id,
        loteria: formData.loteria.trim() || undefined,
        digitos: parseInt(formData.digitos) || 5
      }

      // Imágenes a mantener (las que no están marcadas para eliminar)
      const imagesToKeep = existingImages.filter(url => !imagesToDelete.includes(url))

      await updateRifaWithImages(id, rifaData, newFiles, imagesToKeep, imagesToDelete)

      alert("¡Rifa actualizada exitosamente!")
      navigate('/admin/admin_rifas')

    } catch (error) {
      console.error("Error al actualizar rifa:", error)
      alert("Error al actualizar la rifa")
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

  const totalImages = existingImages.length - imagesToDelete.length + newFiles.length
  const isProcessing = loading || uploadingImages

  if (loadingRifa) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
        <p className="text-gray-600">Cargando datos de la rifa...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/admin_rifas')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle>Editar Rifa</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}

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

            {/* Estado, Lotería y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="estado-trigger">Estado *</Label>
                <Select 
                  value={formData.estado} 
                  onValueChange={(value) => handleChange('estado', value)}
                >
                  <SelectTrigger id="estado-trigger" className={!formData.estado && showValidationAlert ? "border-red-500" : ""}>
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

            {/* Configuración de números y precio */}
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
                <Label htmlFor="digitos-trigger">Dígitos *</Label>
                <Select
                  value={formData.digitos}
                  onValueChange={(value) => handleChange("digitos", value)}
                >
                  <SelectTrigger id="digitos-trigger" className={!formData.digitos && showValidationAlert ? "border-red-500" : ""}>
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
                  <div>Imágenes: <span className={`font-bold ${totalImages === 0 ? 'text-red-600' : ''}`}>{totalImages}/5 {totalImages === 0 && '*'}</span></div>
                </div>
              </div>
            )}

            {/* Gestión de imágenes */}
            <div className="space-y-4">
              <Label>Imágenes del Premio * (Máximo 5 imágenes totales)</Label>

              {/* Imágenes existentes */}
              {existingImages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Imágenes actuales:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Imagen ${index + 1}`}
                          className={`w-full h-32 object-cover rounded-lg border ${
                            imagesToDelete.includes(imageUrl) ? 'opacity-50 border-red-500' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => markExistingImageForDelete(imageUrl)}
                          disabled={isProcessing}
                          className={`absolute -top-2 -right-2 rounded-full p-1 ${
                            imagesToDelete.includes(imageUrl)
                              ? 'bg-yellow-500 text-white'
                              : 'bg-red-500 text-white'
                          } opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50`}
                          title={imagesToDelete.includes(imageUrl) ? 'Restaurar' : 'Marcar para eliminar'}
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {imagesToDelete.includes(imageUrl) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                            <span className="text-white text-xs font-semibold">Se eliminará</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nuevas imágenes */}
              {newPreviews.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nuevas imágenes a subir:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {newPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Nueva ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          disabled={isProcessing}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          NUEVA
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input para agregar más imágenes */}
              {totalImages < 5 && (
                <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                  totalImages === 0 && showValidationAlert ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="imageUpload"
                    disabled={totalImages >= 5 || isProcessing}
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <Upload className={`mx-auto h-12 w-12 mb-4 ${totalImages === 0 && showValidationAlert ? 'text-red-400' : 'text-gray-400'}`} />
                    <p className="text-lg font-medium text-gray-700">
                      {totalImages >= 5 ? "Máximo alcanzado" : "Agregar más imágenes"}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG, WEBP (máx. 5MB cada una)</p>
                    <p className={`text-xs mt-1 ${totalImages === 0 && showValidationAlert ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                      {totalImages}/5 imágenes {totalImages === 0 && '(Requerido)'}
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/admin_rifas')}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!validationResult.isValid || isProcessing}
                className={`flex-1 cursor-pointer ${
                  !validationResult.isValid ? 'bg-gray-400 hover:bg-gray-400' : 'bg-blue-400 hover:bg-blue-600'
                }`}
              >
                {uploadingImages ? "Subiendo imágenes..." : loading ? "Actualizando..." : "Actualizar Rifa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}