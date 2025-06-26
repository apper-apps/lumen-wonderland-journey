import { useState, forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  icon,
  error,
  helper,
  className = '',
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const hasValue = props.value && props.value.length > 0;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={20} className="text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          placeholder={focused || !label ? placeholder : ''}
          className={`
            w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
            focus:outline-none focus:ring-0 focus:border-primary
            ${icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${error ? 'border-error' : 'border-gray-200 hover:border-gray-300'}
            ${focused ? 'border-primary' : ''}
            placeholder-gray-400 text-gray-900
          `}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        
        {label && (
          <label className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${icon ? 'left-11' : 'left-4'}
            ${focused || hasValue 
              ? '-top-2 text-xs bg-white px-1 text-primary font-medium' 
              : 'top-1/2 transform -translate-y-1/2 text-gray-500'
            }
          `}>
            {label}
          </label>
        )}
        
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;