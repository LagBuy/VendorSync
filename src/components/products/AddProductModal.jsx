import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Cookies from "js-cookie";

const AddProductModal = ({ onCancel, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    categories: "",
    price: "",
    stock_quantity: "",
    description: "",
    images: null,
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          toast.error("Please log in to access categories.");
          return;
        }
        const { data } = await axiosInstance.get("/products/categories/");
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          toast.error("No categories available. Please add a new category.");
        }
      } catch (error) {
        console.error("Fetch categories error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.detail || "Failed to load categories.");
      }
    };

    const checkVendorStatus = async () => {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          toast.error("Please log in to continue.");
          return;
        }

        const { data } = await axiosInstance.get("/auth/user/");
        if (!data.roles.includes("vendor")) {
          toast.error("You do not have vendor permissions. Please contact support.");
          return;
        }
      } catch (error) {
        console.error("Check vendor status error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error("Failed to verify vendor status. Please contact support.");
      }
    };

    fetchCategories();
    checkVendorStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, images: file });
      setImagePreview(URL.createObjectURL(file));

      // Upload image to get image_url
      try {
        setIsLoading(true);
        const token = Cookies.get("jwt-token");
        if (!token) {
          toast.error("You must be logged in to upload an image.");
          return;
        }

        const imageFormData = new FormData();
        imageFormData.append("image", file);
      
        const { data } = await axiosInstance.post("/products/upload-image/", imageFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setImageUrl(data.image_url || data.url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Image upload error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        toast.error(error.response?.data?.detail || "Failed to upload image. Please try again.");
        setFormData({ ...formData, images: null });
        setImagePreview(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      setIsLoading(true);
      const token = Cookies.get("jwt-token");
      if (!token) {
        toast.error("You must be logged in to add a category.");
        return;
      }
      const { data } = await axiosInstance.post("/products/categories/", { name: newCategory });
      setCategories([...categories, data]);
      setFormData({ ...formData, categories: data.id }); // Auto-select new category
      setNewCategory("");
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Add category error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.detail || "Failed to add category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form inputs
    if (!formData.name.trim()) {
      toast.error("Product name is required.");
      setIsLoading(false);
      return;
    }
    if (!formData.categories) {
      toast.error("Please select or add a category.");
      setIsLoading(false);
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Price must be greater than 0.");
      setIsLoading(false);
      return;
    }
    if (!formData.stock_quantity || parseInt(formData.stock_quantity, 10) < 0) {
      toast.error("Stock quantity cannot be negative.");
      setIsLoading(false);
      return;
    }
    if (formData.images && !imageUrl) {
      toast.error("Please upload a valid image.");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);

    formDataToSend.append("categories", formData.categories);

    formDataToSend.append("price", parseFloat(formData.price) || 0);

    formDataToSend.append("stock_quantity", parseInt(formData.stock_quantity, 10) || 0);
    
    formDataToSend.append("description", formData.description);

    formDataToSend.append("verified", "false");
    if (imageUrl) {
      formDataToSend.append("images", imageUrl);
    }

    try {
      const token = Cookies.get("jwt-token");
      if (!token) {
        toast.error("You must be logged in to add a product.");
        setIsLoading(false);
        return;
      }
      const { data } = await axiosInstance.post("/products/", formDataToSend);
      if (data) {
        onAdd(data); // Pass new product to parent to update total products
        setFormData({ name: "", categories: "", price: "", stock_quantity: "", description: "", images: null });
        setImagePreview(null);
        setImageUrl(null);
        toast.success("Product added successfully!");
        onCancel(); // Close modal after successful submission
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Add product error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(
        error.response?.data?.detail ||
          Object.values(error.response?.data || {}).join(" ") ||
          "Failed to add product. Please check your input and permissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100] overflow-auto pt-4">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-md mx-4 my-4 md:mx-auto min-h-[80vh]">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-100 mb-4 text-center">Add Product</h2>
        <div className="overflow-y-auto">
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
                name="categories"
                value={formData.categories}
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
              <label className="block text-gray-300 mb-1 text-sm md:text-base">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
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