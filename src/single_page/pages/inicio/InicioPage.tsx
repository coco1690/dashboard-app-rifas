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
//     const [stats, setStats] = useState({ total: 0, vendidos: 0 })

//     // Cargar las rifas al montar el componente
//     const [initialized, setInitialized] = useState(false)

//     useEffect(() => {
//         if (!initialized) {
//             setInitialized(true)
//             fetchRifas()
//         }
//     }, [initialized])




//     // Obtener la rifa activa más reciente o la primera disponible
//     const rifaActiva = rifas.find(r => r.estado === 'activa') || rifas[0]

//     useEffect(() => {
//         const loadStats = async () => {
//             if (rifaActiva) {
//                 const estadisticas = await fetchEstadisticasRifa(rifaActiva.id)
//                 setStats(estadisticas)
//             }
//         }
//         loadStats()
//     }, [rifaActiva?.id])

//     // const totalBoletos = rifaActiva ? getTotalBoletos(rifaActiva.id) : 0
//     // const vendidos = rifaActiva ? getBoletosVendidos(rifaActiva.id).length : 0
//     const rifaDescription = rifaActiva?.descripcion || ""


//     // ✅ CORREGIDO: Manejo seguro de números de la suerte
//     const numeroDeLaSuerte = rifaActiva?.numeros_de_la_suerte
//         ? rifaActiva.numeros_de_la_suerte.filter(num => num != null && num !== '').map(num => String(num))
//         : []

//     // ✅ CORREGIDO: Manejo seguro de imágenes
//     const imagenesSeguras = rifaActiva?.imagenes
//         ? rifaActiva.imagenes.filter(img => img != null && img !== '')
//         : []

//     return (
//         <div>
//             {/* Solo el CustomJumbotron se actualiza condicionalmente */}
//             {rifaActiva ? (
//                 <CustomJumbotron
//                     title={rifaActiva.titulo || "Rifa sin título"}
//                     subTitle={rifaActiva.subtitulo || ""}
//                     images={imagenesSeguras}
//                     precio={rifaActiva.precio_boleta}
//                     estado={rifaActiva.estado}
//                     fechaSorteo={rifaActiva.fecha_inicio}
//                     loteria={rifaActiva.loteria || "Nacional"}
//                     buttonText="Ver Más"
//                     onButtonClick={() => {
//                         //TODO: cambiar navegacion a ver mas tipo toast con la descripcion de la rifa
//                         document.getElementById('rifa-details')?.scrollIntoView()
//                     }}
//                 />
//             ) : (
//                 // Placeholder o estado vacío solo para el Jumbotron
//                 <div className="bg-gray-50 min-h-[400px] flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="text-4xl mb-4">🎲</div>
//                         <h2 className="text-xl font-semibold text-gray-700 mb-2">
//                             {loading ? "Cargando rifa..." : "No hay rifas disponibles"}
//                         </h2>
//                         {error && (
//                             <p className="text-red-600 text-sm mb-2">{error}</p>
//                         )}
//                         {!loading && (
//                             <button
//                                 onClick={() => fetchRifas()}
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

//             {/* Estos componentes siempre se muestran */}
//             <NumeroGanador
//                 numberWin={rifaActiva?.numero_ganador || '--'}
//             />

//             <NumerosDeLaSuerte
//                 emoji="🍀"
//                 numbers={numeroDeLaSuerte.length > 0 ? numeroDeLaSuerte : ["No hay números de la suerte disponibles."]}
//             />

//             <CustomComoFiunciona />

//             <MetodosDePago />
//         </div>
//     )
// }


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
//             fetchRifas()
//         }
//     }, [initialized])

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
//     }, [rifaActiva?.id])

//     const rifaDescription = rifaActiva?.descripcion || ""

//     // Manejo seguro de números de la suerte
//     // const numeroDeLaSuerte = rifaActiva?.numeros_de_la_suerte
//     //     ? rifaActiva.numeros_de_la_suerte.filter(num => num != null && num !== '').map(num => String(num))
//     //     : []

