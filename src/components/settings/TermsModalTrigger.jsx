import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TermsAndConditions from "./TermsAndConditions";
import { FileText, Shield, CheckCircle, Sparkles, ClipboardList } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TermsModalTrigger = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const hasSubmitted = useRef(false);

  const handleSubmit = () => {
    if (hasSubmitted.current) return;

    toast.success("✅ Terms accepted and submitted successfully!", {
      position: "top-center",
      autoClose: 3000,
      className: "custom-toast-success"
    });

    hasSubmitted.current = true;

    setTimeout(() => {
      setShowTerms(false);
      setAgreed(false);
      hasSubmitted.current = false;
    }, 100);
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
    .Toastify__progress-bar {
      background: #EAB308 !important;
    }
  `;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border border-gray-800 backdrop-blur-sm mb-8">
      {/* Inject custom toast styles */}
      <style>{toastStyles}</style>
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="mr-3 text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-white">Terms & Conditions</h2>
        </div>
        <div className="flex items-center text-green-500 text-sm">
          <Sparkles size={16} className="mr-1" />
          <span>Legal</span>
        </div>
      </div>

      <p className="text-gray-400 mb-6 text-center">
        Kindly review our terms and conditions for complete clarity and understanding.
      </p>

      {/* Toggle Button */}
      <div className="text-center mb-4">
        <motion.button
          onClick={() => setShowTerms(!showTerms)}
          className="flex items-center justify-center mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ClipboardList size={18} className="mr-2" />
          {showTerms ? "Hide Terms" : "Review Terms"}
        </motion.button>
      </div>

      {/* Terms and Conditions */}
      <AnimatePresence>
        {showTerms && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <div className="border border-gray-700 rounded-2xl bg-gradient-to-br from-gray-800/50 to-black/50 max-h-[300px] overflow-y-auto shadow-inner backdrop-blur-sm">
              <div className="p-6">
                <TermsAndConditions />
              </div>
            </div>

            {/* Agreement Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-6 rounded-2xl border border-gray-700 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm"
            >
              {/* Custom Checkbox */}
              <div className="flex items-start space-x-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0"
                >
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="hidden"
                  />
                  <label
                    htmlFor="agree"
                    className={`flex items-center justify-center w-6 h-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      agreed
                        ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/30"
                        : "bg-gray-800 border-gray-600 hover:border-yellow-500"
                    }`}
                  >
                    {agreed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <CheckCircle size={14} className="text-white" />
                      </motion.div>
                    )}
                  </label>
                </motion.div>
                <div>
                  <label htmlFor="agree" className="text-white font-semibold text-lg cursor-pointer">
                    I agree to the Terms and Conditions
                  </label>
                  <p className="text-gray-400 text-sm mt-1">
                    By checking this box, you acknowledge that you have read and understood our terms
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!agreed}
                className={`w-full flex items-center justify-center py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${
                  agreed
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 cursor-pointer"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed border border-gray-600"
                }`}
                whileHover={agreed ? { scale: 1.02 } : {}}
                whileTap={agreed ? { scale: 0.98 } : {}}
              >
                <Shield size={18} className="mr-2" />
                {agreed ? "Accept & Continue" : "Please Accept Terms"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Badge */}
      {!showTerms && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-black/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center">
            <Shield className="text-yellow-500 mr-2" size={16} />
            <p className="text-yellow-500 text-sm font-medium">
              Your agreement is secured and encrypted
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TermsModalTrigger;