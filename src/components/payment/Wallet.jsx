// Wallet.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet2Icon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wallet = ({ selectedAmount }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: "",
    password: "",
    amount: selectedAmount, // Initial amount from props
  });
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [errors, setErrors] = useState({});

  // Update amount if selectedAmount changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, amount: selectedAmount }));
  }, [selectedAmount]);

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
      const positiveValue = Math.max(0, Number(value)); // ✅ Force positive numbers
      setFormData((prev) => ({ ...prev, amount: positiveValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAccount = async (accountNumber) => {
    try {
      const response = await fetch(
        `https://api.mockbank.com/verify/${accountNumber}`
      );
      if (!response.ok) throw new Error("Invalid account");

      const data = await response.json();

      if (data.account_name && data.bank_name) {
        setAccountName(data.account_name);
        setBankName(data.bank_name);
      } else {
        toast.error("Invalid account details. Please try again.");
        setAccountName("");
        setBankName("");
      }
    } catch (error) {
      if (error.message === "Invalid account") {
        toast.error("Account not found. Please check the number.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
      setAccountName("");
      setBankName("");
    }
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
      toast.success("Withdrawal request submitted successfully.");
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
      className="bg-gray-900 text-white p-8 rounded-xl shadow-xl mb-3 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <ToastContainer />
      <div className="flex items-center mb-6">
        <Wallet2Icon className="text-yellow-400 mr-3" size={28} />
        <h2 className="text-xl font-bold">Withdraw Funds</h2>
      </div>
      <p className="text-md text-gray-400 mb-3">
        Submit your account details to request a payout.
      </p>
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-2 rounded-sm shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
        onClick={() => setShowForm(true)}
      >
        Withdraw
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-2 space-y-2">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-200"
              placeholder="Enter 10-digit account number"
            />
            {errors.accountNumber && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.accountNumber}
              </p>
            )}
            {accountName && (
              <p className="text-green-400 mt-2">
                {accountName} - {bankName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-200"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 mt-2 text-sm">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="1"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-200"
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 mt-2 text-sm">{errors.amount}</p>
            )}
          </div>

          <div className="flex justify-between space-x-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-3 rounded-xl"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default Wallet;
