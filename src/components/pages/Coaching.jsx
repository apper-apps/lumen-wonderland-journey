import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import CoachingCard from '@/components/molecules/CoachingCard';
import { SquirrelLoading } from '@/components/organisms/LoadingStates';
import { NoCoachingEmpty } from '@/components/organisms/EmptyStates';

import coachingService from '@/services/api/coachingService';

const Coaching = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadCoachingSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, selectedType]);

  const loadCoachingSessions = async () => {
    setLoading(true);
    try {
      const allSessions = await coachingService.getAll();
      
      // Sort sessions by schedule date
      const sortedSessions = allSessions.sort((a, b) => 
        new Date(a.schedule) - new Date(b.schedule)
      );
      
      setSessions(sortedSessions);
    } catch (error) {
      toast.error('Failed to load coaching sessions');
      console.error('Coaching sessions loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = [...sessions];

    if (selectedType !== 'all') {
      filtered = filtered.filter(session => session.type === selectedType);
    }

    setFilteredSessions(filtered);
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return sessions.filter(session => new Date(session.schedule) > now);
  };

  const getPastSessions = () => {
    const now = new Date();
    return sessions.filter(session => new Date(session.schedule) <= now);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <SquirrelLoading message="Connecting to coaching sessions..." />
      </div>
    );
  }

  const upcomingSessions = getUpcomingSessions();
  const pastSessions = getPastSessions();

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Coaching Sessions
          </h1>
          <p className="text-gray-600 mb-6">
            Connect with the Squirrel Wrangler and fellow journeyers through Marco Polo video messaging
          </p>

          {/* Marco Polo Info */}
          <div className="bg-gradient-to-r from-info/10 to-info/5 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center">
                <ApperIcon name="MessageCircle" size={24} className="text-info" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  About Marco Polo Coaching
                </h3>
                <p className="text-gray-600 mb-4">
                  Experience asynchronous coaching through Marco Polo's video messaging platform. 
                  Join group discussions, receive personalized guidance, and connect with a supportive community 
                  on your transformation journey.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info" size="small">
                    Video Messaging
                  </Badge>
                  <Badge variant="info" size="small">
                    Flexible Timing
                  </Badge>
                  <Badge variant="info" size="small">
                    Community Support
                  </Badge>
                  <Badge variant="info" size="small">
                    Personal Guidance
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Calendar" size={24} className="text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {upcomingSessions.length}
            </div>
            <div className="text-sm text-gray-600">Upcoming Sessions</div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Users" size={24} className="text-secondary" />
            </div>
            <div className="text-2xl font-bold text-secondary mb-1">
              {sessions.filter(s => s.type === 'group').length}
            </div>
            <div className="text-sm text-gray-600">Group Sessions</div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="User" size={24} className="text-accent" />
            </div>
            <div className="text-2xl font-bold text-accent mb-1">
              {sessions.filter(s => s.type === 'individual').length}
            </div>
            <div className="text-sm text-gray-600">1-on-1 Sessions</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Sessions
            </h3>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="group">Group Sessions</option>
              <option value="individual">1-on-1 Sessions</option>
              <option value="workshop">Workshops</option>
            </select>
          </div>
        </div>

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              Upcoming Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions
                .filter(session => selectedType === 'all' || session.type === selectedType)
                .map((session, index) => (
                  <motion.div
                    key={session.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CoachingCard session={session} />
                  </motion.div>
                ))
              }
            </div>
          </section>
        )}

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              Past Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastSessions
                .filter(session => selectedType === 'all' || session.type === selectedType)
                .map((session, index) => (
                  <motion.div
                    key={session.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CoachingCard session={session} />
                  </motion.div>
                ))
              }
            </div>
          </section>
        )}

        {/* Empty State */}
        {sessions.length === 0 && (
          <NoCoachingEmpty
            onExploreSchedule={() => toast.info('New coaching sessions will be available soon!')}
          />
        )}

        {/* Marco Polo Getting Started */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-8 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-display font-bold mb-4">
              New to Marco Polo?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Marco Polo is a video messaging app that allows for meaningful, asynchronous conversations. 
              Download the app and join our coaching groups to connect with the Squirrel Wrangler community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="accent"
                onClick={() => window.open('https://marcopolo.me', '_blank')}
                icon="ExternalLink"
              >
                Learn About Marco Polo
              </Button>
              <Button
                variant="surface"
                onClick={() => toast.info('Session links will be provided when you join coaching sessions')}
                icon="MessageCircle"
              >
                Join Community
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Coaching;