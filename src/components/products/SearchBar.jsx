import { FiSearch } from "react-icons/fi";

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative w-full max-w-xs">
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
    />
    <FiSearch className="absolute top-3 left-3 text-gray-400" />
  </div>
);

export default SearchBar;
