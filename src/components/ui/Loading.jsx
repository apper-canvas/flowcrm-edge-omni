import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="animate-pulse"
          >
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Chart Area */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
            <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full"
      />
      <p className="text-gray-500 font-medium">Loading...</p>
    </div>
  );
};

export default Loading;