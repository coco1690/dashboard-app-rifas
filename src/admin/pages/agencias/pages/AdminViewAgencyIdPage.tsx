// import { useEffect, useState } from 'react'
// import { useUserListStore } from '@/stores/userListStore'
// import { useNavigate, useParams } from 'react-router'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Switch } from '@/components/ui/switch'
// import { ArrowLeft, Edit, Save, X, Key, Eye, EyeOff } from 'lucide-react'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { toast } from 'sonner'

// export const AdminViewAgencyIdPage = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { 
//     fetchAgenciaById, 
//     selectedAgencia, 
//     updateAgencia,
//     updatePassword,
//     loading, 
//     error 
//   } = useUserListStore()

//   const [isEditing, setIsEditing] = useState(false)
//   const [showPasswordDialog, setShowPasswordDialog] = useState(false)
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [passwordError, setPasswordError] = useState('')

//   const [formData, setFormData] = useState({
//     nombre: '',
//     email: '',
//     phone: '',
//     direccion: '',
//     ciudad: '',
//     comision_porcentaje: 0,
//     is_verified: false
//   })

//   useEffect(() => {
//     if (id) {
//       fetchAgenciaById(id!)
//     }
//   }, [id])

//   useEffect(() => {
//     if (selectedAgencia) {
//       setFormData({
//         nombre: selectedAgencia.user.nombre,
//         email: selectedAgencia.user.email,
//         phone: selectedAgencia.user.phone,
//         direccion: selectedAgencia.direccion,
//         ciudad: selectedAgencia.ciudad,
//         comision_porcentaje: selectedAgencia.comision_porcentaje,
//         is_verified: selectedAgencia.is_verified
//       })
//     }
//   }, [selectedAgencia])

//   const handleSubmit = async () => {
//     const userData = {
//       nombre: formData.nombre,
//       email: formData.email,
//       phone: formData.phone
//     }

//     const agencyData = {
//       direccion: formData.direccion,
//       ciudad: formData.ciudad,
//       comision_porcentaje: formData.comision_porcentaje,
//       is_verified: formData.is_verified
//     }

//     const success = await updateAgencia(id!, userData, agencyData)

//     if (success && id) {
//       toast.success('Agencia actualizada', {
//         description: 'Los datos se han guardado correctamente'
//       })
//       setIsEditing(false)
//       fetchAgenciaById(id)
//     } else {
//       toast.error('Error', {
//         description: 'No se pudo actualizar la agencia'
//       })
//     }
//   }

//   const handlePasswordChange = async () => {
//     // Validaciones
//     setPasswordError('')

//     if (!newPassword || !confirmPassword) {
//       setPasswordError('Todos los campos son requeridos')
//       return
//     }

//     if (newPassword.length < 6) {
//       setPasswordError('La contraseña debe tener al menos 6 caracteres')
//       return
//     }

//     if (newPassword !== confirmPassword) {
//       setPasswordError('Las contraseñas no coinciden')
//       return
//     }

//     // Actualizar contraseña
//     const success = await updatePassword(id!, newPassword)

//     if (success) {
//       toast.success('Contraseña actualizada', {
//         description: 'La nueva contraseña se ha guardado correctamente'
//       })
//       setShowPasswordDialog(false)
//       setNewPassword('')
//       setConfirmPassword('')
//       setPasswordError('')
//     } else {
//       toast.error('Error', {
//         description: error || 'No se pudo actualizar la contraseña'
//       })
//     }
//   }

//   const resetPasswordDialog = () => {
//     setNewPassword('')
//     setConfirmPassword('')
//     setPasswordError('')
//     setShowPassword(false)
//     setShowConfirmPassword(false)
//   }

//   if (loading && !selectedAgencia) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-lg">Cargando...</p>
//       </div>
//     )
//   }

//   if (error && !selectedAgencia) {
//     return (
//       <div className="max-w-2xl mx-auto p-4 sm:p-6">
//         <Alert variant="destructive">
//           <AlertDescription>Error: {error}</AlertDescription>
//         </Alert>
//       </div>
//     )
//   }

//   if (!selectedAgencia) {
//     return (
//       <div className="max-w-2xl mx-auto p-4 sm:p-6">
//         <Alert>
//           <AlertDescription>No se encontró la agencia</AlertDescription>
//         </Alert>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Botón volver */}
//         <div className="mb-4">
//           <Button
//             variant="ghost"
//             onClick={() => navigate('/admin/admin_agencias')}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Volver a Agencias
//           </Button>
//         </div>

