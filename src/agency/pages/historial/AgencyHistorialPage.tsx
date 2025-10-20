
import { CustomTitle } from "@/components/custom/CustomTitle"
import { OrdersHistorialVentasClientes } from "./components/OrdersHistorialVentasClientes"
import { useAuthStore } from "@/stores/authStore"


export const AgencyHistorialPage = () => {
  const { user } = useAuthStore()

  if (!user?.id) {
    return <div>Cargando...</div>
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <CustomTitle
          title="Historial de Ventas"
          emoji="🧾"
          subtitle="Aquí puedes ver el estado de las ventas"
        />
      </div>
      
      <OrdersHistorialVentasClientes agenciaId={user.id}/>
    </>
  )
}