import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { TrendingUp, Sparkles, BarChart3, Zap } from "lucide-react";

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);

  const fetchSalesData = async () => {
    const MIN_SPINNER_TIME = 3000;
    const startTime = Date.now();

    setLoading(true);
    try {
      console.log("Fetching sales data from /vendors/salespermonth/...");
      const { data } = await axiosInstance.get("/vendors/salespermonth/");
      console.log("Sales data fetched successfully:", data);

      // Format response to [{ name: string, sales: number }, ...]
      const formatted = Array.isArray(data)
        ? data.map((item, index) => ({
            name: item.month || item.name || `Month ${index + 1}`,
            sales: Number(item.sales) || Number(item.total) || 0,
          }))
        : [];

      setSalesData(formatted);

      // Calculate total sales and growth rate
      const total = formatted.reduce((sum, item) => sum + item.sales, 0);
      setTotalSales(total);

      if (formatted.length > 1) {
        const firstMonth = formatted[0].sales;
        const lastMonth = formatted[formatted.length - 1].sales;
        const growth =
          firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;
        setGrowthRate(growth);
      }

      toast.success("Sales overview data loaded successfully ✅", {
        className: "custom-toast-success",
      });
    } catch (error) {
      console.error("Error fetching sales data:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(
        error.response?.data?.message || "Failed to load sales data.",
        {
          className: "custom-toast-error",
        }
      );
      setSalesData([]); // Set empty array on error
      setTotalSales(0);
      setGrowthRate(0);
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MIN_SPINNER_TIME - elapsed);
      setTimeout(() => setLoading(false), delay);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    fetchSalesData();
  };

  // Premium Spinner component
  const Spinner = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"
      />
      <p className="text-gray-400 text-sm">Analyzing sales trends...</p>
    </div>
  );

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-yellow-500 font-bold text-sm mb-2">{label}</p>
          <p className="text-green-500 text-sm">
            Sales:{" "}
            <span className="text-white font-semibold">
              ${payload[0].value.toLocaleString()}
            </span>
          </p>
          {payload[0].payload.trend && (
            <p className="text-gray-400 text-xs mt-1">
              Trend: {payload[0].payload.trend}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="mr-3 text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-white">Sales Performance</h2>
        </div>
        {!loading && salesData.length > 0 && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Overview</span>
          </div>
        )}
      </div>

      <div className="h-80">
        {loading ? (
          <Spinner />
        ) : salesData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="text-yellow-500" size={24} />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No Sales Data
            </h3>
            <p className="text-gray-400 max-w-xs mb-4">
              No sales data available for overview. Data will appear here as
              sales are recorded.
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart key={salesData.length} data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey={"name"}
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: "#9CA3AF" }}
                axisLine={{ stroke: "#4B5563" }}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: "#9CA3AF" }}
                axisLine={{ stroke: "#4B5563" }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="none"
                fill="url(#salesGradient)"
                fillOpacity={1}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#EAB308"
                strokeWidth={3}
                dot={{
                  fill: "#22C55E",
                  strokeWidth: 2,
                  r: 5,
                  stroke: "#111827",
                }}
                activeDot={{
                  r: 8,
                  fill: "#22C55E",
                  stroke: "#EAB308",
                  strokeWidth: 2,
                  className: "shadow-lg",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Enhanced Summary Section */}
      {!loading && salesData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-800"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Total Period</p>
              <p className="text-yellow-500 font-bold text-lg">
                {salesData.length} months
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Sales</p>
              <p className="text-green-500 font-bold text-lg">
                ${totalSales.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Growth</p>
              <p
                className={`font-bold text-lg ${
                  growthRate >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {growthRate >= 0 ? "+" : ""}
                {growthRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-green-500/10 rounded-xl border border-yellow-500/30">
            <div className="flex items-center justify-center">
              <Zap className="text-yellow-500 mr-2" size={16} />
              <p className="text-gray-400 text-sm">
                {growthRate >= 0 ? "📈 Positive trend" : "📉 Needs attention"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SalesOverviewChart;
