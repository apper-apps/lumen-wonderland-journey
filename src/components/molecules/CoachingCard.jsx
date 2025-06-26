import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const CoachingCard = ({ session }) => {
  const handleJoinSession = () => {
    window.open(session.marcoPoloLink, '_blank');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'individual':
        return 'User';
      case 'group':
        return 'Users';
      case 'workshop':
        return 'Presentation';
      default:
        return 'MessageCircle';
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'individual':
        return 'primary';
      case 'group':
        return 'secondary';
      case 'workshop':
        return 'accent';
      default:
        return 'default';
    }
  };

  const formatSchedule = (schedule) => {
    const date = new Date(schedule);
    return {
      date: format(date, 'MMM dd'),
      time: format(date, 'h:mm a'),
      full: format(date, 'EEEE, MMMM do \'at\' h:mm a')
    };
  };

  const scheduleInfo = formatSchedule(session.schedule);
  const isUpcoming = new Date(session.schedule) > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-surface rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Header Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={session.thumbnail}
          alt={session.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={getTypeBadgeVariant(session.type)} size="small">
            <ApperIcon name={getTypeIcon(session.type)} size={12} className="mr-1" />
            {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
          </Badge>
        </div>

        {/* Schedule Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-2 py-1">
          <div className="text-xs font-medium text-gray-800">
            {scheduleInfo.date}
          </div>
          <div className="text-xs text-gray-600">
            {scheduleInfo.time}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {session.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {session.description}
        </p>

        {/* Session Details */}
        <div className="space-y-2 mb-4">
          {session.type === 'group' || session.type === 'workshop' ? (
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Users" size={16} className="mr-2" />
              <span>
                {session.currentParticipants}/{session.maxParticipants} participants
              </span>
            </div>
          ) : (
            session.duration && (
              <div className="flex items-center text-sm text-gray-500">
                <ApperIcon name="Clock" size={16} className="mr-2" />
                <span>{session.duration} minutes</span>
              </div>
            )
          )}
          
          {session.price && (
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="DollarSign" size={16} className="mr-2" />
              <span>${session.price}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {scheduleInfo.full}
          </div>
          <Button
            variant={isUpcoming ? "primary" : "surface"}
            size="small"
            icon="ExternalLink"
            onClick={handleJoinSession}
            disabled={!isUpcoming}
          >
            {isUpcoming ? "Join Session" : "Past Session"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CoachingCard;