//         <Card>
//           <CardHeader className="space-y-1 pb-4">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               <CardTitle className="text-xl sm:text-2xl">
//                 {isEditing ? 'Editar Agencia' : 'Detalle de Agencia'}
//               </CardTitle>

//               {!isEditing && (
//                 <div className="flex flex-col sm:flex-row gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowPasswordDialog(true)}
//                     className="w-full sm:w-auto"
//                   >
//                     <Key className="h-4 w-4 mr-2" />
//                     Cambiar Contraseña
//                   </Button>
//                   <Button
//                     onClick={() => setIsEditing(true)}
//                     className="w-full sm:w-auto"
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Editar
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardHeader>

//           <CardContent>
//             {!isEditing ? (
//               // Vista de solo lectura
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium text-gray-500">Nombre</p>
//                     <p className="text-base font-semibold">{selectedAgencia.user.nombre}</p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm font-medium text-gray-500">Email</p>
//                     <p className="text-base break-all">{selectedAgencia.user.email}</p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm font-medium text-gray-500">Teléfono</p>
//                     <p className="text-base">{selectedAgencia.user.phone}</p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm font-medium text-gray-500">Ciudad</p>
//                     <p className="text-base">{selectedAgencia.ciudad}</p>
//                   </div>

//                   <div className="space-y-1 sm:col-span-2">
//                     <p className="text-sm font-medium text-gray-500">Dirección</p>
//                     <p className="text-base">{selectedAgencia.direccion}</p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm font-medium text-gray-500">Comisión</p>
//                     <p className="text-base font-semibold text-green-600">
//                       {selectedAgencia.comision_porcentaje}%
//                     </p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm font-medium text-gray-500">Estado</p>
//                     <div className="flex items-center gap-2">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         selectedAgencia.is_verified 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {selectedAgencia.is_verified ? '✓ Verificada' : 'Pendiente'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               // Modo de edición
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="nombre">Nombre *</Label>
//                     <Input
//                       id="nombre"
//                       type="text"
//                       value={formData.nombre}
//                       onChange={(e) => setFormData({...formData, nombre: e.target.value})}
//                       placeholder="Nombre de la agencia"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email *</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => setFormData({...formData, email: e.target.value})}
//                       placeholder="email@ejemplo.com"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Teléfono *</Label>
//                     <Input
//                       id="phone"
//                       type="tel"
//                       value={formData.phone}
//                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                       placeholder="+57 300 123 4567"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="ciudad">Ciudad *</Label>
//                     <Input
//                       id="ciudad"
//                       type="text"
//                       value={formData.ciudad}
//                       onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
//                       placeholder="Ej: Bogotá"
//                     />
//                   </div>

//                   <div className="space-y-2 sm:col-span-2">
//                     <Label htmlFor="direccion">Dirección *</Label>
//                     <Input
//                       id="direccion"
//                       type="text"
//                       value={formData.direccion}
//                       onChange={(e) => setFormData({...formData, direccion: e.target.value})}
//                       placeholder="Calle 123 #45-67"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="comision">Comisión (%) *</Label>
//                     <Input
//                       id="comision"
//                       type="number"
//                       value={formData.comision_porcentaje}
//                       onChange={(e) => setFormData({...formData, comision_porcentaje: Number(e.target.value)})}
//                       min="0"
//                       max="100"
//                       step="0.1"
//                     />
//                   </div>

