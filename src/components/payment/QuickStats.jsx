import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
import {
  FaArrowUp,
  FaDollarSign,
  FaUserCheck,
  FaChartLine,
  FaRocket,
  FaCrown,
} from "react-icons/fa";

export default function QuickStats() {
  const [selectedVendors, setSelectedVendors] = useState(0);
  const [status, setStatus] = useState("");
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorStats = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/vendor-stats");
        setSelectedVendors(data.selectedVendors ?? 0);
        setStatus(data.status ?? "pending");
        setPosition(data.position ?? 0);
      } catch {
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
        return {
          text: "Selected",
          emoji: "✅",
          color: "text-green-400",
          bg: "bg-green-500/20",
          border: "border-green-500/30",
        };
      case "pending":
        return {
          text: "Pending",
          emoji: "⏳",
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
        };
      case "rejected":
        return {
          text: "Rejected",
          emoji: "❌",
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
        };
      default:
        return {
          text: "Unknown",
          emoji: "❓",
          color: "text-gray-400",
          bg: "bg-gray-500/20",
          border: "border-gray-500/30",
        };
    }
  };

  const formatPosition = (position) => {
    if (position <= 10)
      return { text: "Top Tier", emoji: "👑", color: "text-yellow-400" };
    if (position <= 20)
      return { text: "Elite", emoji: "💎", color: "text-purple-400" };
    if (position <= 40)
      return { text: "Premium", emoji: "⭐", color: "text-blue-400" };
    return { text: "Standard", emoji: "📊", color: "text-green-400" };
  };

  const handleReadMore = () => {
    toast.info(
      "This is just the first edition of the vendor's dashboard. LAGBUY team is working on improving and making it much better for you, simply because you matter, likewise your business. Stick around and we'll wow you soon",
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
          background: "#1f2937",
          border: "1px solid #374151",
          color: "#fbbf24",
        },
      }
    );
  };

  const statusInfo = formatStatus(status);
  const positionInfo = formatPosition(position);

  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl shadow-2xl border-2 border-green-400/50 overflow-hidden backdrop-blur-sm"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#1f2937",
          border: "1px solid #374151",
          color: "#fbbf24",
        }}
      />

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-yellow-400"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 blur-md rounded-xl"></div>
            <div className="relative p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
              <FaChartLine className="text-black text-lg" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Vendor Analytics
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Real-time performance metrics
            </p>
          </div>
        </motion.div>

        {loading ? (
          <motion.div
            className="flex flex-col items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
              <FaChartLine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-500 text-sm" />
            </div>
            <p className="text-gray-400 mt-3 text-sm font-medium">
              Loading vendor insights...
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Total Vendors Card */}
            <motion.div
              className="bg-gradient-to-r from-gray-800/50 to-gray-800/30 border-2 border-gray-700 rounded-2xl p-4 backdrop-blur-sm group hover:border-green-400/30 transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <FaUserCheck className="text-green-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                      Total Vendors
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {selectedVendors}
                    </p>
                  </div>
                </div>
                <div className="text-green-400 text-sm font-semibold bg-green-500/10 px-2 py-1 rounded-lg">
                  +{Math.floor(selectedVendors * 0.12)}%
                </div>
              </div>
            </motion.div>

            {/* Status Card */}
            <motion.div
              className={`${statusInfo.bg} ${statusInfo.border} border-2 rounded-2xl p-4 backdrop-blur-sm group hover:scale-[1.02] transition-all duration-300`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                    <FaDollarSign className={`${statusInfo.color} text-lg`} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                      Approval Status
                    </p>
                    <p className={`text-lg font-bold ${statusInfo.color} mt-1`}>
                      {statusInfo.emoji} {statusInfo.text}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-xs font-semibold ${statusInfo.color} bg-black/20 px-2 py-1 rounded-lg`}
                >
                  Active
                </div>
              </div>
            </motion.div>

            {/* Ranking Card */}
            <motion.div
              className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border-2 border-yellow-500/20 rounded-2xl p-4 backdrop-blur-sm group hover:border-yellow-500/40 transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <FaCrown className="text-yellow-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                      Market Position
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-lg font-bold ${positionInfo.color}`}
                      >
                        {positionInfo.emoji} {positionInfo.text}
                      </span>
                      <span className="text-gray-400 text-sm">
                        • Top {position}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                  <FaArrowUp className="text-xs" />
                  <span>+5</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Rank Progress</span>
                  <span>{position}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${position}%` }}
                    transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Performance Summary */}
            <motion.div
              className="bg-gradient-to-r from-gray-800/40 to-gray-800/20 border-2 border-gray-700 rounded-xl p-3 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">Performance</span>
                </div>
                <span className="text-green-400 font-semibold">Excellent</span>
              </div>
            </motion.div>

            {/* Read More Button */}
            <motion.button
              className="relative w-full group mt-2"
              onClick={handleReadMore}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-600 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-yellow-600 hover:from-green-400 hover:to-yellow-500 text-black font-bold py-3 px-6 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-2">
                <FaRocket className="text-sm" />
                Explore Vendor's Dashboard
              </div>
            </motion.button>
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <motion.div
            className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-gray-500 text-xs">Live updates</span>
            </div>
            <span className="text-gray-500 text-xs">
              Updated:{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}