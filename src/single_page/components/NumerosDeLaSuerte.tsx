interface Props {
    numbers: string[];
    emoji: string;
}

export const NumerosDeLaSuerte = ({ numbers, emoji = '' }: Props) => {
    // Verificar si es el mensaje de "no hay números"
    const isEmptyMessage = numbers.length === 1 && numbers[0].includes("No hay números");

    return (
        <section className="py-20 px-4 lg:px-8 bg-gray-100">
            <div className="container mx-auto text-center">
                <p className="text-2xl lg:text-2xl tracking-tight mb-6">
                    Por la compra de tu boleta participa gratis en los
                </p>
                <h1 className="text-2xl lg:text-5xl font-bold tracking-tight mb-15">
                    ¡Números de la suerte!
                </h1>

                {isEmptyMessage ? (
                    // Mensaje centrado cuando no hay números
                    <div className="flex items-center justify-center min-h-[200px] my-8">
                        <p className="text-xl lg:text-2xl text-gray-500 font-medium">
                            {numbers[0]}
                        </p>
                    </div>
                ) : (
                    // Grid normal de números
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
                        {numbers.map((number, index) => (
                            <p key={index} className="text-3xl text-amber-400 font-montserrat font-bold">
                                {emoji} {number}
                            </p>
                        ))}
                    </div>
                )}

                <p className="text-2xl lg:text-2xl tracking-tight mt-10">
                    Si el número de tu boleta coincide con alguno de los
                </p>
                <p className="text-2xl lg:text-2xl tracking-tight">
                    números de la suerte ganas de forma instantánea
                </p>
            </div>
        </section>
    )
}