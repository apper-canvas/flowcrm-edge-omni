import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Deals', href: '/deals', icon: 'TrendingUp' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Activities', href: '/activities', icon: 'Activity' }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="fixed top-0 left-0 z-40 w-64 h-full bg-white border-r border-gray-200 shadow-premium lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold gradient-text">FlowCRM</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Sales Team</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;