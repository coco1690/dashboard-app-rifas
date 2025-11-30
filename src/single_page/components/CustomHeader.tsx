// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Link, useLocation } from "react-router";
// import { CustomLogo } from "@/components/custom/CustomLogo";
// import { useAuthStore } from "@/stores/authStore";
// import { LogOut, Ticket, Menu, ShoppingCart, User, UserPlus } from "lucide-react";
// import {
//   Sheet,
//   SheetContent,
//   SheetTitle,
//   SheetDescription,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// export const CustomHeader = () => {
//   const location = useLocation();
//   const { user, logout } = useAuthStore();
//   const [isOpen, setIsOpen] = useState(false);
//   const [cartCount] = useState(0); // Puedes conectar esto con tu store de carrito

//   // Función para determinar si el enlace está activo
//   const isActiveLink = (path: string) => {
//     return location.pathname === path;
//   };

//   // Función para manejar logout
//   const handleLogout = async () => {
//     try {
//       await logout();
//       setIsOpen(false);
//       console.log("✅ Logout exitoso");
//     } catch (error) {
//       console.error("❌ Error en logout:", error);
//     }
//   };

//   // Función para cerrar el menú al navegar
//   const handleLinkClick = () => {
//     setIsOpen(false);
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full backdrop-blur bg-gray-900">
//       <div className="container mx-auto px-4 lg:px-8">
//         <div className="flex h-16 md:h-20 items-center justify-between">
//           {/* IZQUIERDA: Logo (Desktop) y Menú Hamburguesa (Mobile) */}
//           <div className="flex items-center">
//             {/* Menú Hamburguesa - Solo Mobile */}
//             <Sheet open={isOpen} onOpenChange={setIsOpen}>
//               <SheetTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-white hover:bg-amber-400 hover:text-black md:hidden"
//                 >
//                   <Menu className="h-6 w-6" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent
//                 side="left"
//                 className="w-[300px] sm:w-[350px] bg-gradient-to-b from-gray-900 to-black text-white border-r border-gray-800 p-0"
//               >
//                 {/* Header del menú */}
//                 <div className="px-6 py-5 border-b border-gray-800/50">
//                   <SheetTitle className="text-white text-xl font-bold">
//                     Menú
//                   </SheetTitle>
//                   <SheetDescription className="text-gray-400 text-sm mt-1">
//                     Navega por las secciones
//                   </SheetDescription>
//                 </div>

//                 {/* Navegación móvil */}
//                 <nav className="flex flex-col p-4 space-y-2">
//                   {/* Enlaces de navegación */}
//                   <Link
//                     to="/"
//                     onClick={handleLinkClick}
//                     className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
//                       isActiveLink("/")
//                         ? "bg-amber-400 text-black font-semibold shadow-lg shadow-amber-400/30"
//                         : "text-white hover:bg-gray-800/50 hover:translate-x-1"
//                     }`}
//                   >
//                     <span className="text-xl">🏠</span>
//                     <span className="text-base">Inicio</span>
//                   </Link>

//                   <Link
//                     to="/descargas"
//                     onClick={handleLinkClick}
//                     className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
//                       isActiveLink("/descargas")
//                         ? "bg-amber-400 text-black font-semibold shadow-lg shadow-amber-400/30"
//                         : "text-white hover:bg-gray-800/50 hover:translate-x-1"
//                     }`}
//                   >
//                     <Ticket className="h-5 w-5" />
//                     <span className="text-base">Descarga de Boletas</span>
//                   </Link>

//                   {/* Separador con gradiente */}
//                   <div className="relative py-4">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-700/50"></div>
//                     </div>
//                   </div>

//                   {/* Sección de usuario */}
//                   {user ? (
//                     <div className="space-y-2">
//                       {/* Información del usuario con gradiente */}
//                       <div className="px-4 py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700/50">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold text-lg">
//                             {(user.nombre?.[0] || user.email?.[0] || 'U').toUpperCase()}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="font-semibold text-white truncate text-sm">
//                               {user.nombre || user.email}
//                             </p>
//                             <p className="text-xs text-gray-400 capitalize">
//                               {user.user_type}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Botón Admin */}
//                       {user.user_type === "admin" && (
//                         <Link to="/admin" onClick={handleLinkClick}>
//                           <Button className="w-full bg-gradient-to-r mb-5 from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white cursor-pointer justify-start rounded-xl py-6 shadow-lg hover:shadow-teal-600/30 transition-all duration-200">
//                             <span className="text-lg mr-3">⚙️</span>
//                             <span className="text-base font-medium">Panel Admin</span>
//                           </Button>
//                         </Link>
//                       )}

