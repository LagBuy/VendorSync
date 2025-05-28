import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { DollarSign, Clock, Wallet, ArrowDownCircle } from "lucide-react";

export default function OverviewCards() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

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
            color: "bg-green-500/10 text-green-500",
          },
          {
            title: "Pending Cashout",
            amount: `₦${Number(data.pendingCashout ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: Clock,
            color: "bg-yellow-500/10 text-yellow-500",
          },
          {
            title: "Available Balance",
            amount: `₦${Number(data.availableBalance ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: Wallet,
            color: "bg-blue-500/10 text-blue-500",
          },
          {
            title: "Withdrawn",
            amount: `₦${Number(data.withdrawn ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: ArrowDownCircle,
            color: "bg-red-500/10 text-red-500",
          },
        ]);
        toast.success("Financial stats loaded successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error fetching financial stats:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to load financial stats.",
          { position: "top-center" }
        );
        // Set fallback stats
        setStats([
          {
            title: "Total Revenue",
            amount: "₦0.00",
            icon: DollarSign,
            color: "bg-green-500/10 text-green-500",
          },
          {
            title: "Pending Cashout",
            amount: "₦0.00",
            icon: Clock,
            color: "bg-yellow-500/10 text-yellow-500",
          },
          {
            title: "Available Balance",
            amount: "₦0.00",
            icon: Wallet,
            color: "bg-blue-500/10 text-blue-500",
          },
          {
            title: "Withdrawn",
            amount: "₦0.00",
            icon: ArrowDownCircle,
            color: "bg-red-500/10 text-red-500",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <ToastContainer />
      {loading ? (
        <div className="col-span-4 text-center">
          <svg
            className="animate-spin h-8 w-8 text-white mx-auto"
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
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      ) : (
        stats.map((item, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg transition-transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${item.color}`}
              >
                <item.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-gray-400 text-sm">{item.title}</p>
            <p className="text-2xl font-bold text-white mt-1">{item.amount}</p>
          </motion.div>
        ))
      )}
    </div>
  );
}