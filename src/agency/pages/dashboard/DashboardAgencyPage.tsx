// import QuickActions from "@/admin/components/QuickActions";
import StatCard from "@/admin/components/StatCard";
import { CustomTitle } from "@/components/custom/CustomTitle";
import { Users, DollarSign, ShoppingCart, TrendingUp} from "lucide-react";

  const stats = [
    {
      title: 'Total Users',
      value: '24,567',
      change: '+12.5% from last month',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Revenue',
      value: '$84,230',
      change: '+8.2% from last month',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Orders',
      value: '1,429',
      change: '-2.4% from last month',
      changeType: 'negative' as const,
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+0.3% from last month',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];




export const DashboardAgencyPage = () => {
  return (
    <>
       {/* Welcome Section */}
         <CustomTitle
         emoji="🚀"
         title="Dashboard"
         subtitle="Aqui puedes ver el estado de tu negocio"
         />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts and Activity Section */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            <div className="space-y-6">
              <QuickActions />
            </div>
          </div> */}
    </>
  )
}
