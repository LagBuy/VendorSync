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

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalesData = async () => {
    const MIN_SPINNER_TIME = 3000;
    const startTime = Date.now();

    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/dashboard/sales-overview");
      const formatted = data.map((item, index) => ({
        name: item.month || `Month ${index + 1}`,
        sales: item.sales,
      }));

      setSalesData(formatted);
      toast.success("Sales data loaded successfully ✅");
    } catch (error) {
      console.error("Error fetching sales data:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to load sales data.");
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

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Sales Overview</h2>

      <div className="h-80">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full text-white space-y-3">
            <div className="text-4xl animate-spin-slow">📈</div>
            <p className="text-sm">Fetching chart data...</p>
          </div>
        ) : salesData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white">
            No sales data available.
          </div>
        ) : (
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart key={salesData.length} data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey={"name"} stroke="#9ca3af" />
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

      {/* Retry Button for Error */}
      {salesData.length === 0 && !loading && (
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Custom spinner animation class */}
      <style>{`
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default SalesOverviewChart;