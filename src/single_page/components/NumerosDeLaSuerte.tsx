interface Props {
    numbers: string[];
    emoji: string;
    numerosGanadores?: string[];
}

export const NumerosDeLaSuerte = ({ numbers, emoji = '', numerosGanadores = [] }: Props) => {
    const isEmptyMessage = numbers.length === 1 && numbers[0].includes("No hay números");

    return (
        <section className="py-20 px-4 lg:px-8 bg-gray-100">
            <div className="container mx-auto text-center">
                <p className="text-2xl lg:text-2xl tracking-tight mb-6">
                    Por la compra de tus imágenes participa gratis en las
                </p>
                <h1 className="text-2xl lg:text-5xl font-bold tracking-tight mb-15">
                    ¡Imágenes de la suerte!
                </h1>

                {isEmptyMessage ? (
                    <div className="flex items-center justify-center min-h-[200px] my-8">
                        <p className="text-xl lg:text-2xl text-gray-500 font-medium">
                            {numbers[0]}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
                        {numbers.map((number, index) => {
                            const esGanador = numerosGanadores.includes(number);

                            return (
                                <div key={index} className="flex flex-col items-center gap-2">
                                    <div className="relative">
                                        <p className={`text-2xl md:text-3xl font-montserrat font-bold ${esGanador ? 'text-gray-400' : 'text-amber-400'
                                            }`}>
                                            {emoji} {number}
                                        </p>
                                        {esGanador && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-[2px] bg-gray-600"></div>
                                            </div>
                                        )}
                                    </div>
                                    {esGanador && (
                                        <p className="text-sm text-gray-500">
                                            ¡Premio Entregado!
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <p className="text-2xl lg:text-2xl tracking-tight mt-10">
                    Si la imágen coincide con alguna de las
                </p>
                <p className="text-2xl lg:text-2xl tracking-tight">
                    imágenes de la suerte ganas de forma instantánea
                </p>
            </div>
        </section>
    )
}