import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

// General Empty State Component
export const EmptyState = ({ 
  icon = "Package", 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = ""
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`text-center py-12 ${className}`}
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="mb-6"
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
    </motion.div>
    
    <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
      {title}
    </h3>
    
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
      {description}
    </p>
    
    {actionLabel && onAction && (
      <Button
        variant="primary"
        onClick={onAction}
        className="inline-flex"
      >
        {actionLabel}
      </Button>
    )}
  </motion.div>
);

// No Lessons Empty State
export const NoLessonsEmpty = ({ onBrowseLessons }) => (
  <EmptyState
    icon="BookOpen"
    title="No lessons yet"
    description="Start your transformation journey by exploring our carefully curated lessons from the Squirrel Wrangler."
    actionLabel="Browse Lessons"
    onAction={onBrowseLessons}
  />
);

// No Progress Empty State
export const NoProgressEmpty = ({ onStartLearning }) => (
  <EmptyState
    icon="TrendingUp"
    title="Your journey awaits"
    description="Begin tracking your progress by starting your first lesson. Every step forward is a victory worth celebrating."
    actionLabel="Start Learning"
    onAction={onStartLearning}
  />
);

// No Search Results
export const NoSearchResults = ({ searchQuery, onClearSearch }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
      <ApperIcon name="Search" size={40} className="text-gray-400" />
    </div>
    
    <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
      No lessons found
    </h3>
    
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
      We couldn't find any lessons matching "{searchQuery}". Try different keywords or browse all lessons.
    </p>
    
    <div className="space-x-3">
      <Button
        variant="outline"
        onClick={onClearSearch}
      >
        Clear Search
      </Button>
      <Button
        variant="primary"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Browse All
      </Button>
    </div>
  </motion.div>
);

// No Coaching Sessions
export const NoCoachingEmpty = ({ onExploreSchedule }) => (
  <EmptyState
    icon="MessageCircle"
    title="No upcoming sessions"
    description="Connect with the Squirrel Wrangler and fellow journeyers through Marco Polo coaching sessions."
    actionLabel="Explore Schedule"
    onAction={onExploreSchedule}
  />
);

// Squirrel-themed Empty State for Wonderland
export const WonderlandEmpty = ({ 
  title = "Welcome to Wonderland", 
  description,
  actionLabel,
  onAction 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12"
  >
    <motion.div
      animate={{ 
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1]
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
    
    <h3 className="text-2xl font-display font-semibold text-primary mb-3">
      {title}
    </h3>
    
    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
      {description}
    </p>
    
    {actionLabel && onAction && (
      <Button
        variant="primary"
        onClick={onAction}
        className="inline-flex mystical-gradient"
      >
        {actionLabel}
      </Button>
    )}
  </motion.div>
);

// Error Boundary Empty State
export const ErrorEmpty = ({ onRetry, message = "Something went wrong" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
      <ApperIcon name="AlertCircle" size={40} className="text-error" />
    </div>
    
    <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
      Oops! {message}
    </h3>
    
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
      Even the wisest squirrels encounter obstacles. Let's try again on your journey.
    </p>
    
    <Button
      variant="primary"
      icon="RefreshCw"
      onClick={onRetry}
    >
      Try Again
    </Button>
  </motion.div>
);