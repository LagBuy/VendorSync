import { useEffect, useState } from "react";
import { BarChart2, ShoppingBag, Users, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { axiosInstance } from "../axios-instance/axios-instance";

const OverViewPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    newCustomers: 0,
    totalProducts: 0,
    conversionRate: 0,
  });
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const [salesRes, customersRes, prodRes] = await Promise.all([
        axiosInstance.get("/vendors/totalsale/"),
        axiosInstance.get("/vendors/customers-overview/"),
        axiosInstance.get("/vendors/totalproduct/"),
      ]);
      console.log("Total sales fetched successfully:", salesRes.data);
      console.log(
        "Customers overview fetched successfully:",
        customersRes.data
      );
      console.log("Total products fetched successfully:", prodRes.data);

      const newCustomers = customersRes.data.newToday || 0;
      setStats({
        totalSales: salesRes.data.totalSale || 0,
        newCustomers,
        totalProducts: prodRes.data.totalProducts || 0,
        conversionRate: calculateConversionRate(newCustomers),
      });
    } catch (err) {
      console.error("Error fetching overview data:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setToast({
        show: true,
        message: "⚠️ Failed to load overview stats. Please try again.",
      });
      setTimeout(() => setToast({ show: false, message: "" }), 4000);
      setStats({
        totalSales: 0,
        newCustomers: 0,
        totalProducts: 0,
        conversionRate: "0.00",
      });
    }
    setLoading(false);
  };

  const fetchExchangeRate = async () => {
    try {
      const exchangeResponse = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      if (!exchangeResponse.ok)
        throw new Error("Failed to fetch exchange rate");
      const exchangeData = await exchangeResponse.json();
      setExchangeRate(exchangeData.rates.NGN || 0);
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
    }
  };

  useEffect(() => {
    fetchOverviewData();
    fetchExchangeRate();
  }, []);

  const convertToNaira = (usdAmount) => {
    return Math.round(usdAmount * exchangeRate);
  };

  const calculateConversionRate = (newCustomers, totalVisitors = 1000) => {
    return totalVisitors
      ? ((newCustomers / totalVisitors) * 100).toFixed(2)
      : "0.00";
  };

  const handleCloseToast = () => {
    setToast({ show: false, message: "" });
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-black min-h-screen">
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
        title="Overview Dashboard"
        className="text-white font-bold text-4xl mb-8 relative z-10"
        icon={<Sparkles className="text-yellow-500 mr-3" />}
      />

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 right-4 px-6 py-4 bg-gradient-to-r from-red-500/90 to-red-600/90 text-white z-50 shadow-2xl rounded-2xl flex items-center justify-between gap-4 max-w-md w-full mx-auto backdrop-blur-sm border border-red-400"
          >
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={handleCloseToast}
              className="font-bold text-lg text-white hover:text-yellow-300 transition-colors duration-200 flex-shrink-0"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto py-8 px-6 lg:px-12 relative z-10">
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", staggerChildren: 0.1 }}
        >
          {loading ? (
            <div className="flex justify-center py-10 col-span-full">
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
                  name="Total Sales"
                  icon={Zap}
                  value={`₦${convertToNaira(
                    stats.totalSales
                  ).toLocaleString()}`}
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
                  name="New Customers"
                  icon={Users}
                  value={stats.newCustomers}
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
                  name="Total Products"
                  icon={ShoppingBag}
                  value={stats.totalProducts}
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
                  name="Conversion Rate"
                  icon={BarChart2}
                  value={`${stats.conversionRate}%`}
                  color="#22C55E"
                  className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 border border-gray-800 hover:border-green-500/50 text-white text-xl backdrop-blur-sm"
                  iconBg="bg-green-500/20"
                />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <BarChart2 className="mr-3 text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-white">Sales Overview</h3>
            </div>
            <SalesOverviewChart />
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <ShoppingBag className="mr-3 text-green-500" size={24} />
              <h3 className="text-xl font-bold text-white">
                Category Distribution
              </h3>
            </div>
            <CategoryDistributionChart />
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <Users className="mr-3 text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-white">Sales Channels</h3>
            </div>
            <SalesChannelChart />
          </div>
        </motion.div>

        {/* Exchange Rate Banner */}
        {exchangeRate > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-2xl p-4 mt-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="text-yellow-500 mr-3" size={20} />
                <p className="text-white font-semibold">
                  Current Exchange Rate:{" "}
                  <span className="text-green-500">
                    1 USD = {exchangeRate?.toFixed(2)} NGN
                  </span>
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                Real-time rates applied to all calculations
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default OverViewPage;
