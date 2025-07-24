const ProductRow = ({ product, onEdit, onDelete }) => (
  <tr className="text-gray-300 hover:bg-gray-700 transition">
    <td className="px-4 py-3">
      <img src={product.images[0]} className="w-12 h-12 object-cover rounded" />
    </td>
    <td className="px-4 py-3">{product.name}</td>
    <td className="px-4 py-3">{product.category}</td>
    <td className="px-4 py-3">${Number(product.price).toLocaleString()}</td>
    <td className="px-4 py-3">{product.sales}</td>
    <td className="px-4 py-3">{product.stock}</td>
    <td className="px-4 py-3 space-x-2">
      <button
        onClick={() => onEdit(product)}
        className="text-blue-400 hover:underline"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(product.id)}
        className="text-red-400 hover:underline"
      >
        Delete
      </button>
    </td>
  </tr>
);

export default ProductRow;
