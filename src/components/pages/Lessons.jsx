import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import LessonCard from '@/components/molecules/LessonCard';
import { SkeletonGrid } from '@/components/organisms/LoadingStates';
import { NoLessonsEmpty, NoSearchResults } from '@/components/organisms/EmptyStates';

import lessonService from '@/services/api/lessonService';
import userService from '@/services/api/userService';
import progressService from '@/services/api/progressService';

const Lessons = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    loadLessonsData();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [lessons, searchQuery, selectedCategory, selectedLevel, sortBy]);

  const loadLessonsData = async () => {
    setLoading(true);
    try {
      const [allLessons, currentUser] = await Promise.all([
        lessonService.getAll(),
        userService.getCurrentUser()
      ]);

      setLessons(allLessons);
      setUser(currentUser);

      // Extract unique categories
      const uniqueCategories = [...new Set(allLessons.map(lesson => lesson.category))];
      setCategories(uniqueCategories);

      // Load user progress if user exists
      if (currentUser) {
        const progress = await progressService.getUserProgress(currentUser.Id);
        setUserProgress(progress);
      }
    } catch (error) {
      toast.error('Failed to load lessons');
      console.error('Lessons loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = [...lessons];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query) ||
        lesson.category.toLowerCase().includes(query) ||
        lesson.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(lesson => lesson.level === selectedLevel);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration-short':
          return a.duration - b.duration;
        case 'duration-long':
          return b.duration - a.duration;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredLessons(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSortBy('featured');
  };

  const getProgressForLesson = (lessonId) => {
    return userProgress.find(p => p.lessonId === lessonId.toString());
  };

  const getPurchasedCount = () => {
    return user?.purchasedLessons?.length || 0;
  };

  const getCompletedCount = () => {
    return userProgress.filter(p => p.completionPercentage === 100).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
          </div>
          <SkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Transformational Lessons
          </h1>
          <p className="text-gray-600 mb-6">
            Discover the Big7 principles and embark on your journey of self-discovery with the Squirrel Wrangler
          </p>

          {/* Stats */}
          {user && (
            <div className="bg-surface rounded-xl p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{lessons.length}</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{getPurchasedCount()}</div>
                  <div className="text-sm text-gray-600">Purchased</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{getCompletedCount()}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <SearchBar
            placeholder="Search lessons, topics, or tags..."
            onSearch={handleSearch}
            className="mb-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="featured">Featured First</option>
                <option value="title">Title A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration-short">Duration: Short First</option>
                <option value="duration-long">Duration: Long First</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="outline"
                size="medium"
                onClick={clearFilters}
                icon="X"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <Badge variant="primary" size="small">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" size="small">
                  Category: {selectedCategory}
                </Badge>
              )}
              {selectedLevel !== 'all' && (
                <Badge variant="accent" size="small">
                  Level: {selectedLevel}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredLessons.length} of {lessons.length} lessons
          </p>
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length === 0 ? (
          searchQuery ? (
            <NoSearchResults
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
          ) : (
            <NoLessonsEmpty
              onBrowseLessons={() => clearFilters()}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson, index) => (
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
    </div>
  );
};

export default Lessons;