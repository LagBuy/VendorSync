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
import dayjs from "dayjs";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { Activity, Clock } from "lucide-react";

const timeIntervals = [
  { label: "0-4", start: 0, end: 4, color: "#EAB308" },
  { label: "4-8", start: 4, end: 8, color: "#F59E0B" },
  { label: "8-12", start: 8, end: 12, color: "#22C55E" },
  { label: "12-16", start: 12, end: 16, color: "#16A34A" },
  { label: "16-20", start: 16, end: 20, color: "#FFFFFF" },
  { label: "20-24", start: 20, end: 24, color: "#000000" },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const UserActivityHeatmap = () => {
  const [userActivityData, setUserActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [peakActivity, setPeakActivity] = useState({ time: "", day: "", count: 0 });

  useEffect(() => {
    const fetchUserActivity = async () => {
      setIsLoading(true);
      try {
        const { data: activities } = await axiosInstance.get("/customer-activities/");
        
        const activityMap = {};
        daysOfWeek.forEach((day) => {
          activityMap[day] = {};
          timeIntervals.forEach(({ label }) => {
            activityMap[day][label] = 0;
          });
        });

        let maxActivity = { time: "", day: "", count: 0 };

        activities.forEach((activity) => {
          const date = dayjs(activity.timestamp);
          const day = date.format("ddd");
          const hour = date.hour();

          const interval = timeIntervals.find(
            ({ start, end }) => hour >= start && hour < end
          );

          if (day && interval) {
            activityMap[day][interval.label]++;
            
            if (activityMap[day][interval.label] > maxActivity.count) {
              maxActivity = {
                time: interval.label,
                day: day,
                count: activityMap[day][interval.label]
              };
            }
          }
        });

        const chartData = daysOfWeek.map((day) => ({
          name: day,
          ...activityMap[day],
        }));

        setUserActivityData(chartData);
        setPeakActivity(maxActivity);
      } catch (error) {
        console.error("Failed to fetch customer activity:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setUserActivityData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-black/95 p-3 border border-yellow-500 rounded-lg shadow-lg backdrop-blur-sm"
        >
          <p className="text-yellow-500 font-semibold text-sm mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-white text-xs font-medium">{entry.dataKey}</span>
                </div>
                <span className="text-green-500 font-semibold text-sm">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <motion.div 
        className="flex flex-wrap justify-center gap-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-1">
            <div 
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white text-xs font-medium">{entry.value}</span>
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 border border-yellow-500/50 shadow-lg relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-full blur-sm" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-green-500/5 rounded-full blur-sm" />
      
      {/* Compact Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-yellow-500 rounded-lg">
              <Activity className="text-black" size={14} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Activity Heatmap
              </h2>
              <p className="text-yellow-500 text-xs">Engagement Analytics</p>
            </div>
          </div>
          
          {!isLoading && userActivityData.length > 0 && (
            <motion.div 
              className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-lg border border-green-500/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Clock size={12} className="text-green-500" />
              <span className="text-white text-xs font-medium">
                Peak: {peakActivity.day} {peakActivity.time}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Compact Chart Area */}
      <div className="relative z-10">
        {isLoading ? (
          <motion.div 
            className="flex flex-col justify-center items-center h-[200px] border border-yellow-500/30 rounded-lg bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-6 w-6 border-2 border-yellow-500 border-t-transparent mb-2"
            />
            <p className="text-yellow-500 text-sm">Analyzing...</p>
          </motion.div>
        ) : userActivityData.length > 0 ? (
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userActivityData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid 
                  strokeDasharray="2 2" 
                  stroke="#374151" 
                  strokeOpacity={0.3}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
                {timeIntervals.map((interval) => (
                  <Bar
                    key={interval.label}
                    dataKey={interval.label}
                    stackId="a"
                    fill={interval.color}
                    stroke="#1F2937"
                    strokeWidth={1}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <motion.div 
            className="flex flex-col justify-center items-center h-[200px] border border-dashed border-yellow-500/30 rounded-lg bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Activity className="text-yellow-500 mb-2" size={20} />
            <p className="text-yellow-500 text-sm font-medium mb-1">No Data</p>
            <p className="text-gray-400 text-xs text-center px-4">
              Customer activity data will appear here
            </p>
          </motion.div>
        )}
      </div>

      {/* Compact Stats Bar */}
      {!isLoading && userActivityData.length > 0 && (
        <motion.div 
          className="relative z-10 mt-3 grid grid-cols-3 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-white font-semibold text-sm">{peakActivity.time}</p>
            <p className="text-gray-400 text-xs">Peak Time</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-white font-semibold text-sm">{peakActivity.count}</p>
            <p className="text-gray-400 text-xs">Max Activity</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/10 border border-white/20">
            <p className="text-white font-semibold text-sm">{peakActivity.day}</p>
            <p className="text-gray-400 text-xs">Peak Day</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserActivityHeatmap;