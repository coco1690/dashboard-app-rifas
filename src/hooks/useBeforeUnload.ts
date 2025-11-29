// src/hooks/useBeforeUnload.ts

import { useEffect } from 'react'
import { useReservaStore } from '@/stores/useReservaStore'

// Hook para liberar reservas cuando el usuario cierra el navegador/tab
 
export const useBeforeUnload = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      const { sessionId } = useReservaStore.getState()
      
      if (sessionId) {
        // Usar navigator.sendBeacon para envío garantizado
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/liberar_reservas_sesion`
        const payload = JSON.stringify({ p_session_id: sessionId })
        
        navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
}