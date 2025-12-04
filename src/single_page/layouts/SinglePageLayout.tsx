import { Outlet } from "react-router"
import { CustomHeader } from "../components/CustomHeader"
import { CustomFooter } from "../components/CustomFooter"
import Snowfall from "react-snowfall"




export const SinglePageLayout = () => {
  return (
     <div className="min-h-screen bg-background">
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
      <CustomHeader/>
      <Outlet/>
      <CustomFooter/>
    </div>
  )
}