//     const numeroDeLaSuerte = localStorage.getItem('numerosDelaSuerte')
//         ? JSON.parse(localStorage.getItem('numerosDelaSuerte') || '[]')
//         : rifaActiva?.numeros_de_la_suerte
//             ? rifaActiva.numeros_de_la_suerte.filter(num => num != null && num !== '').map(num => String(num))
//             : [];



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
//                     loteria={rifaActiva.loteria || "Nacional"}
//                     buttonText="Ver Más"
//                     onButtonClick={() => {
//                         document.getElementById('rifa-details')?.scrollIntoView({ behavior: 'smooth' })
//                     }}
//                 />
//             ) : (
//                 <div className="bg-gray-50 min-h-[400px] flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="text-4xl mb-4">🎲</div>
//                         <h2 className="text-xl font-semibold text-gray-700 mb-2">
//                             {loading ? "Cargando rifa..." : "No hay rifas disponibles"}
//                         </h2>
//                         {error && (
//                             <p className="text-red-600 text-sm mb-2">{error}</p>
//                         )}
//                         {!loading && (
//                             <button
//                                 onClick={() => fetchRifas()}
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
//                 emoji="🍀"
//                 numbers={numeroDeLaSuerte.length > 0 ? numeroDeLaSuerte : ["No hay números de la suerte disponibles."]}
//             />

//             <CustomComoFiunciona />

//             <MetodosDePago />
//         </div>
//     )
// }




// TODO: CON MANEJO DEL LOCAL STORAGE 

import { useEffect, useState } from "react"
import { NumerosDeLaSuerte } from "@/single_page/components/NumerosDeLaSuerte"
import { useRifaStore } from "@/stores/rifaStore"
import { NumeroGanador } from "@/single_page/components/NumeroGanador"
import { MetodosDePago } from "@/single_page/components/MetodosDePago"
import { CustomJumbotron } from "@/single_page/components/CustomJumbotron"
import { CustomComoFiunciona } from "@/single_page/components/CustomComoFiunciona"
import { CustomProgressBar } from "@/single_page/components/CustomProgressBar"
import { useBoletoStore } from "@/stores/useBoletoStore"

export const InicioPage = () => {
    const { rifas, loading, error, fetchRifas } = useRifaStore()
    const { fetchEstadisticasRifa } = useBoletoStore()
    
    const [initialized, setInitialized] = useState(false)
    const [stats, setStats] = useState({ total: 0, vendidos: 0, disponibles: 0, reservados: 0 })

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
                        // No necesitas hacer nada aquí si el store ya cargó desde localStorage
                    }
                }
            } catch (error) {
                console.error('Error al leer localStorage:', error)
            }
            
            // Siempre llamar a fetchRifas (cargará desde localStorage si es válido)
            fetchRifas()
        }
    }, [initialized, fetchRifas])

    // Obtener la rifa activa más reciente o la primera disponible
    const rifaActiva = rifas.find(r => r.estado === 'activa') || rifas[0]

    // Cargar estadísticas cuando cambie la rifa activa
    useEffect(() => {
        const loadStats = async () => {
            if (rifaActiva?.id) {
                const estadisticas = await fetchEstadisticasRifa(rifaActiva.id)
                setStats(estadisticas)
            }
        }
        loadStats()
    }, [rifaActiva?.id, fetchEstadisticasRifa])

    const rifaDescription = rifaActiva?.descripcion || ""

    // Manejo de números de la suerte - ahora viene directo del store (que ya usa localStorage)
    const numeroDeLaSuerte = rifaActiva?.numeros_de_la_suerte
        ? rifaActiva.numeros_de_la_suerte.filter(num => num != null && num !== '').map(num => String(num))
        : []

    // Manejo seguro de imágenes
    const imagenesSeguras = rifaActiva?.imagenes
        ? rifaActiva.imagenes.filter(img => img != null && img !== '')
        : []

    return (
        <div>
            {rifaActiva ? (
                <CustomJumbotron
                    title={rifaActiva.titulo || "Rifa sin título"}
                    subTitle={rifaActiva.subtitulo || ""}
                    images={imagenesSeguras}
                    precio={rifaActiva.precio_boleta}
                    estado={rifaActiva.estado}
                    fechaSorteo={rifaActiva.fecha_inicio}
                    loteria={rifaActiva.loteria || "Nacional"}
                    buttonText="Ver Más"
                    onButtonClick={() => {
                        document.getElementById('rifa-details')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                />
            ) : (
                <div className="bg-gray-50 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl mb-4">🎲</div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            {loading ? "Cargando rifa..." : "No hay rifas disponibles"}
                        </h2>
                        {error && (
                            <p className="text-red-600 text-sm mb-2">{error}</p>
                        )}
                        {!loading && (
                            <button
                                onClick={() => fetchRifas(true)} // forzar refresh
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

            <NumeroGanador
                numberWin={rifaActiva?.numero_ganador || '--'}
            />

            <NumerosDeLaSuerte
                emoji="🍀"
                numbers={numeroDeLaSuerte.length > 0 ? numeroDeLaSuerte : ["No hay números de la suerte disponibles."]}
            />

            <CustomComoFiunciona />

            <MetodosDePago />
        </div>
    )
}