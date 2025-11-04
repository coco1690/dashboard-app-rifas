import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Phone, CreditCard, MapPin, Building2, Save } from 'lucide-react'

type ClienteFormData = {
    nombre: string
    email: string
    phone: string
    documento_identidad: string
    direccion: string
    ciudad: string
    agencia_id: string
}

type ClienteInfoFormProps = {
    formData: ClienteFormData
    isEditing: boolean
    isSaving: boolean
    onEdit: () => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSelectChange: (value: string) => void
    onSave: () => void
    onCancel: () => void
}

export const ClienteInfoForm = ({
    formData,
    isEditing,
    isSaving,
    onEdit,
    onChange,
    onSelectChange,
    onSave,
    onCancel
}: ClienteInfoFormProps) => {
    return (
        <div className="space-y-6">
            {/* Botón de edición */}
            {!isEditing && (
                <Button onClick={onEdit} className="w-full sm:w-auto">
                    Editar Información
                </Button>
            )}

            <Separator />

            {/* Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                    <Label htmlFor="cliente-nombre">
                        <User className="h-4 w-4 inline mr-2" />
                        Nombre Completo
                    </Label>
                    <Input
                        id="cliente-nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={onChange}
                        disabled={!isEditing}
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="cliente-email">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Correo Electrónico
                    </Label>
                    <Input
                        id="cliente-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={onChange}
                        disabled={!isEditing}
                    />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                    <Label htmlFor="cliente-phone">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Teléfono
                    </Label>
                    <Input
                        id="cliente-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        disabled={!isEditing}
                    />
                </div>

                {/* Documento */}
                <div className="space-y-2">
                    <Label htmlFor="cliente-documento">
                        <CreditCard className="h-4 w-4 inline mr-2" />
                        Documento
                    </Label>
                    <Input
                        id="cliente-documento"
                        name="documento_identidad"
                        value={formData.documento_identidad}
                        onChange={onChange}
                        disabled={!isEditing}
                        placeholder="No disponible"
                    />
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                    <Label htmlFor="cliente-direccion">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Dirección
                    </Label>
                    <Input
                        id="cliente-direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={onChange}
                        disabled={!isEditing}
                        placeholder="Sin dirección"
                    />
                </div>

                {/* Ciudad */}
                <div className="space-y-2">
                    <Label htmlFor="cliente-ciudad">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Ciudad
                    </Label>
                    <Input
                        id="cliente-ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={onChange}
                        disabled={!isEditing}
                        placeholder="Sin ciudad"
                    />
                </div>

                {/* Agencia */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cliente-agencia">
                        <Building2 className="h-4 w-4 inline mr-2" />
                        Agencia Asignada
                    </Label>
                    {isEditing ? (
                        <Select
                            value={formData.agencia_id || "none"}
                            onValueChange={onSelectChange}
                        >
                            <SelectTrigger id="cliente-agencia">  {/* ← Ya tiene el id correcto */}
                                <SelectValue placeholder="Sin agencia asignada" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sin agencia</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            id="cliente-agencia" 
                            value={formData.agencia_id ? 'Agencia asignada' : 'Sin agencia'}
                            disabled
                        />
                    )}
                </div>
            </div>

            {/* Botones de acción */}
            {isEditing && (
                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex-1"
                    >
                        {isSaving ? (
                            <>
                                <Save className="h-4 w-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}