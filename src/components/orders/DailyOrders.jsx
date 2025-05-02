import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import axios from "axios";

const DailyOrders = () => {
  const [dailyOrdersData, setDailyOrdersData] = useState([]);

  useEffect(() => {
    const fetchDailyOrders = async () => {
      try {
        const response = await axios.get("http://35.88.242.25/api/orders/");
        const orders = response.data;

        const ordersByTimestamp = {};

        orders.forEach((order) => {
          const createdAt = new Date(order.createdAt);

          const date = createdAt.toLocaleDateString("en-GB"); // dd/mm/yyyy
          const time = createdAt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }); // hh:mm AM/PM

          const fullTimestamp = `${date}, ${time}`;

          ordersByTimestamp[fullTimestamp] =
            (ordersByTimestamp[fullTimestamp] || 0) + 1;
        });

        const chartData = Object.entries(ordersByTimestamp).map(
          ([timestamp, count]) => ({
            date: timestamp,
            orders: count,
          })
        );

        // Optional: Sort by real date and time
        chartData.sort((a, b) => {
          const [dateA, timeA] = a.date.split(", ");
          const [dayA, monthA, yearA] = dateA.split("/").map(Number);
          const dateTimeA = new Date(`${yearA}-${monthA}-${dayA} ${timeA}`);

          const [dateB, timeB] = b.date.split(", ");
          const [dayB, monthB, yearB] = dateB.split("/").map(Number);
          const dateTimeB = new Date(`${yearB}-${monthB}-${dayB} ${timeB}`);

          return dateTimeA - dateTimeB;
        });

        setDailyOrdersData(chartData);
      } catch (error) {
        console.error("Error fetching daily orders:", error);
      }
    };

    fetchDailyOrders();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Daily Orders</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={dailyOrdersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
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
              dataKey="orders"
              stroke="#8B5CF6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOrders;
