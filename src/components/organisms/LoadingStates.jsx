import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

// Skeleton Loader for Cards
export const SkeletonCard = () => (
  <div className="bg-surface rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200 shimmer" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
      <div className="h-3 bg-gray-200 rounded w-1/2 shimmer" />
      <div className="h-3 bg-gray-200 rounded w-full shimmer" />
      <div className="h-3 bg-gray-200 rounded w-2/3 shimmer" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 bg-gray-200 rounded w-16 shimmer" />
        <div className="h-8 bg-gray-200 rounded w-20 shimmer" />
      </div>
    </div>
  </div>
);

// Skeleton Grid
export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <SkeletonCard />
      </motion.div>
    ))}
  </div>
);

// Loading Spinner with Squirrel Animation
export const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 mb-4"
    >
      <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full" />
    </motion.div>
    <p className="text-gray-600 text-sm">{message}</p>
  </div>
);

// Squirrel Bounce Loading
export const SquirrelLoading = ({ message = "Gathering wisdom..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <motion.div
      className="text-6xl mb-4 squirrel-bounce"
    >
      🐿️
    </motion.div>
    <p className="text-gray-600 text-sm font-medium">{message}</p>
  </div>
);

// Progress Loading with Steps
export const ProgressLoading = ({ steps, currentStep = 0 }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${index <= currentStep 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-500'
            }
          `}>
            {index < currentStep ? (
              <ApperIcon name="Check" size={16} />
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`
              w-8 h-0.5 mx-2
              ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}
            `} />
          )}
        </div>
      ))}
    </div>
    <p className="text-gray-600 text-sm">
      {steps[currentStep] || 'Processing...'}
    </p>
  </div>
);

// Page Loading Overlay
export const PageLoading = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-8">
      <SquirrelLoading message="Loading your journey..." />
    </div>
  </div>
);