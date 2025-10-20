import { Link } from "react-router"

interface Props{
    subtitle?:string
}

export const CustomLogo = ({ subtitle = 'IB' }:Props) => {
  return (
     <Link to='/' className="flex items-center whitespace-nowrap">
        <span className="font-montserrat font-bold text-3xl m-0 whitespace-nowrap text-teal-400">
            Eventos
        </span>
        <p className="font-montserrat font-bold text-3xl m-0 whitespace-nowrap text-teal-400">
            { subtitle }
        </p>
    </Link>
       
  )
}