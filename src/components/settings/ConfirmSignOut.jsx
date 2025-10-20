import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Cookies from "js-cookie";

const ConfirmSignOut = ({ onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/logout/");
      Cookies.remove("jwt-token"); // Clear JWT cookie
      toast.success("Logged out successfully!");

      // Redirect to auth page
      window.location.replace("/auth");

      onConfirm(); // Call onConfirm to close dialog or handle parent logic
    } catch (error) {
      console.error("Error signing out:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to sign out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800 dark:text-dark">
      <p className="mb-4">Are you sure you want to log out of your account?</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging Out..." : "Log Out"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmSignOut;
