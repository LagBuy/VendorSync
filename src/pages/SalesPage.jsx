import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
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
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        const response = await fetch("/api/sales-stats"); // Replace with your actual API endpoint
        if (!response.ok) throw new Error("Failed to fetch sales stats");
        const data = await response.json();
        setSalesStats({
          totalRevenue: data.totalRevenue,
          averageOrderValue: data.averageOrderValue,
          conversionRate: data.conversionRate,
          salesGrowth: data.salesGrowth,
        });
      } catch (err) {
        console.error("Error fetching sales stats:", err);
        setToast({
          show: true,
          message: "❌ Failed to load sales stats. Please try again.",
          type: "error",
        });
        setTimeout(() => {
          setToast({ show: false, message: "", type: "" });
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesStats();
  }, []);

  const handleCloseToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Sales" />

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`animate-pulse absolute top-4 right-4 px-4 py-2 rounded shadow-md z-50 flex items-center justify-between gap-2 min-w-[280px] ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={handleCloseToast}
            className="text-white font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* SALES STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {loading ? (
            <div className="col-span-4 text-center text-white">Loading...</div>
          ) : (
            <>
              <StatCard
                name="Total Revenue"
                icon={DollarSign}
                value={`₦${Number(salesStats.totalRevenue).toLocaleString()}`}
                color="#6366F1"
              />
              <StatCard
                name="Avg. Order Value"
                icon={ShoppingCart}
                value={`₦${Number(salesStats.averageOrderValue).toFixed(2)}`}
                color="#10B981"
              />
              <StatCard
                name="Conversion Rate"
                icon={TrendingUp}
                value={`${salesStats.conversionRate}%`}
                color="#F59E0B"
              />
              <StatCard
                name="Sales Growth"
                icon={CreditCard}
                value={`${salesStats.salesGrowth}%`}
                color="#EF4444"
              />
            </>
          )}
        </motion.div>
        <SalesOverviewChart />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pt-6">
          <SalesByCategoryChart />
          <DailySalesTrend />
        </div>
      </main>
    </div>
  );
};

export default SalesPage;
