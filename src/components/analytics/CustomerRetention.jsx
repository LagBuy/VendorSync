import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const UserRetention = () => {
  const [retentionData, setRetentionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRetentionData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/user-retention/");
        setRetentionData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch retention data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setRetentionData([]);
        toast.error(error.response?.data?.message || "Failed to load customer retention data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRetentionData();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Customer Retention
      </h2>
      <p className="text-gray-300 mb-4">
        This shows how well you were able to retain customers.
      </p>
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Loading...
        </div>
      ) : retentionData.length > 0 ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="#8B5CF6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          No retention data available.
        </div>
      )}
    </motion.div>
  );
};

export default UserRetention;