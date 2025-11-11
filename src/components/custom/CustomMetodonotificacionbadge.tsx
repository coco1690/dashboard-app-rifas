import React from 'react'
import { Mail, MessageCircle, MessageSquare } from 'lucide-react'

interface MetodoNotificacionProps {
  enviado_email?: boolean
  enviado_whatsapp?: boolean
  enviado_sms?: boolean
}

export const CustomMetodoNotificacionBadge: React.FC<MetodoNotificacionProps> = ({
  enviado_email,// Default true
  enviado_whatsapp, 
  enviado_sms 
}) => {
  // Prioridad: WhatsApp > SMS > Email (default)
  if (enviado_whatsapp) {
    return (
     
        <MessageCircle className="h-4 w-4" />
      
    )
  }

  if (enviado_sms) {
    return (
    
        <MessageSquare className="h-4 w-4" />
       
    )
  }

    if (enviado_email) {
    return (
    
        <Mail className="h-4 w-4" />
       
    )
  }

  // Default: Email
  return (
    
      <Mail className="h-4 w-4" />
  
  )
}