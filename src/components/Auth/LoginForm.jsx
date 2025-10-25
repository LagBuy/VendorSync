import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { axiosInstance } from "../../axios-instance/axios-instance";
import {
  Mail,
  Lock,
  ChevronRight,
  Sparkles,
  Shield,
  Store,
  Rocket,
} from "lucide-react";

const LoginForm = ({ onSwitch, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = Cookies.get("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please input your email and password");
      setIsLoading(false);
      return;
    }

    const reqBody = {
      email,
      password,
    };

    try {
      const { data } = await axiosInstance.post("/auth/login/", reqBody);
      const { user, access } = data;

      console.log(access);

      Cookies.set("jwt-token", access, { expires: 3 });

      if (rememberMe) {
        Cookies.set("savedEmail", email, { expires: 3 });
      } else {
        Cookies.remove("savedEmail");
      }

      onLogin(user, access);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/30"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">WELCOME BACK</span>
            </motion.div>

            {/* Updated Icon and Headline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-black text-white mb-2"
            >
              Grow Your Business
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-green-100 text-lg"
            >
              Access orders, analytics, and growth tools
            </motion.p>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3"
            >
              <Shield className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:border-green-500 text-gray-900 placeholder-green-600 transition-all duration-300 text-lg"
                  placeholder="your@business.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-green-50 border-2 border-green-200 rounded-2xl focus:outline-none focus:border-green-500 text-gray-900 placeholder-green-600 transition-all duration-300 text-lg"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {passwordVisible ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div
                  className={`relative w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                    rememberMe ? "scale-110" : ""
                  }`}
                  style={{
                    borderColor: rememberMe
                      ? "rgb(34 197 94)"
                      : "rgb(187 247 208)",
                    backgroundColor: rememberMe
                      ? "rgb(34 197 94)"
                      : "rgb(240 253 244)",
                  }}
                >
                  {rememberMe && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span
                  className="text-sm font-medium group-hover:opacity-80 transition-opacity duration-200"
                  style={{ color: "rgb(17 24 39)" }}
                >
                  Remember Me
                </span>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="absolute opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
              </label>

              <motion.button
                type="button"
                onClick={() => onSwitch("forgot")}
                className="text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{ color: "rgb(34 197 94)" }}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Forgot Password?
              </motion.button>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-green-500/25 border-2 border-white/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-3 text-lg">
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
               
                   Grant Me Access
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="flex-1 border-t border-green-200"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">or</span>
              <div className="flex-1 border-t border-green-200"></div>
            </div>

            {/* Switch to Signup */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">Don't have a vendor account?</p>
              <motion.button
                type="button"
                onClick={() => onSwitch("signup")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 font-bold py-3 px-8 rounded-2xl border-2 border-green-300 shadow-lg shadow-green-500/10 transition-all duration-300 hover:border-green-400 hover:shadow-green-500/20"
                disabled={isLoading}
              >
                <span className="flex items-center justify-center gap-2">
                  <Store className="w-5 h-5" />
                  Become a Vendor
                </span>
              </motion.button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-4 text-center">
          <p className="text-white/80 text-sm">
            🚀 Join vendors making ₦50K - ₦250K+ monthly on LagBuy
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
