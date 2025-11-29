// src/types/carrito.ts

export interface DatosCliente {
  tipoDocumento: 'cedula' | 'ruc' | 'pasaporte'
  numeroDocumento: string
  nombres: string
  apellidos: string
  email: string
  confirmarEmail: string
  telefono: string
  direccion: string
  pais: string
  ciudad: string
  provincia: string
}

export const PROVINCIAS_ECUADOR = [
  'Azuay',
  'Bolívar',
  'Cañar',
  'Carchi',
  'Chimborazo',
  'Cotopaxi',
  'El Oro',
  'Esmeraldas',
  'Galápagos',
  'Guayas',
  'Imbabura',
  'Loja',
  'Los Ríos',
  'Manabí',
  'Morona Santiago',
  'Napo',
  'Orellana',
  'Pastaza',
  'Pichincha',
  'Santa Elena',
  'Santo Domingo de los Tsáchilas',
  'Sucumbíos',
  'Tungurahua',
  'Zamora Chinchipe'
] as const

export const TIPOS_DOCUMENTO = [
  { value: 'cedula', label: 'Cédula' },
  // { value: 'ruc', label: 'RUC' },
  { value: 'pasaporte', label: 'Pasaporte' }
] as const