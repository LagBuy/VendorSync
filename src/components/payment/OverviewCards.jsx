import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { DollarSign, Clock, Wallet, ArrowDownCircle, Sparkles, TrendingUp, Zap } from "lucide-react";

export default function OverviewCards() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Custom Toast Styles
  const toastStyles = `
    .custom-toast-success {
      background: linear-gradient(135deg, #111827 0%, #000000 100%) !important;
      color: #22C55E !important;
      border: 1px solid #22C55E !important;
      border-radius: 16px !important;
      backdrop-filter: blur(10px) !important;
    }
    .custom-toast-error {
      background: linear-gradient(135deg, #111827 0%, #000000 100%) !important;
      color: #EF4444 !important;
      border: 1px solid #EF4444 !important;
      border-radius: 16px !important;
      backdrop-filter: blur(10px) !important;
    }
    .Toastify__progress-bar {
      background: #EAB308 !important;
    }
  `;

  useEffect(() => {
    const fetchFinancialStats = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/financial-stats");
        setStats([
          {
            title: "Total Revenue",
            amount: `₦${Number(data.totalRevenue ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: "#22C55E",
            bgColor: "bg-green-500/20",
            borderColor: "border-green-500/30",
            gradient: "from-green-500/10 to-green-600/5",
            description: "Total earnings to date",
            trend: "up"
          },
          {
            title: "Pending Cashout",
            amount: `₦${Number(data.pendingCashout ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: Clock,
            color: "#EAB308",
            bgColor: "bg-yellow-500/20",
            borderColor: "border-yellow-500/30",
            gradient: "from-yellow-500/10 to-yellow-600/5",
            description: "Awaiting processing",
            trend: "pending"
          },
          {
            title: "Available Balance",
            amount: `₦${Number(data.availableBalance ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: Wallet,
            color: "#3B82F6",
            bgColor: "bg-blue-500/20",
            borderColor: "border-blue-500/30",
            gradient: "from-blue-500/10 to-blue-600/5",
            description: "Ready for withdrawal",
            trend: "stable"
          },
          {
            title: "Withdrawn",
            amount: `₦${Number(data.withdrawn ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: ArrowDownCircle,
            color: "#EF4444",
            bgColor: "bg-red-500/20",
            borderColor: "border-red-500/30",
            gradient: "from-red-500/10 to-red-600/5",
            description: "Total withdrawn amount",
            trend: "down"
          },
        ]);
        toast.success("Financial stats loaded successfully!", {
          className: "custom-toast-success"
        });
      } catch (error) {
        console.error("Error fetching financial stats:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message,
          { className: "custom-toast-error" }
        );
        // Set fallback stats
        setStats([
          {
            title: "Total Revenue",
            amount: "₦0.00",
            icon: DollarSign,
            color: "#22C55E",
            bgColor: "bg-green-500/20",
            borderColor: "border-green-500/30",
            gradient: "from-green-500/10 to-green-600/5",
            description: "Total earnings to date",
            trend: "up"
          },
          {
            title: "Pending Cashout",
            amount: "₦0.00",
            icon: Clock,
            color: "#EAB308",
            bgColor: "bg-yellow-500/20",
            borderColor: "border-yellow-500/30",
            gradient: "from-yellow-500/10 to-yellow-600/5",
            description: "Awaiting processing",
            trend: "pending"
          },
          {
            title: "Available Balance",
            amount: "₦0.00",
            icon: Wallet,
            color: "#3B82F6",
            bgColor: "bg-blue-500/20",
            borderColor: "border-blue-500/30",
            gradient: "from-blue-500/10 to-blue-600/5",
            description: "Ready for withdrawal",
            trend: "stable"
          },
          {
            title: "Withdrawn",
            amount: "₦0.00",
            icon: ArrowDownCircle,
            color: "#EF4444",
            bgColor: "bg-red-500/20",
            borderColor: "border-red-500/30",
            gradient: "from-red-500/10 to-red-600/5",
            description: "Total withdrawn amount",
            trend: "down"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialStats();
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <TrendingUp size={14} className="text-green-500" />;
      case "down":
        return <TrendingUp size={14} className="text-red-500 rotate-180" />;
      case "pending":
        return <Clock size={14} className="text-yellow-500" />;
      default:
        return <Zap size={14} className="text-blue-500" />;
    }
  };

  const getTrendText = (trend) => {
    switch (trend) {
      case "up":
        return "Growing";
      case "down":
        return "Decreasing";
      case "pending":
        return "Processing";
      default:
        return "Stable";
    }
  };

  return (
    <>
      <style>{toastStyles}</style>
      <ToastContainer />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Enhanced Loading State
          <div className="col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-gray-800 backdrop-blur-sm h-32"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-2xl animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-800 rounded w-1/2 animate-pulse"></div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          stats.map((item, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${item.gradient} to-black rounded-3xl p-6 border ${item.borderColor} backdrop-blur-sm cursor-pointer relative overflow-hidden group`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { type: "spring", stiffness: 300 }
              }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Animated Background Effect */}
              <motion.div
                className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                initial={false}
                animate={{ opacity: hoveredCard === index ? 1 : 0 }}
              />

              {/* Header with Icon and Trend */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bgColor} border ${item.borderColor} backdrop-blur-sm`}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div className="flex items-center space-x-1 bg-gray-900/50 rounded-full px-3 py-1 border border-gray-700">
                  {getTrendIcon(item.trend)}
                  <span className="text-xs text-gray-400 font-medium">
                    {getTrendText(item.trend)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <p className="text-gray-400 text-sm font-medium mb-2 flex items-center">
                  {item.title}
                  <Sparkles size={12} className="ml-1 text-yellow-500" />
                </p>
                <motion.p 
                  className="text-2xl font-bold text-white mb-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {item.amount}
                </motion.p>
                <p className="text-gray-500 text-xs">
                  {item.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <motion.div
                className={`absolute inset-0 rounded-3xl border-2 ${item.borderColor} opacity-0`}
                initial={false}
                animate={{ opacity: hoveredCard === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Floating Particles Effect */}
              <AnimatePresence>
                {hoveredCard === index && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white/10"
                        initial={{ 
                          opacity: 0, 
                          scale: 0,
                          x: Math.random() * 100 - 50,
                          y: Math.random() * 100 - 50
                        }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + i * 20}%`
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Bar */}
      {!loading && stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-8 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="text-yellow-500 mr-3" size={20} />
              <div>
                <h4 className="text-white font-semibold">Financial Overview</h4>
                <p className="text-gray-400 text-sm">
                  Real-time financial performance metrics
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-yellow-500 font-bold text-lg">
                {stats.filter(stat => stat.trend === 'up').length} / {stats.length}
              </p>
              <p className="text-gray-400 text-sm">Positive Trends</p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}