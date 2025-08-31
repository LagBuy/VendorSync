import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

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

  // Hardcoded fallback categories
  const fallbackCategories = [
    { id: uuidv4(), name: "Electronics" },
    { id: uuidv4(), name: "Clothing" },
    { id: uuidv4(), name: "Books" },
    { id: uuidv4(), name: "Home & Garden" },
    { id: uuidv4(), name: "Toys" },
    { id: uuidv4(), name: "Sports" },
    { id: uuidv4(), name: "Beauty" },
    { id: uuidv4(), name: "Jewelry" },
    { id: uuidv4(), name: "Furniture" },
    { id: uuidv4(), name: "Food & Beverages" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          toast.error("Please log in to access categories.");
          setCategories(fallbackCategories); // Use fallback categories
          return;
        }

        const { data } = await axiosInstance.get("/products/categories/");
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          toast.warn("No categories available. Using default categories.");
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.error("Fetch categories error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.detail || "Failed to load categories. Using default categories.");
        setCategories(fallbackCategories);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, images: file });
      setImagePreview(URL.createObjectURL(file));
      setImageUrl(null); // Reset imageUrl since upload happens on submit
    } else {
      setFormData({ ...formData, images: null });
      setImagePreview(null);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    // Check for duplicates (case-insensitive)
    const lowerCaseNewCategory = newCategory.trim().toLowerCase();
    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === lowerCaseNewCategory
      )
    ) {
      toast.error("Category already exists.");
      return;
    }

    try {
      setIsLoading(true);
      const token = Cookies.get("jwt-token");
      if (!token) {
        toast.error("You must be logged in to add a category.");
        return;
      }

      const { data } = await axiosInstance.post("/products/categories/", {
        name: newCategory.trim(),
      });
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
      toast.error(
        error.response?.data?.detail || "Failed to add category. Please try again."
      );
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
    if (
      !formData.stock_quantity ||
      parseInt(formData.stock_quantity, 10) < 0
    ) {
      toast.error("Stock quantity cannot be negative.");
      setIsLoading(false);
      return;
    }

    let finalCategoryId = formData.categories;

    // Handle hardcoded category: Send to backend to get a valid ID
    const selectedCategory = categories.find(
      (cat) => cat.id === formData.categories
    );
    if (selectedCategory && fallbackCategories.some((fc) => fc.id === selectedCategory.id)) {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          toast.error("You must be logged in to add a category.");
          setIsLoading(false);
          return;
        }
        const { data } = await axiosInstance.post("/products/categories/", {
          name: selectedCategory.name,
        });
        finalCategoryId = data.id;
        setCategories((prev) =>
          prev.map((cat) => (cat.id === selectedCategory.id ? data : cat))
        );
      } catch (error) {
        console.error("Add hardcoded category error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error("Failed to save category. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    // Upload image if present
    let finalImageUrl = imageUrl;
    if (formData.images && !imageUrl) {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          toast.error("You must be logged in to upload an image.");
          setIsLoading(false);
          return;
        }
        const imageFormData = new FormData();
        imageFormData.append("image", formData.images);
        const { data } = await axiosInstance.post(
          "/products/upload-image/",
          imageFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        finalImageUrl = data.image_url || data.url;
        if (!finalImageUrl) {
          toast.error("Image upload failed. Please try again.");
          setIsLoading(false);
          return;
        }
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Image upload error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.detail || "Failed to upload image. Please try again."
        );
        setIsLoading(false);
        return;
      }
    }

    // Prepare form data for product submission
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("categories", finalCategoryId);
    formDataToSend.append("price", parseFloat(formData.price) || 0);
    formDataToSend.append(
      "stock_quantity",
      parseInt(formData.stock_quantity, 10) || 0
    );
    formDataToSend.append("description", formData.description);
    formDataToSend.append("verified", "false");
    if (finalImageUrl) {
      formDataToSend.append("images", finalImageUrl);
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
        onAdd(data); // Pass new product to ProductsTable
        setFormData({
          name: "",
          categories: "",
          price: "",
          stock_quantity: "",
          description: "",
          images: null,
        });
        setImagePreview(null);
        setImageUrl(null);
        toast.success("Product added successfully!");
        onCancel();
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
        <h2 className="text-xl md:text-2xl font-semibold text-gray-100 mb-4 text-center">
          Add Product
        </h2>
        <div className="overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            id="add-product-form"
            className="space-y-4 p-2"
          >
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 text-sm md:text-base">
                Name
              </label>
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
              <label className="block text-gray-300 mb-1 text-sm md:text-base">
                Category
              </label>
              <select
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
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
              <label className="block text-gray-300 mb-1 text-sm md:text-base">
                Price
              </label>
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
              <label className="block text-gray-300 mb-1 text-sm md:text-base">
                Stock Quantity
              </label>
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
              <label className="block text-gray-300 mb-1 text-sm md:text-base">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base h-20 resize-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 text-sm md:text-base">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="max-w-full h-auto rounded-lg"
                  />
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