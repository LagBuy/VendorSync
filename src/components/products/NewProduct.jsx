import Modal from "antd/es/modal/Modal";
import { motion } from "framer-motion";
import AddProducts from "./Addproducts";
import { useState } from "react";

const NewProduct = () => {
  const [NewProductModalOpen, setNewProductModalOpen] = useState(false);
  return (
    <motion.div
      className="bg-white-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-blue-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100"></h2>
      </div>
      <p className="text-gray-300 mb-4"></p>
      <button
        className="bg-blue-600 hover:bg-white-700 text-white font-bold py-2 px-4 rounded 
      transition duration-200"
        onClick={() => setNewProductModalOpen(true)}
      >
        Add Product
      </button>
      <Modal
        open={NewProductModalOpen}
        onCancel={() => setNewProductModalOpen(false)}
      >
        <AddProducts />
      </Modal>
    </motion.div>
  );
};

export default NewProduct;
