import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { TrendingUp, Users, Sparkles } from "lucide-react";

const UserGrowthChart = () => {
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalGrowth, setTotalGrowth] = useState(0);

  useEffect(() => {
    const fetchUserGrowth = async () => {
      setIsLoading(true);
      try {
        const { data: customers } = await axiosInstance.get("/customers/");

        // Group users by month
        const groupedByMonth = customers.reduce((acc, customer) => {
          const month = dayjs(
            customer.createdAt || customer.lastPurchase
          ).format("MMM");
          if (!acc[month]) {
            acc[month] = 0;
          }
          acc[month]++;
          return acc;
        }, {});

        // Convert to chart data
        const data = Object.keys(groupedByMonth).map((month) => ({
          month,
          users: groupedByMonth[month],
        }));

        // Sort months correctly
        const sortedMonths = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const sortedData = sortedMonths
          .map((month) => data.find((d) => d.month === month))
          .filter(Boolean);

        setUserGrowthData(sortedData);
        setTotalGrowth(sortedData.reduce((sum, item) => sum + item.users, 0));
      } catch (error) {
        console.error("Failed to fetch customer growth:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setUserGrowthData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserGrowth();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-black/95 p-3 border border-yellow-500 rounded-lg shadow-lg backdrop-blur-sm"
        >
          <p className="text-yellow-500 font-semibold text-sm mb-1">{label}</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-white text-sm font-medium">Users:</span>
            <span className="text-green-500 font-semibold text-sm">
              {payload[0].value}
            </span>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 border border-yellow-500/50 shadow-lg relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-full blur-sm" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-green-500/5 rounded-full blur-sm" />

      {/* Compact Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-yellow-500 rounded-lg">
              <TrendingUp className="text-black" size={14} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Customer Growth
              </h2>
              <p className="text-yellow-500 text-xs">Monthly Trend</p>
            </div>
          </div>

          {!isLoading && userGrowthData.length > 0 && (
            <motion.div
              className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-lg border border-green-500/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Users size={12} className="text-green-500" />
              <span className="text-white text-xs font-medium">
                {totalGrowth} Total
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Compact Chart Area */}
      <div className="relative z-10">
        {isLoading ? (
          <motion.div
            className="flex flex-col justify-center items-center h-[200px] border border-yellow-500/30 rounded-lg bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-6 w-6 border-2 border-yellow-500 border-t-transparent mb-2"
            />
            <p className="text-yellow-500 text-sm">Loading growth...</p>
          </motion.div>
        ) : userGrowthData.length > 0 ? (
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userGrowthData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke="#374151"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#EAB308"
                  strokeWidth={2}
                  dot={{
                    fill: "#22C55E",
                    stroke: "#000000",
                    strokeWidth: 1,
                    r: 3,
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#22C55E",
                    stroke: "#000000",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <motion.div
            className="flex flex-col justify-center items-center h-[200px] border border-dashed border-yellow-500/30 rounded-lg bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TrendingUp className="text-yellow-500 mb-2" size={20} />
            <p className="text-yellow-500 text-sm font-medium mb-1">No Data</p>
            <p className="text-gray-400 text-xs text-center px-4">
              Customer growth data will appear here
            </p>
          </motion.div>
        )}
      </div>

      {/* Growth Summary */}
      {!isLoading && userGrowthData.length > 0 && (
        <motion.div
          className="relative z-10 mt-3 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-2">
            <Sparkles size={12} className="text-yellow-500" />
            <span className="text-white text-xs font-medium">
              {userGrowthData.length} months tracked
            </span>
          </div>
          <div className="text-right">
            <span className="text-green-500 text-xs font-semibold">
              +{Math.max(...userGrowthData.map((d) => d.users))} peak
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserGrowthChart;
