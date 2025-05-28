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
    amount: selectedAmount,
  });
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [errors, setErrors] = useState({});

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
      const positiveValue = Math.max(0, Number(value));
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
      className="bg-gray-900 text-white p-4 sm:p-6 rounded-xl shadow-xl mb-4 border border-gray-700 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <ToastContainer />
      <div className="flex items-center mb-4">
        <Wallet2Icon className="text-yellow-400 mr-3" size={28} />
        <h2 className="text-xl font-bold">Withdraw Funds</h2>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Submit your account details to request a payout.
      </p>
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md shadow-md w-full mb-3"
        onClick={() => setShowForm(true)}
      >
        Withdraw
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto max-h-[80vh] sm:max-h-full"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-200"
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
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-200"
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
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-200"
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 mt-2 text-sm">{errors.amount}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-md"
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


//  NO ENDPOINT INTEGRATION HERE YET