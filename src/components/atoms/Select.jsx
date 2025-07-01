import ApperIcon from '@/components/ApperIcon';

const Select = ({ 
  label, 
  error, 
  options = [], 
  placeholder = "Select an option",
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-4 py-2 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
            transition-colors duration-200 appearance-none bg-white
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;