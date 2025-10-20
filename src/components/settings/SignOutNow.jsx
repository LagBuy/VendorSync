import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Shield, Sparkles, AlertTriangle, Power } from "lucide-react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const SignOutNow = ({ onLogin }) => {
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoading(true);
    try {
      Cookies.remove("jwt-token", { path: "/" });
      onLogin(null, null);
      navigate("/auth");
      toast.success("You've been successfully signed out!", {
        className: "custom-toast-success",
      });
    } catch (e) {
      console.error("Logout error:", {
        message: e.message,
      });
      toast.error("Logout failed. Please try again.", {
        className: "custom-toast-error",
      });
    } finally {
      setIsLoading(false);
      setSignOutModalOpen(false); // Close modal after every attempt
    }
  };

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
    .Toastify__progress-bar {
      background: #EAB308 !important;
    }
  `;

  return (
    <>
      <style>{toastStyles}</style>

      <motion.div
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Power className="mr-3 text-yellow-500" size={24} />
            <h2 className="text-xl font-bold text-white">Session Control</h2>
          </div>
          <div className="flex items-center text-green-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Secure</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle
              className="text-yellow-500 mt-1 flex-shrink-0"
              size={20}
            />
            <div>
              <h3 className="text-white font-semibold mb-2">
                Ready to leave? 🤔
              </h3>
              <p className="text-gray-400">
                This will securely log you out of your account. You can sign
                back in anytime to continue managing your dashboard.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-black/50 backdrop-blur-sm">
            <div className="flex items-center">
              <Shield className="text-yellow-500 mr-3" size={16} />
              <p className="text-yellow-500 text-sm font-medium">
                Your session will be securely terminated
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            className="w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300 shadow-lg disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={() => setSignOutModalOpen(true)}
            disabled={isLoading}
          >
            <LogOut size={18} className="mr-2" />
            {isLoading ? "Securing Logout..." : "Sign Out"}
          </motion.button>
        </div>
      </motion.div>

      {/* Custom Modal */}
      <AnimatePresence>
        {signOutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-red-500/30 shadow-2xl w-full max-w-md"
            >
              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <LogOut className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Confirm Sign Out
                </h3>
                <p className="text-gray-400">
                  Are you sure you want to sign out of your account?
                </p>
              </div>

              {/* Warning Message */}
              <div className="p-4 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-black/50 backdrop-blur-sm mb-6">
                <div className="flex items-start">
                  <AlertTriangle
                    className="text-yellow-500 mr-3 mt-0.5"
                    size={16}
                  />
                  <div>
                    <h4 className="text-yellow-500 text-sm font-semibold mb-1">
                      You'll need to sign in again
                    </h4>
                    <p className="text-gray-400 text-xs">
                      Any unsaved changes will be lost. Make sure to save your
                      work before proceeding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  onClick={() => setSignOutModalOpen(false)}
                  className="flex-1 flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Signing Out...
                    </div>
                  ) : (
                    <>
                      <LogOut size={16} className="mr-2" />
                      Yes, Sign Out
                    </>
                  )}
                </motion.button>
              </div>

              {/* Security Footer */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-center text-gray-500 text-xs">
                  <Shield size={12} className="mr-1" />
                  Secure session termination
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SignOutNow;
