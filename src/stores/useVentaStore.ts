// import { create } from 'zustand'
// import { supabase } from '@/supabase/client'
// import { useEmailStore } from './useEmailStore'
// import { toast } from 'sonner'

// // Tipos específicos para mejor type safety
// type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'otro'
// type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'

// // Paquetes predefinidos permitidos
// const PAQUETES_PERMITIDOS = [10, 12, 15, 20, 50, 100] as const
// const MINIMO_PERSONALIZADO = 101

// interface VentaData {
//   documento_identidad: string
//   agenciaId: string
//   rifaId: string
//   boletos: string[]
//   totalPago: number
//   metodoPago: MetodoPago
//   estadoPago?: EstadoPago
//   referencia?: string
//   comprobanteUrl?: string
//   enviarEmail?: boolean
// }

// interface OrdenBoleto {
//   id: string
//   cliente_id: string
//   agencia_id: string
//   rifa_id: string
//   cantidad_boletos: number
//   total_pago: number
//   estado_pago: EstadoPago
//   created_at: string
// }

// // interface TransaccionVenta {
// //   orden_id: string
// //   boleto_id: string
// //   cliente_id: string
// //   agencia_id: string
// //   precio: number
// //   metodo_pago: MetodoPago
// //   estado_pago: EstadoPago
// //   referencia_pago?: string | null
// //   comprobante_url?: string | null
// // }

// interface VentaStore {
//   // Estados
//   loading: boolean
//   error: string | null
//   mensaje: string | null
//   ultimaVenta: OrdenBoleto | null
//   emailEnviado: boolean
//   errorEmail: string | null

//   // Acciones
//   venderBoletos: (data: VentaData) => Promise<OrdenBoleto | null>
//   limpiarMensajes: () => void
//   resetearEstado: () => void

//   // Funciones auxiliares
//   verificarDisponibilidadBoletos: (boletos: string[]) => Promise<boolean>
//   obtenerHistorialVentas: (agenciaId: string) => Promise<OrdenBoleto[]>
//   validarCantidadPaquete: (cantidad: number) => { valido: boolean; mensaje: string }
//   obtenerPaquetesPermitidos: () => typeof PAQUETES_PERMITIDOS
//   obtenerMinimoPersonalizado: () => number
//   obtenerPrecioBoleta: (rifaId: string) => Promise<number | null>
//   calcularTotal: (cantidadBoletos: number, precioBoleta: number) => number

//   // Verificar si el email del cliente es válido
//   verificarEmailCliente: (documento: string) => Promise<{ valido: boolean; email?: string }>
// }

// export const useVentaStore = create<VentaStore>((set, get) => ({
//   // Estados iniciales
//   loading: false,
//   error: null,
//   mensaje: null,
//   ultimaVenta: null,
//   emailEnviado: false,
//   errorEmail: null,

//   verificarEmailCliente: async (documento: string): Promise<{ valido: boolean; email?: string }> => {
//     try {
//       const { data: cliente, error } = await supabase
//         .from('users')
//         .select('email')
//         .eq('documento_identidad', documento)
//         .single()

//       if (error || !cliente) {
//         return { valido: false }
//       }

//       if (!cliente.email || cliente.email.trim() === '') {
//         return { valido: false }
//       }

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//       if (!emailRegex.test(cliente.email)) {
//         return { valido: false }
//       }

//       return {
//         valido: true,
//         email: cliente.email
//       }
//     } catch (error) {
//       console.error('Error verificando email del cliente:', error)
//       return { valido: false }
//     }
//   },

//   // Validar cantidad de boletos según paquetes permitidos
//   validarCantidadPaquete: (cantidad: number) => {
//     // Verificar si es un paquete predefinido
//     if (PAQUETES_PERMITIDOS.includes(cantidad as any)) {
//       return {
//         valido: true,
//         mensaje: `Paquete válido de ${cantidad} boletos`
//       }
//     }

//     // Verificar si es una cantidad personalizada válida (≥11)
//     if (cantidad >= MINIMO_PERSONALIZADO) {
//       return {
//         valido: true,
//         mensaje: `Paquete personalizado válido de ${cantidad} boletos`
//       }
//     }

