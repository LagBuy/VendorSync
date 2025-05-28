import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const RevenueChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("One Month");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputTarget, setInputTarget] = useState("");
  const [customTargets, setCustomTargets] = useState({
    Today: null,
    "3 Days": null,
    "One Week": null,
    "14 Days": null,
    "One Month": null,
    "3 Months": null,
    "6 Months": null,
    "9 Months": null,
    "One Year": null,
  });
  const [error, setError] = useState("");

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
              target: customTargets[selectedTimeRange] ?? item.target,
            }))
          : [];
        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch revenue data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setData([]);
        toast.error(error.response?.data?.message || "Failed to load revenue data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, [selectedTimeRange, customTargets]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleTargetSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(inputTarget);
    if (!inputTarget || isNaN(value) || value <= 0) {
      setError("Please enter a positive target for the selected time frame.");
      return;
    }
    setCustomTargets((prev) => ({
      ...prev,
      [selectedTimeRange]: value,
    }));
    setInputTarget("");
    setError("");
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-100">
          Revenue vs Target
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <form
            onSubmit={handleTargetSubmit}
            className="flex gap-2 items-center"
          >
            <input
              type="number"
              placeholder={`Target for ${selectedTimeRange}`}
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              className="bg-gray-700 text-white rounded-md px-3 py-1 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </form>

          <select
            className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option>Today</option>
            <option>3 Days</option>
            <option>One Week</option>
            <option>14 Days</option>
            <option>One Month</option>
            <option>3 Months</option>
            <option>6 Months</option>
            <option>9 Months</option>
            <option>One Year</option>
          </select>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-2 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center items-center h-[400px] text-gray-400">
          Loading...
        </div>
      ) : data.length > 0 ? (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="period" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[400px] text-gray-400">
          No revenue data available.
        </div>
      )}
    </motion.div>
  );
};

export default RevenueChart;