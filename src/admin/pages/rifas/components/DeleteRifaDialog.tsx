// components/DeleteRifaDialog.tsx
import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { useRifaStore } from '@/stores/rifaStore'
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react'

type DeleteRifaDialogProps = {
  rifaId: string
  rifaTitulo: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const DeleteRifaDialog = ({
  rifaId,
  rifaTitulo,
  open,
  onOpenChange,
  onSuccess
}: DeleteRifaDialogProps) => {
  const { deleteRifa } = useRifaStore()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteRifa(rifaId)
      
      onOpenChange(false)
      onSuccess?.()
      
    } catch (error: any) {
      console.error('Error al eliminar:', error)
      // El error ya se maneja en el store y AdminRifasPage con toast
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-left text-lg">
                ¿Eliminar esta rifa?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left mt-1">
                Esta acción no se puede deshacer
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-700">
            Estás a punto de eliminar la rifa:{' '}
            <span className="font-bold text-gray-900">"{rifaTitulo}"</span>
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-800 mb-2">
              ⚠️ Se eliminarán permanentemente:
            </p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>Todos los boletos de esta rifa</li>
              <li>Todas las órdenes de compra</li>
              <li>Todas las transacciones</li>
              <li>Todas las recargas a agencias</li>
              <li>Imágenes asociadas</li>
            </ul>
          </div>

          {deleting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Eliminando datos... Esto puede tomar unos momentos si hay muchos boletos.
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel 
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={deleting}
              className="min-w-[120px]"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sí, eliminar
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}