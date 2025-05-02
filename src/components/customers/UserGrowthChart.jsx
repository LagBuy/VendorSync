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
import axios from "axios";
import dayjs from "dayjs";

const UserGrowthChart = () => {
  const [userGrowthData, setUserGrowthData] = useState([]);

  useEffect(() => {
    const fetchUserGrowth = async () => {
      try {
        const res = await axios.get("/api/customers");
        const customers = res.data;

        // Group users by month
        const groupedByMonth = customers.reduce((acc, customer) => {
          const month = dayjs(
            customer.createdAt || customer.lastPurchase
          ).format("MMM");
          if (!acc[month]) {
            acc[month] = 0;
          }
          acc[month]++;
          return acc;
        }, {});

        // Convert to chart data
        const data = Object.keys(groupedByMonth).map((month) => ({
          month,
          users: groupedByMonth[month],
        }));

        // Sort months correctly
        const sortedMonths = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const sortedData = sortedMonths
          .map((month) => data.find((d) => d.month === month))
          .filter(Boolean); // remove undefined

        setUserGrowthData(sortedData);
      } catch (error) {
        console.error("Failed to fetch customer growth:", error);
      }
    };

    fetchUserGrowth();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Customer's Growth
      </h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserGrowthChart;
