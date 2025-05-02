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

// Helper function to generate mock data
const generateData = (labels, baseRevenue, targetValue) => {
  return labels.map((label, i) => {
    const revenue = baseRevenue + i * 200;
    return {
      period: label,
      revenue,
      target: targetValue !== null ? targetValue : Math.round(revenue * 0.9),
    };
  });
};

const getRevenueData = (range, customTargets) => {
  const now = new Date();
  const customTarget = customTargets[range] || null;

  const formatDay = (offset) => {
    const day = new Date(now);
    day.setDate(now.getDate() - offset);
    return day.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatWeek = (count) =>
    Array.from({ length: count }, (_, i) => `Week ${i + 1}`);

  const formatMonth = () => [
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

  switch (range) {
    case "Today":
      return generateData([formatDay(0)], 300, customTarget);
    case "3 Days":
      return generateData(
        [0, 1, 2].map(formatDay).reverse(),
        300,
        customTarget
      );
    case "One Week":
      return generateData(
        Array.from({ length: 7 }, (_, i) => formatDay(i)).reverse(),
        300,
        customTarget
      );
    case "14 Days":
      return generateData(
        Array.from({ length: 14 }, (_, i) => formatDay(i)).reverse(),
        300,
        customTarget
      );
    case "One Month":
      return generateData(
        Array.from({ length: 30 }, (_, i) => formatDay(i)).reverse(),
        300,
        customTarget
      );
    case "3 Months":
      return generateData(formatWeek(12), 1000, customTarget);
    case "6 Months":
      return generateData(formatWeek(24), 1200, customTarget);
    case "9 Months":
      return generateData(formatWeek(36), 1300, customTarget);
    case "One Year":
    default:
      return generateData(formatMonth(), 4000, customTarget);
  }
};

const RevenueChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("One Month");
  const [data, setData] = useState([]);
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
    const chartData = getRevenueData(selectedTimeRange, customTargets);
    setData(chartData);
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
    </motion.div>
  );
};

export default RevenueChart;
