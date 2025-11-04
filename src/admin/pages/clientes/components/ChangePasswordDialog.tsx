import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Eye, EyeOff, Key } from 'lucide-react'

type ChangePasswordDialogProps = {
  open: boolean
  userName: string
  onOpenChange: (open: boolean) => void
  onConfirm: (newPassword: string) => Promise<void>
}

export const ChangePasswordDialog = ({
  open,
  userName,
  onOpenChange,
  onConfirm
}: ChangePasswordDialogProps) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleConfirm = async () => {
    await onConfirm(newPassword)
    // Limpiar campos
    setNewPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setNewPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Ingresa una nueva contraseña para {userName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {newPassword && confirmPassword && !passwordsMatch && (
            <Alert variant="destructive">
              <AlertDescription>Las contraseñas no coinciden</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!passwordsMatch}
          >
            <Key className="h-4 w-4 mr-2" />
            Cambiar Contraseña
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}