//                   <div className="space-y-2 flex items-end">
//                     <div className="flex items-center justify-between w-full p-3 border rounded-lg">
//                       <Label htmlFor="verified" className="cursor-pointer flex-1">
//                         Agencia verificada
//                       </Label>
//                       <Switch
//                         id="verified"
//                         checked={formData.is_verified}
//                         onCheckedChange={(checked) => setFormData({...formData, is_verified: checked})}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Botones de acción en edición */}
//                 <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setIsEditing(false)
//                       // Restaurar datos originales
//                       if (selectedAgencia) {
//                         setFormData({
//                           nombre: selectedAgencia.user.nombre,
//                           email: selectedAgencia.user.email,
//                           phone: selectedAgencia.user.phone,
//                           direccion: selectedAgencia.direccion,
//                           ciudad: selectedAgencia.ciudad,
//                           comision_porcentaje: selectedAgencia.comision_porcentaje,
//                           is_verified: selectedAgencia.is_verified
//                         })
//                       }
//                     }}
//                     className="w-full sm:w-auto"
//                   >
//                     <X className="h-4 w-4 mr-2" />
//                     Cancelar
//                   </Button>
//                   <Button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="w-full sm:w-auto"
//                   >
//                     <Save className="h-4 w-4 mr-2" />
//                     {loading ? 'Guardando...' : 'Guardar Cambios'}
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Dialog para cambiar contraseña */}
//       <Dialog open={showPasswordDialog} onOpenChange={(open) => {
//         setShowPasswordDialog(open)
//         if (!open) resetPasswordDialog()
//       }}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Key className="h-5 w-5" />
//               Cambiar Contraseña
//             </DialogTitle>
//             <DialogDescription>
//               Ingresa la nueva contraseña para <strong>{selectedAgencia.user.nombre}</strong>
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             {/* Nueva contraseña */}
//             <div className="space-y-2">
//               <Label htmlFor="newPassword">Nueva Contraseña</Label>
//               <div className="relative">
//                 <Input
//                   id="newPassword"
//                   type={showPassword ? "text" : "password"}
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   placeholder="Mínimo 6 caracteres"
//                   className="pr-10"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="absolute right-0 top-0 h-full"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>

//             {/* Confirmar contraseña */}
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
//               <div className="relative">
//                 <Input
//                   id="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Repite la contraseña"
//                   className="pr-10"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="absolute right-0 top-0 h-full"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>

//             {/* Error message */}
//             {passwordError && (
//               <Alert variant="destructive">
//                 <AlertDescription>{passwordError}</AlertDescription>
//               </Alert>
//             )}

//             {/* Info */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//               <p className="text-sm text-blue-800">
//                 ℹ️ La contraseña debe tener al menos 6 caracteres
//               </p>
//             </div>
//           </div>

