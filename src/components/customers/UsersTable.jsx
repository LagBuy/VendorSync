import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Eye, Mail, Calendar, Package } from "lucide-react";

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Fetch customers and map data
  const fetchCustomers = async () => {
    try {
      const res = await fetch("https://your-backend-api/customers");
      const data = await res.json();

      const mappedData = data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role:
          user.businessType?.toLowerCase() === "vendor"
            ? "Also a Vendor"
            : "Customer",
        status: user.isActive ? "Active" : "Inactive",
        lastPurchaseDate: user.lastPurchaseDate || "N/A",
        productPurchased: user.lastProductPurchased || "N/A",
      }));

      setAllUsers(mappedData);
      setFilteredUsers(mappedData);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );

    setFilteredUsers(filtered);
  };

  const viewOrders = (userId) => {
    alert(`Viewing orders for customer ID: ${userId}`);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 border border-yellow-500/50 shadow-lg relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 rounded-full blur-sm" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-green-500/5 rounded-full blur-sm" />

      {/* Compact Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-yellow-500 rounded-lg">
              <Users className="text-black" size={14} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Customers</h2>
              <p className="text-yellow-500 text-xs">User Management</p>
            </div>
          </div>

          <div className="relative w-48">
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 border border-gray-700 text-sm w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-2.5 top-2.5 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Compact Table */}
      <div className="relative z-10 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-800/50 transition-colors duration-200"
              >
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-semibold text-sm">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate max-w-[120px]">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-[120px] flex items-center">
                        <Mail size={10} className="mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "Also a Vendor"
                        ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                        : "bg-green-500/20 text-green-500 border border-green-500/30"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === "Active"
                        ? "bg-green-500/20 text-green-500 border border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-xs text-gray-300">
                    <div className="flex items-center space-x-1 mb-1">
                      <Calendar size={10} />
                      <span>{user.lastPurchaseDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package size={10} />
                      <span className="truncate max-w-[100px]">
                        {user.productPurchased}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <motion.button
                    onClick={() => viewOrders(user.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={12} />
                    <span>View Orders</span>
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Users className="text-yellow-500 mb-3" size={32} />
            <p className="text-white font-medium mb-1">No customers found</p>
            <p className="text-gray-400 text-sm">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No customer data available"}
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer Stats */}
      <motion.div
        className="relative z-10 mt-4 pt-3 border-t border-gray-700 flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="text-gray-400 text-xs">
          Showing {filteredUsers.length} of {allUsers.length} customers
        </span>
        <div className="flex space-x-4 text-xs">
          <span className="text-green-500 font-medium">
            {allUsers.filter((u) => u.status === "Active").length} Active
          </span>
          <span className="text-yellow-500 font-medium">
            {allUsers.filter((u) => u.role === "Also a Vendor").length} Vendors
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UsersTable;
