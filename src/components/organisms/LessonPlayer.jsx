import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const LessonPlayer = ({ 
  lesson, 
  progress, 
  onProgressUpdate, 
  onAddBookmark 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(lesson.duration * 60); // Convert minutes to seconds
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (progress?.lastAccessed) {
      // Resume from last position if available
      const lastPosition = progress.completionPercentage * duration / 100;
      setCurrentTime(lastPosition);
    }
  }, [progress, duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control actual video/audio playback
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
    const percentage = (time / duration) * 100;
    
    // Update progress
    if (onProgressUpdate) {
      onProgressUpdate({
        completionPercentage: Math.round(percentage),
        lastAccessed: new Date().toISOString()
      });
    }
  };

  const handleAddBookmark = () => {
    if (onAddBookmark) {
      onAddBookmark(currentTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Simulate video/audio playback
  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = Math.min(prev + playbackSpeed, duration);
          
          // Auto-update progress every 10 seconds
          if (Math.floor(newTime) % 10 === 0 && onProgressUpdate) {
            const percentage = (newTime / duration) * 100;
            onProgressUpdate({
              completionPercentage: Math.round(percentage),
              lastAccessed: new Date().toISOString()
            });
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, duration, onProgressUpdate]);

  return (
    <div className="bg-black rounded-xl overflow-hidden relative">
      {/* Video/Audio Player Area */}
      <div 
        ref={playerRef}
        className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center cursor-pointer"
        onMouseMove={handleMouseMove}
        onClick={handlePlayPause}
      >
        {/* Placeholder for actual video */}
        <div className="text-center">
          <ApperIcon 
            name={isPlaying ? "Pause" : "Play"} 
            size={64} 
            className="text-white/80 mb-4" 
          />
          <p className="text-white/60 text-sm">
            {isPlaying ? "Playing" : "Click to play"} • {lesson.title}
          </p>
        </div>

        {/* Bookmarks */}
        {progress?.bookmarks?.map((bookmark, index) => (
          <div
            key={index}
            className="absolute bottom-20 w-2 h-8 bg-accent rounded opacity-80 hover:opacity-100 cursor-pointer"
            style={{ left: `${(bookmark / duration) * 100}%` }}
            title={`Bookmark at ${formatTime(bookmark)}`}
          />
        ))}

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
            >
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <h3 className="text-white font-medium text-lg truncate">
                  {lesson.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="small"
                    icon="Bookmark"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddBookmark();
                    }}
                    className="text-white hover:text-accent"
                  />
                  <Button
                    variant="ghost"
                    size="small"
                    icon="FileText"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTranscript(!showTranscript);
                    }}
                    className="text-white hover:text-accent"
                  />
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div className="relative mb-4">
                  <div className="w-full h-2 bg-white/20 rounded-full cursor-pointer">
                    <div
                      className="h-2 bg-accent rounded-full relative"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab" />
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="medium"
                      icon={isPlaying ? "Pause" : "Play"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause();
                      }}
                      className="text-white hover:text-accent"
                    />
                    
                    <Button
                      variant="ghost"
                      size="small"
                      icon="SkipBack"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeek(Math.max(0, currentTime - 10));
                      }}
                      className="text-white hover:text-accent"
                    />
                    
                    <Button
                      variant="ghost"
                      size="small"
                      icon="SkipForward"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeek(Math.min(duration, currentTime + 10));
                      }}
                      className="text-white hover:text-accent"
                    />

                    <div className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-white/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>

                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Volume2" size={16} className="text-white" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-16"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript Panel */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-surface border-t border-gray-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Transcript</h4>
                <Button
                  variant="ghost"
                  size="small"
                  icon="X"
                  onClick={() => setShowTranscript(false)}
                />
              </div>
              <div className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto">
                {lesson.content?.transcript || "Transcript not available for this lesson."}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPlayer;