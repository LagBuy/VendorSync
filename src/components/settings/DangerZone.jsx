import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, Shield, Sparkles, Lock, X, Check, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Cookies from "js-cookie";

const DangerZone = () => {
  const [confirming, setConfirming] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setConfirming(true);
    setError("");
  };

  const handleConfirm = (yes) => {
    if (yes) {
      setShowForm(true);
    } else {
      setConfirming(false);
      setShowForm(false);
      setFormData({ email: "", password: "" });
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleCancel = () => {
    setConfirming(false);
    setShowForm(false);
    setFormData({ email: "", password: "" });
    setError("");
  };

  const handleFinalDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Archive the user first
      await axiosInstance.post("/archive-user", formData);

      // Then delete the user
      await axiosInstance.delete("/delete-account", { data: formData });

      toast.success("Account deleted successfully!", {
        className: "custom-toast-success"
      });
      
      // Clear auth data
      Cookies.remove("jwt-token");
      localStorage.clear();
      navigate("/goodbye");
    } catch (error) {
      console.error("Error deleting account:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage = error.response?.data?.message || "Could not delete your account. Please check your info.";
      setError(errorMessage);
      toast.error(errorMessage, {
        className: "custom-toast-error"
      });
    } finally {
      setLoading(false);
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

  const WarningItem = ({ icon: Icon, text }) => (
    <div className="flex items-center space-x-3 text-gray-400">
      <Icon size={16} className="text-red-500 flex-shrink-0" />
      <span className="text-sm">{text}</span>
    </div>
  );

  return (
    <>
      <style>{toastStyles}</style>
      
      <motion.div
        className="bg-gradient-to-br from-red-900/20 to-black rounded-3xl shadow-2xl p-8 border border-red-500/30 backdrop-blur-sm mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <AlertTriangle className="mr-3 text-red-500" size={24} />
            <h2 className="text-xl font-bold text-white">Danger Zone</h2>
          </div>
          <div className="flex items-center text-red-500 text-sm">
            <Sparkles size={16} className="mr-1" />
            <span>Critical</span>
          </div>
        </div>

        {/* Initial State */}
        {!confirming && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-black/50 backdrop-blur-sm">
              <div className="flex items-start">
                <AlertTriangle className="text-red-500 mr-3 mt-0.5" size={20} />
                <div>
                  <h3 className="text-red-500 font-semibold mb-2">Permanent Account Deletion</h3>
                  <p className="text-gray-400 text-sm">
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <WarningItem icon={Trash2} text="All your data will be permanently deleted" />
              <WarningItem icon={Lock} text="This action is irreversible" />
              <WarningItem icon={Shield} text="You will lose access to all services" />
            </div>

            <motion.button
              onClick={handleDeleteClick}
              className="w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              <Trash2 size={18} className="mr-2" />
              Delete My Account
            </motion.button>
          </motion.div>
        )}

        {/* Confirmation Step */}
        <AnimatePresence>
          {confirming && !showForm && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="p-6 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-black/50 backdrop-blur-sm">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                    <AlertTriangle className="text-red-500" size={32} />
                  </div>
                  <h3 className="text-red-500 text-xl font-bold mb-2">
                    Are You Absolutely Sure?
                  </h3>
                  <p className="text-gray-400">
                    This action cannot be reversed. Please confirm you want to proceed with account deletion.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => handleConfirm(true)}
                    className="flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    <Check size={18} className="mr-2" />
                    Yes, Continue
                  </motion.button>
                  <motion.button
                    onClick={() => handleConfirm(false)}
                    className="flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    <X size={18} className="mr-2" />
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Confirmation Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleFinalDelete}
              className="space-y-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="p-6 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-black/50 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                    <Lock className="text-red-500" size={32} />
                  </div>
                  <h3 className="text-red-500 text-xl font-bold mb-2">
                    Final Verification Required
                  </h3>
                  <p className="text-gray-400">
                    Enter your account credentials to confirm permanent deletion
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors duration-300"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors duration-300"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-black/50 backdrop-blur-sm"
                    >
                      <div className="flex items-center">
                        <AlertCircle className="text-red-500 mr-3" size={16} />
                        <p className="text-red-500 text-sm">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300 shadow-lg disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed"
                      whileHover={!loading ? { scale: 1.05 } : {}}
                      whileTap={!loading ? { scale: 0.95 } : {}}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Deleting...
                        </div>
                      ) : (
                        <>
                          <Trash2 size={18} className="mr-2" />
                          Delete Forever
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-gray-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                    >
                      <X size={18} className="mr-2" />
                      Cancel
                    </motion.button>
                  </div>
                </div>

                {/* Final Warning */}
                <div className="mt-6 p-4 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-black/50 backdrop-blur-sm">
                  <div className="flex items-start">
                    <AlertTriangle className="text-yellow-500 mr-3 mt-0.5" size={16} />
                    <div>
                      <h4 className="text-yellow-500 text-sm font-semibold mb-1">
                        This is your final warning
                      </h4>
                      <p className="text-gray-400 text-xs">
                        Once you confirm, your account and all associated data will be permanently erased and cannot be recovered.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default DangerZone;