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

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const fetchSalesData = async () => {
    const MIN_SPINNER_TIME = 3000;
    const startTime = Date.now();

    try {
      const response = await fetch("/api/sales");
      if (!response.ok) throw new Error("Failed to fetch sales data");
      const data = await response.json();

      const formatted = data.map((item, index) => ({
        name: item.month || `Month ${index + 1}`,
        sales: item.sales,
      }));

      setSalesData(formatted);
      setToast({
        show: true,
        message: "Sales data loaded successfully ✅",
        type: "success",
      });

      setTimeout(() => setToast({ show: false, message: "", type: "" }), 5000);
    } catch (err) {
      console.error("Error fetching sales data:", err);
      setToast({
        show: true,
        message: "⚠️ Failed to load sales data.",
        type: "error",
      });
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MIN_SPINNER_TIME - elapsed);
      setTimeout(() => setLoading(false), delay);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleCloseToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

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

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`absolute top-4 right-4 px-4 py-2 rounded shadow-md z-50 flex items-center justify-between gap-2 min-w-[280px] ${
            toast.type === "error"
              ? "bg-red-600 text-white animate-pulse"
              : "bg-green-600 text-white"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={handleCloseToast}
            className="text-white font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      <div className="h-80">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full text-white space-y-3">
            <div className="text-4xl animate-spin-slow">📈</div>
            <p className="text-sm">Fetching chart data...</p>
          </div>
        ) : (
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={salesData}>
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
      {toast.type === "error" && (
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
          <button
            onClick={handleCloseToast}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Okay
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
