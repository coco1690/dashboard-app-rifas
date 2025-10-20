import { CustomLogo } from "@/components/custom/CustomLogo"
import { CustomHeader } from "@/single_page/components/CustomHeader"
import { Outlet } from "react-router"

const AuthLayout = () => {
  return (
    <>
      <CustomHeader />
      <div className="flex min-h-svh flex-col items-center justify-center bg-gray-900 p-6 md:p-10">
        <div>
          <div className="flex flex-col items-center text-center mb-10">
                <CustomLogo />
              
              </div>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AuthLayout
