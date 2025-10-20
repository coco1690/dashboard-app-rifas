import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'cards' | 'list'
  size?: 'sm' | 'md' | 'lg'
  message?: string
  count?: number
  className?: string
}

export const CustomLoading = ({ 
  variant = 'spinner', 
  size = 'md', 
  message = 'Cargando...', 
  count = 3,
  className 
}: LoadingProps) => {
  
  // Tamaños del spinner
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  // Contenedor base
  const containerClasses = cn(
    "flex flex-col items-center justify-center py-8",
    className
  )

  // Variante Spinner (loading simple con icono giratorio)
  if (variant === 'spinner') {
    return (
      <div className={containerClasses}>
        <Loader2 className={cn("animate-spin text-muted-foreground mb-2", spinnerSizes[size])} />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    )
  }

  // Variante Skeleton (skeletons simples)
  if (variant === 'skeleton') {
    return (
      <div className={cn("space-y-4 p-4", className)}>
        <div className="text-center mb-6">
          <Skeleton className="h-4 w-32 mx-auto mb-2" />
          <Skeleton className="h-3 w-48 mx-auto" />
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Variante Cards (skeleton de tarjetas como tu CustomGetUsers)
  if (variant === 'cards') {
    return (
      <div className={cn("p-6 bg-background min-h-screen", className)}>
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Cards skeleton grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                {/* Header con gradiente simulado */}
                <CardHeader className="bg-gradient-to-l from-teal-50 to-teal-700 text-white p-3 -m-6 mb-4 rounded-t-lg">
                  <div className="flex items-center justify-between mr-5 ml-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Skeleton className="w-6 h-6 bg-white/30" />
                      </div>
                      <Skeleton className="h-5 w-32 bg-white/30" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-8 w-8 rounded bg-white/20" />
                      <Skeleton className="h-8 w-8 rounded bg-white/20" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  {/* Info items skeleton */}
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center space-x-2">
                      <Skeleton className="w-7 h-7 rounded-lg" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}

                  {/* Badge skeleton */}
                  <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/30 border-t py-2 px-4">
                  <div className="flex items-center justify-between w-full">
                    <Skeleton className="h-3 w-20" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Variante List (skeleton de lista simple)
  if (variant === 'list') {
    return (
      <div className={cn("space-y-3 p-4", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return null
}