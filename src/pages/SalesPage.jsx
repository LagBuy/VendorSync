import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../axios-instance/axios-instance";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import {
  CreditCard,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  Zap,
} from "lucide-react";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";

const SalesPage = () => {
  const [salesStats, setSalesStats] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    salesGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesStats = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/sales-stats");
        setSalesStats({
          totalRevenue: data.totalRevenue ?? 0,
          averageOrderValue: data.averageOrderValue ?? 0,
          conversionRate: data.conversionRate ?? 0,
          salesGrowth: data.salesGrowth ?? 0,
        });
        toast.success("Sales stats loaded successfully!", {
          position: "top-center",
          className: "custom-toast-success",
        });
      } catch {
        // Error handling without error messages
      } finally {
        setLoading(false);
      }
    };

    fetchSalesStats();
  }, []);

  // Custom Toast Styles
  const toastStyles = `
    .custom-toast-success {
      background: linear-gradient(135deg, #111827 0%, #000000 100%) !important;
      color: #22C55E !important;
      border: 1px solid #22C55E !important;
      border-radius: 16px !important;
      backdrop-filter: blur(10px) !important;
    }
    .Toastify__progress-bar {
      background: #EAB308 !important;
    }
  `;

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-black min-h-screen">
      {/* Inject custom toast styles */}
      <style>{toastStyles}</style>

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
        title="Sales Analytics"
        className="text-white font-bold text-4xl mb-8 relative z-10"
        icon={<TrendingUp className="text-yellow-500 mr-3" />}
      />

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <main className="max-w-7xl mx-auto py-8 px-6 lg:px-12 relative z-10">
        {/* SALES STATS */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", staggerChildren: 0.1 }}
        >
          {loading ? (
            <div className="col-span-4 flex justify-center py-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StatCard
                  name="Total Revenue"
                  icon={DollarSign}
                  value={`₦${Number(salesStats.totalRevenue).toLocaleString()}`}
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
                  name="Avg. Order Value"
                  icon={ShoppingCart}
                  value={`₦${Number(salesStats.averageOrderValue).toFixed(2)}`}
                  color="#22C55E"
                  className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 border border-gray-800 hover:border-green-500/50 text-white text-xl backdrop-blur-sm"
                  iconBg="bg-green-500/20"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StatCard
                  name="Conversion Rate"
                  icon={TrendingUp}
                  value={`${salesStats.conversionRate}%`}
                  color="#EAB308"
                  className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 border border-gray-800 hover:border-yellow-500/50 text-white text-xl backdrop-blur-sm"
                  iconBg="bg-yellow-500/20"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StatCard
                  name="Sales Growth"
                  icon={CreditCard}
                  value={`${salesStats.salesGrowth}%`}
                  color={salesStats.salesGrowth >= 0 ? "#22C55E" : "#EF4444"}
                  className={`bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl transition-all duration-500 border border-gray-800 text-white text-xl backdrop-blur-sm ${
                    salesStats.salesGrowth >= 0
                      ? "hover:shadow-green-500/20 hover:border-green-500/50"
                      : "hover:shadow-red-500/20 hover:border-red-500/50"
                  }`}
                  iconBg={
                    salesStats.salesGrowth >= 0
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }
                />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Main Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 mb-8 border border-gray-800 backdrop-blur-sm"
        >
          <div className="flex items-center mb-6">
            <Zap className="mr-3 text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-white">
              Sales Performance Overview
            </h3>
          </div>
          <SalesOverviewChart />
        </motion.div>

        {/* Secondary Charts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <ShoppingCart className="mr-3 text-green-500" size={24} />
              <h3 className="text-xl font-bold text-white">
                Sales by Category
              </h3>
            </div>
            <SalesByCategoryChart />
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <TrendingUp className="mr-3 text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-white">
                Daily Sales Trend
              </h3>
            </div>
            <DailySalesTrend />
          </div>
        </motion.div>

        {/* Performance Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="text-yellow-500 mr-3" size={24} />
              <div>
                <h4 className="text-lg font-bold text-white">
                  Sales Performance
                </h4>
                <p className="text-gray-400">
                  {salesStats.salesGrowth >= 0
                    ? "📈 Trending Up"
                    : "📉 Needs Attention"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-500">
                {salesStats.salesGrowth >= 0 ? "+" : ""}
                {salesStats.salesGrowth}%
              </p>
              <p className="text-sm text-gray-400">Growth Rate</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SalesPage;
