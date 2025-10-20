import type { LucideIcon } from "lucide-react"
import { Link } from "react-router"

interface Props {
    icon: LucideIcon,
    title?: string,
    to: string,
    variant?: 'default' | 'floating'
}

export const CreateButton = ({ icon: Icon, title, to, variant = 'default' }: Props) => {
    
    if (variant === 'floating') {
        return (
            <Link 
                to={to}
                className="fixed bottom-20 right-5 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 active:scale-95 no-underline"
                title={title}
            >
                <Icon size={24} strokeWidth={2.5} />
            </Link>
        )
    }

    return (
        <Link 
            to={to}
            className="inline-flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors no-underline w-auto"
        >
            <Icon size={20} />
            {title && <span className="font-medium">{title}</span>}
        </Link>
    )
}