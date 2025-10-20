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
          toast.error("Please log in to access categories.");
          setCategories(fallbackCategories);
          return;
        }

        const { data } = await axiosInstance.get("/products/categories/");
        if (Array.isArray(data.data) && data.data.length > 0) {
          setCategories(
            data.data.map((cat) => ({ ...cat, isFallback: false }))
          );
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
        toast.error(
          error.response?.data?.detail ||
            "Failed to load categories. Using default categories."
        );
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
          toast.error(
            "You do not have vendor permissions. Please contact support."
          );
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
      setImageUrl(null);
    } else {
      setFormData({ ...formData, images: null });
      setImagePreview(null);
      setImageUrl(null);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    const lowerCaseNewCategory = newCategory.trim().toLowerCase();
    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === lowerCaseNewCategory
    );

    if (existingCategory) {
      setFormData({ ...formData, categories: existingCategory.name });
      setNewCategory("");
      toast.info(`Category "${existingCategory.name}" selected.`);
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
      setCategories([...categories, { ...data, isFallback: false }]);
      setFormData({ ...formData, categories: data.name });
      setNewCategory("");
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Add category error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response?.data?.name?.includes("already exists")) {
        try {
          const { data } = await axiosInstance.get("/products/categories/");
          if (Array.isArray(data.data)) {
            const matchedCategory = data.data.find(
              (cat) => cat.name.toLowerCase() === lowerCaseNewCategory
            );
            if (matchedCategory) {
              setCategories([
                ...categories.filter((c) => c.isFallback),
                { ...matchedCategory, isFallback: false },
              ]);
              setFormData({ ...formData, categories: matchedCategory.name });
              setNewCategory("");
              toast.info(
                `Category "${matchedCategory.name}" already exists and has been selected.`
              );
            } else {
              toast.error(
                "Failed to find existing category. Please try again."
              );
            }
          }
        } catch {
          toast.error("Failed to verify category. Please try again.");
        }
      } else {
        toast.error(
          error.response?.data?.detail ||
            "Failed to add category. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name.trim()) {
      toast.error("Product name is required.");
      setIsLoading(false);
      onCancel();
      return;
    }
    if (!formData.categories) {
      toast.error("Please select or add a category.");
      setIsLoading(false);
      onCancel();
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Price must be greater than 0.");
      setIsLoading(false);
      onCancel();
      return;
    }
    if (!formData.stock_quantity || parseInt(formData.stock_quantity, 10) < 0) {
      toast.error("Stock quantity cannot be negative.");
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
          toast.error("You must be logged in to add a category.");
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
        console.error("Create fallback category error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        if (error.response?.data?.name?.includes("already exists")) {
          const { data } = await axiosInstance.get("/products/categories/");
          if (Array.isArray(data.data)) {
            const matchedCategory = data.data.find(
              (cat) =>
                cat.name.toLowerCase() === finalCategoryName.toLowerCase()
            );
            if (matchedCategory) {
              finalCategoryName = matchedCategory.name;
              setCategories((prev) =>
                prev.map((cat) =>
                  cat.name === finalCategoryName
                    ? { ...matchedCategory, isFallback: false }
                    : cat
                )
              );
            } else {
              toast.error(
                "Failed to find existing category. Please try again."
              );
              setIsLoading(false);
              onCancel();
              return;
            }
          }
        } else {
          toast.error("Failed to create category. Please try again.");
          setIsLoading(false);
          onCancel();
          return;
        }
      }
    }

    let finalImageUrl = imageUrl;
    if (formData.images && !imageUrl) {
      try {
        const token = Cookies.get("jwt-token");
        if (!token) {
          toast.error("You must be logged in to upload an image.");
          setIsLoading(false);
          onCancel();
          return;
        }

        const imageFormData = new FormData();
        imageFormData.append("image", formData.images);
        const { data, status } = await axiosInstance.post(
          "/products/upload-image/",
          imageFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
        if (status !== 201) {
          console.warn("Image upload returned non-201 status:", status);
          toast.warn("Image upload failed, proceeding without image.");
        } else {
          finalImageUrl = data.image_url || data.url;
          if (!finalImageUrl) {
            console.warn("No image URL returned from server.");
            toast.warn("Image upload failed, proceeding without image.");
          } else {
            toast.success("Image uploaded successfully!");
          }
        }
      } catch (error) {
        console.error("Image upload error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          request: {
            url: "/products/upload-image/",
            headers: { "Content-Type": "multipart/form-data" },
            file: formData.images?.name,
          },
        });
        toast.warn("Failed to upload image, proceeding without image.");
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
    if (finalImageUrl) {
      productData.images = [finalImageUrl];
    }

    try {
      const token = Cookies.get("jwt-token");
      if (!token) {
        toast.error("You must be logged in to add a product.");
        setIsLoading(false);
        onCancel();
        return;
      }

      const { data } = await axiosInstance.post("/products/", productData);
      if (data) {
        onAdd(data);
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
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Add product error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        request: { productData },
      });
      toast.error(
        error.response?.data?.detail ||
          Object.values(error.response?.data || {}).join(" ") ||
          "Failed to add product. Please check your input and permissions."
      );
    } finally {
      setIsLoading(false);
      onCancel(); // Close modal after every attempt
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
                  <option key={cat.id} value={cat.name}>
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
