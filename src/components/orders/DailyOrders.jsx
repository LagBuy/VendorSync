import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { TrendingUp, Sparkles } from "lucide-react";

const DailyOrders = () => {
  const [dailyOrdersData, setDailyOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDailyOrders = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/orders/");
        let orders = [];
        if (Array.isArray(data)) {
          orders = data;
        } else {
          console.error("Unexpected order data format:", data);
          toast.error("Unexpected data format from server. Please try again.");
        }

        const ordersByTimestamp = {};

        orders.forEach((order) => {
          const createdAt = new Date(order.createdAt);

          const date = createdAt.toLocaleDateString("en-GB"); // dd/mm/yyyy
          const time = createdAt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }); // hh:mm AM/PM

          const fullTimestamp = `${date}, ${time}`;

          ordersByTimestamp[fullTimestamp] =
            (ordersByTimestamp[fullTimestamp] || 0) + 1;
        });

        const chartData = Object.entries(ordersByTimestamp).map(
          ([timestamp, count]) => ({
            date: timestamp,
            orders: count,
          })
        );

        // Sort by real date and time
        chartData.sort((a, b) => {
          const [dateA, timeA] = a.date.split(", ");
          const [dayA, monthA, yearA] = dateA.split("/").map(Number);
          const dateTimeA = new Date(`${yearA}-${monthA}-${dayA} ${timeA}`);

          const [dateB, timeB] = b.date.split(", ");
          const [dayB, monthB, yearB] = dateB.split("/").map(Number);
          const dateTimeB = new Date(`${yearB}-${monthB}-${dayB} ${timeB}`);

          return dateTimeA - dateTimeB;
        });

        setDailyOrdersData(chartData);
      } catch (error) {
        console.error("Error fetching daily orders:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load daily orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyOrders();
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-yellow-500 font-bold text-sm mb-2">{label}</p>
          <p className="text-green-500 text-sm">
            Orders: <span className="text-white font-semibold">{payload[0].value}</span>
          </p>
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
          <TrendingUp className="mr-3 text-green-500" size={24} />
          <h2 className="text-xl font-bold text-white">Daily Orders Trend</h2>
        </div>
        {!isLoading && dailyOrdersData.length > 0 && (
          <div className="flex items-center text-yellow-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Live Data</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-400">Loading order data...</p>
        </div>
      ) : dailyOrdersData.length > 0 ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dailyOrdersData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  color: '#E5E7EB'
                }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#EAB308"
                strokeWidth={3}
                dot={{ fill: '#EAB308', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#22C55E', stroke: '#EAB308', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="text-yellow-500" size={24} />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No Order Data</h3>
          <p className="text-gray-400 max-w-xs">
            No order data available for the selected period. Orders will appear here as they come in.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {!isLoading && dailyOrdersData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-800"
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Total Data Points</p>
              <p className="text-yellow-500 font-bold text-lg">{dailyOrdersData.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Peak Orders</p>
              <p className="text-green-500 font-bold text-lg">
                {Math.max(...dailyOrdersData.map(item => item.orders))}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DailyOrders;