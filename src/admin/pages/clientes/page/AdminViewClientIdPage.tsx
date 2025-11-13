import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useUserListStore } from '@/stores/userListStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Key, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ClienteInfoForm } from '../components/ClienteInfoForm'
import { ChangePasswordDialog } from '../components/ChangePasswordDialog'
import { DeleteClientDialog } from '../components/DeleteClientDialog'

export const AdminViewClientIdPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const {
        selectedClientes, // ✅ Array
        loading,
        error,
        fetchClienteById,
        updateCliente,
        deleteCliente,
        updatePassword
    } = useUserListStore()

    // ✅ Obtener el primer cliente del array (esta página muestra UN cliente)
    const cliente = selectedClientes?.[0] || null

    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        phone: '',
        documento_identidad: '',
        direccion: '',
        ciudad: '',
        agencia_id: ''
    })

    // Estados de UI
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)

    // Cargar datos del cliente
    useEffect(() => {
        if (id) {
            fetchClienteById(id)
        }
    }, [id, fetchClienteById])

    // Actualizar formulario cuando se carga el cliente
    useEffect(() => {
        if (cliente) {
            setFormData({
                nombre: cliente.user.nombre || '',
                email: cliente.user.email || '',
                phone: cliente.user.phone || '',
                documento_identidad: cliente.user.documento_identidad || '',
                direccion: cliente.direccion || '',
                ciudad: cliente.ciudad || '',
                agencia_id: cliente.agencia_id || ''
            })
        }
    }, [cliente])

    // Handlers
    const handleBack = () => {
        navigate('/admin/admin_clientes')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSelectChange = (value: string) => {
        setFormData({
            ...formData,
            agencia_id: value === "none" ? "" : value
        })
    }

    const handleSave = async () => {
        if (!cliente) return

        setIsSaving(true)
        try {
            const userData = {
                nombre: formData.nombre,
                email: formData.email,
                phone: formData.phone,
                documento_identidad: formData.documento_identidad || undefined
            }

            const clientData = {
                direccion: formData.direccion,
                ciudad: formData.ciudad,
                agencia_id: formData.agencia_id || null
            }

            const success = await updateCliente(cliente.user_id, userData, clientData)

            if (success) {
                toast.success('Cliente actualizado', {
                    description: 'Los cambios se guardaron correctamente'
                })
                setIsEditing(false)
                fetchClienteById(cliente.user_id)
            } else {
                toast.error('Error al actualizar', {
                    description: error || 'No se pudieron guardar los cambios'
                })
            }
        } catch (err) {
            toast.error('Error inesperado', {
                description: 'Ocurrió un error al actualizar el cliente'
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        if (cliente) {
            setFormData({
                nombre: cliente.user.nombre || '',
                email: cliente.user.email || '',
                phone: cliente.user.phone || '',
                documento_identidad: cliente.user.documento_identidad || '',
                direccion: cliente.direccion || '',
                ciudad: cliente.ciudad || '',
                agencia_id: cliente.agencia_id || ''
            })
        }
    }

    const handleDelete = async () => {
        if (!cliente) return

        try {
            const success = await deleteCliente(cliente.user_id)

            if (success) {
                toast.success('Cliente eliminado', {
                    description: 'El cliente ha sido eliminado correctamente'
                })
                navigate('/admin/admin_clientes')
            } else {
                toast.error('Error al eliminar', {
                    description: error || 'No se pudo eliminar el cliente'
                })
            }
        } catch (err) {
            toast.error('Error inesperado', {
                description: 'Ocurrió un error al eliminar el cliente'
            })
        }
        setShowDeleteDialog(false)
    }

    const handleChangePassword = async (newPassword: string) => {
        if (!cliente) return

        try {
            const success = await updatePassword(cliente.user_id, newPassword)

            if (success) {
                toast.success('Contraseña actualizada', {
                    description: 'La contraseña se cambió correctamente'
                })
                setShowPasswordDialog(false)
            } else {
                toast.error('Error al cambiar contraseña', {
                    description: error || 'No se pudo actualizar la contraseña'
                })
            }
        } catch (err) {
            toast.error('Error inesperado', {
                description: 'Ocurrió un error al cambiar la contraseña'
            })
        }
    }

    const handlePhoneChange = (fullNumber: string) => {
        setFormData({
            ...formData,
            phone: fullNumber
        })
    }

    // Loading state
    if (loading && !cliente) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Error state
    if (error && !cliente) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error || 'No se pudo cargar el cliente'}
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!cliente) {
        return null
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-6">
                {/* Botón Volver minimalista */}
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="gap-2 -ml-2 hover:bg-transparent hover:text-primary group transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Volver a la lista</span>
                </Button>

                {/* Acciones del cliente - alineadas a la derecha */}
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowPasswordDialog(true)}
                        className="gap-2"
                    >
                        <Key className="h-4 w-4" />
                        <span className="hidden sm:inline">Cambiar Contraseña</span>
                        <span className="sm:hidden">Cambiar Contraseña</span>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        className="gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                    </Button>
                </div>
            </div>

            {/* Información del Cliente */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">
                                {cliente.user.nombre}
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Cliente registrado en el sistema
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                            Cliente
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <ClienteInfoForm
                        formData={formData}
                        isEditing={isEditing}
                        isSaving={isSaving}
                        onEdit={() => setIsEditing(true)}
                        onChange={handleChange}
                        onSelectChange={handleSelectChange}
                        onPhoneChange={handlePhoneChange}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                </CardContent>
            </Card>

            {/* Dialogs */}
            <ChangePasswordDialog
                open={showPasswordDialog}
                userName={cliente.user.nombre}
                onOpenChange={setShowPasswordDialog}
                onConfirm={handleChangePassword}
            />

            <DeleteClientDialog
                open={showDeleteDialog}
                clientName={cliente.user.nombre}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDelete}
            />
        </div>
    )
}