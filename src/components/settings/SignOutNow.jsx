import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "antd";
import { LogOutIcon } from "lucide-react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { axiosInstance } from "../../axios-instance/axios-instance";
import ConfirmSignOut from "./ConfirmSignOut";

const SignOutNow = ({ onLogin }) => {
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      Cookies.remove("jwt-token");
      onLogin(null, null);
      navigate("/auth");
      toast.success("You don sharply logout!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Omoo, logout failed. Please try again.");
      Cookies.remove("jwt-token");
      onLogin(null, null);
      navigate("/auth");
    } finally {
      setSignOutModalOpen(false);
    }
  };

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-blue-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <LogOutIcon className="text-gray-600 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">You're Done? 🤔</h2>
      </div>
      <p className="text-gray-600 mb-4">
        This will log you out of your account. You can log in again anytime.
      </p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        onClick={() => setSignOutModalOpen(true)}
      >
        Logout
      </button>

      <Modal
        open={signOutModalOpen}
        onCancel={() => setSignOutModalOpen(false)}
        footer={null}
      >
        <ConfirmSignOut
          onConfirm={handleLogout}
          onCancel={() => setSignOutModalOpen(false)}
        />
      </Modal>
    </motion.div>
  );
};

export default SignOutNow;