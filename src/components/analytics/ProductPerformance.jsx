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
import { axiosInstance } from "../../axios-instance/axios-instance";
import { TrendingUp, Sparkles, Package, Star } from "lucide-react";

const ProductPerformance = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalMetrics, setTotalMetrics] = useState({
    sales: 0,
    revenue: 0,
    profit: 0,
  });

  useEffect(() => {
    const fetchProductPerformance = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/product-performance/");
        const formattedData = Array.isArray(data) ? data : [];
        setProductData(formattedData);

        // Calculate total metrics
        const totals = formattedData.reduce(
          (acc, item) => ({
            sales: acc.sales + (item.sales || 0),
            revenue: acc.revenue + (item.revenue || 0),
            profit: acc.profit + (item.profit || 0),
          }),
          { sales: 0, revenue: 0, profit: 0 }
        );

        setTotalMetrics(totals);
      } catch {
        setProductData([]);
        setTotalMetrics({ sales: 0, revenue: 0, profit: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductPerformance();
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-yellow-500 font-bold text-sm mb-3">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm mb-1"
              style={{ color: entry.color }}
            >
              {entry.name}:{" "}
              <span className="text-white font-semibold ml-2">
                {entry.name === "revenue" || entry.name === "profit" ? "₦" : ""}
                {entry.value?.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom bar shape with gradient
  const CustomBar = (props) => {
    const { fill, x, y, width, height } = props;
    return (
      <g>
        <defs>
          <linearGradient id={`gradient-${fill}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={0.8} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#gradient-${fill})`}
          rx={4}
          className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        />
      </g>
    );
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border-2 border-green-400/50 backdrop-blur-sm relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-yellow-400"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500 rounded-full opacity-5 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500 rounded-full opacity-5 blur-xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center">
          <Package className="mr-3 text-yellow-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Product Performance
            </h2>
            <p className="text-gray-400 text-sm">
              Market performance analytics
            </p>
          </div>
        </div>
        {!isLoading && productData.length > 0 && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Live Metrics</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-400">Loading product data...</p>
        </div>
      ) : productData.length > 0 ? (
        <>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={productData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: "#E5E7EB",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="sales"
                  name="Sales"
                  fill="#EAB308"
                  shape={<CustomBar fill="#EAB308" />}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#22C55E"
                  shape={<CustomBar fill="#22C55E" />}
                />
                <Bar
                  dataKey="profit"
                  name="Profit"
                  fill="#F59E0B"
                  shape={<CustomBar fill="#F59E0B" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-3 gap-4"
          >
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Sales</p>
              <p className="text-yellow-500 font-bold text-lg">
                {totalMetrics.sales.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-green-500 font-bold text-lg">
                ₦{totalMetrics.revenue.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Profit</p>
              <p className="text-yellow-500 font-bold text-lg">
                ₦{totalMetrics.profit.toLocaleString()}
              </p>
            </div>

            {/* Top Performing Product */}
            {productData.length > 0 && (
              <div className="col-span-3 mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-green-500/10 rounded-xl border border-yellow-500/30">
                <div className="flex items-center justify-center">
                  <Star className="text-yellow-500 mr-2" size={16} />
                  <p className="text-gray-400 text-sm">Top Product:</p>
                  <p className="text-yellow-500 font-bold text-sm ml-2">
                    {
                      productData.reduce((prev, current) =>
                        prev.revenue > current.revenue ? prev : current
                      ).name
                    }
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="text-yellow-500" size={32} />
          </div>
          <h3 className="text-white font-semibold text-xl mb-2">
            No Product Data
          </h3>
          <p className="text-gray-400 max-w-md">
            Product performance data will appear here once sales and revenue
            data is available.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProductPerformance;
