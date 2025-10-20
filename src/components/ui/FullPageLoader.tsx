// src/components/ui/FullPageLoader.tsx
import { Loader2 } from "lucide-react"

export const FullPageLoader = ({ message = "Verificando acceso..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
