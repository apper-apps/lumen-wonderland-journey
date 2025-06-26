import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LessonPlayer from '@/components/organisms/LessonPlayer';
import PurchaseModal from '@/components/organisms/PurchaseModal';
import { SquirrelLoading } from '@/components/organisms/LoadingStates';
import { ErrorEmpty } from '@/components/organisms/EmptyStates';

import lessonService from '@/services/api/lessonService';
import userService from '@/services/api/userService';
import progressService from '@/services/api/progressService';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [relatedLessons, setRelatedLessons] = useState([]);

  useEffect(() => {
    loadLessonData();
  }, [id]);

  const loadLessonData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [lessonData, currentUser] = await Promise.all([
        lessonService.getById(id),
        userService.getCurrentUser()
      ]);

      setLesson(lessonData);
      setUser(currentUser);

      if (currentUser) {
        const purchased = currentUser.purchasedLessons?.includes(lessonData.Id.toString());
        setIsPurchased(purchased);

        if (purchased) {
          const lessonProgress = await progressService.getLessonProgress(currentUser.Id, lessonData.Id);
          setProgress(lessonProgress);
        }

        // Load related lessons from same category
        try {
          const related = await lessonService.getByCategory(lessonData.category);
          setRelatedLessons(related.filter(l => l.Id !== lessonData.Id).slice(0, 3));
        } catch (relatedError) {
          console.warn('Failed to load related lessons:', relatedError);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load lesson');
      console.error('Lesson detail loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (lessonId) => {
    try {
      const updatedUser = await userService.purchaseLesson(user.Id, lessonId.toString());
      setUser(updatedUser);
      setIsPurchased(true);
      
      // Initialize progress for newly purchased lesson
      const initialProgress = await progressService.updateProgress(user.Id, lessonId, {
        completionPercentage: 0
      });
      setProgress(initialProgress);
      
      toast.success('Lesson purchased successfully!');
    } catch (error) {
      toast.error('Failed to complete purchase');
      console.error('Purchase error:', error);
    }
  };

  const handleProgressUpdate = async (progressData) => {
    if (!user || !lesson) return;

    try {
      const updatedProgress = await progressService.updateProgress(user.Id, lesson.Id, progressData);
      setProgress(updatedProgress);

      // Award achievement for first completion
      if (progressData.completionPercentage === 100 && (!progress || progress.completionPercentage < 100)) {
        await userService.addAchievement(user.Id, 'lesson-completed');
        toast.success('🎉 Lesson completed! Achievement unlocked!');
      }
    } catch (error) {
      console.error('Progress update error:', error);
    }
  };

  const handleAddBookmark = async (timestamp) => {
    if (!user || !lesson) return;

    try {
      await progressService.addBookmark(user.Id, lesson.Id, timestamp);
      toast.success('Bookmark added!');
      
      // Refresh progress to show new bookmark
      const updatedProgress = await progressService.getLessonProgress(user.Id, lesson.Id);
      setProgress(updatedProgress);
    } catch (error) {
      toast.error('Failed to add bookmark');
      console.error('Bookmark error:', error);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <SquirrelLoading message="Loading lesson content..." />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen px-6 py-8">
        <ErrorEmpty
          message={error || "Lesson not found"}
          onRetry={() => loadLessonData()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="px-6 pt-6 pb-4">
        <Button
          variant="ghost"
          icon="ArrowLeft"
          onClick={() => navigate('/lessons')}
        >
          Back to Lessons
        </Button>
      </div>

      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Lesson Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="primary" size="small">
                {lesson.category}
              </Badge>
              <Badge variant="secondary" size="small">
                {lesson.level}
              </Badge>
              <Badge variant="default" size="small">
                {formatDuration(lesson.duration)}
              </Badge>
              {lesson.featured && (
                <Badge variant="accent" size="small">
                  <ApperIcon name="Star" size={12} className="mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              {lesson.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              {lesson.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  By {lesson.instructor}
                </div>
                {progress && (
                  <div className="text-sm text-gray-500">
                    Progress: {progress.completionPercentage}%
                  </div>
                )}
              </div>

              {!isPurchased && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary mb-2">
                    ${lesson.price}
                  </div>
                  <Button
                    variant="primary"
                    size="large"
                    icon="ShoppingCart"
                    onClick={() => setShowPurchaseModal(true)}
                  >
                    Purchase Lesson
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Lesson Player */}
          {isPurchased ? (
            <div className="mb-8">
              <LessonPlayer
                lesson={lesson}
                progress={progress}
                onProgressUpdate={handleProgressUpdate}
                onAddBookmark={handleAddBookmark}
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 mb-8 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Lock" size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Purchase to Access Full Content
              </h3>
              <p className="text-gray-600 mb-6">
                Unlock this transformational lesson and begin your journey with the Squirrel Wrangler's teachings.
              </p>
              <Button
                variant="primary"
                size="large"
                onClick={() => setShowPurchaseModal(true)}
              >
                Purchase for ${lesson.price}
              </Button>
            </div>
          )}

          {/* Lesson Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <div className="bg-surface rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What You'll Learn
                </h3>
                <div className="space-y-3">
                  {lesson.content?.exercises?.map((exercise, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <ApperIcon name="CheckCircle" size={20} className="text-success mt-0.5" />
                      <span className="text-gray-700">{exercise}</span>
                    </div>
                  )) || (
                    <p className="text-gray-600">
                      This lesson covers the fundamental concepts of {lesson.category.toLowerCase()} 
                      and provides practical tools for your transformation journey.
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {lesson.tags && lesson.tags.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lesson.tags.map((tag, index) => (
                      <Badge key={index} variant="default" size="small">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Card */}
              {isPurchased && progress && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Completion</span>
                        <span>{progress.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.completionPercentage}%` }}
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                        />
                      </div>
                    </div>
                    
                    {progress.bookmarks && progress.bookmarks.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Bookmarks ({progress.bookmarks.length})
                        </p>
                        <div className="space-y-1">
                          {progress.bookmarks.slice(0, 3).map((bookmark, index) => (
                            <div key={index} className="text-xs text-gray-500">
                              At {Math.floor(bookmark / 60)}:{(bookmark % 60).toString().padStart(2, '0')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related Lessons */}
              {relatedLessons.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Related Lessons
                  </h3>
                  <div className="space-y-4">
                    {relatedLessons.map((relatedLesson) => (
                      <div
                        key={relatedLesson.Id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        onClick={() => navigate(`/lessons/${relatedLesson.Id}`)}
                      >
                        <img
                          src={relatedLesson.thumbnail}
                          alt={relatedLesson.title}
                          className="w-12 h-8 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=48&h=32&fit=crop';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {relatedLesson.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            ${relatedLesson.price} • {formatDuration(relatedLesson.duration)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        lesson={lesson}
        onPurchaseComplete={handlePurchase}
      />
    </div>
  );
};

export default LessonDetail;