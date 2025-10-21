import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Wallet from "./Wallet";
import {
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  DollarSign,
  Shield,
} from "lucide-react";

export default function PaymentSchedule() {
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(7);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hoveredPeriod, setHoveredPeriod] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Auto-dismiss messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const getBarColor = (amount, period) => {
    const minAmount = (totalAmount / 30) * 7;
    const maxAmount = totalAmount;
    const middleAmount = (minAmount + maxAmount) / 2;

    if (period === withdrawalPeriod) {
      if (amount <= minAmount) return "from-red-500 to-red-600";
      if (amount > minAmount && amount <= middleAmount)
        return "from-yellow-500 to-yellow-600";
      if (amount > middleAmount && amount < maxAmount)
        return "from-green-500 to-green-600";
      return "from-white to-gray-200";
    } else {
      if (amount <= minAmount) return "from-red-500/30 to-red-600/20";
      if (amount > minAmount && amount <= middleAmount)
        return "from-yellow-500/30 to-yellow-600/20";
      if (amount > middleAmount && amount < maxAmount)
        return "from-green-500/30 to-green-600/20";
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
          axiosInstance.get("/withdrawal-period"),
        ]);

        setTotalAmount(earningsRes.data.totalEarnings ?? 0);
        setWithdrawalPeriod(periodRes.data.period ?? 7);
        setSuccess("Payment schedule data loaded successfully!");
      } catch (error) {
        console.error("Error fetching payment schedule data:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to load payment schedule data.";
        setError(errorMessage);
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
      setSuccess(`Withdrawal period set to ${period} days!`);
      if (period === 30) {
        setSuccess(
          `Withdrawal period set to ${period} days! Total Payout: ${formatCurrency(
            totalAmount
          )}`
        );
      }
    } catch (error) {
      console.error("Error updating withdrawal period:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update withdrawal period.";
      setError(errorMessage);
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
    <motion.div
      className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-6 border border-gray-800 backdrop-blur-sm mb-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-green-500"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-400 text-sm font-medium">
                  ✓ {success}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <p className="text-yellow-400 text-sm font-medium">
                  ⚠️ {error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-md rounded-xl"></div>
              <Calendar className="relative text-yellow-500 mr-4" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Payment Schedule
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Plan your withdrawals strategically
              </p>
            </div>
          </div>
          {!loading && (
            <div className="flex items-center text-green-500 text-sm bg-green-500/20 border border-green-500/30 px-3 py-2 rounded-xl backdrop-blur-sm">
              <Sparkles size={16} className="mr-2" />
              <span>Active</span>
            </div>
          )}
        </motion.div>

        {loading ? (
          // Enhanced Loading State
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between">
              <div className="h-10 bg-gray-800 rounded-2xl w-48 animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded w-32 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-5 gap-4 h-40 items-end">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-16 bg-gray-800 rounded-t-2xl animate-pulse"
                    style={{ height: `${20 + index * 20}px` }}
                  ></div>
                  <div className="h-4 bg-gray-800 rounded w-12 mt-2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Period Selector */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="withdrawalPeriod"
                className="block text-gray-400 text-sm font-medium mb-4 flex items-center"
              >
                <Zap className="mr-2 text-yellow-500" size={16} />
                Select Withdrawal Period:
              </label>
              <div className="relative">
                <select
                  id="withdrawalPeriod"
                  value={withdrawalPeriod}
                  onChange={handleChange}
                  disabled={updating}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white text-base font-semibold p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300 appearance-none cursor-pointer backdrop-blur-sm"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {updating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full"
                    />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Visualization Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
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
                      onClick={() =>
                        !updating &&
                        handleChange({ target: { value: option.value } })
                      }
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Bar */}
                      <motion.div
                        className={`w-16 rounded-t-2xl bg-gradient-to-b ${getBarColor(
                          amount,
                          option.value
                        )} border ${
                          isSelected ? "border-white/30" : "border-transparent"
                        } backdrop-blur-sm relative overflow-hidden`}
                        initial={{ height: 0 }}
                        animate={{ height: getBarHeight(option.value) }}
                        transition={{
                          duration: 1,
                          type: "spring",
                          delay: option.value * 0.1,
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {/* Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: -100 }}
                          animate={{
                            x: hoveredPeriod === option.value ? 400 : -100,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 0.5,
                          }}
                        />
                      </motion.div>

                      {/* Label */}
                      <div className="mt-4 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Icon
                            size={14}
                            className={`mr-1 ${
                              isSelected ? "text-yellow-500" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm font-semibold ${
                              isSelected ? "text-white" : "text-gray-400"
                            }`}
                          >
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
            </motion.div>

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
                  <p className="text-white font-bold text-xl">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Selected Period</p>
                  <p className="text-yellow-500 font-bold text-xl">
                    {
                      periodOptions.find(
                        (opt) => opt.value === withdrawalPeriod
                      )?.label
                    }
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-black/30 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm text-center">
                  {withdrawalPeriod === 30
                    ? "🎉 Full month payout selected - receive complete earnings"
                    : `⏳ Partial payout - ${(
                        (withdrawalPeriod / 30) *
                        100
                      ).toFixed(0)}% of monthly earnings`}
                </p>
              </div>
            </motion.div>

            {/* Security & Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="text-blue-400 text-lg" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">
                    Secure Payment Schedule
                  </h4>
                  <p className="text-gray-400 text-xs">
                    Your funds are protected and will be processed according to
                    your selected schedule
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Wallet Component */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Wallet
                selectedAmount={calculateAmountForPeriod(withdrawalPeriod)}
              />
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
