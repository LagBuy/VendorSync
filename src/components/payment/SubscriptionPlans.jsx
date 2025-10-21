import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { FaChartLine, FaCrown, FaStar, FaRocket, FaLock, FaCheck, FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [index, setIndex] = useState(0);
  const [showPlans, setShowPlans] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [formErrors, setFormErrors] = useState({});
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

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const timer = setTimeout(() => {
        setFormErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formErrors]);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get("/plans");
        setPlans(
          data.length
            ? data
            : [
                {
                  title: "Free",
                  price: 0,
                  note: "NGN/Month",
                  description: "Get started with basic features",
                  current: true,
                  popular: false,
                  features: ["Basic access", "Limited features", "Community support"],
                },
                {
                  title: "Pro",
                  price: 5000,
                  note: "NGN/Month",
                  description: "Advanced features for growing businesses",
                  current: false,
                  popular: true,
                  features: ["Advanced analytics", "Priority support", "Custom integrations", "API access"],
                },
                {
                  title: "Enterprise",
                  price: 15000,
                  note: "NGN/Month",
                  description: "Full suite for enterprise solutions",
                  current: false,
                  popular: false,
                  features: ["All Pro features", "Dedicated account manager", "Custom solutions", "24/7 support", "SLA guarantee"],
                },
              ]
        );
        setSuccess("Subscription plans loaded successfully!");
      } catch (error) {
        console.error("Error fetching plans:", error);
        const errorMessage = error.response?.data?.message || "Failed to load subscription plans.";
        setError(errorMessage);
        setPlans([
          {
            title: "Free",
            price: 0,
            note: "NGN/Month",
            description: "Start your journey today",
            current: true,
            popular: false,
            features: ["Basic access", "Standard support", "Essential features"],
          },
          {
            title: "Pro",
            price: 5000,
            note: "NGN/Month",
            description: "Upgrade for more features",
            current: false,
            popular: true,
            features: ["More features", "Better support", "Enhanced capabilities"],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!cardNumber.match(/^\d{16}$/)) {
      errors.cardNumber = "Card number must be 16 digits.";
    }
    if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.expiry = "Expiry must be in MM/YY format.";
    }
    if (!cvv.match(/^\d{3}$/)) {
      errors.cvv = "CVV must be 3 digits.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Please correct the form errors.");
      return;
    }

    try {
      await axiosInstance.post("/subscribe", {
        planTitle: plans[index].title,
        cardNumber,
        expiry,
        cvv,
      });
      setSuccess("Subscription successful!");
      setShowPaymentForm(false);
      setCardNumber("");
      setExpiry("");
      setCvv("");
      // Refresh plans to update current plan
      const { data } = await axiosInstance.get("/plans");
      setPlans(data.length ? data : plans);
    } catch (error) {
      console.error("Error processing subscription:", error);
      const errorMessage = error.response?.data?.message || "Failed to process subscription.";
      setError(errorMessage);
    }
  };

  const handleNext = () => {
    if (index < plans.length - 1) {
      setIndex(index + 1);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const togglePlans = () => setShowPlans(!showPlans);
  const closePlans = () => {
    setShowPlans(false);
    setIndex(0);
  };
  const showPayment = () => setShowPaymentForm(true);
  const closePayment = () => {
    setShowPaymentForm(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setFormErrors({});
    setError(null);
  };

  const formatPrice = (price) =>
    `₦${Number(price).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
    })}`;

  const plan = plans[index] || {};

  return (
    <motion.div
      className="relative bg-gradient-to-br from-black to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden"
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
                <p className="text-green-400 text-sm font-medium">✓ {success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Messages */}
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
                <p className="text-yellow-400 text-sm font-medium">⚠️ {error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
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
              Premium Plans
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Choose the perfect plan for your success journey
            </p>
          </div>
        </motion.div>

        {loading ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
              <FaRocket className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-500 text-lg" />
            </div>
            <p className="text-gray-400 mt-4 font-medium">Loading premium plans...</p>
          </motion.div>
        ) : !showPlans ? (
          <motion.button
            onClick={togglePlans}
            className="relative w-full group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
            <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-6 rounded-xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-2">
              <FaCrown className="text-sm" />
              EXPLORE PREMIUM PLANS
            </div>
          </motion.button>
        ) : (
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`relative rounded-2xl p-6 sm:p-8 backdrop-blur-sm border transition-all duration-500 ${
              plan.popular 
                ? "bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/30 shadow-2xl" 
                : "bg-gradient-to-br from-gray-800/50 to-gray-800/30 border-gray-700"
            }`}>
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-1 rounded-full text-xs font-bold tracking-widest flex items-center gap-1 shadow-lg">
                    <FaStar className="text-black" />
                    MOST POPULAR
                  </div>
                </motion.div>
              )}

              {/* Current Plan Badge */}
              {plan.current && (
                <motion.div 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest flex items-center gap-1 shadow-lg">
                    <FaCheck className="text-white" />
                    CURRENT PLAN
                  </div>
                </motion.div>
              )}

              <h2 className="text-3xl font-bold text-white mb-2 text-center">{plan.title}</h2>
              
              <div className="text-center mb-2">
                <p className="text-4xl font-bold text-white">{formatPrice(plan.price)}</p>
                <p className="text-gray-400 text-sm mt-1">{plan.note}</p>
              </div>

              <p className="text-gray-300 text-center mb-8 leading-relaxed">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features?.map((feature, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-center text-gray-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <div className="p-1 bg-green-500/20 rounded-lg mr-3">
                      <FaCheck className="text-green-400 text-sm" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                onClick={showPayment}
                disabled={plan.current}
                className={`relative w-full group ${
                  plan.current ? "cursor-not-allowed" : ""
                }`}
                whileHover={plan.current ? {} : { scale: 1.02 }}
                whileTap={plan.current ? {} : { scale: 0.98 }}
              >
                <div className={`absolute inset-0 rounded-xl blur-md transition-all duration-300 ${
                  plan.current 
                    ? "bg-gray-600" 
                    : "bg-green-500 group-hover:blur-lg"
                }`}></div>
                <div className={`relative w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.current
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-2xl"
                }`}>
                  <FaLock className="text-sm" />
                  {plan.current ? "Current Plan" : "Subscribe Now"}
                </div>
              </motion.button>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <motion.button
                  onClick={handleBack}
                  disabled={index === 0}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: index === 0 ? 1 : 1.05 }}
                  whileTap={{ scale: index === 0 ? 1 : 0.95 }}
                >
                  <FaArrowLeft className="text-sm" />
                  Previous
                </motion.button>

                <div className="flex gap-1">
                  {plans.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === index ? "bg-yellow-500 w-6" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={handleNext}
                  disabled={index === plans.length - 1}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: index === plans.length - 1 ? 1 : 1.05 }}
                  whileTap={{ scale: index === plans.length - 1 ? 1 : 0.95 }}
                >
                  Next
                  <FaArrowRight className="text-sm" />
                </motion.button>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={closePlans}
                  className="text-gray-400 hover:text-white font-semibold text-sm transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                  <FaTimes className="text-sm" />
                  Close Plans
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Form Modal */}
        <AnimatePresence>
          {showPaymentForm && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
              >
                {/* Form Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaLock className="text-yellow-500" />
                    Payment Details
                  </h3>
                  <button
                    onClick={closePayment}
                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                      className={`w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 ${
                        formErrors.cardNumber ? "border-yellow-500" : ""
                      }`}
                      maxLength={16}
                    />
                    <AnimatePresence>
                      {formErrors.cardNumber && (
                        <motion.p 
                          className="text-yellow-400 mt-2 text-sm flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          ⚠️ {formErrors.cardNumber}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Expiry and CVV */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className={`w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 ${
                          formErrors.expiry ? "border-yellow-500" : ""
                        }`}
                        maxLength={5}
                      />
                      <AnimatePresence>
                        {formErrors.expiry && (
                          <motion.p 
                            className="text-yellow-400 mt-2 text-sm flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            ⚠️ {formErrors.expiry}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className={`w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 ${
                          formErrors.cvv ? "border-yellow-500" : ""
                        }`}
                        maxLength={3}
                      />
                      <AnimatePresence>
                        {formErrors.cvv && (
                          <motion.p 
                            className="text-yellow-400 mt-2 text-sm flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            ⚠️ {formErrors.cvv}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="relative w-full group mt-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 px-6 rounded-xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-2">
                      <FaLock className="text-sm" />
                      COMPLETE PAYMENT - {formatPrice(plan.price)}
                    </div>
                  </motion.button>
                </form>

                {/* Security Notice */}
                <div className="flex items-center gap-2 mt-4 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <FaLock className="text-green-400 text-sm" />
                  <span className="text-gray-400 text-xs">Your payment is secure and encrypted</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}