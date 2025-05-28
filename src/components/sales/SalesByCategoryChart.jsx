import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = () => {
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchSalesByCategory = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/sales-by-category");
      const total = data.reduce((acc, category) => acc + category.value, 0);
      setTotalSales(total);
      setSalesByCategory(data);
      toast.success("Sales by category data loaded successfully ✅");
    } catch (error) {
      console.error("Error fetching sales data:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to load sales by category data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesByCategory();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Sales by Category
      </h2>

      {loading ? (
        <div className="flex justify-center py-10 text-white">
          <div className="animate-spin border-t-4 border-b-4 border-blue-500 border-solid w-16 h-16 rounded-full"></div>
        </div>
      ) : salesByCategory.length === 0 ? (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          No sales data available.
        </div>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={salesByCategory}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent, value }) =>
                  `${name} ${
                    percent ? (percent * 100).toFixed(0) : 0
                  }% (${value})`
                }
              >
                {salesByCategory.map((entry, index) => (
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
      )}

      {/* Display total sales at the bottom */}
      <div className="mt-4 text-center text-gray-100">
        <span>Total Sales: {totalSales}</span>
      </div>

      {/* Retry Button for Empty Data */}
      {salesByCategory.length === 0 && !loading && (
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchSalesByCategory}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SalesByCategoryChart;