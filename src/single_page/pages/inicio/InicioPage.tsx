// import { useEffect, useState } from "react"
// import { NumerosDeLaSuerte } from "@/single_page/components/NumerosDeLaSuerte"
// import { useRifaStore } from "@/stores/rifaStore"
// import { NumeroGanador } from "@/single_page/components/NumeroGanador"
// import { MetodosDePago } from "@/single_page/components/MetodosDePago"
// import { CustomJumbotron } from "@/single_page/components/CustomJumbotron"
// import { CustomComoFiunciona } from "@/single_page/components/CustomComoFiunciona"
// import { CustomProgressBar } from "@/single_page/components/CustomProgressBar"
// import { useBoletoStore } from "@/stores/useBoletoStore"


// export const InicioPage = () => {
//     const { rifas, loading, error, fetchRifas } = useRifaStore()
//     const { fetchEstadisticasRifa } = useBoletoStore()

//     const [initialized, setInitialized] = useState(false)
//     const [stats, setStats] = useState({ total: 0, vendidos: 0, disponibles: 0, reservados: 0 })

//     // Cargar las rifas al montar el componente
//     useEffect(() => {
//         if (!initialized) {
//             setInitialized(true)

//             // Intentar cargar desde localStorage primero
//             try {
//                 const cachedRifas = localStorage.getItem('rifas_cache')
//                 const cachedTime = localStorage.getItem('rifas_lastFetch')

//                 if (cachedRifas && cachedTime) {
//                     const parsedTime = parseInt(cachedTime)
//                     // Si el cache tiene menos de 5 minutos, usar esos datos
//                     if (Date.now() - parsedTime < 300000) {
//                         console.log('✅ Usando rifas desde localStorage')
//                         // No necesitas hacer nada aquí si el store ya cargó desde localStorage
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error al leer localStorage:', error)
//             }

//             // Siempre llamar a fetchRifas (cargará desde localStorage si es válido)
//             fetchRifas()
//         }
//     }, [initialized, fetchRifas])

//     // Obtener la rifa activa más reciente o la primera disponible
//     const rifaActiva = rifas.find(r => r.estado === 'activa') || rifas[0]

//     // Cargar estadísticas cuando cambie la rifa activa
//     useEffect(() => {
//         const loadStats = async () => {
//             if (rifaActiva?.id) {
//                 const estadisticas = await fetchEstadisticasRifa(rifaActiva.id)
//                 setStats(estadisticas)
//             }
//         }
//         loadStats()
//     }, [rifaActiva?.id, fetchEstadisticasRifa])

//     const rifaDescription = rifaActiva?.descripcion || ""

//     // Manejo de números de la suerte - ahora viene directo del store (que ya usa localStorage)
//     const numeroDeLaSuerte = rifaActiva?.numeros_de_la_suerte
//         ? rifaActiva.numeros_de_la_suerte.filter(num => num != null && num !== '').map(num => String(num))
//         : []

//     // Manejo seguro de imágenes
//     const imagenesSeguras = rifaActiva?.imagenes
//         ? rifaActiva.imagenes.filter(img => img != null && img !== '')
//         : []

//     return (
//         <div>
//             {rifaActiva ? (
//                 <CustomJumbotron
//                     title={rifaActiva.titulo || "Rifa sin título"}
//                     subTitle={rifaActiva.subtitulo || ""}
//                     images={imagenesSeguras}
//                     precio={rifaActiva.precio_boleta}
//                     estado={rifaActiva.estado}
//                     fechaSorteo={rifaActiva.fecha_inicio}
//                     // loteria={rifaActiva.loteria || "Nacional"}
//                     // buttonText="Ver Más"
//                     onButtonClick={() => {
//                         document.getElementById('rifa-details')?.scrollIntoView({ behavior: 'smooth' })
//                     }}
//                 />
//             ) : (
//                 <div className="bg-gray-50 min-h-[400px] flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="text-4xl mb-4">🎲</div>
//                         <h2 className="text-xl font-semibold text-gray-700 mb-2">
//                             {loading ? "Cargando Evento..." : "No hay Eventos disponibles"}
//                         </h2>
//                         {error && (
//                             <p className="text-red-600 text-sm mb-2">{error}</p>
//                         )}
//                         {!loading && (
//                             <button
//                                 onClick={() => fetchRifas(true)} // forzar refresh
//                                 className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                             >
//                                 Actualizar
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             )}