//                       {/* Botón Agencia */}
//                       {user.user_type === "agencia" && (
//                         <Link to="/agency" onClick={handleLinkClick}>
//                           <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer justify-start rounded-xl py-6 shadow-lg hover:shadow-blue-600/30 transition-all duration-200">
//                             <span className="text-lg mr-3">🏢</span>
//                             <span className="text-base font-medium">Panel Agencia</span>
//                           </Button>
//                         </Link>
//                       )}

//                       {/* Botón Logout */}
//                       <Button
//                         onClick={handleLogout}
//                         className="w-full bg-red-600/90 hover:bg-red-700 text-white cursor-pointer justify-start rounded-xl py-6 shadow-lg hover:shadow-red-600/30 transition-all duration-200"
//                       >
//                         <LogOut className="h-5 w-5 mr-3" />
//                         <span className="text-base font-medium">Cerrar Sesión</span>
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="space-y-2">
//                       {/* Botones para usuarios no autenticados */}
//                       <Link to="/auth/login" onClick={handleLinkClick}>
//                         <Button className="w-full bg-black hover:bg-gray-100 mb-5 text-white cursor-pointer justify-start rounded-xl py-6 border-2 border-amber-400/50 shadow-lg hover:shadow-amber-400/20 transition-all duration-200">
//                           <User className="h-5 w-5 mr-3" />
//                           <span className="text-base font-medium">Iniciar Sesión</span>
//                         </Button>
//                       </Link>

//                       <Link to="/auth/register" onClick={handleLinkClick}>
//                         <Button className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-semibold cursor-pointer justify-start rounded-xl py-6 shadow-lg hover:shadow-amber-400/40 transition-all duration-200">
//                           <UserPlus className="h-5 w-5 mr-3" />
//                           <span className="text-base font-medium">Registrarse</span>
//                         </Button>
//                       </Link>
//                     </div>
//                   )}
//                 </nav>
//               </SheetContent>
//             </Sheet>

//             {/* Logo - Desktop (Izquierda) */}
//             <div className="hidden md:block">
//               <CustomLogo />
//             </div>
//           </div>

//           {/* CENTRO: Navigation Links - Desktop & Logo Mobile */}
//           <div className="flex items-center">
//             {/* Logo - Mobile (Centro) */}
//             <div className="md:hidden scale-75">
//               <CustomLogo />
//             </div>

//             {/* Navigation - Desktop (Centro) */}
//             <nav className="hidden md:flex items-center space-x-8">
//               <Link
//                 to="/"
//                 className={`text-sm font-medium transition-colors hover:text-amber-500 pb-1 border-b-2 text-white ${
//                   isActiveLink("/")
//                     ? "border-amber-400 text-amber-400"
//                     : "border-transparent"
//                 }`}
//               >
//                 Inicio
//               </Link>
//               <Link
//                 to="/descargas"
//                 className={`text-sm font-medium transition-colors hover:text-amber-500 pb-1 border-b-2 text-white ${
//                   isActiveLink("/descargas")
//                     ? "border-amber-400 text-amber-400"
//                     : "border-transparent"
//                 }`}
//               >
//                 Descarga de Boletas
//               </Link>
//             </nav>
//           </div>

//           {/* DERECHA: Carrito y botones de usuario */}
//           <div className="flex items-center space-x-2 md:space-x-4">
//             {/* Carrito de compras */}
//             <Link to="/carrito" title="Carrito de compras">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="text-white hover:bg-amber-400 hover:text-black relative"
//               >
//                 <ShoppingCart className="h-5 w-5" />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                     {cartCount}
//                   </span>
//                 )}
//               </Button>
//             </Link>

//             {/* Botones de usuario - Desktop */}
//             <div className="hidden md:flex items-center space-x-2">
//               {user ? (
//                 <>
//                   {/* Botón Admin */}
//                   {user.user_type === "admin" && (
//                     <Link to="/admin">
//                       <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer text-sm px-4 py-2">
//                         Admin
//                       </Button>
//                     </Link>
//                   )}

