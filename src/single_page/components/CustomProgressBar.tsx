// interface EstadisticasRifaProps {
//   totalBoletos: number;
//   vendidos: number;
//   rifaDescription?: string; 
// }

// export const CustomProgressBar = ({ totalBoletos, vendidos, rifaDescription }: EstadisticasRifaProps) => {
//   // Calcular porcentaje exacto
//   const porcentajeExacto = totalBoletos > 0 ? (vendidos / totalBoletos) * 100 : 0;

//   // Formatear según el valor:
//   // - Si < 1%: mostrar 2 decimales (0.23%)
//   // - Si < 10%: mostrar 1 decimal (5.7%)
//   // - Si >= 10%: sin decimales (15%)
//   const porcentajeVendido = porcentajeExacto < 1 
//     ? porcentajeExacto.toFixed(2)
//     : porcentajeExacto < 10
//       ? porcentajeExacto.toFixed(1)
//       : Math.round(porcentajeExacto);

//   // Para la barra y el indicador, usar el valor numérico exacto
//   const porcentajeNumerico = Number(porcentajeVendido);

//   return (
//     <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 shadow-lg py-8 px-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4 shadow-md">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
//             DISPONIBILIDAD LIMITADA
//           </h2>
//           <p className="text-slate-600 text-sm font-medium">
//             Reserva tu boleto antes de que se agoten
//           </p>
//         </div>

//         {/* Progress Stats */}
//         <div className="bg-white rounded-xl border border-slate-200/80 p-6 mb-6 shadow-sm">
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 w-full">
//             <div className="text-center sm:text-center">
//               <p className="text-sm font-bold font-montserrat text-slate-500 tracking-wide mb-1">
//                 Progreso de Venta
//               </p>
//               <p className="text-3xl font-bold text-slate-800">
//                 {porcentajeVendido}%
//               </p>
//             </div>
//             {/* <div className="text-center sm:text-right">
//               <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
//                 Boletos Vendidos
//               </p>
//               <p className="text-2xl font-semibold text-slate-700">
//                 {vendidos.toLocaleString()} / {totalBoletos.toLocaleString()}
//               </p>
//             </div> */}
//           </div>

//           {/* Enhanced Progress Bar */}
//           <div className="relative">
//             <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner overflow-hidden">
//               <div 
//                 className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 rounded-full transition-all duration-700 ease-out relative shadow-sm"
//                 style={{ width: `${porcentajeExacto}%` }}
//               >
//                 {/* Shimmer effect */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
//               </div>
//             </div>

//             {/* Progress indicator */}
//             {/* {porcentajeNumerico > 0 && (
//               <div 
//                 className="absolute top-0 transform -translate-y-8 -translate-x-1/2 transition-all duration-700"
//                 style={{ left: `${Math.min(porcentajeExacto, 95)}%` }}
//               >
//                 <div className="bg-slate-800 text-white text-xs font-semibold py-1 px-2 rounded shadow-lg whitespace-nowrap">
//                   {porcentajeVendido}%
//                 </div>
//                 <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800 mx-auto"></div>
//               </div>
//             )} */}
//           </div>
//         </div>

//         {/* Information Section */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/60 p-6">
//           <div className="flex items-start space-x-4">
//             <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//               <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-slate-800 mb-2">
//                 ¿Cómo funciona el evento?
//               </h3>
//               <p className="text-slate-700 leading-relaxed text-sm">
//                 {rifaDescription}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Status Badge */}
//         <div className="text-center mt-6">
//           <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
//             porcentajeNumerico === 100 
//               ? 'bg-red-100 text-red-800 border border-red-200' 
//               : porcentajeNumerico > 75 
//                 ? 'bg-amber-100 text-amber-800 border border-amber-200'
//                 : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
//           }`}>
//             {porcentajeNumerico === 100 ? (
//               <>
//                 <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 AGOTADO - Sorteo Próximamente
//               </>
//             ) : porcentajeNumerico > 75 ? (
//               <>
//                 <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 ÚLTIMOS BOLETOS DISPONIBLES
//               </>
//             ) : (
//               <>
//                 <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 BOLETOS DISPONIBLES
//               </>
//             )}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useNavigate } from "react-router";

interface EstadisticasRifaProps {
  totalBoletos: number;
  vendidos: number;
  rifaDescription?: string;
}

export const CustomProgressBar = ({
  totalBoletos,
  vendidos,
  rifaDescription
}: EstadisticasRifaProps) => {
  const navigate = useNavigate();

  // Calcular porcentaje exacto
  const porcentajeExacto = totalBoletos > 0 ? (vendidos / totalBoletos) * 100 : 0;

  // Formatear según el valor
  const porcentajeVendido = porcentajeExacto < 1
    ? porcentajeExacto.toFixed(2)
    : porcentajeExacto < 10
      ? porcentajeExacto.toFixed(1)
      : Math.round(porcentajeExacto);

  const porcentajeNumerico = Number(porcentajeVendido);

  // Handler para redireccionar al registro
  const handleRegisterClick = () => {
    navigate('/auth/register');
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 shadow-lg py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
            DISPONIBILIDAD LIMITADA
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Reserva tu boleto antes de que se agoten
          </p>
        </div>

        {/* Progress Stats */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 w-full">
            <div className="text-center sm:text-center">
              <p className="text-sm font-bold font-montserrat text-slate-500 tracking-wide mb-1">
                Progreso de Venta
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {porcentajeVendido}%
              </p>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 rounded-full transition-all duration-700 ease-out relative shadow-sm"
                style={{ width: `${porcentajeExacto}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTÓN ANIMADO DE REGISTRO */}
        <div className="mb-6">
          <button
            onClick={handleRegisterClick}
            className="relative w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-lg py-5 px-8 rounded-2xl shadow-2xl hover:shadow-amber-400/80 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
          >
            {/* Ondas animadas de fondo */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full translate-x-1/2 translate-y-1/2 animate-ping animation-delay-500" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Contenido */}
            <div className="relative flex items-center justify-center gap-3">
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🎯</span>
              <div className="flex flex-col items-center">
                <span className="tracking-widest">¡REGÍSTRATE AQUÍ!</span>
                <span className="text-xs font-normal opacity-90">¡No te quedes sin tu número!</span>
              </div>
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🎯</span>
            </div>
          </button>
        </div>

        {/* Information Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/60 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                ¿Cómo funciona el evento?
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm">
                {rifaDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-center mt-6">
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${porcentajeNumerico === 100
              ? 'bg-red-100 text-red-800 border border-red-200'
              : porcentajeNumerico > 75
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
            {porcentajeNumerico === 100 ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                AGOTADO - Sorteo Próximamente
              </>
            ) : porcentajeNumerico > 75 ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ÚLTIMOS BOLETOS DISPONIBLES
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                BOLETOS DISPONIBLES
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};