import { createClient } from "@supabase/supabase-js";

const supabase_url = import.meta.env.VITE_SUPABASE_URL as string;
const supabase_key = import.meta.env.VITE_SUPABASE_KEY as string;


if (!supabase_url || !supabase_key) {
  throw new Error(
    'Faltan las variables de entorno de Supabase. Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env'
  )
}

export const supabase = createClient(supabase_url, supabase_key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})