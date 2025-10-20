import { CreateButton } from "@/admin/components/CreateButton"
import { CustomGetUsers } from "@/components/custom/CustomGetUsers"
import { CustomTitle } from "@/components/custom/CustomTitle"
import { useUserListStore } from "@/stores/userListStore"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useEffect, useCallback, useState } from "react"
import { useNavigate } from "react-router"
import { CustomLoading } from "@/components/custom/CustomLoading"

export const AdminAgenciasPage = () => {
  const { 
    error, 
    agencias, 
    loading, 
    agenciasLoaded, 
    fetchAgencias,
    deleteAgencia,
    toggleAgenciaVerificacion
  } = useUserListStore()

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    userId: string
    userName: string
  }>({
    isOpen: false,
    userId: '',
    userName: ''
  })

  const usuarioAgencia = agencias.map((agencia) => ({
    id: agencia.user_id,
    nombre: agencia.user.nombre,  
    email: agencia.user.email,
    phone: agencia.user.phone,
    user_type: agencia.user.user_type,
    ciudad: agencia.ciudad,
    direccion: agencia.direccion,
    comision: agencia.comision_porcentaje,
    verificado: agencia.is_verified,
  }))

  const navigate = useNavigate()

  // Función para editar agencia
  const handleEdit = useCallback((userId: string) => {
    navigate(`/admin/admin_agencias/${userId}`)
  }, [navigate]);

  // Función para abrir dialog de eliminación
  const handleDelete = useCallback((userId: string) => {
    const agencia = agencias.find(a => a.user_id === userId)
    setDeleteDialog({
      isOpen: true,
      userId,
      userName: agencia?.user.nombre || 'Usuario desconocido'
    })
  }, [agencias]);

  // Función para confirmar eliminación
  const handleConfirmDelete = useCallback(async () => {
    const loadingToastId = toast.loading("Eliminando agencia...", {
      description: "Por favor espera mientras se procesa la eliminación."
    })

    try {
      const success = await deleteAgencia(deleteDialog.userId)
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId)
      
      if (success) {
        toast.success("Agencia eliminada", {
          description: `La agencia de ${deleteDialog.userName} ha sido eliminada exitosamente.`,
          icon: <CheckCircle className="w-4 h-4" />,
        })
      } else {
        toast.error("Error al eliminar", {
          description: "No se pudo eliminar la agencia. Inténtalo de nuevo.",
          icon: <XCircle className="w-4 h-4" />,
        })
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId)
      
      console.error('Error eliminando agencia:', error)
      toast.error("Error inesperado", {
        description: "Ocurrió un error inesperado al eliminar la agencia.",
        icon: <XCircle className="w-4 h-4" />,
      })
    } finally {
      setDeleteDialog({ isOpen: false, userId: '', userName: '' })
    }
  }, [deleteAgencia, deleteDialog.userId, deleteDialog.userName]);

  // Función para click en tarjeta
  const handleCardClick = useCallback((userId: string) => {
    navigate(`/admin/admin_agencias/${userId}`);
  }, [navigate]);

  // Función para toggle de verificación
  const handleVerificadoToggle = useCallback(async (userId: string, isVerified: boolean) => {
    const loadingToastId = toast.loading(
      isVerified ? "Verificando agencia..." : "Removiendo verificación...",
      {
        description: "Actualizando estado de verificación."
      }
    )

    try {
      const success = await toggleAgenciaVerificacion(userId, isVerified)
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId)
      
      if (success) {
        if (isVerified) {
          toast.success("Agencia verificada", {
            description: "La agencia ha sido verificada exitosamente.",
            icon: <CheckCircle className="w-4 h-4" />,
          })
        } else {
          toast.info("Verificación removida", {
            description: "Se ha removido la verificación de la agencia.",
          })
        }
      } else {
        toast.error("Error", {
          description: "No se pudo actualizar el estado de verificación.",
          icon: <XCircle className="w-4 h-4" />,
        })
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId)
      
      console.error('Error actualizando verificación:', error)
      toast.error("Error inesperado", {
        description: "Ocurrió un error al actualizar la verificación.",
        icon: <XCircle className="w-4 h-4" />,
      })
    }
  }, [toggleAgenciaVerificacion]);

  const handleRetry = useCallback(() => {
    useUserListStore.getState().reset()
    fetchAgencias()
    toast.info("Reintentando", {
      description: "Cargando agencias de nuevo..."
    })
  }, [fetchAgencias])

  useEffect(() => {
    if (!agenciasLoaded && !loading) {
      fetchAgencias()
    }
  }, [])

  return (
    <>
      <div className="sticky top-0 bg-white z-30 border-b border-gray-100 pb-3 mb-4 px-1 sm:px-0">
        <CustomTitle
          title="Agencias"
          emoji="👨‍💻"
          subtitle="Aqui puedes ver, crear y administra las agencias de tu negocio"
        />
      </div>
      
      <div className="px-1 sm:px-0 pb-20">
        {loading && (
          <CustomLoading
            variant="cards" 
            count={6} 
            message="Cargando agencias..." 
          />
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 text-center font-medium mb-4">{error}</p>
            <Button onClick={handleRetry} variant="outline">
              Reintentar
            </Button>
          </div>
        )}
        
        {!loading && !error && agenciasLoaded && (
          <CustomGetUsers
            usuarios={usuarioAgencia}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onVerificadoToggle={handleVerificadoToggle}
            onCardClick={handleCardClick} 
          />
        )}
      </div>

      <CreateButton
        icon={Plus}
        title="Nueva Agencia"
        to="/admin/admin_agencias/new_agencia"
        variant="floating"
      />

      {/* AlertDialog para confirmación de eliminación */}
      <AlertDialog 
        open={deleteDialog.isOpen} 
        onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, userId: '', userName: '' })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Eliminar Agencia
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-2">
                  ¿Estás seguro de que quieres eliminar la agencia de{" "}
                  <span className="font-semibold">{deleteDialog.userName}</span>?
                </p>
                <p className="mb-2">
                  Esta acción no se puede deshacer y eliminará permanentemente:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Todos los datos de la agencia</li>
                  <li>La cuenta de usuario asociada</li>
                  <li>Cualquier relación con clientes</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar Agencia
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}