//     // Cantidad no válida
//     const paquetesTexto = PAQUETES_PERMITIDOS.join(', ')
//     return {
//       valido: false,
//       mensaje: `Cantidad no válida. Solo se permiten paquetes de: ${paquetesTexto} boletos, o ${MINIMO_PERSONALIZADO}+ boletos para paquetes personalizados`
//     }
//   },

//   // Obtener paquetes permitidos
//   obtenerPaquetesPermitidos: () => PAQUETES_PERMITIDOS,

//   // Obtener precio de boleta desde la rifa
//   obtenerPrecioBoleta: async (rifaId: string): Promise<number | null> => {
//     try {
//       const { data, error } = await supabase
//         .from('rifas')
//         .select('precio_boleta')
//         .eq('id', rifaId)
//         .single()

//       if (error || !data) {
//         console.error('Error obteniendo precio de boleta:', error)
//         toast.error('Error al cargar precio de la boleta')
//         return null
//       }

//       return data.precio_boleta
//     } catch (error) {
//       console.error('Error en obtenerPrecioBoleta:', error)
//       toast.error('Error al obtener precio de la boleta')
//       return null
//     }
//   },

//   // Obtener mínimo para paquete personalizado
//   obtenerMinimoPersonalizado: () => MINIMO_PERSONALIZADO,

//   // Calcular total basado en cantidad y precio por boleta
//   calcularTotal: (cantidadBoletos: number, precioBoleta: number): number => {
//     return cantidadBoletos * precioBoleta
//   },

//   venderBoletos: async (data: VentaData): Promise<OrdenBoleto | null> => {
//     const {
//       documento_identidad: cedula,
//       agenciaId,
//       rifaId,
//       boletos,
//       totalPago,
//       metodoPago,
//       estadoPago = 'pagado', // Valor por defecto
//       // referencia,
//       // comprobanteUrl,
//       enviarEmail = true
//     } = data

//     set({
//       loading: true,
//       error: null,
//       mensaje: null,
//       emailEnviado: false,
//       errorEmail: null
//     })

//     // Toast de inicio del proceso
//     const loadingToast = toast.loading('Procesando venta...', {
//       description: `Vendiendo ${boletos.length} boleto${boletos.length > 1 ? 's' : ''}`
//     })

//     try {
//       // Validaciones previas básicas
//       if (boletos.length === 0) {
//         throw new Error('Debe seleccionar al menos un boleto')
//       }

//       // Validación específica de paquetes
//       const validacionPaquete = get().validarCantidadPaquete(boletos.length)
//       if (!validacionPaquete.valido) {
//         throw new Error(validacionPaquete.mensaje)
//       }

//       // Obtener precio de boleta desde la rifa
//       const precioBoleta = await get().obtenerPrecioBoleta(rifaId)
//       if (precioBoleta === null) {
//         throw new Error('No se pudo obtener el precio de la boleta')
//       }

//       // Calcular total esperado
//       const totalEsperado = get().calcularTotal(boletos.length, precioBoleta)

//       // Validar que el total pagado coincida con el esperado
//       if (Math.abs(totalPago - totalEsperado) > 0.01) { // Tolerancia de 1 centavo por redondeo
//         throw new Error(`El total debe ser ${totalEsperado.toLocaleString()}. Total recibido: ${totalPago.toLocaleString()}`)
//       }

//       // validación: verificar email del cliente si se requiere envío
//       let emailValido = false
//       let emailCliente = ''

//       if (enviarEmail) {
//         const validacionEmail = await get().verificarEmailCliente(cedula)
//         emailValido = validacionEmail.valido
//         emailCliente = validacionEmail.email || ''

//         if (!emailValido) {
//           toast.warning('Email no disponible', {
//             description: 'La venta se procesará pero no se enviará confirmación por email',
//             duration: 4000
//           })
//         }
//       }

//       // 1. Verificar disponibilidad de boletos
//       const disponibles = await get().verificarDisponibilidadBoletos(boletos)
//       if (!disponibles) {
//         throw new Error('Algunos boletos ya no están disponibles')
//       }

//       // 2. Buscar cliente por cédula en la tabla users
//       const { data: cliente, error: clienteError } = await supabase
//         .from('users')
//         .select('id')
//         .eq('documento_identidad', cedula)
//         .single()

//       if (clienteError || !cliente) {
//         throw new Error(`Cliente con cédula ${cedula} no encontrado`)
//       }

