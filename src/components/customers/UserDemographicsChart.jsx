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
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const getAgeBracket = (age) => {
  if (age >= 18 && age <= 24) return "18-24";
  if (age >= 25 && age <= 34) return "25-34";
  if (age >= 35 && age <= 44) return "35-44";
  if (age >= 45 && age <= 54) return "45-54";
  return "55+";
};

const UserDemographicsChart = () => {
  const [ageData, setAgeData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/customers");
        const customers = res.data;

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
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 lg:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Customers' Demographics
      </h2>
      <p>
        This shows the kind of customers & what they want/need. It will help you
        in making better decisions in your product or services, so as to satisfy
        them.
      </p>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={ageData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {ageData.map((entry, index) => (
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
    </motion.div>
  );
};

export default UserDemographicsChart;
