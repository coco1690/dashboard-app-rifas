// import { supabase } from '@/supabase/client';
// import { useEffect } from 'react';


// export const useAuthListener = () => {
//   useEffect(() => {
//     const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
//       console.log('Auth state changed:', event, session);
      
//       if (event === 'INITIAL_SESSION') {
//         if (session) {
//           console.log('✅ Usuario ya estaba logueado:', session.user.email);
//         } else {
//           console.log('ℹ️ No hay usuario logueado');
//         }
//       } else if (event === 'SIGNED_IN') {
//         console.log('✅ Usuario se logueó:', session?.user.email);
//       } else if (event === 'SIGNED_OUT') {
//         console.log('❌ Usuario cerró sesión');
//       } else if (event === 'TOKEN_REFRESHED') {
//         console.log('🔄 Token renovado');
//       } else if (event === 'USER_UPDATED') {
//         console.log('👤 Usuario actualizado');
//       }
//     });

//     return () => {
//       listener?.subscription.unsubscribe();
//     };
//   }, []);
// };