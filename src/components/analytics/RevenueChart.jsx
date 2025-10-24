import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { Target, TrendingUp, Sparkles, Calendar } from "lucide-react";

const RevenueChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("One Month");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputTarget, setInputTarget] = useState("");

  const timeRanges = [
    "Today",
    "3 Days",
    "One Week",
    "14 Days",
    "One Month",
    "3 Months",
    "6 Months",
    "9 Months",
    "One Year",
  ];

  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoading(true);
      try {
        const { data: result } = await axiosInstance.get("/revenue/", {
          params: { range: selectedTimeRange },
        });
        const chartData = Array.isArray(result)
          ? result.map((item) => ({
              period: item.period,
              revenue: item.revenue,
              target: item.target,
            }))
          : [];
        setData(chartData);
      } catch {
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, [selectedTimeRange]);

  const handleTargetSubmit = (e) => {
    e.preventDefault();
    setInputTarget("");
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border-2 border-green-400/50 backdrop-blur-sm relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-yellow-400"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500 rounded-full opacity-5 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500 rounded-full opacity-5 blur-xl"></div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 relative z-10">
        <div className="flex items-center">
          <Target className="mr-3 text-yellow-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">Revenue Analytics</h2>
            <p className="text-gray-400 text-sm">
              Track performance against targets
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Target Input */}
          <form
            onSubmit={handleTargetSubmit}
            className="flex gap-3 items-center"
          >
            <div className="relative">
              <input
                type="number"
                placeholder={`Set ${selectedTimeRange} target...`}
                value={inputTarget}
                onChange={(e) => setInputTarget(e.target.value)}
                className="bg-gray-800 text-white rounded-xl px-4 py-3 pl-12 w-48 focus:outline-none focus:ring-2 focus:ring-green-400 border-2 border-gray-700 focus:border-green-400 transition-all duration-300"
              />
              <TrendingUp
                className="absolute left-4 top-3 text-gray-400"
                size={18}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-1 rounded-xl font-semibold hover:from-green-400 hover:to-green-500 transform hover:scale-105 transition-all duration-300 shadow-lg border-1 border-green-400"
            >
              Set Target
            </button>
          </form>

          {/* Time Range Selector */}
          <div className="relative">
            <select
              className="bg-gray-800 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 border-2 border-gray-700 focus:border-yellow-400 transition-all duration-300 appearance-none cursor-pointer"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              {timeRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <Calendar
              className="absolute right-3 top-3 text-yellow-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"
            />
            <p className="text-gray-400 text-lg">Loading revenue data...</p>
          </div>
        ) : data.length > 0 ? (
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="targetGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="period"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    border: "1px solid #22C55E",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    color: "#FFFFFF",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: "#E5E7EB",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#EAB308"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                  name="Actual Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#22C55E"
                  fill="url(#targetGradient)"
                  strokeWidth={3}
                  name="Revenue Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="text-yellow-500" size={32} />
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">
              No Revenue Data
            </h3>
            <p className="text-gray-400 max-w-md">
              Revenue data will appear here once sales are recorded for the
              selected period.
            </p>
          </div>
        )}
      </div>

      {/* Performance Summary */}
      {!isLoading && data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total Periods</p>
            <p className="text-yellow-500 font-bold text-xl">{data.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Time Range</p>
            <p className="text-green-500 font-bold text-xl">
              {selectedTimeRange}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Status</p>
            <div className="flex items-center justify-center text-yellow-500">
              <Sparkles size={16} className="mr-1" />
              <span className="font-bold">Active</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RevenueChart;
