import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { axiosInstance } from "../../axios-instance/axios-instance";

const timeIntervals = [
  { label: "0-4", start: 0, end: 4 },
  { label: "4-8", start: 4, end: 8 },
  { label: "8-12", start: 8, end: 12 },
  { label: "12-16", start: 12, end: 16 },
  { label: "16-20", start: 16, end: 20 },
  { label: "20-24", start: 20, end: 24 },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const UserActivityHeatmap = () => {
  const [userActivityData, setUserActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivity = async () => {
      setIsLoading(true);
      try {
        const { data: activities } = await axiosInstance.get("/customer-activities/");
        
        // Initialize data structure
        const activityMap = {};
        daysOfWeek.forEach((day) => {
          activityMap[day] = {};
          timeIntervals.forEach(({ label }) => {
            activityMap[day][label] = 0;
          });
        });

        // Process activities
        activities.forEach((activity) => {
          const date = dayjs(activity.timestamp);
          const day = date.format("ddd"); // e.g., 'Mon'
          const hour = date.hour();

          const interval = timeIntervals.find(
            ({ start, end }) => hour >= start && hour < end
          );

          if (day && interval) {
            activityMap[day][interval.label]++;
          }
        });

        // Convert to array format for Recharts
        const chartData = daysOfWeek.map((day) => ({
          name: day,
          ...activityMap[day],
        }));

        setUserActivityData(chartData);
      } catch (error) {
        console.error("Failed to fetch customer activity:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setUserActivityData([]);
        toast.error(error.response?.data?.message || "Failed to load customer activity data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Customer's Activity Graph
      </h2>
      <p className="text-gray-300 mb-4">
        This shows how well your customers are consuming your product/services.
      </p>
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Loading...
        </div>
      ) : userActivityData.length > 0 ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={userActivityData}>
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
              <Bar dataKey="0-4" stackId="a" fill="#6366F1" />
              <Bar dataKey="4-8" stackId="a" fill="#8B5CF6" />
              <Bar dataKey="8-12" stackId="a" fill="#EC4899" />
              <Bar dataKey="12-16" stackId="a" fill="#10B981" />
              <Bar dataKey="16-20" stackId="a" fill="#F59E0B" />
              <Bar dataKey="20-24" stackId="a" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          No customer activity data available.
        </div>
      )}
    </motion.div>
  );
};

export default UserActivityHeatmap;