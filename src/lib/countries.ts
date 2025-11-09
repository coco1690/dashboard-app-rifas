export interface Country {
  code: string      // ISO code (co, ar, etc)
  name: string      // Nombre
  dial: string      // Código telefónico (+57)
  flag: string      // Emoji Unicode (backup)
  minLength?: number
  maxLength?: number
}

// 🎨 Función para obtener URL de Twemoji
export const getTwemojiUrl = (countryCode: string): string => {
  // Convertir código de país a codepoints Unicode
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => (127397 + char.charCodeAt(0)).toString(16))
    .join('-')
  
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codePoints}.svg`
}

// 🌎 PAÍSES DE SUDAMÉRICA
export const SOUTH_AMERICAN_COUNTRIES: Country[] = [
  {
    code: 'ar',
    name: 'Argentina',
    dial: '+54',
    flag: '🇦🇷',
    minLength: 10,
    maxLength: 11
  },
  {
    code: 'bo',
    name: 'Bolivia',
    dial: '+591',
    flag: '🇧🇴',
    minLength: 8,
    maxLength: 8
  },
  {
    code: 'br',
    name: 'Brasil',
    dial: '+55',
    flag: '🇧🇷',
    minLength: 10,
    maxLength: 11
  },
  {
    code: 'cl',
    name: 'Chile',
    dial: '+56',
    flag: '🇨🇱',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'co',
    name: 'Colombia',
    dial: '+57',
    flag: '🇨🇴',
    minLength: 10,
    maxLength: 10
  },
  {
    code: 'ec',
    name: 'Ecuador',
    dial: '+593',
    flag: '🇪🇨',
    minLength: 9,
    maxLength: 9
  },
  
  {
    code: 'py',
    name: 'Paraguay',
    dial: '+595',
    flag: '🇵🇾',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'pe',
    name: 'Perú',
    dial: '+51',
    flag: '🇵🇪',
    minLength: 9,
    maxLength: 9
  },
  {
    code: 'uy',
    name: 'Uruguay',
    dial: '+598',
    flag: '🇺🇾',
    minLength: 8,
    maxLength: 8
  },
  {
    code: 've',
    name: 'Venezuela',
    dial: '+58',
    flag: '🇻🇪',
    minLength: 10,
    maxLength: 10
  }
]

// País por defecto
export const DEFAULT_COUNTRY = SOUTH_AMERICAN_COUNTRIES.find(c => c.code === 'co')!

// Buscar país por código
export const getCountryByCode = (code: string): Country | undefined => {
  return SOUTH_AMERICAN_COUNTRIES.find(c => c.code === code)
}

// Buscar país por dial code
export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return SOUTH_AMERICAN_COUNTRIES.find(c => c.dial === dialCode)
}

// Validar número según país
export const validatePhoneNumber = (phone: string, country: Country): boolean => {
  const digitsOnly = phone.replace(/\D/g, '')
  
  if (country.minLength && digitsOnly.length < country.minLength) {
    return false
  }
  
  if (country.maxLength && digitsOnly.length > country.maxLength) {
    return false
  }
  
  return true
}

// Formatear número completo (con código de país)
export const formatFullPhoneNumber = (phone: string, country: Country): string => {
  const digitsOnly = phone.replace(/\D/g, '')
  return `${country.dial}${digitsOnly}`
}