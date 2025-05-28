import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { FaArrowUp, FaDollarSign, FaUserCheck } from "react-icons/fa";

export default function QuickStats() {
  const [selectedVendors, setSelectedVendors] = useState(0);
  const [status, setStatus] = useState("");
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorStats = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/vendor-stats");
        setSelectedVendors(data.selectedVendors ?? 0);
        setStatus(data.status ?? "pending");
        setPosition(data.position ?? 0);
        toast.success("Vendor stats loaded successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error fetching vendor stats:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to load vendor stats.",
          { position: "top-center" }
        );
        setSelectedVendors(0);
        setStatus("pending");
        setPosition(0);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorStats();
  }, []);

  const formatStatus = (status) => {
    switch (status) {
      case "selected":
        return "selected ✓";
      case "pending":
        return "pending ⏳";
      case "rejected":
        return "rejected ❌";
      default:
        return "unknown";
    }
  };

  const formatPosition = (position) => {
    const emoji = position <= 20 ? "💃" : "🏆";
    return `${position.toFixed(0)}% ${emoji}`;
  };

  const handleReadMore = () => navigate("/vendor");

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <ToastContainer />
      <motion.h2
        className="text-gray-900 text-lg font-bold mb-4"
        initialStatus={{ opacity: 0, y: 20 }}
        animateStatus={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        Quick Stats
      </motion.h2>
      {loading ? (
        <div className="flex items-center justify-center relative py-4">
          <svg
            className="animate-spin h-6 w-6 text-gray-500"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0
              0 1 8 -8v8H4z"
            />
          </svg>
        </div>
      ) : (
        <>
          <motion.div
            className="flex items-center justify-between py-2"
            initialStatus={{ opacity: 0, x: -20 }}
            animateStatus={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
          >
            <div className="flex items-center gap-3">
              <FaUserCheck className="text-green-600 text-xl" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Total Vendors</span>
                <span className="text-base font-semibold text-gray-800">{selectedVendors}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-between py-2"
            initialStatus={{ opacity: 0, x: -20 }}
            animateStatus={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.3,
            }}
          >
            <div className="flex items-center gap-3">
              <FaDollarSign className="text-blue-600 text-xl" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-base font-semibold text-green-600">{formatStatus(status)}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-between py-2"
            initialStatus={{ opacity: 0, x: -20 }}
            animateStatus={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            <div className="flex items-center gap-3">
              <FaArrowUp className="text-blue-600 text-base" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Ranking</span>
                <span className="text-base font-semibold text-blue-600">{formatPosition(position)}</span>
              </div>
            </div>
          </motion.div>

          <motion.button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            initialStatus={{ opacity: 0, y: 20 }}
            animateStatus={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.7,
            }}
            onClick={handleReadMore}
          >
            Read More
          </motion.button>
        </>
      )}
    </div>
  );
}