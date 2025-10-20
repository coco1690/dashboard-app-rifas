// // hooks/useAuth.ts
// import { useAuthStore } from '@/stores/authStore'
// import { useEffect, useRef } from 'react'


// export const useAuth = () => {
//   const initialized = useRef(false)
  
//   const {
//     user,
//     session,
//     loading,
//     error,
//     isAuthenticated,
//     signInWithOtp,
//     signInWithPassword,
//     signUp,
//     signOut,
//     setError,
//     clearError,
//     initialize
//   } = useAuthStore()

//   // Inicializar el store solo una vez
//   useEffect(() => {
//     if (!initialized.current) {
//       initialize()
//       initialized.current = true
//     }
//   }, [initialize])

//   return {
//     // Estado
//     user,
//     session,
//     loading,
//     error,
//     isAuthenticated,

//     // Acciones
//     signInWithOtp,
//     signInWithPassword,
//     signUp,
//     signOut,
//     setError,
//     clearError,

//     // Utilidades
//     isLoading: loading,
//     hasError: !!error
//   }
// }