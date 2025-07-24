import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ColourfulText from "~/components/ui/colourful-text";

const FilterBar = ({
  onFilterChange,
  tags = [],
  selectedTags = [],
  onTagToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownContentRef = useRef(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onFilterChange) {
      onFilterChange({ searchTerm: value });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (onFilterChange) {
      onFilterChange({ searchTerm: "" });
    }
  };

  // Tính toán chiều cao của dropdown content khi component mount hoặc tags thay đổi
  useEffect(() => {
    if (dropdownContentRef.current) {
      setDropdownHeight(dropdownContentRef.current.scrollHeight);
    }
  }, [tags]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col gap-3 items-center justify-center mb-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          <ColourfulText text="Blog" />
        </h2>
      </div>

      <div className="flex gap-4 items-center justify-end w-full">
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative w-56">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 focus:outline-none"
          >
            <Filter className="h-4 w-4 mr-2" />
            Tags
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown với hiệu ứng cuộn mượt */}
          <div
            className={`absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-500 ease-in-out origin-top ${
              isDropdownOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
            style={{
              minWidth: "12rem",
              height: isDropdownOpen ? `${dropdownHeight}px` : "0px",
            }}
          >
            <div ref={dropdownContentRef} className="p-4">
              <div className="space-y-2">
                {tags.map((tag, index) => (
                  <label
                    key={tag._id}
                    className={`flex items-center hover:text-purple-600 cursor-pointer text-gray-900 transition-all duration-300 ${
                      isDropdownOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                    }`}
                    style={{
                      transitionDelay: isDropdownOpen
                        ? `${index * 50}ms`
                        : "0ms",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag._id)}
                      onChange={() => onTagToggle(tag._id)}
                      className="mr-2 transform transition-transform duration-200 hover:scale-110"
                    />
                    <span className="transition-colors duration-200">
                      {tag.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {searchTerm && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Đang tìm kiếm:
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full transform transition-all duration-300 hover:scale-105">
              "{searchTerm}"
              <button
                onClick={clearSearch}
                className="ml-2 text-green-500 hover:text-green-700 transition-colors duration-200 hover:rotate-90 transform"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FilterBar;
