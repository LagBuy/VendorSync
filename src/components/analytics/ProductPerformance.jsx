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
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const ProductPerformance = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductPerformance = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/product-performance/");
        setProductData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch product performance data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setProductData([]);
        toast.error(error.response?.data?.message || "Failed to load product performance data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductPerformance();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Product Performance
      </h2>
      <p className="text-gray-300 mb-4">
        This shows how good or bad your product is doing in the market.
      </p>
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Loading...
        </div>
      ) : productData.length > 0 ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#000000" />
              <YAxis stroke="#000000" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 31, 31, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#8B5CF6" />
              <Bar dataKey="revenue" fill="#10B981" />
              <Bar dataKey="profit" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          No product performance data available.
        </div>
      )}
    </motion.div>
  );
};

export default ProductPerformance;