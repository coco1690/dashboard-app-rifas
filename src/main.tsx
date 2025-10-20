// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { RifasPageApp } from './RifasPageApp'
// import './index.css'
// import { supabase } from './supabase/client'
// import { useAuthStore } from './stores/authStore'
// import { Toaster } from 'sonner'

// // Variables para control de estado
// let isInitialized = false
// let currentUserEmail: string | null = null


// // Función optimizada para manejar cambios de autenticación
// const handleAuthChange = async (event: any, session: any) => {
//   const email = session?.user?.email ?? null
  
//   // Solo procesar si realmente cambió el usuario
//   if (email === currentUserEmail && isInitialized) {
//     return // No hacer nada si es el mismo usuario
//   }

//   console.log(`🔄 Auth event: ${event}, Email: ${email}`)
  
//   if (email) {
//     console.log("✅ Usuario conectado:", email)
//     currentUserEmail = email
//     await useAuthStore.getState().setUserFromSession(email)
//   } else {
//     console.log("👋 Usuario cerró sesión")
//     currentUserEmail = null
//     useAuthStore.getState().setUserFromSession(null)
//   }
  
//   isInitialized = true
// }



// // Un solo listener para todos los eventos de autenticación
// supabase.auth.onAuthStateChange(handleAuthChange)

// createRoot(document.getElementById('root')!).render(
//   // <StrictMode>
//     <>
//       <RifasPageApp />
//       <Toaster 
//         position="top-right"
//         richColors
//         expand={true}
//         closeButton={true}
//         duration={4000}
//         toastOptions={{
//           style: {
//             fontSize: '14px',
//           },
//           className: 'sonner-toast',
//         }}
//       />
//     </>
//   // </StrictMode>,
// )



import { createRoot } from 'react-dom/client'
import { RifasPageApp } from './RifasPageApp'
import './index.css'
import { supabase } from './supabase/client'
import { useAuthStore } from './stores/authStore'
import { Toaster } from 'sonner'

let isInitialized = false

const handleAuthChange = async (event: any, session: any) => {
  const email = session?.user?.email ?? null
  
  console.log(`🔄 Auth event: ${event}, Email: ${email}`)
  
  // ✅ Esperar un momento para que Zustand persist cargue el localStorage
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const currentUser = useAuthStore.getState().user
  
  if (email) {
    // Si el usuario en cache coincide, NO hacer nada
    if (currentUser?.email === email && isInitialized) {
      console.log("⏭️ Usuario ya en cache, skipping DB call")
      useAuthStore.setState({ isSessionChecked: true })
      return
    }
    
    // Si hay un usuario en cache pero con diferente email
    if (currentUser?.email && currentUser.email !== email) {
      console.log("⚠️ Email cambió, recargando desde DB")
    } else if (!currentUser) {
      console.log("🔍 No hay usuario en cache, consultando DB")
    }
    
    console.log("✅ Cargando usuario:", email)
    await useAuthStore.getState().setUserFromSession(email)
  } else {
    console.log("👋 Usuario cerró sesión")
    useAuthStore.setState({ user: null, isSessionChecked: true })
  }
  
  isInitialized = true
}

supabase.auth.onAuthStateChange(handleAuthChange)

createRoot(document.getElementById('root')!).render(
  <>
    <RifasPageApp />
    <Toaster 
      position="top-right"
      richColors
      expand={true}
      closeButton={true}
      duration={4000}
      toastOptions={{
        style: {
          fontSize: '14px',
        },
        className: 'sonner-toast',
      }}
    />
  </>
)

// // main.tsx
// import { createRoot } from 'react-dom/client'
// import { RifasPageApp } from './RifasPageApp'
// import './index.css'
// import { supabase } from './supabase/client'
// import { useAuthStore } from './stores/authStore'
// import { Toaster } from 'sonner'

// let isInitialized = false
// let currentUserEmail: string | null = null

// const handleAuthChange = async (event: any, session: any) => {
//   const email = session?.user?.email ?? null
  
//   console.log(`🔄 Auth event: ${event}, Email: ${email}`)
  
//   // 🔥 SOLUCIÓN: Ignorar SIGNED_IN si ya hay un usuario activo
//   if (event === 'SIGNED_IN' && session) {
//     const currentUser = useAuthStore.getState().user
    
//     // Si ya hay un admin o agencia logueado, NO sobrescribir su sesión
//     if (currentUser && ['admin', 'agencia'].includes(currentUser.user_type)) {
//       console.log('⚠️ Ignorando auto-login - Usuario actual protegido:', currentUser.user_type)
//       await supabase.auth.signOut() // Cerrar la sesión del recién creado
//       return
//     }
//   }
  
//   // Solo procesar si realmente cambió el usuario o es primera inicialización
//   if (email === currentUserEmail && isInitialized) {
//     return
//   }

//   if (email) {
//     console.log("✅ Usuario conectado:", email)
//     currentUserEmail = email
//     await useAuthStore.getState().setUserFromSession(email)
//   } else {
//     console.log("👋 Usuario cerró sesión")
//     currentUserEmail = null
//     useAuthStore.getState().setUserFromSession(null)
//   }
  
//   isInitialized = true
// }

// supabase.auth.onAuthStateChange(handleAuthChange)

// createRoot(document.getElementById('root')!).render(
//   <>
//     <RifasPageApp />
//     <Toaster 
//       position="top-right"
//       richColors
//       expand={true}
//       closeButton={true}
//       duration={4000}
//       toastOptions={{
//         style: {
//           fontSize: '14px',
//         },
//         className: 'sonner-toast',
//       }}
//     />
//   </>
// )