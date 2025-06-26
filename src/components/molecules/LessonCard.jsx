import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const LessonCard = ({ lesson, isPurchased = false, progress = null }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/lessons/${lesson.Id}`);
  };

  const handlePurchaseClick = (e) => {
    e.stopPropagation();
    // Purchase logic will be handled in the lesson detail page
    navigate(`/lessons/${lesson.Id}`);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-surface rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={lesson.thumbnail}
          alt={lesson.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop';
          }}
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/90 rounded-full p-3">
            <ApperIcon name="Play" size={24} className="text-primary ml-1" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="default" size="small">
            {formatDuration(lesson.duration)}
          </Badge>
        </div>
        
        {/* Featured badge */}
        {lesson.featured && (
          <div className="absolute top-3 left-3">
            <Badge variant="accent" size="small">
              <ApperIcon name="Star" size={12} className="mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {lesson.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {lesson.instructor}
            </p>
          </div>
          <Badge variant="primary" size="small">
            {lesson.level}
          </Badge>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {lesson.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {lesson.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="default" size="small">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Progress or Purchase */}
        <div className="flex items-center justify-between">
          {isPurchased ? (
            <div className="flex items-center space-x-3 flex-1">
              {progress && (
                <>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{progress.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.completionPercentage}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                      />
                    </div>
                  </div>
                  {progress.completionPercentage === 100 && (
                    <ApperIcon name="CheckCircle" size={20} className="text-success" />
                  )}
                </>
              )}
              {!progress && (
                <Button variant="ghost" size="small" className="flex-1">
                  Start Learning
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="text-lg font-semibold text-primary">
                ${lesson.price}
              </div>
              <Button
                variant="primary"
                size="small"
                icon="ShoppingCart"
                onClick={handlePurchaseClick}
              >
                Purchase
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LessonCard;