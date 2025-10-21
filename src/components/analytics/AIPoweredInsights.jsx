import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Brain,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { axiosInstance } from "../../axios-instance/axios-instance";

const ICONS = {
  trending: TrendingUp,
  users: Users,
  shopping: ShoppingBag,
  dollar: DollarSign,
  brain: Brain,
  sparkles: Sparkles,
  target: Target,
  zap: Zap,
};

const AIPoweredInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/insights/");
        setInsights(Array.isArray(data) ? data : []);
      } catch {
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border-2 border-green-400/50 backdrop-blur-sm relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-yellow-400"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500 rounded-full opacity-5 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500 rounded-full opacity-5 blur-xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center">
          <Brain className="mr-3 text-yellow-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">
              AI Business Insights
            </h2>
            <p className="text-gray-400 text-sm">
              Smart analytics and recommendations
            </p>
          </div>
        </div>
        {!loading && insights.length > 0 && (
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Live AI</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-400">AI is analyzing your business data...</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <Brain className="text-yellow-500" size={32} />
          </div>
          <h3 className="text-white font-semibold text-xl mb-2">
            No Insights Available
          </h3>
          <p className="text-gray-400 max-w-sm">
            AI insights will appear here once we gather enough data about your
            business performance.
          </p>
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {insights.map((item, index) => {
            const Icon = ICONS[item.icon] || TrendingUp;
            const color = item.color || "#EAB308";

            return (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-4 border border-gray-700 hover:border-yellow-500/30 transition-all duration-300 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-green-500/20 border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300"
                    style={{ borderColor: color + "30" }}
                  >
                    <Icon className="size-6" style={{ color: color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm leading-relaxed">
                      {item.insight}
                    </p>
                    {item.action && (
                      <div className="mt-2 flex items-center text-green-400 text-xs">
                        <Target size={12} className="mr-1" />
                        <span>Recommended Action</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Insight type indicator */}
                <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    AI Analysis • {new Date().toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-yellow-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {!loading && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-800 text-center"
        >
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <Zap size={14} className="mr-2 text-yellow-500" />
            <span>AI insights update every 24 hours</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIPoweredInsights;
