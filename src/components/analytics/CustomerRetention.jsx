import { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { Users, Sparkles, TrendingUp, Heart } from "lucide-react";

const UserRetention = () => {
  const [retentionData, setRetentionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRetention, setAverageRetention] = useState(0);

  useEffect(() => {
    const fetchRetentionData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/user-retention/");
        const formattedData = Array.isArray(data) ? data : [];
        setRetentionData(formattedData);

        // Calculate average retention
        if (formattedData.length > 0) {
          const total = formattedData.reduce(
            (sum, item) => sum + (item.retention || 0),
            0
          );
          setAverageRetention(total / formattedData.length);
        }
      } catch {
        setRetentionData([]);
        setAverageRetention(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRetentionData();
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
          <p className="text-yellow-500 font-bold text-sm mb-2">{label}</p>
          <p className="text-green-500 text-sm">
            Retention:{" "}
            <span className="text-white font-semibold">
              {payload[0].value}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom active dot for the line chart
  const CustomActiveDot = (props) => {
    const { cx, cy} = props;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="#22C55E"
          stroke="#EAB308"
          strokeWidth={2}
        />
        <circle cx={cx} cy={cy} r={3} fill="#FFFFFF" />
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
          <Heart className="mr-3 text-yellow-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Customer Retention
            </h2>
            <p className="text-gray-400 text-sm">
              Customer loyalty and engagement trends
            </p>
          </div>
        </div>
        {!isLoading && retentionData.length > 0 && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Engagement</span>
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
          <p className="text-gray-400">Loading retention data...</p>
        </div>
      ) : retentionData.length > 0 ? (
        <>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={retentionData}>
                <defs>
                  <linearGradient
                    id="retentionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: "#E5E7EB",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="retention"
                  stroke="#EAB308"
                  strokeWidth={3}
                  dot={{ fill: "#EAB308", strokeWidth: 2, r: 4 }}
                  activeDot={<CustomActiveDot />}
                  name="Retention Rate"
                />
                {/* Area under the line for better visualization */}
                <Line
                  type="monotone"
                  dataKey="retention"
                  stroke="transparent"
                  fill="url(#retentionGradient)"
                  strokeWidth={0}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Retention Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-2 gap-4"
          >
            <div className="text-center">
              <p className="text-gray-400 text-sm">Tracking Periods</p>
              <p className="text-yellow-500 font-bold text-lg">
                {retentionData.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Avg. Retention</p>
              <p className="text-green-500 font-bold text-lg">
                {averageRetention.toFixed(1)}%
              </p>
            </div>

            {/* Retention Performance Indicator */}
            <div className="col-span-2 mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-green-500/10 rounded-xl border border-yellow-500/30">
              <div className="flex items-center justify-center">
                <TrendingUp className="text-yellow-500 mr-2" size={16} />
                <p className="text-gray-400 text-sm">Retention Health:</p>
                <p
                  className={`font-bold text-sm ml-2 ${
                    averageRetention >= 70
                      ? "text-green-500"
                      : averageRetention >= 50
                      ? "text-yellow-500"
                      : "text-red-400"
                  }`}
                >
                  {averageRetention >= 70
                    ? "Excellent"
                    : averageRetention >= 50
                    ? "Good"
                    : "Needs Improvement"}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <Users className="text-yellow-500" size={32} />
          </div>
          <h3 className="text-white font-semibold text-xl mb-2">
            No Retention Data
          </h3>
          <p className="text-gray-400 max-w-md">
            Customer retention data will appear here once customer engagement
            metrics are available.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default UserRetention;
