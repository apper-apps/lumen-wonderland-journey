import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { PageLoading } from '@/components/organisms/LoadingStates';
import lessonService from '@/services/api/lessonService';

const GardenLabyrinth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [hoveredArea, setHoveredArea] = useState(null);

  // Consciousness areas mapping to lesson concepts
  const consciousnessAreas = [
    {
      id: 'inner-awareness',
      name: 'Inner Awareness',
      description: 'Discover your inner squirrels and understand the different aspects of consciousness',
      position: { x: 150, y: 120 },
      color: '#8B5CF6',
      keywords: ['consciousness', 'self-discovery', 'inner', 'awareness', 'squirrels'],
      categories: ['Foundation']
    },
    {
      id: 'transformation-path',
      name: 'Transformation Path',
      description: 'Navigate through personal transformation and growth',
      position: { x: 320, y: 180 },
      color: '#06B6D4',
      keywords: ['transformation', 'growth', 'change', 'nlp', 'mindset'],
      categories: ['Transformation']
    },
    {
      id: 'healing-gardens',
      name: 'Healing Gardens',
      description: 'Release emotional blocks and experience deep healing',
      position: { x: 480, y: 140 },
      color: '#10B981',
      keywords: ['healing', 'emotional-release', 'hypnosis', 'subconscious'],
      categories: ['Healing']
    },
    {
      id: 'labyrinth-center',
      name: 'Sacred Center',
      description: 'The heart of the labyrinth where all paths converge',
      position: { x: 320, y: 280 },
      color: '#F59E0B',
      keywords: ['meditation', 'inner-journey', 'breakthrough', 'big7'],
      categories: ['Foundation', 'Transformation', 'Healing']
    },
    {
      id: 'wisdom-grove',
      name: 'Wisdom Grove',
      description: 'Ancient wisdom and advanced practices for deep transformation',
      position: { x: 220, y: 340 },
      color: '#EF4444',
      keywords: ['advanced', 'wisdom', 'breakthrough', 'mental-emotional'],
      categories: ['Healing', 'Transformation']
    }
  ];

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    setLoading(true);
    try {
      const allLessons = await lessonService.getAll();
      setLessons(allLessons);
    } catch (error) {
      toast.error('Failed to load lessons');
      console.error('Garden Labyrinth loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonsForArea = (area) => {
    return lessons.filter(lesson => {
      // Match by category
      if (area.categories.includes(lesson.category)) return true;
      
      // Match by keywords in title, description, or tags
      const searchText = `${lesson.title} ${lesson.description} ${lesson.tags?.join(' ')}`.toLowerCase();
      return area.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });
  };

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    const relatedLessons = getLessonsForArea(area);
    if (relatedLessons.length === 0) {
      toast.info(`No lessons found for ${area.name}. More content coming soon!`);
    }
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  const areaAnimation = useSpring({
    transform: selectedArea ? 'scale(1.1)' : 'scale(1)',
    config: { tension: 300, friction: 20 }
  });

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            The Garden Labyrinth
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore the sacred geometry of consciousness. Each area represents different aspects of your inner journey, connected to transformational lessons.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <ApperIcon name="Info" size={16} />
            <span>Click on any area to discover related lessons</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <svg
                viewBox="0 0 640 480"
                className="w-full h-auto max-h-96"
                style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
              >
                {/* Labyrinth paths */}
                <defs>
                  <pattern id="labyrinthPath" patternUnits="userSpaceOnUse" width="20" height="20">
                    <path
                      d="M 0 10 Q 10 0 20 10 Q 10 20 0 10"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      fill="none"
                    />
                  </pattern>
                </defs>

                {/* Background paths */}
                <path
                  d="M 100 200 Q 200 100 300 200 Q 400 300 500 200 Q 400 100 300 150 Q 200 250 100 200"
                  stroke="#d1d5db"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
                <path
                  d="M 150 300 Q 250 200 350 300 Q 450 400 350 350 Q 250 400 150 300"
                  stroke="#d1d5db"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />

                {/* Consciousness Areas */}
                {consciousnessAreas.map((area, index) => (
                  <g key={area.id}>
                    {/* Area glow effect */}
                    <circle
                      cx={area.position.x}
                      cy={area.position.y}
                      r="50"
                      fill={area.color}
                      opacity={hoveredArea === area.id ? "0.2" : "0.1"}
                      className="transition-all duration-300"
                    />
                    
                    {/* Interactive area */}
                    <motion.circle
                      cx={area.position.x}
                      cy={area.position.y}
                      r="35"
                      fill={area.color}
                      opacity={hoveredArea === area.id ? "0.8" : "0.6"}
                      className="cursor-pointer transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAreaClick(area)}
                      onMouseEnter={() => setHoveredArea(area.id)}
                      onMouseLeave={() => setHoveredArea(null)}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                    />

                    {/* Area label */}
                    <text
                      x={area.position.x}
                      y={area.position.y - 45}
                      textAnchor="middle"
                      className="font-medium text-sm fill-gray-700 pointer-events-none"
                    >
                      {area.name}
                    </text>

                    {/* Lesson count badge */}
                    <circle
                      cx={area.position.x + 25}
                      cy={area.position.y - 25}
                      r="12"
                      fill="white"
                      stroke={area.color}
                      strokeWidth="2"
                    />
                    <text
                      x={area.position.x + 25}
                      y={area.position.y - 20}
                      textAnchor="middle"
                      className="text-xs font-bold fill-gray-700 pointer-events-none"
                    >
                      {getLessonsForArea(area).length}
                    </text>
                  </g>
                ))}

                {/* Connecting lines between areas */}
                <path
                  d="M 150 120 Q 235 150 320 180"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="3,3"
                  opacity="0.5"
                />
                <path
                  d="M 320 180 Q 400 160 480 140"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="3,3"
                  opacity="0.5"
                />
                <path
                  d="M 320 180 L 320 280"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="3,3"
                  opacity="0.5"
                />
                <path
                  d="M 320 280 Q 270 310 220 340"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="3,3"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* Area Description */}
            {hoveredArea && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                {(() => {
                  const area = consciousnessAreas.find(a => a.id === hoveredArea);
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: area.color }}
                        />
                        <h3 className="text-xl font-semibold text-gray-900">
                          {area.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">{area.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {getLessonsForArea(area).length} related lessons
                        </span>
                        <Button
                          size="small"
                          onClick={() => handleAreaClick(area)}
                          icon="ArrowRight"
                        >
                          Explore
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Legend */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Map" size={20} />
                Consciousness Areas
              </h3>
              <div className="space-y-3">
                {consciousnessAreas.map(area => (
                  <div
                    key={area.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleAreaClick(area)}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: area.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {area.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getLessonsForArea(area).length} lessons
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Area Lessons */}
            {selectedArea && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedArea.color }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedArea.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {selectedArea.description}
                </p>

                <div className="space-y-3">
                  {getLessonsForArea(selectedArea).map(lesson => (
                    <div
                      key={lesson.Id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm cursor-pointer transition-all"
                      onClick={() => handleLessonClick(lesson.Id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" size="small">
                              {lesson.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {lesson.duration}min
                            </span>
                          </div>
                        </div>
                        <ApperIcon name="ArrowRight" size={16} className="text-gray-400 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>

                {getLessonsForArea(selectedArea).length === 0 && (
                  <div className="text-center py-8">
                    <ApperIcon name="BookOpen" size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      No lessons available for this area yet.
                    </p>
                    <p className="text-gray-400 text-xs">
                      More content coming soon!
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate('/lessons')}
                    icon="BookOpen"
                    className="w-full justify-center"
                  >
                    View All Lessons
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Journey Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Areas</span>
                  <span className="font-semibold text-gray-900">
                    {consciousnessAreas.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Connected Lessons</span>
                  <span className="font-semibold text-gray-900">
                    {lessons.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Learning Paths</span>
                  <span className="font-semibold text-gray-900">
                    {[...new Set(lessons.map(l => l.category))].length}
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

export default GardenLabyrinth;