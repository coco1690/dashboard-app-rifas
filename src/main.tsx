// import { createRoot } from 'react-dom/client'
// import { RifasPageApp } from './RifasPageApp'
// import './index.css'
// import { supabase } from './supabase/client'
// import { useAuthStore } from './stores/authStore'
// import { Toaster } from 'sonner'

// let isInitialized = false

// const handleAuthChange = async (event: string, session: any) => {
//   const email = session?.user?.email ?? null

//   // En producción, comentar o remover logs
//   if (import.meta.env.DEV) {
//     console.log(`🔄 Auth event: ${event}, Email: ${email}`)
//   }

//   // ✅ Esperar un momento para que Zustand persist cargue el localStorage
//   await new Promise(resolve => setTimeout(resolve, 100))

//   const currentUser = useAuthStore.getState().user

//   if (email) {
//     // Si el usuario en cache coincide, NO hacer nada
//     if (currentUser?.email === email && isInitialized) {
//       if (import.meta.env.DEV) {
//         // console.log("⏭️ Usuario ya en cache, skipping DB call")
//       }
//       useAuthStore.setState({ isSessionChecked: true })
//       return
//     }

//     // Si hay un usuario en cache pero con diferente email
//     if (currentUser?.email && currentUser.email !== email) {
//       if (import.meta.env.DEV) {
//         console.log("⚠️ Email cambió, recargando desde DB")
//       }
//     } else if (!currentUser) {
//       if (import.meta.env.DEV) {
//         console.log("🔍 No hay usuario en cache, consultando DB")
//       }
//     }

//     if (import.meta.env.DEV) {
//       console.log("✅ Cargando usuario:", email)
//     }

//     try {
//       await useAuthStore.getState().setUserFromSession(email)
//     } catch (error) {
//       console.error("❌ Error cargando usuario desde sesión:", error)
//       useAuthStore.setState({ isSessionChecked: true })
//     }
//   } else {
//     if (import.meta.env.DEV) {
//       console.log("👋 Usuario cerró sesión")
//     }
//     useAuthStore.setState({ user: null, isSessionChecked: true })
//   }

//   isInitialized = true
// }

// // Suscribirse a cambios de autenticación
// supabase.auth.onAuthStateChange(handleAuthChange)

// const rootElement = document.getElementById('root')
// if (!rootElement) {
//   throw new Error('No root element found')
// }

// createRoot(rootElement).render(
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
import { useReservaStore } from './stores/useReservaStore'
import { Toaster } from 'sonner'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

let isInitialized = false

const handleAuthChange = async (event: string, session: any) => {
  const email = session?.user?.email ?? null

  if (import.meta.env.DEV) {
    console.log(`🔄 Auth event: ${event}, Email: ${email}`)
  }

  // Esperar un momento para que Zustand persist cargue el localStorage
  await new Promise(resolve => setTimeout(resolve, 100))

  const currentUser = useAuthStore.getState().user

  if (email) {
    // Si el usuario en cache coincide, NO hacer nada
    if (currentUser?.email === email && isInitialized) {
      useAuthStore.setState({ isSessionChecked: true })
      return
    }

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


// ✅ NUEVO: Inicializar sistema de reservas
const initializeApp = () => {
  // Inicializar sesión de reservas
  useReservaStore.getState().inicializarSesion()

  // Configurar limpieza al cerrar navegador
  window.addEventListener('beforeunload', () => {
    const { sessionId } = useReservaStore.getState()

    if (sessionId) {
      // Construir URL con API key como query param
      const baseUrl = import.meta.env.VITE_SUPABASE_URL
      const apiKey = import.meta.env.VITE_SUPABASE_KEY
      const url = `${baseUrl}/rest/v1/rpc/liberar_reservas_sesion?apikey=${apiKey}`

      const payload = JSON.stringify({ p_session_id: sessionId })
      const blob = new Blob([payload], { type: 'application/json' })

      // Enviar con sendBeacon
      const sent = navigator.sendBeacon(url, blob)

      if (!sent && import.meta.env.DEV) {
        console.warn('⚠️ sendBeacon falló, las reservas se liberarán por timeout')
      }
    }
  })
}

// Suscribirse a cambios de autenticación
supabase.auth.onAuthStateChange(handleAuthChange)

// Inicializar app
initializeApp()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('No root element found')
}
const paypalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
  currency: 'USD',
  intent: 'capture',
  locale: 'es_EC'
}

createRoot(rootElement).render(
  <>
    <PayPalScriptProvider options={paypalOptions}>
      <RifasPageApp />
    </PayPalScriptProvider>
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