//       const clienteId = cliente.id

//       // 3. Crear orden de boletos con el estado de pago
//       const { data: orden, error: ordenError } = await supabase
//         .from('ordenes_boletos')
//         .insert({
//           cliente_id: clienteId,
//           agencia_id: agenciaId,
//           rifa_id: rifaId,
//           cantidad_boletos: boletos.length,
//           total_pago: totalEsperado,
//           estado_pago: estadoPago, // Usar el estado de pago proporcionado
//           metodo_pago: metodoPago,
//         })
//         .select()
//         .single()

//       if (ordenError || !orden) {
//         throw new Error('Error al crear la orden de venta')
//       }

//       // 4. Crear transacciones para cada boleto
//       // const transacciones: TransaccionVenta[] = boletos.map((boletoId) => ({
//       //   orden_id: orden.id,
//       //   boleto_id: boletoId,
//       //   cliente_id: clienteId,
//       //   agencia_id: agenciaId,
//       //   precio: precioBoleta,
//       //   metodo_pago: metodoPago,
//       //   estado_pago: estadoPago, // Usar el estado de pago proporcionado
//       //   referencia_pago: referencia || null,
//       //   comprobante_url: comprobanteUrl || null,
//       // }))

//       // const { error: transError } = await supabase
//       //   .from('transacciones_venta')
//       //   .insert(transacciones)

//       // if (transError) {
//       //   // Rollback: eliminar la orden creada
//       //   await supabase.from('ordenes_boletos').delete().eq('id', orden.id)
//       //   throw new Error('Error al procesar las transacciones')
//       // }

//       // 5. Marcar boletos como vendidos
//       const { error: updateError } = await supabase
//         .from('boletos')
//         .update({
//           vendido: true,
//           vendido_a: clienteId,
//           vendido_por: agenciaId,
//           orden_id: orden.id,
//           fecha_venta: new Date().toISOString(),
//         })
//         .in('id', boletos)

//       if (updateError) {
//         // Rollback: eliminar transacciones y orden
//         // await supabase.from('transacciones_venta').delete().eq('orden_id', orden.id)
//         await supabase.from('ordenes_boletos').delete().eq('id', orden.id)
//         throw new Error('Error al actualizar los boletos')
//       }

//       //  enviar email de confirmación
//       let emailEnviadoExitoso = false
//       //TODO: mejorar esta lógica para manejar diferentes estados de pago

//       if (enviarEmail && emailValido && estadoPago === 'pagado') {
//         try {
//           // Pequeña pausa para asegurar que la orden esté completamente guardada
//           await new Promise(resolve => setTimeout(resolve, 1000))

//           const emailStore = useEmailStore.getState()
//           emailEnviadoExitoso = await emailStore.enviarConfirmacionCompra(orden.id)

//           if (!emailEnviadoExitoso) {
//             // ROLLBACK: Deshacer toda la venta si falla el email
//             console.log('Email falló, haciendo rollback de la venta...')

//             // 1. Restaurar boletos
//             await supabase.from('boletos').update({
//               vendido: false,
//               vendido_a: null,
//               vendido_por: null,
//               orden_id: null,
//               fecha_venta: null
//             }).in('id', boletos)

//             // 2. Eliminar transacciones
//             // await supabase.from('transacciones_venta').delete().eq('orden_id', orden.id)

//             // 3. Eliminar orden
//             await supabase.from('ordenes_boletos').delete().eq('id', orden.id)

//             throw new Error('Error al enviar confirmación por email. Venta cancelada por política de empresa.')
//           }

//           // Si llegamos aquí, el email se envió exitosamente
//           set({ emailEnviado: true })

//         } catch (emailError: any) {
//           console.error('Error enviando email de confirmación:', emailError)
//           set({ errorEmail: emailError.message || 'Error al enviar email' })

//           // toast.warning('Venta exitosa, email no enviado', {
//           //   description: 'La venta se completó pero hubo un error al enviar la confirmación',
//           //   duration: 4000
//           // })

//           // Si es un error de rollback, ya se hizo el cleanup arriba
//           if (!emailError.message.includes('Venta cancelada')) {
//             // ROLLBACK para otros errores de email
//             console.log('Error de email, haciendo rollback...')

