import { motion } from "framer-motion";

const ProductRow = ({ product, onEdit, onDelete }) => {
  const getStatus = (stock) => {
    if (stock === 0)
      return {
        text: "Out of Stock",
        color: "text-red-400 bg-red-500/20 border-red-400",
      };
    if (stock < 10)
      return {
        text: "Low Stock",
        color: "text-yellow-400 bg-yellow-500/20 border-yellow-400",
      };
    return {
      text: "In Stock",
      color: "text-green-400 bg-green-500/20 border-green-400",
    };
  };

  const status = getStatus(product.stock_quantity);

  // Function to get the first available image
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  const productImage = getProductImage();

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            {productImage ? (
              <img
                src={productImage}
                alt={product.name}
                className="h-12 w-12 rounded-lg object-cover border-2 border-gray-600"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
            {/* Fallback that shows if image fails to load */}
            <div
              className="h-12 w-12 rounded-lg bg-gray-700 hidden items-center justify-center border-2 border-gray-600"
              style={{ display: "none" }}
            >
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-white">
              {product.name}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-700 text-gray-300 border border-gray-600">
          {product.categories?.[0] || "Uncategorized"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-yellow-400">
          ₦{Number(product.price).toLocaleString()}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-white">
          {product.stock_quantity}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${status.color}`}
        >
          {status.text}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <motion.button
            onClick={() => onEdit(product)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transform transition-all duration-300 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </motion.button>
          <motion.button
            onClick={() => onDelete(product.id)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-400 hover:to-red-500 transform transition-all duration-300 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </div>
      </td>
    </>
  );
};

export default ProductRow;
