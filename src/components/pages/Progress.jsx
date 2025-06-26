import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ProgressRing from '@/components/molecules/ProgressRing';
import { SquirrelLoading } from '@/components/organisms/LoadingStates';
import { NoProgressEmpty } from '@/components/organisms/EmptyStates';

import userService from '@/services/api/userService';
import progressService from '@/services/api/progressService';
import lessonService from '@/services/api/lessonService';

const Progress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [lessonsMap, setLessonsMap] = useState({});
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    inProgressLessons: 0,
    totalWatchTime: 0,
    currentStreak: 0,
    achievements: []
  });

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      const [currentUser, allLessons] = await Promise.all([
        userService.getCurrentUser(),
        lessonService.getAll()
      ]);

      setUser(currentUser);

      // Create lessons map for easy lookup
      const lessonsById = {};
      allLessons.forEach(lesson => {
        lessonsById[lesson.Id.toString()] = lesson;
      });
      setLessonsMap(lessonsById);

      if (currentUser) {
        const userProgress = await progressService.getUserProgress(currentUser.Id);
        setProgressData(userProgress);

        // Calculate stats
        const completed = userProgress.filter(p => p.completionPercentage === 100).length;
        const inProgress = userProgress.filter(p => p.completionPercentage > 0 && p.completionPercentage < 100).length;
        
        setStats({
          totalLessons: currentUser.purchasedLessons?.length || 0,
          completedLessons: completed,
          inProgressLessons: inProgress,
          totalWatchTime: currentUser.progress?.totalWatchTime || 0,
          currentStreak: currentUser.progress?.currentStreak || 0,
          achievements: currentUser.achievements || []
        });
      }
    } catch (error) {
      toast.error('Failed to load progress data');
      console.error('Progress loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallProgress = () => {
    if (progressData.length === 0) return 0;
    const totalProgress = progressData.reduce((sum, p) => sum + p.completionPercentage, 0);
    return Math.round(totalProgress / progressData.length);
  };

  const formatWatchTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getAchievementIcon = (achievementId) => {
    const icons = {
      'first-lesson': 'Play',
      'week-streak': 'Calendar',
      'lesson-completed': 'CheckCircle',
      'early-bird': 'Sun'
    };
    return icons[achievementId] || 'Award';
  };

  const getAchievementTitle = (achievementId) => {
    const titles = {
      'first-lesson': 'First Lesson',
      'week-streak': 'Week Streak',
      'lesson-completed': 'Lesson Master',
      'early-bird': 'Early Bird'
    };
    return titles[achievementId] || 'Achievement';
  };

  const getProgressStatus = (percentage) => {
    if (percentage === 0) return { label: 'Not Started', variant: 'default' };
    if (percentage === 100) return { label: 'Completed', variant: 'success' };
    return { label: 'In Progress', variant: 'info' };
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <SquirrelLoading message="Tracking your transformation journey..." />
      </div>
    );
  }

  if (!user || stats.totalLessons === 0) {
    return (
      <div className="min-h-screen px-6 py-8">
        <NoProgressEmpty
          onStartLearning={() => navigate('/lessons')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Your Progress Journey
          </h1>
          <p className="text-gray-600">
            Track your transformation through the Big7 principles with the Squirrel Wrangler
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-2">
                Overall Progress
              </h2>
              <p className="text-gray-600 mb-4">
                Your journey through purchased lessons
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.totalLessons}</div>
                  <div className="text-sm text-gray-600">Total Lessons</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{stats.completedLessons}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-info">{stats.inProgressLessons}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{stats.currentStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <ProgressRing 
                progress={getOverallProgress()}
                size={180}
                color="#5B4E8C"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {getOverallProgress()}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Complete
                  </div>
                </div>
              </ProgressRing>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {stats.achievements.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🏆 Your Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 text-center"
                >
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ApperIcon 
                      name={getAchievementIcon(achievement)} 
                      size={24} 
                      className="text-accent" 
                    />
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {getAchievementTitle(achievement)}
                  </h4>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Lessons Progress */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Lesson Progress
            </h3>
            <Button
              variant="ghost"
              onClick={() => navigate('/lessons')}
              icon="Plus"
            >
              Add More Lessons
            </Button>
          </div>

          <div className="space-y-4">
            {progressData.map((progress, index) => {
              const lesson = lessonsMap[progress.lessonId];
              if (!lesson) return null;

              const status = getProgressStatus(progress.completionPercentage);

              return (
                <motion.div
                  key={progress.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      className="w-20 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=48&fit=crop';
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 truncate">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {lesson.category} • {lesson.duration} minutes
                          </p>
                        </div>
                        <Badge variant={status.variant} size="small">
                          {status.label}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{progress.completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.completionPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className={`h-2 rounded-full ${
                              progress.completionPercentage === 100
                                ? 'bg-gradient-to-r from-success to-success/80'
                                : 'bg-gradient-to-r from-primary to-accent'
                            }`}
                          />
                        </div>
                      </div>

                      {progress.lastAccessed && (
                        <p className="text-xs text-gray-400 mt-2">
                          Last accessed: {format(new Date(progress.lastAccessed), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {progress.bookmarks && progress.bookmarks.length > 0 && (
                        <div className="flex items-center text-xs text-gray-500">
                          <ApperIcon name="Bookmark" size={14} className="mr-1" />
                          {progress.bookmarks.length}
                        </div>
                      )}
                      
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => navigate(`/lessons/${lesson.Id}`)}
                        icon={progress.completionPercentage === 100 ? "RefreshCw" : "Play"}
                      >
                        {progress.completionPercentage === 100 ? "Review" : "Continue"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl p-6 mt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Target" size={32} className="text-accent" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Keep the Momentum Going!
          </h3>
          <p className="text-gray-600 mb-4">
            You've watched {formatWatchTime(stats.totalWatchTime)} this week. 
            Your {stats.currentStreak}-day streak shows your dedication to transformation.
          </p>
          <Button
            variant="accent"
            onClick={() => navigate('/lessons')}
          >
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Progress;