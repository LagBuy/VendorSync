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
import axios from "axios";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];

const OrderDistribution = () => {
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get("/api/orders"); // replace with your real endpoint
        const orders = response.data;

        const statusCounts = {};
        orders.forEach((order) => {
          const status = order.status;
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const total = orders.length;
        const formattedData = Object.entries(statusCounts).map(
          ([status, count]) => ({
            name: status,
            count,
            percent: parseFloat(((count / total) * 100).toFixed(2)),
          })
        );

        setStatusData(formattedData);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
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
                return [`${value} orders (${percent}%)`, name];
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
    </motion.div>
  );
};

export default OrderDistribution;
