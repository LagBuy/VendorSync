import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  Eye,
  TrendingUp,
  TrendingDown,
  Sparkles,
  DollarSign,
} from "lucide-react";
import { axiosInstance } from "../../axios-instance/axios-instance";

const OverviewCards = () => {
  const [data, setData] = useState({
    revenue: 0,
    revenueChange: 0,
    customers: 0,
    customerChange: 0,
    orders: 0,
    orderChange: 0,
    views: 0,
    viewChange: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      setIsLoading(true);
      try {
        const { data: result } = await axiosInstance.get(
          "/dashboard-overview/"
        );
        setData({
          revenue: result.revenue || 0,
          revenueChange: result.revenueChange || 0,
          customers: result.customers || 0,
          customerChange: result.customerChange || 0,
          orders: result.orders || 0,
          orderChange: result.orderChange || 0,
          views: result.views || 0,
          viewChange: result.viewChange || 0,
        });
      } catch {
        // Error handling without error messages
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const overviewData = [
    {
      name: "Total Revenue",
      value: isLoading
        ? "₦0.00"
        : `₦${data.revenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      change: data.revenueChange,
      icon: DollarSign,
      color: "#EAB308",
      gradient: "from-yellow-500/10 to-yellow-600/10",
      border: "border-yellow-500/30",
    },
    {
      name: "Customers",
      value: isLoading ? "0" : data.customers.toLocaleString(),
      change: data.customerChange,
      icon: Users,
      color: "#22C55E",
      gradient: "from-green-500/10 to-green-600/10",
      border: "border-green-500/30",
    },
    {
      name: "Total Orders",
      value: isLoading ? "0" : data.orders.toLocaleString(),
      change: data.orderChange,
      icon: ShoppingBag,
      color: "#EAB308",
      gradient: "from-yellow-500/10 to-yellow-600/10",
      border: "border-yellow-500/30",
    },
    {
      name: "Page Views",
      value: isLoading ? "0" : data.views.toLocaleString(),
      change: data.viewChange,
      icon: Eye,
      color: "#22C55E",
      gradient: "from-green-500/10 to-green-600/10",
      border: "border-green-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className={`bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border-2 ${
            item.border
          } shadow-2xl backdrop-blur-sm hover:shadow-${item.color
            .split("#")[1]
            .toLowerCase()}/20 transition-all duration-500 group`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.6,
            ease: "easeOut",
          }}
          whileHover={{
            scale: 1.02,
            y: -5,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border}`}
            >
              <item.icon className={`size-6`} style={{ color: item.color }} />
            </div>
            {!isLoading && (
              <div
                className={`flex items-center text-sm font-semibold ${
                  item.change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.change >= 0 ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                <span>{Math.abs(item.change)}%</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
              {item.name}
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-white">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {item.value}
                </span>
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">
                {item.change >= 0 ? "Increased" : "Decreased"} this period
              </span>
              {!isLoading && item.change >= 0 && (
                <Sparkles size={14} className="text-yellow-500" />
              )}
            </div>
          </div>

          {/* Animated Background Effect */}
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`}
          ></div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;
