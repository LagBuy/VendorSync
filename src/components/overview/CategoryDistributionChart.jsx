import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../axios-instance/axios-instance";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
  const [categoryData, setCategoryData] = useState([]);

  const fetchCategoryDistribution = async () => {
    try {
      console.log(
        "Fetching category distribution from /api/v1/vendors/categorydistribution/..."
      );
      const response = await axiosInstance.get(
        "/api/v1/vendors/categorydistribution/"
      );
      console.log("Category distribution fetched successfully:", response.data);

      // Ensure response data is in the correct format: [{ name: string, value: number }, ...]
      const data = Array.isArray(response.data)
        ? response.data.map((item) => ({
            name: item.name || item.category || "Uncategorized",
            value: Number(item.value) || 0,
          }))
        : [];
      setCategoryData(data);
    } catch (error) {
      console.error("Error fetching category distribution:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setCategoryData([]); // Set empty array on error to prevent chart issues
    }
  };

  useEffect(() => {
    fetchCategoryDistribution();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Category Distribution
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
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

export default CategoryDistributionChart;
