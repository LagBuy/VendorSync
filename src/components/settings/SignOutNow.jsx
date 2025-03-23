import Modal from "antd/es/modal/Modal";
import { motion } from "framer-motion";
import { LogOutIcon } from "lucide-react";
import ConfirmSignOut from "./ConfirmSignOut";
import { useState } from "react";

const SignOutNow = () => {
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  return (
    <motion.div
      className="bg-white-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-blue-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <LogOutIcon className="text-red-400 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-100">Done ?</h2>
      </div>
      <p className="text-gray-300 mb-4">
        This will log you out of your account as a vendor. You can login again
        when you feel like 😊
      </p>
      <button
        className="bg-blue-600 hover:bg-white-700 text-white font-bold py-2 px-4 rounded 
      transition duration-200"
        onClick={() => setSignOutModalOpen(true)}
      >
        Sign Out
      </button>
      <Modal
        open={signOutModalOpen}
        onCancel={() => setSignOutModalOpen(false)}
      >
        <ConfirmSignOut />
      </Modal>
    </motion.div>
  );
};

export default SignOutNow;