//             <CustomProgressBar
//                 totalBoletos={stats.total}
//                 vendidos={stats.vendidos}
//                 rifaDescription={rifaDescription}
//             />

//             <NumeroGanador
//                 numberWin={rifaActiva?.numero_ganador || '--'}
//             />

//             <NumerosDeLaSuerte
//                 emoji=""
//                 numbers={numeroDeLaSuerte.length > 0 ? numeroDeLaSuerte : ["No hay números de la suerte disponibles."]}
//             />

//             {/* <CustomTicketSelector/> */}

//             <CustomComoFiunciona />


//             <MetodosDePago />
//         </div>
//     )
// }

import { useEffect, useState } from "react"
import { NumerosDeLaSuerte } from "@/single_page/components/NumerosDeLaSuerte"
import { useRifaStore } from "@/stores/rifaStore"
import { NumeroGanador } from "@/single_page/components/NumeroGanador"
import { MetodosDePago } from "@/single_page/components/MetodosDePago"
import { CustomJumbotron } from "@/single_page/components/CustomJumbotron"
import { CustomComoFiunciona } from "@/single_page/components/CustomComoFiunciona"
import { CustomProgressBar } from "@/single_page/components/CustomProgressBar"
import { CustomTicketSelector } from "@/single_page/components/CustomTicketSelector"
import { useBoletoStore } from "@/stores/useBoletoStore"
import { useHistorialVentasStore } from "@/stores/useHistorialVentasStore"
// import { useReservaStore } from "@/stores/useReservaStore"

