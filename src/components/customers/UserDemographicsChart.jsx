import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { Users, TrendingUp, AlertTriangle, } from "lucide-react";

const COLORS = ["#EAB308", "#22C55E", "#FFFFFF", "#000000", "#F59E0B"];

const getAgeBracket = (age) => {
  if (age >= 18 && age <= 24) return "18-24";
  if (age >= 25 && age <= 34) return "25-34";
  if (age >= 35 && age <= 44) return "35-44";
  if (age >= 45 && age <= 54) return "45-54";
  return "55+";
};

const UserDemographicsChart = () => {
  const [ageData, setAgeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data: customers } = await axiosInstance.get("/customers/");

        const ageBracketMap = {
          "18-24": 0,
          "25-34": 0,
          "35-44": 0,
          "45-54": 0,
          "55+": 0,
        };

        const currentYear = new Date().getFullYear();

        customers.forEach((user) => {
          if (user.dob) {
            const birthYear = new Date(user.dob).getFullYear();
            const age = currentYear - birthYear;
            const bracket = getAgeBracket(age);
            ageBracketMap[bracket]++;
          }
        });

        const formattedData = Object.entries(ageBracketMap).map(
          ([name, value]) => ({ name, value })
        );
        setAgeData(formattedData);
        setTotalCustomers(customers.length);
      } catch (error) {
        console.error("Error fetching users:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setAgeData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalCustomers) * 100).toFixed(1);
      return (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-black/95 p-3 border border-yellow-500 rounded-lg shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center space-x-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: payload[0].payload.fill }}
            />
            <p className="text-white font-semibold text-sm">
              {payload[0].name}
            </p>
          </div>
          <p className="text-yellow-500 font-semibold text-sm">
            {payload[0].value} Customers
          </p>
          <p className="text-green-500 text-xs font-medium">
            {percentage}% of total
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent === 0) return null;

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
        className="font-semibold text-xs drop-shadow-md"
        style={{ textShadow: "0 1px 5px rgba(0,0,0,0.8)" }}
      >
        {percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
      </text>
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
              <Users className="text-black" size={14} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Customer Demographics
              </h2>
              <p className="text-yellow-500 text-xs">Age Distribution</p>
            </div>
          </div>

          {!isLoading && ageData.length > 0 && (
            <motion.div
              className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-lg border border-green-500/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <TrendingUp size={12} className="text-green-500" />
              <span className="text-white text-xs font-medium">
                {totalCustomers} Total
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
            <p className="text-yellow-500 text-sm">Analyzing data...</p>
          </motion.div>
        ) : ageData.length > 0 && ageData.some((d) => d.value > 0) ? (
          <div className="w-full h-[200px] relative">
            {/* Peak group indicator */}
            {!isLoading && (
              <motion.div
                className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-green-500 shadow-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-center">
                  <p className="text-green-500 text-xs font-medium">
                    Peak Group
                  </p>
                  <p className="text-white font-semibold text-sm">
                    {
                      ageData.reduce((max, item) =>
                        item.value > max.value ? item : max
                      ).name
                    }
                  </p>
                </div>
              </motion.div>
            )}

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {ageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#1F2937"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "15px",
                    fontSize: "11px",
                  }}
                  formatter={(value) => (
                    <span className="text-white text-xs font-medium">
                      {value}
                    </span>
                  )}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <motion.div
            className="flex flex-col justify-center items-center h-[200px] border border-dashed border-yellow-500/30 rounded-lg bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle className="text-yellow-500 mb-2" size={20} />
            <p className="text-yellow-500 text-sm font-medium mb-1">No Data</p>
            <p className="text-gray-400 text-xs text-center px-4">
              Customer demographics will appear here
            </p>
          </motion.div>
        )}
      </div>

      {/* Compact Stats Bar */}
      {!isLoading && ageData.length > 0 && (
        <motion.div
          className="relative z-10 mt-3 grid grid-cols-5 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {ageData.map((item, index) => (
            <div
              key={item.name}
              className="text-center p-2 rounded-lg border border-gray-700 bg-black/30"
              style={{
                borderColor: item.value > 0 ? COLORS[index] : "#374151",
              }}
            >
              <p className="text-white font-semibold text-sm">{item.value}</p>
              <p className="text-gray-400 text-xs">{item.name}</p>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserDemographicsChart;
