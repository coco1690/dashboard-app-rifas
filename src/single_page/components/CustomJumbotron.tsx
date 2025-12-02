
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"
import { DialogTerminosyCondiciones } from "./DialogTerminosyCondiciones"

interface Props {
  title: string
  subTitle?: string
  images?: string[]
  onButtonClick?: () => void
  // buttonText?: string
  showImages?: boolean
  precio?: number
  estado?: string
  fechaSorteo?: string
  // loteria?: string
}

export const CustomJumbotron = ({
  title,
  subTitle,
  images = [],
  // onButtonClick,
  // buttonText = "Ver Más",
  showImages = true,
  precio,
  estado,
  // fechaSorteo,
  // loteria,
}: Props) => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  // Formatear fecha
  // const formatearFecha = (fecha: string) => {
  //   return new Date(fecha).toLocaleDateString('es-ES', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric'
  //   })
  // }

  return (
    <section className="bg-gray-900 text-white min-h-[600px] lg:min-h-[700px] flex items-center">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Contenido de texto - Lado derecho */}
          <div className="space-y-6 order-2 lg:order-2">

            {/* Badge de estado */}
            {estado && (
              <div className="inline-block bg-yellow-500 text-black text-xs font-bold px-4 py-2 rounded uppercase">
                {estado === 'finalizada' ? 'FINALIZADA' : estado}
              </div>
            )}

            {/* Título principal */}
            <h1 className="text-2xl md:text-2xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
            <h1 className="text-sm md:text-2xl lg:text-2xl leading-tight">
              {subTitle}
            </h1>

            {/* Información del sorteo */}
            {/* {loteria && (
              <div className="space-y-1">
                <p className="text-lg">
                  <span className="font-semibold">Juega el:</span> {formatearFecha(fechaSorteo)}
                </p>
                <p className="text-gray-300 text-lg ">Con la Lotería {loteria}</p>
              </div>
            )} */}

            {/* Precio */}
            {precio && (
              <div className="text-xs md:text-3xl font-bold">
                Precio: <span className="text-green-400">X ${precio.toLocaleString()} USD</span>
                <span className="text-sm text-gray-300 block mt-1">IVA incluido c/u</span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-7">
                {/* <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
                  onClick={onButtonClick}
                >
                  {buttonText}
                </Button> */}
                <DialogTerminosyCondiciones />
              </div>

              {/* Mensaje de estado */}
              {estado === 'finalizada' && (
                <div className="bg-gray-800 p-3 rounded text-center text-sm">
                  LA RIFA HA FINALIZADO Y YA NO ESTÁ DISPONIBLE PARA LA COMPRA
                </div>
              )}
            </div>
          </div>

          {/* Carrusel - Lado izquierdo */}
          <div className="order-1 lg:order-1">
            {showImages && images.length > 0 && (
              <div className="relative">
                <Carousel
                  plugins={[plugin.current]}
                  className="w-full"
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                  opts={{
                    align: "center",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full h-[430px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Premio ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg'
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                {/* Indicador de imagen */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                    1 / {images.length}
                  </div>
                )}
              </div>
            )}

            {/* Placeholder cuando no hay imágenes */}
            {showImages && (!images || images.length === 0) && (
              <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p>Sin imágenes disponibles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}