const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800',
    secondary: 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800',
    success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
    danger: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
    info: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;