export const InicioPage = () => {
    // ============================================================================
    // STORES
    // ============================================================================
    const { rifas, loading, error, fetchRifas } = useRifaStore()
    const { fetchEstadisticasRifa } = useBoletoStore()
    // const { inicializarSesion } = useReservaStore()
    const { obtenerTodosNumerosGanadoresRifa } = useHistorialVentasStore()
    const [numerosGanadores, setNumerosGanadores] = useState<string[]>([])

    // ============================================================================
    // ESTADOS
    // ============================================================================
    const [initialized, setInitialized] = useState(false)
    const [stats, setStats] = useState({
        total: 0,
        vendidos: 0,
        disponibles: 0,
        reservados: 0
    })

    // ============================================================================
    // INICIALIZACIÓN
    // ============================================================================

    // Inicializar sesión de reservas al montar
    // useEffect(() => {
    //     inicializarSesion()
    // }, [inicializarSesion])

    // Cargar las rifas al montar el componente
    useEffect(() => {
        if (!initialized) {
            setInitialized(true)

            // Intentar cargar desde localStorage primero
            try {
                const cachedRifas = localStorage.getItem('rifas_cache')
                const cachedTime = localStorage.getItem('rifas_lastFetch')

                if (cachedRifas && cachedTime) {
                    const parsedTime = parseInt(cachedTime)
                    // Si el cache tiene menos de 5 minutos, usar esos datos
                    if (Date.now() - parsedTime < 300000) {
                        console.log('✅ Usando rifas desde localStorage')
                    }
                }
            } catch (error) {
                console.error('Error al leer localStorage:', error)
            }

            // Siempre llamar a fetchRifas (cargará desde localStorage si es válido)
            fetchRifas()
        }
    }, [initialized, fetchRifas])

    // ============================================================================
    // OBTENER RIFA ACTIVA
    // ============================================================================
    const rifaActiva = rifas.find(r => r.estado === 'activa') || rifas[0]

    // // ============================================================================
    // // CARGAR ESTADÍSTICAS
    // // ============================================================================
    // useEffect(() => {
    //     const loadStats = async () => {
    //         if (rifaActiva?.id) {
    //             const estadisticas = await fetchEstadisticasRifa(rifaActiva.id)
    //             setStats(estadisticas)
    //         }
    //     }
    //     loadStats()
    // }, [rifaActiva?.id, fetchEstadisticasRifa])

    // ============================================================================
    // CARGAR ESTADÍSTICAS Y NÚMEROS GANADORES
    // ============================================================================
    useEffect(() => {
        const loadStats = async () => {
            if (rifaActiva?.id) {
                const estadisticas = await fetchEstadisticasRifa(rifaActiva.id)
                setStats(estadisticas)

                // Cargar números ganadores
                const ganadores = await obtenerTodosNumerosGanadoresRifa(rifaActiva.id)
                setNumerosGanadores(ganadores)
            }
        }
        loadStats()
    }, [rifaActiva?.id, fetchEstadisticasRifa, obtenerTodosNumerosGanadoresRifa])

    // ============================================================================
    // DATOS PROCESADOS
    // ============================================================================
    const rifaDescription = rifaActiva?.descripcion || ""

    // Manejo de números de la suerte
    const numeroDeLaSuerte = rifaActiva?.numeros_de_la_suerte
        ? rifaActiva.numeros_de_la_suerte
            .filter(num => num != null && num !== '')
            .map(num => String(num))
        : []

    // Manejo seguro de imágenes
    const imagenesSeguras = rifaActiva?.imagenes
        ? rifaActiva.imagenes.filter(img => img != null && img !== '')
        : []

    // Imagen principal para el selector (primera imagen o placeholder)
    const imagenPrincipal = imagenesSeguras[0] || undefined


    return (
        <div className="min-h-screen">


            {rifaActiva ? (
                <CustomJumbotron
                    title={rifaActiva.titulo || "Rifa sin título"}
                    subTitle={rifaActiva.subtitulo || ""}
                    images={imagenesSeguras}
                    precio={rifaActiva.precio_boleta}
                    estado={rifaActiva.estado}
                    fechaSorteo={rifaActiva.fecha_inicio}
                    onButtonClick={() => {
                        document.getElementById('selector-boletos')?.scrollIntoView({
                            behavior: 'smooth'
                        })
                    }}
                />
            ) : (
                <div className="bg-gray-50 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl mb-4">🎲</div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            {loading ? "Cargando Evento..." : "No hay Eventos disponibles"}
                        </h2>
                        {error && (
                            <p className="text-red-600 text-sm mb-2">{error}</p>
                        )}
                        {!loading && (
                            <button
                                onClick={() => fetchRifas(true)}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Actualizar
                            </button>
                        )}
                    </div>
                </div>
            )}


            <CustomProgressBar
                totalBoletos={stats.total}
                vendidos={stats.vendidos}
                rifaDescription={rifaDescription}
            />


            {/* SELECTOR DE BOLETOS  */}

            {rifaActiva && rifaActiva.estado === 'activa' && (
                <section
                    id="selector-boletos"
                    className="py-12 px-4 bg-gradient-to-b from-white to-gray-50"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                ¡Participa Ahora!
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Selecciona la cantidad de números que deseas comprar
                            </p>
                        </div>

                        <CustomTicketSelector
                            rifaId={rifaActiva.id}
                            rifaTitulo={rifaActiva.titulo}
                            rifaSubtitulo={rifaActiva.subtitulo || undefined}
                            imagenRifa={imagenPrincipal}
                            pricePerTicket={rifaActiva.precio_boleta}
                            onAddToCart={(quantity, total) => {
                                console.log(`✅ Agregado al carrito: ${quantity} números por $${total}`)
                                // Opcional: Analytics, eventos, etc.
                            }}
                        />
                    </div>
                </section>
            )}

            {/* Mensaje si la rifa no está activa */}
            {rifaActiva && rifaActiva.estado !== 'activa' && (
                <section className="py-12 px-4 bg-gray-50">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                            <div className="text-5xl mb-4">🎟️</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Evento No Disponible
                            </h3>
                            <p className="text-gray-600">
                                {rifaActiva.estado === 'finalizada'
                                    ? 'Este evento ya ha finalizado'
                                    : 'Este evento aún no está disponible para participar'}
                            </p>
                        </div>
                    </div>
                </section>
            )}


            <NumeroGanador
                numberWin={rifaActiva?.numero_ganador || '--'}
            />


            <NumerosDeLaSuerte
                emoji=""
                numbers={numeroDeLaSuerte.length > 0
                    ? numeroDeLaSuerte
                    : ["No hay números de la suerte disponibles."]
                }
                numerosGanadores={numerosGanadores} 
            />

            <CustomComoFiunciona />

            <MetodosDePago />
        </div>
    )
}
