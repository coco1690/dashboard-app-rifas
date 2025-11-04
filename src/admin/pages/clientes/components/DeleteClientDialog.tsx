import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertCircle, Trash2 } from 'lucide-react'

type DeleteClientDialogProps = {
  open: boolean
  clientName: string
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export const DeleteClientDialog = ({
  open,
  clientName,
  onOpenChange,
  onConfirm
}: DeleteClientDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a {clientName}?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Se eliminarán todos los datos asociados a este cliente.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}