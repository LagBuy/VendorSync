import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdAddShoppingCart } from "react-icons/md";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import SearchBar from "./SearchBar";
import ProductTableHeader from "./ProductTableHeader";
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

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get("/products/");
        setProducts(data || []);
        setTotalProducts?.(data.length);
        toast.success("Products loaded successfully!");
      } catch (error) {
        console.error("Fetch products error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.detail || "Failed to load products. Please check your authentication or permissions.");
        setProducts([]);
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
            product.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
      setTotalProducts?.(products.length - 1);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Delete product error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.detail || "Failed to delete product. Please check your permissions.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
    toast.success("Product updated successfully!");
  };

  const handleAdd = (newProduct) => {
    setProducts([...products, { ...newProduct, sales: newProduct.sales || 0 }]);
    setTotalProducts?.(products.length + 1);
    setShowAddModal(false);
    toast.success("Product added successfully!");
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100 md:px-1">
          Products
        </h2>
        <div className="flex gap-4 items-center">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
            disabled={isLoading}
          >
            <MdAddShoppingCart />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">Loading products...</div>
        ) : filteredProducts.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <ProductTableHeader />
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400 text-center py-8">
            No products found.
          </div>
        )}
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={handleUpdate}
        />
      )}

      {showAddModal && (
        <AddProductModal
          onCancel={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </motion.div>
  );
};

export default ProductsTable;