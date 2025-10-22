import { Link } from "react-router"

interface Props{
    subtitle?:string
}

export const CustomLogo = ({ subtitle = 'IB.com' }:Props) => {
  return (
     <Link to='/' className="flex items-center whitespace-nowrap">
        <span className="font-montserrat font-bold text-2xl m-0 whitespace-nowrap text-yellow-400">
            Eventos
        </span>
        <p className="font-montserrat font-bold text-2xl m-0 whitespace-nowrap text-yellow-400">
            { subtitle }
        </p>
    </Link>
       
  )
}