import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import { SquirrelLoading } from '@/components/organisms/LoadingStates';

import userService from '@/services/api/userService';
import lessonService from '@/services/api/lessonService';
import progressService from '@/services/api/progressService';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [purchasedLessons, setPurchasedLessons] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [currentUser, allLessons] = await Promise.all([
        userService.getCurrentUser(),
        lessonService.getAll()
      ]);

      setUser(currentUser);
      setEditForm({ name: currentUser.name, email: currentUser.email });

      if (currentUser?.purchasedLessons) {
        // Get purchased lessons details
        const purchased = allLessons.filter(lesson => 
          currentUser.purchasedLessons.includes(lesson.Id.toString())
        );
        setPurchasedLessons(purchased);

        // Get progress data
        const progress = await progressService.getUserProgress(currentUser.Id);
        setProgressData(progress);
      }
    } catch (error) {
      toast.error('Failed to load profile data');
      console.error('Profile loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updatedUser = await userService.updateUser(user.Id, editForm);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const getProgressForLesson = (lessonId) => {
    return progressData.find(p => p.lessonId === lessonId.toString());
  };

  const getAchievementDetails = (achievementId) => {
    const achievements = {
      'first-lesson': {
        title: 'First Lesson',
        description: 'Completed your first lesson',
        icon: 'Play',
        color: 'primary'
      },
      'week-streak': {
        title: 'Week Streak',
        description: 'Maintained a 7-day learning streak',
        icon: 'Calendar',
        color: 'accent'
      },
      'lesson-completed': {
        title: 'Lesson Master',
        description: 'Completed a lesson',
        icon: 'CheckCircle',
        color: 'success'
      },
      'early-bird': {
        title: 'Early Bird',
        description: 'Joined the Wonderland community early',
        icon: 'Sun',
        color: 'warning'
      }
    };
    return achievements[achievementId] || {
      title: 'Achievement',
      description: 'Special recognition',
      icon: 'Award',
      color: 'default'
    };
  };

  const getTotalSpent = () => {
    return purchasedLessons.reduce((total, lesson) => total + lesson.price, 0);
  };

  const getCompletionRate = () => {
    if (progressData.length === 0) return 0;
    const completed = progressData.filter(p => p.completionPercentage === 100).length;
    return Math.round((completed / progressData.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <SquirrelLoading message="Loading your profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen px-6 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Not Found
          </h2>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full rounded-full flex items-center justify-center ${user.avatar ? 'hidden' : 'flex'}`}>
                <ApperIcon name="User" size={40} className="text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-display font-bold mb-2">
                {user.name}
              </h1>
              <p className="text-white/80 mb-4">
                Member since {format(new Date(user.joinedDate), 'MMMM yyyy')}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{purchasedLessons.length}</div>
                  <div className="text-sm text-white/80">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{progressData.filter(p => p.completionPercentage === 100).length}</div>
                  <div className="text-sm text-white/80">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.progress?.currentStreak || 0}</div>
                  <div className="text-sm text-white/80">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{getCompletionRate()}%</div>
                  <div className="text-sm text-white/80">Complete</div>
                </div>
              </div>
            </div>
            
            <Button
              variant="surface"
              onClick={() => setIsEditing(!isEditing)}
              icon="Edit"
              className="flex-shrink-0"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    icon="User"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    icon="Mail"
                  />
                  <div className="flex space-x-3">
                    <Button
                      variant="primary"
                      onClick={handleSaveProfile}
                      loading={saving}
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ name: user.name, email: user.email });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Total Investment
                    </label>
                    <p className="text-gray-900 font-semibold">
                      ${getTotalSpent().toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Purchased Lessons */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Lessons
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/lessons')}
                  icon="Plus"
                >
                  Add More
                </Button>
              </div>

              {purchasedLessons.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="BookOpen" size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No lessons purchased yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start your transformation journey with the Squirrel Wrangler's teachings
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/lessons')}
                  >
                    Browse Lessons
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchasedLessons.map((lesson) => {
                    const progress = getProgressForLesson(lesson.Id);
                    const completionPercentage = progress?.completionPercentage || 0;
                    
                    return (
                      <motion.div
                        key={lesson.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-4 p-4 bg-surface rounded-lg hover:shadow-md transition-shadow duration-200"
                      >
                        <img
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          className="w-16 h-10 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=64&h=40&fit=crop';
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {lesson.category} • {lesson.duration} minutes
                          </p>
                          
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  completionPercentage === 100
                                    ? 'bg-success'
                                    : 'bg-gradient-to-r from-primary to-accent'
                                }`}
                                style={{ width: `${completionPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {completionPercentage === 100 && (
                            <ApperIcon name="CheckCircle" size={20} className="text-success" />
                          )}
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => navigate(`/lessons/${lesson.Id}`)}
                          >
                            {completionPercentage === 100 ? 'Review' : 'Continue'}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            {user.achievements && user.achievements.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🏆 Achievements
                </h3>
                <div className="space-y-3">
                  {user.achievements.map((achievement, index) => {
                    const details = getAchievementDetails(achievement);
                    return (
                      <motion.div
                        key={achievement}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className={`w-10 h-10 bg-${details.color}/10 rounded-full flex items-center justify-center`}>
                          <ApperIcon 
                            name={details.icon} 
                            size={20} 
                            className={`text-${details.color}`} 
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {details.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {details.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/progress')}
                  icon="TrendingUp"
                  className="w-full justify-start"
                >
                  View Progress
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/coaching')}
                  icon="MessageCircle"
                  className="w-full justify-start"
                >
                  Join Coaching
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/lessons')}
                  icon="BookOpen"
                  className="w-full justify-start"
                >
                  Browse Lessons
                </Button>
              </div>
            </div>

            {/* Learning Stats */}
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Learning Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Watch Time</span>
                  <span className="font-semibold text-gray-900">
                    {Math.floor((user.progress?.totalWatchTime || 0) / 60)}h {(user.progress?.totalWatchTime || 0) % 60}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Streak</span>
                  <span className="font-semibold text-gray-900">
                    {user.progress?.currentStreak || 0} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-gray-900">
                    {getCompletionRate()}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;