//                   {/* Botón Agencia */}
//                   {user.user_type === "agencia" && (
//                     <Link to="/agency">
//                       <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-sm px-4 py-2">
//                         Agencia
//                       </Button>
//                     </Link>
//                   )}

//                   {/* Botón Logout */}
//                   <Button
//                     onClick={handleLogout}
//                     variant="ghost"
//                     size="icon"
//                     className="text-white hover:bg-gray-700 hover:text-white"
//                     title="Cerrar sesión"
//                   >
//                     <LogOut className="h-5 w-5" />
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/auth/login">
//                     <Button
//                       variant="ghost"
//                       className="text-white hover:bg-amber-400 hover:text-black text-sm px-4 py-2"
//                     >
//                       Iniciar Sesión
//                     </Button>
//                   </Link>
//                   <Link to="/auth/register">
//                     <Button
//                       variant="ghost"
//                       className="text-white hover:bg-amber-400 hover:text-black text-sm px-4 py-2"
//                     >
//                       Registrarse
//                     </Button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { useAuthStore } from "@/stores/authStore";
import { LogOut, Ticket, Menu, ShoppingCart, User, UserPlus } from "lucide-react";
import { useContadorCarrito } from "@/stores/useCarritoStore"; // ✅ IMPORTAR
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

export const CustomHeader = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ REEMPLAZAR ESTA LÍNEA
  // const [cartCount] = useState(0); 
  const cartCount = useContadorCarrito(); // ✅ NUEVA LÍNEA

  // ✅ AGREGAR ESTADOS PARA ANIMACIÓN
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // ✅ AGREGAR EFFECT PARA DETECTAR CAMBIOS
  useEffect(() => {
    if (cartCount > prevCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      setPrevCount(cartCount);
      return () => clearTimeout(timer);
    } else {
      setPrevCount(cartCount);
    }
  }, [cartCount, prevCount]);

  // Función para determinar si el enlace está activo
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // Función para manejar logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      console.log("✅ Logout exitoso");
    } catch (error) {
      console.error("❌ Error en logout:", error);
    }
  };

  // Función para cerrar el menú al navegar
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-gray-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* IZQUIERDA: Logo (Desktop) y Menú Hamburguesa (Mobile) */}
          <div className="flex items-center">
            {/* Menú Hamburguesa - Solo Mobile */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-amber-400 hover:text-black md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[350px] bg-gradient-to-b from-gray-900 to-black text-white border-r border-gray-800 p-0"
              >
                {/* Header del menú */}
                <div className="px-6 py-5 border-b border-gray-800/50">
                  <SheetTitle className="text-white text-xl font-bold">
                    Menú
                  </SheetTitle>
                  <SheetDescription className="text-gray-400 text-sm mt-1">
                    Navega por las secciones
                  </SheetDescription>
                </div>

                {/* Navegación móvil */}
                <nav className="flex flex-col p-4 space-y-2">
                  {/* Enlaces de navegación */}
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActiveLink("/")
                      ? "bg-amber-400 text-black font-semibold shadow-lg shadow-amber-400/30"
                      : "text-white hover:bg-gray-800/50 hover:translate-x-1"
                      }`}
                  >
                    <span className="text-xl">🏠</span>
                    <span className="text-base">Inicio</span>
                  </Link>

                  <Link
                    to="/descargas"
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActiveLink("/descargas")
                      ? "bg-amber-400 text-black font-semibold shadow-lg shadow-amber-400/30"
                      : "text-white hover:bg-gray-800/50 hover:translate-x-1"
                      }`}
                  >
                    <Ticket className="h-5 w-5" />
                    <span className="text-base">Descarga de Boletas</span>
                  </Link>

                  {/* Separador con gradiente */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700/50"></div>
                    </div>
                  </div>

                  {/* Sección de usuario */}
                  {user ? (
                    <div className="space-y-2">
                      {/* Información del usuario con gradiente */}
                      <div className="px-4 py-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold text-lg">
                            {(user.nombre?.[0] || user.email?.[0] || 'U').toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate text-sm">
                              {user.nombre || user.email}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                              {user.user_type}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botón Admin */}
                      {user.user_type === "admin" && (
                        <Link to="/admin" onClick={handleLinkClick}>
                          <Button className="w-full bg-gradient-to-r mb-5 from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white cursor-pointer justify-start rounded-xl py-6 shadow-lg hover:shadow-teal-600/30 transition-all duration-200">
                            <span className="text-lg mr-3">⚙️</span>
                            <span className="text-base font-medium">Panel Admin</span>
                          </Button>
                        </Link>
                      )}

                      {/* Botón Agencia */}
                      {user.user_type === "agencia" && (
                        <Link to="/agency" onClick={handleLinkClick}>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer justify-start rounded-xl py-6 shadow-lg hover:shadow-blue-600/30 transition-all duration-200">
                            <span className="text-lg mr-3">🏢</span>
                            <span className="text-base font-medium">Panel Agencia</span>
                          </Button>
                        </Link>
                      )}

                      {/* Botón Logout */}
                      <Button
                        onClick={handleLogout}
                        className="w-full bg-red-600/90 hover:bg-red-700 text-white cursor-pointer justify-start rounded-xl py-6 shadow-lg hover:shadow-red-600/30 transition-all duration-200"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span className="text-base font-medium">Cerrar Sesión</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Botones para usuarios no autenticados */}
                      <Link to="/auth/login" onClick={handleLinkClick}>
                        <Button className="w-full bg-black hover:bg-gray-100 mb-5 text-white cursor-pointer justify-start rounded-xl py-6 border-2 border-amber-400/50 shadow-lg hover:shadow-amber-400/20 transition-all duration-200">
                          <User className="h-5 w-5 mr-3" />
                          <span className="text-base font-medium">Iniciar Sesión</span>
                        </Button>
                      </Link>

                      <Link to="/auth/register" onClick={handleLinkClick}>
                        <Button className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-semibold cursor-pointer justify-start rounded-xl py-6 shadow-lg hover:shadow-amber-400/40 transition-all duration-200">
                          <UserPlus className="h-5 w-5 mr-3" />
                          <span className="text-base font-medium">Registrarse</span>
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo - Desktop (Izquierda) */}
            <div className="hidden md:block">
              <CustomLogo />
            </div>
          </div>

          {/* CENTRO: Navigation Links - Desktop & Logo Mobile */}
          <div className="flex items-center">
            {/* Logo - Mobile (Centro) */}
            <div className="md:hidden scale-75">
              <CustomLogo />
            </div>

            {/* Navigation - Desktop (Centro) */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-amber-500 pb-1 border-b-2 text-white ${isActiveLink("/")
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent"
                  }`}
              >
                Inicio
              </Link>
              <Link
                to="/descargas"
                className={`text-sm font-medium transition-colors hover:text-amber-500 pb-1 border-b-2 text-white ${isActiveLink("/descargas")
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent"
                  }`}
              >
                Descarga de Boletas
              </Link>
            </nav>
          </div>

          {/* DERECHA: Carrito y botones de usuario */}
          <div className="flex items-center space-x-2 md:space-x-4">

            {/* CARRITO CON ANIMACIÓN */}
            <Link to="/carrito" title="Carrito de compras">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-white hover:bg-amber-400 hover:text-black relative transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'
                    }`}
                >
                  <ShoppingCart
                    className={`h-5 w-5 transition-transform duration-300 ${isAnimating ? 'rotate-12' : 'rotate-0'
                      }`}
                  />
                </Button>
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-0 -right-0 bg-amber-400 text-black text-[8px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center transition-all duration-300 ${isAnimating
                        ? 'animate-bounce scale-125 ring-1 ring-amber-300'
                        : 'scale-100'
                      }`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Botones de usuario - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  {/* Botón Admin */}
                  {user.user_type === "admin" && (
                    <Link to="/admin">
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer text-sm px-4 py-2">
                        Admin
                      </Button>
                    </Link>
                  )}

                  {/* Botón Agencia */}
                  {user.user_type === "agencia" && (
                    <Link to="/agency">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-sm px-4 py-2">
                        Agencia
                      </Button>
                    </Link>
                  )}

                  {/* Botón Logout */}
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
                <>
                  <Link to="/auth/login">
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-amber-400 hover:text-black text-sm px-4 py-2"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-amber-400 hover:text-black text-sm px-4 py-2"
                    >
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};