import { Link } from "react-router"

interface Props {
    subtitle?: string
}
export const CustomLogo = ({ subtitle = 'IB' }: Props) => {
  return (
    <Link to='/' className="inline-block group w-fit">
        <div className="flex items-center gap-2">
            <div className="flex flex-col leading-none">
                <div className="flex items-baseline">
                    <span className="font-montserrat font-bold text-[25px] text-amber-400 transition-colors group-hover:text-yellow-300">
                        Eventos
                    </span>
                    <span className="font-montserrat font-bold text-[25px] text-amber-400 transition-colors group-hover:text-yellow-300">
                        {subtitle}
                    </span>
                </div>
                <span className="font-montserrat font-bold text-[20px] text-amber-400 text-right -mt-1 transition-colors group-hover:text-yellow-300">
                    .com
                </span>
            </div>
            <span className="text-3xl drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">🎄</span>
        </div>
    </Link>
  )
}