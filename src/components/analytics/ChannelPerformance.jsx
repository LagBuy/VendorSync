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
import { axiosInstance } from "../../axios-instance/axios-instance";
import { TrendingUp, Sparkles, BarChart3 } from "lucide-react";

// Modern color palette matching our theme
const COLORS = [
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#F59E0B", // Amber
  "#84CC16", // Lime
  "#F97316", // Orange
  "#A3E635", // Light Green
];

const ChannelPerformance = () => {
  const [channelData, setChannelData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPerformance, setTotalPerformance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/channel-performance/");
        const formattedData = Array.isArray(data) ? data : [];
        setChannelData(formattedData);

        // Calculate total performance
        const total = formattedData.reduce(
          (sum, item) => sum + (item.value || 0),
          0
        );
        setTotalPerformance(total);
      } catch {
        setChannelData([]);
        setTotalPerformance(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        totalPerformance > 0
          ? ((data.value / totalPerformance) * 100).toFixed(1)
          : 0;

      return (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-yellow-500 font-bold text-sm mb-2">{data.name}</p>
          <p className="text-green-500 text-sm">
            Performance:{" "}
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
    if (!percent || percent < 0.05) return null;

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
        className="text-xs font-bold drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
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
          <BarChart3 className="mr-3 text-yellow-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Channel Performance
            </h2>
            <p className="text-gray-400 text-sm">
              Distribution across channels
            </p>
          </div>
        </div>
        {!isLoading && channelData.length > 0 && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Live</span>
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
          <p className="text-gray-400">Loading channel data...</p>
        </div>
      ) : channelData.length > 0 ? (
        <>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={channelData}
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
                  {channelData.map((entry, index) => (
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

          {/* Performance Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-2 gap-4"
          >
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Channels</p>
              <p className="text-yellow-500 font-bold text-lg">
                {channelData.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Performance</p>
              <p className="text-green-500 font-bold text-lg">
                {totalPerformance.toLocaleString()}
              </p>
            </div>

            {/* Top Performing Channel */}
            {channelData.length > 0 && (
              <div className="col-span-2 mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-green-500/10 rounded-xl border border-yellow-500/30">
                <p className="text-gray-400 text-sm text-center">Top Channel</p>
                <p className="text-yellow-500 font-bold text-center text-lg">
                  {
                    channelData.reduce((prev, current) =>
                      prev.value > current.value ? prev : current
                    ).name
                  }
                </p>
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
            No Channel Data
          </h3>
          <p className="text-gray-400 max-w-xs">
            Channel performance data will appear here once available.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ChannelPerformance;
