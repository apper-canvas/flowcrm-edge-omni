import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;