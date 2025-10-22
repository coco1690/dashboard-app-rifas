// import { useState } from "react";
// import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { useAuthStore } from "@/stores/authStore";
import { LogOut, User, Ticket } from "lucide-react";


export const CustomHeader = () => {
  // const [cartCount] = useState(3);
  const location = useLocation();
  const { user, logout } = useAuthStore(); // Obtener usuario y función logout
  
  // Función para determinar si el enlace está activo
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // Función para manejar logout
  const handleLogout = async () => {
    try {
      await logout();
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error en logout:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-black">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <CustomLogo/>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-amber-500 pb-1 border-b-2 text-white ${
                isActiveLink('/') 
                  ? 'border-amber-400 text-primary' 
                  : 'border-transparent'
              }`}
            >
              inicio
            </Link>
            {/* <Link 
              to="/rifas" 
              className={`text-sm font-medium transition-colors hover:text-teal-500 pb-1 border-b-2 text-white ${
                isActiveLink('/rifas') 
                   ? 'border-amber-400 text-primary' 
                  : 'border-transparent'
              }`}
            >
              Rifas
            </Link> */}
            <Link 
              to="/descargas" 
              className={`text-sm font-medium transition-colors hover:text-amber-500 pb-1 border-b-2 text-white ${
                isActiveLink('/descargas') 
                  ? 'border-amber-400 text-primary' 
                  : 'border-transparent'
              }`}
            >
              descarga de Boletas
            </Link>
          </nav>

          {/* Actions - Mobile & Desktop */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Descarga de Boletas - Solo móvil (ícono) */}
            <Link 
              to="/descargas" 
              title="Descarga de Boletas"
              className="md:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:bg-amber-400 hover:text-black ${
                  isActiveLink('/descargas') ? 'bg-amber-400 text-black' : ''
                }`}
              >
                <Ticket className="h-5 w-5" />
              </Button>
            </Link>

            {/* Botones condicionales según el estado de autenticación */}
            {user ? (
              // Usuario autenticado - Mostrar botones según el tipo
              <>
                {/* Botón Admin - Solo si es admin (TEAL) */}
                {user.user_type === 'admin' && (
                  <Link to="/admin">
                    <Button 
                      className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                    >
                      Admin
                    </Button>
                  </Link>
                )}

                {/* Botón Agencia - Solo si es agencia (AZUL) */}
                {user.user_type === 'agencia' && (
                  <Link to="/agency">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                      Agencia
                    </Button>
                  </Link>
                )}

                {/* Para clientes (user_type === 'cliente') no se muestra botón especial */}

                {/* Botón Logout - Para todos los usuarios autenticados */}
                <Button 
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-700 hover:text-white"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              // Usuario NO autenticado - Mostrar botón de login
              <Link 
                to="/auth/login" 
                title="Iniciar sesión"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-amber-400 hover:text-black"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
