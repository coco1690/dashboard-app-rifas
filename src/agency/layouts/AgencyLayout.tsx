// import { useState } from "react";

// import { Outlet } from "react-router";
// import { AgencySidebar } from "../components/AgencySidebar";



// const AdminLayout = () => {

//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  
  
//   return (

//      <div className="min-h-screen bg-gray-50 flex">
//       <AgencySidebar 
//         isCollapsed={sidebarCollapsed} 
//         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
//       />
      
//       <div className="flex-1 flex flex-col">
//         <AdminHeader />   
//         <main className="flex-1 p-6">
//           <Outlet/>
//         </main>
//       </div>
//     </div>


//   );
// };


// export default AdminLayout



import { AdminHeader } from "@/admin/components/AdminHeader";
import { AdminSidebar, BottomNavigation } from "@/admin/components/AdminSidebar";
import { useState } from "react";
import { Outlet } from "react-router";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Responsivo */}
      <AdminSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      
      {/* Header - Responsivo */}
      <AdminHeader 
        isCollapsed={sidebarCollapsed}
      />
      
      {/* Contenido principal con márgenes responsivos */}
      <main className={`
        transition-all duration-300 ease-in-out p-6
        
        /* Desktop: margen izquierdo según sidebar colapsado/expandido */
        ${sidebarCollapsed ? 'md:ml-19' : 'md:ml-64'} md:mt-18
        
        /* Mobile: sin margen izquierdo, margen superior para header, margen inferior para bottom nav */
        ml-0 mt-16 pb-20 md:pb-6
      `}>
        <Outlet />
      </main>

      {/* Bottom Navigation - Solo visible en móvil */}
      <BottomNavigation />
    </div>
  );
};

export default AdminLayout;