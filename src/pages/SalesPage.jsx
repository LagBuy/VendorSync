import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../axios-instance/axios-instance";
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
        });
      } catch (error) {
        console.error("Error fetching sales stats:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to load sales stats.",
          { position: "top-center" }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSalesStats();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Sales" />
      <ToastContainer />

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