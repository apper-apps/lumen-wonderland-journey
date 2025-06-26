import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search lessons...", 
  onSearch, 
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <ApperIcon 
            name="Search" 
            size={20} 
            className={`transition-colors duration-200 ${
              focused ? 'text-primary' : 'text-gray-400'
            }`} 
          />
        </div>
        
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full pl-11 pr-11 py-3 border-2 rounded-xl transition-all duration-200
            focus:outline-none focus:ring-0 focus:border-primary
            ${focused ? 'border-primary bg-white' : 'border-gray-200 bg-surface hover:border-gray-300'}
            placeholder-gray-400 text-gray-900
          `}
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;