import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const BottomNavigation = () => {
  const navItems = [
    routes.home,
    routes.lessons,
    routes.gardenLabyrinth,
    routes.coaching,
    routes.profile
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center p-2 min-w-0 flex-1
              transition-all duration-200
              ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={24} 
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-gray-500'
                    }`}
                  />
                  
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </motion.div>
                
                <span className={`
                  text-xs mt-1 font-medium truncate max-w-full
                  ${isActive ? 'text-primary' : 'text-gray-500'}
                `}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;