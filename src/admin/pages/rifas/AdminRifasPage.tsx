
import { useEffect, useState } from "react"
import { useRifaStore } from "@/stores/rifaStore"
import { Loader2, Plus } from "lucide-react"
import { useNavigate } from "react-router"
import { CustomGetRifasCard } from "@/components/custom/CustomGetRifasCard"
import { CreateButton } from "@/admin/components/CreateButton"
import { DeleteRifaDialog } from "./components/DeleteRifaDialog"
import { toast } from "sonner"

export const AdminRifasPage = () => {
  const { rifas, loading, error, fetchRifas } = useRifaStore()
  const navigate = useNavigate()
  
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [rifaToDelete, setRifaToDelete] = useState<{ id: string; titulo: string } | null>(null)

  useEffect(() => {
    if (!initialLoadDone) {
      setInitialLoadDone(true)
      fetchRifas()
    }
  }, [initialLoadDone, fetchRifas])

  const handleDeleteClick = (id: string) => {
    const rifa = rifas.find(r => r.id === id)
    if (rifa) {
      setRifaToDelete({ id: rifa.id, titulo: rifa.titulo })
      setShowDeleteDialog(true)
    }
  }

  const handleDeleteSuccess = () => {
    if (rifaToDelete) {
      toast.success("Rifa eliminada", {
        description: `"${rifaToDelete.titulo}" ha sido eliminada correctamente.`
      })
      setRifaToDelete(null)
    }
  }

  const handleEdit = (rifa: any) => {
    navigate(`/admin/admin_rifas/edit/${rifa.id}`)
  }

  const handleView = (rifa: any) => {
    navigate(`/admin/admin_rifas/${rifa.id}`)
  }

  // Estado de carga
  if (loading && !initialLoadDone) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Cargando rifas...</p>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
        <h3 className="font-medium mb-1">Error al cargar las rifas</h3>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  // Estado vacío
  if (rifas.length === 0 && initialLoadDone) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-4xl mb-4">🎲</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No hay rifas creadas
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Comienza creando tu primera rifa para gestionar sorteos y premios.
          </p>
        </div>

        <CreateButton
          icon={Plus}
          title="Nueva Rifa"
          to="/admin/admin_rifas/new"
          variant="floating"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {rifas.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {rifas.filter(r => r.estado === 'activa').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Activas</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {rifas.filter(r => r.estado === 'finalizada').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Finalizadas</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">
            {rifas.filter(r => r.estado === 'creada').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Creadas</div>
        </div>
      </div>

      {/* Grid de rifas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rifas.map((rifa) => (
          <CustomGetRifasCard
            key={rifa.id}
            rifa={rifa}
            onDelete={handleDeleteClick}
            onEdit={handleEdit}
            onView={handleView}
            showActions={true}
            className="h-fit"
          />
        ))}
      </div>

      {/* Información adicional */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t">
        Mostrando {rifas.length} rifa{rifas.length !== 1 ? 's' : ''} en total
      </div>

      {/* Botón flotante */}
      <CreateButton
        icon={Plus}
        title="Nueva Rifa"
        to="/admin/admin_rifas/new"
        variant="floating"
      />

      {rifaToDelete && (
        <DeleteRifaDialog
          rifaId={rifaToDelete.id}
          rifaTitulo={rifaToDelete.titulo}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}