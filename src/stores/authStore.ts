import { supabase } from '@/supabase/client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import bcrypt from 'bcryptjs'
import { toast } from 'sonner'

type User = {
    id?: string
    documento_identidad?: string
    nombre: string
    phone: string
    email: string
    user_type: 'admin' | 'agencia' | 'cliente'
    is_active?: boolean
}

type AuthState = {
    user: User | null
    loading: boolean
    error: string | null
    isSessionChecked: boolean
    setUserFromSession: (email: string | null) => Promise<void>
    signInWithPassword: (email: string, password: string) => Promise<User>

    signUp: (
        documento_identidad: string,
        nombre: string,
        phone: string,
        email: string,
        password: string,
        userType?: 'cliente' | 'agencia'
    ) => Promise<void>

    signUpClienteByAgencia: (
        documento_identidad: string,
        nombre: string,
        phone: string,
        email: string,
        password: string,
        agencia_id: string
    ) => Promise<void>

    signUpAgenciaByAdmin: (
        documento_identidad: string,
        nombre: string,
        phone: string,
        email: string,
        password: string,
        direccion: string,
        ciudad: string,
        comision_porcentaje: number
    ) => Promise<void>

    signUpClienteByAdmin: (
        documento_identidad: string,
        nombre: string,
        phone: string,
        email: string,
        password: string
    ) => Promise<void>

    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            loading: false,
            error: null,
            isSessionChecked: false,

            // setUserFromSession: async (email) => {
            //     const currentUser = get().user
            //     if (currentUser?.email === email && email) {
            //         console.log('✅ Usuario ya cargado en cache')
            //         set({ isSessionChecked: true })
            //         return
            //     }

            //     if (!email) {
            //         set({ user: null, isSessionChecked: true })
            //         return
            //     }

            //     const { data, error } = await supabase
            //         .from('users')
            //         .select('*')
            //         .eq('email', email)
            //         .single()

            //     if (error || !data) {
            //         set({ user: null, isSessionChecked: true })
            //         return
            //     }

            //     set({ user: data, isSessionChecked: true })
            // },

            // signInWithPassword: async (email, password) => {
            //     set({ loading: true, error: null })

            //     const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            //         email,
            //         password,
            //     })

            //     if (authError || !authData.user) {
            //         const errorMsg = authError?.message || 'Error al iniciar sesión'
            //         set({ loading: false, error: errorMsg })
            //         toast.error('Error al iniciar sesión', {
            //             description: errorMsg
            //         })
            //         throw new Error(errorMsg)
            //     }

            //     const { data, error } = await supabase
            //         .from('users')
            //         .select('*')
            //         .eq('email', email)
            //         .single()

            //     console.log('🔍 signInWithPassword consultando users para:', email)

            //     if (error || !data) {
            //         const errorMsg = 'No se pudo obtener los datos del usuario.'
            //         set({ loading: false, error: errorMsg })
            //         toast.error('Error', {
            //             description: errorMsg
            //         })
            //         throw new Error(errorMsg)
            //     }

            //     const user = data as User

            //     // ⚠️ VALIDAR SI ES AGENCIA Y ESTÁ VERIFICADA
            //     if (user.user_type === 'agencia') {
            //         const { data: agenciaData } = await supabase
            //             .from('agencias')
            //             .select('is_verified')
            //             .eq('user_id', user.id)
            //             .single()

            //         if (!agenciaData?.is_verified) {
            //             await supabase.auth.signOut()
            //             const errorMsg = 'Tu cuenta aún no ha sido verificada por un administrador. Por favor espera la aprobación.'
            //             set({ loading: false, error: errorMsg, user: null })
            //             toast.error('Cuenta no verificada', {
            //                 description: errorMsg,
            //                 duration: 6000
            //             })
            //             throw new Error(errorMsg)
            //         }
            //     }

            //     set({ user, loading: false })

            //     console.log('🙋‍♂️ Usuario autenticado:', user)
            //     toast.success('¡Bienvenido!', {
            //         description: `Hola ${user.nombre}`
            //     })

            //     return user
            // },

            setUserFromSession: async (email) => {
                // 1️⃣ Si no hay email, limpiar
                if (!email) {
                    set({ user: null, isSessionChecked: true })
                    return
                }

                // 2️⃣ Verificar cache en memoria
                const currentUser = get().user
                if (currentUser?.email === email) {
                    console.log('✅ Usuario ya cargado en cache (memoria)')
                    set({ isSessionChecked: true })
                    return
                }

                // 3️⃣ Verificar localStorage (persist de Zustand ya lo carga automáticamente)
                // Si llegamos aquí y currentUser existe pero con diferente email,
                // significa que necesitamos actualizar
                if (currentUser && currentUser.email !== email) {
                    console.log('⚠️ Email cambió, recargando usuario desde DB')
                } else if (!currentUser) {
                    console.log('🔍 Usuario no en cache, consultando DB')
                }

                // 4️⃣ Solo consultar DB si es necesario
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .single()

                if (error || !data) {
                    set({ user: null, isSessionChecked: true })
                    return
                }

                set({ user: data, isSessionChecked: true })
            },


            signInWithPassword: async (email, password) => {
                set({ loading: true, error: null })

                try {
                    // 1. Buscar usuario en TU tabla users
                    const { data: userData, error: userError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('email', email)
                        .single()

                    if (userError || !userData) {
                        set({ loading: false, error: 'Usuario no encontrado' })
                        toast.error('Usuario no encontrado')
                        throw new Error('Usuario no encontrado')
                    }

                    // 2. Verificar contraseña con bcrypt
                    const passwordMatch = await bcrypt.compare(password, userData.password)

                    if (!passwordMatch) {
                        set({ loading: false, error: 'Contraseña incorrecta' })
                        toast.error('Contraseña incorrecta')
                        throw new Error('Contraseña incorrecta')
                    }

                    // 3. Validar si es agencia verificada
                    if (userData.user_type === 'agencia') {
                        const { data: agenciaData } = await supabase
                            .from('agencias')
                            .select('is_verified')
                            .eq('user_id', userData.id)
                            .single()

                        if (!agenciaData?.is_verified) {
                            set({ loading: false, error: 'Cuenta no verificada' })
                            toast.error('Cuenta no verificada', {
                                description: 'Tu cuenta aún no ha sido verificada'
                            })
                            throw new Error('Cuenta no verificada')
                        }
                    }

                    // 4. ✅ Intentar crear sesión en Supabase Auth
                    // Esto es opcional pero útil para Row Level Security
                    try {
                        console.log('🔐 Intentando login en Supabase Auth...')

                        // Primero intentar login normal
                        const { error: signInError } = await supabase.auth.signInWithPassword({
                            email,
                            password
                        })

                        if (signInError) {
                            // Si falla el login, puede ser porque:
                            // A) El usuario no existe en Auth
                            // B) La contraseña en Auth es diferente

                            console.log('⚠️ No existe en Auth o contraseña diferente, intentando crear/actualizar...')

                            // Intentar crear el usuario en Auth
                            const { error: signUpError } = await supabase.auth.signUp({
                                email,
                                password,
                                options: {
                                    emailRedirectTo: undefined,
                                    data: {
                                        user_type: userData.user_type,
                                        user_id: userData.id
                                    }
                                }
                            })

                            if (signUpError) {
                                // Si el error es "User already registered", intentar login de nuevo
                                if (signUpError.message.includes('already registered') ||
                                    signUpError.message.includes('already been registered')) {
                                    console.log('✅ Usuario existe en Auth, contraseña podría estar desincronizada')
                                    // No es crítico, continuar con el login
                                } else {
                                    console.warn('⚠️ Error en signUp de Auth:', signUpError.message)
                                    // Tampoco es crítico, continuar
                                }
                            } else {
                                console.log('✅ Usuario creado en Supabase Auth')
                                // Ahora intentar login
                                await supabase.auth.signInWithPassword({ email, password })
                            }
                        } else {
                            console.log('✅ Login exitoso en Supabase Auth')
                        }
                    } catch (authError) {
                        // Si falla todo el proceso de Auth, NO es crítico
                        // Tu sistema funciona sin Supabase Auth
                        console.warn('⚠️ No se pudo sincronizar con Supabase Auth:', authError)
                        console.log('ℹ️ El login continuará normalmente usando tu tabla users')
                    }

                    // 5. ✅ Establecer usuario en el estado
                    const user = userData as User
                    set({ user, loading: false })

                    toast.success('¡Bienvenido!', {
                        description: `Hola ${user.nombre}`
                    })

                    console.log('🙋‍♂️ Usuario autenticado:', user)
                    return user

                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Error de autenticación'
                    set({ loading: false, error: errorMessage })
                    throw err
                }
            },

            signUp: async (documento_identidad, nombre, phone, email, password, userType = 'cliente') => {
                set({ loading: true, error: null });


                const hashedPassword = await bcrypt.hash(password, 10);

                const { data: existingUsers } = await supabase
                    .from('users')
                    .select('documento_identidad, email')
                    .or(`documento_identidad.eq.${documento_identidad},email.eq.${email}`)
                    .limit(1)
                    .maybeSingle();

                if (existingUsers) {
                    let errorMsg = '';
                    if (existingUsers.documento_identidad === documento_identidad) {
                        errorMsg = 'Este documento ya está registrado';
                    } else if (existingUsers.email === email) {
                        errorMsg = 'Este correo ya está registrado';
                    }

                    set({ loading: false, error: errorMsg });
                    toast.error('Usuario duplicado', {
                        description: errorMsg
                    })
                    return;
                }

                // Insertar en 'users'
                const { data: userInserted, error: userInsertError } = await supabase
                    .from('users')
                    .insert([{
                        documento_identidad,
                        nombre,
                        phone,
                        email,
                        password: hashedPassword,
                        user_type: userType,
                    }])
                    .select('id');

                if (userInsertError || !userInserted) {
                    const errorMsg = userInsertError?.message || 'Error al registrar usuario'
                    set({ loading: false, error: errorMsg });
                    toast.error('Error al registrar', {
                        description: errorMsg
                    })
                    return;
                }

                const userId = userInserted[0].id;

                // Insertar en tabla correspondiente (SIN agencia_id para auto-registro)
                let detalleInsertError = null;

                if (userType === 'cliente') {
                    const { error } = await supabase.from('clientes').insert([{
                        user_id: userId,
                        direccion: '',
                        ciudad: '',
                        agencia_id: null,  // ← Auto-registro sin agencia
                    }]);
                    detalleInsertError = error;
                } else if (userType === 'agencia') {
                    const { error } = await supabase.from('agencias').insert([{
                        user_id: userId,
                        direccion: '',
                        ciudad: '',
                        comision_porcentaje: 0,
                        is_verified: false,
                        admin_id: null,
                    }]);
                    detalleInsertError = error;
                }

                if (detalleInsertError) {
                    await supabase.from('users').delete().eq('id', userId);
                    const errorMsg = `Error al crear ${userType}`
                    set({ loading: false, error: errorMsg });
                    toast.error('Error al crear cuenta', {
                        description: errorMsg
                    })
                    return;
                }

                // Crear usuario en Supabase Auth (sin auto-login)
                const { error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: undefined,
                        data: {
                            user_type: userType
                        }
                    }
                });

                if (authError) {
                    // Rollback total
                    await supabase.from(userType === 'cliente' ? 'clientes' : 'agencias').delete().eq('user_id', userId);
                    await supabase.from('users').delete().eq('id', userId);
                    const errorMsg = authError?.message || 'Error en Supabase Auth'
                    set({ loading: false, error: errorMsg });
                    toast.error('Error de autenticación', {
                        description: errorMsg
                    })
                    return;
                }

                // El listener en main.tsx manejará el signOut automáticamente
                set({ loading: false });
                toast.success('¡Registro exitoso!', {
                    description: 'Tu cuenta ha sido creada correctamente'
                })
                return;
            },

            // 🆕 FUNCIÓN: Para que agencias creen clientes
            signUpClienteByAgencia: async (
                documento_identidad,
                nombre,
                phone,
                email,
                password,
                agencia_id
            ) => {
                set({ loading: true, error: null });

                const hashedPassword = await bcrypt.hash(password, 10);

                // Verificar duplicados
                const { data: existingUsers } = await supabase
                    .from('users')
                    .select('documento_identidad, email')
                    .or(`documento_identidad.eq.${documento_identidad},email.eq.${email}`)
                    .limit(1)
                    .maybeSingle();

                if (existingUsers) {
                    let errorMsg = '';
                    if (existingUsers.documento_identidad === documento_identidad) {
                        errorMsg = 'Este documento ya está registrado';
                    } else if (existingUsers.email === email) {
                        errorMsg = 'Este correo ya está registrado';
                    }

                    set({ loading: false, error: errorMsg });
                    toast.error('Usuario duplicado', {
                        description: errorMsg
                    })
                    return;
                }

                // Insertar en 'users'
                const { data: userInserted, error: userInsertError } = await supabase
                    .from('users')
                    .insert([{
                        documento_identidad,
                        nombre,
                        phone,
                        email,
                        password: hashedPassword,
                        user_type: 'cliente',
                    }])
                    .select('id');

                if (userInsertError || !userInserted) {
                    const errorMsg = userInsertError?.message || 'Error al registrar usuario'
                    set({ loading: false, error: errorMsg });
                    toast.error('Error al crear cliente', {
                        description: errorMsg
                    })
                    return;
                }

                const userId = userInserted[0].id;

                // Insertar en 'clientes' CON agencia_id
                const { error: clienteError } = await supabase.from('clientes').insert([{
                    user_id: userId,
                    direccion: '',
                    ciudad: '',
                    agencia_id: agencia_id,
                }]);

                if (clienteError) {
                    await supabase.from('users').delete().eq('id', userId);
                    set({ loading: false, error: 'Error al crear el cliente' });
                    toast.error('Error', {
                        description: 'Error al crear el cliente'
                    })
                    return;
                }

                // ✅ NO crear en Supabase Auth - el cliente se autenticará cuando haga login
                console.log(`✅ Cliente creado exitosamente y asociado a la agencia ${agencia_id}`);
                set({ loading: false });
                toast.success('¡Cliente creado!', {
                    description: `${nombre} ha sido registrado. Podrá iniciar sesión con su correo y contraseña.`
                })
                return;
            },

            // 🆕 FUNCIÓN: Para que admin cree agencias
            signUpAgenciaByAdmin: async (
                documento_identidad,
                nombre,
                phone,
                email,
                password,
                direccion,
                ciudad,
                comision_porcentaje
            ) => {
                set({ loading: true, error: null });



                const hashedPassword = await bcrypt.hash(password, 10);

                const { data: existingUsers } = await supabase
                    .from('users')
                    .select('documento_identidad, email')
                    .or(`documento_identidad.eq.${documento_identidad},email.eq.${email}`)
                    .limit(1)
                    .maybeSingle();

                if (existingUsers) {
                    let errorMsg = '';
                    if (existingUsers.documento_identidad === documento_identidad) {
                        errorMsg = 'Este documento ya está registrado';
                    } else if (existingUsers.email === email) {
                        errorMsg = 'Este correo ya está registrado';
                    }

                    set({ loading: false, error: errorMsg });
                    toast.error('Usuario duplicado', {
                        description: errorMsg
                    })
                    return;
                }

                // Obtener el ID del admin actual
                const currentUser = get().user;
                if (!currentUser || currentUser.user_type !== 'admin') {
                    const errorMsg = 'Solo los administradores pueden crear agencias'
                    set({ loading: false, error: errorMsg });
                    toast.error('Acceso denegado', {
                        description: errorMsg
                    })
                    return;
                }

                // Insertar en 'users'
                const { data: userInserted, error: userInsertError } = await supabase
                    .from('users')
                    .insert([{
                        documento_identidad,
                        nombre,
                        phone,
                        email,
                        password: hashedPassword,
                        user_type: 'agencia',
                    }])
                    .select('id');

                if (userInsertError || !userInserted) {
                    const errorMsg = userInsertError?.message || 'Error al registrar usuario'
                    set({ loading: false, error: errorMsg });
                    toast.error('Error al crear agencia', {
                        description: errorMsg
                    })
                    return;
                }

                const userId = userInserted[0].id;

                // Insertar en 'agencias' CON datos completos y admin_id
                const { error: agenciaError } = await supabase.from('agencias').insert([{
                    user_id: userId,
                    direccion: direccion,
                    ciudad: ciudad,
                    comision_porcentaje: comision_porcentaje,
                    is_verified: false,
                    admin_id: currentUser.id,
                }]);

                if (agenciaError) {
                    await supabase.from('users').delete().eq('id', userId);
                    set({ loading: false, error: 'Error al crear la agencia' });
                    toast.error('Error', {
                        description: 'Error al crear la agencia'
                    })
                    return;
                }

                // ✅ NO crear en Supabase Auth - la agencia se registrará cuando haga login por primera vez
                console.log(`✅ Agencia creada exitosamente por el admin ${currentUser.id}`);
                set({ loading: false });
                toast.success('¡Agencia creada!', {
                    description: `${nombre} ha sido registrada. Debes verificarla antes de que pueda iniciar sesión.`
                })
                return;
            },

            // 🆕 FUNCIÓN: Para que admin cree clientes (sin agencia asignada)
            signUpClienteByAdmin: async (
                documento_identidad: string,
                nombre: string,
                phone: string,
                email: string,
                password: string
            ) => {
                set({ loading: true, error: null });

                const hashedPassword = await bcrypt.hash(password, 10);

                // Verificar duplicados
                const { data: existingUsers } = await supabase
                    .from('users')
                    .select('documento_identidad, email')
                    .or(`documento_identidad.eq.${documento_identidad},email.eq.${email}`)
                    .limit(1)
                    .maybeSingle();

                if (existingUsers) {
                    let errorMsg = '';
                    if (existingUsers.documento_identidad === documento_identidad) {
                        errorMsg = 'Este documento ya está registrado';
                    } else if (existingUsers.email === email) {
                        errorMsg = 'Este correo ya está registrado';
                    }

                    set({ loading: false, error: errorMsg });
                    toast.error('Usuario duplicado', {
                        description: errorMsg
                    })
                    return;
                }

                // Obtener el ID del admin actual
                const currentUser = get().user;
                if (!currentUser || currentUser.user_type !== 'admin') {
                    const errorMsg = 'Solo los administradores pueden crear clientes'
                    set({ loading: false, error: errorMsg });
                    toast.error('Acceso denegado', {
                        description: errorMsg
                    })
                    return;
                }

                // Insertar en 'users'
                const { data: userInserted, error: userInsertError } = await supabase
                    .from('users')
                    .insert([{
                        documento_identidad,
                        nombre,
                        phone,
                        email,
                        password: hashedPassword,
                        user_type: 'cliente',
                    }])
                    .select('id');

                if (userInsertError || !userInserted) {
                    const errorMsg = userInsertError?.message || 'Error al registrar usuario'
                    set({ loading: false, error: errorMsg });
                    toast.error('Error al crear cliente', {
                        description: errorMsg
                    })
                    return;
                }

                const userId = userInserted[0].id;

                // Insertar en 'clientes' SIN agencia_id (como auto-registro)
                const { error: clienteError } = await supabase.from('clientes').insert([{
                    user_id: userId,
                    direccion: '',
                    ciudad: '',
                    agencia_id: null,  // ← Sin agencia asignada
                }]);

                if (clienteError) {
                    await supabase.from('users').delete().eq('id', userId);
                    set({ loading: false, error: 'Error al crear el cliente' });
                    toast.error('Error', {
                        description: 'Error al crear el cliente'
                    })
                    return;
                }

                // ✅ NO crear en Supabase Auth - el cliente se autenticará cuando haga login
                console.log(`✅ Cliente creado exitosamente por el admin ${currentUser.id}`);
                set({ loading: false });
                toast.success('¡Cliente creado!', {
                    description: `${nombre} ha sido registrado. Podrá iniciar sesión con su correo y contraseña.`
                })
                return;
            },

            logout: async () => {
                await supabase.auth.signOut()
                set({ user: null })
                toast.success('Sesión cerrada', {
                    description: 'Has salido exitosamente'
                })
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
)