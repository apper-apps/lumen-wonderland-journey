import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import wisdomService from "@/services/api/wisdomService";
import lessonService from "@/services/api/lessonService";
import userService from "@/services/api/userService";
import progressService from "@/services/api/progressService";
import coachingService from "@/services/api/coachingService";
import ApperIcon from "@/components/ApperIcon";
import Progress from "@/components/pages/Progress";
import Lessons from "@/components/pages/Lessons";
import ProgressRing from "@/components/molecules/ProgressRing";
import LessonCard from "@/components/molecules/LessonCard";
import { WonderlandEmpty } from "@/components/organisms/EmptyStates";
import { SkeletonGrid, SquirrelLoading } from "@/components/organisms/LoadingStates";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const Home = () => {
  const navigate = useNavigate();
const [loading, setLoading] = useState(true);
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [dailyWisdom, setDailyWisdom] = useState(null);
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalPurchased: 0,
    currentStreak: 0,
    totalWatchTime: 0
  });
  useEffect(() => {
    loadHomeData();
  }, []);

const loadHomeData = async () => {
    setLoading(true);
    try {
      const [featured, currentUser, coaching, wisdom] = await Promise.all([
        lessonService.getFeatured(),
        userService.getCurrentUser(),
        coachingService.getUpcoming(),
        wisdomService.getDailyQuote()
      ]);
      setFeaturedLessons(featured);
      setUser(currentUser);
      setDailyWisdom(wisdom);
      
      if (coaching.length > 0) {
        setUpcomingSession(coaching[0]);
      }
      // Load user progress
      if (currentUser) {
        const progress = await progressService.getUserProgress(currentUser.Id);
        setUserProgress(progress);
        
        // Calculate stats
        const completedLessons = progress.filter(p => p.completionPercentage === 100).length;
        setStats({
          completedLessons,
          totalPurchased: currentUser.purchasedLessons?.length || 0,
          currentStreak: currentUser.progress?.currentStreak || 0,
          totalWatchTime: currentUser.progress?.totalWatchTime || 0
        });
      }
    } catch (error) {
      toast.error('Failed to load home content');
      console.error('Home data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    const totalProgress = userProgress.reduce((sum, p) => sum + p.completionPercentage, 0);
    return Math.round(totalProgress / userProgress.length);
  };

  const getProgressForLesson = (lessonId) => {
    return userProgress.find(p => p.lessonId === lessonId.toString());
  };

  const handleJoinCoaching = () => {
    if (upcomingSession) {
      window.open(upcomingSession.marcoPoloLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <SquirrelLoading message="Preparing your Wonderland journey..." />
      </div>
    );
  }

  return (
<div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        <div className="relative px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Welcome to Wonderland
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Transform your life through the mystical teachings of the Squirrel Wrangler and the Big7 principles
              </p>
              
              {user ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Welcome back, {user.name}! 🐿️
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{stats.completedLessons}</div>
                      <div className="text-sm text-white/80">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{stats.totalPurchased}</div>
                      <div className="text-sm text-white/80">Purchased</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{stats.currentStreak}</div>
                      <div className="text-sm text-white/80">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{stats.totalWatchTime}</div>
                      <div className="text-sm text-white/80">Minutes</div>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="accent"
                  size="large"
                  onClick={() => navigate('/auth/login')}
                >
                  Begin Your Journey
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      {user && userProgress.length > 0 && (
        <section className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-surface rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  Your Journey Progress
                </h2>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => navigate('/progress')}
                >
                  View All
                </Button>
              </div>
              
              <div className="flex items-center justify-center">
                <ProgressRing 
                  progress={getOverallProgress()}
                  size={150}
                  color="#5B4E8C"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {getOverallProgress()}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Overall Progress
                    </div>
                  </div>
                </ProgressRing>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Coaching Session */}
      {upcomingSession && (
        <section className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl p-6 border border-accent/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <ApperIcon name="Calendar" size={20} className="text-accent mr-2" />
                    <Badge variant="accent" size="small">
                      Upcoming Session
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {upcomingSession.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {upcomingSession.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <ApperIcon name="Clock" size={16} className="mr-1" />
                    {new Date(upcomingSession.schedule).toLocaleDateString()} at{' '}
                    {new Date(upcomingSession.schedule).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                <Button
                  variant="accent"
                  size="medium"
                  icon="ExternalLink"
                  onClick={handleJoinCoaching}
                >
                  Join via Marco Polo
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Lessons */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-semibold text-gray-900">
              Featured Lessons
            </h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/lessons')}
              icon="ArrowRight"
              iconPosition="right"
            >
              View All Lessons
            </Button>
          </div>

          {featuredLessons.length === 0 ? (
            <WonderlandEmpty
              title="No featured lessons yet"
              description="The Squirrel Wrangler is preparing transformative content for your journey. Check back soon for new lessons!"
              actionLabel="Explore All Lessons"
              onAction={() => navigate('/lessons')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LessonCard
                    lesson={lesson}
                    isPurchased={user?.purchasedLessons?.includes(lesson.Id.toString())}
                    progress={getProgressForLesson(lesson.Id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Big7 Introduction */}
      <section className="px-6 py-12 bg-surface/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">
              The Big7 Principles
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover the seven transformative principles that will guide you through your personal 
              growth journey, taught by the renowned Squirrel Wrangler, Stacy Braiuca.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: "Brain", title: "Consciousness", description: "Understand your inner awareness" },
                { icon: "Heart", title: "Connection", description: "Build meaningful relationships" }, 
                { icon: "Sparkles", title: "Transformation", description: "Embrace positive change" }
              ].map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-md"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name={principle.icon} size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-sm text-gray-600">{principle.description}</p>
                </motion.div>
              ))}
            </div>
            
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/lessons')}
            >
              Explore All Principles
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;