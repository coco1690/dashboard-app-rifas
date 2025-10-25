import { Link } from "react-router"

interface Props {
    subtitle?: string
}
export const CustomLogo = ({ subtitle = 'IB' }: Props) => {
  return (
    <Link to='/' className="inline-block group w-fit">
        <div className="flex flex-col leading-none">
            <div className="flex items-baseline">
                <span className="font-montserrat font-bold text-[25px] text-yellow-400 transition-colors group-hover:text-yellow-300">
                    Eventos
                </span>
                <span className="font-montserrat font-bold text-[25px] text-yellow-400 transition-colors group-hover:text-yellow-300">
                    {subtitle}
                </span>
            </div>
            <span className="font-montserrat font-bold text-[20px] text-yellow-400 text-right -mt-1 transition-colors group-hover:text-yellow-300">
                .com
            </span>
        </div>
    </Link>
  )
}