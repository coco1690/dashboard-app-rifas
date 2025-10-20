

import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/supabase/client';
import { FullPageLoader } from '../ui/FullPageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, isSessionChecked } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  // useEffect(() => {
  //   const checkAccess = async () => {
  //     if (!requireAuth) {
  //       setIsAuthorized(true);
  //       return;
  //     }

  //     if (!user) {
  //       setIsAuthorized(false);
  //       return;
  //     }

  //     // Si no hay roles requeridos, dejar pasar
  //     if (!allowedRoles) {
  //       setIsAuthorized(true);
  //       return;
  //     }

  //     // ✅ USAR EL user_type DEL STORE en lugar de consultar la DB
  //     const userRole = user.user_type || '';

  //     // ⚠️ VALIDACIÓN ADICIONAL PARA AGENCIAS
  //     if (userRole === 'agencia' && allowedRoles.includes('agencia')) {
  //       const { data: agenciaData } = await supabase
  //         .from('agencias')
  //         .select('is_verified')
  //         .eq('user_id', user.id)
  //         .single();

  //       if (!agenciaData?.is_verified) {
  //         setIsAuthorized(false);
  //         return;
  //       }
  //     }

  //     if (allowedRoles.includes(userRole)) {
  //       setIsAuthorized(true);
  //     } else {
  //       setIsAuthorized(false);
  //     }
  //   };

  //   if (isSessionChecked) {
  //     checkAccess();
  //   }
  // }, [isSessionChecked, user, requireAuth, allowedRoles]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!requireAuth) {
        setIsAuthorized(true);
        return;
      }

      if (!user) {
        setIsAuthorized(false);
        return;
      }

      // ✅ Validar que el token de Supabase Auth sea válido
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // No hay sesión válida, limpiar y redirigir
        useAuthStore.setState({ user: null });
        setIsAuthorized(false);
        return;
      }

      // ✅ Verificar que el email del token coincida con el del store
      if (session.user.email !== user.email) {
        // Email manipulado, limpiar y redirigir
        useAuthStore.setState({ user: null });
        setIsAuthorized(false);
        return;
      }

      if (!allowedRoles) {
        setIsAuthorized(true);
        return;
      }

      const userRole = user.user_type || '';

      if (userRole === 'agencia' && allowedRoles.includes('agencia')) {
        const { data: agenciaData } = await supabase
          .from('agencias')
          .select('is_verified')
          .eq('user_id', user.id)
          .single();

        if (!agenciaData?.is_verified) {
          setIsAuthorized(false);
          return;
        }
      }

      if (allowedRoles.includes(userRole)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    };

    if (isSessionChecked) {
      checkAccess();
    }
  }, [isSessionChecked, user, requireAuth, allowedRoles]);

  if (!isSessionChecked || isAuthorized === null) {
    return <FullPageLoader />
  }

  if (!user && requireAuth) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (isAuthorized === false) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.user_type || ''))) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};