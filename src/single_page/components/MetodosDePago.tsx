import { FloatingWhatsAppButton } from "@/components/custom/FloatingWhatsAppButton";

export const MetodosDePago = () => {
  const metodosPago = [
    // {
    //   nombre: "Bitcoin",
    //   logo: "../icons/bitcoin.svg",
    //   descripcion: "Pago con Bitcoin",
    //   color: "bg-orange-100 text-orange-600 border-orange-200"
    // },
    {
      nombre: "USDT",
      logo: "../icons/usdt.svg",
      descripcion: "Tether USDT",
      color: "bg-green-100 text-green-600 border-green-200"
    },
    {
      nombre: "Binance",
      logo: "../icons/binance.svg",
      descripcion: "Binance Pay",
    
    },
    {
      nombre: "PayPal",
      logo: "../icons/paypal.svg",
      descripcion: "Transferencia bancaria",
      // color: "bg-blue-100 text-blue-600 border-blue-200"
    }
  ];

  return (
    <section className="py-16 px-4 lg:px-8 bg-gray-100">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-light tracking-tight mb-6 text-gray-800">
            Métodos de Pago
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            En EventosIB.com tienes diferentes opciones físicas y digitales para pagar de la manera más fácil y segura.
          </p>         
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {metodosPago.map((metodo, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Logo/Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-2xl ${metodo.color}`}>
                <img src={metodo.logo} alt={metodo.nombre} />
              
              </div>
              
              {/* Method Name */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {metodo.nombre}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-600">
                {metodo.descripcion}
              </p>
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

        <FloatingWhatsAppButton/>
      </div>
    </section>
  )
}