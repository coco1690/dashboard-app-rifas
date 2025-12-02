import { CustomLogo } from "@/components/custom/CustomLogo"
import { Facebook, Instagram, Send } from "lucide-react"


export const CustomFooter = () => {
  return (
    <footer className="border-t py-12 px-4 lg:px-8 mt-16 bg-gray-900">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>

            <CustomLogo />

            <p className="text-sm text-muted-foreground">
              Recuerda que el juego es para entretenimiento, disfrútalo con moderación.
              Se prohíbe la venta a menores de edad.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-white">Contactanos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:eventosib@yahoo.com" className="hover:text-foreground transition-colors">
                  eventosib@yahoo.com
                </a>
              </li>
              <li>
                <a href="tel:+593967032866" className="hover:text-foreground transition-colors">
                  (+593) 967032866
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  PQRS
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-white">Acerca de nosotros</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">¿Quiénes somos?</a></li>
              <li><a href="#" className="hover:text-foreground">Política de tratamiento de datos</a></li>
            </ul>
          </div>

             {/* Redes Sociales */}
            <div>
              <h5 className="font-medium mb-3 text-white text-sm">Síguenos</h5>
              <div className="flex gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/eventosibcom?igsh=NnI2ZmEzYzg3dGYx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1FdzZU7ZJM/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@tu-usuario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800 hover:bg-black transition-all duration-300 group"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/tu-canal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800 hover:bg-blue-500 transition-all duration-300 group"
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EventosIB.com Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
