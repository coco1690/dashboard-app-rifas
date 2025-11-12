import EstadisticasAgenciasCards from "./components/EstadisticasAgenciasCards";

export default function EstadisticasAgenciasPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header con emojis */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          📊 Panel de Estadísticas
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <span>🚀</span>
          Monitorea el rendimiento y las ventas de todas las agencias en tiempo real
        </p>
      </div>

      <EstadisticasAgenciasCards />
    </div>
  )
}