import type { LucideIcon } from "lucide-react"
import { Link } from "react-router"

interface Props {
    icon: LucideIcon,
    title: string,
    to: string
}

export const CreateButton = ({ icon: Icon, title, to }: Props) => {
    return (
        <Link 
            to={to}
            className="inline-flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors no-underline w-auto"
        >
            <Icon size={20} />
            <span>{title}</span>
        </Link>
    )
}