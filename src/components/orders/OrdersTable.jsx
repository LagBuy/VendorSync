import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/orders/");
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleConfirmDelivery = async (id) => {
    try {
      // Fetch order details
      const { data: orderData } = await axiosInstance.get(`/orders/${id}/`);
      if (orderData.status === "Delivered") {
        toast.error("Order is already delivered.");
        return;
      }

      // Fetch OTP to confirm order status:
      const { data: statusData } = await axiosInstance.get(`/orders/${id}/status/`);
      const backendOtp = statusData.otp;

      if (!backendOtp) {
        toast.error("No OTP available for this order.");
        return;
      }

      const userOtp = prompt("Enter OTP to confirm delivery:");
      if (!userOtp) {
        toast.error("Please enter an OTP.");
        return;
      }

      // Update order status
      await axiosInstance.patch(`/orders/${id}/`, {
        status: "Delivered",
        otp: userOtp,
      });

      //  THERE IS NO DELETE ORDER BECAUSE A VENDOR SHOULD NOT DELETE AN ORDER
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: "Delivered" } : order
        )
      );
      toast.success("Order confirmed successfully!");
    } catch (error) {
      console.error("Error confirming delivery:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to confirm delivery.");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().toLowerCase().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm)
  );

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100"> Orders </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for orders"
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No orders found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-100">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-100">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-100">
                    ₦{order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(order.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                      <Eye size={18} />
                    </button>
                    {order.status !== "Delivered" && (
                      <button
                        onClick={() => handleConfirmDelivery(order.id)}
                        className="text-green-400 hover:text-green-300"
                        title="Confirm Delivery"
                        disabled={isLoading}
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default OrdersTable;