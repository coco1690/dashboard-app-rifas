import CustomTableOrders from '@/components/custom/CustomTableOrders'
import { CustomTitle } from '@/components/custom/CustomTitle'
import { useOrdenesStore } from '@/stores/useOrdenesStore'
import { useEffect, useState } from 'react'

export const AdminOrdenesPage = () => {
  const { inicializarContexto } = useOrdenesStore()
  
  // ✅ AGREGADO: Control de inicialización para evitar múltiples llamadas
  const [initialized, setInitialized] = useState(false)
  
  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      inicializarContexto('admin') // Sin agenciaId
    }
  }, [initialized]) // Sin inicializarContexto en dependencias

  return (
    <>
      <div className="flex justify-between items-center">
        <CustomTitle
          title="Ordenes"
          emoji="🧾"
          subtitle="Aquí puedes ver el estado de las compras"
        />
      </div>
    
      <CustomTableOrders/>
    </>
  )
}