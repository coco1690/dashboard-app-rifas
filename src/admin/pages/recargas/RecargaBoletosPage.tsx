
import { HistorialRecargas } from './components/HistorialRecargas'
import { RecargarBoletosForm } from './components/recargarBoletosForm'

export const RecargaBoletosPage = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <RecargarBoletosForm />
      <HistorialRecargas />
    </div>
  )
}