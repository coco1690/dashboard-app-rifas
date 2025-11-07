import { useState } from "react";
import { FloatingWhatsAppButton } from "@/components/custom/FloatingWhatsAppButton";
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck } from "lucide-react";

type MetodoPago = {
  nombre: string;
  logo: string;
  descripcion: string;
  color?: string;
  direccion?: string;
  red?: string;
};

export const MetodosDePago = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const metodosPago: MetodoPago[] = [
    // {
    //   nombre: "USDT",
    //   logo: "../icons/usdt.svg",
    //   descripcion: "Tether USDT",
    //   color: "bg-green-100 text-green-600 border-green-200",
    //   direccion: "TPMSKeYptYToCkiJKQP97VMrAef48BS4FC",
    //   red: "TRX Tron (TRC20)"
    // },
    {
      nombre: "Binance",
      logo: "../icons/binance.svg",
      descripcion: "Binance Pay",
      color: "bg-yellow-100 text-yellow-600 border-yellow-200",
      direccion: "eventosib@yahoo.com",
      // red: "TRX Tron (TRC20)"
    },
    {
      nombre: "Transferencia Bancaria",
      logo: "../icons/bank-card.svg",
      descripcion: "Transferencia bancaria",
      color: "bg-blue-100 text-blue-600 border-blue-200"
    }
  ];

  const handleCopyAddress = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <section className="py-16 px-4 lg:px-8 bg-gray-100">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-6 text-gray-800 text-shadow-sm">
              Métodos de Pago
            </h1>
            <p className="text-sm text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              En EventosIB.com tienes diferentes opciones físicas y digitales para pagar de la manera más fácil y segura.
            </p>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {metodosPago.map((metodo, index) => (
              <div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                {/* Logo/Icon */}
                <div className={`inline-flex items-center justify-center mb-3 sm:mb-4`}>
                  <img src={metodo.logo} alt={metodo.nombre} className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                </div>

                {/* Method Name */}
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">
                  {metodo.nombre}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  {metodo.descripcion} {metodo.red ? `- ${metodo.red}` : ""}
                </p>

                {/* Address Section */}
                {metodo.direccion ? (
                  <div className="space-y-2 sm:space-y-3">
                 
                    {/* Address with Copy Button */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3">
                      <p className="text-[9px] sm:text-xs text-gray-500 mb-1 sm:mb-2 font-medium">
                        Dirección de depósito:
                      </p>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="flex-1 bg-white border border-gray-300 rounded px-2 py-1.5 sm:px-2 sm:py-2">
                          <p className="font-mono text-[9px] sm:text-[10px] break-all text-gray-800">
                            {metodo.direccion}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyAddress(metodo.direccion!, index)}
                          className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                        >
                          {copiedIndex === index ? (
                            <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                        </Button>
                      </div>
                      {copiedIndex === index && (
                        <p className="text-[9px] sm:text-xs text-green-600 mt-1 sm:mt-2 flex items-center justify-center gap-1">
                          <CheckCheck className="h-3 w-3" />
                          ¡Copiado!
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <p className="text-[10px] sm:text-xs text-gray-700">
                      Contáctanos por WhatsApp para recibir el enlace de pago
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br rounded-full mb-4">
                  <span className="text-white text-xl">
                    <img src="../icons/check.svg" alt="" />
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Pago Seguro y Confiable
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Todos nuestros métodos de pago están verificados y son 100% seguros.
                  Una vez realizado el pago, recibirás la confirmación de tu boleto por WhatsApp y correo electrónico el cual tienes registrado.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Confirmación inmediata
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Soporte 24/7
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Transacciones seguras
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FloatingWhatsAppButton />
        </div>
      </section>
    </>
  );
};