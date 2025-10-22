import { CustomLogo } from "@/components/custom/CustomLogo"


export const CustomFooter = () => {
  return (
    <footer className="border-t py-12 px-4 lg:px-8 mt-16 bg-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <CustomLogo/>
              <p className="text-sm text-muted-foreground">
                El juego responsable es clave. Jugar sin límites puede generar adicción. 
                Recuerda que el juego es para entretenimiento, disfrútalo con moderación. 
                Se prohíbe la venta a menores de edad.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-white">Contactanos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">eventosib@yahoo.com</a></li>
                <li><a href="#" className="hover:text-foreground">(+593) 967032866</a></li>
                <li><a href="#" className="hover:text-foreground">PQRS</a></li>
                
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-white">Acerca de nosotros</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">¿Quiénes somos?</a></li>
                <li><a href="#" className="hover:text-foreground">Política de tratamiento de datos</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; { new Date().getFullYear() } EventosIB.com Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
  )
}
