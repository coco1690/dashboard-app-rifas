import { Flag, Trophy, Calendar, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const CustomComoFiunciona = () => {
  return (
    <section className="py-16 px-4 lg:px-8 bg-black">
      <div className="container mx-auto">
        {/* Título */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-light tracking-tight mb-6 text-gray-400">
            COMO FUNCIONA
          </h1>
        </div>
        
        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Card 1 */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-md">
                <Flag className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-400 leading-relaxed">
                El evento se jugará cuando se<br />
                hayan vendido el 100% de<br />
                números disponibles.
              </h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-md">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-400 leading-relaxed">
                El ganador se elegirá según las cifras<br />
                de los últimos números de Premio<br />
                mayor de la Lotería Nacional.
              </h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-md">
                <Calendar className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-400 leading-relaxed">
                La fecha y ganador se<br />
                comunicarán a través de WhatsApp<br />
                o en nuestra cuenta de Instagram :
              </h3>
              <Button 
                variant="outline" 
                className="border-gray-400 text-gray-700 hover:bg-gray-50 rounded-full px-6 py-2"
              >
                <Instagram className="w-4 h-4 mr-2" />
                EventosIB
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}