//             await supabase.from('boletos').update({
//               vendido: false,
//               vendido_a: null,
//               vendido_por: null,
//               orden_id: null,
//               fecha_venta: null
//             }).in('id', boletos)

//             // await supabase.from('transacciones_venta').delete().eq('orden_id', orden.id)
//             await supabase.from('ordenes_boletos').delete().eq('id', orden.id)
//           }

//           // Lanzar error para que se maneje en el catch principal
//           throw new Error(`Error crítico en envío de email: ${emailError.message}`)
//         }
//       }

//       // if (enviarEmail && emailValido && estadoPago === 'pagado') {
//       //   try {
//       //     // Pequeña pausa para asegurar que la orden esté completamente guardada
//       //     await new Promise(resolve => setTimeout(resolve, 1000))

//       //     const emailStore = useEmailStore.getState()
//       //     emailEnviadoExitoso = await emailStore.enviarConfirmacionCompra(orden.id)

//       //     if (emailEnviadoExitoso) {
//       //       set({ emailEnviado: true })
//       //     } else {
//       //       set({ errorEmail: 'Error al enviar confirmación por email' })
//       //     }
//       //   } catch (emailError: any) {
//       //     console.error('Error enviando email de confirmación:', emailError)
//       //     set({ errorEmail: emailError.message || 'Error al enviar email' })

//       //     toast.warning('Venta exitosa, email no enviado', {
//       //       description: 'La venta se completó pero hubo un error al enviar la confirmación',
//       //       duration: 4000
//       //     })
//       //   }
//       // }

//       // Mensaje de éxito mejorado
      
      
//       const tipoPaquete = PAQUETES_PERMITIDOS.includes(boletos.length as any)
//         ? `paquete de ${boletos.length}`
//         : `paquete personalizado de ${boletos.length}`

//       const estadoTexto = estadoPago === 'pagado' ? 'vendido' : `marcado como ${estadoPago}`

//       let mensajeExito = `Venta realizada exitosamente: ${tipoPaquete} boleto${boletos.length > 1 ? 's' : ''} ${estadoTexto}${boletos.length > 1 ? 's' : ''} por $${totalEsperado.toLocaleString()}`

//       // Agregar información sobre el email
//       if (enviarEmail && emailValido) {
//         if (emailEnviadoExitoso) {
//           mensajeExito += ` ✉️ Confirmación enviada a ${emailCliente}`
//         } else {
//           mensajeExito += ` ⚠️ Email no enviado`
//         }
//       } else if (enviarEmail && !emailValido) {
//         mensajeExito += ` ⚠️ Cliente sin email válido`
//       }

//       toast.success('¡Venta exitosa!', {
//         description: mensajeExito,
//         duration: 6000,
//         action: {
//           label: 'Ver detalles',
//           onClick: () => console.log('Ver detalles de la orden:', orden.id)
//         }
//       })

//       toast.dismiss(loadingToast)

//       set({
//         mensaje: mensajeExito,
//         ultimaVenta: orden,
//         loading: false
//       })

//       return orden

//     } catch (err: any) {
//       const errorMessage = err.message || 'Error desconocido en la venta'
//       console.error('Error en venta de boletos:', err)

//       toast.error('Error en la venta', {
//         description: errorMessage,
//         duration: 5000
//       })

//       toast.dismiss(loadingToast)

//       set({
//         error: errorMessage,
//         loading: false
//       })

//       return null
//     }
//   },

//   // Verificar que los boletos estén disponibles
//   verificarDisponibilidadBoletos: async (boletosIds: string[]): Promise<boolean> => {
//     try {
//       const { data: boletos, error } = await supabase
//         .from('boletos')
//         .select('id, vendido')
//         .in('id', boletosIds)

//       if (error) throw error

//       // Verificar que todos los boletos existan y estén disponibles
//       if (boletos.length !== boletosIds.length) {
//         return false
//       }

//       return boletos.every(boleto => !boleto.vendido)
//     } catch (error) {
//       console.error('Error verificando disponibilidad:', error)
//       toast.error('Error al verificar disponibilidad de boletos')
//       return false
//     }
//   },

