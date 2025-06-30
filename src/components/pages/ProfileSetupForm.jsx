import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import userService from '@/services/api/userService';

const ProfileSetupForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    avatar: '',
    total_lessons_completed: 0,
    current_streak: 0,
    total_watch_time: 0,
    first_lesson: false,
    week_streak: false,
    early_bird: true,
    Tags: '',
    joined_date: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.avatar && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.avatar)) {
      newErrors.avatar = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Format data for API
      const profileData = {
        ...formData,
        total_lessons_completed: parseInt(formData.total_lessons_completed) || 0,
        current_streak: parseInt(formData.current_streak) || 0,
        total_watch_time: parseInt(formData.total_watch_time) || 0,
        joined_date: new Date().toISOString(),
        last_active: new Date().toISOString()
      };

      const newUser = await userService.create(profileData);
      
      if (newUser) {
        toast.success('Profile created successfully! Welcome to Wonderland Journey!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Profile creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="User" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Help us personalize your Wonderland Journey experience
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="User" size={20} className="mr-2 text-primary" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  value={formData.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                  error={errors.Name}
                  icon="User"
                  placeholder="Enter your full name"
                />
                
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  icon="Mail"
                  placeholder="your.email@example.com"
                />
              </div>

              <Input
                label="Avatar Image URL"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                error={errors.avatar}
                icon="Image"
                placeholder="https://example.com/your-avatar.jpg"
                helperText="Optional: Add a profile picture URL"
              />
            </div>

            {/* Learning Background */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="BookOpen" size={20} className="mr-2 text-primary" />
                Learning Background
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Lessons Completed"
                  type="number"
                  value={formData.total_lessons_completed}
                  onChange={(e) => handleInputChange('total_lessons_completed', e.target.value)}
                  icon="CheckCircle"
                  placeholder="0"
                  min="0"
                  helperText="Previous learning experience"
                />
                
                <Input
                  label="Current Streak (days)"
                  type="number"
                  value={formData.current_streak}
                  onChange={(e) => handleInputChange('current_streak', e.target.value)}
                  icon="Calendar"
                  placeholder="0"
                  min="0"
                  helperText="Consecutive learning days"
                />
                
                <Input
                  label="Watch Time (minutes)"
                  type="number"
                  value={formData.total_watch_time}
                  onChange={(e) => handleInputChange('total_watch_time', e.target.value)}
                  icon="Clock"
                  placeholder="0"
                  min="0"
                  helperText="Total time spent learning"
                />
              </div>
            </div>

            {/* Preferences & Achievements */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Settings" size={20} className="mr-2 text-primary" />
                Preferences & Achievements
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">First Lesson Achievement</h3>
                    <p className="text-sm text-gray-600">Mark if you've completed your first lesson</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.first_lesson}
                      onChange={(e) => handleInputChange('first_lesson', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Week Streak Achievement</h3>
                    <p className="text-sm text-gray-600">Mark if you've maintained a 7-day streak</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.week_streak}
                      onChange={(e) => handleInputChange('week_streak', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Early Bird</h3>
                    <p className="text-sm text-gray-600">You're among the early adopters of Wonderland Journey!</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.early_bird}
                      onChange={(e) => handleInputChange('early_bird', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Tags/Interests */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Tag" size={20} className="mr-2 text-primary" />
                Interests & Tags
              </h2>
              
              <Input
                label="Tags & Interests"
                value={formData.Tags}
                onChange={(e) => handleInputChange('Tags', e.target.value)}
                icon="Tag"
                placeholder="mindfulness, growth, spirituality, transformation"
                helperText="Comma-separated tags that describe your interests"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon="Check"
                className="flex-1"
                disabled={loading}
              >
                Complete Profile Setup
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                icon="Home"
                className="flex-1"
                disabled={loading}
              >
                Skip for Now
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-500">
            You can always update your profile information later from your profile page
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetupForm;