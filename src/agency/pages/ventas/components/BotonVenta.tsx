import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, MessageCircle, Mail } from 'lucide-react'

interface BotonVentaProps {
  tipoVenta: 'email' | 'whatsapp'
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
      className="w-full"
      size="lg"
    >
      {loading ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Procesando Venta...
        </>
      ) : (
        <>
          {tipoVenta === 'whatsapp' ? (
            <MessageCircle className="h-4 w-4 mr-2" />
          ) : (
            <Mail className="h-4 w-4 mr-2" />
          )}
          Vender por {tipoVenta === 'whatsapp' ? 'WhatsApp' : 'Email'} - 
          {` ${cantidad} Boletos - $${total.toLocaleString()}`}
        </>
      )}
    </Button>
  )
}