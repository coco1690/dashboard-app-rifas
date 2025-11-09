import React, { useState, useEffect } from 'react'
import { Label } from './label'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Badge } from './badge'
import { MessageCircle, AlertCircle } from 'lucide-react'
import { FlagIcon } from './FlagIcon'
import { 
  SOUTH_AMERICAN_COUNTRIES, 
  DEFAULT_COUNTRY, 
  getCountryByCode,
  validatePhoneNumber,
  formatFullPhoneNumber,
  type Country 
} from '@/lib/countries'

interface PhoneInputProps {
  value: string
  onChange: (fullNumber: string, country: Country) => void
  label?: string
  hideLabel?: boolean
  placeholder?: string
  required?: boolean
  disabled?: boolean
  showWhatsAppBadge?: boolean
  defaultCountryCode?: string
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label = 'Número de teléfono',
  hideLabel = false,
  placeholder = 'Ingrese número',
  required = false,
  disabled = false,
  showWhatsAppBadge = false,
  defaultCountryCode = 'co'
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    getCountryByCode(defaultCountryCode) || DEFAULT_COUNTRY
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    if (value && value.startsWith('+')) {
      const country = SOUTH_AMERICAN_COUNTRIES.find(c => value.startsWith(c.dial))
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(value.substring(country.dial.length))
      }
    }
  }, [])

  const handleCountryChange = (countryCode: string) => {
    const country = getCountryByCode(countryCode)
    if (country) {
      setSelectedCountry(country)
      if (phoneNumber) {
        const valid = validatePhoneNumber(phoneNumber, country)
        setIsValid(valid)
        if (valid) {
          onChange(formatFullPhoneNumber(phoneNumber, country), country)
        }
      }
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setPhoneNumber(value)
    
    const valid = validatePhoneNumber(value, selectedCountry)
    setIsValid(valid)
    
    if (value) {
      onChange(formatFullPhoneNumber(value, selectedCountry), selectedCountry)
    } else {
      onChange('', selectedCountry)
    }
  }

  return (
    <div className="space-y-2">
      {!hideLabel && ( // ← CONDICIONAL
        <Label htmlFor="phone-input">
          {label}
          {showWhatsAppBadge && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              <MessageCircle className="w-3 h-3 mr-1" />
              WhatsApp
            </Badge>
          )}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* ✅ DISEÑO RESPONSIVE */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Selector de país - Más compacto en móvil */}
        <Select
          value={selectedCountry.code}
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full sm:w-[105px] border-2 border-gray-200 focus:border-amber-500 h-10">
            <SelectValue>
              <div className="flex items-center gap-1.5">
                <FlagIcon countryCode={selectedCountry.code} size="sm" />
                <span className="text-sm sm:text-sm font-medium">{selectedCountry.dial}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SOUTH_AMERICAN_COUNTRIES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <FlagIcon countryCode={country.code} size="sm" />
                  <span className="text-sm sm:text-base">{country.name}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">{country.dial}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Input de número - Ocupa todo el espacio restante */}
        <div className="flex-1 relative">
          <Input
            id="phone-input"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`h-9 text-sm border-2 ${
              !isValid && phoneNumber 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-amber-500'
            } focus:ring-2 focus:ring-amber-200`}
          />
          {!isValid && phoneNumber && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
      </div>

      {/* Info y validación - Más compacto en móvil */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
        <p className="text-muted-foreground">
          {selectedCountry.dial} + {selectedCountry.minLength || 'X'} dígitos
        </p>
        {phoneNumber && (
          <p className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? '✓ Válido' : `✗ ${selectedCountry.minLength || selectedCountry.maxLength} dígitos`}
          </p>
        )}
      </div>
    </div>
  )
}