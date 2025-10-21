import { useState, useEffect, useRef } from "react";
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const fallbackCategories = [
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
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          setCategories(fallbackCategories);
          return;
        }

        const { data } = await axiosInstance.get("/products/categories/");
        if (Array.isArray(data.data) && data.data.length > 0) {
          setCategories(
            data.data.map((cat) => ({ ...cat, isFallback: false }))
          );
        } else {
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.error("Fetch categories error:", error);
        setCategories(fallbackCategories);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const uploadImageToServer = async (file) => {
    try {
      const token = Cookies.get("jwt-token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const imageFormData = new FormData();
      imageFormData.append("image", file);

      const { data, status } = await axiosInstance.post(
        "/products/upload-image/",
        imageFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (status === 201) {
        return data.image_url || data.url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormData({ ...formData, images: null });
      setImagePreview(null);
      setUploadedImageUrl(null);
      return;
    }

    // Create temporary preview
    const tempPreview = URL.createObjectURL(file);
    setImagePreview(tempPreview);
    setFormData({ ...formData, images: file });
    setIsUploadingImage(true);

    try {
      // Upload image immediately
      const imageUrl = await uploadImageToServer(file);
      setUploadedImageUrl(imageUrl);

      // Update form data with the uploaded image URL
      setFormData((prev) => ({ ...prev, images: imageUrl }));

      // Replace temporary preview with actual uploaded image
      setImagePreview(imageUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      // Reset on error
      setFormData({ ...formData, images: null });
      setImagePreview(null);
      setUploadedImageUrl(null);

      // Optional: Show error message to user
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const lowerCaseNewCategory = newCategory.trim().toLowerCase();
    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === lowerCaseNewCategory
    );

    if (existingCategory) {
      setFormData({ ...formData, categories: existingCategory.name });
      setNewCategory("");
      return;
    }

    try {
      setIsLoading(true);
      const token = Cookies.get("jwt-token");
      if (!token) return;

      const { data } = await axiosInstance.post("/products/categories/", {
        name: newCategory.trim(),
      });
      setCategories([...categories, { ...data, isFallback: false }]);
      setFormData({ ...formData, categories: data.name });
      setNewCategory("");
    } catch (error) {
      console.error("Add category error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.name.trim() ||
      !formData.categories ||
      !formData.price ||
      !formData.stock_quantity
    ) {
      setIsLoading(false);
      onCancel();
      return;
    }

    let finalCategoryName = formData.categories;
    const selectedCategory = categories.find(
      (cat) => cat.name === formData.categories
    );

    if (selectedCategory?.isFallback) {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          setIsLoading(false);
          onCancel();
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
        setIsLoading(false);
        onCancel();
        return;
      }
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
      verified: "false",
      categories: [finalCategoryName],
    };

    // Use the already uploaded image URL
    if (uploadedImageUrl) {
      productData.images = [uploadedImageUrl];
    } else {
      productData.images = [];
    }

    try {
      const token = Cookies.get("jwt-token");
      if (!token) {
        setIsLoading(false);
        onCancel();
        return;
      }

      const { data } = await axiosInstance.post("/products/", productData);
      if (data) {
        // Ensure the response data has all required fields
        const completeProduct = {
          ...data,
          images: data.images || [uploadedImageUrl].filter(Boolean),
          stock_quantity:
            data.stock_quantity || parseInt(formData.stock_quantity, 10),
          categories: data.categories || [finalCategoryName],
        };

        onAdd(completeProduct);
        setFormData({
          name: "",
          categories: "",
          price: "",
          stock_quantity: "",
          description: "",
          images: null,
        });
        setImagePreview(null);
        setUploadedImageUrl(null);
      }
    } catch (error) {
      console.error("Add product error:", error);
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
            ADD NEW PRODUCT
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
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 placeholder-gray-500 group-hover:border-green-300"
                placeholder="Enter product name..."
                required
              />
            </div>

            <div className="group">
              <label className="block text-green-300 mb-2 text-sm font-semibold tracking-wide">
                Category
              </label>
              <select
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 appearance-none cursor-pointer group-hover:border-green-300"
                required
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
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 border-2 border-yellow-400"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Create"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-green-300 mb-2 text-sm font-semibold tracking-wide">
                  Price (₦)
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
                />
              </div>
              <div className="group">
                <label className="block text-green-300 mb-2 text-sm font-semibold tracking-wide">
                  Stock Qty
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
                  ref={fileInputRef}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border-2 border-gray-700 focus:border-green-400 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-400 cursor-pointer group-hover:border-green-300"
                  disabled={isUploadingImage}
                />
                {isUploadingImage && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {imagePreview && (
                <div className="mt-3 transform hover:scale-105 transition-transform duration-300 relative">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-full h-32 object-cover rounded-xl border-2 border-green-400 shadow-lg"
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                      <div className="text-white text-sm font-semibold flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </div>
                    </div>
                  )}
                  {!isUploadingImage && uploadedImageUrl && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Uploaded ✓
                    </div>
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
              "ADD PRODUCT"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
