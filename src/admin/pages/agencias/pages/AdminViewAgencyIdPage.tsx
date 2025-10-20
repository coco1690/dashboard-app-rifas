import { useEffect, useState } from 'react'
import { useUserListStore } from '@/stores/userListStore'
import { useNavigate, useParams } from 'react-router'


export const AdminViewAgencyIdPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    fetchAgenciaById, 
    selectedAgencia, 
    updateAgencia,
    loading, 
    error 
  } = useUserListStore()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
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

  const handleSubmit = async () => {
    const userData = {
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
      setIsEditing(false)
      fetchAgenciaById(id)
    }
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>
  if (!selectedAgencia) return <p>No se encontró la agencia</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? 'Editar Agencia' : 'Detalle de Agencia'}
        </h2>

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Nombre:</span> {selectedAgencia.user.nombre}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {selectedAgencia.user.email}
            </div>
            <div>
              <span className="font-semibold">Teléfono:</span> {selectedAgencia.user.phone}
            </div>
            <div>
              <span className="font-semibold">Dirección:</span> {selectedAgencia.direccion}
            </div>
            <div>
              <span className="font-semibold">Ciudad:</span> {selectedAgencia.ciudad}
            </div>
            <div>
              <span className="font-semibold">Comisión:</span> {selectedAgencia.comision_porcentaje}%
            </div>
            <div>
              <span className="font-semibold">Verificada:</span> {selectedAgencia.is_verified ? 'Sí' : 'No'}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => navigate('/admin/admin_agencias')}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Volver
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-semibold">Teléfono</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-semibold">Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-semibold">Ciudad</label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-semibold">Comisión (%)</label>
              <input
                type="number"
                value={formData.comision_porcentaje}
                onChange={(e) => setFormData({...formData, comision_porcentaje: Number(e.target.value)})}
                className="w-full p-2 border rounded"
                min="0"
                max="100"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verified"
                checked={formData.is_verified}
                onChange={(e) => setFormData({...formData, is_verified: e.target.checked})}
              />
              <label htmlFor="verified">Agencia verificada</label>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  navigate('/admin/admin_agencias');
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}