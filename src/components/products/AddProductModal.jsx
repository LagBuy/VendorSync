import { useState, useEffect, useCallback, useMemo } from "react";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const AddProductModal = ({ onCancel, onAdd }) => {
  // State management
  const [formData, setFormData] = useState({
    name: "",
    categories: "",
    price: "",
    stock_quantity: "",
    description: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const UPLOAD_TIMEOUT = 10000; // 10 seconds
  const MAX_RETRIES = 2;

  // Memoized fallback categories to prevent unnecessary re-renders
  const fallbackCategories = useMemo(
    () => [
      { id: uuidv4(), name: "Electronics", isFallback: true },
      { id: uuidv4(), name: "Clothing", isFallback: true },
      { id: uuidv4(), name: "Books", isFallback: true },
      { id: uuidv4(), name: "Home & Garden", isFallback: true },
      { id: uuidv4(), name: "Toys", isFallback: true },
      { id: uuidv4(), name: "Sports", isFallback: true },
      { id: uuidv4(), name: "Beauty", isFallback: true },
      { id: uuidv4(), name: "Jewelry", isFallback: true },
      { id: uuidv4(), name: "Furniture", isFallback: true },
      { id: uuidv4(), name: "Food & Beverages", isFallback: true },
    ],
    []
  );

  // Memoized category fetch function
  const fetchCategories = useCallback(async () => {
    try {
      const token = Cookies.get("jwt-token");

      if (!token) {
        setCategories(fallbackCategories);
        return;
      }

      const { data } = await axiosInstance.get("/products/categories/");

      if (Array.isArray(data.data) && data.data.length > 0) {
        setCategories(data.data.map((cat) => ({ ...cat, isFallback: false })));
      } else {
        setCategories(fallbackCategories);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      setCategories(fallbackCategories);
    }
  }, [fallbackCategories]);

  // Effects
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Utility functions
  const validateImageFile = (file) => {
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (
      !file.type.startsWith("image/") ||
      !validImageTypes.includes(file.type)
    ) {
      throw new Error("Please upload a valid image file (JPEG, JPG or PNG).");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Image size must be less than 5MB.");
    }

    return true;
  };

  const uploadImageToServer = async (file, retryCount = 0) => {
    try {
      const token = Cookies.get("jwt-token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      // Validate file
      validateImageFile(file);

      const imageFormData = new FormData();
      imageFormData.append("image", file);

      console.log("Uploading image, attempt:", retryCount + 1);

      const { data, status } = await axiosInstance.post(
        "/products/upload-image/",
        imageFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: UPLOAD_TIMEOUT,
        }
      );

      if (status === 201) {
        const imageUrl = data.image_url || data.url;
        if (!imageUrl) {
          throw new Error("No image URL returned from server.");
        }
        return imageUrl;
      } else {
        throw new Error(`Image upload failed: Status ${status}`);
      }
    } catch (error) {
      console.error("Image upload error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Retry logic for server errors
      if (error.response?.status === 500 && retryCount < MAX_RETRIES) {
        console.log(`Retrying upload... (${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return uploadImageToServer(file, retryCount + 1);
      }

      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormData((prev) => ({ ...prev, image: "" }));
      return;
    }

    setIsUploadingImage(true);

    try {
      // Quick validation before upload
      validateImageFile(file);

      const imageUrl = await uploadImageToServer(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));

      toast.success("Image uploaded successfully!", {
        className: "custom-toast-success",
      });
    } catch (error) {
      setFormData((prev) => ({ ...prev, image: "" }));

      let errorMessage = "Failed to upload image.";
      if (error.response?.status === 500) {
        errorMessage = "Server error during upload. Please try again.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid image data.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        className: "custom-toast-error",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty.", {
        className: "custom-toast-error",
      });
      return;
    }

    const lowerCaseNewCategory = newCategory.trim().toLowerCase();
    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === lowerCaseNewCategory
    );

    if (existingCategory) {
      setFormData((prev) => ({ ...prev, categories: existingCategory.name }));
      setNewCategory("");
      toast.info("Category already exists.", {
        className: "custom-toast-info",
      });
      return;
    }

    try {
      setIsLoading(true);
      const token = Cookies.get("jwt-token");

      if (!token) {
        toast.error("Authentication required. Please log in.", {
          className: "custom-toast-error",
        });
        return;
      }

      const { data } = await axiosInstance.post("/products/categories/", {
        name: newCategory.trim(),
      });

      setCategories((prev) => [...prev, { ...data, isFallback: false }]);
      setFormData((prev) => ({ ...prev, categories: data.name }));
      setNewCategory("");

      toast.success("Category added successfully!", {
        className: "custom-toast-success",
      });
    } catch (error) {
      console.error("Add category error:", error);
      toast.error(error.response?.data?.message || "Failed to add category.", {
        className: "custom-toast-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a product name.", {
        className: "custom-toast-error",
      });
      return false;
    }

    if (!formData.categories) {
      toast.error("Please select or create a category.", {
        className: "custom-toast-error",
      });
      return false;
    }

    if (!formData.price) {
      toast.error("Please enter a price.", {
        className: "custom-toast-error",
      });
      return false;
    }

    if (!formData.stock_quantity) {
      toast.error("Please enter stock quantity.", {
        className: "custom-toast-error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    let finalCategoryName = formData.categories;
    const selectedCategory = categories.find(
      (cat) => cat.name === formData.categories
    );

    // Handle fallback categories
    if (selectedCategory?.isFallback) {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          toast.error("Authentication required. Please log in.", {
            className: "custom-toast-error",
          });
          setIsLoading(false);
          return;
        }

        const { data } = await axiosInstance.post("/products/categories/", {
          name: finalCategoryName,
        });

        finalCategoryName = data.name;
        setCategories((prev) =>
          prev.map((cat) =>
            cat.name === finalCategoryName
              ? { ...data, isFallback: false }
              : cat
          )
        );
      } catch (error) {
        console.error("Create fallback category error:", error);
        toast.error(
          error.response?.data?.message || "Failed to create category.",
          {
            className: "custom-toast-error",
          }
        );
        setIsLoading(false);
        return;
      }
    }

    // Validate numeric fields
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      toast.error("Please enter a valid price.", {
        className: "custom-toast-error",
      });
      setIsLoading(false);
      return;
    }

    const stockQuantityValue = parseInt(formData.stock_quantity, 10);
    if (isNaN(stockQuantityValue) || stockQuantityValue < 0) {
      toast.error("Please enter a valid stock quantity.", {
        className: "custom-toast-error",
      });
      setIsLoading(false);
      return;
    }

    // FIX: Create FormData instead of JSON for product creation
    const productFormData = new FormData();
    productFormData.append("name", formData.name.trim());
    productFormData.append("description", formData.description.trim());
    productFormData.append("price", priceValue.toString());
    productFormData.append("stock_quantity", stockQuantityValue.toString());
    productFormData.append("verified", "false");
    productFormData.append("categories", finalCategoryName);

    // FIX: Append the image URL in the format backend expects
    if (formData.image) {
      productFormData.append("images", formData.image);
    }

    try {
      const token = Cookies.get("jwt-token");
      if (!token) {
        toast.error("Authentication required. Please log in.", {
          className: "custom-toast-error",
        });
        setIsLoading(false);
        return;
      }

      // FIX: Send as multipart/form-data instead of JSON
      const { data } = await axiosInstance.post("/products/", productFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data) {
        const completeProduct = {
          ...data.data, // Note: Use data.data since your response has data property
          images:
            data.data.images && data.data.images.length > 0
              ? data.data.images
              : [formData.image].filter(Boolean),
          price: data.data.price || priceValue,
          stock_quantity: data.data.stock_quantity || stockQuantityValue,
          categories: data.data.categories || [finalCategoryName],
        };

        onAdd(completeProduct);

        // Reset form
        setFormData({
          name: "",
          categories: "",
          price: "",
          stock_quantity: "",
          description: "",
          image: "",
        });

        toast.success("Product added successfully!", {
          className: "custom-toast-success",
        });
      }
    } catch (error) {
      console.error("Add product error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = "We can't seem to add your product 🤔";
      if (error.response?.status === 500) {
        errorMessage =
          "Hmmm...seems we can't upload your product image for now. Try again later";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage, {
        className: "custom-toast-error",
      });
    } finally {
      setIsLoading(false);
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-start justify-center z-[100] overflow-auto pt-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-6 md:p-8 w-full max-w-md mx-4 my-4 md:mx-auto min-h-[80vh] border-2 border-green-400 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-yellow-400 animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500 rounded-full opacity-10 blur-xl"></div>

        <div className="relative z-10">
          <h2 className="text-sm md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 mb-2 text-center drop-shadow-lg">
            Add New Product
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-yellow-400 mx-auto mb-6 rounded-full"></div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] custom-scrollbar relative z-10">
          <form
            onSubmit={handleSubmit}
            id="add-product-form"
            className="space-y-6 p-1"
          >
            <div className="group">
              <label className="block text-green-300 mb-2 text-sm font-semibold tracking-wide">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 placeholder-gray-500 group-hover:border-green-300"
                placeholder="Enter product name..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="group">
              <label className="block text-green-300 mb-2 text-sm font-semibold tracking-wide">
                Category *
              </label>
              <select
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 appearance-none cursor-pointer group-hover:border-green-300"
                required
                disabled={isLoading}
              >
                <option value="" className="bg-gray-800">
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.name}
                    className="bg-gray-800 py-2"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="mt-3 flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Create new category..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300 placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 border-2 border-yellow-400"
                  disabled={isLoading || isUploadingImage}
                >
                  {isLoading ? "Adding..." : "Create"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-green-300 mb-2 text-sm font-semibold tracking-wide">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 group-hover:border-green-300"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
              <div className="group">
                <label className="block text-green-300 mb-2 text-sm font-semibold tracking-wide">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 group-hover:border-green-300"
                  required
                  min="0"
                  placeholder="0"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-green-300 mb-2 text-sm font-semibold tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 h-24 resize-none placeholder-gray-500 group-hover:border-green-300"
                placeholder="Describe your product..."
                disabled={isLoading}
              />
            </div>

            <div className="group">
              <label className="block text-green-300 mb-2 text-sm font-semibold tracking-wide">
                Product Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-400 cursor-pointer group-hover:border-green-300"
                  disabled={isLoading || isUploadingImage}
                />
                {isUploadingImage && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {formData.image && (
                <div className="mt-3 transform hover:scale-105 transition-transform duration-300 relative">
                  <img
                    src={formData.image}
                    alt="Product Preview"
                    className="w-full h-32 object-cover rounded-xl border-2 border-green-400 shadow-lg"
                    onError={() => {
                      console.error(
                        "Image preview failed to load:",
                        formData.image
                      );
                      toast.error("Failed to load image preview.", {
                        className: "custom-toast-error",
                      });
                      setFormData((prev) => ({ ...prev, image: "" }));
                    }}
                  />
                  {!isUploadingImage && (
                    <>
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Uploaded ✓
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition-colors"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="flex justify-between gap-4 sticky bottom-0 bg-transparent p-4 rounded-b-2xl mt-6 z-10">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300 border-2 border-gray-600 shadow-lg flex-1"
            disabled={isLoading || isUploadingImage}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-product-form"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-400 hover:to-green-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 border-2 border-green-400 flex-1"
            disabled={isLoading || isUploadingImage}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </span>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
