// import { motion } from "framer-motion";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { useState } from "react";

// //  BACEND DEVs WILL AUTOMATE THIS:
// const monthlySalesData = [
//   { month: "Jan", sales: 4000 },
//   { month: "Feb", sales: 3000 },
//   { month: "Mar", sales: 5000 },
//   { month: "Apr", sales: 4500 },
//   { month: "May", sales: 6000 },
//   { month: "Jun", sales: 5500 },
//   { month: "Jul", sales: 7000 },
//   { month: "Aug", sales: 3300 },
//   { month: "Sep", sales: 7045 },
//   { month: "Oct", sales: 1240 },
//   { month: "Nov", sales: 7250 },
//   { month: "Dec", sales: 4450 },
// ];

// const SalesOverviewChart = () => {
//   const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

//   return (
//     <motion.div
//       className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-100">Sales Overview</h2>

//         <select
//           className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2
//           focus:ring-blue-500
//           "
//           value={selectedTimeRange}
//           onChange={(e) => setSelectedTimeRange(e.target.value)}
//         >
//           <option>This Week</option>
//           <option>This Month</option>
//           <option>This Quarter</option>
//           <option>This Year</option>
//         </select>
//       </div>

//       <div className="w-full h-80">
//         <ResponsiveContainer>
//           <AreaChart data={monthlySalesData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//             <XAxis dataKey="month" stroke="#9CA3AF" />
//             <YAxis stroke="#9CA3AF" />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "rgba(31, 41, 55, 0.8)",
//                 borderColor: "#4B5563",
//               }}
//               itemStyle={{ color: "#E5E7EB" }}
//             />
//             <Area
//               type="monotone"
//               dataKey="sales"
//               stroke="#8B5CF6"
//               fill="#8B5CF6"
//               fillOpacity={0.3}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </motion.div>
//   );
// };
// export default SalesOverviewChart;

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const fetchSalesData = async () => {
    try {
      const response = await fetch("/api/sales"); // Replace with actual API endpoint
      if (!response.ok) throw new Error("Failed to fetch sales data");
      const data = await response.json();
      setSalesData(data);
      setToast({
        show: true,
        message: "Sales data loaded successfully ✅",
        type: "success",
      });

      setTimeout(() => setToast({ show: false, message: "", type: "" }), 5000);
    } catch (err) {
      console.error("Error fetching sales data:", err);
      setToast({
        show: true,
        message: "Failed to load sales data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleCloseToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  const handleRetry = () => {
    setLoading(true); // Set loading state to true while retrying
    fetchSalesData(); // Retry fetching data
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Sales Overview</h2>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`absolute top-4 right-4 px-4 py-2 rounded shadow-md z-50 flex items-center justify-between gap-2 min-w-[280px] ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          } animate-fade`}
        >
          <span>{toast.message}</span>
          <button
            onClick={handleCloseToast}
            className="text-white font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      <div className="h-80">
        {loading ? (
          <div className="flex justify-center py-10 text-white">Loading...</div>
        ) : (
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey={"name"} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Retry Button for Error */}
      {toast.type === "error" && (
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
          <button
            onClick={handleCloseToast}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Okay
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SalesOverviewChart;
