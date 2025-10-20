
// import { createRoot } from 'react-dom/client'
// import { RifasPageApp } from './RifasPageApp'
// import './index.css'
// import { supabase } from './supabase/client'
// import { useAuthStore } from './stores/authStore'
// import { Toaster } from 'sonner'

// let isInitialized = false

// const handleAuthChange = async (event: any, session: any) => {
//   const email = session?.user?.email ?? null
  
//   console.log(`🔄 Auth event: ${event}, Email: ${email}`)
  
//   // ✅ Esperar un momento para que Zustand persist cargue el localStorage
//   await new Promise(resolve => setTimeout(resolve, 100))
  
//   const currentUser = useAuthStore.getState().user
  
//   if (email) {
//     // Si el usuario en cache coincide, NO hacer nada
//     if (currentUser?.email === email && isInitialized) {
//       console.log("⏭️ Usuario ya en cache, skipping DB call")
//       useAuthStore.setState({ isSessionChecked: true })
//       return
//     }
    
//     // Si hay un usuario en cache pero con diferente email
//     if (currentUser?.email && currentUser.email !== email) {
//       console.log("⚠️ Email cambió, recargando desde DB")
//     } else if (!currentUser) {
//       console.log("🔍 No hay usuario en cache, consultando DB")
//     }
    
//     console.log("✅ Cargando usuario:", email)
//     await useAuthStore.getState().setUserFromSession(email)
//   } else {
//     console.log("👋 Usuario cerró sesión")
//     useAuthStore.setState({ user: null, isSessionChecked: true })
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


import { createRoot } from 'react-dom/client'
import { RifasPageApp } from './RifasPageApp'
import './index.css'
import { supabase } from './supabase/client'
import { useAuthStore } from './stores/authStore'
import { Toaster } from 'sonner'

let isInitialized = false

const handleAuthChange = async (event: string, session: any) => {
  const email = session?.user?.email ?? null
  
  // En producción, comentar o remover logs
  if (import.meta.env.DEV) {
    console.log(`🔄 Auth event: ${event}, Email: ${email}`)
  }
  
  // ✅ Esperar un momento para que Zustand persist cargue el localStorage
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const currentUser = useAuthStore.getState().user
  
  if (email) {
    // Si el usuario en cache coincide, NO hacer nada
    if (currentUser?.email === email && isInitialized) {
      if (import.meta.env.DEV) {
        console.log("⏭️ Usuario ya en cache, skipping DB call")
      }
      useAuthStore.setState({ isSessionChecked: true })
      return
    }
    
    // Si hay un usuario en cache pero con diferente email
    if (currentUser?.email && currentUser.email !== email) {
      if (import.meta.env.DEV) {
        console.log("⚠️ Email cambió, recargando desde DB")
      }
    } else if (!currentUser) {
      if (import.meta.env.DEV) {
        console.log("🔍 No hay usuario en cache, consultando DB")
      }
    }
    
    if (import.meta.env.DEV) {
      console.log("✅ Cargando usuario:", email)
    }
    
    try {
      await useAuthStore.getState().setUserFromSession(email)
    } catch (error) {
      console.error("❌ Error cargando usuario desde sesión:", error)
      useAuthStore.setState({ isSessionChecked: true })
    }
  } else {
    if (import.meta.env.DEV) {
      console.log("👋 Usuario cerró sesión")
    }
    useAuthStore.setState({ user: null, isSessionChecked: true })
  }
  
  isInitialized = true
}

// Suscribirse a cambios de autenticación
supabase.auth.onAuthStateChange(handleAuthChange)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('No root element found')
}

createRoot(rootElement).render(
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