//           <DialogFooter className="flex-col sm:flex-row gap-2">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowPasswordDialog(false)
//                 resetPasswordDialog()
//               }}
//               className="w-full sm:w-auto"
//             >
//               Cancelar
//             </Button>
//             <Button
//               onClick={handlePasswordChange}
//               disabled={loading || !newPassword || !confirmPassword}
//               className="w-full sm:w-auto"
//             >
//               {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { useUserListStore } from '@/stores/userListStore'
import { useNavigate, useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/PhoneInput' // ← NUEVO
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Edit, Save, X, Key, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
// import type { Country } from '@/lib/countries'

export const AdminViewAgencyIdPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    fetchAgenciaById,
    selectedAgencia,
    updateAgencia,
    updatePassword,
    loading,
    error
  } = useUserListStore()

  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const [formData, setFormData] = useState({
    documento_identidad: '',
    nombre: '',
    email: '',
    phone: '',
    direccion: '',
    ciudad: '',
    comision_porcentaje: 0,
    is_verified: false
  })

  useEffect(() => {
    if (id) {
      fetchAgenciaById(id!)
    }
  }, [id])

  useEffect(() => {
    if (selectedAgencia) {
      setFormData({
        documento_identidad: selectedAgencia.user.documento_identidad || '',
        nombre: selectedAgencia.user.nombre,
        email: selectedAgencia.user.email,
        phone: selectedAgencia.user.phone,
        direccion: selectedAgencia.direccion,
        ciudad: selectedAgencia.ciudad,
        comision_porcentaje: selectedAgencia.comision_porcentaje,
        is_verified: selectedAgencia.is_verified
      })
    }
  }, [selectedAgencia])

  // Handler para PhoneInput
  const handlePhoneChange = (
    fullNumber: string,
    // country: Country
  ) => {
    setFormData({
      ...formData,
      phone: fullNumber
    })
  }

  const handleSubmit = async () => {
    if (formData.phone && !formData.phone.startsWith('+')) {
      toast.error('Error', {
        description: 'El teléfono debe estar en formato internacional'
      })
      return
    }

    const userData = {
      documento_identidad: formData.documento_identidad,
      nombre: formData.nombre,
      email: formData.email,
      phone: formData.phone
    }

    const agencyData = {
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      comision_porcentaje: formData.comision_porcentaje,
      is_verified: formData.is_verified
    }

    const success = await updateAgencia(id!, userData, agencyData)

    if (success && id) {
      toast.success('Agencia actualizada', {
        description: 'Los datos se han guardado correctamente'
      })
      setIsEditing(false)
      fetchAgenciaById(id)
    } else {
      toast.error('Error', {
        description: 'No se pudo actualizar la agencia'
      })
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError('')

    if (!newPassword || !confirmPassword) {
      setPasswordError('Todos los campos son requeridos')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    const success = await updatePassword(id!, newPassword)

    if (success) {
      toast.success('Contraseña actualizada', {
        description: 'La nueva contraseña se ha guardado correctamente'
      })
      setShowPasswordDialog(false)
      setNewPassword('')
      setConfirmPassword('')
      setPasswordError('')
    } else {
      toast.error('Error', {
        description: error || 'No se pudo actualizar la contraseña'
      })
    }
  }

  const resetPasswordDialog = () => {
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  if (loading && !selectedAgencia) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando...</p>
      </div>
    )
  }

  if (error && !selectedAgencia) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Alert variant="destructive">
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!selectedAgencia) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Alert>
          <AlertDescription>No se encontró la agencia</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Botón volver */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/admin_agencias')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Agencias
          </Button>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-xl sm:text-2xl">
                {isEditing ? 'Editar Agencia' : 'Detalle de Agencia'}
              </CardTitle>

              {!isEditing && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordDialog(true)}
                    className="w-full sm:w-auto"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Cambiar Contraseña
                  </Button>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {!isEditing ? (
              // Vista de solo lectura
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Nombre</p>
                    <p className="text-base font-semibold">{selectedAgencia.user.nombre}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base break-all">{selectedAgencia.user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Documento / NIT</p>
                    <p className="text-base">{selectedAgencia.user.documento_identidad || 'No registrado'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="text-base">{selectedAgencia.user.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Ciudad</p>
                    <p className="text-base">{selectedAgencia.ciudad}</p>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Dirección</p>
                    <p className="text-base">{selectedAgencia.direccion}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Comisión</p>
                    <p className="text-base font-semibold text-green-600">
                      {selectedAgencia.comision_porcentaje}%
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedAgencia.is_verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {selectedAgencia.is_verified ? '✓ Verificada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Modo de edición
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Nombre de la agencia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@ejemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documento">Documento / NIT *</Label>
                    <Input
                      id="documento"
                      name="documento_identidad"
                      type="text"
                      value={formData.documento_identidad}
                      onChange={(e) => setFormData({ ...formData, documento_identidad: e.target.value })}
                      placeholder="1234567890"
                      className="border-2 border-gray-200 focus:border-amber-500"
                    />
                  </div>

                  {/* ✅ TELÉFONO CON SELECTOR DE PAÍS */}
                  <div className="space-y-2 sm:col-span-2">
                    <PhoneInput
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      label="Teléfono / WhatsApp"
                      placeholder="Ingrese número"
                      required
                      disabled={loading}
                      showWhatsAppBadge
                      defaultCountryCode="ec"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad *</Label>
                    <Input
                      id="ciudad"
                      type="text"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      placeholder="Ej: Bogotá"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      placeholder="Calle 123 #45-67"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comision">Comisión (%) *</Label>
                    <Input
                      id="comision"
                      type="number"
                      value={formData.comision_porcentaje}
                      onChange={(e) => setFormData({ ...formData, comision_porcentaje: Number(e.target.value) })}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center justify-between w-full p-3 border rounded-lg">
                      <Label htmlFor="verified" className="cursor-pointer flex-1">
                        Agencia verificada
                      </Label>
                      <Switch
                        id="verified"
                        checked={formData.is_verified}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de acción en edición */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      // Restaurar datos originales
                      if (selectedAgencia) {
                        setFormData({
                          documento_identidad: selectedAgencia.user.documento_identidad || '',
                          nombre: selectedAgencia.user.nombre,
                          email: selectedAgencia.user.email,
                          phone: selectedAgencia.user.phone,
                          direccion: selectedAgencia.direccion,
                          ciudad: selectedAgencia.ciudad,
                          comision_porcentaje: selectedAgencia.comision_porcentaje,
                          is_verified: selectedAgencia.is_verified
                        })
                      }
                    }}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog para cambiar contraseña */}
      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        setShowPasswordDialog(open)
        if (!open) resetPasswordDialog()
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Cambiar Contraseña
            </DialogTitle>
            <DialogDescription>
              Ingresa la nueva contraseña para <strong>{selectedAgencia.user.nombre}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nueva contraseña */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Error message */}
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                ℹ️ La contraseña debe tener al menos 6 caracteres
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false)
                resetPasswordDialog()
              }}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full sm:w-auto"
            >
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
