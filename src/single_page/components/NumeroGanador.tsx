

interface Props{
    numberWin: string
}

export const NumeroGanador = ({numberWin}:Props) => {
  return (
     <section className="py-10 px-4 lg:px-8 bg-gray-900">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl lg:text-2xl font-bold tracking-tight mb-6 text-white">
            Numero ganador:
          </h1>
          <p className="text-3xl text-amber-400 mb-8 max-w-2xl mx-auto">
            {numberWin}
          </p>         
        </div>
      </section>
  )
}
