// Wallet.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet2Icon, Eye, EyeOff, BanknoteIcon, ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wallet = ({ selectedAmount }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: "",
    password: "",
    amount: selectedAmount,
  });
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, amount: selectedAmount }));
  }, [selectedAmount]);

  // Auto-dismiss errors after 3 seconds
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "accountNumber") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
        setAccountName("");
        setBankName("");

        if (numericValue.length === 10) {
          await verifyAccount(numericValue);
        }
      }
      return;
    }

    if (name === "amount") {
      const positiveValue = Math.max(0, Number(value));
      setFormData((prev) => ({ ...prev, amount: positiveValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAccount = async (accountNumber) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mockbank.com/verify/${accountNumber}`
      );
      if (!response.ok) throw new Error("Invalid account");

      const data = await response.json();

      if (data.account_name && data.bank_name) {
        setAccountName(data.account_name);
        setBankName(data.bank_name);
        toast.success("✅ Account verified successfully!");
      } else {
        toast.error("Invalid account details. Please try again.");
        setAccountName("");
        setBankName("");
      }
    } catch (error) {
      if (error.message === "Invalid account") {
        toast.error("❌ Account not found. Please check the number.");
      } else {
        toast.error("🌐 Network error. Please check your connection.");
      }
      setAccountName("");
      setBankName("");
    }
    setIsLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.accountNumber || formData.accountNumber.length !== 10) {
      newErrors.accountNumber = "Enter a valid 10-digit account number.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    if (formData.amount <= 0) {
      newErrors.amount = "Enter a valid amount greater than 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("🎉 Withdrawal request submitted successfully!");
      setShowForm(false);
      setFormData({ accountNumber: "", password: "", amount: "" });
      setAccountName("");
      setBankName("");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ accountNumber: "", password: "", amount: "" });
    setErrors({});
    setAccountName("");
    setBankName("");
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md mx-auto overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-green-500"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-xl"></div>

      <ToastContainer 
        position="top-right"
        theme="dark"
        toastClassName="bg-gray-900 border border-gray-800"
        autoClose={3000}
      />
      
      <div className="relative z-10">
        {/* Header Section */}
        <motion.div 
          className="flex items-center mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 blur-md rounded-full"></div>
            <Wallet2Icon className="relative text-yellow-500 mr-4" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Instant Withdrawal
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Fast & secure fund transfers
            </p>
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div 
          className="flex items-center justify-center mb-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ShieldCheck className="text-green-500 mr-2" size={16} />
          <span className="text-xs text-gray-300">256-bit SSL Encrypted</span>
        </motion.div>

        {/* Main Withdraw Button */}
        <motion.button
          className="relative w-full group"
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
          <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-6 rounded-xl shadow-2xl transition-all duration-300 flex items-center justify-center">
            <BanknoteIcon className="mr-2" size={20} />
            WITHDRAW FUNDS
          </div>
        </motion.button>

        {/* Quick Amount Display */}
        {selectedAmount > 0 && (
          <motion.div 
            className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-green-400 text-sm">Selected Amount:</span>
              <span className="text-white font-bold">${selectedAmount}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Withdrawal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Withdrawal Details</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Account Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                      placeholder="Enter 10-digit account number"
                      maxLength={10}
                    />
                    {isLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.accountNumber && (
                      <motion.p 
                        className="text-red-400 mt-2 text-sm flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        ⚠️ {errors.accountNumber}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {accountName && (
                    <motion.p 
                      className="text-green-400 mt-2 text-sm flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      ✅ {accountName} - {bankName}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 text-white placeholder-gray-500 backdrop-blur-sm pr-12 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p 
                        className="text-red-400 mt-2 text-sm flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        ⚠️ {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter amount"
                  />
                  <AnimatePresence>
                    {errors.amount && (
                      <motion.p 
                        className="text-red-400 mt-2 text-sm flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        ⚠️ {errors.amount}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-4 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-all duration-300 hover:border-gray-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    CONFIRM WITHDRAWAL
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Wallet;