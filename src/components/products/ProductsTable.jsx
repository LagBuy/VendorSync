import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAddShoppingCart,
  MdSearch,
  MdFilterList,
  MdTrendingUp,
  MdInventory,
  MdStar,
  MdRefresh,
} from "react-icons/md";
import { axiosInstance } from "../../axios-instance/axios-instance";
import ProductRow from "./ProductRow";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

const ProductsTable = ({ setTotalProducts }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Compute stats from products data
  const stats = {
    total: products.length,
    lowStock: products.filter((p) => p.stock_quantity < 10).length,
    bestSellers: products.filter((p) => p.sales > 50).length,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const {
          data: { data },
        } = await axiosInstance.get("/vendors/products/");
        setProducts(data || []);
        setTotalProducts?.(data.length);
      } catch {
        setProducts([]);
        setTotalProducts?.(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [setTotalProducts]);

  useEffect(() => {
    const filtered = Array.isArray(products)
      ? products.filter(
          (product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.categories?.[0]
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : [];
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      setTotalProducts?.(updatedProducts.length);
    } catch {
      console.log("Delete failed");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = (updatedProduct) => {
    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
  };

  const handleAdd = (newProduct) => {
    const updatedProducts = [
      ...products,
      { ...newProduct, sales: newProduct.sales || 0 },
    ];
    setProducts(updatedProducts);
    setTotalProducts?.(updatedProducts.length);
    setShowAddModal(false);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const {
        data: { data },
      } = await axiosInstance.get("/vendors/products/");
      setProducts(data || []);
      setTotalProducts?.(data.length);
    } catch {
      console.log("Refresh failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-6 md:p-8 border-2 border-green-400 shadow-2xl shadow-green-500/10 mb-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-yellow-400"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500 rounded-full opacity-5 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-500 rounded-full opacity-5 blur-xl"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <motion.h2
              className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              PRODUCT DASHBOARD
            </motion.h2>
            <p className="text-gray-400 text-sm">
              Manage your inventory with style
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <motion.button
              onClick={refreshData}
              className="bg-gray-800 text-gray-300 px-4 py-3 rounded-xl hover:bg-gray-700 border border-gray-700 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <MdRefresh
                className={`text-lg ${isLoading ? "animate-spin" : ""}`}
              />
            </motion.button>

            <motion.button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-400 hover:to-green-500 transform transition-all duration-300 shadow-lg hover:shadow-green-500/25 border-2 border-green-400 flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <MdAddShoppingCart className="text-sm" />
              <span>Add Product</span>
            </motion.button>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-green-400 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl group-hover:bg-green-500/30 transition-all">
                <MdInventory className="text-2xl text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-400 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Best Sellers</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.bestSellers}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-xl group-hover:bg-yellow-500/30 transition-all">
                <MdTrendingUp className="text-2xl text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-red-400 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Low Stock</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.lowStock}
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-xl group-hover:bg-red-500/30 transition-all">
                <MdStar className="text-2xl text-red-400" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300"
            />
          </div>

          <button className="bg-gray-800 text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-700 border border-gray-700 transition-all duration-300 hover:scale-105 flex items-center gap-2">
            <MdFilterList className="text-sm" />
            <span>FILTERS</span>
          </button>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-lg">Loading your products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="hover:bg-gray-800/50 transition-all duration-300 group"
                    >
                      <ProductRow
                        product={product}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <MdInventory className="text-4xl text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No products found</p>
              <p className="text-gray-500 text-sm">
                Try adjusting your search or add a new product
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-400 hover:to-green-500 transform transition-all duration-300"
              >
                Add Your First Product
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showAddModal && (
          <AddProductModal
            onCancel={() => setShowAddModal(false)}
            onAdd={handleAdd}
          />
        )}

        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onCancel={() => setEditingProduct(null)}
            onSave={handleUpdate}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductsTable;
