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
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

// Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin border-t-4 border-b-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
  </div>
);

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      // Assuming the backend accepts a range query parameter
      const { data } = await axiosInstance.get(`/sales?range=${selectedTimeRange.toLowerCase().replace(" ", "")}`);
      const formattedData = data.map((item, index) => ({
        name: item.month || `Period ${index + 1}`,
        sales: item.sales,
      }));
      setSalesData(formattedData);
      toast.success("Sales data loaded successfully ✅");
    } catch (error) {
      console.error("Error fetching sales data:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to load sales data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [selectedTimeRange]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Sales Overview</h2>
        <select
          className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="h-80">
        {loading ? (
          <div className="flex justify-center py-10 text-white">
            <Spinner />
          </div>
        ) : salesData.length === 0 ? (
          <div className="flex justify-center items-center h-[300px] text-gray-400">
            No sales data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Retry Button for Empty Data */}
      {salesData.length === 0 && !loading && (
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchSalesData}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SalesOverviewChart;