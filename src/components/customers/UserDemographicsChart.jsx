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
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

// Updated colors to match the new palette
const COLORS = ["#EAB308", "#22C55E", "#EF4444", "#8B5CF6", "#06B6D4"];

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
      } catch (error) {
        console.error("Error fetching users:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setAgeData([]);
        toast.error(
          error.response?.data?.message || "Failed to load customer demographics data.",
          { 
            position: "top-center",
            autoClose: 3000,
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Custom tooltip styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-br from-[#111827] to-[#000000] p-3 border border-[#1F2937] rounded-lg shadow-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-yellow-500">
            Customers: {payload[0].value}
          </p>
          <p className="text-gray-400">
            {((payload[0].value / ageData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-[#111827] to-[#000000] shadow-xl rounded-xl p-6 border border-[#1F2937] lg:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          Customer Demographics
        </h2>
        {!isLoading && ageData.length > 0 && (
          <div className="text-sm text-gray-400">
            Total: {ageData.reduce((sum, item) => sum + item.value, 0)} customers
          </div>
        )}
      </div>
      
      <p className="text-gray-300 mb-6 text-sm">
        Understand your customer age distribution to make better product and service decisions.
      </p>
      
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
          <p className="text-gray-400">Loading demographics...</p>
        </div>
      ) : ageData.length > 0 && ageData.some((d) => d.value > 0) ? (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  percent > 0.05 ? `${name}\n${(percent * 100).toFixed(0)}%` : ""
                }
                labelStyle={{
                  fill: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
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
                  paddingTop: '20px',
                }}
                formatter={(value) => (
                  <span className="text-gray-300 text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-[300px] border-2 border-dashed border-[#1F2937] rounded-lg">
          <div className="text-gray-400 text-4xl mb-3">👥</div>
          <p className="text-gray-400 text-lg mb-1">No demographic data</p>
          <p className="text-gray-500 text-sm">Customer age data will appear here</p>
        </div>
      )}
    </motion.div>
  );
};

export default UserDemographicsChart;
