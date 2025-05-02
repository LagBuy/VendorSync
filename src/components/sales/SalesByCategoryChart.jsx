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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = () => {
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [totalSales, setTotalSales] = useState(0); // Keep track of total sales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchSalesByCategory = async () => {
      try {
        const response = await fetch("/api/sales-by-category"); // Replace with actual API endpoint
        if (!response.ok) throw new Error("Failed to fetch sales data");
        const data = await response.json();

        // Calculate total sales
        const total = data.reduce((acc, category) => acc + category.value, 0);
        setTotalSales(total);

        setSalesByCategory(data);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

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
        <div className="flex justify-center py-10 text-white">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          Failed to load sales data.
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
    </motion.div>
  );
};

export default SalesByCategoryChart;
