import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";

// Initial sales data (you can replace this with data fetched from  API)
const initialSalesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 5500 },
];

const SalesTrendChart = () => {
  const [salesData, setSalesData] = useState(initialSalesData);

  // Function to update sales data when a sale is made
  const updateSalesData = (month, amount) => {
    const updatedSalesData = salesData.map((data) =>
      data.month === month
        ? { ...data, sales: data.sales + amount } // Increase the sales for the month
        : data
    );
    setSalesData(updatedSalesData); // Update the sales data state
  };

  // Function to simulate making a sale in your application
  const handleRealSaleEvent = (purchaseData) => {
    // Assuming purchaseData contains the month and sale amount
    const { month, amount } = purchaseData;

    // Update the sales data based on the purchase
    updateSalesData(month, amount);
  };

  // Simulate an API call or event listener for a real purchase
  useEffect(() => {
    const simulatePurchase = () => {
      // This could be replaced with real data from a backend API
      const randomMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][
        Math.floor(Math.random() * 6)
      ];
      const randomAmount = Math.floor(Math.random() * 2000) + 1000;

      // Simulate a sale being made
      handleRealSaleEvent({ month: randomMonth, amount: randomAmount });
    };

    // Simulate a sale every 5 seconds (this could be replaced with an actual event listener)
    const interval = setInterval(simulatePurchase, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [salesData]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Sales Trend</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8B5CF6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesTrendChart;
