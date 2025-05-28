import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../axios-instance/axios-instance";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const SalesChannelChart = () => {
  const [salesChannelData, setSalesChannelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSalesChannelData = async () => {
    try {
      const response = await axiosInstance.get("/sales/channels");
      setSalesChannelData(response.data);
    } catch (err) {
      console.error("Error fetching sales channel data:", err);
      setError("Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesChannelData();
  }, []);

  const handleCloseModal = () => {
    setError("");
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-2 text-gray-100">Sales by Channel</h2>
      <p className="text-gray-300 mb-4">This shows how much you make via various platforms</p>

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-red-600 text-white px-6 py-4 rounded-md max-w-sm w-full">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Error</h3>
              <button onClick={handleCloseModal} className="text-xl font-bold">×</button>
            </div>
            <p className="mt-2">{error}</p>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-80">
        {loading ? (
          <div className="flex justify-center items-center h-full text-white">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesChannelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.9)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {salesChannelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default SalesChannelChart;
