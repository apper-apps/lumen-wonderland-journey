import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Squirrel */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4, 
              ease: "easeInOut" 
            }}
            className="text-8xl mb-6"
          >
            🐿️
          </motion.div>

          <h1 className="text-6xl font-display font-bold text-primary mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
            Lost in Wonderland?
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Even the wisest squirrels sometimes lose their way through the garden labyrinth. 
            This page seems to have wandered off the path of transformation.
          </p>

          <div className="space-y-4">
            <Button
              variant="primary"
              size="large"
              icon="Home"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto"
            >
              Return to Wonderland
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/lessons')}
                icon="BookOpen"
              >
                Browse Lessons
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/coaching')}
                icon="MessageCircle"
              >
                Join Coaching
              </Button>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 p-4 bg-surface rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Info" size={16} />
              <span>
                Need help finding your way? The Squirrel Wrangler's teachings await at home.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;