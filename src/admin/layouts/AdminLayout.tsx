import { useState } from "react";
import { AdminSidebar, BottomNavigation } from "../components/AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";
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