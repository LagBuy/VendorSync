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
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

// Fancy Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin border-t-4 border-b-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
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
        toast.success("Daily sales data loaded successfully ✅");
      } catch (error) {
        console.error("Error fetching sales data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load daily sales data.");
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

      {/* Loading State with Spinner */}
      {loading ? (
        <div className="flex justify-center py-10 text-white">
          <Spinner />
        </div>
      ) : dailySalesData.length === 0 ? (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          No daily sales data available.
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