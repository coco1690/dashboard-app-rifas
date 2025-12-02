import { RouterProvider } from "react-router"
import { appRouter } from "./app.router"
import Snowfall from 'react-snowfall'

export const RifasPageApp = () => {
  return (
    <>
      <Snowfall 
        color="#b0c4de"
        snowflakeCount={150}
        speed={[0.5, 2]}
        wind={[-0.5, 1]}
        radius={[0.5, 2]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />
      <RouterProvider router={appRouter}/>
    </>
  )
}