import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];

const OrderDistribution = () => {
  const [statusData, setStatusData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/orders/");
        const orders = data;

        const statusCounts = {};
        orders.forEach((order) => {
          const status = order.status || "unknown";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const total = orders.length;
        const formattedData = Object.entries(statusCounts).map(
          ([status, count]) => ({
            name: status,
            count,
            percent: total ? parseFloat(((count / total) * 100).toFixed(2)) : 0,
          })
        );

        setStatusData(formattedData);
      } catch (error) {
        console.error("Failed to fetch order data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load order distribution.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Order Status</h2>
      <p className="text-sm text-gray-300 mb-4">
        How good/bad your delivery is going.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Loading...
        </div>
      ) : statusData.length > 0 ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ name, percent, count }) =>
                  `${name}: ${count} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const percent = props.payload.percent;
                  return [`${value} orders (${(percent * 100).toFixed(2)}%)`, name];
                }}
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          No order data available.
        </div>
      )}
    </motion.div>
  );
};

export default OrderDistribution;