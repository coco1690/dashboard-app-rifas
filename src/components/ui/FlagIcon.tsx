import React from 'react'
import { getTwemojiUrl } from '@/lib/countries'

interface FlagIconProps {
  countryCode: string
  alt?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'w-4 h-3',
  md: 'w-6 h-4',
  lg: 'w-8 h-6',
  xl: 'w-12 h-9'
}

export const FlagIcon: React.FC<FlagIconProps> = ({
  countryCode,
  alt,
  className = '',
  size = 'md'
}) => {
  const flagUrl = getTwemojiUrl(countryCode)
  
  return (
    <img
      src={flagUrl}
      alt={alt || `Bandera ${countryCode.toUpperCase()}`}
      className={`inline-block object-cover rounded-none ${sizeClasses[size]} ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback: mostrar emoji Unicode si falla la carga
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        const emoji = document.createElement('span')
        emoji.textContent = target.alt
        emoji.className = className
        target.parentNode?.replaceChild(emoji, target)
      }}
    />
  )
}