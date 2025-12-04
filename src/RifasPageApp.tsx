import { RouterProvider } from "react-router"
import { appRouter } from "./app.router"


export const RifasPageApp = () => {
  return (
    <RouterProvider router={appRouter}/>
  )
}
