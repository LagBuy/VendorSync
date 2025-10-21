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
import { PieChart as PieIcon, Sparkles, TrendingUp } from "lucide-react";

// Updated color palette matching our theme
const COLORS = [
  "#EAB308",
  "#22C55E",
  "#F59E0B",
  "#84CC16",
  "#F97316",
  "#A3E635",
];

const SalesByCategoryChart = () => {
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  // Premium Spinner component
  const Spinner = () => (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"
      />
      <p className="text-gray-400 text-sm">Loading category data...</p>
    </div>
  );

  // Fetch data from API
  const fetchSalesByCategory = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/sales-by-category");
      const total = data.reduce((acc, category) => acc + category.value, 0);
      setTotalSales(total);
      setSalesByCategory(data);
      toast.success("Sales by category data loaded successfully ✅", {
        className: "custom-toast-success",
      });
    } catch {
      // Error handling without error messages
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesByCategory();
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalSales) * 100).toFixed(1);
      return (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-yellow-500 font-bold text-sm mb-2">{data.name}</p>
          <p className="text-green-500 text-sm">
            Sales:{" "}
            <span className="text-white font-semibold">{data.value}</span>
          </p>
          <p className="text-gray-400 text-sm">
            Share:{" "}
            <span className="text-white font-semibold">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label component
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (!percent || percent < 0.05) return null; // Don't show label for small slices

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <PieIcon className="mr-3 text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-white">Sales by Category</h2>
        </div>
        {!loading && salesByCategory.length > 0 && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Performance</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spinner />
        </div>
      ) : salesByCategory.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="text-yellow-500" size={24} />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">
            No Category Data
          </h3>
          <p className="text-gray-400 max-w-xs mb-4">
            No sales data available by category. Data will appear here as sales
            are made.
          </p>
          <button
            onClick={fetchSalesByCategory}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg"
          >
            Refresh Data
          </button>
        </div>
      ) : (
        <>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#111827"
                      strokeWidth={2}
                      className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: "#E5E7EB",
                    fontSize: "12px",
                  }}
                  iconType="circle"
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Enhanced Summary Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-800"
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm">Total Categories</p>
                <p className="text-yellow-500 font-bold text-lg">
                  {salesByCategory.length}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Sales</p>
                <p className="text-green-500 font-bold text-lg">
                  {totalSales.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Top Performing Category */}
            {salesByCategory.length > 0 && (
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-green-500/10 rounded-xl border border-yellow-500/30">
                <p className="text-gray-400 text-sm text-center">
                  Top Category
                </p>
                <p className="text-yellow-500 font-bold text-center text-lg">
                  {
                    salesByCategory.reduce((prev, current) =>
                      prev.value > current.value ? prev : current
                    ).name
                  }
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default SalesByCategoryChart;
