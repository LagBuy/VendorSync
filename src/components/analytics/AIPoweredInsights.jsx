import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Loader2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ICONS = {
  trending: TrendingUp,
  users: Users,
  shopping: ShoppingBag,
  dollar: DollarSign,
};

const AIPoweredInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("https://your-api.com/api/insights"); // Replace with your actual API
        const data = await res.json();
        setInsights(data);
      } catch (err) {
        console.error("Error fetching insights:", err);
        setInsights([]);
        toast.error(
          "We can't load your business' insight at the moment. Please, check your internet connection and try again. If this issue persists, report to the customer service (check settings)."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Your Business' Insights
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-purple-500 size-8" />
        </div>
      ) : (
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center text-red-400 font-medium">
              No insights available at the moment. Please try again later.
            </div>
          ) : (
            insights.map((item, index) => {
              const Icon = ICONS[item.icon] || TrendingUp;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      item.color || "text-gray-400"
                    } bg-opacity-20`}
                  >
                    <Icon
                      className={`size-6 ${item.color || "text-gray-400"}`}
                    />
                  </div>
                  <p className="text-gray-300">{item.insight}</p>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ToastContainer to show toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
      />
    </motion.div>
  );
};

export default AIPoweredInsights;
