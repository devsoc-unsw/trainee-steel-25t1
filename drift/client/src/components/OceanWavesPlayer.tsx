import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface OceanWavesPlayerProps {
  autoPlay?: boolean;
  volume?: number;
  audioSrc?: string;
}

const OceanWavesPlayer: React.FC<OceanWavesPlayerProps> = ({ 
  autoPlay = false, 
  volume = 0.3,
  audioSrc = '/audio/ocean-waves.mp3' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [showControls, setShowControls] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial properties
    audio.volume = currentVolume;
    audio.loop = true; // Loop the ocean waves continuously
    audio.preload = 'auto';

    // Event listeners
    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(audio.duration);
      setError(null);
    };

    const handleError = () => {
      setError('Failed to load ocean waves audio. Please check the file path.');
      setIsLoaded(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      // This shouldn't fire with loop=true, but just in case
      if (isPlaying) {
        audio.currentTime = 0;
        audio.play();
      }
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Auto-play if enabled
    if (autoPlay && isLoaded) {
      togglePlayback();
    }

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [autoPlay, isLoaded]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Failed to play audio. Please try again.');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setCurrentVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
      />

      <div className="fixed bottom-4 right-4 z-40">
        {/* Music Control Button */}
        <div className="relative">
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 ${
              isPlaying 
                ? 'bg-drift-blue/20 text-drift-blue shadow-lg shadow-drift-blue/20' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            } ${error ? 'bg-red-500/20 text-red-400' : ''}`}
            title={error ? error : "Background Music Controls"}
          >
            <Music className="h-5 w-5" />
            {isPlaying && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
            {error && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"></div>
            )}
          </button>

          {/* Controls Panel */}
          {showControls && (
            <div className="absolute bottom-16 right-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl min-w-[240px]">
              <div className="space-y-4">
                {/* Title */}
                <div className="text-center">
                  <h3 className="text-white font-medium text-sm">Ambient Music</h3>
                  <p className="text-white/60 text-xs">Relaxing background sounds</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                    <p className="text-red-200 text-xs text-center">{error}</p>
                    <p className="text-red-300/70 text-xs text-center mt-1">
                      Place your MP3 file at: <code className="bg-black/20 px-1 rounded">public/audio/ocean-waves.mp3</code>
                    </p>
                  </div>
                )}

                {/* Play/Pause Button */}
                <button
                  onClick={togglePlayback}
                  disabled={!isLoaded || !!error}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                    isPlaying
                      ? 'bg-drift-blue/30 text-white border border-drift-blue/50'
                      : 'bg-white/20 text-white/80 hover:bg-white/30 border border-white/30'
                  } ${(!isLoaded || error) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isPlaying ? 'Pause Music' : 'Play Music'}
                </button>

                {/* Volume Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-xs">Volume</span>
                    <span className="text-white/60 text-xs">{Math.round(currentVolume * 100)}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <VolumeX className="h-4 w-4 text-white/60" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={currentVolume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-2 appearance-none cursor-pointer music-slider"
                    />
                    <Volume2 className="h-4 w-4 text-white/60" />
                  </div>
                </div>

                {/* Progress Bar (if audio is loaded) */}
                {isLoaded && duration > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-xs">Progress</span>
                      <span className="text-white/60 text-xs">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <div 
                        className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="text-center pt-2 border-t border-white/20">
                  <p className="text-white/50 text-xs">
                    Gentle sounds to enhance focus
                  </p>
                </div>



                {/* File Upload Hint */}
                {!isLoaded && !error && (
                  <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
                    <p className="text-yellow-200 text-xs text-center">
                      Loading ocean waves audio...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OceanWavesPlayer; 