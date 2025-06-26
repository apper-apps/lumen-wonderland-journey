import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80 focus:ring-primary/50 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-md hover:shadow-lg',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/50 shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/50',
    surface: 'bg-surface text-gray-800 hover:bg-gray-200 focus:ring-gray-300 shadow-sm'
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    small: 16,
    medium: 18,
    large: 20
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSizes[size]} 
          className="animate-spin mr-2" 
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'mr-2' : ''} 
        />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'ml-2' : ''} 
        />
      )}
    </motion.button>
  );
};

export default Button;