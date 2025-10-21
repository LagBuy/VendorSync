import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from "recharts";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { Users, Sparkles, Target, PieChart } from "lucide-react";

const CustomerSegmentation = () => {
  const [segmentationData, setSegmentationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSegments, setTotalSegments] = useState(0);

  useEffect(() => {
    const fetchSegmentationData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/customer-segmentation/");
        const formattedData = Array.isArray(data) ? data : [];
        setSegmentationData(formattedData);

        // Calculate total segments
        if (formattedData.length > 0) {
          const segments = new Set();
          formattedData.forEach((item) => {
            Object.keys(item).forEach((key) => {
              if (key !== "subject" && item[key] > 0) {
                segments.add(key);
              }
            });
          });
          setTotalSegments(segments.size);
        }
      } catch {
        setSegmentationData([]);
        setTotalSegments(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSegmentationData();
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
                {entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const segmentColors = [
    { stroke: "#EAB308", fill: "#EAB308", name: "Premium" },
    { stroke: "#22C55E", fill: "#22C55E", name: "Loyal" },
    { stroke: "#F59E0B", fill: "#F59E0B", name: "Casual" },
    { stroke: "#84CC16", fill: "#84CC16", name: "New" },
    { stroke: "#F97316", fill: "#F97316", name: "At Risk" },
    { stroke: "#A3E635", fill: "#A3E635", name: "VIP" },
  ];

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
          <Target className="mr-3 text-yellow-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Customer Segmentation
            </h2>
            <p className="text-gray-400 text-sm">
              Behavioral analysis and grouping
            </p>
          </div>
        </div>
        {!loading && segmentationData.length > 0 && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Analytics</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-400">Loading segmentation data...</p>
        </div>
      ) : segmentationData.length > 0 ? (
        <>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={segmentationData}
              >
                <PolarGrid stroke="#374151" opacity={0.5} />
                <PolarAngleAxis
                  dataKey="subject"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tick={{ fill: "#9CA3AF" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  stroke="#9CA3AF"
                  fontSize={10}
                />
                {Object.keys(segmentationData[0] || {})
                  .filter((key) => key !== "subject")
                  .slice(0, 3)
                  .map((key, index) => (
                    <Radar
                      key={key}
                      name={segmentColors[index]?.name || key}
                      dataKey={key}
                      stroke={segmentColors[index]?.stroke}
                      fill={segmentColors[index]?.fill}
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                  ))}
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: "#E5E7EB",
                    fontSize: "12px",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Segmentation Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-2 gap-4"
          >
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Segments</p>
              <p className="text-yellow-500 font-bold text-lg">
                {totalSegments}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Data Points</p>
              <p className="text-green-500 font-bold text-lg">
                {segmentationData.length}
              </p>
            </div>

            {/* Segmentation Insight */}
            <div className="col-span-2 mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-green-500/10 rounded-xl border border-yellow-500/30">
              <div className="flex items-center justify-center">
                <PieChart className="text-yellow-500 mr-2" size={16} />
                <p className="text-gray-400 text-sm">Segments Tracked:</p>
                <p className="text-yellow-500 font-bold text-sm ml-2">
                  {Object.keys(segmentationData[0] || {})
                    .filter((key) => key !== "subject")
                    .slice(0, 3)
                    .join(", ")}
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
            No Segmentation Data
          </h3>
          <p className="text-gray-400 max-w-md">
            Customer segmentation data will appear here once customer behavior
            patterns are analyzed.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CustomerSegmentation;
