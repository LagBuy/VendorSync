import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  Eye,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

// Custom Naira SVG icon
const NairaIcon = ({ className = "size-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18V6m0 6h12M18 6v12M6 6l12 12M6 18l12-12"
    />
  </svg>
);

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
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOverviewData = async () => {
      setIsLoading(true);
      try {
        const { data: result } = await axiosInstance.get("/dashboard-overview/");
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
        setError(false);
      } catch (error) {
        console.error("Failed to fetch overview data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setError(true);
        toast.error(error.response?.data?.message || "Failed to load overview data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  const overviewData = [
    {
      name: "Revenue",
      value: isLoading || error
        ? "₦0.00"
        : `₦${data.revenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      change: data.revenueChange,
      icon: NairaIcon,
    },
    {
      name: "Customers",
      value: isLoading || error ? "0" : data.customers.toLocaleString(),
      change: data.customerChange,
      icon: Users,
    },
    {
      name: "Orders",
      value: isLoading || error ? "0" : data.orders.toLocaleString(),
      change: data.orderChange,
      icon: ShoppingBag,
    },
    {
      name: "Page Views",
      value: isLoading || error ? "0" : data.views.toLocaleString(),
      change: data.viewChange,
      icon: Eye,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">{item.name}</h3>
              <p className="mt-1 text-xl font-semibold text-gray-100">
                {isLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : error ? (
                  "N/A"
                ) : (
                  item.value
                )}
              </p>
            </div>

            <div
              className={`p-3 rounded-full bg-opacity-20 ${
                item.change >= 0 ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <item.icon
                className={`size-6 ${
                  item.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              />
            </div>
          </div>

          <div
            className={`mt-4 flex items-center ${
              item.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {isLoading || error ? (
              <span className="text-sm text-gray-400">N/A</span>
            ) : (
              <>
                {item.change >= 0 ? (
                  <ArrowUpRight size="20" />
                ) : (
                  <ArrowDownRight size="20" />
                )}
                <span className="ml-1 text-sm font-medium">
                  {Math.abs(item.change)}%
                </span>
                <span className="ml-2 text-sm text-gray-400">vs last period</span>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;