//   // Obtener historial de ventas de una agencia
//   obtenerHistorialVentas: async (agenciaId: string): Promise<OrdenBoleto[]> => {
//     try {
//       const { data, error } = await supabase
//         .from('ordenes_boletos')
//         .select('*')
//         .eq('agencia_id', agenciaId)
//         .order('created_at', { ascending: false })

//       if (error) throw error
//       return data || []
//     } catch (error) {
//       console.error('Error obteniendo historial:', error)
//       toast.error('Error al obtener historial de ventas')
//       return []
//     }
//   },

//   // Limpiar mensajes de éxito/error
//   limpiarMensajes: () => {
//     set({
//       error: null,
//       mensaje: null,
//       errorEmail: null
//     })
//   },

//   // Resetear todo el estado
//   resetearEstado: () => {
//     set({
//       loading: false,
//       error: null,
//       mensaje: null,
//       ultimaVenta: null,
//       emailEnviado: false,
//       errorEmail: null
//     })
//   }
// }))


// //  EXPORTAR hook adicional para facilitar uso en componentes

// export const useVentaActions = () => {
//   const {
//     venderBoletos,
//     loading,
//     error,
//     mensaje,
//     emailEnviado,
//     errorEmail,
//     ultimaVenta
//   } = useVentaStore()

//   return {
//     venderBoletos,
//     loading,
//     error,
//     mensaje,
//     emailEnviado,
//     errorEmail,
//     ultimaVenta
//   }
// }



import { create } from 'zustand'
import { supabase } from '@/supabase/client'
import { useEmailStore } from './useEmailStore'
import { toast } from 'sonner'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'otro'
type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado'

interface VentaData {
  documento_identidad: string
  agenciaId: string
  rifaId: string
  boletos: string[]
  totalPago: number
  metodoPago: MetodoPago
  estadoPago?: EstadoPago
  referencia?: string
  comprobanteUrl?: string
  enviarEmail?: boolean
}

interface OrdenBoleto {
  id: string
  cliente_id: string
  agencia_id: string
  rifa_id: string
  cantidad_boletos: number
  total_pago: number
  estado_pago: EstadoPago
  created_at: string
}

interface VentaStore {
  // Estados
  loading: boolean
  error: string | null
  mensaje: string | null
  ultimaVenta: OrdenBoleto | null
  emailEnviado: boolean
  errorEmail: string | null

  // Acciones
  venderBoletos: (data: VentaData) => Promise<OrdenBoleto | null>
  limpiarMensajes: () => void
  resetearEstado: () => void

  // Funciones auxiliares
  verificarDisponibilidadBoletos: (boletos: string[]) => Promise<boolean>
  obtenerHistorialVentas: (agenciaId: string) => Promise<OrdenBoleto[]>
  obtenerPrecioBoleta: (rifaId: string) => Promise<number | null>
  calcularTotal: (cantidadBoletos: number, precioBoleta: number) => number
  verificarEmailCliente: (documento: string) => Promise<{ valido: boolean; email?: string }>
}

// ============================================================================
// CONFIGURACIÓN DE PAQUETES POR DÍGITOS
// ============================================================================

interface PaqueteConfig {
  paquetes: number[]
  minimo: number
}

const PAQUETES_CONFIG: Record<number, PaqueteConfig> = {
  3: { paquetes: [3, 4, 5, 10, 15, 20], minimo: 0 },
  4: { paquetes: [10, 12, 15, 20, 50, 100], minimo: 0 },
  5: { paquetes: [10, 20, 30, 40, 100, 200], minimo: 0 }
}

const DEFAULT_CONFIG: PaqueteConfig = {
  paquetes: [10, 12, 15, 20, 50, 100],
  minimo: 0
}

// ============================================================================
// FUNCIONES AUXILIARES EXPORTADAS
// ============================================================================

/**
 * Obtiene los paquetes permitidos según la cantidad de dígitos
 * @param digitos - Cantidad de dígitos de la rifa
 * @returns Array con los paquetes permitidos
 */
export const getPaquetesPorDigitos = (digitos: number): number[] => {
  const config = PAQUETES_CONFIG[digitos] || DEFAULT_CONFIG
  return config.paquetes
}

/**
 * Obtiene el mínimo personalizado según la cantidad de dígitos
 * @param digitos - Cantidad de dígitos de la rifa
 * @returns Número mínimo para paquetes personalizados
 */
