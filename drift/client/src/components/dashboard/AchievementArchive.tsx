import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Grid, Play, Calendar, Target, Clock, Music, Dumbbell, Book, Briefcase, Heart, Star } from 'lucide-react';
import { getUserAchievements, Achievement } from '../../services/achievementService';
import DriftLogo from '../../assets/drift_logo.svg';

// Icon mapping for different goal types
const getGoalIcon = (objective: string) => {
  const lowerObjective = objective.toLowerCase();
  if (lowerObjective.includes('guitar') || lowerObjective.includes('music') || lowerObjective.includes('instrument')) {
    return Music;
  } else if (lowerObjective.includes('fitness') || lowerObjective.includes('exercise') || lowerObjective.includes('workout')) {
    return Dumbbell;
  } else if (lowerObjective.includes('read') || lowerObjective.includes('book') || lowerObjective.includes('study')) {
    return Book;
  } else if (lowerObjective.includes('work') || lowerObjective.includes('career') || lowerObjective.includes('business')) {
    return Briefcase;
  } else if (lowerObjective.includes('health') || lowerObjective.includes('meditation') || lowerObjective.includes('mindfulness')) {
    return Heart;
  } else {
    return Target;
  }
};

const AchievementArchive: React.FC = () => {
  const [completedGoals, setCompletedGoals] = useState<Achievement[]>([]);
  const [viewMode, setViewMode] = useState<'slideshow' | 'grid'>('slideshow');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError(null);
        const achievements = await getUserAchievements();
        setCompletedGoals(achievements);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % completedGoals.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + completedGoals.length) % completedGoals.length);
      setIsTransitioning(false);
    }, 150);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 150);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-drift-orange via-drift-pink to-drift-blue flex items-center justify-center">
        <div className="text-center text-white">
          <img src={DriftLogo} alt="Drift logo" className="h-24 w-24 mx-auto mb-6 animate-spin" />
          <h2 className="text-2xl font-bold mb-4">Loading Achievements...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-drift-orange via-drift-pink to-drift-blue flex items-center justify-center">
        <div className="text-center text-white">
          <img src={DriftLogo} alt="Drift logo" className="h-24 w-24 mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-bold mb-4">Error Loading Achievements</h2>
          <p className="text-white/70 text-lg mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (completedGoals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-drift-orange via-drift-pink to-drift-blue flex items-center justify-center">
        <div className="text-center text-white">
          <img src={DriftLogo} alt="Drift logo" className="h-24 w-24 mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-bold mb-4">No Achievements Yet</h2>
          <p className="text-white/70 text-lg mb-6">
            Complete your first goal to start building your achievement archive!
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <p className="text-white/80">
              When you complete a goal and reach 100% progress, you'll be able to save it here 
              and celebrate your accomplishments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentGoal = completedGoals[currentSlide];
  const IconComponent = getGoalIcon(currentGoal?.objective || '');

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-drift-orange via-drift-pink to-drift-blue overflow-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-full flex flex-col">
        {/* Header */}
        <div className="relative mb-8 md:mb-12">
          {/* Centered Title */}
          <div className="text-center px-16 md:px-0">
            <h1 className="text-2xl md:text-4xl font-bold text-drift-blue mb-2">Achievement Archive</h1>
          </div>
          
          {/* Top Right Button */}
          <div className="absolute top-0 right-0">
            {viewMode === 'slideshow' ? (
              <button 
                onClick={() => setViewMode('grid')}
                className="text-drift-blue/70 hover:text-drift-blue transition-colors text-sm md:text-lg font-medium px-2 py-1"
              >
                view all
              </button>
            ) : (
              <button 
                onClick={() => setViewMode('slideshow')}
                className="text-drift-blue/70 hover:text-drift-blue transition-colors text-sm md:text-lg font-medium px-2 py-1"
              >
                slideshow
              </button>
            )}
          </div>
        </div>

        {/* Main Achievement Card - Only show in slideshow mode */}
        {viewMode === 'slideshow' && (
          <div className="relative flex items-center justify-center flex-1">
            {/* Left Navigation Arrow */}
            {completedGoals.length > 1 && (
              <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className={`absolute left-0 z-10 p-4 transition-all duration-300 ${
                  isTransitioning 
                    ? 'text-drift-blue/30 cursor-not-allowed' 
                    : 'text-drift-blue/70 hover:text-drift-blue hover:scale-110 cursor-pointer'
                }`}
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

                                    {/* Achievement Card */}
            <div className="w-full max-w-2xl mx-4 md:mx-16">
              <div className={`bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}>
                {/* Image Section */}
                <div className="relative h-48 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  {/* Placeholder for achievement image - using icon for now */}
                  <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-drift-orange/20 via-drift-pink/20 to-drift-blue/20 rounded-2xl flex items-center justify-center">
                    <IconComponent className="h-16 w-16 md:h-24 md:w-24 text-drift-blue" />
                  </div>
                
                {/* Achievement badge */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-700 font-medium text-sm">Achievement</span>
                  </div>
                </div>
              </div>

                              {/* Content Section */}
                <div className="p-4 md:p-8">
                  {/* Goal Title with Icon */}
                  <div className="flex items-center space-x-3 mb-4 md:mb-6">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-drift-orange to-drift-pink rounded-lg flex items-center justify-center">
                      <IconComponent className="h-3 w-3 md:h-5 md:w-5 text-white" />
                    </div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800 leading-tight">
                      {currentGoal?.name}
                    </h2>
                  </div>

                                  {/* Congrats Message */}
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl md:text-2xl">🎉</span>
                      <span className="text-lg md:text-xl font-bold text-gray-800">Congrats!</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      You nailed your goal of {currentGoal?.objective.toLowerCase()}. 
                      Consistency like this is what builds real skill – every day you showed up, 
                      and it paid off. Keep strumming and keep pushing. This is just the 
                      beginning.
                    </p>
                  </div>

                                  {/* Achievement Stats */}
                  <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-lg md:text-2xl font-bold text-gray-800">{currentGoal?.totalTasks}</div>
                      <div className="text-xs md:text-sm text-gray-500">Tasks Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg md:text-2xl font-bold text-gray-800 capitalize">{currentGoal?.dedication}</div>
                      <div className="text-xs md:text-sm text-gray-500">Dedication Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg md:text-2xl font-bold text-gray-800">
                        {formatDate(currentGoal?.completedDate).split(',')[0]}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">Completed</div>
                    </div>
                  </div>
              </div>
            </div>
          </div>

            {/* Right Navigation Arrow */}
            {completedGoals.length > 1 && (
              <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className={`absolute right-0 z-10 p-4 transition-all duration-300 ${
                  isTransitioning 
                    ? 'text-drift-blue/30 cursor-not-allowed' 
                    : 'text-drift-blue/70 hover:text-drift-blue hover:scale-110 cursor-pointer'
                }`}
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}
          </div>
        )}

        {/* Slide Indicators - Only show in slideshow mode */}
        {viewMode === 'slideshow' && completedGoals.length > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            {completedGoals.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-drift-blue shadow-lg scale-125'
                    : 'bg-drift-blue/40 hover:bg-drift-blue/60'
                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              />
            ))}
          </div>
        )}

        {/* Achievement Count - Only show in slideshow mode */}
        {viewMode === 'slideshow' && (
          <div className="text-center mt-8">
            <p className="text-drift-blue/60">
              Achievement {currentSlide + 1} of {completedGoals.length}
            </p>
          </div>
        )}

        {/* Grid Mode */}
        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 content-start">
            {completedGoals.map((goal, index) => {
              const IconComponent = getGoalIcon(goal.objective);
              return (
                <div
                  key={goal._id}
                  className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="text-center mb-4">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-gradient-to-br from-drift-orange/20 via-drift-pink/20 to-drift-blue/20 flex items-center justify-center relative">
                      <IconComponent className="h-12 w-12 text-drift-blue" />
                      <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{goal.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.objective}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Completed:</span>
                      <span className="text-gray-800 text-sm font-medium">{formatDate(goal.completedDate).split(',')[0]}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Dedication:</span>
                      <span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          goal.dedication === 'Intense'
                            ? 'bg-red-100 text-red-600'
                            : goal.dedication === 'Moderate'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {goal.dedication}
                        </span>
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Tasks:</span>
                      <span className="text-gray-800 text-sm font-medium">{goal.totalTasks}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-drift-orange/20 to-drift-pink/20 rounded-lg p-3">
                      <p className="text-drift-blue text-xs text-center font-medium">🎉 Achievement Unlocked</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}


      </div>
    </div>
  );
};

export default AchievementArchive; 