import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface BackgroundMusicProps {
  autoPlay?: boolean;
  volume?: number;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ 
  autoPlay = false, 
  volume = 0.3 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);

  // Create synthetic wave sounds using Web Audio API
  useEffect(() => {
    const createAudioContext = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gain = context.createGain();
        gain.connect(context.destination);
        gain.gain.value = currentVolume;
        
        setAudioContext(context);
        setGainNode(gain);
      } catch (error) {
        console.log('Web Audio API not supported, falling back to HTML audio');
      }
    };

    createAudioContext();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Generate ambient wave sounds
  const createWaveSound = () => {
    if (!audioContext || !gainNode) return;

    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const oscillator3 = audioContext.createOscillator();
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;

    // Create layered wave sounds
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 8);

    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(330, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(165, audioContext.currentTime + 12);

    oscillator3.type = 'triangle';
    oscillator3.frequency.setValueAtTime(55, audioContext.currentTime);
    oscillator3.frequency.exponentialRampToValueAtTime(82.5, audioContext.currentTime + 16);

    // Create envelope for natural wave sound
    const envelope = audioContext.createGain();
    envelope.gain.setValueAtTime(0, audioContext.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 2);
    envelope.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 6);
    envelope.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 10);
    envelope.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 16);

    // Connect the audio graph
    oscillator1.connect(filter);
    oscillator2.connect(filter);
    oscillator3.connect(envelope);
    filter.connect(envelope);
    envelope.connect(gainNode);

    // Start the oscillators
    oscillator1.start();
    oscillator2.start();
    oscillator3.start();

    // Stop after the wave completes
    oscillator1.stop(audioContext.currentTime + 16);
    oscillator2.stop(audioContext.currentTime + 16);
    oscillator3.stop(audioContext.currentTime + 16);
  };

  // Play wave sounds in intervals
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && audioContext) {
      const playWave = () => {
        createWaveSound();
        // Random interval between waves (15-45 seconds)
        const nextWave = Math.random() * 30000 + 15000;
        interval = setTimeout(playWave, nextWave);
      };
      
      // Start first wave after 2 seconds
      interval = setTimeout(playWave, 2000);
    }

    return () => {
      if (interval) {
        clearTimeout(interval);
      }
    };
  }, [isPlaying, audioContext]);

  // Update volume
  useEffect(() => {
    if (gainNode) {
      gainNode.gain.setValueAtTime(currentVolume, audioContext!.currentTime);
    }
  }, [currentVolume, gainNode, audioContext]);

  const toggleMusic = async () => {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setCurrentVolume(newVolume);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Music Control Button */}
      <div className="relative">
        <button
          onClick={() => setShowControls(!showControls)}
          className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 ${
            isPlaying 
              ? 'bg-drift-blue/20 text-drift-blue shadow-lg shadow-drift-blue/20' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          title="Background Music Controls"
        >
          <Music className="h-5 w-5" />
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </button>

        {/* Controls Panel */}
        {showControls && (
          <div className="absolute bottom-16 right-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl min-w-[200px]">
            <div className="space-y-4">
              {/* Title */}
              <div className="text-center">
                <h3 className="text-white font-medium text-sm">Ambient Waves</h3>
                <p className="text-white/60 text-xs">Relaxing ocean sounds</p>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={toggleMusic}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isPlaying
                    ? 'bg-drift-blue/30 text-white border border-drift-blue/50'
                    : 'bg-white/20 text-white/80 hover:bg-white/30 border border-white/30'
                }`}
              >
                {isPlaying ? 'Pause Waves' : 'Play Waves'}
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
                     step="0.1"
                     value={currentVolume}
                     onChange={handleVolumeChange}
                     className="flex-1 h-2 appearance-none cursor-pointer music-slider"
                   />
                  <Volume2 className="h-4 w-4 text-white/60" />
                </div>
              </div>

              {/* Info */}
              <div className="text-center pt-2 border-t border-white/20">
                <p className="text-white/50 text-xs">
                  Gentle waves to enhance focus
                </p>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default BackgroundMusic; 