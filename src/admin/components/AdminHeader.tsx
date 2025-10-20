
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface AdminHeaderProps {
  isCollapsed: boolean;
  onMobileMenuToggle?: () => void; // Opcional ya que no se usa
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  isCollapsed, 
}) => {
  const { user, logout } = useAuthStore();

  const getInitials = (fullName: string) => {
    if (!fullName) return '';
    
    const names = fullName.trim().split(' ');
    const firstNameInitial = names[0]?.charAt(0)?.toUpperCase() || '';
    const lastNameInitial = names[names.length - 1]?.charAt(0)?.toUpperCase() || '';
    
    return firstNameInitial + lastNameInitial;
  };

  return (
    <header className={`
      bg-white border-b border-gray-200 transition-all duration-300 ease-in-out
      fixed top-0 z-40 h-16 md:h-18
      
      /* Desktop: ajustar desde el borde del sidebar */
      ${isCollapsed ? 'md:left-19' : 'md:left-64'} md:right-0
      
      /* Mobile: ancho completo */
      left-0 right-0 md:ml-0
    `}>
      <div className="h-full px-4 flex items-center justify-between">
        
        {/* Lado izquierdo */}
        <div className="flex items-center space-x-4">
          {/* Barra de búsqueda */}
          <div className="relative hidden sm:block">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={16} 
            />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64 lg:w-80"
            />
          </div>

          {/* Botón búsqueda móvil */}
          <button className="p-2 hover:bg-gray-100 rounded-lg sm:hidden">
            <Search size={20} />
          </button>
        </div>

        {/* Lado derecho */}
        <div className="flex items-center space-x-2 md:space-x-4">
          
          {/* Notificaciones */}
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Configuraciones - Oculto en móvil pequeño */}
          <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block">
            <Settings size={20} />
          </button>

          {/* Perfil de usuario - Visible solo en desktop */}
          <div className="hidden md:flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(user?.nombre || '')}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                {user?.nombre}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-32">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Avatar solo móvil */}
          <button className="p-1 hover:bg-gray-100 rounded-lg md:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(user?.nombre || '')}
            </div>
          </button>

          {/* Logout - Visible en desktop y móvil */}
          <button 
            onClick={() => logout()}
            className="p-2  hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>

          {/* Menú desplegable móvil - Placeholder */}
          <div className="relative md:hidden">
            {/* Aquí podrías añadir un dropdown menu para móvil con opciones adicionales */}
          </div>
        </div>
      </div>
    </header>
  );
};