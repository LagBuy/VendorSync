import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { TrendingUp, Sparkles, BarChart3 } from "lucide-react";

// Premium Spinner component matching our theme
const Spinner = () => (
  <div className="flex flex-col items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"
    />
    <p className="text-gray-400 text-sm">Loading sales data...</p>
  </div>
);

const DailySalesTrend = () => {
  const [dailySalesData, setDailySalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sales data dynamically
  useEffect(() => {
    const fetchDailySalesData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/daily-sales");
        setDailySalesData(data);
        toast.success("Daily sales data loaded successfully ✅", {
          className: "custom-toast-success",
          autoClose: 3000
        });
      } catch (error) {
        console.error("Error fetching sales data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load daily sales data.", {
          className: "custom-toast-error",
          autoClose: 3000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDailySalesData();
  }, []);

  // Function to format time in hours and minutes
  const formatSaleTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${
      date.getMinutes() < 10 ? "0" : ""
    }${date.getMinutes()}`;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const saleTime = formatSaleTime(payload[0].payload.timestamp);
      return (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-yellow-500 font-bold text-sm mb-2">{label}</p>
          <p className="text-green-500 text-sm">
            Sales: <span className="text-white font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Time: {saleTime}
          </p>
        </div>
      );
    }
    return null;
  };

  // Function to get gradient color based on value
  const getBarColor = (value) => {
    const maxValue = Math.max(...dailySalesData.map(item => item.sales));
    const intensity = value / maxValue;
    
    if (intensity > 0.7) return "#22C55E"; // Green for high values
    if (intensity > 0.4) return "#EAB308"; // Yellow for medium values
    return "#F59E0B"; // Orange for lower values
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
          <BarChart3 className="mr-3 text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-white">Daily Sales Trend</h2>
        </div>
        {!loading && dailySalesData.length > 0 && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Real-time</span>
          </div>
        )}
      </div>

      {/* Loading State with Premium Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spinner />
        </div>
      ) : dailySalesData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="text-yellow-500" size={24} />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No Sales Data</h3>
          <p className="text-gray-400 max-w-xs">
            No sales data available for today. Sales will appear here as they occur.
          </p>
        </div>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={dailySalesData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="sales" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {dailySalesData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.sales, index)}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && dailySalesData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-800"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Total Periods</p>
              <p className="text-yellow-500 font-bold text-lg">{dailySalesData.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Peak Sales</p>
              <p className="text-green-500 font-bold text-lg">
                {Math.max(...dailySalesData.map(item => item.sales))}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Sales</p>
              <p className="text-yellow-500 font-bold text-lg">
                {dailySalesData.reduce((sum, item) => sum + item.sales, 0)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DailySalesTrend;