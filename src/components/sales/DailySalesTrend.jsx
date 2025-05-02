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
} from "recharts";

// Fancy Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin border-t-4 border-b-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
  </div>
);

const DailySalesTrend = () => {
  const [dailySalesData, setDailySalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Fetch sales data dynamically
  useEffect(() => {
    const fetchDailySalesData = async () => {
      try {
        const response = await fetch("/api/daily-sales"); // Replace with your actual API endpoint
        if (!response.ok) throw new Error("Failed to fetch sales data");
        const data = await response.json();

        // Set the fetched data
        setDailySalesData(data);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setToast({
          show: true,
          message: "Failed to load sales data.",
          type: "error",
        });
        setTimeout(
          () => setToast({ show: false, message: "", type: "" }),
          5000
        );
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

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Daily Sales Trend
      </h2>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg z-50 ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          } animate-fade`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Loading State with Spinner */}
      {loading ? (
        <div className="flex justify-center py-10 text-white">
          <Spinner />
        </div>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
                formatter={(value, name, props) => {
                  const { timestamp } = props.payload;
                  const saleTime = formatSaleTime(timestamp);
                  return [value, `Sale made at ${saleTime}`];
                }}
              />
              <Bar dataKey="sales" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default DailySalesTrend;
