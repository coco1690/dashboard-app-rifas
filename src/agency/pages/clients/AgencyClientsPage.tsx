

import { CreateButton } from "@/admin/components/CreateButton"
import { CustomTitle } from "@/components/custom/CustomTitle"
import { UserPlus } from "lucide-react"

export const AgencyClientsPage = () => {
  return (
    <>
    <div className=" flex justify-between items-center">
      <CustomTitle
        title="Clientes"
        emoji="👨‍💻"
        subtitle="Aqui puedes ver, crear y administra los clientes de tu negocio"
      />  
      
      
      <CreateButton
        icon={UserPlus}
        title="Nuevo Cliente"
        to='/agency/clients/new_client'
        variant="floating"
      />
    </div>
    </>
  )
}
