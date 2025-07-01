import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ type = 'input', ...props }) => {
  if (type === 'select') {
    return <Select {...props} />;
  }
  
  if (type === 'textarea') {
    const { label, error, className = '', ...textareaProps } = props;
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          className={`
            w-full px-4 py-2 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
            transition-colors duration-200 resize-vertical
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...textareaProps}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
  
  return <Input {...props} />;
};

export default FormField;