import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { MdAddShoppingCart } from "react-icons/md";
import { useEffect, useState } from "react";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    const updated = products.filter((product) => product.id !== id);
    setProducts(updated);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditedProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleSaveEdit = () => {
    const { price, stock } = editedProduct;
    if (price < 0 || stock < 0) {
      alert("Price and stock must be positive numbers.");
      return;
    }
    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            ...editedProduct,
            price: parseFloat(editedProduct.price),
            stock: parseInt(editedProduct.stock),
          }
        : product
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
    setEditedProduct({ name: "", category: "", price: "", stock: "" });
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = () => {
    const { name, category, price, stock, image } = newProduct;
    if (!name || !category || price < 0 || stock < 0) {
      alert("Please fill all fields correctly.");
      return;
    }
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const productToAdd = {
      id: newId,
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      sales: 0,
      image:
        image ||
        "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60",
    };
    setProducts([...products, productToAdd]);
    setShowAddModal(false);
    setNewProduct({ name: "", category: "", price: "", stock: "", image: "" });
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-100">Products</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-xl pl-10 pr-2 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 self-end sm:self-auto"
          >
            <MdAddShoppingCart />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredProducts.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                    <img
                      src={product.image}
                      alt="Product img"
                      className="size-10 rounded-full object-cover"
                    />
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {product.sales}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-400 text-center py-8">
            No products added yet.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
            <h3 className="text-lg text-white font-bold mb-4">Edit Product</h3>
            <input
              type="text"
              name="name"
              value={editedProduct.name}
              onChange={handleEditChange}
              className="w-full bg-gray-600 text-white p-2 rounded-lg"
              placeholder="Name"
            />
            <input
              type="text"
              name="category"
              value={editedProduct.category}
              onChange={handleEditChange}
              className="w-full bg-gray-600 text-white p-2 rounded-lg"
              placeholder="Category"
            />
            <input
              type="number"
              min="0"
              name="price"
              value={editedProduct.price}
              onChange={handleEditChange}
              className="w-full bg-gray-600 text-white p-2 rounded-lg"
              placeholder="Price"
            />
            <input
              type="number"
              min="0"
              name="stock"
              value={editedProduct.stock}
              onChange={handleEditChange}
              className="w-full bg-gray-600 text-white p-2 rounded-lg"
              placeholder="Stock"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-300 hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4 shadow-lg">
            <h3 className="text-lg text-white font-bold mb-4">
              Add New Product
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleNewProductChange}
              className="w-full bg-gray-600 text-white p-2 rounded-lg"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={newProduct.category}
              onChange={handleNewProductChange}
              className="w-full bg-gray-600 text-white p-2 rounded-lg"
            />
            <input
              type="number"
              min="0"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleNewProductChange}
              className="w-full bg-gray-600 text-white p-2 rounded-lg"
            />
            <input
              type="number"
              min="0"
              name="stock"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={handleNewProductChange}
              className="w-full bg-gray-600 text-white p-2 rounded-lg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-gray-600 text-white p-2 rounded-lg"
            />
            {newProduct.image && (
              <img
                src={newProduct.image}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover mt-2"
              />
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-300 hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsTable;