export const getMinimoPorDigitos = (digitos: number): number => {
  const config = PAQUETES_CONFIG[digitos] || DEFAULT_CONFIG
  return config.minimo
}

/**
 * Obtiene la cantidad de dígitos de una rifa desde la base de datos
 * @param rifaId - ID de la rifa
 * @returns Cantidad de dígitos de la rifa
 */
export const obtenerDigitosRifa = async (rifaId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('rifas')
      .select('digitos')
      .eq('id', rifaId)
      .single()

    if (error) {
      console.error('Error obteniendo dígitos de la rifa:', error)
      return 4 // Fallback
    }

    if (!data) {
      console.warn('No se encontraron datos de la rifa, usando 4 dígitos por defecto')
      return 4
    }

    return data.digitos || 4
  } catch (error) {
    console.error('Error en obtenerDigitosRifa:', error)
    return 4 // Fallback
  }
}

/**
 * Valida la cantidad de boletos según el tipo de selección
 * @param cantidad - Cantidad de boletos a validar
 * @param paquetesPermitidos - Array de paquetes permitidos
 * @param minimoPersonalizado - Mínimo para paquete personalizado
 * @param tipoSeleccion - Tipo de selección (paquete o personalizado)
 * @returns Objeto con validación y mensaje
 */
export const validarCantidad = (
  cantidad: number,
  paquetesPermitidos: number[],
  minimoPersonalizado: number,
  tipoSeleccion: 'paquete' | 'personalizado'
): { valido: boolean; mensaje: string } => {
  if (cantidad <= 0) {
    return {
      valido: false,
      mensaje: 'La cantidad debe ser mayor a 0'
    }
  }

  if (tipoSeleccion === 'paquete') {
    if (!paquetesPermitidos.includes(cantidad)) {
      return {
        valido: false,
        mensaje: 'Seleccione un paquete válido'
      }
    }
  } else {
    if (cantidad < minimoPersonalizado) {
      return {
        valido: false,
        mensaje: `La cantidad mínima para paquetes personalizados es ${minimoPersonalizado}`
      }
    }
  }

  return { valido: true, mensaje: '' }
}

// ============================================================================
// STORE
// ============================================================================

