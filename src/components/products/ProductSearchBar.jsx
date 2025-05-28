import { Search } from "lucide-react";
import { MdAddShoppingCart } from "react-icons/md";

const ProductSearchBar = ({ searchTerm, onSearch, onAddClick }) => (
  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
    <h2 className="text-xl font-semibold text-gray-100">Products</h2>
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-700 text-white placeholder-gray-400 rounded-xl pl-10 pr-2 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={onSearch}
          value={searchTerm}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>
      <button
        onClick={onAddClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 self-end sm:self-auto"
      >
        <MdAddShoppingCart />
      </button>
    </div>
  </div>
);

export default ProductSearchBar;
