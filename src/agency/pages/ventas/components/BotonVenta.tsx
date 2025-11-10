import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, MessageCircle, Mail, MessageSquare } from 'lucide-react'

interface BotonVentaProps {
  tipoVenta: 'email' | 'whatsapp' | 'sms'
  cantidad: number
  total: number
  loading: boolean
  disabled: boolean
  onClick: () => void
}

export const BotonVenta: React.FC<BotonVentaProps> = ({
  tipoVenta,
  cantidad,
  total,
  loading,
  disabled,
  onClick
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full ${
        tipoVenta === 'whatsapp' 
          ? 'bg-green-400 hover:bg-green-700' 
          : tipoVenta === 'sms' 
          ? 'bg-purple-400 hover:bg-purple-700' 
          : ''
      }`}
      size="lg"
    >
      {loading ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Procesando Venta...
        </>
      ) : (
        <>
          {tipoVenta === 'whatsapp' && <MessageCircle className="h-4 w-4 mr-2" />}
          {tipoVenta === 'sms' && <MessageSquare className="h-4 w-4 mr-2" />}
          {tipoVenta === 'email' && <Mail className="h-4 w-4 mr-2" />}
          Vender por {
            tipoVenta === 'whatsapp' 
              ? 'WhatsApp' 
              : tipoVenta === 'sms' 
              ? 'SMS' 
              : 'Email'
          } - 
          {` ${cantidad} Boletos - $${total.toLocaleString()}`}
        </>
      )}
    </Button>
  )
}
