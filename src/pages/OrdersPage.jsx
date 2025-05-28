import { useEffect, useState } from "react";
import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { axiosInstance } from "../axios-instance/axios-instance";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";

const OrdersPage = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStats = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/orders/");
        const orders = data;

        setTotalOrders(orders.length);

        const pending = orders.filter((order) => order.status === "pending");
        const completed = orders.filter(
          (order) => order.status === "completed"
        );

        setPendingOrders(pending.length);
        setCompletedOrders(completed.length);

        const revenue = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Failed to fetch order stats:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Orders"} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 animate-pulse rounded-lg p-6"
              >
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Orders"
              icon={ShoppingBag}
              value={totalOrders}
              color="#6366F1"
            />
            <StatCard
              name="Pending Orders"
              icon={Clock}
              value={pendingOrders}
              color="#F59E0B"
            />
            <StatCard
              name="Completed Orders"
              icon={CheckCircle}
              value={completedOrders}
              color="#10B981"
            />
            <StatCard
              name="Total Revenue"
              icon={DollarSign}
              value={formatCurrency(totalRevenue)}
              color="#EF4444"
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {isLoading ? (
            <>
              <div className="bg-gray-800 animate-pulse rounded-lg p-6 h-64"></div>
              <div className="bg-gray-800 animate-pulse rounded-lg p-6 h-64"></div>
            </>
          ) : (
            <>
              <OrdersTable />
              <DailyOrders />
              <OrderDistribution />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;