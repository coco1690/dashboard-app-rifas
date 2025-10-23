// import { useSearchParams } from 'react-router';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { Button } from '../ui/button';

// interface Props {
//   totalPages: number;
// }

// export const CustomPagination = ({ totalPages }: Props) => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const queryPage = searchParams.get('page') || '1';
//   const page = isNaN(+queryPage) ? 1 : +queryPage;

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > totalPages) return;

//     searchParams.set('page', page.toString());

//     setSearchParams(searchParams);
//   };

//   return (
//     <div className="flex items-center justify-center space-x-2">
//       <Button
//         variant="outline"
//         size="sm"
//         disabled={page === 1}
//         onClick={() => handlePageChange(page - 1)}
//       >
//         <ChevronLeft className="h-4 w-4" />
//         Anteriores
//       </Button>

//       {Array.from({ length: totalPages }).map((_, index) => (
//         <Button
//           key={index}
//           variant={page === index + 1 ? 'default' : 'outline'}
//           size="sm"
//           onClick={() => handlePageChange(index + 1)}
//         >
//           {index + 1}
//         </Button>
//       ))}

//       <Button
//         variant="outline"
//         size="sm"
//         disabled={page === totalPages}
//         onClick={() => handlePageChange(page + 1)}
//       >
//         Siguientes
//         <ChevronRight className="h-4 w-4" />
//       </Button>
//     </div>
//   );
// };
import { useSearchParams } from 'react-router';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  totalPages: number;
  maxVisiblePages?: number; // Máximo de páginas visibles en móvil
}

export const CustomPagination = ({ totalPages, maxVisiblePages = 5 }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') || '1';
  const page = isNaN(+queryPage) ? 1 : +queryPage;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    searchParams.set('page', page.toString());
    setSearchParams(searchParams);

    // Scroll to top al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para calcular las páginas visibles
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, page - halfVisible);
    let endPage = Math.min(totalPages, page + halfVisible);

    // Ajustar si estamos al principio o al final
    if (page <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    } else if (page >= totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Agregar primera página y puntos suspensivos si es necesario
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Agregar páginas del rango
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Agregar puntos suspensivos y última página si es necesario
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {/* Botón Anterior */}
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        className="flex items-center gap-1 px-2 sm:px-3"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {visiblePages.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-gray-500"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          return (
            <Button
              key={pageNum}
              variant={page === pageNum ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(pageNum as number)}
              className={`min-w-[36px] sm:min-w-[40px] ${
                page === pageNum 
                  ? 'bg-black hover:bg-black text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      {/* Botón Siguiente */}
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        className="flex items-center gap-1 px-2 sm:px-3"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
