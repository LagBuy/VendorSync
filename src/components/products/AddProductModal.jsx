import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const AddProductModal = ({ onCancel, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null, // For file upload
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/products/");
        setCategories(data || []); // Ensure categories is always an array
      } catch (error) {
        console.error("Fetch categories error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load categories.");
        setCategories([]); // Fallback to empty array on error
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/products/categories/", { name: newCategory });
      setCategories([...categories, data]);
      setFormData({ ...formData, category: data.id });
      setNewCategory("");
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Add category error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to add category.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("price", parseFloat(formData.price) || 0);
    formDataToSend.append("stock", parseInt(formData.stock, 10) || 0);
    formDataToSend.append("description", formData.description);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const { data } = await axiosInstance.post("/products/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data) {
        onAdd(data);
        toast.success("Product added successfully!");
        setFormData({ name: "", category: "", price: "", stock: "", description: "", image: null }); // Reset form
        setImagePreview(null); // Clear preview
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Add product error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to add product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100] overflow-auto pt-4"> {/* Increased z-index and top alignment */}
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-md mx-4 my-4 md:mx-auto min-h-[80vh]">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-100 mb-4 text-center">Add Product</h2>
        <div className="overflow-y-auto"> {/* Scroll only if content overflows */}
          <form onSubmit={handleSubmit} id="add-product-form" className="space-y-4 p-2">
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 text-sm md:text-base">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 text-sm md:text-base">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
            
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) ? categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                )) : <option disabled>No categories available</option>}
              </select>
              <div className="mt-2 flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-500 text-sm md:text-base w-full md:w-auto"
                  disabled={isLoading}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 text-sm md:text-base">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 text-sm md:text-base">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
                required
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 text-sm md:text-base">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base h-20 resize-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 text-sm md:text-base">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Product Preview" className="max-w-full h-auto rounded-lg" />
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="flex justify-end gap-4 sticky bottom-4 bg-gray-800 p-2 rounded-b-lg">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-500 text-sm md:text-base w-full md:w-auto"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-product-form"
            className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-500 text-sm md:text-base w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;