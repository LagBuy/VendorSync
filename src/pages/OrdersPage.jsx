import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
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
        let orders = [];
        if (Array.isArray(data)) {
          orders = data;
        } else {
          orders = [];
        }

        setTotalOrders(orders.length);

        const pending = orders.filter((order) => order.status === "pending");
        const completed = orders.filter(
          (order) => order.status === "completed"
        );

        setPendingOrders(pending.length);
        setCompletedOrders(completed.length);

        const revenue = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
        setTotalRevenue(revenue);
      } catch {
        // Error handling without error messages
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
    <div className="flex-1 relative z-10 overflow-auto bg-black min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <Header
        title="Order Management"
        className="text-white font-bold text-4xl mb-8 relative z-10"
        icon={<Package className="text-yellow-500 mr-3" />}
      />

      <main className="max-w-7xl mx-auto py-8 px-6 lg:px-12 relative z-10">
        {/* Stats Grid */}
        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-gray-800 backdrop-blur-sm"
              >
                <div className="h-6 bg-gray-800 rounded w-1/2 mb-4 animate-pulse"></div>
                <div className="h-8 bg-gray-800 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              staggerChildren: 0.1,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatCard
                name="Total Orders"
                icon={ShoppingBag}
                value={totalOrders}
                color="#EAB308"
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 border border-gray-800 hover:border-yellow-500/50 text-white text-xl backdrop-blur-sm"
                iconBg="bg-yellow-500/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <StatCard
                name="Pending Orders"
                icon={Clock}
                value={pendingOrders}
                color="#EAB308"
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 border border-gray-800 hover:border-yellow-500/50 text-white text-xl backdrop-blur-sm"
                iconBg="bg-yellow-500/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StatCard
                name="Completed Orders"
                icon={CheckCircle}
                value={completedOrders}
                color="#22C55E"
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 border border-gray-800 hover:border-green-500/50 text-white text-xl backdrop-blur-sm"
                iconBg="bg-green-500/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <StatCard
                name="Total Revenue"
                icon={DollarSign}
                value={formatCurrency(totalRevenue)}
                color="#22C55E"
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 border border-gray-800 hover:border-green-500/50 text-white text-xl backdrop-blur-sm"
                iconBg="bg-green-500/20"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {isLoading ? (
            <>
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-gray-800 backdrop-blur-sm h-96 animate-pulse"></div>
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-gray-800 backdrop-blur-sm h-96 animate-pulse"></div>
            </>
          ) : (
            <>
              {/* Orders Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
              >
                <div className="flex items-center mb-6">
                  <ShoppingBag className="mr-3 text-yellow-500" size={24} />
                  <h3 className="text-xl font-bold text-white">
                    Order Management
                  </h3>
                </div>
                <OrdersTable />
              </motion.div>

              {/* Daily Orders Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
              >
                <div className="flex items-center mb-6">
                  <TrendingUp className="mr-3 text-green-500" size={24} />
                  <h3 className="text-xl font-bold text-white">Daily Orders</h3>
                </div>
                <DailyOrders />
              </motion.div>

              {/* Order Distribution Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
              >
                <div className="flex items-center mb-6">
                  <Package className="mr-3 text-yellow-500" size={24} />
                  <h3 className="text-xl font-bold text-white">
                    Order Distribution
                  </h3>
                </div>
                <OrderDistribution />
              </motion.div>
            </>
          )}
        </div>

        {/* Performance Summary Banner */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="text-yellow-500 mr-3" size={24} />
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Order Performance
                  </h4>
                  <p className="text-gray-400">
                    {completedOrders > 0 && totalOrders > 0
                      ? `Completion Rate: ${(
                          (completedOrders / totalOrders) *
                          100
                        ).toFixed(1)}%`
                      : "Track your order completion rate"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-500">
                  {pendingOrders}
                </p>
                <p className="text-sm text-gray-400">Pending Actions</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;
