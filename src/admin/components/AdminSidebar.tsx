import { Link, useLocation } from 'react-router';
import {
  Home,
  Users,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Repeat,
  X,
  UserCircle,
  TrendingUp,
  DollarSign,
  Building2,
  History
} from 'lucide-react';
import { CustomLogo } from '@/components/custom/CustomLogo';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState, useMemo } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Definir los menús por rol
const getMenuItemsByRole = (userRole: string) => {
  switch (userRole) {
    case 'admin':
      return [
        { icon: Home, label: 'Dashboard', to: '/admin' },
        { icon: Building2, label: 'Agencias', to: '/admin/admin_agencias' },
        { icon: Users, label: 'Clientes', to: '/admin/admin_clientes' },
        { icon: Ticket, label: 'Rifas', to: '/admin/admin_rifas' },
        { icon: ShoppingCart, label: 'Ordenes', to: '/admin/ordenes' },
        { icon: Repeat, label: 'Recargas', to: '/admin/recargas' },
        { icon: TrendingUp, label: 'Estadísticas', to: '/admin/estadisticas_agencias' },
        { icon: History, label: 'Historial', to: '/admin/admin_historial' },
      ];

    case 'agencia':
      return [
        { icon: Home, label: 'Dashboard', to: '/agency' },
        { icon: UserCircle, label: 'Clientes', to: '/agency/clients' },
        // { icon: Ticket, label: 'Rifas Activas', to: '/agency/rifas_activas' },
        { icon: DollarSign, label: 'Ventas', to: '/agency/ventas' },
        { icon: History, label: 'Historial', to: '/agency/historial' },
        { icon: ShoppingCart, label: 'Ordenes', to: '/agency/ordenes' },
      ];

    default:
      return [
        { icon: Home, label: 'Dashboard', to: '/' },
      ];
  }
};

export const AdminSidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobileOpen = false,
  onMobileClose
}) => {
  const { user } = useAuthStore();
  const { pathname } = useLocation();

  // ✅ OPTIMIZACIÓN: Memoizar user para evitar re-renders innecesarios
  const [userMemo, setUserMemo] = useState(user);

  useEffect(() => {
    if (user?.email !== userMemo?.email) {
      console.log('🔍 AdminSidebar useEffect - user cambió:', user?.email)
      setUserMemo(user)
    }
  }, [user?.email, userMemo?.email]) // Solo email en dependencias

  // ✅ OPTIMIZACIÓN: Memoizar valores derivados
  const userRole = useMemo(() => {
    return userMemo?.user_type || 'guest';
  }, [userMemo?.user_type]);

  const menuItems = useMemo(() => {
    return getMenuItemsByRole(userRole);
  }, [userRole]);

  const userInitials = useMemo(() => {
    if (!userMemo?.nombre) return '';

    const names = userMemo.nombre.trim().split(' ');
    const firstNameInitial = names[0]?.charAt(0)?.toUpperCase() || '';
    const lastNameInitial = names[names.length - 1]?.charAt(0)?.toUpperCase() || '';

    return firstNameInitial + lastNameInitial;
  }, [userMemo?.nombre]);

  const isActiveRoute = (to: string) => {
    // Rutas exactas
    if (pathname === to) return true;

    // Rutas que incluyen subrutas
    const routesWithSubroutes = [
      '/admin/admin_rifas',
      '/admin/admin_agencias',
      '/admin/admin_clientes',
      '/agency/clients',
      '/agency/rifas',
      '/agency/ventas'
    ];

    return routesWithSubroutes.some(route =>
      pathname.includes(route) && to === route
    );
  };

  // Cerrar sidebar en móvil cuando se hace clic en un enlace
  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Prevenir scroll del body cuando el sidebar móvil está abierto
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  // ✅ OPTIMIZACIÓN: Memoizar funciones de utilidad
  const getRoleColor = useMemo(() => {
    switch (userRole) {
      case 'admin':
        return 'from-teal-500 to-blue-600';
      case 'agencia':
        return 'from-teal-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  }, [userRole]);

  const getRoleLabel = useMemo(() => {
    switch (userRole) {
      case 'admin':
        return 'Administrador';
      case 'agencia':
        return 'Agencia';
      default:
        return 'Usuario';
    }
  }, [userRole]);

  return (
    <>
      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out flex flex-col z-50
        
        /* Estilos para Desktop */
        md:fixed md:left-0 md:top-0 md:h-screen
        ${isCollapsed ? 'md:w-19' : 'md:w-64'}
        
        /* Estilos para Móvil */
        fixed left-0 top-0 h-screen w-64 transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>

        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between h-18">
          {/* Logo - Solo mostrar si no está colapsado en desktop o en móvil */}
          {(!isCollapsed || window.innerWidth < 768) && <CustomLogo />}

          {/* Botones de control */}
          <div className="flex items-center space-x-2">
            {/* Botón cerrar en móvil */}
            {onMobileClose && (
              <button
                onClick={onMobileClose}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white md:hidden"
              >
                <X size={20} />
              </button>
            )}

            {/* Botón colapsar en desktop */}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white hidden md:block"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Badge de rol - Solo mostrar si no está colapsado */}
        {(!isCollapsed || window.innerWidth < 768) && (
          <div className="px-4 py-2">
            <div className={`
              bg-gradient-to-r ${getRoleColor} 
              text-white text-xs font-semibold px-3 py-1 rounded-full text-center
            `}>
              {getRoleLabel}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.to || '/');

              return (
                <li key={index}>
                  <Link
                    to={item.to || '/'}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group relative
                      ${isActive
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {/* Mostrar label si no está colapsado en desktop o siempre en móvil */}
                    {(!isCollapsed || window.innerWidth < 768) && (
                      <span className="font-medium">{item.label}</span>
                    )}

                    {/* Tooltip para desktop colapsado */}
                    {isCollapsed && window.innerWidth >= 768 && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        {(!isCollapsed || window.innerWidth < 768) && userMemo && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userMemo.nombre}</p>
                <p className="text-xs text-gray-400 truncate">{userMemo.email}</p>
                <p className="text-xs text-teal-400 truncate">{getRoleLabel}</p>
              </div>
            </div>
          </div>
        )}

        {/* Avatar solo para desktop colapsado */}
        {isCollapsed && window.innerWidth >= 768 && userMemo && (
          <div className="p-4 border-t border-gray-700 flex justify-center">
            <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor} rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform relative group`}>
              {userInitials}

              {/* Tooltip con info del usuario */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {userMemo.nombre} - {getRoleLabel}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Bottom Navigation Component para móvil - También optimizado
export const BottomNavigation: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  // ✅ OPTIMIZACIÓN: Memoizar valores derivados
  const userRole = useMemo(() => {
    return user?.user_type || 'guest';
  }, [user?.user_type]);

  const menuItems = useMemo(() => {
    return getMenuItemsByRole(userRole).slice(0, 8); // Limitar a 7 items para móvil
  }, [userRole]);

  const isActiveRoute = (to: string) => {
    if (pathname === to) return true;

    const routesWithSubroutes = [
      '/admin/admin_rifas',
      '/admin/admin_agencias',
      '/admin/admin_clientes',
      '/agency/clients',
      '/agency/rifas',
      '/agency/ventas'
    ];

    return routesWithSubroutes.some(route =>
      pathname.includes(route) && to === route
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
      {/* Contenedor con scroll horizontal */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex px-2 py-2 min-w-max">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.to || '/');

            return (
              <Link
                key={index}
                to={item.to || '/'}
                className={`
                  flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                  ${isActive
                    ? 'text-white bg-black shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};