import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const DialogTerminosyCondiciones = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 text-white hover:bg-blue-500 font-semibold px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer">
          Términos y condiciones
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Términos y Condiciones
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            Por favor, lee detenidamente los siguientes términos y condiciones
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            {/* Sección 1 */}
            <div>
              <h3 className="font-semibold text-base mb-2">1. Duración</h3>
              <p className="text-gray-700">
                El sorteo se realizará una vez se haya completado la venta total de números.
              </p>
            </div>

            {/* Sección 2 */}
            <div>
              <h3 className="font-semibold text-base mb-2">2. Elegibilidad</h3>
              <p className="text-gray-700">
                El sorteo está abierto a cualquier persona sin restricción de edad.
              </p>
            </div>

            {/* Sección 3 */}
            <div>
              <h3 className="font-semibold text-base mb-2">3. Selección del Ganador</h3>
              <p className="text-gray-700">
                El ganador será determinado en base a las últimas cifras del resultado de la lotería nacional.
              </p>
            </div>

            {/* Sección 4 */}
            <div>
              <h3 className="font-semibold text-base mb-2">4. Premio</h3>
              <p className="text-gray-700">
                El premio será entregado a nombre del ganador o su representante mayor de edad con todos los procesos de ley.
              </p>
            </div>

            {/* Sección 5 */}
            <div>
              <h3 className="font-semibold text-base mb-2">5. Notificación al Ganador</h3>
              <p className="text-gray-700">
                Nos pondremos en contacto con el ganador a través de los datos proporcionados al participar en el sorteo ya sea por WhatsApp o correo electrónico. Los resultados serán publicados en las redes y medios participantes.
              </p>
            </div>

            {/* Sección 6 */}
            <div>
              <h3 className="font-semibold text-base mb-2">6. Propiedad Intelectual</h3>
              <p className="text-gray-700">
                Todo el contenido proporcionado a través de este servicio está protegido por derechos de autor y otros derechos de propiedad intelectual.
              </p>
            </div>

            {/* Sección 7 */}
            <div>
              <h3 className="font-semibold text-base mb-2">7. Condiciones Generales</h3>
              <p className="text-gray-700">
                Deben venderse todos los números participantes para poder realizar el sorteo.
              </p>
            </div>

            {/* Sección 8 */}
            <div>
              <h3 className="font-semibold text-base mb-2">8. Premio</h3>
              <p className="text-gray-700 mb-3">
                Los ganadores deben seguir nuestras redes sociales indicadas para el sorteo y demostrar que tienen el número ganador y que la ID orden sean la correcta.
              </p>

              {/* Subsección 8.1 */}
              <div className="ml-4 mb-3">
                <h4 className="font-semibold text-sm mb-2">8.1 Premio mayor</h4>
                <p className="text-gray-700">
                  El premio será entregado personalmente en la ciudad del ganador, se aplicarán restricciones. El ganador estará dispuesto y acepta ser grabado en video al momento de la entrega del premio.
                </p>
              </div>

              {/* Subsección 8.2 */}
              <div className="ml-4">
                <h4 className="font-semibold text-sm mb-2">8.2 Premios económicos o especiales</h4>
                <p className="text-gray-700 mb-3">
                  Serán entregados inmediatamente al ganador del número acertante vía transferencia, efectivo o a su vez físicamente de ser el caso, una vez sea verificado y corroborado por los técnicos.
                </p>

                {/* Subsección 8.2.1 */}
                <div className="ml-4 mb-3">
                  <h5 className="font-semibold text-sm mb-2">8.2.1</h5>
                  <p className="text-gray-700">
                    El ganador del premio especial deberá enviar un video mencionando a EventosIB.com, en el debe mencionar el sorteo, el premio y enseñar el número con el que fue ganador.
                  </p>
                </div>

                {/* Subsección 8.2.2 */}
                <div className="ml-4 mb-3">
                  <h5 className="font-semibold text-sm mb-2">8.2.2</h5>
                  <p className="text-gray-700">
                    Si el premio económico es igual o mayor a $400 el ganador de dicho premio se comprometerá a comprar $100 en números del sorteo vigente por el cual fue acreedor al premio.
                  </p>
                </div>

                {/* Subsección 8.2.3 */}
                <div className="ml-4">
                  <h5 className="font-semibold text-sm mb-2">8.2.3</h5>
                  <p className="text-gray-700">
                    Las promociones lanzadas en cada evento mediante nuestras redes sociales y canales oficiales son vigentes únicamente desde el momento que se anuncian hasta las 11:59pm del mismo día.
                  </p>
                </div>
              </div>
            </div>

            {/* Sección 9 */}
            <div>
              <h3 className="font-semibold text-base mb-2">9. Asignación de números</h3>
              <p className="text-gray-700">
                Los números serán asignados por el sistema de manera única y aleatoria para cada participante.
              </p>
            </div>

            {/* Sección 10 */}
            <div>
              <h3 className="font-semibold text-base mb-2">10. Aceptación de Términos</h3>
              <p className="text-gray-700">
                La participación en el sorteo implica la aceptación de estos términos y condiciones.
              </p>
            </div>

            {/* Sección 11 */}
            <div>
              <h3 className="font-semibold text-base mb-2">11. Pagos con transferencia</h3>
              <p className="text-gray-700">
                El participante  despues de  realizar el pago tendra que enviar los datos de pago o la captura  al número de WhatsApp de EventosIB.com una vez realizado el pedido, de no hacerlo su pedido no será procesado.
              </p>
            </div>
          </div>
          <div className="flex justify-center pt-4 border-t">
            <Button
              onClick={() => setOpen(false)}
              className="bg-blue-700 hover:bg-blue-600 text-white px-8"
            >
              Entendido
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};