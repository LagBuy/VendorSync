import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  Eye,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

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

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await fetch("https://your-backend.com/api/overview");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
      }
    };

    fetchOverviewData();
  }, []);

  const overviewData = [
    {
      name: "Revenue",
      value: `₦${data.revenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      change: data.revenueChange,
      icon: NairaIcon,
    },
    {
      name: "Customers",
      value: data.customers.toLocaleString(),
      change: data.customerChange,
      icon: Users,
    },
    {
      name: "Orders",
      value: data.orders.toLocaleString(),
      change: data.orderChange,
      icon: ShoppingBag,
    },
    {
      name: "Page Views",
      value: data.views.toLocaleString(),
      change: data.viewChange,
      icon: Eye,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg
            rounded-xl p-6 border border-gray-700
          "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">{item.name}</h3>
              <p className="mt-1 text-xl font-semibold text-gray-100">
                {item.value}
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
            {item.change >= 0 ? (
              <ArrowUpRight size="20" />
            ) : (
              <ArrowDownRight size="20" />
            )}
            <span className="ml-1 text-sm font-medium">
              {Math.abs(item.change)}%
            </span>
            <span className="ml-2 text-sm text-gray-400">vs last period</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;
