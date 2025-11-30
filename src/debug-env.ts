
console.log('🔍 DEBUG ENVIRONMENT VARIABLES:', {
  MODE: import.meta.env.VITE_PAYPAL_MODE,
  SANDBOX_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX,
  LIVE_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID_LIVE,
  ALL_ENV: import.meta.env
})

export {}