export const useVentaStore = create<VentaStore>((set, get) => ({
  // ============================================================================
  // ESTADO INICIAL
  // ============================================================================
  loading: false,
  error: null,
  mensaje: null,
  ultimaVenta: null,
  emailEnviado: false,
  errorEmail: null,

  // ============================================================================
  // ACCIONES
  // ============================================================================

  /**
   * Verifica si el cliente tiene un email válido
   */
  verificarEmailCliente: async (documento: string): Promise<{ valido: boolean; email?: string }> => {
    try {
      const { data: cliente, error } = await supabase
        .from('users')
        .select('email')
        .eq('documento_identidad', documento)
        .single()

      if (error || !cliente) {
        return { valido: false }
      }

      if (!cliente.email || cliente.email.trim() === '') {
        return { valido: false }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cliente.email)) {
        return { valido: false }
      }

      return {
        valido: true,
        email: cliente.email
      }
    } catch (error) {
      console.error('Error verificando email del cliente:', error)
      return { valido: false }
    }
  },

  /**
   * Obtiene el precio de una boleta desde la base de datos
   */
  obtenerPrecioBoleta: async (rifaId: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('rifas')
        .select('precio_boleta')
        .eq('id', rifaId)
        .single()

      if (error || !data) {
        console.error('Error obteniendo precio de boleta:', error)
        toast.error('Error al cargar precio de la boleta')
        return null
      }

      return data.precio_boleta
    } catch (error) {
      console.error('Error en obtenerPrecioBoleta:', error)
      toast.error('Error al obtener precio de la boleta')
      return null
    }
  },

  /**
   * Calcula el total de una venta
   */
  calcularTotal: (cantidadBoletos: number, precioBoleta: number): number => {
    return cantidadBoletos * precioBoleta
  },

  /**
   * Procesa la venta de boletos
   */
  venderBoletos: async (data: VentaData): Promise<OrdenBoleto | null> => {
    const {
      documento_identidad: cedula,
      agenciaId,
      rifaId,
      boletos,
      totalPago,
      metodoPago,
      estadoPago = 'pagado',
      enviarEmail = true
    } = data

    set({
      loading: true,
      error: null,
      mensaje: null,
      emailEnviado: false,
      errorEmail: null
    })

    const loadingToast = toast.loading('Procesando venta...', {
      description: `Vendiendo ${boletos.length} boleto${boletos.length > 1 ? 's' : ''}`
    })

    try {
      // Validaciones previas básicas
      if (boletos.length === 0) {
        throw new Error('Debe seleccionar al menos un boleto')
      }

      // Obtener precio de boleta desde la rifa
      const precioBoleta = await get().obtenerPrecioBoleta(rifaId)
      if (precioBoleta === null) {
        throw new Error('No se pudo obtener el precio de la boleta')
      }

      // Calcular total esperado
      const totalEsperado = get().calcularTotal(boletos.length, precioBoleta)

      // Validar que el total pagado coincida con el esperado
      if (Math.abs(totalPago - totalEsperado) > 0.01) {
        throw new Error(`El total debe ser $${totalEsperado.toLocaleString()}. Total recibido: $${totalPago.toLocaleString()}`)
      }

      // Validación: verificar email del cliente si se requiere envío
      let emailValido = false
      let emailCliente = ''

      if (enviarEmail) {
        const validacionEmail = await get().verificarEmailCliente(cedula)
        emailValido = validacionEmail.valido
        emailCliente = validacionEmail.email || ''

        if (!emailValido) {
          toast.warning('Email no disponible', {
            description: 'La venta se procesará pero no se enviará confirmación por email',
            duration: 4000
          })
        }
      }

      // 1. Verificar disponibilidad de boletos
      const disponibles = await get().verificarDisponibilidadBoletos(boletos)
      if (!disponibles) {
        throw new Error('Algunos boletos ya no están disponibles')
      }

      // 2. Buscar cliente por cédula en la tabla users
      const { data: cliente, error: clienteError } = await supabase
        .from('users')
        .select('id')
        .eq('documento_identidad', cedula)
        .single()

      if (clienteError || !cliente) {
        throw new Error('Cliente no encontrado. Debe registrarse primero.')
      }

      // 3. Crear la orden de compra
      const { data: orden, error: ordenError } = await supabase
        .from('ordenes_boletos')
        .insert([{
          cliente_id: cliente.id,
          agencia_id: agenciaId,
          rifa_id: rifaId,
          cantidad_boletos: boletos.length,
          total_pago: totalEsperado,
          estado_pago: estadoPago,
          metodo_pago: metodoPago
        }])
        .select()
        .single()

      if (ordenError || !orden) {
        throw new Error('Error al crear la orden de compra')
      }

      // 4. Actualizar los boletos como vendidos
      const { error: updateError } = await supabase
        .from('boletos')
        .update({
          vendido: true,
          vendido_a: cliente.id,
          vendido_por: agenciaId,
          orden_id: orden.id,
          fecha_venta: new Date().toISOString(),
        })
        .in('id', boletos)

      if (updateError) {
        // Rollback: eliminar orden
        await supabase.from('ordenes_boletos').delete().eq('id', orden.id)
        throw new Error('Error al actualizar los boletos')
      }

      // 5. Enviar email de confirmación
      let emailEnviadoExitoso = false

      if (enviarEmail && emailValido && estadoPago === 'pagado') {
        try {
          // Pequeña pausa para asegurar que la orden esté completamente guardada
          await new Promise(resolve => setTimeout(resolve, 1000))

          const emailStore = useEmailStore.getState()
          emailEnviadoExitoso = await emailStore.enviarConfirmacionCompra(orden.id)

          if (!emailEnviadoExitoso) {
            // ROLLBACK: Deshacer toda la venta si falla el email
            console.log('Email falló, haciendo rollback de la venta...')

            // Restaurar boletos
            await supabase.from('boletos').update({
              vendido: false,
              vendido_a: null,
              vendido_por: null,
              orden_id: null,
              fecha_venta: null
            }).in('id', boletos)

            // Eliminar orden
            await supabase.from('ordenes_boletos').delete().eq('id', orden.id)

            throw new Error('Error al enviar confirmación por email. Venta cancelada por política de empresa.')
          }

          // Si llegamos aquí, el email se envió exitosamente
          set({ emailEnviado: true })

        } catch (emailError: any) {
          console.error('Error enviando email de confirmación:', emailError)
          set({ errorEmail: emailError.message || 'Error al enviar email' })

          // Si es un error de rollback, ya se hizo el cleanup arriba
          if (!emailError.message.includes('Venta cancelada')) {
            // ROLLBACK para otros errores de email
            console.log('Error de email, haciendo rollback...')

            await supabase.from('boletos').update({
              vendido: false,
              vendido_a: null,
              vendido_por: null,
              orden_id: null,
              fecha_venta: null
            }).in('id', boletos)

            await supabase.from('ordenes_boletos').delete().eq('id', orden.id)
          }

          // Lanzar error para que se maneje en el catch principal
          throw new Error(`Error crítico en envío de email: ${emailError.message}`)
        }
      }

      // Mensaje de éxito
      const estadoTexto = estadoPago === 'pagado' ? 'vendido' : `marcado como ${estadoPago}`

      let mensajeExito = `Venta realizada exitosamente: ${boletos.length} boleto${boletos.length > 1 ? 's' : ''} ${estadoTexto}${boletos.length > 1 ? 's' : ''} por $${totalEsperado.toLocaleString()}`

      // Agregar información sobre el email
      if (enviarEmail && emailValido) {
        if (emailEnviadoExitoso) {
          mensajeExito += ` ✉️ Confirmación enviada a ${emailCliente}`
        } else {
          mensajeExito += ` ⚠️ Email no enviado`
        }
      } else if (enviarEmail && !emailValido) {
        mensajeExito += ` ⚠️ Cliente sin email válido`
      }

      toast.success('¡Venta exitosa!', {
        description: mensajeExito,
        duration: 6000,
        action: {
          label: 'Ver detalles',
          onClick: () => console.log('Ver detalles de la orden:', orden.id)
        }
      })

      toast.dismiss(loadingToast)

      set({
        mensaje: mensajeExito,
        ultimaVenta: orden,
        loading: false
      })

      return orden

    } catch (err: any) {
      const errorMessage = err.message || 'Error desconocido en la venta'
      console.error('Error en venta de boletos:', err)

      toast.error('Error en la venta', {
        description: errorMessage,
        duration: 5000
      })

      toast.dismiss(loadingToast)

      set({
        error: errorMessage,
        loading: false
      })

      return null
    }
  },

  /**
   * Verifica que los boletos estén disponibles
   */
  verificarDisponibilidadBoletos: async (boletosIds: string[]): Promise<boolean> => {
    try {
      const { data: boletos, error } = await supabase
        .from('boletos')
        .select('id, vendido')
        .in('id', boletosIds)

      if (error) throw error

      // Verificar que todos los boletos existan y estén disponibles
      if (boletos.length !== boletosIds.length) {
        return false
      }

      return boletos.every(boleto => !boleto.vendido)
    } catch (error) {
      console.error('Error verificando disponibilidad:', error)
      toast.error('Error al verificar disponibilidad de boletos')
      return false
    }
  },

  /**
   * Obtiene el historial de ventas de una agencia
   */
  obtenerHistorialVentas: async (agenciaId: string): Promise<OrdenBoleto[]> => {
    try {
      const { data, error } = await supabase
        .from('ordenes_boletos')
        .select('*')
        .eq('agencia_id', agenciaId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error obteniendo historial:', error)
      toast.error('Error al obtener historial de ventas')
      return []
    }
  },

  /**
   * Limpia los mensajes de éxito/error
   */
  limpiarMensajes: () => {
    set({
      error: null,
      mensaje: null,
      errorEmail: null
    })
  },

  /**
   * Resetea todo el estado
   */
  resetearEstado: () => {
    set({
      loading: false,
      error: null,
      mensaje: null,
      ultimaVenta: null,
      emailEnviado: false,
      errorEmail: null
    })
  }
}))

// ============================================================================
// HOOK ADICIONAL PARA FACILITAR USO EN COMPONENTES
// ============================================================================

export const useVentaActions = () => {
  const {
    venderBoletos,
    loading,
    error,
    mensaje,
    emailEnviado,
    errorEmail,
    ultimaVenta
  } = useVentaStore()

  return {
    venderBoletos,
    loading,
    error,
    mensaje,
    emailEnviado,
    errorEmail,
    ultimaVenta
  }
}