import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Wallet from "./Wallet";
import { Calendar, Clock, TrendingUp, Sparkles, Zap, Target, DollarSign } from "lucide-react";

export default function PaymentSchedule() {
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(7);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hoveredPeriod, setHoveredPeriod] = useState(null);
  const [error, setError] = useState(null);

  // Auto-dismiss error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    .custom-toast-info {
      background: linear-gradient(135deg, #111827 0%, #000000 100%) !important;
      color: #EAB308 !important;
      border: 1px solid #EAB308 !important;
      border-radius: 16px !important;
      backdrop-filter: blur(10px) !important;
    }
    .Toastify__progress-bar {
      background: #EAB308 !important;
    }
  `;

  const getBarColor = (amount, period) => {
    const minAmount = (totalAmount / 30) * 7;
    const maxAmount = totalAmount;
    const middleAmount = (minAmount + maxAmount) / 2;

    if (period === withdrawalPeriod) {
      if (amount <= minAmount) return "from-red-500 to-red-600";
      if (amount > minAmount && amount <= middleAmount) return "from-yellow-500 to-yellow-600";
      if (amount > middleAmount && amount < maxAmount) return "from-green-500 to-green-600";
      return "from-white to-gray-200";
    } else {
      if (amount <= minAmount) return "from-red-500/30 to-red-600/20";
      if (amount > minAmount && amount <= middleAmount) return "from-yellow-500/30 to-yellow-600/20";
      if (amount > middleAmount && amount < maxAmount) return "from-green-500/30 to-green-600/20";
      return "from-white/30 to-gray-200/20";
    }
  };

  const getBarHeight = (period) => {
    const amount = calculateAmountForPeriod(period);
    return totalAmount ? (amount / totalAmount) * 120 : 0;
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    });
  };

  const calculateAmountForPeriod = (days) => {
    return (totalAmount / 30) * days;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [earningsRes, periodRes] = await Promise.all([
          axiosInstance.get("/earnings"),
          axiosInstance.get("/withdrawal-period")
        ]);

        setTotalAmount(earningsRes.data.totalEarnings ?? 0);
        setWithdrawalPeriod(periodRes.data.period ?? 7);

        toast.success("💰 Payment schedule data loaded successfully!", {
          className: "custom-toast-success",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error fetching payment schedule data:", error);
        const errorMessage = error.response?.data?.message || "Failed to load payment schedule data.";
        setError(errorMessage);
        toast.error(errorMessage, { 
          className: "custom-toast-error",
          autoClose: 3000,
        });
        setTotalAmount(0);
        setWithdrawalPeriod(7);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = async (e) => {
    const period = parseInt(e.target.value);
    setUpdating(true);
    setError(null);
    
    try {
      await axiosInstance.patch("/withdrawal-period", { period });
      setWithdrawalPeriod(period);
      toast.success(`✅ Withdrawal period set to ${period} days!`, {
        className: "custom-toast-success",
        autoClose: 3000,
      });
      if (period === 30) {
        toast.info(`💰 Total Payout: ${formatCurrency(totalAmount)}`, {
          className: "custom-toast-info",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating withdrawal period:", error);
      const errorMessage = error.response?.data?.message || "Failed to update withdrawal period.";
      setError(errorMessage);
      toast.error(errorMessage, { 
        className: "custom-toast-error",
        autoClose: 3000,
      });
    } finally {
      setUpdating(false);
    }
  };

  const periodOptions = [
    { value: 7, label: "1 Week", icon: Clock },
    { value: 14, label: "2 Weeks", icon: Calendar },
    { value: 21, label: "3 Weeks", icon: TrendingUp },
    { value: 28, label: "4 Weeks", icon: Target },
    { value: 30, label: "1 Month", icon: DollarSign },
  ];

  return (
    <>
      <style>{toastStyles}</style>
      <ToastContainer autoClose={3000} />

      <motion.div
        className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm mb-4 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-green-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-xl"></div>

        <div className="relative z-10">
          {/* Error Message - Auto-dismisses after 3 seconds */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Calendar className="mr-3 text-yellow-500" size={24} />
              <h2 className="text-xl font-bold text-white">Payment Schedule</h2>
            </div>
            {!loading && (
              <div className="flex items-center text-green-500 text-sm">
                <Sparkles size={16} className="mr-1" />
                <span>Active</span>
              </div>
            )}
          </div>

          {loading ? (
            // Enhanced Loading State
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-10 bg-gray-800 rounded-2xl w-48 animate-pulse"></div>
                <div className="h-6 bg-gray-800 rounded w-32 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-5 gap-4 h-40 items-end">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-16 bg-gray-800 rounded-t-2xl animate-pulse" style={{ height: `${20 + index * 20}px` }}></div>
                    <div className="h-4 bg-gray-800 rounded w-12 mt-2 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Period Selector */}
              <div className="mb-8">
                <label htmlFor="withdrawalPeriod" className="block text-gray-400 text-sm font-medium mb-4 flex items-center">
                  <Zap className="mr-2 text-yellow-500" size={16} />
                  Select Withdrawal Period:
                </label>
                <div className="relative">
                  <select
                    id="withdrawalPeriod"
                    value={withdrawalPeriod}
                    onChange={handleChange}
                    disabled={updating}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-base font-semibold p-4 rounded-2xl focus:border-yellow-500 focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
                  >
                    {periodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {updating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full"
                      />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Visualization Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold flex items-center">
                    <TrendingUp className="mr-2 text-green-500" size={20} />
                    Payout Visualization
                  </h3>
                  <div className="text-right">
                    <p className="text-yellow-500 font-bold text-lg">
                      {formatCurrency(calculateAmountForPeriod(withdrawalPeriod))}
                    </p>
                    <p className="text-gray-400 text-sm">Selected Period</p>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="grid grid-cols-5 gap-4 items-end h-40">
                  {periodOptions.map((option) => {
                    const amount = calculateAmountForPeriod(option.value);
                    const isSelected = option.value === withdrawalPeriod;
                    const Icon = option.icon;
                    
                    return (
                      <motion.div
                        key={option.value}
                        className="flex flex-col items-center justify-end group cursor-pointer"
                        onHoverStart={() => setHoveredPeriod(option.value)}
                        onHoverEnd={() => setHoveredPeriod(null)}
                        onClick={() => !updating && handleChange({ target: { value: option.value } })}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {/* Bar */}
                        <motion.div
                          className={`w-16 rounded-t-2xl bg-gradient-to-b ${getBarColor(amount, option.value)} border ${
                            isSelected ? 'border-white/30' : 'border-transparent'
                          } backdrop-blur-sm relative overflow-hidden`}
                          initial={{ height: 0 }}
                          animate={{ height: getBarHeight(option.value) }}
                          transition={{ duration: 1, type: "spring", delay: option.value * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {/* Shine Effect */}
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: -100 }}
                            animate={{ x: hoveredPeriod === option.value ? 400 : -100 }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                          />
                        </motion.div>

                        {/* Label */}
                        <div className="mt-4 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Icon size={14} className={`mr-1 ${
                              isSelected ? 'text-yellow-500' : 'text-gray-500'
                            }`} />
                            <span className={`text-sm font-semibold ${
                              isSelected ? 'text-white' : 'text-gray-400'
                            }`}>
                              {option.label}
                            </span>
                          </div>
                          
                          {/* Amount Display */}
                          <AnimatePresence>
                            {(isSelected || hoveredPeriod === option.value) && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="text-xs text-yellow-500 font-medium block"
                              >
                                {formatCurrency(amount)}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <motion.div
                            className="w-2 h-2 bg-yellow-500 rounded-full mt-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-6 backdrop-blur-sm"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                    <p className="text-white font-bold text-xl">{formatCurrency(totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Selected Period</p>
                    <p className="text-yellow-500 font-bold text-xl">
                      {periodOptions.find(opt => opt.value === withdrawalPeriod)?.label}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-black/30 rounded-xl border border-gray-700">
                  <p className="text-gray-400 text-sm text-center">
                    {withdrawalPeriod === 30 
                      ? "Full month payout selected - receive complete earnings"
                      : `Partial payout - ${((withdrawalPeriod / 30) * 100).toFixed(0)}% of monthly earnings`
                    }
                  </p>
                </div>
              </motion.div>

              {/* Wallet Component */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Wallet selectedAmount={calculateAmountForPeriod(withdrawalPeriod)} />
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}