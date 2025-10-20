interface Props {
    title: string;
    subtitle: string;
    emoji?: string;  // Opcional para el emoji
}

export const CustomTitle = ({title, subtitle, emoji}:Props) => {
  return (
     <div className="mb-8">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
            {emoji && <span className="mr-2">{emoji}</span>}
            {title} 
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
           {subtitle}
        </p>
    </div>
  )
}