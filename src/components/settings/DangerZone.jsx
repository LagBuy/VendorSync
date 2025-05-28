import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
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

      toast.success("Account deleted successfully!");
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
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-red-900 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <Trash2 className="text-red-400 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-100">
          Delete My Account
        </h2>
      </div>

      {!confirming && !showForm && (
        <>
          <p className="text-gray-300 mb-4">
            Delete my account and all contents.
          </p>
          <button
            onClick={handleDeleteClick}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            disabled={loading}
          >
            Delete Account
          </button>
        </>
      )}

      <AnimatePresence>
        {confirming && !showForm && (
          <motion.div
            className="text-gray-300 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="mb-3">
              Are you sure you want to delete your account?
            </p>
            <button
              onClick={() => handleConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 transition duration-200"
              disabled={loading}
            >
              Yes
            </button>
            <button
              onClick={() => handleConfirm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              disabled={loading}
            >
              No
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleFinalDelete}
            className="mt-6 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-gray-300 mb-2">
              Enter your details to confirm account deletion:
            </p>

            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100"
              disabled={loading}
            />

            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-gray-100"
              disabled={loading}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DangerZone;