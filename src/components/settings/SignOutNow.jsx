import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "antd";
import { LogOutIcon } from "lucide-react";
import ConfirmSignOut from "./ConfirmSignOut";

const SignOutNow = () => {
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/auth");
    // Optionally refresh the page to fully reset everything
    window.location.reload();
  };

  return (
    <motion.div
      className="bg-white-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-blue-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <LogOutIcon className="text-white-100 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-100">You're Done? 🤔</h2>
      </div>
      <p className="text-gray-300 mb-4">
        This will log you out of your account. You can log in again anytime.
      </p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        onClick={() => setSignOutModalOpen(true)}
      >
        Yeah, Sure.
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
