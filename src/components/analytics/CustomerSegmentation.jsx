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
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const CustomerSegmentation = () => {
  const [segmentationData, setSegmentationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSegmentationData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/customer-segmentation/");
        setSegmentationData(Array.isArray(data) ? data : []);
        setError(false);
      } catch (error) {
        console.error("Error fetching segmentation data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setSegmentationData([]);
        setError(true);
        toast.error(error.response?.data?.message || "Failed to load customer segmentation data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSegmentationData();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Customer Segmentation
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-72">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-400 font-medium h-72 flex flex-col justify-center items-center">
          <p>
            We can't load customer segmentation at the moment. If the problem
            persists, check back later.
          </p>
        </div>
      ) : segmentationData.length > 0 ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="80%"
              data={segmentationData}
            >
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#9CA3AF" />
              <Radar
                name="Segment A"
                dataKey="A"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
              <Radar
                name="Segment B"
                dataKey="B"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-400 font-medium h-72 flex flex-col justify-center items-center">
          <p>No customer segmentation data available.</p>
        </div>
      )}
    </motion.div>
  );
};

export default CustomerSegmentation;