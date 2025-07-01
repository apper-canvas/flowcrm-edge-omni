import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </button>
          <h1 className="ml-2 text-2xl font-bold text-gray-900 lg:ml-0">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchBar 
            onSearch={(query) => console.log('Global search:', query)}
            placeholder="Search everything..."
            className="hidden md:block w-80"
          />
          
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
            <ApperIcon name="Bell" className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full"></span>
          </button>
          
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <ApperIcon name="Settings" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;